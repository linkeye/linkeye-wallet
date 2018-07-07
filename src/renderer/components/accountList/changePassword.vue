<template>
  <div id="changePassword" class="animated" v-show='isPasswordShow' :class="[isPasswordShow?popShowClass:'']">
    <div class="private_key_con">
      <div class="password_div">
        <span>当前资金密码:</span>
        <input type="password" name="" v-model="prePassword">
      </div>
      <div class="password_div">
        <span>新的资金密码:</span>
        <input type="password" name="" v-model="password">
      </div>
      <div class="password_div">
        <span>确认资金密码:</span>
        <input type="password" name="" v-model="checkPassword">
      </div>
      <div class="export_btn_con">
        <a href="javascript:;" @click='closePop' class="common_btn cancel">取消</a>
        <a href="javascript:;" class="common_btn" @click="changeCommit">确认修改</a>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  export default{
    props:['isPasswordShow','accountAddress'],
    data(){
      return {
        prePassword:'',
        password:'',
        checkPassword:'',
      }
    },
    mounted:function () {
    },
    methods:{
      closePop(){
        this.$emit('closePasswordShow',false);
        this.prePassword='';
        this.password='';
        this.checkPassword='';
      },

      changeCommit:function () {
        if(!this.prePassword){
          Toast('请输入原密码')
          return false;
        }
        if(!this.password){
          Toast('请输入新密码')
          return false;
        }
        if(!this.checkPassword){
          Toast('请确认新密码')
          return false;
        }
        if(this.password != this.checkPassword){
          Toast('新密码输入不一致')
          return false;
        }
        this.requestChangePassword();
      },

      requestChangePassword:function () {
        let params = {
          password:this.password,
          lastPassword:this.prePassword,
          address:this.accountAddress,
        }
        this.$ipcRenderer.send('account-setting', params);
        this.responseChangePassword();
      },

      responseChangePassword:function () {

        let _this = this;
        this.$ipcRenderer.on('account-setting-back', data => {
          _this.$ipcRenderer.detach('account-setting-back')
          if(data && data.success) {
            if(data.success){
              _this.closePop()
              Toast('修改成功,请记住您的密码');
            }else{
              if(data.errorCode == 999) {
                Toast('您输入的数据有误，请检查');
              }

              if(data.errorCode == 911) {
                Toast('数据初始化失败，请重试');
              }

              if(data.errorCode == 912 ) {
                Toast('生成keystore失败，请重试');
              }

              if(data.errorCode == 913) {
                Toast("您输入的以前的密码有误，请核对后再输入");
              }
            }
          } else {
            if(data.errorCode == 999) {
              Toast('您输入的数据有误，请检查');
            }

            if(data.errorCode == 911) {
              Toast('数据初始化失败，请重试');
            }

            if(data.errorCode == 912 ) {
              Toast('生成keystore失败，请重试');
            }

            if(data.errorCode == 913) {
              Toast("您输入的以前的密码有误，请核对后再输入");
            }
          }
        })
      }

    }
  }
</script>
<style lang='scss' scoped>
  @import '../../scss/common.scss';
  #changePassword
  {
    &
    {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    &.animated
    {
      animation-duration: .3s;
    }
    .private_key_con
    {
      position: relative;
      top: 80px;
      left: 77px;

      width: 800px;
      height: 430px;
      padding-top: 60px;
      box-sizing: border-box;
      border-radius: 10px;
      background: #fff;
      box-shadow: 2px 2px 20px rgba(74,79,245,.4);


      .password_div
      {
        margin-top: 20px;
        text-align: left;
        vertical-align: middle;
        padding-left: 174px;
        span
        {
          font-size: 16px;

          display: inline-block;

          vertical-align: middle;
          width: 120px;

          color: #333;
        }
        &>input{
          line-height: 40px;
          display: inline-block;
          width: 300px;
          height: 40px;
          margin-left: 10px;
          vertical-align: middle;
          text-indent: 10px;
          border: none;
          border-radius: 10px;
          outline: none;
          background: #f0f2ff;
        }
        div.export_btn
        {

          margin-top: 18px;
          padding-right: 195px;
          text-align: right;

          a
          {
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
            padding-bottom: 4px;
            position: relative;
            color: #788cf5;
            border-bottom: 1px solid #788cf5;
            cursor: pointer;
            box-sizing: border-box;
            input{
              position: absolute;
              width:100%;
              top:0;
              bottom:0;
              font-size: 0;
              display: block;
              left: 0;
              opacity: 0;
              cursor: pointer;
            }
          }
        }
      }
      .export_btn_con
      {
        &
        {
          margin-top: 75px;

          text-align: center;
        }
        a
        {
          line-height: 50px;

          display: inline-block;

          width: 195px;
          height: 50px;
        }
        .cancel
        {
          margin-right: 64px;

          background: #999;
        }
      }
    }
  }



</style>
