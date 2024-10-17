import { useWindowSize } from "@vueuse/core";
import { pick, mapValues, isBoolean } from "lodash-es";
import { computed } from "vue";

const responsiveProperties = [
	"perPage",
	"mode",
	"autoplay",
	"wrap",
	"gap",
	"slideBy",
	"transitionSpeed",
	"pauseOnHover",
	"slideTransitionTimingClass",
	"hideNavigation",
	"hidePagination",
];

/**
 * Process the config value into the correct, expecting type
 * @param { unknown } value The config object value
 * @param { string } key The config object property key
 * @returns { unknown } The processed config value
 */
function processConfigValues(value, key) {
	const perPage = parseInt(this.perPage);
	switch (key) {
		case "perPage":
		case "transitionSpeed":
			return +value;
		case "slideBy":
			if (!value) return perPage;
			else return +value;
		case "gap":
			if (perPage === 1) return 0;
			else return +value;
		case "autoplay":
			if (!value || value === "false" || value === "0") return false;
			else if (value === true || value === "true") return 5000;
			else return +value;
		case "wrap":
		case "pauseOnHover":
		case "hideNavigation":
		case "hidePagination":
			if (value === "true") value = true;
			else if (value === "false") value = false;
			return isBoolean(value) ? value : !!value;
		default:
			return value;
	}
}

/**
 * @typedef { object } ResponsiveConfig
 * @property { boolean } autoplay The slides will automatically rotate when idle
 * @property { boolean } wrap Slides will wrap around to allow infinite scrolling
 * @property { 'gallery'|'slider' } mode The display mode for the component: gallery or slider
 * @property { number } gap The gap between slides in the viewport
 * @property { number } perPage The number of slides to show per "page"
 */

/**
 * Creates a computed config object merging the defaults with the current breakpoint
 * @param { import("vue").ComponentPropsOptions } props The base component props object
 * @returns { import("vue").ComputedRef<ResponsiveConfig> } The computed config object
 */
export const useResponsiveConfig = (props) => {
	const { width: screenWidth } = useWindowSize();
	const defaultConfig = computed(() => pick(props, responsiveProperties));
	const sortedResponsiveConfigs = computed(() =>
		Object.entries(props.responsive)
			.map(([key, obj]) => {
				return [parseInt(key), pick(obj, responsiveProperties)];
			})
			.filter((item) => isNaN(item[0]) === false)
			.sort((a, b) => b[0] - a[0]),
	);
	const currentResponsiveConfig = computed(() => {
		const current = sortedResponsiveConfigs.value.find((conf) => {
			return screenWidth.value >= conf[0];
		});
		return current ? current[1] : {};
	});

	return computed(() => {
		const mergedConfig = Object.assign({}, defaultConfig.value, currentResponsiveConfig.value);
		return mapValues(mergedConfig, processConfigValues.bind(mergedConfig));
	});
};
