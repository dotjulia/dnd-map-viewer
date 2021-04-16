<template>
    <tr>
        <td>{{player.id}}</td>
        <td><input type="text" solo v-model="player.content"></td>
        <td>
            <v-swatches class="swatch" background-color="#212121" solo v-model="player.backgroundColor"></v-swatches>
        </td>
        <td>
            <v-swatches class="swatch" background-color="#212121" solo v-model="player.foregroundColor"></v-swatches>
            <!--<input type="color" solo v-model="player.foregroundColor"/>-->
        </td>
        <td><input type="text" solo v-model="player.size"></td>
        <v-btn icon color="pink" @click.native="deletePlayer()">
            <v-icon>mdi-delete</v-icon>
        </v-btn>
    </tr>
</template>

<script>
import VSwatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.css'

export default {
    components: {VSwatches},
    name: 'PlayerDisplay',
    mounted() {
        console.log(this.$vuetify.theme.themes.dark);
    },
    props: {
        player: Object,
        data() {
            return {};
        },
        methods: {
            deletePlayer() {
                this.$emit('deleteplayer', this.player.id);
            }
        },
    }
}
</script>

<style scoped>
tr {
    max-height: 100px;
}

input {
    color: white;
    width: 50%;
    text-align: center;
}

.swatch >>> .vue-swatches__container {
    position: fixed;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%);
 }

 
.swatch >>> .vue-swatches__trigger__wrapper {
    margin-top: 5px;
 }
</style>
