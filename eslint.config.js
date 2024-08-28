import configPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";

export default [
	js.configs.recommended,
	jsdoc.configs["flat/recommended"],
	...pluginVue.configs["flat/recommended"],
	configPrettier,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			"vue/multi-word-component-names": "off",
			"vue/valid-v-slot": "off",
		},
	},
	{
		files: ["src/**/*.js", "src/**/*.vue"],
		plugins: {
			jsdoc,
		},
		rules: {
			"jsdoc/require-description": "warn",
		},
	},
];
