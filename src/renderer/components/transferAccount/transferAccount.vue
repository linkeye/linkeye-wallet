<template>
    <div id="TransferAccount">
      <div class="record_head">
        <ul v-for="(item,index) in accountList" v-show="index == accountShowNo">
          <li>
            <span>当前账户：</span>
            <div class="check_account">
              <p @click="isShowNameList =! isShowNameList">{{ item.account_name }}</p>
              <div class="account_list" :class="isShowNameList?'active':''">
                <p v-for="(item,index) in accountList" @click="checkAccount(index,item)">{{ item.account_name }}</p>
              </div>
            </div>
          </li>
          <li>
            <span>地址：</span>
            <div class="right_div">
              <p>LET{{ item.account_address}}</p>
            </div>
          </li>
          <li>
            <span>账户余额：</span>
            <div class="right_div">
              <p class="orange_p">{{(accountBalance)}} LET</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="transfer_body">
        <ul>
          <li>
            <span>对方地址</span>
            <input v-model="toAddress" type="text">
          </li>
          <li>
            <span>转账金额</span>
            <input  v-model="sendToBalance" type="text">
          </li>
          <li>
            <span>手续费</span>
            <input v-model="sendFee" type="text" placeholder="手续费必须是在0.01-0.1范围内">
          </li>
          <li>
            <span>备注</span>
            <div class="area_div">
              <textarea v-model="sendContent"></textarea>
            </div>
          </li>
        </ul>
      </div>
      <div class="common_btn check_btn" @click="popClick">
        <span>确认</span>
      </div>
      <pwd-dialog :isDialogShow="isDialogShow" @getmsgevent="getPassword" @closeevent="closeDialog"></pwd-dialog>
    </div>
</template>

