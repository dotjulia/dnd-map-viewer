<template>
    <div class="background" :style="`background-image: url(${backgroundImage});`">
    </div>
</template>

<script>
export default {
  name: 'Background',
  props: {
      backgroundImage: String,
  }
}
</script>

<style scoped>
.background {
    top: 0;
    height: 100vh;
    width: 100vw;
    background-size: contain;
    position: absolute;
    z-index: -100;
}
</style>