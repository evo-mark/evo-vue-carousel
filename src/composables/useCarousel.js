import { provide, inject, ref, readonly } from "vue";
import { useResponsiveConfig } from "./useResponsiveConfig";
import { checkPosition } from "../utils/checkPosition";
import { useElementHover } from "@vueuse/core";

const configKey = Symbol.for("evo-vue-carousel__config");
const slideCountKey = Symbol.for("evo-vue-carousel__slide-count");
const currentIndexKey = Symbol.for("evo-vue-carousel__current-index");
const isHoveredKey = Symbol.for("evo-vue-carousel__is-hovered");
const isNavigatingKey = Symbol.for("evo-vue-carousel__is-navigating");

export const useCarouselHost = (props, slideCount, sliderRef) => {
	const isNavigating = ref(false);
	const config = useResponsiveConfig(props);
	const currentIndex = ref(checkPosition(props.initialIndex, slideCount.value, config));
	const isHovered = useElementHover(sliderRef, {
		delayEnter: +props.hoverDelayEnter,
		delayLeave: +props.hoverDelayLeave,
	});

	provide(configKey, config);
	provide(slideCountKey, readonly(slideCount));
	provide(currentIndexKey, currentIndex);
	provide(isHoveredKey, isHovered);
	provide(isNavigatingKey, isNavigating);

	return {
		config,
		currentIndex: readonly(currentIndex),
		isHovered,
	};
};

export const useCarouselClient = () => {
	const config = inject(configKey);
	const currentIndex = inject(currentIndexKey);
	const slideCount = inject(slideCountKey);
	const isHovered = inject(isHoveredKey);
	const isNavigating = inject(isNavigatingKey);
	const setCurrentIndex = (newIndex) => {
		currentIndex.value = checkPosition(newIndex, slideCount.value, config);
	};
	const setIsNavigating = (value) => {
		isNavigating.value = value;
	};

	return {
		config,
		currentIndex: readonly(currentIndex),
		setCurrentIndex,
		slideCount,
		isHovered,
		isNavigating: readonly(isNavigating),
		setIsNavigating,
	};
};
