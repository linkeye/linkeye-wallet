<template>
    <div id="pwdDialog">
      <div class="dialog_back" v-show="isDialogShow"></div>
      <div class="dialog_body animated" v-show="isDialogShow" :class="[isDialogShow?popShowClass:'']">
        <h3>请输入您的资金密码来完成交易</h3>
        <input type="password" v-model="password">
        <div class="bottom_btn">
            <div class="common_btn cancel_btn" @click="closeDialog">取消</div>
            <div class="common_btn check_btn" @click="sendPwd">确认</div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        props:['isDialogShow'],
        data(){
          return {
            password:''
          }
        },
        mounted: function () {

        },
        methods: {
          sendPwd:function () {
            this.$emit('getmsgevent', this.password);
          },

          closeDialog:function () {
            this.$emit('closeevent');
            this.password = '';
          }
        }

    }
</script>

<style lang="scss" scoped>
  @import '../../scss/common.scss';
  #pwdDialog{
    .dialog_back{
      position: fixed;
      width: 100%;
      top:0;
      bottom:0;
      left: 0;
      z-index: 999;
    }
    .dialog_body{
      box-shadow:2px 2px 20px rgba(74,79,245,0.4);
      position: fixed;
      width:800px;
      height:430px;
      background: #ffffff;
      top:77px;
      border-radius: 10px;
      left: 80px;
      text-align: center;
      z-index: 1000;
      h3{
        font-size: 22px;
        color: #788CF5;
        text-align: center;
        margin-top: 78px;
      }
      input{
        width:426px;
        height: 48px;
        line-height: 48px;
        padding:0 10px;
        box-sizing: border-box;
        margin-top: 66px;
        display: inline-block;
        border:0;
        border-radius: 10px;
        background: #F0F2FF;
        outline: none;
      }
      .bottom_btn{
        margin-top: 106px;
        text-align: center;
        &>div{
          display: inline-block;
          width:195px;
          height: 50px;
        }
        .cancel_btn{
          background: #999999;
          cursor: pointer;
        }
        .check_btn{
          margin-left: 64px;
          cursor: pointer;
        }
      }
    }
  }
</style>
