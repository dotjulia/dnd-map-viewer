<template>
  <canvas class="canvas-renderer" ref="canvas"> </canvas>
</template>

<script>
export default {
  name: "CanvasRenderer",
  props: {
    players: Array,
    enemies: Array,
    backgroundImage: String,
    backgroundImageSize: Number,
    lineOfSight: Array,
    lineOfSightEnabled: Boolean,
  },
  data() {
    return {
      canvasCTX: null,
      draggingPlayer: null,
      loadedImage: null,
      onCanvasImageDimensions: { x: 0, y: 0 },
    };
  },
  methods: {
    renderBackground() {
      return new Promise((res, rej) => {
        if (!this.loadedImage || this.loadedImage.src != this.backgroundImage) {
          const im = new Image();
          im.onload = () => {
            const cH = this.backgroundImageSize;
            const aspectRatio = im.width / im.height;
            this.canvasCTX.drawImage(
              im,
              0,
              0,
              im.width,
              im.height,
              0,
              0,
              cH * aspectRatio,
              cH
            );
            this.onCanvasImageDimensions = { x: cH * aspectRatio, y: cH };
            this.loadedImage = im;
            res();
          };
          im.src = this.backgroundImage;
        } else {
          const cH = this.backgroundImageSize;
          const aspectRatio = this.loadedImage.width / this.loadedImage.height;
          this.canvasCTX.drawImage(
            this.loadedImage,
            0,
            0,
            this.loadedImage.width,
            this.loadedImage.height,
            0,
            0,
            cH * aspectRatio,
            cH
          );
          res();
          return;
        }
      });
    },
    renderPlayers() {
      for (const player of this.players) {
        if (player.x == undefined || player.y == undefined) {
          player.x = 0;
          player.y = 0;
        }
        this.canvasCTX.beginPath();
        this.canvasCTX.arc(
          player.x,
          player.y,
          player.size / 2,
          0,
          2 * Math.PI,
          false
        );
        this.canvasCTX.fillStyle = player.backgroundColor;
        this.canvasCTX.fill();
        this.canvasCTX.fillStyle = player.foregroundColor;
        this.canvasCTX.font = `${player.size * 0.8}px sans-serif`;
        this.canvasCTX.fillText(
          player.content,
          player.x - player.size / 4,
          player.y + player.size / 4
        );
      }
    },
    renderEnemies() {
      for (const enemy of this.enemies) {
        if (enemy.x == undefined || enemy.y == undefined) {
          enemy.x = 0;
          enemy.y = 0;
        }
        this.canvasCTX.beginPath();
        this.canvasCTX.arc(
          enemy.x,
          enemy.y,
          enemy.size / 2,
          0,
          2 * Math.PI,
          false
        );
        this.canvasCTX.fillStyle = enemy.backgroundColor;
        this.canvasCTX.fill();
        this.canvasCTX.fillStyle = enemy.foregroundColor;
        this.canvasCTX.font = `${enemy.size * 0.8}px sans-serif`;
        this.canvasCTX.fillText(
          enemy.content,
          enemy.x - enemy.size / 4,
          enemy.y + enemy.size / 4
        );
      }
    },
    normalizedXToCanvas(x) {
      return x * this.onCanvasImageDimensions.x;
    },
    normalizedYToCanvas(y) {
      return y * this.onCanvasImageDimensions.y;
    },
    getNormalizedPlayerCoords() {
      const coords = [];
      for (const player of this.players) {
        coords.push({
          x: player.x / this.onCanvasImageDimensions.x,
          y: player.y / this.onCanvasImageDimensions.y,
        });
      }
      return coords;
    },
    getIntersection(origin, direction, point1, point2) {
      const v1 = { x: origin.x - point1.x, y: origin.y - point1.y };
      const v2 = { x: point2.x - point1.x, y: point2.y - point1.y };
      const v3 = { x: -direction.y, y: direction.x };
      const dot = v2.x * v3.x + v2.y * v3.y;
      if (Math.abs(dot) < 0.000001) {
        return null;
      }
      const t1 = (v2.x * v1.y - v2.y * v1.x) / dot;
      const t2 = (v1.x * v3.x + v1.y * v3.y) / dot;
      if (t1 >= 0.0 && t2 >= 0.0 && t2 <= 1.0) return t1;
      return null;
    },
    castRay(origin, direction) {
      let smallestIntersection = Infinity;
      for (const lineSegment of this.lineOfSight) {
        const intersection = this.getIntersection(
          origin,
          direction,
          lineSegment[0],
          lineSegment[1]
        );
        if (intersection && intersection < smallestIntersection) {
          smallestIntersection = intersection;
        }
      }
      return {
        x: origin.x + direction.x * smallestIntersection,
        y: origin.y + direction.y * smallestIntersection,
      };
    },
    debugRenderObstacles() {
      for (const obstacle of this.lineOfSight) {
        this.canvasCTX.beginPath();
        this.canvasCTX.strokeStyle = "red";
        this.canvasCTX.rect(
          this.normalizedXToCanvas(obstacle[0].x),
          this.normalizedYToCanvas(obstacle[0].y),
          this.normalizedXToCanvas(obstacle[1].x - obstacle[0].x),
          this.normalizedYToCanvas(obstacle[1].y - obstacle[0].y)
        );
        this.canvasCTX.stroke();
      }
    },
    renderObstacles(ctx) {
      const normalizedPlayerCoords = this.getNormalizedPlayerCoords();
      const amountOfLines = 500;
      for (const player of normalizedPlayerCoords) {
        const rays = [];
        for (let i = 0; i <= Math.PI * 2; i += (Math.PI * 2) / amountOfLines) {
          const rotVec = { x: Math.cos(i), y: Math.sin(i) };
          let hitPoint = this.castRay(player, rotVec);
          if (!isFinite(hitPoint.x)) {
            hitPoint = {
              x: player.x + rotVec.x,
              y: player.y + rotVec.y,
            };
          }
          rays.push({ hitPoint, origin: player });
        }
        for (let i = 0; i < rays.length; i++) {
          const hit = rays[i];
          const prevHit = rays[(i + 1) % rays.length];
          ctx.beginPath();
          ctx.moveTo(
            this.normalizedXToCanvas(hit.origin.x),
            this.normalizedYToCanvas(hit.origin.y)
          );
          ctx.lineTo(
            this.normalizedXToCanvas(hit.hitPoint.x),
            this.normalizedYToCanvas(hit.hitPoint.y)
          );
          ctx.lineTo(
            this.normalizedXToCanvas(prevHit.hitPoint.x),
            this.normalizedYToCanvas(prevHit.hitPoint.y)
          );
          ctx.closePath();
          ctx.fillStyle = "#000000";
          ctx.strokeStyle = "#000000";
          ctx.stroke();
          ctx.fill();
        }
      }
    },
    setPixelsOfColorToTransparent(canvas, r, g, b, tolerance) {
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (
          Math.abs(data[i] - r) < tolerance &&
          Math.abs(data[i + 1] - g) < tolerance &&
          Math.abs(data[i + 2] - b) < tolerance
        ) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    },
    async rerender() {
      this.$refs.canvas.width = window.innerWidth;
      this.$refs.canvas.height = window.innerHeight;
      await this.renderBackground();
      this.renderEnemies();
      this.renderPlayers();
      if (this.lineOfSightEnabled) {
        const buffer = document.createElement("canvas");
        buffer.width = this.onCanvasImageDimensions.x;
        buffer.height = this.onCanvasImageDimensions.y;
        const bufferCTX = buffer.getContext("2d");
        bufferCTX.fillStyle = "#333333";
        bufferCTX.fillRect(0, 0, buffer.width, buffer.height);
        this.renderObstacles(bufferCTX);
        this.setPixelsOfColorToTransparent(buffer, 0, 0, 0, 30);
        this.canvasCTX.drawImage(buffer, 0, 0);
      }
    },
    windowSizeChanged() {
      this.rerender();
    },
    isInObjectArray(x, y, players) {
      for (const player of players) {
        const deltaX = player.x - x;
        const deltaY = player.y - y;
        if (
          Math.abs(deltaX) < player.size / 2 &&
          Math.abs(deltaY) < player.size / 2
        ) {
          return player;
        }
      }
      return false;
    },
    mouseDown(event) {
      const player = this.isInObjectArray(
        event.clientX,
        event.clientY,
        this.players
      );
      const enemy = this.isInObjectArray(
        event.clientX,
        event.clientY,
        this.enemies
      );
      if (player) {
        this.draggingPlayer = player;
      }
      if (enemy) {
        this.draggingPlayer = enemy;
      }
    },
    mouseMove(event) {
      if (this.draggingPlayer) {
        this.draggingPlayer.x = event.clientX;
        this.draggingPlayer.y = event.clientY;
        this.rerender();
      }
    },
    mouseUp(event) {
      this.draggingPlayer = null;
      this.rerender();
    },
  },
  watch: {
    backgroundImage(newVal, oldVal) {
      this.rerender();
    },
    players: {
      deep: true,
      handler() {
        this.rerender();
      },
    },
    backgroundImageSize() {
      this.rerender();
    },
    lineOfSightEnabled() {
      this.rerender();
    },
  },
  mounted() {
    this.canvasCTX = this.$refs.canvas.getContext("2d");
    window.addEventListener("resize", this.windowSizeChanged);
    this.$refs.canvas.addEventListener("mousedown", this.mouseDown);
    this.$refs.canvas.addEventListener("mouseup", this.mouseUp);
    this.$refs.canvas.addEventListener("mousemove", this.mouseMove);
    this.rerender();
  },
  destroyed() {
    window.removeEventListener("resize", this.windowSizeChanged);
    this.$refs.canvas.removeEventListener("mousedown", this.mouseDown);
    this.$refs.canvas.removeEventListener("mouseup", this.mouseUp);
    this.$refs.canvas.removeEventListener("mousemove", this.mouseMove);
  },
};
</script>

<style scoped>
.canvas-renderer {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  z-index: -100;
  top: 0;
}
</style>