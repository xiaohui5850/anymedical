<template>
  <mu-drawer :open="sidebar.open"
             :docked="sidebar.docked"
             @close="showSidebar()">
    <p>1111111</p>
  </mu-drawer>
</template>

<script>

export default {
  name: 'sidebar'
}

</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'
.mu-drawer
  color: color-b
  .content
    position: relative
    height: 30vh
    padding-top: 1px
    margin-bottom: 50px
    .top
      padding: 20px
      .name
        position: absolute
        display: inline-block
        top: 5vh/*偏移*/
        left: 56% /*偏移*/
        font-size: 1.8em
    .bottom
      padding: 20px
      padding-left: 40px

</style>
