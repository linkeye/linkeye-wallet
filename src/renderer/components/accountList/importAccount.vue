<template>
  <div id="importPrivateKey" class="animated" v-show='isImportShow' :class="[isImportShow?popShowClass:'']">
    <div class="private_key_con">
      <div class="title_choose">
        <h3>
          <span :class="isKeystore?'':'active'" @click="checkMenu(0)">导入私钥</span>
        </h3>
        <h3>
          <span :class="isKeystore?'active':''" @click="checkMenu(1)">导入Keystore</span>
        </h3>
      </div>

      <div class="import_address" v-show="!isKeystore">
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

      <div class="import_keystore" v-show="isKeystore">
        <!-- 当前私钥地址 -->
        <div class="key_adress">
          <span>请选择Keystore文件:</span>
          <input type="text" readonly v-model="keystorePath" name=""> <div class="check_file_div"><div class="check_file" :class="keystorePath?'grey_file':''" @click="checkKeystore">选择文件</div></div>
        </div>

        <!-- 导出私钥路径 -->
        <div class="private_key_path">
          <span>请设置密码:</span>
          <input type="password" v-model="keystorePassword" name="">
        </div>

        <!-- 导出按钮 -->
        <div class="export_btn_con">
          <a href="javascript:;" @click='closePop(0)' class="common_btn cancel">取消</a>
          <a href="javascript:;" class="common_btn" @click="requestImportKeystore">导入</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  let testPwd = /^[a-zA-Z0-9]{6,18}$/;
  export default{
    props:['isImportShow'],
    data(){
      return {
        isInput:false,  //是否已经输入
        isChooseFile:false, //是否选择文件
        privateKey:'', //私钥地址或者私钥串
        password:'', //密码
        keystorePath:'', //keystore路径
        keystorePassword:'', //keystore密码
        isKeystore:false, //是否导出keystore
      }
    },
    methods:{
      checkMenu:function (index) {
        if(index){
          this.isKeystore = true;
        }else{
          this.isKeystore = false;
        }
      },

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
          this.requestFilePath(1);
        }
      },
      checkKeystore:function () {
        this.requestFilePath(2);
      },
      requestFilePath:function (index) {
        this.$ipcRenderer.send('generate-file-path','filePath');
        this.responseFilePath(index);
      },

      responseFilePath:function (index) {
        let _this = this;
        this.$ipcRenderer.on('generate-file-path-back',data => {
          _this.$ipcRenderer.detach('generate-file-path-back')
//          console.log(data);
          if(data && data.success) {
            if(index == 1){
              _this.privateKey = data.filePath[0];
              _this.isChooseFile = true
            }else{
              _this.keystorePath = data.filePath[0];
            }
          }
        })
      },

      //导入私钥
      requestImportKey:function () {
        if(!this.privateKey){
          Toast('请输入私钥或导入私钥文件')
          return false;
        }
        if(!this.password){
          Toast('请输入密码')
          return false;
        }
        if(!testPwd.test(this.password)){
          Toast('请输入6-18位密码，支持英文，数字');
          return false
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
      },


      //导入keystore
      requestImportKeystore:function () {
        if(!this.keystorePath){
          Toast('选择keystore文件路径')
          return false;
        }
        if(!this.keystorePassword){
          Toast('请输入密码')
          return false;
        }
        if(!testPwd.test(this.keystorePassword)){
          Toast('请输入6-18位密码，支持英文，数字');
          return false
        }
        let params = {
          password:this.keystorePassword,
          keystorePath:this.keystorePath
        }
        this.$ipcRenderer.send('import-keystore',params);
        this.responseImportKeystore();
      },
      responseImportKeystore:function () {
        let _this = this;
        this.$ipcRenderer.on('import-keystore-back',data => {
          _this.$ipcRenderer.detach('import-keystore-back')
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
            if(data.errorCode == 600000) {
              Toast("输入的密码错误，请核正后再输入");
            }
          }
        })
      },
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
      padding-top: 50px;
      box-shadow: 2px 2px 20px rgba(74,79,245,.4);
      box-sizing: border-box;

      &>.title_choose{
        display: flex;
        width: 80%;
        margin:0 auto;
        h3{
          flex: 1;
          font-size: 26px;
          text-align: center;
          color: #CCCCCC;
          box-sizing: border-box;
          span{
            cursor: pointer;
          }
          span.active{
            color: #788cf5;
          }
        }
        h3:nth-child(1){
          border-right:1px solid #CCCCCC;
        }
      }
    }

    .import_address,.import_keystore{
      .key_adress
      {
        &
        {
          font-size: 16px;
          line-height: 16px;


          padding-top: 50px;
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
          margin-top: 35px;

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
  }



</style>
