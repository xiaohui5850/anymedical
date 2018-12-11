<template>
  <div class="selectLanguage">
    <mu-container>
      <mu-paper class="demo-paper" :z-depth="1"><!--白纸-->
        <mu-flex align-items="center" style="padding-bottom: 8px;" >
          <p style="width:100%;text-align:center;">Unauthorized access...</p>
        </mu-flex>
      </mu-paper>
    </mu-container>

    <mu-container>
      <mu-flex class="mu-transition-row">
        <mu-scale-transition>
          <div class="mu-transition-box mu-primary-color mu-inverse" v-show="show4">

          </div>
        </mu-scale-transition>
      </mu-flex>
    </mu-container>
  </div>
</template>
<script>
  export default {
    name: 'selectLanguage',
    data() {
      return {
        labelPosition:"中文",
        show4:false
      }
    },
    mounted : function() {
      if(window.document.cookie.match("validate_token")){//进入illegal页面若是token则清空掉token
        this.$cookies.remove("validate_token");
      }
    },
    methods:{

    },
    computed:{

    },
    watch:{
      labelPosition:function(val, oldVal){
        if(val == "English"){
          this.$store.commit('changeLanguage',"1");
        }else{
          this.$store.commit('changeLanguage',"2");
        };
        this.$router.push({ path: '/chat' });
        //console.log(this.$store.getters.getLanguage);
        // console.log(val);
        // this.show4 = true;
      }
    }
  }
</script>

<style scoped>
  *{
    padding:0px;
    margin:0px;
  }
  .selectLanguage{
    position:absolute;
    top:45%;
    left:0px;
    width:100%;
    box-sizing:border-box;
    padding:0 10px;
  }
  .demo-paper{
    padding-top:8px;
  }
  .box{
    overflow:hidden;
    width:100%;
  }
  .mu-transition-row {
    margin-top: 16px;
    height: 100px;
  }
  .mu-transition-box {
    min-width: 200px;
    height: 100px;
    margin-right: 16px;
    border-radius: 4px;
    padding: 0 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
