import { provide, inject, ref, readonly, computed } from "vue";
import { useResponsiveConfig } from "./useResponsiveConfig";
import { checkPosition } from "../utils/checkPosition";
import { useElementHover, useIntervalFn } from "@vueuse/core";

const configKey = Symbol.for("evo-vue-carousel__config");
const slideCountKey = Symbol.for("evo-vue-carousel__slide-count");
const currentIndexKey = Symbol.for("evo-vue-carousel__current-index");
const isHoveredKey = Symbol.for("evo-vue-carousel__is-hovered");
const isNavigatingKey = Symbol.for("evo-vue-carousel__is-navigating");
const autoplayFnKey = Symbol.for("evo-vue-carousel__autoplay-fn");

export const useCarouselHost = (props, slideCount, sliderRef) => {
	const isNavigating = ref(false);
	const config = useResponsiveConfig(props);
	const currentIndex = ref(checkPosition(props.initialIndex, slideCount.value, config));
	const isHovered = useElementHover(sliderRef, {
		delayEnter: +props.hoverDelayEnter,
		delayLeave: +props.hoverDelayLeave,
	});

	const autoplayInterval = computed(() => config.value.autoplay ?? 0);
	const setCurrentIndex = (newIndex) => {
		currentIndex.value = checkPosition(newIndex, slideCount.value, config);
	};

	const {
		pause: pauseAutoplay,
		resume: resumeAutoplay,
		isActive: autoplayIsActive,
	} = useIntervalFn(() => {
		setCurrentIndex(currentIndex.value + config.value.slideBy);
	}, autoplayInterval);

	provide(configKey, config);
	provide(slideCountKey, readonly(slideCount));
	provide(currentIndexKey, currentIndex);
	provide(isHoveredKey, isHovered);
	provide(isNavigatingKey, isNavigating);
	provide(autoplayFnKey, {
		pauseAutoplay,
		resumeAutoplay,
		autoplayIsActive,
	});

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
	const autoplaysFns = inject(autoplayFnKey);

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
		...autoplaysFns,
	};
};
