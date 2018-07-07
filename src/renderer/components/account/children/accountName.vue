<template>
	<div id="accountName">
		<h3>请设置您的名称</h3>
		<div class="w_inp_con">
			<input type="text" v-model="accountsName" placeholder="请输入字母与数字">
		</div>
		<div class="w_btn_con">
			<!--<a href="javascript:;" @click='toNextpage' class="common_btn w_last_step">上一步</a>-->
			<a href="javascript:;" @click='accountNameFun' class="common_btn">下一步</a>
		</div>
	</div>
</template>
<script>
  import moment from 'moment'
  import { Toast } from 'mint-ui'
  export default {
		data(){
			return {
        accountsName:'',
        accountNameBackMsg:''
			}
		},
    filters: {
      _formatTime(val) {
        return moment(val).fromNow();
      }
    },
		methods:{
      accountNameFun:function(){
        let accountsName = this.accountsName;
        if(!accountsName){
          Toast('请先输入用户名');
          return false;
        }
        localStorage.setItem("accounts-name", accountsName);
        this.startRequest();
      },
      onRequestBack() {
        let _this = this;
        this.$ipcRenderer.on('account-name-back', data => {
          _this.$ipcRenderer.detach('account-name-back');
          if(data && data.success) {
            _this.accountNameBackMsg = data.succMsg;
            localStorage.setItem("uuid", data.succMsg);
            if(_this.accountNameBackMsg == null){
              Toast('后台报错，请重试或者联系Linkeye团队...');
            }else {
              _this.toNextpage();
            }
          } else {
            if(data.errorCode == 100)
            {
              Toast('您输入的用户名为空');
            }
          }
        })
      },
      startRequest() {
        this.$ipcRenderer.send('account-name', this.accountsName)
        this.onRequestBack();
      },
      toNextpage(){
        this.$router.push({path:'/account/password'})
      },
		}
	}
</script>
<style lang='scss' scoped>
	#accountName
	{
	    & > h3
	    {
	        font-size: 20px;
	        font-weight: normal;

	        text-align: center;

	        color: #fff;
	    }
	    .w_inp_con
	    {
	        &
	        {
	            margin: 0 auto;
	            margin-top: 100px;
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
	            margin-top: 145px;
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
