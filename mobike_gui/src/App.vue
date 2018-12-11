<template>
  <div id="app" >
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app{
    width:100%;
    height:100vh;
    background: url('../static/images/003.jpg') no-repeat;
    overflow:hidden;
    background-size:100% 100%;
  }

</style>
