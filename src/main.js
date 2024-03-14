import "./style.css";
import "./base.scss";
import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Wind from "./presets/wind/index.js";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import App from "./App.vue";
import primeVue from "./utils/primeVue.js";
import helpers from "./utils/helper.js";
import dayjs from "dayjs";
import "dayjs/locale/es-mx.js";

dayjs.locale("es-mx");

const app = createApp(App);
app.use(createPinia());
app.use(PrimeVue, {
  unstyled: true,
  pt: Wind,
});
app.config.globalProperties.$dayjs = dayjs;
app.use(router);
app.use(primeVue);
app.use(helpers);
app.use(VueSweetalert2, { confirmButtonColor: "#1f7f5c" });
app.mount("#app");
