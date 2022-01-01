<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
// 去除大图预览的翻页功能
.el-image-viewer__wrapper span.el-image-viewer__next ,.el-image-viewer__wrapper span.el-image-viewer__prev{
  display: none;
}
</style>
