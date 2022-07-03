<template>
  <div>
    <v-btn
      v-if="isCollapsed"
      @click="close()"
      style="right: 0; position: absolute"
      >Open</v-btn
    >
    <div
      ref="parentEl"
      style="position: absolute"
      width="30%"
      v-if="!isCollapsed"
    >
      <movable target="parentEl" style="z-index: 10; height: 70px; width: 100%">
      </movable>
      <v-card dark width="100%" class="settings" ref="settings">
        <v-card-title>
          <span>Settings</span>
        </v-card-title>
        <v-list-item>
          <v-list-item-content>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header> Players </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">#</th>
                          <th class="text-left">Content</th>
                          <th class="text-left">Background Color</th>
                          <th class="text-left">Foreground Color</th>
                          <th class="text-left">Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        <player-display
                          v-for="player in players"
                          :key="player.id"
                          :player="player"
                          @deleteplayer="deletePlayer($event)"
                        />
                      </tbody>
                    </template>
                  </v-simple-table>
                  <v-checkbox
                    label="Line of sight"
                    @change="lineOfSightCheckboxChanged"
                  ></v-checkbox>
                  <v-btn style="align-items: left" @click="$emit('addplayer')">
                    + Add</v-btn
                  >
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header> Enemies </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">#</th>
                          <th class="text-left">Content</th>
                          <th class="text-left">Background Color</th>
                          <th class="text-left">Foreground Color</th>
                          <th class="text-left">Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        <player-display
                          v-for="enemy in enemies"
                          :key="enemy.id"
                          :player="enemy"
                          @deleteplayer="deleteEnemy($event)"
                        />
                      </tbody>
                    </template>
                  </v-simple-table>
                  <v-btn style="align-items: left" @click="$emit('addenemy')">
                    + Add</v-btn
                  >
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Save/Load Positions
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-btn @click="save">Save</v-btn>
                  <label
                    class="
                      v-btn v-btn--is-elevated v-btn--has-bg
                      theme--dark
                      v-size--default
                    "
                    style="
                      margin-top: auto;
                      margin-bottom: auto;
                      margin-right: 20px;
                    "
                  >
                    <input
                      type="file"
                      @input="onSelectScene"
                      ref="sceneUpload"
                      style="display: none"
                    />
                    Load (.json)
                  </label>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Background
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="flexbox">
                    <label
                      class="
                        v-btn v-btn--is-elevated v-btn--has-bg
                        theme--dark
                        v-size--default
                      "
                      style="
                        margin-top: auto;
                        margin-bottom: auto;
                        margin-right: 20px;
                      "
                    >
                      <input
                        type="file"
                        @input="onSelectFile"
                        ref="fileInput"
                        style="display: none"
                      />
                      Select Background (png jpg dd2vtt)
                    </label>
                    <v-text-field
                      @change="$emit('changedbackground', size)"
                      class="background-size-input"
                      solo
                      append-icon="mdi-image-size-select-large"
                      v-model="size"
                    ></v-text-field>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header> Debug </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-btn @click="$emit('rerender')">Rerender</v-btn>
                  <v-btn @click="$emit('debugobstacle')"
                    >Render Obstacles</v-btn
                  >
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item-content>
        </v-list-item>
        <v-card-actions>
          <v-btn color="orange lighten-2" @click="close()"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import PlayerDisplay from "./PlayerDisplay.vue";

export default {
  components: { PlayerDisplay },
  name: "Settings",
  props: {
    players: Array,
    enemies: Array,
    backgroundSize: Number,
  },
  data() {
    return {
      size: 400,
      isCollapsed: false,
    };
  },
  mounted() {
    this.size = this.backgroundSize;
  },
  methods: {
    close() {
      this.isCollapsed = !this.isCollapsed;
    },
    save() {
      const data = JSON.stringify({
        players: this.players,
        enemies: this.enemies,
        backgroundSize: this.backgroundSize,
      });
      const downloadData =
        "data:text/json;charset=utf-8," + encodeURIComponent(data);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.style.display = "none";
      downloadAnchor.setAttribute("href", downloadData);
      downloadAnchor.setAttribute("download", "scene.json");
      downloadAnchor.click();
      console.log(data);
    },
    deletePlayer(id) {
      this.$emit("deleteplayer", id);
    },
    deleteEnemy(id) {
      this.$emit("deleteenemy", id);
    },
    lineOfSightCheckboxChanged(e) {
      this.$emit("lineofsightchange", e);
    },
    onSelectFile() {
      const input = this.$refs.fileInput;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.$emit("newbackground", {
            result: e.target.result,
            name: files[0].name,
          });
        };
        reader.readAsDataURL(files[0]);
      } else {
        console.log("no image selected");
      }
    },
    onSelectScene() {
      const input = this.$refs.sceneUpload;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = JSON.parse(atob(e.target.result.split("base64,")[1]));
          console.log(data);
          this.$emit("changedbackground", data.backgroundSize);
          this.$emit("changeenemies", data.enemies);
          this.$emit("changeplayers", data.players);
        };
        reader.readAsDataURL(files[0]);
      } else {
        console.log("no scene selected");
      }
    },
  },
};
</script>

<style scoped>
.settings {
  position: relative;
  width: 100%;
}
.flexbox {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: stretch;
}
.background-size-input {
  margin-top: auto;
  margin-bottom: auto;
  height: 50px;
}
</style>
