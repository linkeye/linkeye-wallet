import Vue from 'vue'
import Router from 'vue-router'

const login = resolve => require(['@/components/login/login.vue'], resolve);
const account = resolve => require(['@/components/account/account.vue'], resolve);
const accountName = resolve => require(['@/components/account/children/accountName.vue'], resolve);
const password = resolve => require(['@/components/account/children/password.vue'], resolve);
const privateKey = resolve => require(['@/components/account/children/privateKey.vue'], resolve);
const setResult = resolve => require(['@/components/account/setResult.vue'], resolve);
const wallet = resolve => require(['@/components/menu/menu.vue'], resolve);
const accountList = resolve => require(['@/components/accountList/accountList.vue'], resolve);
const recordsList = resolve => require(['@/components/transferRecords/recordsList.vue'], resolve);
const transferAccount = resolve => require(['@/components/transferAccount/transferAccount.vue'], resolve);

Vue.use(Router)

let router = new Router({
  history:false,
  routes: [
    {
      path:'/',
      name:'登录',
      component:login,
    },
    {
      path:'/setResult',
      name:'设置结果',
      component:setResult,
    },
    {
      path:'/wallet',
      name:'钱包',
      component:wallet,
      children:[
        {
          path:'/',
          name:'账户',
          component:accountList,
        },
        {
          path:'recordsList',
          name:'记录',
          component:recordsList,
        },
        {
          path:'transferAccount',
          name:'转账',
          component:transferAccount,
        }
      ]
    },
    {
      path:'/account',
      name:'账户',
      component:account,
      children:[
        {
          path:'/',
          name:'设置账户名',
          component:accountName,
        },
        {
          path:'password',
          name:'设置资金密码',
          component:password,
        },
      	{
      	  path:'privateKey',
      	  name:'设置私钥',
      	  component:privateKey,
      	},
      ]
    },

  ]
})

router.afterEach((to,from,next) => {
  document.title = to.name;
})
export default router;
