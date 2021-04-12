<template>
    <tr>
        <td>{{player.id}}</td>
        <td><input type="text" solo v-model="player.content"></td>
        <td>
            <input type="text" solo v-model="player.backgroundColor">
        </td>
        <td><input type="text" solo v-model="player.foregroundColor"></td>
        <td><input type="text" solo v-model="player.size"></td>
        <v-btn icon color="pink" @click.native="deletePlayer()">
            <v-icon>mdi-delete</v-icon>
        </v-btn>
    </tr>
</template>

<script>
export default {
  name: 'PlayerDisplay',
  props: {
      player: Object,
  },
  data() {
      return {
      };
  },
  methods: {
      deletePlayer() {
          this.$emit('deleteplayer', this.player.id);
      }
  },
}
</script>

<style scoped>
input {
    color: white;
    width: 50%;
}
</style>