<template xmlns="http://www.w3.org/1999/html">
    <div id="RecordList">
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
              <p class="orange_p">{{accountBalance}} LET</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="record_table">
        <div class="table_header">
          <span>时间</span>
          <span>交易金额</span>
          <span>对方账户</span>
          <span style="width: 10%">状态</span>
          <span style="width: 10%">手续费</span>
          <span>交易Hash</span>
        </div>
        <ul>
          <li v-for="elem in recordsList">
            <div>
              <p>{{elem.send_time}}</p>
            </div>
            <div>
              <p>{{elem.send_balance}}</p>
            </div>
            <div>
              <p>{{elem.account_addr_to}}</p>
            </div>
            <div style="width: 10%">
              <p>{{getStatusName(elem.send_status)}}</p>
            </div>
            <div style="width: 10%">
              <p>{{elem.service_charge}}LET</p>
            </div>
            <div>
              <p>{{elem.trans_hash}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import moment from 'moment'
  import { Toast } from 'mint-ui'
  export default {
      data(){
          return {
            recordsList:[],
            accountList:[],
            accountShowNo:0,
            isShowNameList:false,
            accountBalance:'0'
          }
      },
    filters: {
      _formatTime(val) {
        return moment(val).fromNow();
      }
    },

    mounted: function () {
      this.startRequest();
    },

    methods: {
      getStatusName:function (status) {
        if(status == 0){
          return '成功';
        }else if(status == 1) {
          return '确认中...';
        } else {
          return '失败';
        }
      },

      checkAccount:function (index,item) {
        this.accountShowNo = index;
        this.isShowNameList = false;
        this.onRequestRecords(item);
        this.onRequestBalance(item);
      },

      onRequestBalance:function (item) {
        let accountAddress = item.account_address;
        this.$ipcRenderer.send('balance',accountAddress);
        this.onresponseBalance();
      },

      onresponseBalance:function () {
        let _this = this;
        this.$ipcRenderer.on('balance-back', data => {
          if(data && data.success){
            _this.accountBalance = Number(data.accountBalance.balance)?(data.accountBalance.balance.length>9?Number(data.accountBalance.balance).toFixed(6)+'...':Number(data.accountBalance.balance).toFixed(6)):'0.000000';
          } else {
            if(data.errorCode == 1000) {
              Toast('您输入的信息有误，请重新输入');
            }
            if(data.errorCode == 1001) {
              Toast('您的网络开小差了，请检查您的网络');
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
              _this.onRequestRecords(_this.accountList[0]);
              _this.onRequestBalance(_this.accountList[0]);
            }
            if(_this.accountList == null){
              Toast('后台报错，请重试联系或者Linkeye团队...');
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

      onRequestRecords:function (item) {
        let accountId = item.account_id;
        this.$ipcRenderer.send('record',accountId);
        this.onResponseRecords();
      },

      onResponseRecords:function () {
        let _this = this;
        this.$ipcRenderer.on('record-back', data => {
          if(data && data.success){
            _this.recordsList = JSON.parse(data.recordInfo)
          } else {
            if(data.errorCode == 909) {
              Toast("数据初始化失败，请重试")
            }
            if(data.errorCode == 910) {
              Toast("数据初始化失败，请重试，重试不成功请重启钱包")
            }
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  #RecordList{
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

    .record_table{
      .table_header{
        background: #ffffff;
        text-align: center;
        color: #333333;
        height:40px;
        font-weight: 600;
        font-size: 0;
        /*display: flex;*/
        span{
          display: inline-block;
          line-height: 40px;
          font-size: 14px;
          text-align: center;
          padding:0 15px;
          box-sizing: border-box;
        }
        span:nth-child(1),span:nth-child(2),span:nth-child(3),span:nth-child(6){
          width: 20%;
        }
      }

      ul{
        li{
          /*display: flex;*/
          font-size: 0;
          padding:15px 0;
          box-sizing: border-box;
          &>div{
            /*width: 16.66%;*/
            padding:0 15px;
            box-sizing: border-box;
            display: inline-block;
            vertical-align: middle;
            font-size: 14px;
            color: #333333;
            p{
              text-align: center;
              display: inline-block;
              word-wrap: break-word;
              vertical-align: middle;
              width: 100%;
            }
          }
          &>div:nth-child(1),&>div:nth-child(2),&>div:nth-child(3),&>div:nth-child(6){
            width: 20%;
          }
        }

        li:nth-child(odd){
          background: #F6F7FE;
        }
        li:nth-child(even){
          background: #ffffff;
        }
      }
    }
  }
</style>
