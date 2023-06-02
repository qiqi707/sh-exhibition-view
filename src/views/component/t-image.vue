<template>
  <div class="mask" v-if="showModal">
    <template v-if="dataList.length > 0">
      <div class="title">{{ dataList[currentIndex].realName }}</div>
      <div class="img-box">
        <template v-if="showType === 'img'">
          <img :src="dataList[currentIndex].filePath" alt="" />
        </template>
        <template v-else>
          <!--        <video ref="video" width="100%" autoplay muted loop :src="dataList[currentIndex].filePath">-->
          <!--          对不起，您的浏览器不支持播放视频！-->
          <!--        </video>-->
          <video ref="video" width="100%" controls :src="dataList[currentIndex].filePath">
            对不起，您的浏览器不支持播放视频！
          </video>
        </template>
      </div>
    </template>
    <template v-else>
      <!--静态-->
      <!--      <div class="title">未上传</div>-->
      <!--      <div class="img-box">-->
      <!--        请上传图片...-->
      <!--      </div>-->
      <div class="title">{{ imgList1[currentIndex].name }}</div>
      <div class="img-box">
        <img :src="getUrl(imgList1[currentIndex].url)" alt="" />
      </div>
    </template>
    <div class="btn">
      <template v-if="dataList.length > 1">
        <div class="arrow prev" @click="changePage('prev')">
          <img src="../../assets/image/prev.png" alt="" />
        </div>
        <div class="arrow next" @click="changePage('next')">
          <img src="../../assets/image/next.png" alt="" />
        </div>
      </template>
      <div class="close" @click="showModal = false">
        <img src="../../assets/image/close.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import common from '../../api/index.js'
export default {
  name: 't-image',
  data() {
    return {
      showModal: false,
      showType: 'img',
      dataList: [],
      imgList1: [
        {
          name: '经典啊',
          url: 'test'
        },
        {
          name: '经典啊2df',
          url: 'test1'
        }
      ],
      currentIndex: 0
    }
  },
  methods: {
    getUrl(item) {
      return require(`../../assets/image/test/${item}.jpg`)
    },
    async getImgList(content) {
      this.currentIndex = 0
      this.dataList = []
      // const res = await common.getImgUrl({
      //   type: content.key
      // })
      // if (res.success) {
      //   if (content.type === 'video') {
      //     this.dataList = res.result.videoList
      //   } else {
      //     this.dataList = res.result.imgList
      //   }
      //   this.showType = content.type
      //   this.showModal = true
      // }
      this.showType = 'img'
      this.showModal = true
    },
    changePage(type) {
      if (type === 'next') {
        if (this.currentIndex < this.dataList.length - 1) {
          this.currentIndex++
        } else {
          this.currentIndex = 0
        }
      } else {
        if (this.currentIndex > 0) {
          this.currentIndex--
        } else {
          this.currentIndex = this.dataList.length - 1
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .title {
    margin-bottom: 30px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 40px;
  }
  .btn {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    img {
      width: 100%;
      height: 100%;
    }
    .arrow {
      width: 55px;
      height: 55px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      &.prev {
        left: 40px;
      }
      &.next {
        right: 40px;
      }
    }
    .close {
      position: absolute;
      width: 55px;
      height: 55px;
      top: 40px;
      right: 40px;
      cursor: pointer;
    }
  }
  .img-box {
    position: relative;
    width: 1200px;
    height: 680px;
    background: #ffffff;
    border: 6px solid rgba(255, 255, 255, 0.75);
    overflow: hidden;
    z-index: 2;
    img {
      width: 100%;
    }
  }
  .modal {
    width: 500px;
    height: 500px;
    background-color: white;
    position: relative;
    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
  }
}
</style>
