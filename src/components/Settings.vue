<template>
<div ref="parentEl" style="position: absolute;" width="30%">
        <movable target="parentEl" style="z-index: 10;height:70px;width:100%;">
        </movable>
    <v-card dark width="100%" class="settings" ref="settings">
        <v-card-title>
            Settings
            </v-card-title>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    Players
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                <th class="text-left">#</th>
                                <th class="text-left">
                                    Content
                                </th>
                                <th class="text-left">
                                    Background Color
                                </th>
                                <th class="text-left">
                                    Foreground Color
                                </th>
                                <th class="text-left">
                                    Size
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <player-display v-for="player in players" :key="player.id" :player="player" @deleteplayer="deletePlayer($event)"/>
                            </tbody>
                        </template>>
                    </v-simple-table>
                    <v-btn style="align-items: left;" @click="$emit('addplayer')"> + Add</v-btn>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    Background
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <label class="v-btn v-btn--is-elevated v-btn--has-bg theme--dark v-size--default">
                        <input type="file" @input="onSelectFile" ref="fileInput" style="display:none"/>
                        Select Background
                    </label>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
    </div>
</template>

<script>
import PlayerDisplay from './PlayerDisplay.vue'
export default {
  components: { PlayerDisplay },
  name: 'Settings',
  props: {
      players: Array,
  },
  data() {
      return {
      };
  },
  methods: {
      deletePlayer(id) {
          this.$emit('deleteplayer', id);
      },
      onSelectFile() {
          const input = this.$refs.fileInput;
          const files = input.files;
          if(files && files[0]) {
              const reader = new FileReader();
              reader.onload = e => {
                  this.$emit('newbackground', e.target.result);
              }
              reader.readAsDataURL(files[0]);
          }else {
              console.log('no image selected');
          }
      }
  },
}
</script>

<style scoped>
.settings {
    position: relative;
    width: 100%;
}
</style>