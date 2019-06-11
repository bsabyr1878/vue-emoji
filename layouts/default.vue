<template>
  <div class="layout">
    <div class="layout__animation">
      <animation />
    </div>
    <div class="layout__content">
      <nuxt />
    </div>
    <div class="layout__navigation">
      <navigation />
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/navigation'
import Animation from '@/components/animation'
export default {
  components: {
    Navigation,
    Animation
  }
}
</script>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  background-color: #000;
  position: relative;
}
.layout {
  position: relative;
  &__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }
  &__navigation {
    position: fixed;
    top: 0;
    right: 0;
  }
}
</style>
