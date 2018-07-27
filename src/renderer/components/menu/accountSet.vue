<template>
	<div id="accountSet" v-show='setPopShow' class="animated" :class="[setPopShow?popShowClass:'']">
		<div class="account_set_pop_con">
			<div class="account_set_h">
				<a href="javascript:;" class="w_margin_r" :class='{"active":setIndex == 0}' @click='setIndex = 0'>安全</a>
				<span class="close_pop" @click='closePop'></span>
			</div>
			<div v-if='setIndex == 0'>
				<ul class="change_psw_con">
					<li>
						<span>当前登录密码:</span>
						<input type="password" v-model="oldPassword" name="">
					</li>
					<li>
						<span>新的登录密码:</span>
						<input type="password" v-model="newPassword" name="">
					</li>
					<li>
						<span>确认登录密码:</span>
						<input type="password" v-model="confirmPassword" name="">
					</li>
				</ul>
				<a href="javascript:;" @click='updatePassword' class="common_btn">修改</a>
			</div>
		</div>
	</div>
</template>
<script>
  import moment from 'moment'
  import { Toast } from 'mint-ui'
	export default {
		props:['setPopShow'],
		data(){
			return {
				setIndex:0,
        oldPassword:'',
        newPassword:'',
        confirmPassword:'',
        normalSettingMsg:''
			}
		},
    filters: {
      _formatTime(val) {
        return moment(val).fromNow();
      }
    },
		methods:{
			closePop(){
				this.$emit('closeSetPopFn',false)
        this.oldPassword = ""
        this.newPassword = ""
        this.confirmPassword = ""
			},

      updatePassword:function(){
        let oldPassword = this.oldPassword;
        if(!oldPassword){
          Toast('当前密码为空，请输入密码');
          return false;
        }

        let newPassword = this.newPassword;
        if(!newPassword){
          Toast('新密码为空，请输入新密码');
          return false;
        }

        let confirmPassword = this.confirmPassword;
        if(!confirmPassword){
          Toast('确认密码为空，请输入确认密码');
          return false;
        }
        if(newPassword != confirmPassword) {
          Toast('两次输入的密码不一样，请确认');
          return false;
        }
        this.startRequest();
        this.onRequestBack();
      },

      onRequestBack() {
        let _this = this;
        this.$ipcRenderer.on('normal-setting-back', data => {
          if(data && data.success) {
            _this.normalSettingMsg = data.normalSettingMsg;
            if(_this.normalSettingMsg == null){
              Toast('后台报错，请重试或者联系Linkeye团队...');
            }else {
              Toast('修改密码成功，请记住您的密码');
              _this.closePop()
            }
          } else {
            if(data.errorCode == 920) {
              Toast('数据初始化失败，请重试');
            }
            if(data.errorCode == 921) {
              Toast('您输入的原密码有误，请核对后再输入');
            }
          }
        })
      },

      startRequest() {
			  var normalSettingPd = {"oldPassword":this.oldPassword, "newPassword":this.newPassword}
        this.$ipcRenderer.send('normal-setting', normalSettingPd)
      },
		}
	}
</script>
<style lang='scss' >
	@import '../../scss/common';
	#accountSet {
		& {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}
		&.animated {
			animation-duration: .4s;
		}
		.account_set_pop_con {
			background: #fff;
			position: absolute;
			left: 77px;
			top: 80px;
			width: 800px;
			height: 430px;
			background: #fff;
			border-radius: 10px;
			box-shadow:2px 2px 20px rgba(51,102,255,0.4);
		}
		.account_set_h {
			& {
				height: 64px;
				line-height: 64px;
				border-bottom: 1px solid #DEDEDE;
				padding-left: 26px;
				position: relative;
			}
			a {
				font-size: 22px;
				color: #666;
			}
			.w_margin_r {
				margin-right: 38px;
			}
			.active {
				color: #788CF5;
			}
			.close_pop {
				position: absolute;
				right: 6px;
				top: 6px;
				width: 16px;
				height: 16px;
				background: url(../../assets/Sprite.png) no-repeat -195px -98px;
				background-size: 600px;
				cursor: pointer;
        -webkit-app-region: no-drag;
			}
		}
		.change_psw_con {
			& {
				margin-top: 34px;
			}
			li {
				& {
					margin: 0 auto 10px;
					width: 380px;
					align-items:center;
					@include flexCon;
				}
				span {
					display: block;
					width: 120px;
					font-size: 16px;
					color: #333;
				}
				input {
					display: block;
					@include flexList;
					border: none;
					outline: none;
					background: #F0F2FF;
					height: 40px;
					line-height: 40px;
					text-align: center;
					color: #333;
				}
			}
		}
		.common_btn {
			width: 300px;
			margin-top: 66px;
			height: 48px;
			line-height: 48px;
			background: #788CF5;
		}
		.currency_set {
			&>div {
				& {
					margin-top: 87px;
					text-align: center;
					font-size: 22px;
					color: #666;
				}
				a {
					color: #788CF5;
				}
			}
			.common_btn {
				background: #788CF5;
				margin-top: 132px;
			}
		}
	}
</style>
