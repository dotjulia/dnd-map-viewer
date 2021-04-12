<template>
    <canvas class="canvas-renderer" ref="canvas">
    </canvas>
</template>

<script>
export default {
  name: 'CanvasRenderer',
  props: {
      players: Array,
      backgroundImage: String,
      backgroundImageSize: Number,
  },
  data() {
      return {
          canvasCTX: null,
          draggingPlayer: null,
          loadedImage: null,
      };
  },
  methods: {
      renderBackground() {
          return new Promise((res, rej) => {
            if(!this.loadedImage || this.loadedImage.src != this.backgroundImage) {
                const im = new Image();
                im.onload = () => {
                    const cH = this.backgroundImageSize;
                    const aspectRatio = im.width / im.height;
                    this.canvasCTX.drawImage(im, 0, 0, im.width, im.height, 0, 0, cH * aspectRatio, cH);
                    this.loadedImage = im;
                    res();
                };
                im.src = this.backgroundImage;
            } else {
                const cH = this.backgroundImageSize;
                const aspectRatio = this.loadedImage.width / this.loadedImage.height;
                this.canvasCTX.drawImage(this.loadedImage, 0, 0, this.loadedImage.width, this.loadedImage.height, 0, 0, cH * aspectRatio, cH);
                res();
                return;
            }
          });
      },
      renderPlayers() {
          for(const player of this.players) {
              if(player.x == undefined || player.y == undefined) {
                  player.x = 0;
                  player.y = 0;
              }
              this.canvasCTX.beginPath();
              this.canvasCTX.arc(player.x, player.y, player.size/2, 0, 2 * Math.PI, false);
              this.canvasCTX.fillStyle = player.backgroundColor;
              this.canvasCTX.fill();
              this.canvasCTX.fillStyle = player.foregroundColor;
              this.canvasCTX.font = `${player.size*0.8}px sans-serif`;
              this.canvasCTX.fillText(player.content, player.x-player.size/4, player.y+player.size/4);
          }
      },
      async rerender() {
        this.$refs.canvas.width=window.innerWidth;
        this.$refs.canvas.height=window.innerHeight;
        await this.renderBackground();
        this.renderPlayers();
      },
      windowSizeChanged() {
          this.rerender();
      },
      isInPlayer(x, y) {
          for(const player of this.players) {
              const deltaX = player.x - x;
              const deltaY = player.y - y;
              if(Math.abs(deltaX) < player.size/2 && Math.abs(deltaY) < player.size/2) {
                  return player;
              }
          }
          return false;
      },
      mouseDown(event) {
          const player = this.isInPlayer(event.clientX, event.clientY);
          if(player) {
              this.draggingPlayer = player;
          }
      },
      mouseMove(event) {
        if(this.draggingPlayer) {
            this.draggingPlayer.x = event.clientX;
            this.draggingPlayer.y = event.clientY;
            this.rerender();
        }
      },
      mouseUp(event) {
          this.draggingPlayer = null;
          this.rerender();
      }
  },
  watch: {
      backgroundImage (newVal, oldVal) {
          this.rerender();
      },
      players: {
          deep: true,
          handler() {
            this.rerender();
          }
      },
      backgroundImageSize() {
          this.rerender();
      },
  },
  mounted() {
      this.canvasCTX = this.$refs.canvas.getContext('2d');
      window.addEventListener("resize", this.windowSizeChanged);
      this.$refs.canvas.addEventListener('mousedown', this.mouseDown);
      this.$refs.canvas.addEventListener('mouseup', this.mouseUp);
      this.$refs.canvas.addEventListener('mousemove', this.mouseMove);
      this.rerender();
  },
  destroyed() {
      window.removeEventListener("resize", this.windowSizeChanged);
      this.$refs.canvas.removeEventListener('mousedown', this.mouseDown);
      this.$refs.canvas.removeEventListener('mouseup', this.mouseUp);
      this.$refs.canvas.removeEventListener('mousemove', this.mouseMove);
  },
}
</script>

<style scoped>
.canvas-renderer  {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left:0;
    z-index: -100;
    top:0;
}
</style>