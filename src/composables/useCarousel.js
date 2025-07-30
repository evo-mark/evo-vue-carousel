import { provide, inject, ref, readonly, computed, watch, nextTick } from "vue";
import { useResponsiveConfig } from "./useResponsiveConfig";
import { checkPosition } from "../utils/checkPosition";
import { useElementHover, useIntervalFn } from "@vueuse/core";

const configKey = Symbol.for("evo-vue-carousel__config");
const slideCountKey = Symbol.for("evo-vue-carousel__slide-count");
const currentIndexKey = Symbol.for("evo-vue-carousel__current-index");
const isHoveredKey = Symbol.for("evo-vue-carousel__is-hovered");
const isNavigatingKey = Symbol.for("evo-vue-carousel__is-navigating");
const autoplayFnKey = Symbol.for("evo-vue-carousel__autoplay-fn");

export const useCarouselHost = (props, slideCount, sliderRef, manualControls = false) => {
	const isInit = ref(false);
	const isNavigating = ref(false);
	const config = useResponsiveConfig(props, manualControls);
	const currentIndex = ref(0);
	const isHovered = useElementHover(sliderRef, {
		delayEnter: +props.hoverDelayEnter,
		delayLeave: +props.hoverDelayLeave,
	});

	const stop = watch(
		slideCount,
		async (c) => {
			if (c > 0) {
				currentIndex.value = checkPosition(+props.initialIndex, c, config);
				if (currentIndex.value > c) currentIndex.value = c - 1;
				isInit.value = true;
				await nextTick();
				stop();
			}
		},
		{
			immediate: true,
		},
	);

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
		isInit,
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
