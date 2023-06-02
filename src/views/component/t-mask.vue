<template>
  <div class="mask" v-if="showLoading" :class="animation ? 'open': 'close'">
    载入中...
  </div>
</template>

<script>
export default {
  name: "t-mask",
  data() {
    return {
      showLoading: false,
      animation: false
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #ffffff;
  //&.open {
  //  animation: anim-open 1s;
  //}
  //&.close {
  //  animation: anim-close 1s;
  //}
}
@keyframes anim-open {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes anim-close {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0.6;
  }
}
</style>
