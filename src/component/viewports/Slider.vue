<template>
	<div
		ref="viewportRef"
		class="evo-vue-carousel__viewport evo-vue-carousel__viewport--slider relative flex w-full h-full max-h-full overflow-hidden"
		:data-width="sliderWidth"
		:data-height="sliderHeight"
	>
		<ForwardSlots :slots="$slots" only="default">
			<SliderTrack :gap="config.gap" />
		</ForwardSlots>
	</div>
</template>

<script setup>
import { concat } from "es-toolkit/compat";
import { ForwardSlots } from "@evomark/vue-forward-slots";
import { useCarouselClient } from "../../composables/useCarousel";
import { nextFrame } from "../../utils/animation";
import { loopedValue } from "../../utils/loopedValue";
import { useElementSize } from "@vueuse/core";
import { ref, computed, watch, h, normalizeClass } from "vue";
import { replaceChildren } from "@skirtle/vue-vnode-utils";
import ViewportSlide from "./Slide";

const prefersReducedMotion =
	typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const FILTER_COMPONENTS = Object.freeze({
	element: true,
	component: true,
	static: true,
	comment: false,
	text: false,
});

const props = defineProps({
	totalSlides: {
		type: Number,
		default: 0,
	},
	isInit: {
		type: Boolean,
		default: false,
	},
});

const {
	config,
	currentIndex,
	setCurrentIndex,
	isHovered,
	isNavigating,
	setIsNavigating,
	pauseAutoplay,
	resumeAutoplay,
	autoplayIsActive,
} = useCarouselClient();

const disableTransition = ref(true);

const calculateTransitionDuration = (distance, speed) => {
	return (distance / speed) * 100;
};

const trackStyle = computed(() => ({
	transform: `translate3d(${offset.value}px, 0, 0)`,
	transitionDuration: `${calculateTransitionDuration(offsetDistance.value, config.value.transitionSpeed)}ms`,
}));

const updateOffset = (index) => {
	const slideWidth = parseFloat(defaultSlideWidth.value);

	const offsetSlides = config.value.wrap ? props.totalSlides + index : index;
	const centre = (slideWidth + config.value.gap) * offsetSlides;
	return centre * -1;
};

const viewportRef = ref(null);
const { width: sliderWidth, height: sliderHeight } = useElementSize(viewportRef);
const defaultSlideWidth = computed(() => {
	const totalGap = config.value.gap > 0 ? config.value.gap * (config.value.perPage - 1) : 0;
	return (sliderWidth.value - totalGap) / config.value.perPage + "px";
});
const offset = ref(0);
const offsetStart = ref(0);

watch(
	() => props.isInit,
	async (v) => {
		if (v) {
			offset.value = updateOffset(currentIndex.value);
			await nextFrame(2);
			disableTransition.value = false;
		}
	},
);
const offsetDistance = computed(() => Math.abs(offset.value - offsetStart.value));

watch(currentIndex, (v) => {
	if (isNavigating.value === false) {
		offsetStart.value = offset.value;
	}
	offset.value = updateOffset(v);
	if (prefersReducedMotion) {
		onSlideTransitionEnd();
	}
});

/* *********************************************
 * TRANSITIONS
 * ******************************************* */

const onSlideTransitionStart = () => {
	setIsNavigating(true);
};
const onSlideTransitionEnd = async () => {
	disableTransition.value = true;
	await nextFrame();

	const totalSlides = props.totalSlides;
	setCurrentIndex(loopedValue(currentIndex.value, 0, totalSlides));

	await nextFrame();
	disableTransition.value = false;
	setIsNavigating(false);
};

watch(isHovered, (v) => {
	if (config.value.pauseOnHover !== true) return;

	if (v) pauseAutoplay();
	else resumeAutoplay();
});

/* *********************************************
 * TRACK
 * ******************************************* */
const SliderTrack = {
	props: {
		gap: {
			type: Number,
			default: 0,
		},
	},
	setup(props, { slots }) {
		const extractSlot = () => slots.default?.() || [];
		const generateSlides = (position) => {
			let i = 0;
			const keyAppend = position ? `_${position}` : "";
			return replaceChildren(
				extractSlot(),
				(vnode) => {
					i++;
					return h(
						ViewportSlide,
						{
							class: normalizeClass([
								"evo-vue-carousel__slide shrink-0 grow-0",
								{
									"evo-vue-carousel__slide-clone": !!position,
									"evo-vue-carousel__slide-prefix": position === "prefix",
									"evo-vue-carousel__slide-suffix": position === "suffix",
								},
							]),
							style: {
								flexBasis: "var(--slide-width, 0px)",
								marginRight: `${props.gap}px`,
							},
							ariaLabel: `Slide ${i}`,
							key: `slide_${i}${keyAppend}`,
							isClone: !!position,
						},
						{
							default: () => [vnode],
						},
					);
				},
				FILTER_COMPONENTS,
			);
		};

		return () =>
			h(
				"div",
				{
					class: normalizeClass([
						"evo-vue-carousel__viewport-track flex flex-row",
						{
							"is-navigating": isNavigating.value,
							"autoplay-active": autoplayIsActive.value,
						},
						disableTransition.value ? "transition-none" : "transition-all motion-reduce:transition-none",
						config.value.slideTransitionTimingClass,
					]),
					style: trackStyle.value,
					onTransitionstart: onSlideTransitionStart,
					onTransitionend: onSlideTransitionEnd,
				},
				config.value.wrap
					? concat(generateSlides("prefix"), generateSlides(), generateSlides("suffix"))
					: generateSlides(),
			);
	},
};
</script>

<style lang="postcss" scoped>
.evo-vue-carousel__viewport-track {
	--slide-width: v-bind(defaultSlideWidth);
}
</style>
