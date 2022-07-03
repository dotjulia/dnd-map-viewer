<template>
  <div id="app">
    <settings
      @changedbackground="backgroundSizeChanged($event)"
      :backgroundSize="backgroundImageSize"
      :players="players"
      :enemies="enemies"
      @rerender="rerender()"
      @newbackground="setBackground($event)"
      @deleteplayer="deletePlayer($event)"
      @deleteenemy="deleteEnemy($event)"
      @addplayer="addPlayer()"
      @addenemy="addEnemy()"
      @changeenemies="enemies = $event"
      @changeplayers="players = $event"
      @debugobstacle="debugObstacles()"
      @lineofsightchange="lineOfSightChange($event)"
    />
    <canvas-renderer
      :backgroundImageSize="backgroundImageSize"
      :players="players"
      :enemies="enemies"
      :backgroundImage="imageData"
      :lineOfSight="lineOfSight"
      :lineOfSightEnabled="lineOfSightEnabled"
      ref="canvasrenderer"
    />
    <!--<div id="movables" style="position: absolute;">
      <movable-entity v-for="player in players" :key="player.id" :width="player.size" :height="player.size" :backgroundColor="player.backgroundColor" :foregroundColor="player.foregroundColor" :content="player.content"/>
    </div>
    <background :backgroundImage="imageData"/>-->
  </div>
</template>

<script>
import CanvasRenderer from "./components/CanvasRenderer.vue";
import Settings from "./components/Settings.vue";

export default {
  name: "app",
  components: {
    Settings,
    CanvasRenderer,
  },
  methods: {
    debugObstacles() {
      this.$refs.canvasrenderer.debugRenderObstacles();
    },
    backgroundSizeChanged(e) {
      this.backgroundImageSize = +e;
    },
    rerender() {
      this.$refs.canvasrenderer.rerender();
    },
    lineOfSightChange(e) {
      this.lineOfSightEnabled = e;
    },
    setBackground(bg) {
      if (bg.name.includes("vtt")) {
        const data = JSON.parse(atob(bg.result.split("base64,")[1]));
        this.imageData = "data:image/png;base64," + data.image;
        const mapSize = data.resolution.map_size;
        for (let obstacle of data.line_of_sight) {
          obstacle[0].x = obstacle[0].x / mapSize.x;
          obstacle[0].y = obstacle[0].y / mapSize.y;
          obstacle[1].x = obstacle[1].x / mapSize.x;
          obstacle[1].y = obstacle[1].y / mapSize.y;
        }
        this.lineOfSight = data.line_of_sight;
      } else {
        this.imageData = bg.result;
      }
    },
    addPlayer() {
      this.players.push({
        id:
          this.players.reduce(
            (m, v) => (m < v.id ? v.id : m),
            this.players[0].id
          ) + 1,
        backgroundColor: this.players[0].backgroundColor,
        foregroundColor: this.players[0].foregroundColor,
        content: this.players[0].content,
        size: this.players[0].size,
      });
    },
    addEnemy() {
      this.enemies.push({
        id:
          this.enemies.reduce(
            (m, v) => (m < v.id ? v.id : m),
            this.enemies[0].id
          ) + 1,
        backgroundColor: this.enemies[0].backgroundColor,
        foregroundColor: this.enemies[0].foregroundColor,
        content: this.enemies[0].content,
        size: this.enemies[0].size,
      });
    },
    deleteEnemy(id) {
      this.enemies = this.enemies.filter((e) => e.id != id);
    },
    deletePlayer(id) {
      this.players = this.players.filter((p) => p.id != id);
    },
  },
  data() {
    return {
      lineOfSightEnabled: false,
      backgroundImageSize: 800,
      imageData: "https://i.redd.it/oteavhdmcnl61.jpg",
      lineOfSight: [],
      enemies: [
        {
          id: 0,
          backgroundColor: "#00ff00",
          foregroundColor: "#ffffff",
          content: "E",
          x: 100,
          y: 100,
          size: 25,
        },
      ],
      players: [
        {
          id: 0,
          backgroundColor: "#ff0000",
          foregroundColor: "#ffffff",
          content: "P",
          x: 50,
          y: 100,
          size: 25,
        },
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #424242;
  z-index: -200;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>
