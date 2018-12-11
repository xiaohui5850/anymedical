<template>
    <div class="chat">
      <!--header-->
      <div class="header">
        <mu-appbar style="width: 100%;" title="Title">
          <div class="title-item " style="background:#00bcd4;border:1px solid #fff;">{{headerTitle}}</div>
        </mu-appbar>
      </div>
      <!--fixed图标-->
      <mu-button  style="margin-top:100px;" class="mu-icon-radius" @click="showSlider()" >
        <mu-icon value="arrow_forward" right color="red" font-size="16px"></mu-icon>
      </mu-button>
      <!--slider-->
      <div class="slider" style="z-index: 20141224;">

        <mu-drawer :open.sync="open" :docked="docked" :right="position === 'right'" style="background:#e8eaf6;" >
          <template v-for="item in allData">
            <mu-container class="noPadding">
              <mu-expansion-panel>
                <div slot="header">{{item["name"]}}</div>
                <mu-list toggle-nested>

                  <template v-for="(newItem,index) in item['list']">
                    <mu-list-item  button :ripple="false" nested :open="open1 === 'stared'" @toggle-nested="open1 = arguments[0] ? index : ''">
                      <mu-list-item-title>{{newItem["name"]}}</mu-list-item-title>
                      <mu-list-item-action>
                        <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
                      </mu-list-item-action>
                      <mu-list-item button :ripple="false" slot="nested" v-for="secondItem in newItem['list']">
                        <mu-list-item-title @click="selected($event)">{{secondItem["name"]}}</mu-list-item-title>
                      </mu-list-item>
                    </mu-list-item>
                  </template>

                </mu-list>
                </mu-expansion-panel>
            </mu-container>
          </template>
        </mu-drawer>
      </div>
      <!--content-->
      <!--对话内容-->
      <div  class="dialogue_box" >
        <div>
          <div class="patch-1"></div>
          <my-dialogue class="dialogue" @scrollC="scrollC"></my-dialogue>
          <div class="patch-2"></div>
          <!--锚点-->
          <a name="home/All" href="#home/All" ref="end" style="height:0;color:rgba(0,0,0,0)">.</a>
        </div>
      </div>
      <!--footer-->
      <div class="footer" ref="footer">
        <div class="top">
          <mu-text-field :placeholder="putValue"
                         v-model="value1"
                         @focus="focus"
                         @blur="blur"
                         @keyup.enter.native="sendValue()"
          />
          <mu-button class="button" @click="sendValue()">
            <mu-icon value="send" right color="red" ></mu-icon>
          </mu-button>
        </div>
      </div>

    </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import myDialogue from '@/components/dialog/dialogue'
  var socket;
  var t;
  var MAX = 1000;
  var count = 0;
  export default {
    name: 'chat',
    data() {
      return {
        flagVoice:1,
        headerTitle:"小摩咨询",
        open:false,//打开
        docked:false,
        position:"left",
        items:["问题1","问题二","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三"],
        value1:"",
        // 对话
        userData:{"friend":1},
        timer: {},
        allData:[
          {
            firstProblem:"采购问题",
            specific:[
                {
                  secondProblem:"付款状态111",
                  secondSpecific:["报销订单号","发票付款进度"]
                },
                {
                  secondProblem:"付款流程111",
                  secondSpecific:["国内供应商付款的流程是什么","海外供应商付款的流程是什么？"]
                }
              ]
          },
          {
            firstProblem:"财务问题",
            specific:[
              {
              secondProblem:"付款状态111",
              secondSpecific:["报销订单号","发票付款进度"]
            },
              {
                secondProblem:"付款流程111",
                secondSpecific:["国内供应商付款的流程是什么","海外供应商付款的流程是什么？"]
              }
              ]
          },
        ],
        open1: 'send',
        open2: false,
        websock:null,//挂在websocket实例
        putValue:"请输入文字",
        getLanguage1:"",
        uuid:"",
        openid:"",
        newLang:"",
        connect:false,
        timer1:"",
        index:0//表示重连次数
      }
    },
    components: {
      myDialogue
    },
    created:function(){
    },
    destroyed: function() {
      this.websocketclose();
      this.$store.getters.nowMessageList.length= 0;
      localStorage.removeItem("allDialogData");
    },
    mounted : function() {
      if(!window.document.cookie.match("validate_token=")){
        this.$router.push({ path: '/home/illegal' });
      }
      var _self = this;
      _self.getLanguage1 = _self.getLanguage;
      _self.uuid = localStorage.getItem("uuid");
      _self.openid = localStorage.getItem("openid");
      _self.ajaxfunc(_self.getLanguage1);
      if(!_self.websock){
        _self.connection();
      };
      if(localStorage.getItem("allDialogData")){
        var arr = JSON.parse(localStorage.getItem("allDialogData"));
        localStorage.removeItem("allDialogData");
        for(var i=0; i<arr.length;i++){
          this.$store.commit('addDialog',arr[i]);
        };
      };

    },
    computed: {
      ...mapGetters(['getLanguage']),
    },
    methods:{
//      initWebSocket(){
//        var _self = this;
//        var currentTime = new Date();
//        console.log(_self.openid);
//        //_self.websock = new WebSocket("wss://xiaoqiao.accenture.com/mobike/chatsocket?openid="+_self.openid+"&date="+currentTime);
//        _self.websock = new WebSocket("ws://10.202.10.101:8088/mobike/chatsocket?openid="+_self.openid+"&date="+currentTime);
//        _self.websock.onopen = this.websocketonopen;
//        _self.websock.onerror = this.websocketonerror;
//        _self.websock.onmessage = this.websocketonmessage;
//        _self.websock.onclose = this.websocketclose;
//        console.log("建立连接");
//      },
      connection () {
        var _self = this;
        var currentTime = new Date();
        var url = "ws://127.0.0.1:8077/mobike/chatsocket?openid="+111111111+"&date="+currentTime;
        socket = new WebSocket(url);
        socket.onopen = this.onopen;
        socket.onmessage = this.onmessage;
        socket.onclose = this.onclose;
        socket.onerror = this.onerror;
         console.log("建立连接");
      },
      reconnection () {
        count = count + 1;
        console.log("reconnection...【" + count + "】");
          //1与服务器已经建立连接
          if (count >= MAX || socket.readyState == 1) {
              clearTimeout(t);
          } else {
              //2已经关闭了与服务器的连接
              if (socket.readyState == 3) {
                  this.connection();
              }
              //0正尝试与服务器建立连接,2正在关闭与服务器的连接
              t = setTimeout(function() {this.reconnection();}, 100);
          }
    },
    onopen() {
      console.log("open...");
    },
    onclose() {
    console.log("close...");
    this.reconnection();
    },
    onmessage(e) {
      console.log("message...");
      if (e.data === "")
        return;
      var toUserId = document.getElementById("toUserId").value;
      document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + '<br/>' + toUserId + "说：" + e.data;
      console.log(toUserId + "说：" + e.data);
    },
    onerror () {
      console.log("error...");
      this.reconnection();
  },
	    clearInterval:function(){
        clearInterval(this.timer1);
      },
      connectTimerCancel:function(){
        var _self = this;
        _self.timer1 = {};
      },
      ajaxfunc(data){
        var _self = this;
        if(data == 1){
          _self.newLang = "EN";
        }else{
          _self.newLang = "CN";
        }
        _self.axios.post("mobike/queryMenu", {
          lang: _self.newLang,
        }).then(function(response){
          _self.allData = response.data.hasOwnProperty("CN")?response.data.CN:response.data.EN;
          console.log(_self.allData);
        }).catch(function(error){
          console.log(error);
        });
      },
      selected(e){
        this.open = false;
        console.log($(e.currentTarget).text());
        //发送消息
        var param = {};
        param['openid'] = this.openid;
        param['text'] =$(e.currentTarget).text();
        param['uuid'] = this.uuid;
        param = JSON.stringify(param);
        this.websocketsend(param);
        var obj = {};
        obj['id'] = 2;
        obj['message'] = $(e.currentTarget).text();
        //存我发出的消息
        this.$store.commit('addDialog',obj);

      },
      showSlider(){
        this.open=true;
      },
      // 监听子组件事件
      scrollC() {
        // 取巧的方法，每次组件更新后模拟点击，破坏性的修改哈希值，但是简便（此处可以修改为正常控制滚动条）
        console.log("触发了滚动");
        this.$refs.end.click()
      },
      // 输入框获得焦点时触发
      focus() {
        $('.dialogue_box')[0].scrollTop = $('.dialogue_box')[0].scrollHeight;//输入框聚焦内容拉到最低部
        this.timer.T = setInterval(() => {
          // 完美解决输入框被软键盘遮挡
          this.$refs.footer.scrollIntoView(false)
        }, 200)

      },
      blur() {
        // 输入框失去焦点时清除定时器
        clearInterval(this.timer.T)
      },
      sendValue() {
        var obj = {};
        if(!!this.value1){
          var param = {};
          param['openid'] = this.openid;
          param['text'] = this.value1;
          param['uuid'] = this.uuid;
          param = JSON.stringify(param);

          if(this.connect == false){
            this.connectTimer();
          }else{
              if(this.openid != null){
                //发送消息
                this.websocketsend(param);
              }

          }
          obj['id'] = 2;
          //obj['message'] = this.value1;v-html="str"
          obj['message'] = this.value1.replace(/\\n/gm,"<br/>");
          obj['openid'] = this.openid;
          //存我发出的消息
          this.$store.commit('addDialog',obj);
        };
        this.value1 = "";

      },

    },
    watch:{
      getLanguage1:function(val,oldVal){
        if(val == 1){
          this.putValue = "Input text";
          this.headerTitle = "chatroom";
          console.log(222);
          this.lang = "EN";
        }else{
          console.log(111)
          this.putValue = "请输入文字";
          this.headerTitle = "小摩咨询";
          this.lang = "CN";
        }
      },
    }
  }
</script>

<style scoped>
  .header{
    position: fixed;
    z-index: 101;
    top: 0;
    left: 0;
    width: 100%;
    height: 10%;
  }
  .mu-appbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .title-item{
    margin: 0 auto;
    width: 48%;
    height: 34px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #2e2c6b;
    border-radius: 4px;
    font-weight: 500;
    background: #2e2c6b;
    color: #fff;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 90px;
    text-align: center;
    background: #fff;
  }
  .top{
    display: flex;
    justify-content: center;
    padding: 0 10px;
  }
  .dialogue{
    padding-bottom:10px;
  }
  .dialogue_box{
    z-index: 999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    bottom:0px;
    overflow-y:scroll;
    overflow-x:hidden;
  }
  .patch-1{
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 10.2vh;
  }
  .patch-2 {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 10.2vh;
  }
  .mu-icon-radius .mu-button-wrapper{
    padding:0px!important;
  }
</style>
