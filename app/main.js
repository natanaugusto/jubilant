import 'vuetify/styles';
import { createApp } from 'vue';
import App from './App.vue';
import routes from './routes';
import vuetify from './vuetify';

const app = createApp(App)
.use(routes)
.use(vuetify);

app.mount('#app');