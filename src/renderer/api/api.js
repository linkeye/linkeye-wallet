/**
 * Created by tianxubo on 2017/5/10.
 */
import axios from 'axios'
import config from './config'
import router from '../router';
import {Toast, Indicator} from 'mint-ui';
import Vue from 'vue'
import Vuex from 'vuex'
import store from '../store' //引入store控制计算改变利息值
// import

// let cancelToken = new
Vue.use(Vuex)
class API {
  static HJTOKENTYPE = 'LET'; //黄金矿工默认花费token


  static ERROR = '0015';   //找不到页面昂
  static NOTLOGIN = '0018'; //登录失效码
  static SUCCESS = '2000000000'; //成功码

  static retCode = 'code' //返回json字串code
  static result = 'data' //返回json字串data
  static retMsg = 'message' //返回json字串msg


  /**
   * [ajax请求方法]
   * @author tianxubo
   * @param config [请求参数配置]
   * @param sucsFun [请求成功回调]
   */
  apiFun(config, sucsFun,isNotLoading,failFun) {
    let instance = axios.create();

    //isNotLoading 是否不添加默认Loading
    if(!isNotLoading){
      Indicator.open({
        spinnerType: 'fading-circle'
      });
    }
    // else{
    //   store.commit('setIsBack',true)
    // }
    //拦截器的配置
    instance.interceptors.response.use(function (res) {
      // let resData = JSON.stringify(res);
      let data = res.data;

      //拦截器中判断errorCode 处理后端返回的业务错误
      if (data[API.retCode]) {
        let errorCode = data[API.retCode];

        //一般错误处理
        if(errorCode == API.SUCCESS){
          return data;
          //返回正确码处理
        }else{
          return Promise.reject(data);
        }

      }else{

        return Promise.reject(res);
      }

      if(!data){
        return {success:'0000'}
      }


    });

    //请求处理 请求res先经过拦截器

    instance(config).then(
      function (res) {
        if(!isNotLoading){
         Indicator.close();
        }
        // else{
        //   store.commit('setIsBack',false)
        // }
        // loadBorder.close();
        sucsFun(res);
      }
    ).catch(
      function (error) {

        // loadBorder.close();
        Indicator.close();
        if(error[API.retCode]){  //如果有错误码，不走通用错误通道
          if(failFun){
            failFun(error);
          }else if(error[API.retCode] == API.NOTLOGIN){ //登录失效
            // router.replace({
            //   path:'/login'
            // })
            // localStorage.setItem('account','');
            // localStorage.setItem('orgNo','');
            // Notification({
            //   showClose:false,
            //   message: '登录失效,请重新登录',
            //   type: 'warning'
            // });
            // window.location.href = '/nocard_company/login/index';
          }else{
            Toast(error[API.retMsg]);
            // Message({
            //   showClose:false,
            //   message:error[API.retMsg],
            //   type: 'error'
            // });
          }
        }else{
          store.commit('setIsBack',false); //如果为抽奖请求，移除蒙版层
          store.commit('starControl',{     //停止磁铁抖动
            isQuickMove:false,//磁铁是否快速抖动
            isCollect:false,//是否收起星星
          })
          Toast('请求出错');

        }
      }
    )
  }

  //post请求方法
  postHttp(url,params,sucsFun,isNotLoading,failFun){

    config.method = 'POST';
    config.headers['Content-Type'] = 'application/json; charset=UTF-8';
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.url  = url;
    config.data = params;
    this.apiFun(config,sucsFun,isNotLoading,failFun)
  }

  //get请求方法
  getHttp(url,params,sucsFun,isNotLoading,failFun){
    config.method = 'GET';
    config.url = url;
    config.params = params;
    this.apiFun(config,sucsFun,isNotLoading,failFun)
  }


}


export default API
