import EvoCarouselPlugin from "evo-vue-carousel/tailwind-dev";

/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {},
		container: {
			center: true,
		},
	},
	plugins: [EvoCarouselPlugin({ content: ["./index.html", "./src/**/*.{js,ts,vue}"] })],
};
