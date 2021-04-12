<template>
    <movable>
        <div class="circle" :style="`width: ${width}px; height: ${height}px; background-color: ${backgroundColor}; color: ${foregroundColor}`">{{content}}</div>
    </movable>
</template>

<script>
export default {
  name: 'MovableEntity',
  props: {
      width: Number,
      height: Number,
      backgroundColor: String,
      foregroundColor: String,
      content: String,
  }
}
</script>

<style scoped>
.circle {
    border-radius: 50%;
}
</style>