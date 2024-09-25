<template>
	<div
		ref="viewportRef"
		class="evo-vue-carousel__viewport evo-vue-carousel__viewport--slider relative flex w-full max-h-full overflow-hidden"
		role="listbox"
		:data-width="sliderWidth"
		:data-height="sliderHeight"
	>
		<ForwardSlots :slots="$slots" only="default">
			<SliderTrack :gap="config.gap" />
		</ForwardSlots>
	</div>
</template>

<script setup>
import { ForwardSlots } from "@evomark/vue-forward-slots";
import { useCarouselClient } from "../../composables/useCarousel";
import { nextFrame } from "../../utils/animation";
import { loopedValue } from "../../utils/loopedValue";
import { useElementSize, useIntervalFn } from "@vueuse/core";
import { ref, computed, watch, h, normalizeClass, cloneVNode } from "vue";
import { replaceChildren, COMPONENTS_AND_ELEMENTS } from "@skirtle/vue-vnode-utils";
import ViewportSlide from "./Slide.vue";

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

const { config, currentIndex, setCurrentIndex, isHovered, isNavigating, setIsNavigating } = useCarouselClient();

const disableTransition = ref(true);
const autoplayInterval = computed(() => config.value.autoplay ?? 0);

const {
	pause: pauseAutoplay,
	resume: resumeAutoplay,
	isActive: autoplayIsActive,
} = useIntervalFn(() => {
	setCurrentIndex(currentIndex.value + config.value.slideBy);
}, autoplayInterval);

const calculateTransitionDuration = (distance, speed) => {
	return (distance / speed) * 100;
};

const trackStyle = computed(() => ({
	transform: `translate3d(${offset.value}px, 0, 0)`,
	transitionDuration: `${calculateTransitionDuration(offsetDistance.value, config.value.transitionSpeed)}ms`,
}));

const updateOffset = (index) => {
	const slideWidth = parseFloat(defaultSlideWidth.value);
	const centre = (slideWidth + config.value.gap) * (props.totalSlides + index);
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
			offset.value = updateOffset(0);
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
	setup(props, { slots }) {
		return () => {
			const children = slots.default?.() || [];
			const original = replaceChildren(
				children,
				(vnode) => {
					return h(
						ViewportSlide,
						{
							class: "evo-vue-carousel__slide shrink-0 grow-0",
							role: "option",
							style: {
								flexBasis: "var(--slide-width, 0px)",
								marginRight: `${props.gap}px`,
							},
						},
						{
							default: () => [vnode],
						},
					);
				},
				COMPONENTS_AND_ELEMENTS,
			);

			const prefix = replaceChildren(original, (vnode) => {
				return cloneVNode(vnode, {
					class: "evo-vue-carousel__slide-clone evo-vue-carousel__slide-prefix",
					isClone: true,
				});
			});
			const suffix = replaceChildren(original, (vnode) => {
				return cloneVNode(vnode, {
					class: "evo-vue-carousel__slide-clone evo-vue-carousel__slide-suffix",
					isClone: true,
				});
			});

			return h(
				"div",
				{
					class: normalizeClass([
						"evo-vue-carousel__viewport-track flex flex-row",
						{
							"is-navigating": isNavigating.value,
							"autoplay-active": autoplayIsActive.value,
						},
						disableTransition.value ? "transition-none" : "transition-all",
						config.value.slideTransitionTimingClass,
					]),
					style: trackStyle.value,
					onTransitionstart: onSlideTransitionStart,
					onTransitionend: onSlideTransitionEnd,
				},
				config.value.wrap ? [...prefix, ...original, ...suffix] : [...original],
			);
		};
	},
};
</script>

<style lang="postcss" scoped>
.evo-vue-carousel__viewport-track {
	--slide-width: v-bind(defaultSlideWidth);
}
</style>
