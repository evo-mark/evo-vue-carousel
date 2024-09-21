export const evoVueCarouselTwContent = ({ mode = "production" } = {}) => {
	if (mode === "production") return ["./node_modules/evo-vue-carousel/dist/**/*"];
	else return ["./node_modules/evo-vue-carousel/src/**/*"];
};
