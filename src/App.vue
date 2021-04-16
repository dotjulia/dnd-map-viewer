<template>
  <div id="app">
    <settings @changedbackground="backgroundSizeChanged($event)" :backgroundSize="backgroundImageSize" :players="players" @rerender="rerender()" @newbackground="setBackground($event)" @deleteplayer="deletePlayer($event)" @addplayer="addPlayer()"/>
    <canvas-renderer :backgroundImageSize="backgroundImageSize" :players="players" :backgroundImage="imageData" ref="canvasrenderer"/>
    <!--<div id="movables" style="position: absolute;">
      <movable-entity v-for="player in players" :key="player.id" :width="player.size" :height="player.size" :backgroundColor="player.backgroundColor" :foregroundColor="player.foregroundColor" :content="player.content"/>
    </div>
    <background :backgroundImage="imageData"/>-->
  </div>
</template>

<script>
import Background from './components/Background.vue'
import CanvasRenderer from './components/CanvasRenderer.vue'
import MovableEntity from './components/MovableEntity.vue'
import Settings from './components/Settings.vue'

export default {
  name: 'app',
  components: {
    MovableEntity,
    Background,
    Settings,
    CanvasRenderer,
  },
  methods: {
    backgroundSizeChanged(e) {

      this.backgroundImageSize = +e;
    },
    rerender() {
      this.$refs.canvasrenderer.rerender();
    },
    setBackground(bg) {
      this.imageData = bg;
    },
    addPlayer() {
      this.players.push({
        id: this.players.reduce((m, v) => m < v.id ? v.id : m, this.players[0].id) + 1,
        backgroundColor: this.players[0].backgroundColor,
        foregroundColor: this.players[0].foregroundColor,
        content: this.players[0].content,
        size: this.players[0].size,
      });
    },
    deletePlayer(id) {
      this.players = this.players.filter(p => p.id != id);
    }
  },
  data() {
    return {
      backgroundImageSize: 800,
      imageData: 'https://i.redd.it/oteavhdmcnl61.jpg',
      players: [
        {
          id: 0,
          backgroundColor: '#ff0000',
          foregroundColor: '#ffffff',
          content: 'P',
          size: 25,
        },
      ],
    };
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
