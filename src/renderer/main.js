import Vue from 'vue';
import App from './App';
import ipcService from './plugins/ipcService';
import ElementUI from 'element-ui'
import MintUI from 'mint-ui'
import moment from 'moment';
import router from './router/index';
import store from './store/index';
import API from './api/api'
import '../../static/css/base.css';
import '../../static/css/animate.min.css';
import 'mint-ui/lib/style.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
Vue.prototype.$api = new API();

Vue.use(MintUI)
Vue.use(ipcService)
Vue.use(ElementUI)

Vue.prototype.popShowClass = 'zoomIn';

/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: { App },
  template: '<App/>',
}).$mount('#app');

moment.locale('zh-cn');
