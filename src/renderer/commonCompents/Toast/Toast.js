import Vue from 'vue'
let removeDom = event => {
    event.target.parentNode.removeChild(event.target);

};

import Toast from './Toast.vue'

var plugin = {}

// 插件必须要有一个install方法
plugin.install = function (Vue, options = {}) {

    // 
    const ToastController = Vue.extend(Toast)
    // 实现toast的关闭方法
    ToastController.prototype.close = function () {
        this.visible = false
        this.$el.addEventListener('transitionend', removeDom)
    }
    
    // 在Vue原型实现toast的DOM挂载、以及功能实现
    // 用户可以在Vue实例（Vue单文件就是一个Vue实例）通过this.$toast来访问以下内容
    Vue.prototype.$Toast = (option = {}) => {
         // toast实例挂载到刚创建的div
         var instance = new ToastController().$mount(document.createElement('div'))
         let duration = option.duration || options.duration || 1000;
         instance.position = option.position || options.position || 'top';
         instance.type = option.type || options.type || 'message';
         // 如果用户在Vue实例中没有设置option的属性message,则直接将option的内容作为message信息进行toast内容进行显示
         instance.message = typeof option === 'string' ? option : option.message;
         // 将toast的DOM挂载到body上
         document.body.appendChild(instance.$el);
         instance.visible = true;
         
         // 自动关闭功能的实现
         setTimeout(function () {
            instance.close()
        }, duration)
    }
}

// 最后将以上内容导出，即可在其他地方进行使用
export default plugin