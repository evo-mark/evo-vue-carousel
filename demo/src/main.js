import { createSSRApp } from "vue";
import App from "./App.vue";
import "./index.postcss";

createSSRApp(App).mount("#app");
