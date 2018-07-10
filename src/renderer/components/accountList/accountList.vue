<template>
	<div id="accountList">
		<div class="scroller">
			<p class="w_balance">总余额: {{ totalBalance?(totalBalance.length>9?totalBalance.toFixed(6)+'...':totalBalance.toFixed(6)):'0.000000' }} LET</p>
			<ul class="w_accrount_list_con">
				<li v-for = "(acount, index ) in accountList">
					<div class="list_l">
						<span class="icon"></span>
						<div>
							<p class="w_account_name">{{acount.account_name}}</p>
							<p class="w_account_num">{{Number(accountBalance[acount.account_address])?(accountBalance[acount.account_address].length>200?Number(accountBalance[acount.account_address]).toFixed(6)+'...':Number(accountBalance[acount.account_address]).toFixed(6)):'0.000000'}} LET</p>
							<div>
								<span>LET{{acount.account_address}}</span>
								<i @click='exportDialog(acount.account_address)'></i>
                <i class="copy_i" @click="onCopy('LET' + acount.account_address)"></i>
              </div>
						</div>
					</div>
					<div class="list_r">
          <router-link :to="{path:'/wallet/transferAccount',query:{accountAddr: acount.account_address,accountId:acount.account_id}}" class="common_btn">转账</router-link>
          <p @click="openChangePassword(acount.account_address)">修改密码</p>
          </div>
        </li>
			</ul>
      <div class="w_add_account">
				<span @click='addCountPopShow = true'></span>
				<div>
					添加新的账号 或
					<i @click="isImportShow = true">导入私钥</i>
				</div>
			</div>
      <!--<div class="w_linkeye_introduce clearfix">-->
				<!--<span>Linkeye项目介绍</span>-->
				<!--<a href="javascript:;">官方链接</a>-->
			<!--</div>-->
      <!--<img src="./img/linkeyeWeb.png"/>-->
		</div>
		<exportPrivateKey :isPrivateKeyShow='isPrivateKeyShow' :accountAddress="exportAddress" @closePrivateKeyShow='closePrivateKeyShow'></exportPrivateKey>
		<addAcount :addCountPopShow='addCountPopShow' @closeAddAcountPop='closeAddAcountPop'></addAcount>
    <importPrivateKey :isImportShow='isImportShow' @closeImportShow='closeImportShow'></importPrivateKey>
    <change-password :isPasswordShow='isPasswordShow' :accountAddress="exportAddress" @closePasswordShow='closePasswordShow'></change-password>
	</div>
</template>
<script>
	import exportPrivateKey from '@/components/accountList/exportPrivateKey';
  import importPrivateKey from '@/components/accountList/importAccount';
	import addAcount from '@/components/accountList/addAcount';
  import changePassword from '@/components/accountList/changePassword';
  import { Toast } from 'mint-ui'
  import accountList from "../../../main/record/accountList";
  const {clipboard} = require('electron')
	export default {
		data(){
			return{
				isPrivateKeyShow:false,
				addCountPopShow:false,
        isImportShow:false,
        isPasswordShow:false,
        exportAddress:'',
        accountList:[],
        accountBalance:{},
        totalBalance:0,
			}
		},
    mounted(){
      this.startRequest();
    },
		methods:{
      //copy success
      onCopy:function (content) {
        clipboard.writeText(content,'selection');
        Toast('复制成功')
      },

      closePasswordShow:function(){
        this.isPasswordShow = false;
      },
			closePrivateKeyShow:function(){
			   this.isPrivateKeyShow = false;
			},
			closeImportShow:function (msg) {
        this.isImportShow = false;
        if(msg){
          this.startRequest()
        }
			},
			closeAddAcountPop:function(msg){
        if(msg){
          this.startRequest()
          this.addCountPopShow = false;
        }else{
          this.addCountPopShow = false;
        }
			},

      openChangePassword:function(address){
        this.exportAddress = address
        this.isPasswordShow = true;
      },

      exportDialog:function (address) {
        this.exportAddress = address
        this.isPrivateKeyShow = true;
      },
      getAccountList:function() {
			  for(let i = 0; i < this.accountList.length; i++){
          if(window.navigator.onLine){
            this.startRequestBalance(this.accountList[i])
          }else{
            Toast('请检查您的网络设置')
          }
        }
        this.onRequestBackBalance()
      },

      onRequestBack:function() {
        let _this = this;
        this.$ipcRenderer.on('get-accounts-back', data => {
          _this.$ipcRenderer.detach('get-accounts-back')
          if(data && data.success) {
            _this.accountList = JSON.parse(data.accountList);
            if(!_this.accountList){
              Toast('后台报错，请重试联系或者Linkeye团队...');
            }else {
              _this.getAccountList();
            }
          } else {
            if(data.errorCode == 903) {
              Toast('您的输入有误，请重新输入');
            }

            if(data.errorCode == 904) {
              Toast('数据库初始化失败，您可能需要重启钱包');
            }

            if(data.errorCode == 905) {
              Toast('获取用户信息失败，请重试');
            }
          }
        })
      },

      startRequest:function() {
        this.$ipcRenderer.send('get-accounts', "accounts");
        this.onRequestBack();
      },

      onRequestBackBalance:function() {
        let _this = this;
        this.$ipcRenderer.on('balance-back', data => {
          if(data && data.success) {
            let reData = data;
            if(data == null){
              Toast('后台报错，请重试联系或者Linkeye团队...');
            }else {
              _this.accountBalance[reData.accountBalance.address] = reData.accountBalance.balance
              _this.accountList[0].account_name = _this.accountList[0].account_name+' ';
              _this.totalBalanceFn();
            }
          } else {
            if(data.errorCode == 1000) {
              Toast('您输入的信息有误，请核对后再输入');
            }
            if(data.errorCode == 1001) {
              Toast('您的网络开小差了，请检查您的网络');
            }
          }
        })
      },
      totalBalanceFn:function(){
        this.totalBalance = 0;
			  for(var item in this.accountBalance){
			    this.totalBalance += Number(this.accountBalance[item]);
        }
      },

      startRequestBalance:function(item) {
        this.$ipcRenderer.send('balance', item.account_address);
      },
		},

		components:{
			exportPrivateKey,
			addAcount,
      importPrivateKey,
      changePassword
		}
	}
