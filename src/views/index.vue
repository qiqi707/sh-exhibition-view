<template>
  <div class="container">
    <box-component></box-component>
  </div>
</template>

<script>
import boxComponent from './component/index.vue'
export default {
  name: 'Home',
  components: { boxComponent },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
