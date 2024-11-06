<template>
	<slot name="navigation" :on-prev="onPrev" :on-next="onNext" :current-index="currentIndex" :config="config">
		<div class="evo-vue-carousel__navigation" v-bind="$attrs">
			<slot name="navigation-prev" :on-click="onPrev" :current-index="currentIndex" :disabled="disablePrev">
				<button
					class="evo-vue-carousel__navigation-item evo-vue-carousel__navigation-prev"
					:class="_prevClasses"
					:disabled="disablePrev"
					@click="onPrev"
				>
					<SvgIcon :path="leftIcon" viewBox="0 0 48 48" class="w-full h-full" />
				</button>
			</slot>
			<slot name="navigation-next" :on-click="onNext" :current-index="currentIndex" :disabled="disableNext">
				<button
					class="evo-vue-carousel__navigation-item evo-vue-carousel__navigation-next"
					:class="_nextClasses"
					:disabled="disableNext"
					@click="onNext"
				>
					<SvgIcon :path="rightIcon" viewBox="0 0 48 48" class="w-full h-full" />
				</button>
			</slot>
		</div>
	</slot>
</template>

<script setup>
import SvgIcon from "vue3-icon";
import { computed } from "vue";
import { twMerge } from "tailwind-merge";
import { EVO_VUE_CAROUSEL_MODE } from "../../utils/constants.js";
import { loopedValue } from "../../utils/loopedValue";
import { useCarouselClient } from "../../composables/useCarousel.js";

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	itemClass: {
		type: String,
		required: true,
	},
	itemSizeClass: {
		type: String,
		required: true,
	},
	prevClass: {
		type: String,
		required: true,
	},
	nextClass: {
		type: String,
		required: true,
	},
	totalSlides: {
		type: Number,
		required: true,
	},
	disableOnNavigation: {
		type: Boolean,
		default: false,
	},
});

const { config, currentIndex, setCurrentIndex, isNavigating, pauseAutoplay, resumeAutoplay } = useCarouselClient();

const pageEndIndex = computed(() => currentIndex.value + config.value.perPage);
const disablePrev = computed(
	() =>
		(!config.value.wrap && currentIndex.value === 0) || (props.disableOnNavigation && isNavigating.value === true),
);
const disableNext = computed(
	() =>
		(!config.value.wrap && pageEndIndex.value === props.totalSlides) ||
		(props.disableOnNavigation && isNavigating.value === true),
);

const leftIcon =
	"M31.884 8.366a1.25 1.25 0 0 1 0 1.768L18.018 24l13.866 13.866a1.25 1.25 0 0 1-1.768 1.768l-14.75-14.75a1.25 1.25 0 0 1 0-1.768l14.75-14.75a1.25 1.25 0 0 1 1.768 0z";
const rightIcon =
	"M16.116 39.634a1.25 1.25 0 0 1 0-1.768L29.982 24L16.116 10.134a1.25 1.25 0 0 1 1.768-1.768l14.75 14.75a1.25 1.25 0 0 1 0 1.768l-14.75 14.75a1.25 1.25 0 0 1-1.768 0z";

const _prevClasses = computed(() => twMerge(props.itemClass, props.itemSizeClass, props.prevClass));
const _nextClasses = computed(() => twMerge(props.itemClass, props.itemSizeClass, props.nextClass));

const checkPosition = (target) => {
	const isGallery = config.value.mode === EVO_VUE_CAROUSEL_MODE.GALLERY;
	if (isGallery === false) return target;

	const shouldWrap = config.value.wrap === true;
	if (shouldWrap) return loopedValue(target, 0, props.totalSlides);

	const endOfPage = target + config.value.perPage;

	if (target < 0) return 0;
	else if (endOfPage >= props.totalSlides) {
		return props.totalSlides - config.value.perPage;
	}
	return target;
};

const resetAutoplay = () => {
	pauseAutoplay();
	resumeAutoplay();
};

const onPrev = () => {
	const target = checkPosition(currentIndex.value - config.value.slideBy);
	setCurrentIndex(target);
	resetAutoplay();
};
const onNext = () => {
	const target = checkPosition(currentIndex.value + config.value.slideBy);
	setCurrentIndex(target);
	resetAutoplay();
};
</script>

<style lang="postcss">
.evo-vue-carousel__navigation {
	@apply pointer-events-none;

	> * {
		@apply pointer-events-auto;
	}
}
</style>