</script>
<style lang='scss' scoped>
	@import '../../scss/common.scss';
	#accountList
	{
	    .w_balance
	    {
	        font-size: 16px;
	        line-height: 16px;
	        margin-top: 10px;
	        padding-right: 10px;
	        padding-bottom: 11px;
	        text-align: right;
	        color: #f93;
	        border-bottom: 1px solid #e1e2e3;
	    }

	    .w_accrount_list_con li
	    {
	        &
	        {
	            padding: 20px 10px 13px 11px;
	            border-bottom: 1px solid #e1e2e3;
	            @include flexCon;
	            align-items: center;
	        }
	        & > div
	        {
	            @include flexList;
	            @include flexCon;
	            align-items: center;
	        }

	        .list_l
	        {
	            & > span
	            {
	                display: block;
	                width: 48px;
	                height: 48px;
	                margin-right: 33px;
	                background: url(./img/accountLogo.png) no-repeat left top;
	                background-size: contain;
	            }
	            & > div
	            {
	                &
	                {
	                    @include flexList;
	                }
	                & > p
	                {
	                    font-size: 20px;
	                    line-height: 20px;
	                    margin-bottom: 13px;
	                }
	                .w_account_name
	                {
	                    color: #333;
	                }
	                .w_account_num
	                {
	                    margin-bottom: 7px;
	                    color: #f9a038;
	                }
	                div
	                {
	                    vertical-align: bottom;
	                }
	                div span
	                {
	                    font-size: 14px;
	                    line-height: 21px;
	                    display: inline-block;
	                    vertical-align: bottom;
	                    color: #999;
	                }
	                div i
	                {
	                    display: inline-block;
	                    width: 20px;
	                    height: 20px;
	                    margin-left: 21px;
	                    vertical-align: bottom;
	                    background: url(../../assets/Sprite.png) no-repeat -71px -69px;
	                    background-size: 600px;
                      cursor: pointer;
	                }
                  div>i.copy_i{
                    margin-left: 5px;
                    background: url(./img/address_icon.png) no-repeat center;
                  }
	            }
	        }
        .list_r{
          width: 140px;
          display: block;
          text-align: center;
          a{
            display: block;
          }
          p{
            text-align: center;
            display: inline-block;
            margin-top: 15px;
            color: #788cf5;
            padding-bottom: 2px;
            border-bottom: 1px solid #788cf5;
            cursor: pointer;
          }
        }
	    }

	    .w_add_account
	    {
	        &
	        {
	            padding: 26px 0 27px 11px;
	            vertical-align: middle;
	            border-bottom: 1px solid #e1e2e3;
	            cursor: pointer;
	        }
	        & > span
	        {
	            display: inline-block;
	            width: 49px;
	            height: 49px;
	            margin-right: 33px;
	            vertical-align: middle;
	            background: url('../../assets/Sprite.png') no-repeat 0 -129px;
	            background-size: 600px;
	        }
	        & > div
	        {
	            font-size: 16px;
	            line-height: 16px;
	            display: inline-block;
	            vertical-align: middle;
	            color: #999;
	        }
	        & > div i
	        {
	            color: #788cf5;
	        }
	    }

	    .w_linkeye_introduce
	    {
	        &
	        {
	            font-size: 22px;
	            line-height: 22px;
	            padding: 25px 10px 0 11px;
	            color: #333;
	        }
	        span
	        {
	            font-weight: bold;
	        }
	        a
	        {
	            font-size: 16px;
	            line-height: 22px;
	            float: right;
	            color: #788cf5;
	        }
	    }

    .password_view{
      position: absolute;
      z-index: 1000;
    }
	}

</style>
