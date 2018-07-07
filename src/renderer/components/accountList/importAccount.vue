<template>
  <div id="importPrivateKey" class="animated" v-show='isImportShow' :class="[isImportShow?popShowClass:'']">
    <div class="private_key_con">

      <!-- 当前私钥地址 -->
      <div class="key_adress">
        <span>输入您的私钥(或地址):</span>
        <input type="text" :readonly="isChooseFile" v-model="privateKey" name=""> <i>或</i> <div class="check_file_div"><div class="check_file" :class="isInput?'grey_file':''" @click="checkFile">选择文件</div></div>
      </div>

      <!-- 导出私钥路径 -->
      <div class="private_key_path">
        <span>输入私钥密码:</span>
        <input type="password" v-model="password" name="">
      </div>

      <!-- 导出按钮 -->
      <div class="export_btn_con">
        <a href="javascript:;" @click='closePop(0)' class="common_btn cancel">取消</a>
        <a href="javascript:;" class="common_btn" @click="requestImportKey">导入</a>
      </div>

    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  export default{
    props:['isImportShow'],
    data(){
      return {
        isInput:false,  //是否已经输入
        isChooseFile:false, //是否选择文件
        privateKey:'', //私钥地址或者私钥串
        password:'', //密码
      }
    },
    methods:{
      closePop(index){
        if(index){
          this.$emit('closeImportShow',true);
        }else{
          this.$emit('closeImportShow',false);
        }
        this.isInput=false;  //是否已经输入
          this.isChooseFile=false; //是否选择文件
          this.privateKey=''; //私钥地址或者私钥串
          this.password=''; //密码
      },

      checkFile:function () {
        if(!this.isInput){
          this.requestFilePath();
        }
      },

      requestFilePath:function () {
        this.$ipcRenderer.send('generate-file-path','filePath');
        this.responseFilePath();
      },

      responseFilePath:function () {
        let _this = this;
        this.$ipcRenderer.on('generate-file-path-back',data => {
          _this.$ipcRenderer.detach('generate-file-path-back')
          console.log(data);
          if(data && data.success) {
            _this.privateKey = data.filePath[0];
            _this.isChooseFile = true
            _this.$ipcRenderer.detach('generate-file-path-back');
          }
        })
      },
      requestImportKey:function () {
        if(!this.privateKey){
          Toast('请输入私钥或导入私钥文件')
          return false;
        }
        if(!this.password){
          Toast('请输入密码')
          return false;
        }
        let privateKey = '';
        let privateKeyPath = '';
        if(!this.isChooseFile){
          privateKey = this.privateKey
        }else{
          privateKeyPath = this.privateKey
        }
        let params = {
          password:this.password,
          privateKey:privateKey,
          privateKeyPath:privateKeyPath
        }
        console.log(params)
        this.$ipcRenderer.send('import-privateKey',params);
        this.responseImportKey();
      },
      responseImportKey:function () {
        let _this = this;
        this.$ipcRenderer.on('import-privateKey-back',data => {
          _this.$ipcRenderer.detach('import-privateKey-back')
          console.log(data);
          if(data && data.success) {
            Toast('导入成功');
            _this.closePop(1);
          }else{
            if(data.errorCode == 600) {
              Toast('数据初始化失败，请重试')
            }
            if(data.errorCode == 601) {
              Toast('数据初始化失败，请重试')
            }
            if(data.errorCode == 602) {
              Toast('数据初始化失败，请重试')
            }
            if(data.errorCode == 603) {
              Toast('该用户已经存在，禁止重复导入，请您勿再重复导入')
            }
            if(data.errorCode == 604) {
              Toast("导入过程中生成keystore失败，请重试");
            }
          }
        })
      }
    },

    watch:{
      privateKey:function (oldVal, Val) {
        if(this.privateKey){
          this.isInput = true;
        }else{
          this.isInput = false;
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import '../../scss/common.scss';
  #importPrivateKey
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

      border-radius: 10px;
      background: #fff;
      box-shadow: 2px 2px 20px rgba(74,79,245,.4);
    }
    .key_adress
    {
      &
      {
        font-size: 16px;
        line-height: 16px;


        padding-top: 95px;
        padding-left: 154px;
        text-align: left;

        color: #333;
      }
      &>span
      {
        font-size: 16px;

        display: inline-block;
        width:120px;
        vertical-align: middle;

        color: #333;
      }
      &>input
      {
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
      .check_file_div{
        display: inline-block;
        vertical-align: middle;
        position: relative;
        height: 40px;
        line-height: 40px;
        width:100px;
        .check_file{
          width:100%;
          color: #788cf5;
          cursor: pointer;
        }
        .check_file.grey_file{
          color: #999;
          cursor: not-allowed;
        }
      }
      i
      {
        color: #788cf5;
      }
    }
    .private_key_path
    {
      &
      {

        padding-left: 154px;
        margin-top: 52px;

        text-align: left;
        vertical-align: middle;
      }
      span
      {
        font-size: 16px;

        display: inline-block;

        vertical-align: middle;
        width:120px;
        color: #333;
      }
      input
      {
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
      div
      {
        &
        {
          margin-top: 18px;
          padding-right: 195px;

          text-align: right;
        }
        a
        {
          font-size: 16px;
          font-weight: bold;

          display: inline-block;

          padding-bottom: 4px;

          color: #788cf5;
          border-bottom: 1px solid #788cf5;
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



</style>
