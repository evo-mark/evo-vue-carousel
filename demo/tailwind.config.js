import { evoVueCarouselTwContent } from "evo-vue-carousel/tailwind-dev";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,vue}", ...evoVueCarouselTwContent({ mode: "development" })],
	theme: {
		extend: {},
		container: {
			center: true,
		},
	},
};
