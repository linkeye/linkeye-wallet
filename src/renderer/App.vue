<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>
<script>
  import { Toast } from 'mint-ui'
  export default {
    data(){
      return{
      }
    },

    mounted(){
      this.timerFun();
    },

    methods:{
       getOnline:function (){
         this.$ipcRenderer.send('block','block');
       },

       timerFun:function () {
         let _this = this;
         setInterval(function () {
           if(window.navigator.onLine){
             _this.getOnline()
           }else{
             Toast('您的网络开小差了，请检查您的设备是否连网')
           }
         },5000)
       },
    },
    components:{
    }
  }
</script>
