<template>
	<div
		ref="galleryRef"
		class="evo-vue-carousel__viewport evo-vue-carousel__viewport--gallery min-h-12 h-full relative w-full overflow-hidden"
		:class="{
			'is-navigating': isNavigating,
		}"
		:data-height="galleryHeight"
	>
		<Transition
			mode="in-out"
			enter-active-class="transition-all duration-1000 absolute inset-0"
			leave-active-class="transition-none absolute hidden"
			enter-from-class="opacity-0"
			@before-enter="setIsNavigating(true)"
			@after-leave="setIsNavigating(false)"
		>
			<SliderTrack :key="currentIndex">
				<slot></slot>
			</SliderTrack>
		</Transition>
	</div>
</template>

<script setup>
import ViewportSlide from "./Slide.vue";
import { ref, h, normalizeClass, Fragment, computed, watch } from "vue";
import { slice, concat } from "lodash-es";
import { useCarouselClient } from "../../composables/useCarousel";
import { useElementSize } from "@vueuse/core";
import { replaceChildren, COMPONENTS_AND_ELEMENTS } from "@skirtle/vue-vnode-utils";

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

const { config, currentIndex, isNavigating, setIsNavigating } = useCarouselClient();

const galleryRef = ref(null);
const { height: galleryHeight } = useElementSize(galleryRef);

/* *********************************************
 * TRACK
 * ******************************************* */
/**
 * Check which slides are visible in the viewport
 * @param { number } startIndex The starting index for the viewport
 * @param { number } totalVisible The total number of slides to show
 * @param { number } count The total number of available slides
 * @returns { number[] } An array of visible slide indexes
 */
function visible(startIndex, totalVisible, count) {
	console.log("visible fn");
	console.table({ startIndex, totalVisible, count });
	const result = [];
	if (count === 0) return result;

	for (let i = 0; i < totalVisible; i++) {
		console.log(startIndex + i, (startIndex + i) % count);
		result.push((startIndex + i) % count);
	}

	return result;
}

const SliderTrack = {
	setup(_, { slots }) {
		const visibleSlides = computed(() => visible(currentIndex.value, config.value.perPage, props.totalSlides));
		watch(
			visibleSlides,
			(v) => {
				console.log(v);
			},
			{
				immediate: true,
			},
		);

		return () => {
			console.log("Render gallery");
			let defaultSlot = slots.default?.() || [];

			while (Array.isArray(defaultSlot) && defaultSlot[0].type === Fragment) {
				defaultSlot = defaultSlot[0].children;
			}

			let i = 0;
			const availableSlides = replaceChildren(
				defaultSlot,
				(vnode) => {
					console.log(`Slide ${i}, visible: ${visibleSlides.value.includes(i)}`);
					const cloned = h(
						ViewportSlide,
						{
							class: normalizeClass([
								"evo-vue-carousel__slide evo-vue-carousel__slide--visible w-full h-full",
								{
									hidden: visibleSlides.value.includes(i) === false,
								},
							]),
							role: "option",
						},
						{
							default: () => [vnode],
						},
					);
					i++;
					return cloned;
				},
				COMPONENTS_AND_ELEMENTS,
			);

			const viewport = concat(
				slice(availableSlides, currentIndex.value),
				slice(availableSlides, 0, currentIndex.value),
			);

			return h(
				"div",
				{
					class: normalizeClass(["flex h-full overflow-hidden"]),
				},
				viewport,
			);
		};
	},
};
</script>
