<template>
	<div id="login">
		<div class="logo"></div>
		<p class="w_command_t">口令登陆 :</p>
		<div class="w_passworld_con">
			<input type="password" @keyup.enter='ClickEnter' v-model="password" name="">
			<span @click='ClickEnter'></span>
		</div>
		<p class="w_introduce">*第一次登陆口令为linkeye,登陆之后请您更改口令*</p>
	</div>
</template>
<script>
  import moment from 'moment'
  import { Toast } from 'mint-ui'
	export default {
		data(){
			return {
        password:'',
        DBAmsg:'',
        loginMsg:''
			}
		},

    mounted: function () {
      this.startRequestCreateDBA();
    },

		methods:{
      ClickEnter(){
        let password = this.password;
        if(!password){
          Toast('密码为空，请输入密码......');
          return false;
        } else {
          this.startRequestLogin();
        }
			},
      onRequestBackLogin() {
        let _this = this;
        this.$ipcRenderer.on('login-back', data => {
          _this.$ipcRenderer.detach('login-back')
          if(data && data.success) {
            _this.loginMsg = data.loginMsg;
            console.log(data.loginMsg);
//            _this.$router.push({path:'/wallet'})
            if(!_this.loginMsg){
              Toast('后台报错，请重试或者联系Linkeye团队...');
            }else {
              _this.goNext(_this.loginMsg);
            }
          } else {
            if (data.errorCode == 901) {
              Toast('您输入的登陆口令错误，请您重新输入');
            }
          }
        })
      },
      startRequestLogin() {
        this.$ipcRenderer.send('login', this.password)
        this.onRequestBackLogin()
      },


      onRequestBackCreateDBA() {
        let _this = this;
        this.$ipcRenderer.on('create-database-table-back', data => {
          _this.$ipcRenderer.detach('create-database-table-back')
          if(data && data.success) {
            _this.DBAmsg = data.DBAmsg;
            if(_this.DBAmsg == null){
              Toast('后台报错，请重试或者联系Linkeye团队...');
            }
          } else {
            if(data.errorCode == 800 || data.errorCode == 801 || data.errorCode == 802 || data.errorCode == 803) {
              Toast('数据初始化失败，请重试');
            }
          }
        })
      },
      startRequestCreateDBA() {
        this.$ipcRenderer.send('create-database-table', "createDBA")

        this.onRequestBackCreateDBA();
      },

      goNext:function(index){
        if(index == "0"){
          this.$router.push({path:'/account'})
        } else {
          this.$router.push({path:'/wallet'})
        }
      }

		}
	}
</script>
<style lang='scss' scoped>
	@import '../../scss/common.scss';
	#login
	{
	    &
	    {
	        box-sizing: border-box;
	        height: 580px;
	        padding-top: 184px;

	        background: url(./img/loginBg.png) no-repeat left top;
	        background-size: contain;
	    }
	    .logo
	    {
	        width: 178px;
	        height: 50px;
	        margin: 0 auto;

	        background: url(../../assets/Sprite.png) no-repeat 0 0;
	        background-size: 600px;
	    }
	    .w_command_t
	    {
	        font-size: 18px;
	        line-height: 18px;

	        margin-top: 68px;

	        text-align: center;

	        color: #fff;
	    }
	    .w_passworld_con
	    {
	        &
	        {
	            width: 317px;
	            margin: 31px auto 0;

	            transform: translateX(17px);;

	            @include flexCon;
	        }
	        input
	        {
	            font-size: 18px;

	            display: block;

	            height: 20px;
	            padding-bottom: 14px;
	            text-align: center;
	            color: #fff;
	            border: none;
	            border-bottom: 1px solid #fff;
	            outline: none;
	            background: none;
	            @include flexList;
	        }
	        span
	        {
	            display: block;

	            width: 20px;
	            height: 20px;
	            margin-left: 17px;

	            cursor: pointer;

	            background: url(../../assets/Sprite.png) no-repeat left -69px;
	        }
	    }
	    .w_introduce
	    {
	        font-size: 14px;
	        line-height: 14px;

	        margin-top: 39px;

	        text-align: center;

	        color: #fff;
	    }
	}

</style>
