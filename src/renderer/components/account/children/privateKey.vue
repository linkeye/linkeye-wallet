<template>
	<div id="privateKey">

		<h3>请设置你的私钥文件及区块保存路径</h3>

		<div class="w_inp_con">
      <p>账户地址：<span>LET{{account_address}}</span> </p>
		</div>
		<div class="w_select_key">
			<!--<a href="javascript:;"><input type="file">选择路径</a>-->
		</div>

    <p class="w_key_title">私钥是你唯一凭证，请备份你的私钥，</p>
		<div class="w_btn_con">
			<!--<a href="javascript:;" @click='toNextpage' class="common_btn w_last_step">上一步</a>-->
			<!--<router-link to='/setResult' href="javascript:;" class="common_btn">下一步</router-link>-->
      <a href="javascript:;" @click='generateAccountFun' class="common_btn">备份私钥</a>

    </div>
	</div>
</template>
<script>
  import moment from 'moment'
  import { Toast } from 'mint-ui'
	export default {
		data(){
			return {
			  account_id:'',
        account_name:'',
        account_passwd:'',
        account_address:'',
        account_private_key:'',
        account_ciphertext_private_key:'',
        generateMsg:'',
        keystore:''
			}
		},

    filters: {
      _formatTime(val) {
        return moment(val).fromNow();
      }
    },

    mounted() {
      this.account_address = localStorage.getItem("address");
      this.getPrivateKeyFromLastPage()
//      this.onRequestBack();
//      this.responseStoreKey();
    },

		methods:{
      getPrivateKeyFromLastPage() {
        this.account_private_key = localStorage.getItem("privateKey");
      },
			toNextpage(){
				this.$router.push({path:'/setResult'})
			},
      generateAccountFun(){
        this.account_id = localStorage.getItem("uuid");
        this.account_name = localStorage.getItem("accounts-name")
        this.account_passwd = localStorage.getItem("password");
        this.account_address = localStorage.getItem("address");
        this.keystore = localStorage.getItem("keystore");
        this.account_ciphertext_private_key = localStorage.getItem("ciphertextPrivateKey");
        this.requestStoreKey(this.account_private_key)
      },

      requestStoreKey:function (key) {
        let privateKey = {
          privateKey:key
        }
        this.$ipcRenderer.send('store-privateKey',privateKey);
        this.responseStoreKey();
      },

      responseStoreKey:function () {
        let _this = this;
        this.$ipcRenderer.on('store-privateKey-back', data => {
          _this.$ipcRenderer.detach('store-privateKey-back')
          if(data){
            if(data.success){
              Toast('私钥导出成功，请到您导出的目录查看')
              _this.startRequest()
            }else{
              if(data.errorCode == 701) {
                Toast('私钥导出写入文件失败，请再试一次吧');
              }
            }
          }
        })
      },

      onRequestBack() {
        let _this = this;
        this.$ipcRenderer.on('generate-account-back', data => {
          _this.$ipcRenderer.detach('generate-account-back')
          if(data && data.success) {
            _this.generateMsg = data.generateMsg;
            if(_this.generateMsg == null){
              Toast('后台报错，请重试联系或者Linkeye团队...');
            }else {
              _this.toNextpage();
            }
          } else {
            if(data.errorCode == 300) {
              Toast('您输入有误，请重新输入');
            }
            if(data.errorCode == 301) {
              Toast('数据库初始化失败');
            }
            if(data.errorCode == 302) {
              Toast('创建account表失败');
            }
          }
        })
      },
      startRequest() {
        var accountJson = {"account_id":this.account_id, "account_name":this.account_name,
          "account_passwd":this.account_passwd, "account_address":this.account_address,
          "keystore":this.keystore, "account_ciphertext_private_key":this.account_ciphertext_private_key}
        this.$ipcRenderer.send('generate-account', accountJson)
        this.onRequestBack()
      },
    }
	}
</script>
<style lang='scss' scoped>
	#privateKey
	{
	    & > h3
	    {
	        font-size: 20px;
	        font-weight: normal;
	        text-align: center;
	        color: #fff;
	    }
	    .w_key_title
	    {
	        font-size: 20px;
	        line-height: 20px;
	        width: 426px;
	        margin: 60px auto 0;
	        color: #333;
        text-align: center;
	    }
	    .w_select_key
	    {
	        &
	        {
	            width: 426px;
	            margin: 15px auto 0;
	            text-align: right;
	        }
	        a
	        {
            font-size: 16px;
            line-height: 16px;
            color: #788cf5;
            position: relative;
            input{
              position: absolute;
              width: 100%;
              display: block;
              left: 0;
              top: 0;
              bottom: 0;
              opacity: 0;
              cursor: pointer;
              font-size: 0;
            }
	        }
	    }
	    .w_inp_con
	    {
        margin-top: 74px;
        p{
          font-size: 18px;
          color: #333333;
          text-align: center;
          span{
            color: #788cf5;
          }

        }
	        input
	        {
	            font-size: 18px;
	            line-height: 48px;

	            display: block;

	            width: 426px;
	            height: 48px;
	            margin: 0 auto;

	            text-indent: 15px;

	            color: #333;
	            border: none;
	            border-radius: 5px;
	            outline: none;
	            background: #f0f2ff;
	        }
	        input::-webkit-input-placeholder,
	        textarea::-webkit-input-placeholder
	        {
	            font-size: 18px;

	            color: #ccc;
	        }
	        input:-moz-placeholder,
	        textarea:-moz-placeholder
	        {
	            font-size: 18px;

	            color: #ccc;
	        }
	        input::-moz-placeholder,
	        textarea::-moz-placeholder
	        {
	            font-size: 18px;

	            color: #ccc;
	        }
	        input:-ms-input-placeholder,
	        textarea:-ms-input-placeholder
	        {
	            font-size: 18px;

	            color: #ccc;
	        }
	    }
	    .w_btn_con
	    {
	        &
	        {
	            margin-top: 106px;

	            text-align: center;
	        }
	        a
	        {
	            display: inline-block;
	        }
	        .w_last_step
	        {
	            margin-right: 99px;

	            background: #999;
	        }
	    }
	}


</style>

