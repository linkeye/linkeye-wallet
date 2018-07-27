<template>
	<div id="exportPrivateKey" class="animated" v-show='isPrivateKeyShow' :class="[isPrivateKeyShow?popShowClass:'']">
		<div class="private_key_con">
      <div class="title_choose">
        <h3>
          <span :class="isKeystore?'':'active'" @click="checkMenu(0)">导出私钥</span>
        </h3>
        <h3>
          <span :class="isKeystore?'active':''" @click="checkMenu(1)">导出Keystore</span>
         </h3>
      </div>
      <!-- 导出私钥 -->
      <div class="export_keyaddress">
        <!-- 当前私钥地址 -->
        <div class="key_adress">
          <span>当前地址:</span>
          <i>LET{{accountAddress}}</i>
        </div>

        <!-- 导出私钥路径 -->
        <div class="private_key_path">
          <span>地址密码:</span>
          <input type="password" name="" v-model="password">
          <!--<div class="export_btn">-->
            <!--<a href="javascript:;"><input type="file" @change="getPathName">选择路径</a>-->
          <!--</div>-->
        </div>

      </div>


      <!-- 导出按钮 -->
      <div class="export_btn_con">
        <a href="javascript:;" @click='closePop' class="common_btn cancel">取消</a>
        <a href="javascript:;" class="common_btn" @click="exportClick">导出</a>
      </div>
		</div>
	</div>
</template>

<script>
  import { Toast } from 'mint-ui'
	export default{
		props:['isPrivateKeyShow','accountAddress'],
		data(){
			return {
        password:'',
        isKeystore:false,
        privateKey:''
			}
		},
    mounted:function () {
    },
		methods:{
      checkMenu:function (index) {
        if(index){
          this.isKeystore = true;
        }else{
          this.isKeystore = false;
        }
      },

			closePop(){
				this.$emit('closePrivateKeyShow',false);
				this.password = '';

			},

      exportClick:function () {
        if(this.isKeystore){
          this.requestExportKeystore()
        }else{
          this.exportKey()
        }
      },
      //导出私钥
      exportKey:function () {
        let params = {
          address:this.accountAddress,
          password:this.password,
        }
        this.$ipcRenderer.send('export-privateKey',params);
        this.exportKeyBack();
      },

      //导出私钥
      exportKeyBack:function () {
        let _this = this;
        this.$ipcRenderer.on('export-privateKey-back', data => {
          _this.$ipcRenderer.detach('export-privateKey-back')
          if(data){
            if(data.success){
              let privateKey = data.privateKey;
              _this.requestStoreKey(privateKey);
            }else{
              if(data.errorCode == 400){
                Toast('您输入的内容有误，请重新输入')
              }
              if(data.errorCode == 401){
                Toast('数据初始化失败，请重试')
              }
              if(data.errorCode == 402){
                Toast('您输入的密码有误，请重新输入')
              }
            }
          }
        })
      },

      //导出keystore
      requestExportKeystore:function () {
        let params = {
          address:this.accountAddress,
          password:this.password,
        }
        this.$ipcRenderer.send('export-keystore',params);
        this.responseExportKeystore()
      },
      //导出keystore
      responseExportKeystore:function () {

        let _this = this;
        this.$ipcRenderer.on('export-keystore-back', data => {
          _this.$ipcRenderer.detach('export-keystore-back')
          if(data){
            if(data.success){
              let keystore = data.keystore;
              alert(keystore);
              console.log(keystore)
              _this.requestStoreKey(keystore);

            }else{
              if(data.errorCode == 4000){
                Toast('您输入的内容有误，请重新输入')
              }
              if(data.errorCode == 4001){
                Toast('数据初始化失败，请重试')
              }
              if(data.errorCode == 4002){
                Toast('您输入的密码有误，请重新输入')
              }
            }
          }
        })
      },

      //调用文件系统
      requestStoreKey:function (key) {
        let privateKey = {
          privateKey:key,
        }
        this.$ipcRenderer.send('store-privateKey',privateKey);
        this.responseStoreKey()
      },

      //调用文件系统
      responseStoreKey:function () {
        let _this = this;
        this.$ipcRenderer.on('store-privateKey-back', data => {
          _this.$ipcRenderer.detach('store-privateKey-back')
          if(data){
            if(_this.isKeystore){
              if(data.success){
                Toast('Keystore导出成功，请到您导出的目录查看')
                _this.closePop()
              }else{
                Toast('Keystore导出失败，再试一次吧')
              }
            }else{
              if(data.success){
                Toast('私钥导出成功，请到您导出的目录查看')
                _this.closePop()
              }else{
                Toast('私钥导出失败，再试一次吧')
              }
            }

          }
        })
      },



//      getPathName:function (e) {
////        alert(e.file)
//        console.log(e.target.value);
//      }
		}
	}
</script>
<style lang='scss' scoped>
	@import '../../scss/common.scss';
	#exportPrivateKey
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

    /* 导出私钥 */
    .export_keyaddress{
      .key_adress
      {
        &
        {
          font-size: 16px;
          line-height: 16px;
          padding-left: 174px;
          padding-top: 50px;

          text-align: left;

          color: #333;
        }
        span{
          font-size: 16px;

          display: inline-block;

          vertical-align: middle;
          width: 120px;

          color: #333;
        }
        i
        {
          color: #788cf5;
          margin-left: 10px;
        }
      }
      .private_key_path
      {
        margin-top: 52px;
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
