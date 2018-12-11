<template>
    <div class="chat">
      <!--header-->
      <div class="header">
        <mu-appbar style="width: 100%;" title="Title">
            <div class="title-item">{{headerTitle}}</div>
        </mu-appbar>
      </div>
      <!--fixed图标-->
      <mu-button  style="margin-top:100px;" class="mu-icon-radius" @click="showSlider()" >
        <mu-icon value="arrow_forward" right color="red" font-size="16px"></mu-icon>
      </mu-button>
      <!--slider-->
      <div class="slider" style="z-index: 20141224;">
        <!--<mu-drawer :open.sync="open" :docked="docked" :right="position === 'right'" >-->
        <!--<template v-for="item in allData">-->
        <!--<mu-container class="noPadding" @click="firstFunc($event)">-->
        <!--<mu-expansion-panel>-->
        <!--<div slot="header">{{item["firstProblem"]}}</div>-->
        <!--<template v-for="newItem in item['specific']">-->
        <!--<mu-container>-->
        <!--<mu-expansion-panel>-->
        <!--<div slot="header">{{newItem["secondProblem"]}}</div>-->
        <!--<mu-list>-->
        <!--<mu-list-item   v-for="secondItem in newItem['secondSpecific']" :ripple="false" >-->
        <!--<mu-list-item-title @click="selected($event)">{{secondItem}}</mu-list-item-title>-->
        <!--</mu-list-item>-->
        <!--<mu-divider />-->
        <!--</mu-list>-->
        <!--</mu-expansion-panel>-->
        <!--</mu-container>-->
        <!--</template>-->
        <!--</mu-expansion-panel>-->
        <!--</mu-container>-->
        <!--</template>-->
        <!--</mu-drawer>-->
      </div>
      <!--content-->
      <!--对话内容-->
      <div>
        <div class="patch-1"></div>
        <my-dialogue class="dialogue" @scrollC="scrollC"></my-dialogue>
        <div class="patch-2"></div>
        <!--锚点-->
        <a name="1" href="#1" ref="end" style="height:0;color:rgba(0,0,0,0)">.</a>
      </div>
      <!--footer-->
      <div class="footer" ref="footer">
        <div class="top">
          <mu-text-field placeholder="输入文字"
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
  import myDialogue from '@/components/dialog/dialogue'

  export default {
    name: 'chat',
    data() {
      return {
        headerTitle:"chatbot",

        open:false,//打开
        docked:false,
        position:"left",

        items:["问题1","问题二","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三","问题三"],

        value1:"",
        // 对话
        userData:{"friend":1},
        timer: {},

        num:[1,2,3]
      }
    },
    components: {
      myDialogue
    },
    mounted : function() {

    },
    methods:{
        ajaxfunc(){
          this.axios.post("/als/mail", {
              sr_num: "",
              question:""
          }).then(function(response){

          }).catch(function(error){

          });
        },
        socketFunc(){
          var Socket = new WebSocket("ws://api");
          Socket.onopen = function(){
            Socket.send("");
          };
          Socket.onmessage = function(){

          };
          Socket.onclose = function(){

          };
        },
        selected(e){
          this.open = false;
          console.log($(e.currentTarget).text());
          var obj = {};
          obj['id'] = 2;
          obj['message'] = $(e.currentTarget).text();
          this.$store.commit('addDialog',obj);
        },
        showSlider(){
          this.open=true;
        },
        // 监听子组件事件
        scrollC() {
          // 取巧的方法，每次组件更新后模拟点击，破坏性的修改哈希值，但是简便（此处可以修改为正常控制滚动条）
          this.$refs.end.click()
        },
        // 输入框获得焦点时触发
        focus() {
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
            obj['id'] = 2;
            obj['message'] = this.value1;
            this.$store.commit('addDialog',obj);
          };
          this.value1 = "";
        },
    },
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
  }
  .patch-1{
    height: 60px;
  }
  .patch-2 {
    height: 90px;
    background: #f4f4f6;
  }
</style>