<script>
  import moment from 'moment'
  import { Toast } from 'mint-ui'
  import pwdDialog from './passwordDialog.vue'
  export default {
      data(){
        return {
          toAddress:'',
          sendToBalance:'',
          sendFee:'0.01',
          sendContent:'',
          sendHash:'',
          isDialogShow:false,
          accountId:'',
          fromAddress:'',
          password:'',
          accountList:[],
          accountShowNo:0,
          isShowNameList:false,
          accountBalance:'',
          letAddress:''
        }
      },
      mounted: function () {
        this.startRequest();
      },
      methods: {
        popClick:function () {
          let fromAddress = this.fromAddress;
          let toAddress = this.toAddress;
          let sendToBalance = this.sendToBalance;
          let sendFee = this.sendFee;
          let sendContent = this.sendContent;
          let letAddress = this.letAddress
          if(!fromAddress){
            Toast('发起转账地址不能为空，请先输入账号的地址');
            return false;
          }
          if (!toAddress) {
            Toast('转账地址为空，请先输入对方账号的地址');
            return false;
          }
          if (!sendToBalance) {
            Toast('转账金额为空，请先输入转账金额');
            return false;
          }
          if(parseFloat(sendFee) < 0.01 || parseFloat(sendFee) > 1) {
            Toast('手续费输入有误，手续费的金额必须在0.01-0.1范围内');
            return false;
          }
          if(toAddress.length != 43) {
            Toast('您输入的地址有错误');
            return false;
          }
          this.isDialogShow = true;
        },

        closeDialog:function () {
          this.isDialogShow = false;
        },

        getPassword:function (pwd) {
          this.password = pwd;
          this.requestTransfer(pwd)
        },

        requestTransfer:function (pwd) {
          let sendInfo = {
            accountId:this.accountId,
            password:pwd,
            fromAddress:this.fromAddress,
            toAddress:this.toAddress,
            sendToBalance:this.sendToBalance,
            sendFee:this.sendFee,
            sendContent:this.sendContent,
          }
          this.$ipcRenderer.send('send', sendInfo);
          this.responseTransfer()
        },

        responseTransfer:function(){
          let _this = this;
          this.$ipcRenderer.on('send-back', data => {
            if(data){
              if(data.success){
                Toast('正在打包');
                _this.$router.push({
                  path: '/wallet/recordsList',
                  query:{
                    accountId:_this.accountId
                  }
                })
                _this.isDialogShow = false;
              }else{
                if(data.errorCode == 2000) {
                  Toast("您输入的数据有误，请您检查您输入的数据");
                }

                if(data.errorCode == 2001 || data.errorCode == 2002) {
                  Toast("数据初始化失败，请重试");
                }

                if(data.errorCode == 2003) {
                  Toast("交易签名失败，请重试");
                }

                if(data.errorCode == 2004) {
                  Toast("发起转账失败，请查看你的手续费输入是否正确");
                }

                if(data.errorCode == 2005 || data.errorCode == 2006 || data.errorCode == 2007) {
                  Toast("您的网络开小差了，请检查一下您的网络");
                }

                if(data.errorCode == 2008) {
                  Toast("您输入的转账密码错误，请核对后再输入");
                }

              }
            }
          })
        },


        checkAccount:function (index,item) {
          this.accountShowNo = index;
          this.isShowNameList = false;
          this.onRequestBalance(item);
          this.fromAddress = item.account_address;
          this.accountId = item.account_id;
        },

        onRequestBalance:function (item) {
          let accountAddress = item.account_address;
          this.$ipcRenderer.send('balance',accountAddress);
          this.onresponseBalance();
        },

        onresponseBalance:function () {
          let _this = this;
          this.$ipcRenderer.on('balance-back', data => {
            _this.$ipcRenderer.detach('balance-back')
            if(data && data.success){
              _this.accountBalance = Number(data.accountBalance.balance)?(data.accountBalance.balance.length>9?Number(data.accountBalance.balance).toFixed(6)+'...':Number(data.accountBalance.balance).toFixed(6)):'0.000000';
            } else {
              if(data.errorCode == 1000) {
                Toast('前台传入的用户信息有误');
              }
              if(data.errorCode == 1001) {
                Toast('请求钱包节点数据失败，请检查您的网络');
              }
            }
          })
        },

        onRequestBack() {
          let _this = this;
          let accountId = this.$route.query.accountId?this.$route.query.accountId:'';
          this.$ipcRenderer.on('get-accounts-back', data => {
            if(data && data.success) {
              _this.accountList = JSON.parse(data.accountList)
              if(accountId){
                _this.accountList.forEach(function (item, index) {
                  if(item.account_id == accountId){
                    _this.checkAccount(index,item)
                    return false;
                  }
                })
              }else{
                _this.onRequestBalance(_this.accountList[0]);
                _this.fromAddress = _this.accountList[0].account_address; //默认当前转账地址
                _this.accountId = _this.accountList[0].account_id; //默认当前转账id
              }
              if(_this.accountList == null){
                Toast('后台报错，请重试联系或者Linkeye团队...');
              }else {
                console.log(_this.accountList);
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
        startRequest() {
          this.$ipcRenderer.send('get-accounts', "accounts");
          this.onRequestBack();
        },
      },
      components:{
        pwdDialog
      }
  }
</script>

<style lang="scss" scoped>
    /* Write your styles for the component in here */
    #TransferAccount{

      .record_head{
        background: #ffffff;
        border-bottom: 1px solid #E1E2E3;
        padding: 22px 0 22px 11px;

        ul{
          li:nth-child(1){
            margin-left:0;
            &>span{
              vertical-align: middle;
            }
            &>div{
              vertical-align: middle;
            }
          }
          li{
            display: inline-block;
            margin-left: 38px;
            vertical-align: middle;
            &>span{
              font-size: 16px;
              color: #333333;
              display: inline-block;
            }
            &>div,&>p{
              display: inline-block;
            }
            .check_account{
              display: inline-block;
              width:120px;
              height: 24px;
              background: #F6F7FE;
              border:1px solid #788CF5;
              border-radius: 3px;
              position: relative;
              cursor: pointer;
              &>p{
                color: #788CF5;
                font-size: 16px;
                line-height: 24px;
                text-align: center;
                width:120px;
                overflow:hidden; /*超出的部分隐藏起来。*/
                white-space:nowrap;/*不显示的地方用省略号...代替*/
                text-overflow : ellipsis;
              }
              .account_list.active{
                height:96px;
                border-bottom: 1px solid #788CF5;
              }
              .account_list{
                position: absolute;
                top:25px;
                width:120px;
                height:0;
                background: #F6F7FE;
                border:1px solid #788CF5;
                border-top:0 solid #788CF5;
                border-bottom: 0 solid #788CF5;
                left: -1px;
                border-radius: 0 0 3px 3px;
                transition: all 0.2s;
                overflow: auto;
                p{
                  color: #788CF5;
                  font-size: 16px;
                  line-height: 24px;
                  text-align: center;
                  cursor: pointer;
                  width:120px;
                  overflow:hidden; /*超出的部分隐藏起来。*/
                  white-space:nowrap;/*不显示的地方用省略号...代替*/
                  text-overflow : ellipsis;
                }
                p:hover{
                  background: #788CF5;
                  /*opacity: 0.2;*/
                  color: #ffffff;
                }
              }
            }

            .right_div{
              p{
                color: #788CF5;
                font-size: 16px;
                display: inline-block;
              }
              i{
                width:18px;
                height: 18px;
                background: url(./img/address_icon.png) no-repeat center;
                background-size: 100%;
                display: inline-block;
                margin-left: 20px;
                position: relative;
                top:2px;
              }
              p.orange_p{
                color: #F9A038;
              }
            }
          }
        }
      }

      .transfer_body{
        padding:0 10px;
        background:#ffffff;
        ul{
          margin-top: 22px;
          li{
            margin-top: 18px;
            span,i,input{
              display: inline-block;
            }
            &>span{
              font-size: 16px;
              color: #333333;
              height: 40px;
              line-height: 40px;
              vertical-align: middle;
              width: 70px;
            }
            &>input{
              width:300px;
              height: 40px;
              background: #F0F2FF;
              border-radius: 10px;
              border:0;
              outline: none;
              font-size: 16px;
              display: inline-block;
              vertical-align: middle;
              margin-left: 14px;
              padding:0 10px;
              box-sizing: border-box;
            }
            &>i{
              color: #788CF5;
              font-size: 16px;
              display: inline-block;
              margin-left: 14px;
              height: 40px;
              line-height: 40px;
              vertical-align: middle;
            }
            .area_div{
              display: inline-block;
              margin-left: 14px;
              vertical-align: top;
              textarea{
                width: 300px;
                height: 100px;
                background: #F0F2FF;
                border:0;
                outline: none;
                border-radius: 10px;
                padding:10px;
                box-sizing: border-box;
                display: inline-block;
              }
            }

          }
        }
      }

      .check_btn{
        width:300px;
        margin:44px auto 0;
        cursor: pointer;
      }
    }

</style>
