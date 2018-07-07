<template>
    <transition name='fade'>
        <div v-show='visible' :class='position+" "+type ' class='toast' >
            <i>{{message}}</i>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                message : '',
                position : '',
                type:'message'
            };
        },
        mounted(){

        },
        methods:{
            initToastType:function(){

            }
        }
    }
</script>


<style lang='scss' scoped>
    .toast {
        position:fixed;
        background: rgba(0,0,0,0.7);
        padding: (20rem/75);
        color: #fff;
        font-size: 13px;
        left: 50%;
        top: 50%;
        transform:translate3d(-50%,-50%,0) scale(1);
        border-radius: 10px;
        z-index: 1000;
    }
    .fade-enter-active, .fade-leave-active {
      transition: transform cubic-bezier(0.23, 1, 0.32, 1) .3s;
    }
    .fade-enter, .fade-leave-active {
      transform:translate3d(-50%,-50%,0) scale(1.3);
    }
</style>
