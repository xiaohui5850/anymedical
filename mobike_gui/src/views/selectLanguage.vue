<template>
  <div class="selectLanguage">
    <mu-container style=" margin-top: -60px;margin-left: 24px">

        <mu-flex class="mu-transition-row" justify-content="center" align-items="center" style="matgin-bottom:20px!important;">
          <mu-scale-transition>
            <mu-button v-show="show4" round color="teal" style="background:rgb(0, 188, 212);" @click="changeLang(2)">中&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文</mu-button>
          </mu-scale-transition>
        </mu-flex>

        <mu-flex class="mu-transition-row" justify-content="center" align-items="center">
          <mu-scale-transition>
            <mu-button v-show="show4" round color="teal" style="background:rgb(0, 188, 212);" @click="changeLang(1)">English</mu-button>
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
        show4:false,
        openAlert:false,
      }
    },
    mounted : function() {
      var _self = this;
      if(!window.document.cookie.match("validate_token=")){
        return this.$router.push({ path: '/home/illegal' });
      }
      console.log(window.document.cookie);
      localStorage.removeItem("allDialogData");
      localStorage.removeItem("openid");
      console.log(_self.$route.params.id.split("=")[1]);
      localStorage.setItem("openid", _self.$route.params.id.split("=")[1]);
      _self.actionFunc();
      _self.uuidFunc();
    },
    methods:{
      actionFunc:function(){
        var self = this;
        setTimeout(function(){
          self.show4 = true;
        },500);
      },
      changeLang:function(data){
        this.$store.commit('changeLanguage',data);
        this.$router.push({ path: '/home/Chat' });
      },
      uuidFunc(){
        var s = [];
        var hexDigits = "0123456789abcdef";
        for(var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        //$scope.chat.uuid = uuid;
        localStorage.setItem("uuid", uuid);
        return uuid;
      },
    },
    computed:{

    },
    watch:{

    }
  }
</script>

<style scoped>
  *{
    padding:0px;
    margin:0px;
  }
  .button-wrapper {
    text-align: center;
  }
  .selectLanguage{
    position:absolute;
    top:45%;
    left:0px;
    width:100%;
    box-sizing:border-box;
    padding:0 10px;
  }
  .mu-button{
    margin: 12px;
    vertical-align: middle;
  }
</style>
