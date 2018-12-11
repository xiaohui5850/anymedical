<template>
  <div>
    <div class="dialogue"
         v-for="item of nowMessageList">
      <mu-list>
        <mu-list-item >
          <!--chatbot-->
          <div :class="item.id===1?'class-a' : 'class-b' ">
            <mu-avatar >
              <img src="static/images/logo.png" style="width:40px;height:40px;">
            </mu-avatar>
            <span class="span_left" style=""><em class="span_left_i"></em></span>
            <span class="content span_left_up"  style="word-break: normal;" v-html="item.message"></span>
          </div>
          <!--用户-->
          <div :class="item.id===2?'class-c' : 'class-d' ">
            <span class="content span_left_down" style="" v-html="item.message"></span>
            <span class="span_right"><em class="span_right_i"></em></span>
            <mu-avatar >
              <img src="static/images/avatar4.jpg"  style="width:40px;height:40px;">
            </mu-avatar>
          </div>
        </mu-list-item>
      </mu-list>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'dialogue',
    data() {
      return {
        value: '',
        avatar1: config.baseUrl+"/static/images/pic.jpg",
        avatar4: config.baseUrl+"/static/images/avatar4.jpg",
      }
    },
    computed: {
      ...mapGetters(['nowMessageList']),
    },
    mounted:function(){

    },
    methods:{

    },
    updated() {
      this.$emit('scrollC')
    }
  }
</script>
<style  scoped>
  .dialogue {
    width: 100%;
  }
  .span_left{
    display:block;
    windth:0px;
    height:0;
    border-width:8px 8px 8px 0;
    border-style:solid;
    border-color:transparent #ccc transparent transparent;
    margin-top:13px;
    position:relative;
  }
  .span_left_i{
    display:block;
    windth:0px;
    height:0;
    border-width:8px 8px 8px 0;
    border-style:solid;
    border-color:transparent #fff transparent transparent;
    position:absolute;
    left:1px;
    top:-8px;
  }
  .span_right{
    display:block;
    windth:0px;
    height:0;
    border-width:8px 0 8px 8px;
    border-style:solid;
    border-color:transparent transparent transparent #ccc;
    margin-top:13px;
    position:relative;
  }
  .span_right_i{
    display:block;
    windth:0px;
    height:0;
    border-width:8px 0 8px 8px;
    border-style:solid;
    border-color:transparent transparent transparent #81c784;
    position:absolute;
    left:-9px;
    top:-8px;
  }
  .span_left_up{
    color: rgba(0, 0, 0, .9);
    box-sizing:border-box;
    background:#fff;
    border:1px solid #ccc;
    border-radius:5px;
    word-break: break-all;
    word-wrap: break-word;
    margin-top:10px;
    box-sizing:border-box;
    padding-top:4px;
  }
  .span_left_down{
    margin-top:10px;
    box-sizing:border-box;
    color: rgba(0, 0, 0, .9);
    box-sizing:border-box;
    background:#81c784;
    border:1px solid #ccc;
    border-radius:5px;
    word-break: break-all;
    word-wrap: break-word;
    padding-top:4px;
  }
</style>
