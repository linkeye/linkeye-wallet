/**
 * Created by tianxubo on 2017/5/10.
 */
import qs from 'qs'
export default {
  transformRequest: [function (data) {
    // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
    // data = qs.stringify(data);
    data = JSON.stringify(data);
    return data;
  }],
  method:'POST',
  // baseURL:'/test/',   //测试地址
  baseURL:process.env.API_HOST, //生产地址
  url:'',
  data:{
    userId:''
  },
  timeout:15000,
  headers: { 'Content-Type':'application/x-www-form-urlencoded'},
  /* `withCredentials`指示是否跨站点访问控制请求*/
  withCredentials:false,
  /* `onUploadProgress`允许处理上传的进度事件*/
  // onUploadProgress: function(progressEvent){
  /* 使用本地 progress 事件做任何你想要做的*/
  // },
  /* `onDownloadProgress`允许处理下载的进度事件*/
  // onDownloadProgress: function(progressEvent){
  /* Do whatever you want with the native progress event*/
  // },
  /* `maxContentLength`定义允许的http响应内容的最大大小*/
  maxContentLength: 2000,
  /* 返回一个promise并提供一个有效的响应(参见[response docs](＃response-api))*/
  // cancelToken: new CancelToken(function ( )
  cancelToken: ''
  // })
}
