
<template>
	<div id="addAcount" class="animated" v-show='addCountPopShow' :class="[addCountPopShow?popShowClass:'']">
		<div class="add_acount_con">
			
		</div>
	</div>
</template>

<script>
	export default{
		props:['addCountPopShow'],
		data(){
			return {
			}
		},
		methods:{
			closePop(){
				this.$emit('closeAddCountPop',false);
			}
		}
	}
</script>
<style lang='scss' >
	@import '../../scss/common.scss';
	#addCount
	{
	    &
	    {
	        position: fixed;
	        top: 0;
	        right: 0;
	        bottom: 0;
	        left: 0;
	    }

	}


</style>