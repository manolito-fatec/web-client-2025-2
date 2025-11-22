import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'


import App from './App.vue'
import './index.css'
import router from './router'
import {definePreset} from "@primeuix/themes";
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import 'primeicons/primeicons.css';

const app = createApp(App)
const pardalPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{neutral.50}',
      100: '{neutral.100}',
      200: '{neutral.200}',
      300: '{neutral.300}',
      400: '{neutral.400}',
      500: '{neutral.500}',
      600: '{neutral.600}',
      700: '{neutral.700}',
      800: '{neutral.800}',
      900: '{neutral.900}',
      950: '{neutral.950}'
    }
  },
  options: {
    darkMode: false
  }
})

app.use(createPinia())
app.use(router)
app.use(ToastService);
app.use(ConfirmationService);
app.component('ConfirmDialog', ConfirmDialog);
app.use(PrimeVue, {
  theme: {
    preset: pardalPreset,
    options: {
      darkModeSelector: false
    }
  }
});
app.mount('#app')
