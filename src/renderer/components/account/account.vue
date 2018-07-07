<template>
	<div id="account">
		<div class="w_account_con">
			<router-view></router-view>	
		</div>
	</div>
</template>
<style lang='scss' scoped>
	#account
	{
	    &
	    {
	        box-sizing: border-box;
	        height: 580px;
	        padding-top: 50px;

	        background: url(./img/psBg.png) no-repeat left top;
	        background-size: 100%;
	    }
	    .w_account_con
	    {
	        box-sizing: border-box;
	        width: 539px;
	        height: 486px;
	        margin: 0 auto;
	        padding: 62px 21px 21px 16px;

	        background: url(./img/accountBg.png) no-repeat left top;
	        background-size: contain;
	    }
	}

</style>