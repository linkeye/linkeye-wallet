<template>
	<div id="setResult">
		<div class="w_account_con">
			<p>
				设置成功，请妥善保管好您的私钥文件<br>
				<!--如需备份可在LinkEye Dapp中进行导出备份-->
			</p>
			<!--<router-link to="/wallet" class="common_btn">完成</router-link>-->
      <a href="javascript:;" @click='accountResultFun' class="common_btn">完成</a>
    </div>
	</div>
</template>
<script>
  import moment from 'moment'
  import { Toast } from 'mint-ui'
  export default {
    data(){
      return {
        markReslt:''
      }
    },
    filters: {
      _formatTime(val) {
        return moment(val).fromNow();
      }
    },
    mounted: function () {

    },

    methods:{
      accountResultFun(){
        this.startRequest();
      },

      onRequestBack() {
        let _this = this;
        this.$ipcRenderer.on('mark-back', data => {
          _this.$ipcRenderer.detach('mark-back')
          if(data && data.success) {
            _this.markReslt = data.markReslt;
            _this.toNextpage();
            if(!_this.markReslt){
              Toast('后台报错，请重试或者联系Linkeye团队...');
            }else {

            }
          } else {
            Toast('后台报错，请重试或者联系Linkeye团队...');
          }
        })
      },

      startRequest() {
        this.$ipcRenderer.send('mark', "markMsg")
        this.onRequestBack();
      },

      toNextpage(){
        this.$router.push({path:'/wallet'})
      },
    }
  }
</script>

<style lang='scss' scoped>
	#setResult
	{
	    &
	    {
	        box-sizing: border-box;
	        height: 580px;
	        padding-top: 144px;
	        background: url(./img/psBg.png) no-repeat left top;
	        background-size: 100%;
	    }
	    .w_account_con
	    {
	        &
	        {
	            box-sizing: border-box;
	            width: 539px;
	            height: 392px;
	            margin: 0 auto;
	            padding-top: 107px;
	            text-align: center;
	            background: url(./img/resultBg.png) no-repeat left top;
	            background-size: contain;
	        }
	        p
	        {
	            font-size: 20px;
	            line-height: 30px;
	            margin-bottom: 97px;
	            text-align: center;
	            color: #788cf5;
	        }
	        .common_btn
	        {
	            width: 300px;
	        }
	    }
	}

</style>
