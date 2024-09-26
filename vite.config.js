import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { libInjectCss } from "vite-plugin-lib-inject-css";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.js"),
			formats: ["es"],
		},
		rollupOptions: {
			external: ["vue"],
		},
	},
	css: {
		postcss: {},
	},
	plugins: [vue(), libInjectCss()],
});
