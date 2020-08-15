import Vue from 'vue';

import { Button, RadioGroup, RadioButton, Tag } from 'element-ui';
Vue.component(Button.name, Button);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(RadioButton.name, RadioButton);
Vue.component(Tag.name, Tag);

import 'normalize.css';

import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
