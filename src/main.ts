import Vue from 'vue';
// import { Button, Tag, RadioGroup, RadioButton } from 'element-ui';
import { Button } from 'element-ui';
Vue.component(Button.name, Button);
// Vue.component(Tag.name, Tag);
// Vue.component(RadioGroup.name, RadioGroup);
// Vue.component(RadioButton.name, RadioButton);

import 'normalize.css';

import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
