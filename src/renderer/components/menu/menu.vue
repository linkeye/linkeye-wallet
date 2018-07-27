<template>
	<div id="menu">
    <div class="app_region"></div>
		<a href="javascript:;" @click='chooseMenu(0)' class="w_menu_account">账户</a>
		<a href="javascript:;" @click='chooseMenu(1)' class="w_menu_record">记录</a>
		<a href="javascript:;" @click='chooseMenu(2)' class="w_menu_transfer">转账</a>

		<span :style="{left:arrowLeft+'px'}" class="w_menu_arrow"></span>

		<div class="config_con">
			<!--<a href="javascript:;" class="chain"></a>-->
			<!--<a href="javascript:;" class="panel_point"></a>-->
			<a href="javascript:;" @click='setPopShow = true' class="set"></a>
			<a href="javascript:;" class="minimize" @click="minimizeWindow"></a>
			<a href="javascript:;" @click="closeWindow"></a>
		</div>

		<router-view></router-view>
		<menuAccount :setPopShow='setPopShow' @closeSetPopFn ='closeSetPopFn'></menuAccount>
	</div>
</template>
<script>
	import menuAccount from '@/components/menu/accountSet.vue';
  const {app} = require('electron');
	export default {
		data(){
			return {
				arrowLeft:32,
				setPopShow:false,
			}
		},
		methods:{
			closeSetPopFn(a){
				this.setPopShow = false;
			},
      closeWindow:function () {
        this.$ipcRenderer.send('app-close','close');
      },
      minimizeWindow:function () {
        this.$ipcRenderer.send('window-min','min');
      },
      chooseMenu:function (index) {
        switch (index){
          case 0:
            this.arrowLeft = 32;
            this.$router.push({
              path:'/wallet'
            });
            break;
          case 1:
            this.arrowLeft = 194;
            this.$router.push({
              path:'/wallet/recordsList'
            });
            break;
          case 2:
            this.arrowLeft = 348;
            this.$router.push({
              path:'/wallet/transferAccount'
            });
            break;
          default:
            this.arrowLeft = 32;
            this.$router.push({
              path:'/wallet'
            });
            break;
        }
      }
		},
		components:{
			menuAccount
		},
    watch:{
      '$route' (to, from) {
        // 对路由变化作出响应...
        switch(to.path){
          case '/wallet':
            this.arrowLeft = 32;
            break;
          case '/wallet/recordsList':
            this.arrowLeft = 194;
            break;
          case '/wallet/transferAccount':
            this.arrowLeft = 348;
            break;
          default:
            this.arrowLeft = 32;
            break;

        }

      }
    }
	}
</script>
<style lang='scss' scoped>
	#menu
	{
	    &
	    {
	        position: relative;

	        height: 100px;

	        background: url(./img/menu.png) no-repeat left top;
	        background-size: 100%;
	    }
    .app_region{
      width:100%;
      position: absolute;
      height:80px;
      -webkit-app-region: drag;
      z-index: -1;
    }
	    &>a
	    {

          -webkit-app-region: no-drag;
	        font-size: 22px;
	        display: inline-block;
          box-sizing: border-box;
	        margin: 60px 0 19px;
	        color: #fff;
	    }
	    .w_menu_account
	    {
	        margin-left: 22px;
	    }
	    .w_menu_record
	    {
	        margin-left: 111px;
	    }
	    .w_menu_transfer
	    {
	        margin-left: 109px;
	    }
	    .w_menu_arrow
	    {
	        position: absolute;
	        bottom: -6px;
	        left: 32px;

	        width: 22px;
	        height: 11px;

	        transition: all cubic-bezier(0.19, 1, 0.22, 1) .3s;

	        background: url('../../assets/Sprite.png') no-repeat -34px -69px;
	        background-size: 600px;
	    }
	    /* 设置部分样式 */
	    .config_con {
	    	& {
	    		position: fixed;
	    		top: 10px;
	    		right: 10px;
	    		height: 16px;
	    	}
	    	a {
	    		display: inline-block;
          -webkit-app-region: no-drag;
	    		width: 16px;
	    		height: 16px;
	    		padding: 0;
	    		margin-left: 16px;
	    		background: url(../../assets/Sprite.png) no-repeat -66px -98px;
	    		background-size: 600px;
	    	}
	    	.chain {
	    		background-position: -33px -98px;
	    	}
	    	.panel_point {
	    		background-position: -97px -95px;
	    	}
	    	.set {
	    		background-position: -128px -98px;
	    	}
	    	.minimize {
	    		background-position: -162px -92px;
	    	}
	    }
	}

</style>
