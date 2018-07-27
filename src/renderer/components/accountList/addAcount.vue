
<template>
	<div id="addAcount" class="animated" v-if='addCountPopShow' :class="[addCountPopShow?popShowClass:'']">
		<div class="add_acount_con">

			<span class="close_btn" @click='closePop(0)'></span>

			<!-- 添加账户名称 -->
			<div class="add_account_name" v-if='step == 1'>
				<h3>请设置您的名称</h3>
				<input type="text" v-model="accountName" placeholder="请输入字母与数字">
				<a href="javascript:;" class="common_btn" @click='nextStep(1)'>下一步</a>
			</div>

      <!-- 输入密码设置密码 -->
      <div class="set_password" v-if='step == 2'>
        <h3>请设置您的资金密码，用于转账</h3>
        <input type="password" v-model="password" placeholder="请输入字母与数字">
        <input type="password" v-model="repeatPassword" placeholder="请输入字母与数字">
        <a href="javascript:;" class="common_btn" @click='nextStep(2)'>下一步</a>
      </div>

			<!-- 设置成功 -->
			<div class="add_scss" v-if='step == 3'>
				<h3>设置成功，点击完成进行私钥备份</h3>
				<div>
					<span>新建账户地址：</span>
					<!--<input type="text" name="" placeholder="请输入字母与数字">-->
          <p>LET{{address}}</p>
				</div>
				<a href="javascript:;" class="common_btn" @click="commitAccount">完成</a>
			</div>

		</div>
	</div>
</template>

