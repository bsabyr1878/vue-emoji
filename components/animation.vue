<template>
  <div class="animation">
    {{ page }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as THREE from 'three'
// import { TimelineMax } from 'gsap'
// const OrbitControls = require('three-orbit-controls')(THREE)

export default {
  data: () => ({
    state: [],
    material: {},
    geometry: {}
  }),
  computed: mapState(['page']),
  watch: {
    page: function (newValue, oldValue) {
      // const vm = this
      // vm.geometry.attributes.target = vm.state[newValue]
      // vm.geometry.needsUpdate = true
      // const tl = new TimelineMax({ onComplete: () => {
      //   vm.material.uniforms.blend.value = 0
      //   vm.geometry.attributes.source = vm.geometry.attributes.target
      //   vm.geometry.needsUpdate = true
      // }
      // })
      // tl.to(vm.material.uniforms.blend, 0.5, { value: 1 }, 0)
    }
  },
  mounted() {
    let camera, scene, renderer
    const vm = this
    function init() {
      scene = new THREE.Scene()
      scene.destination = { x: 0, y: 0 }
      scene.background = new THREE.Color(0x000000)
      renderer = new THREE.WebGLRenderer()
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerWidth)
      const container = vm.$el
      container.appendChild(renderer.domElement)
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.001, 100
      )
      camera.position.set(0, 0, 1)
      // const controls = new OrbitControls(camera, renderer.domElement) // eslint-disable-line no-unused-vars
      vm.material = new THREE.ShaderMaterial({
        extensions: {
          derivatives: '#extension GL_OES_standard_derivatives : enable'
        },
        uniforms: {
          time: { type: 'f', value: 0 },
          blend: { type: 'f', value: 0 },
          original: { type: 't', value: new THREE.TextureLoader().load('/ok.png') }, // eslint-disable-line new-cap
          target: { type: 't', value: new THREE.TextureLoader().load('/devil.png') } // eslint-disable-line new-cap
        },
        vertexShader: `varying vec2 vUv;
        varying vec3 vecPos;
        varying vec3 v_position;
        uniform float time;
        uniform float blend;
        uniform sampler2D original;
        uniform sampler2D target;

        void main() {
          vUv = uv;
          v_position = position.xyz;
          float roundblend = sin(3.1415926*blend);
          float stepblend = clamp( 2.*(v_position.x + v_position.y) +3.*blend - 1., 0.,1.);

          float originalR = texture2D(original,vUv).r;
          float targetR = texture2D(target,vUv).r;

          v_position.z = 0.2* mix(originalR,targetR,stepblend) + roundblend*0.1*sin(v_position.x*10. + time/100.);
          
          v_position.x = position.x + roundblend*0.1*sin(v_position.y +v_position.x + blend);
          v_position.y = position.y + roundblend*0.1*sin(v_position.y +v_position.x + blend);

          vecPos = (modelViewMatrix * vec4(v_position, 1.0)).xyz;
          gl_Position = projectionMatrix * vec4(vecPos, 1.0);
        }`,
        fragmentShader: `varying vec3 v_position;
        varying vec2 vUv;
        uniform sampler2D original;
        uniform sampler2D target;
        uniform float blend;

        void main(void) {
          vec2 st = v_position.xy;

          float koef = clamp(v_position.z/60.,0.,1.);

          vec3 color1 = vec3(1.,1.,1.);
          vec3 color2 = vec3(1.,0.,0.);

          vec3 color3 = mix(color1,color2,koef);

          vec2 grid = abs(fract(500.*st/4. - 0.5) - 0.5) / fwidth(500.*st/4.);
          float color = min(grid.x, grid.y);

          gl_FragColor = vec4(color3,1. - color);
          gl_FragColor = vec4(1.,0.,0.,1.);

          float stepblend = clamp(v_position.x + v_position.y +3.*blend - 1., 0.,1.);
          vec4 originalC = texture2D(original,vUv);
          vec4 targetC = texture2D(target,vUv);
          vec4 result = originalC*(1. - stepblend) + targetC*stepblend;
          gl_FragColor = result*(1. - color);
        }`,
        alphaTest: 0.5,
        transparent: true
      })

      const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 200, 200), vm.material)
      scene.add(plane)

      resize()
    }

    let time = 0

    function animate() {
      time++
      vm.material.uniforms.time.value = time
      requestAnimationFrame(animate)
      render()
    }

    function render() {
      scene.rotation.x += (scene.destination.x - scene.rotation.x) * 0.05
      scene.rotation.y += (scene.destination.y - scene.rotation.y) * 0.05
      renderer.render(scene, camera)
    }

    const ww = window.innerWidth
    const wh = window.innerHeight
    function resize() {
      renderer.setSize(ww, wh)
      camera.aspect = ww / wh
      camera.updateProjectionMatrix()
    }

    function onMousemove(e) {
      const x = (e.clientX - ww / 2) / (ww / 2)
      const y = (e.clientY - wh / 2) / (wh / 2)
      scene.destination.x = y * 0.5
      scene.destination.y = x * 0.5
    }

    window.addEventListener('mousemove', onMousemove)

    init()
    animate()
  }
}
</script>

<style lang="scss">
.animation {
  position: fixed;
}
</style>
