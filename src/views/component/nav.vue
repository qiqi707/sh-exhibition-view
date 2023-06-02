<template>
  <div class="plane">
    <div class="computed" :style="{ top: topPosition + 'px' }">
      <div class="menuList">
        <div
          class="bottomBg"
          :class="{ cur: currentPage === item.module }"
          v-for="(item, index) in dataList"
          :key="item.id"
          @click="goRoom(item, index)"
        >
          <div class="menuItem">
            <img class="pic" :src="require(`../../assets/image/home/${item.imgUrl}.png`)" />
          </div>
          <div class="title">{{ item.module }}</div>
        </div>
      </div>
      <div class="computedTitle">
        <img src="../../assets/image/home/computed-title.png" alt="" />
      </div>
    </div>
    <div class="doll" @click="topPosition = topPosition === '434' ? '0' : '434'">&nbsp;</div>
    <!--可拖拽的但有bug-->
    <!--    <div id="boxer" class="doll_box" @mouseup="stopMove">-->
    <!--      <div ref="slider" @mousedown="move" @mousemove="onMouseMove">-->
    <!--        <div class="doll">&nbsp;</div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="messageModal" v-if="showMessage">
      <div class="close" @click="closeMessageModal(false, '35')">
        <img src="../../assets/image/home/close.png" alt="" />
      </div>
      <span>大家好，我是申铁小宝，点击本宝，可以关闭开启左侧场景选择。</span>
      <span>本馆共分8个小馆，点击左侧电脑上模块可快速进入相对应场馆。</span>
    </div>
    <div
      class="messageTip"
      @click="closeMessageModal(true, '-50')"
      :style="{ right: rightPosition + 'px' }"
    >
      <img src="../../assets/image/home/message.png" alt="" />
    </div>
  </div>
</template>

<script>
import { dataList } from '@/views/component/index'
export default {
  name: 'T-nav',
  data() {
    return {
      dataList,
      topPosition: '0',
      rightPosition: '-50',
      showMessage: true,
      currentPage: '前言',
      startPoint: 0,
      isDown: false,
      premitiveX: 0
    }
  },
  methods: {
    closeMessageModal(isShow, num) {
      this.showMessage = Boolean(isShow)
      this.rightPosition = num
    },
    goRoom(item, index) {
      if (item.module === this.currentPage) {
        return
      }
      this.$emit('change', item, index)
      this.currentPage = item.module
    },
    move(e) {
      this.isDown = true
      const style = window.getComputedStyle(this.$refs.slider)
      const { transform } = style
      if (transform !== 'none') {
        const matrixArr = transform.replace(/[^0-9\-,]/g, '').split(',')
        this.premitiveX = parseInt(matrixArr[4])
      } else {
        this.premitiveX = 0
      }
      const { clientX } = e
      this.startPoint = clientX
    },
    stopMove() {
      this.isDown = false
    },
    onMouseMove(e) {
      if (!this.isDown) return
      const { clientX } = e
      const moveDistance = clientX - this.startPoint
      const offset = this.premitiveX + moveDistance
      this.$refs.slider.style.transform = `translateX(${offset}px)`
    }
  }
}
</script>

<style lang="scss" scoped>
.plane {
  position: relative;
  top: -434px;
  left: 0;
  .computed {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    width: 544px;
    height: 434px;
    background: url('../../assets/image/home/computed.png');
    background-size: 100%;
    box-sizing: border-box;
    transition: all 0.8s;
    user-select: none;
    .menuList {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      padding-top: 20px;
      .bottomBg {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 106px;
        height: 106px;
        font-size: 11px;
        background: url('../../assets/image/home/logo-bg.png') no-repeat center;
        background-size: cover;
        transition: all 1s;
        &.cur {
          background: url('../../assets/image/home/logo-bg_on.png') no-repeat center;
          background-size: cover;
          .menuItem:hover {
            transform: scale(1);
          }
        }
        .menuItem {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 57px;
          height: 57px;
          background: url('../../assets/image/home/logo-round.png') no-repeat center;
          background-size: cover;
          cursor: pointer;
          transition: all 0.5s;
          &:hover {
            transform: scale(1.1);
          }
          .pic {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
    .computedTitle {
      //position: absolute;
      width: 385px;
      height: 40px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .doll_box {
    position: fixed;
    bottom: 0;
    right: 575px;
    width: 120px;
    height: 215px;
    cursor: pointer;
    user-select: none;
    .doll {
      width: 120px;
      height: 215px;
      background: url('../../assets/image/home/doll.png') no-repeat center;
      background-size: cover;
    }
  }
  .doll {
    position: fixed;
    bottom: 0;
    left: calc(50% + 240px);
    width: 120px;
    height: 215px;
    background: url('../../assets/image/home/doll.png') no-repeat center;
    background-size: cover;
    cursor: pointer;
    user-select: none;
  }
  .messageModal {
    position: fixed;
    bottom: 80px;
    left: calc(50% + 380px);
    width: 300px;
    height: 100px;
    padding: 25px 15px;
    background: rgba(255, 255, 255, 0.64);
    border: 4px solid #2b5fcc;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
    span {
      display: inline-block;
      text-indent: 2em;
    }
    .close {
      position: absolute;
      top: 0;
      right: 2px;
      width: 28px;
      height: 28px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .messageTip {
    position: fixed;
    bottom: 62px;
    width: 50px;
    height: 50px;
    transition: all 1s;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