<script>
  import { Toast } from 'mint-ui'
  let testPwd = /^[a-zA-Z0-9]{6,18}$/;
	export default{
		props:['addCountPopShow'],
		data(){
			return {
				step:1,
        accountName:'',
        accountNameBackMsg:'', //uuid
        password:'',
        repeatPassword:'',
        privateKey:'',
        address:'',
        keystore:'',
        ciphertextPrivateKey:'',
			}
		},
		mounted:function () {
    },
		methods:{
			nextStep(index){
        if(index == 1){
          if(!this.accountName){
            Toast('请输入你新建账户的名称');
            return false
          }
          this.requestAddAccountname()
        }else if(index == 2){
          if(!this.password){
            Toast('请输入您的密码');
            return false
          }
          if(!testPwd.test(this.password)){
            Toast('请输入6-18位密码，支持英文，数字');
            return false
          }
          if(!this.repeatPassword){
            Toast('请再次输入您的密码');
            return false
          }
          if(this.repeatPassword != this.password){
            Toast('两次输入密码不一致');
            return false
          }

          this.startRequest();
        }

			},

      //点击完成
      commitAccount:function () {
        this.requestStoreKey();
      },

      requestCommitAccount:function () {
        var accountJson = {
          "account_id":this.accountNameBackMsg,
          "account_name":this.accountName,
          "account_passwd":this.password,
          "account_address":this.address,
          "keystore":this.keystore,
          "account_ciphertext_private_key":this.ciphertextPrivateKey
        }
        this.$ipcRenderer.send('generate-account', accountJson)
        this.responseCommitAccount();
      },
      responseCommitAccount:function () {
        let _this = this;
        this.$ipcRenderer.on('generate-account-back', data => {
          _this.$ipcRenderer.detach('generate-account-back')
          if(data && data.success) {
            _this.generateMsg = data.generateMsg;
            if(_this.generateMsg == null){
              Toast('后台报错，请重试联系或者Linkeye团队...');
            }else {
              _this.closePop(1)
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

      requestStoreKey:function () {
        let privateKey = {
          privateKey:this.privateKey
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
              _this.requestCommitAccount()
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

        this.$ipcRenderer.on('back-privateKey', data => {
          _this.$ipcRenderer.detach('back-privateKey')
          if(data && data.success) {
            _this.privateKey = data.privateKey.privateKey;
            _this.address = data.privateKey.address
            _this.keystore = data.privateKey.keystore
            _this.ciphertextPrivateKey = data.privateKey.ciphertextPrivateKey
            if(_this.privateKey == null){
              Toast('后台报错，请重试联系或者Linkeye团队...');
            }else {
              _this.step = 3
            }
          } else {
            if(data.errorCode == 201){
              Toast('您输入的密码为空');
            }
            if(data.errorCode == 202) {
              Toast('生成keystoress失败');
            }
          }
        })
      },
      startRequest() {
        this.$ipcRenderer.send('generate-keystore', this.password)
        this.onRequestBack()
      },

      responseAddAccountname() {
        let _this = this;
        this.$ipcRenderer.on('account-name-back', data => {
          _this.$ipcRenderer.detach('account-name-back')
          if(data && data.success) {
            _this.accountNameBackMsg = data.succMsg;
            if(_this.accountNameBackMsg == null){
              Toast('后台报错，请重试或者联系Linkeye团队...');
            }else {
              _this.step = 2
            }
          } else {
            if(data.errorCode == 100)
            {
              Toast('您输入的用户名为空');
            }
          }
        })
      },
      requestAddAccountname() {
        this.$ipcRenderer.send('account-name', this.accountName)
        this.responseAddAccountname();
      },

			closePop(index){
//        alert(111)
        if(index){
          this.$emit('closeAddAcountPop',true);
        }else{

          this.$emit('closeAddAcountPop',false);
        }
				this.step = 1;
        this.accountName = ''
        this.accountNameBackMsg = '',//uuid
        this.password = '',
        this.repeatPassword = ''
        this.privateKey = ''
        this.address = ''
        this.keystore = ''
        this.ciphertextPrivateKey = ''
			}


		}
	}
</script>
<style lang='scss' >
	@import '../../scss/common.scss';
	#addAcount
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
	    .add_acount_con
	    {
	        &
	        {
              -webkit-app-region: no-drag;
	            position: relative;
              outline: none;
	            top: 80px;
	            left: 77px;

	            width: 800px;
	            height: 430px;

	            border-radius: 10px;
	            background: #fff;
	            box-shadow: 2px 2px 20px rgba(74,79,245,.4);
	        }
	        .close_btn
	        {
	            position: absolute;
              -webkit-app-region: no-drag;
	            top: 7px;
	            right: 7px;

	            width: 16px;
	            height: 16px;
            z-index:1000;
	            background: url(../../assets/Sprite.png) no-repeat -196px -98px;
              cursor: pointer;
	        }
	    }

	    /* 添加账户名称 */
	    .add_account_name
	    {
	        &
	        {
	            padding-top: 62px;

	            text-align: center;
	        }
	        h3
	        {
	            font-size: 22px;
	            line-height: 22px;

	            margin-bottom: 70px;

	            text-align: center;

	            color: #788cf5;
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
	            border-radius: 10px;
	            outline: none;
	            background: rgba(240,242,255,1);
	        }
	        .common_btn
	        {
	            width: 300px;
	            margin-top: 84px;
	        }
	    }

    /* 设置密码 */
    .set_password{
      padding-top: 62px;

      text-align: center;
      h3
      {
        font-size: 22px;
        line-height: 22px;

        margin-bottom: 70px;

        text-align: center;

        color: #788cf5;
      }
      input{
        font-size: 18px;
        line-height: 48px;

        display: block;
        width: 426px;
        height: 48px;
        margin: 20px auto 0;

        text-indent: 15px;

        color: #333;
        border: none;
        border-radius: 10px;
        outline: none;
        background: rgba(240,242,255,1);
      }
      .common_btn
      {
        width: 300px;
        margin-top: 54px;
      }
    }
	    /* 添加账户名称END */

	    /* 設置成功 */
	    .add_scss
	    {
	        &
	        {
	            padding-top: 82px;

	            text-align: center;
	        }
	        h3
	        {
	            font-size: 22px;
	            line-height: 22px;

	            text-align: center;

	            color: #788cf5;
	        }
	        div
	        {
	            margin-top: 59px;

	            text-align: center;
	            vertical-align: middle;
	        }
	        input
	        {
	            font-size: 18px;
	            line-height: 40px;

	            display: inline-block;

	            width: 300px;
	            height: 40px;
	            margin: 0 auto;

	            vertical-align: middle;
	            text-indent: 15px;

	            color: #333;
	            border: none;
	            border-radius: 10px;
	            outline: none;
	            background: rgba(240,242,255,1);
	        }
          p{
            font-size: 16px;
            color: #788cf5;
            text-align: center;
            margin-top: 20px;
          }
	        span
	        {
	            font-size: 16px;

	            display: inline-block;

	            vertical-align: middle;

	            color: #333;
	        }
	        .common_btn
	        {
	            width: 300px;
	            margin-top: 64px;
	        }
	    }

	    /* 設置成功END */
	}



</style>
