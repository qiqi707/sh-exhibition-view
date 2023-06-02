<template>
  <div class="home">
    <div class="view-container" id="threeDBox" ref="threeDBox"></div>
    <div class="tooltip-box" :style="tooltipPosition" ref="tooltipBox">
      <div class="container">
        <div class="title">标题：{{ tooltopContent.title }}</div>
        <div class="explain">说明：{{ tooltopContent.text }}</div>
      </div>
    </div>
    <div class="tooltip-point" :style="tooltipPosition" ref="tooltipPoint">
      <div class="point"></div>
    </div>
    <p class="title-text" ref="titleBox" :style="titlePosition">
      {{ tooltopContent.title }}
    </p>
    <T-nav ref="tNav" @change="changeRoom" />
    <T-image ref="tImage" />
    <T-mask ref="tMask" />
  </div>
</template>

<script>
import TNav from './nav.vue'
import TImage from './t-image.vue'
import TMask from '@/views/component/t-mask.vue'
import { dataList } from '@/views/component/index'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import GifLoader from 'three-gif-loader'
export default {
  name: 'Home',
  components: { TMask, TNav, TImage },
  data() {
    return {
      scene: null,
      camera: null,
      controls: null,
      renderer: null,
      axisHelper: null,
      box: null,
      time: {
        value: 0
      },
      dataList,
      tipsSpriteList: [],
      picList: ['left', 'right', 'top', 'bottom', 'front', 'back'],
      tooltipPosition: {
        top: '-100%',
        left: '-100%'
      },
      titlePosition: {
        top: '-100%',
        left: '-100%'
      },
      tooltopContent: {},
      showModal: false,
      timer: null
    }
  },
  mounted() {
    let element = this.$refs.threeDBox
    this.initScene()
    this.initCamera(element)
    this.initControls(element)
    // this.initContent('/home/box')
    this.$refs.tMask.showLoading = true
    this.publicInit(0)
    this.openAutoRotate() // 10秒后开启自动旋转
    setTimeout(() => {
      this.$refs.tMask.showLoading = false
    }, 500)
    this.initRenderer(element)
    // this.initCSS2DRenderer()
    this.render()
    // this.init2DScene();
    window.addEventListener('resize', this.onResize, false)
    window.addEventListener('click', this.onMouseClick, false)
    this.renderer.domElement.addEventListener('mousemove', this.onMousemove, false)
    this.$refs.tooltipBox.addEventListener('mouseleave', this.handleTooltipHide, false)
  },
  methods: {
    changeRoom(item, index) {
      this.$refs.tMask.showLoading = true
      this.publicInit(index)
      setTimeout(() => {
        this.$refs.tMask.showLoading = false
      }, 500)
    },
    init2DScene() {
      const labelRenderer = new CSS2DRenderer()
      labelRenderer.setSize(window.innerWidth, window.innerHeight)
      labelRenderer.domElement.style.position = 'absolute'
      labelRenderer.domElement.style.top = '0px'
      document.getElementById('threeDBox').appendChild(labelRenderer.domElement)
      const moonDiv = document.getElementById('colorBar')
      const moonLabel = new CSS2DObject(moonDiv)
      moonLabel.position.x = -48
      moonLabel.position.y = 17
      moonLabel.position.z = -10
      this.scene.add(moonLabel)
      labelRenderer.render(this.scene, this.camera)
    },
    initScene() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0x101010)
    },
    initCamera(element) {
      this.camera = new THREE.PerspectiveCamera(
        45,
        element.clientWidth / element.clientHeight,
        0.1,
        1000
      )
      this.camera.position.set(20, 30, 40)
    },
    initControls(element) {
      this.controls = new OrbitControls(this.camera, element)
      this.controls.minDistance = 1
      this.controls.maxDistance = 50
      this.controls.enablePan = false // 相机平移
      this.controls.enableDamping = true // 阻尼惯性，相机重量
      this.controls.dampingFactor = 0.1 // 阻尼惯性，动态阻尼系数，阻尼越小越灵敏
      this.controls.rotateSpeed = 0.5 // 鼠标拖动旋转速度
      this.controls.panSpeed = 0.5 // 移动速度
      this.controls.autoRotateSpeed = 0.5 // 自动旋转速度
    },
    initRenderer(element) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      this.renderer.setSize(element.offsetWidth, element.offsetHeight)
      element.appendChild(this.renderer.domElement)
    },
    initContent(url) {
      let boxGeometry = new THREE.BoxGeometry(10, 10, 10)
      let boxMaterials = []
      this.picList.forEach((item) => {
        let texture = new THREE.TextureLoader().load(require(`@/assets/image${url}/${item}.jpg`))
        boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
      })
      this.box = new THREE.Mesh(boxGeometry, boxMaterials)
      this.box.geometry.scale(10, 10, -10)
      this.scene.add(this.box)
      this.addTipsSprite()
    },
    publicInit(index) {
      const currentItem = this.dataList[index]
      let boxGeometry = new THREE.BoxGeometry(10, 10, 10)
      let boxMaterials = []
      this.picList.forEach((item) => {
        let texture = new THREE.TextureLoader().load(
          require(`@/assets/image/${currentItem.imgUrl}/${item}.jpg`)
        )
        boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
      })
      this.box = new THREE.Mesh(boxGeometry, boxMaterials)
      this.box.geometry.scale(10, 10, -10)
      this.scene.add(this.box)
      this.changeContentAndtips(currentItem, index)
    },
    addTipsSprite(index = 0) {
      const loader = new GifLoader()
      const tipTexture = loader.load(require('@/assets/image/tip-add.gif'))
      // let tipTexture = new THREE.TextureLoader().load(require('@/assets/image/tip.png'))
      let material = new THREE.SpriteMaterial({ map: tipTexture })
      this.tipsSpriteList = []
      this.dataList[index].tipsList.forEach((item) => {
        let sprite = new THREE.Sprite(material)
        sprite.scale.set(3, 3, 0)
        sprite.position.set(item.position.x, item.position.y, item.position.z)
        sprite.content = item.content
        this.tipsSpriteList.push(sprite)
        this.scene.add(sprite)
      })
    },
    changeContentAndtips(item, index) {
      this.scene.children = this.scene.children.filter((item) => String(item.type) !== 'Sprite')
      this.tipsSpriteList = []
      gsap.to(this.controls.target, {
        duration: 0,
        onComplete: () => {
          gsap.to(this.camera.position, {
            duration: 3,
            x: item.position.x,
            y: item.position.y,
            z: item.position.z
          })
        }
      })
      this.camera.updateProjectionMatrix()
      this.addTipsSprite(index)
    },
    render() {
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      this.renderer.sortObjects = false
      this.timer = requestAnimationFrame(this.render)
      this.time.value += 0.015
      this.renderer.setPixelRatio(window.devicePixelRatio)
    },
    onResize() {
      let element = this.$refs.threeDBox
      if (element) {
        this.camera.aspect = element.clientWidth / element.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(element.clientWidth, element.clientHeight)
      } else {
        console.log('没拿到threeDBox的clientWidth')
      }
    },
    onMouseClick(e) {
      e.preventDefault()
      // this.controls.autoRotate = false // 自动旋转
      let element = this.$refs.threeDBox
      let raycaster = new THREE.Raycaster()
      let mouse = new THREE.Vector2()
      if (element) {
        mouse.x = (e.clientX / element.clientWidth) * 2 - 1
        mouse.y = -(e.clientY / element.clientHeight) * 2 + 1
      }
      raycaster.setFromCamera(mouse, this.camera)
      let intersects = raycaster.intersectObjects(this.tipsSpriteList, true)
      if (intersects.length > 0) {
        if (intersects[0].object.content.showTitle) {
          this.initContent('/home/box')
        } else if (intersects[0].object.content.showModal) {
          this.getImgUrl(intersects[0].object.content)
        }
      }
      this.openAutoRotate() // 10秒后开启自动旋转
      // if (intersects.length > 0 && intersects[0].object.content.showTitle) {
      //   this.showModal = true
      //   // router.push(intersects[0].object.content.url)
      //   // this.changeContentAndtips(intersects[0].object.content.image);
      //   // this.handleTooltipHide(e);
      // }

      // const x = e.clientX;
      // const y = e.clientY;

      // const pos = this.screenToWorld(x, y);
      // console.log(pos);
    },
    screenToWorld(x, y) {
      // 将屏幕坐标归一化为[-1, 1]的范围
      const mouseX = (x / window.innerWidth) * 2 - 1
      const mouseY = -(y / window.innerHeight) * 2 + 1

      // 创建一个新的三维向量，并使用unproject方法将屏幕坐标转换为三维坐标
      const vector = new THREE.Vector3(mouseX, mouseY, 0.5)
      vector.unproject(this.camera)

      // 创建一条从相机位置到转换后的三维坐标的射线
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera({ x: mouseX, y: mouseY }, this.camera)

      // 获取射线与场景中的所有物体的交点，并返回距离最近的交点的坐标
      const intersects = raycaster.intersectObjects(this.scene.children)
      if (intersects.length > 0) {
        return intersects[0].point
      }

      // 如果没有交点，则返回相机的位置
      return this.camera.position
    },
    onMousemove(e) {
      e.preventDefault()
      let element = this.$refs.threeDBox
      let raycaster = new THREE.Raycaster()
      let mouse = new THREE.Vector2()
      mouse.x = (e.clientX / element.clientWidth) * 2 - 1
      mouse.y = -(e.clientY / element.clientHeight) * 2 + 1
      raycaster.setFromCamera(mouse, this.camera)
      let intersects = raycaster.intersectObjects(this.tipsSpriteList, true)
      if (intersects.length > 0) {
        let elementWidth = element.clientWidth / 2
        let elementHeight = element.clientHeight / 2
        let worldVector = new THREE.Vector3(
          intersects[0].object.position.x,
          intersects[0].object.position.y,
          intersects[0].object.position.z
        )
        let position = worldVector.project(this.camera)
        this.tooltopContent = intersects[0].object.content
        if (intersects[0].object.content.showTip) {
          let left = Math.round(
            elementWidth * position.x + elementWidth - this.$refs.tooltipBox.clientWidth / 2
          )
          let top = Math.round(
            -elementHeight * position.y + elementHeight - this.$refs.tooltipBox.clientHeight / 2
          )
          this.tooltipPosition = {
            left: `${left}px`,
            top: `${top}px`
          }
        } else if (intersects[0].object.content.showTitle) {
          let left = Math.round(
            elementWidth * position.x + elementWidth - this.$refs.titleBox.clientWidth / 2
          )
          let top = Math.round(-elementHeight * position.y + elementHeight)
          this.titlePosition = {
            left: `${left}px`,
            top: `${top}px`
          }
        }
      } else {
        this.handleTooltipHide(e)
      }
    },
    handleTooltipHide(e) {
      e.preventDefault()
      this.tooltipPosition = {
        top: '-100%',
        left: '-100%'
      }
      this.titlePosition = {
        top: '-100%',
        left: '-100%'
      }
      this.tooltopContent = {}
    },
    getImgUrl(content) {
      this.$refs.tImage.getImgList(content)
    },
    openAutoRotate() {
      this.controls.autoRotate = false
      console.log('啥啊')
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.controls.autoRotate = true // 自动旋转
      }, 10000)
    }
  },
  destroyed() {
    cancelAnimationFrame(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .view-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    &:active {
      cursor: move;
    }
  }
  .title-text {
    position: absolute;
    width: 66px;
    color: #382129;
  }
  .tooltip-box {
    position: absolute;
    padding: 0px 0px 40px 0px;
    line-height: 30px;
    border-radius: 4px;
    color: #ffffff;
    z-index: 100;
    cursor: pointer;
    .container {
      position: relative;
      width: 240px;
      max-height: 200px;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.6);
      // &::before {
      //   content: "";
      //   position: absolute;
      //   bottom: -16px;
      //   left: 20%;
      //   border-top: 16px solid rgba(0, 0, 0, 0.8);
      //   border-left: 10px solid transparent;
      //   border-right: 10px solid transparent;
      // }
      .title {
        width: 100%;
        padding: 6px 0;
      }
      .explain {
        width: 100%;
        max-height: 100px;
        font-size: 14px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        &::-webkit-scrollbar-track {
          background: #353535;
          border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb {
          background: #cdcdcd;
          border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb:hover {
          background: #9c9c9c;
        }
        &::-webkit-scrollbar-corner {
          background: #f6f6f6;
        }
      }
    }
  }
  .animate {
    position: relative;
    top: -575px;
    left: 17%;
    .loading,
    .loading > div {
      position: relative;
      box-sizing: border-box;
    }

    .loading {
      display: block;
      font-size: 0;
      color: #fff;
    }

    .loading.la-dark {
      color: #333;
    }

    .loading > div {
      display: inline-block;
      float: none;
      background-color: currentColor;
      border: 0 solid currentColor;
    }

    .loading {
      width: 32px;
      height: 32px;
    }

    .loading > div {
      position: absolute;
      top: 0;
      left: 0;
      width: 32px;
      height: 32px;
      border-radius: 100%;
      opacity: 0;
      animation: ball-scale-multiple 1s 0s linear infinite;
    }

    .loading > div:nth-child(2) {
      animation-delay: 0.2s;
    }

    .loading > div:nth-child(3) {
      animation-delay: 0.4s;
    }

    .loading.la-sm {
      width: 16px;
      height: 16px;
    }

    .loading.la-sm > div {
      width: 16px;
      height: 16px;
    }

    .loading.la-2x {
      width: 64px;
      height: 64px;
    }

    .loading.la-2x > div {
      width: 64px;
      height: 64px;
    }

    .loading.la-3x {
      width: 96px;
      height: 96px;
    }

    .loading.la-3x > div {
      width: 96px;
      height: 96px;
    }
  }

  @keyframes ball-scale-multiple {
    0% {
      opacity: 0;
      transform: scale(0);
    }

    5% {
      opacity: 0.75;
    }

    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
}
</style>
