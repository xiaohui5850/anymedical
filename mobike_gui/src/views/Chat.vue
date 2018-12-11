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
                        <mu-list-item-title @click="selected($event)"><div class="tooltipItem">{{secondItem["name"]}}</div></mu-list-item-title>
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
      <div  class="dialogue_box" @touchstart="scrollEvent"  ref="xwBody">
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
                         @keyup.enter.native="sendValue()" id="inputContent"
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
  var MAX = 300;
  var count = 0;
  var time_interval = 1000;
  var status = 0;
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
        index:0,//表示重连次数
        keyboardHeight:0,
        isHandClose:false

      }
    },
    components: {
      myDialogue
    },
    created:function(){

    },
    destroyed: function() {
      this.isHandClose = true;
      this.websocketclose();
      this.$store.getters.nowMessageList.length= 0;
      localStorage.removeItem("allDialogData");
    },
    mounted : function() {
      var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if(isiOS){
        $(".footer").css("position","absolute");
        // $(".footer").css("height","40px");
      }
      if(!window.document.cookie.match("validate_token=")){
        this.$router.push({ path: '/home/illegal' });
      }
      var _self = this;
      _self.getLanguage1 = _self.getLanguage;
      _self.uuid = localStorage.getItem("uuid");
      _self.openid = localStorage.getItem("openid");
      _self.ajaxfunc(_self.getLanguage1);
      if(!_self.websock){
        _self.initWebSocket();
      };
      if(localStorage.getItem("allDialogData")){
        var arr = JSON.parse(localStorage.getItem("allDialogData"));
        localStorage.removeItem("allDialogData");
        for(var i=0; i<arr.length;i++){
          this.$store.commit('addDialog',arr[i]);
        };
      };

      // 通过键盘弹起事件获取
      window.on('keyboardup', function (e) {
        console.log(e.height)
        _self.keyboardHeight = e.height
        // alert("e.height:"+e.height);
      })
      // 键盘收起事件
      window.on('keyboarddown', function (e) {
        console.log(e.height) // 0
        _self.keyboardHeight = e.height;
        // alert("e.height:"+e.height);
      })

    },
    computed: {
      ...mapGetters(['getLanguage']),
    },
    methods:{
      scrollEvent(event){
        console.log("进入scorllEvent");
        if(document.activeElement.nodeName.toLowerCase() == 'input' && event.currentTarget.className == 'dialogue_box') {
              document.getElementById("inputContent").blur();
              console.log("22222222222222222");
            }
      },
      initWebSocket(){
        var _self = this;
        var currentTime = new Date();
        //socket = new WebSocket("wss://xiaoqiao.accenture.com/mobike/chatsocket?openid="+_self.openid+"&date="+currentTime+"&uuid="+_self.uuid+"&lang="+_self.newLang);
        socket = new WebSocket("ws://127.0.0.1:8077/mobike/chatsocket?openid="+_self.openid+"&date="+currentTime+"&uuid="+_self.uuid+"&lang="+_self.newLang);
        socket.onopen = this.websocketonopen;
        socket.onerror = this.websocketonerror;
        socket.onmessage = this.websocketonmessage;
        socket.onclose = this.websocketclose;
        console.log("建立连接");
      },
      reconnection () {
        var _self = this;

          //1与服务器已经建立连接
          if (count >= MAX || socket.readyState == 1) {
              clearTimeout(t);
              if(count >= MAX ){
                var obj = {};
                obj['id'] = 1;
                obj['message'] = "您的会话已超时,请刷新页面或重新进入页面，发起新会话。";
                obj['openid'] = this.openid;
                //存我发出的消息
                this.$store.commit('addDialog',obj);
              }
          } else {
              //2已经关闭了与服务器的连接
                if (socket.readyState == 3) {
                    this.initWebSocket();
                }
              count = count + 1;
              console.log("reconnection...【" + count + "】");
              //0正尝试与服务器建立连接,2正在关闭与服务器的连接
              t = setTimeout(function() {_self.reconnection();}, time_interval);
          }
    },
      websocketonopen(){
		    console.log("链接成功");
		     status = 0
		    count = 0
      },
      websocketsend(agentData){//数据发送
        socket.send(agentData);
        console.log("消息发送成功哦")
      },
      websocketonerror(e){
        console.log("出错了");
        if (status != 1){
          this.reconnection();
          status = 1;
          console.log("error重连");
        }
      },
      //销毁websocket
      websocketclose(){
        console.log("flow.html:WebSocket失效连接关闭");
        console.log("socket"+socket);
        socket.close();
        console.log("socket"+socket);
        if (status != 1 && this.isHandClose !=true){
          this.reconnection();
          status = 1;
          console.log("close重连")
        }
      },
      websocketonmessage(e){

        var msg = JSON.parse(JSON.parse(e.data).data);

        for(var i =0;i<msg.length;i++){
          var obj = {};
          obj['id'] = msg[i].is_hr;
          if(obj['id'] == true){
            obj['id'] = 1;
          }else{
            obj['id'] = 2;
          }
          obj['message'] = msg[i].Text.replace(/\n/g,"<br/>");
          obj['openid'] = msg[i].openid;//存到本地数据时将对应的openid存入确定其唯一
          //存我发出的消息
          this.$store.commit('addDialog',obj);
        }
        console.log("收到消息喔");
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
        document.getElementById("inputContent").focus();
        this.open = false;
        console.log($(e.currentTarget).text());
        //发送消息
        var param = {};
        param['openid'] = this.openid;
        param['text'] =$(e.currentTarget).text();
        param['uuid'] = this.uuid;
        param['lang'] = this.lang;
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
      //监听子组件事件
      scrollC() {
        // 取巧的方法，每次组件更新后模拟点击，破坏性的修改哈希值，但是简便（此处可以修改为正常控制滚动条）
       setTimeout(()=>{
            //滚动条长度
            var currentDistance=this.$refs.xwBody.scrollHeight-this.$refs.xwBody.clientHeight;
            //当前滚动条距离顶部的距离
            var currentScroll_y=this.$refs.xwBody.scrollTop;
            if(currentDistance>0 && currentDistance>currentScroll_y){
              currentScroll_y=Math.ceil((currentDistance-currentScroll_y)/10)+currentScroll_y;
              currentScroll_y=currentScroll_y>currentDistance ? currentDistance: currentScroll_y;
              //微信和qq浏览器不支持 scrollTo？
              //this.$refs.xwBody.scrollTo(0,currentScroll_y);
              this.$refs.xwBody.scrollTop = currentScroll_y;
              this.scrollC();
            }
          },13);
      },
      // 输入框获得焦点时触发
      focus() {


          var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          if(isiOS){
            $(".footer").css("position","absolute");
            $(".header").css("position","absolute");
            $(".header").css("height","50px");
            $(".header").css("top","310px");
            $(".dialogue").css("margin-top","320px");
            $(".mu-icon-radius").css("margin-top","-10px!important");
            //this.$refs.xwBody.scrollIntoView();
            // $(".footer").css("height","40px");
          }
          this.timer.T = setInterval(() => {
            // 完美解决输入框被软键盘遮挡
            if(isiOS){
            this.$refs.footer.scrollIntoView(true);
            $('.dialogue_box')[0].scrollTop = $('.dialogue_box')[0].scrollHeight;//输入框聚焦内容拉到最低部
            }else{
               this.$refs.footer.scrollIntoView(false);
               $('.dialogue_box')[0].scrollTop = $('.dialogue_box')[0].scrollHeight-this.keyboardHeight;//输入框聚焦内容拉到最低部
              $(".footer").css("bottom","-21px");
            }

          }, 200)
       


      },
      blur() {
        // 输入框失去焦点时清除定时器
        clearInterval(this.timer.T);

        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        //ios终端
        if (isiOS) {
	        $(".footer").css("position","fixed");
          $(".header").css("position","fixed");
          $(".header").css("height","10%");
          $(".header").css("top","0px");
          $(".dialogue").css("margin-top","0px");
          $(".mu-icon-radius").css("margin-top","-20px!important");
       }
      },
      sendValue() {
        document.getElementById("inputContent").focus();
        var obj = {};
        if(!!this.value1){
          var param = {};
          param['openid'] = this.openid;
          param['text'] = this.value1;
          param['uuid'] = this.uuid;
          param['lang'] = this.lang;
          param = JSON.stringify(param);

          if (socket.readyState == 3) {
            this.initWebSocket();
          }

          if(this.openid != null){
            //发送消息
            this.websocketsend(param);
          }


          obj['id'] = 2;
          //obj['message'] = this.value1;v-html="str"
          obj['message'] = this.value1.replace(/\\n/gm,"<br/>");
          obj['openid'] = this.openid;
          //存我发出的消息
          this.$store.commit('addDialog',obj);
          this.scrollC();
        };
        this.value1 = "";
      },
    },
    watch:{
      getLanguage1:function(val,oldVal){
        if(val == 1){
          this.putValue = "Input text";
          this.headerTitle = "Mobike Advisor";
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
  .tooltipItem{
    width: 189px;
    /*height: 42px;
    white-space:normal;*/
    /*word-wrap:break-word;*/
    /*word-break:normal;*/
    /*word-break:break-all; !*支持IE，chrome，FF不支持*!*/
    word-wrap:break-word;/*支持IE，chrome，FF*/
  }
  .mu-item-title {
    width: 189px;
    height: 50%;
    /* overflow: hidden; */
    white-space: normal;
    text-overflow: ellipsis;
    word-wrap: break-word;
    margin-top:2px;
  }
</style>


