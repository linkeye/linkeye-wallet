/**
 * Created by tianxubo on 2017/11/6.
 */
import Vue from 'vue';
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const messages = {
  'CN':require('./lang/CN'),
  'EN':require('./lang/EN')
}

let lang = localStorage.getItem('language')?localStorage.getItem('language'):'CN';
localStorage.setItem('language',lang);
let i18n = new VueI18n({
  locale:lang, //语言标识
  // locale:'EN', //语言标识
  messages
});

export default i18n;



