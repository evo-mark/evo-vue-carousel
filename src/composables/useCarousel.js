import { useElementHover, useIntervalFn } from "@vueuse/core";
import { computed, inject, nextTick, provide, readonly, ref, watch } from "vue";
import { checkPosition } from "../utils/checkPosition";
import { useResponsiveConfig } from "./useResponsiveConfig";

const configKey = Symbol.for("evo-vue-carousel__config");
const slideCountKey = Symbol.for("evo-vue-carousel__slide-count");
const currentIndexKey = Symbol.for("evo-vue-carousel__current-index");
const isHoveredKey = Symbol.for("evo-vue-carousel__is-hovered");
const isNavigatingKey = Symbol.for("evo-vue-carousel__is-navigating");
const autoplayFnKey = Symbol.for("evo-vue-carousel__autoplay-fn");

export const useCarouselHost = (modelValue, props, slideCount, sliderRef, manualControls = false) => {
	const isInit = ref(false);
	const isNavigating = ref(false);
	const config = useResponsiveConfig(props, manualControls);
	const isHovered = useElementHover(sliderRef, {
		delayEnter: +props.hoverDelayEnter,
		delayLeave: +props.hoverDelayLeave,
	});

	const stop = watch(
		slideCount,
		async (c) => {
			if (c > 0) {
				modelValue.value = checkPosition(modelValue.value, c, config);
				if (modelValue.value > c) modelValue.value = c - 1;
				isInit.value = true;
				await nextTick();
				stop();
			}
		},
		{
			immediate: true,
		},
	);

	watch(
		modelValue,
		(v) => {
			modelValue.value = checkPosition(v, slideCount.value, config);
		},
		{
			flush: "pre",
		},
	);

	const autoplayInterval = computed(() => config.value.autoplay ?? 0);
	const setCurrentIndex = (newIndex) => {
		modelValue.value = checkPosition(newIndex, slideCount.value, config);
	};

	const {
		pause: pauseAutoplay,
		resume: resumeAutoplay,
		isActive: autoplayIsActive,
	} = useIntervalFn(() => {
		if (isNavigating.value) return;
		setCurrentIndex(modelValue.value + config.value.slideBy);
	}, autoplayInterval);

	provide(configKey, config);
	provide(slideCountKey, readonly(slideCount));
	provide(currentIndexKey, modelValue);
	provide(isHoveredKey, isHovered);
	provide(isNavigatingKey, isNavigating);
	provide(autoplayFnKey, {
		pauseAutoplay,
		resumeAutoplay,
		autoplayIsActive,
	});

	return {
		config,
		currentIndex: readonly(modelValue),
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
	const autoplayFns = inject(autoplayFnKey);

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
		...autoplayFns,
	};
};
