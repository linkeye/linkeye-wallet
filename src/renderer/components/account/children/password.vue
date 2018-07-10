<template>
	<div id="password">

		<h3><span>请设置您的资金密码</span>用于转账</h3>
		<div class="w_inp_con">
			<input type="password" v-model="passwd" placeholder="请输入8～16位的密码">
			<input class="w_margin_t" type="password" v-model="passwdTwo" placeholder="请确认密码">
		</div>

		<div class="w_btn_con">
			<!--<a href="javascript:;" @click='toNextpage' class="common_btn w_last_step">上一步</a>-->
			<a href="javascript:;" @click='passwordFun' class="common_btn">下一步</a>
		</div>
	</div>
</template>
<script>
  import moment from 'moment'
  import { Toast } from 'mint-ui'
	export default {
		data(){
			return {
        passwd:'',
        passwdTwo:'',
        uuid:'',
        accountsName:'',
        privateKey:'',
        keystore:''
			}
		},

    filters: {
      _formatTime(val) {
        return moment(val).fromNow();
      }
    },

		methods:{
      passwordFun:function(){
        let passwd = this.passwd;
        let passwdTwo = this.passwdTwo;
        if(!passwd){
          Toast('密码为空，请输入密码');
          return false;
        }
        if(!passwdTwo){
          Toast('确认密码为空，请输入确认密码');
          return false;
        }
        if(passwd.length <= 8){
          Toast('密码长度不够，请慎重...');
          return false;
        }
        if(passwd != passwdTwo){
          Toast('两次输入的密码不一样,请重新输入');
          return false;
        }
        this.startRequest();
      },

      onRequestBack() {
        let _this = this;
        this.$ipcRenderer.on('back-privateKey', data => {
          _this.$ipcRenderer.detach('back-privateKey');
          if(data && data.success) {
            _this.privateKey = data.privateKey;
            localStorage.setItem("address", data.privateKey.address);
            localStorage.setItem("privateKey", data.privateKey.privateKey);
            localStorage.setItem("keystore", data.privateKey.keystore);
            localStorage.setItem("ciphertextPrivateKey", data.privateKey.ciphertextPrivateKey)
            if(_this.privateKey == null){
              Toast('后台报错，请重试联系或者Linkeye团队...');
            }else {
              _this.toNextpage();
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
        localStorage.setItem("password", this.passwd);
        this.onRequestBack();
        this.$ipcRenderer.send('generate-keystore', this.passwd)
      },

			toNextpage(){
				this.$router.push({path:'/account/privateKey'})
			}
		}
	}
</script>
<style lang='scss' scoped>
	#password
	{
	    & > h3
	    {
	        &
	        {
	            font-size: 20px;
	            font-weight: normal;
	            line-height: 20px;

	            margin-top: -22px;

	            text-align: center;

	            color: #fff;
	        }
	        span
	        {
	            display: block;

	            margin-bottom: 10px;

	            text-align: center;
	        }
	    }
	    .w_inp_con
	    {
	        &
	        {
	            margin: 0 auto;
	            margin-top: 64px;
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
	        .w_margin_t
	        {
	            margin-top: 11px;
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
	            margin-top: 114px;

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
