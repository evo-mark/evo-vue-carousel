<template>
	<div
		ref="viewportRef"
		class="evo-vue-carousel__viewport evo-vue-carousel__viewport--slider relative flex w-full max-h-full overflow-hidden"
		role="listbox"
		:data-width="sliderWidth"
		:data-height="sliderHeight"
	>
		<div
			class="evo-vue-carousel__viewport-track flex flex-row"
			:class="[
				{
					'is-navigating': isNavigating,
					'autoplay-active': autoplayIsActive,
				},
				disableTransition ? 'transition-none' : 'transition-all',
				config.slideTransitionTimingClass,
			]"
			:style="trackStyle"
			@transitionstart="onSlideTransitionStart"
			@transitionend="onSlideTransitionEnd"
		>
			<component
				:is="slide.component"
				v-for="slide in processedSlides"
				:key="slide.component.key"
				role="option"
				class="evo-vue-carousel__slide shrink-0 grow-0"
				:style="{
					flexBasis: 'var(--slide-width, 0px)',
					marginRight: `${config.gap}px`,
				}"
			></component>
		</div>
	</div>
</template>

<script setup>
import { useConfig } from "../../composables/useConfig";
import { useCurrentIndex, useSetCurrentIndex } from "../../composables/useCurrentIndex";
import { useIsHovered } from "../../composables/useIsHovered";
import { useProcessedSlides } from "../../composables/useProcessedSlides";
import { nextFrame } from "../../utils/animation";
import { loopedValue } from "../../utils/loopedValue";
import { useElementSize, useIntervalFn } from "@vueuse/core";
import { ref, computed, watch, onMounted } from "vue";
import { useIsNavigating, useSetIsNavigating } from "../../composables/useIsNavigating";

const props = defineProps({
	slides: {
		type: Array,
		default: () => [],
	},
});
const config = useConfig();
const currentIndex = useCurrentIndex();
const setCurrentIndex = useSetCurrentIndex();

const updateOffset = (index) => {
	const slideWidth = parseFloat(defaultSlideWidth.value);
	const centre = (slideWidth + config.value.gap) * (props.slides.length + index);
	return centre * -1;
};

const isNavigating = useIsNavigating();
const setIsNavigating = useSetIsNavigating();

const disableTransition = ref(true);
const viewportRef = ref(null);
const { width: sliderWidth, height: sliderHeight } = useElementSize(viewportRef);
const defaultSlideWidth = computed(() => {
	const totalGap = config.value.gap > 0 ? config.value.gap * (config.value.perPage - 1) : 0;
	return (sliderWidth.value - totalGap) / config.value.perPage + "px";
});
const offset = ref(0);
const offsetStart = ref(0);
onMounted(async () => {
	offset.value = updateOffset(0);
	await nextFrame(2);
	disableTransition.value = false;
});
const offsetDistance = computed(() => Math.abs(offset.value - offsetStart.value));

const processedSlides = useProcessedSlides(props);

watch(currentIndex, (v) => {
	if (isNavigating.value === false) {
		offsetStart.value = offset.value;
	}
	offset.value = updateOffset(v);
});

/* *********************************************
 * TRANSITIONS
 * ******************************************* */

const calculateTransitionDuration = (distance, speed) => {
	return (distance / speed) * 100;
};

const trackStyle = computed(() => ({
	transform: `translate3d(${offset.value}px, 0, 0)`,
	transitionDuration: `${calculateTransitionDuration(offsetDistance.value, config.value.transitionSpeed)}ms`,
}));

const onSlideTransitionStart = () => {
	setIsNavigating(true);
};
const onSlideTransitionEnd = async () => {
	disableTransition.value = true;
	await nextFrame();

	const totalSlides = props.slides.length;
	setCurrentIndex(loopedValue(currentIndex.value, 0, totalSlides));

	await nextFrame();
	disableTransition.value = false;
	setIsNavigating(false);
};

const autoplayInterval = computed(() => config.value.autoplay ?? 0);
const isHovered = useIsHovered();

const {
	pause: pauseAutoplay,
	resume: resumeAutoplay,
	isActive: autoplayIsActive,
} = useIntervalFn(() => {
	setCurrentIndex(currentIndex.value + config.value.slideBy);
}, autoplayInterval);

watch(isHovered, (v) => {
	if (config.value.pauseOnHover !== true) return;

	if (v) pauseAutoplay();
	else resumeAutoplay();
});
</script>

<style lang="postcss" scoped>
.evo-vue-carousel__viewport-track {
	--slide-width: v-bind(defaultSlideWidth);
}
</style>
