import TailwindPlugin from "tailwindcss/plugin.js";

export default TailwindPlugin.withOptions(
	() => () => {},
	({ content } = {}) => {
		content ??= [];
		return {
			content: [
				...content,
				"./node_modules/evo-vue-carousel/dist/**/*",
				"./node_modules/evo-vue-carousel/src/**/*",
			],
		};
	},
);
