<template>
	<div
		ref="sliderRef"
		class="evo-vue-carousel relative"
		:class="{
			'is-hovered': isHovered,
		}"
	>
		<div class="evo-vue-carousel__content">
			<EvoVueCarouselViewportGallery v-if="config.mode === 'gallery'" :slides="slides" />
			<EvoVueCarouselViewportSlider v-else :slides="slides" :class="props.viewportClass" />
			<ForwardSlots
				v-if="config.hideNavigation !== true"
				:slots="$slots"
				:only="['navigation-prev', 'navigation-next', 'navigation']"
			>
				<EvoVueCarouselNavigation
					:class="props.navigationClass"
					:item-class="props.navigationItemClass"
					:prev-class="props.navigationPrevClass"
					:next-class="props.navigationNextClass"
					:total-slides="slides.length"
					:disable-on-navigation="props.disableOnNavigation"
				/>
			</ForwardSlots>
		</div>
		<ForwardSlots v-if="config.hidePagination !== true" :slots="$slots" :only="['pagination', 'pagination-item']">
			<EvoVueCarouselPagination
				:class="props.paginationClass"
				:background-class="props.paginationBackgroundClass"
				:item-class="props.paginationItemClass"
				:item-active-class="props.paginationItemActiveClass"
				:item-dot-class="props.paginationItemDotClass"
				:item-dot-active-class="props.paginationItemDotActiveClass"
				:total-slides="slides.length"
				:per-page="config.perPage"
				:wrap="config.wrap"
				:disable-on-navigation="props.disableOnNavigation"
			/>
		</ForwardSlots>
	</div>
</template>

<script setup>
import { provide, useSlots, computed, Fragment, ref, readonly } from "vue";
import { useElementHover } from "@vueuse/core";
import { ForwardSlots } from "@evomark/vue-forward-slots";
import {
	EvoVueCarouselPagination,
	EvoVueCarouselNavigation,
	EvoVueCarouselViewportSlider,
	EvoVueCarouselViewportGallery,
} from "../main.js";
import { EVO_VUE_CAROUSEL_MODE } from "../setup/constants.js";
import { useResponsiveConfig } from "../composables/useResponsiveConfig";
import { checkPosition } from "../utils/checkPosition";
import {
	configKey,
	currentIndexKey,
	isHoveredKey,
	isNavigatingKey,
	setCurrentIndexKey,
	setIsNavigatingKey,
} from "../setup/keys";

const props = defineProps({
	autoplay: {
		type: [Boolean, Number],
		default: false,
	},
	wrap: {
		type: Boolean,
		default: false,
	},
	hideNavigation: {
		type: Boolean,
		default: false,
	},
	hidePagination: {
		type: Boolean,
		default: false,
	},
	responsive: {
		type: Object,
		default: () => ({}),
	},
	perPage: {
		type: [Number, String],
		default: 1,
	},
	slideBy: {
		type: [Number, String],
		default: null,
	},
	mode: {
		type: String,
		default: EVO_VUE_CAROUSEL_MODE.SLIDER,
		validator: (v) => Object.values(EVO_VUE_CAROUSEL_MODE).includes(v),
	},
	initialIndex: {
		type: [String, Number],
		default: 0,
	},
	gap: {
		type: [String, Number],
		default: 0,
	},
	/**
	 * @namespace Classes
	 */
	viewportClass: {
		type: String,
		default: "",
	},
	/**
	 * @namespace Classes
	 */
	paginationClass: {
		type: String,
		default: "flex justify-center gap-4 absolute bottom-0 w-full",
	},
	/**
	 * @namespace Classes
	 */
	paginationBackgroundClass: {
		type: String,
		default: "bg-black/40 py-1 backdrop-blur",
	},
	/**
	 * @namespace Classes
	 */
	paginationItemClass: {
		type: String,
		default:
			"border-gray-300 border-2 rounded-full p-0.5 flex justify-center items-center hover:border-white transition-colors duration-300",
	},
	/**
	 * @namespace Classes
	 */
	paginationItemActiveClass: {
		type: String,
		default: "pointer-events-none",
	},
	/**
	 * @namespace Classes
	 */
	paginationItemDotClass: {
		type: String,
		default: "size-4 rounded-full origin-center scale-0 bg-gray-300 transition-transform",
	},
	/**
	 * @namespace Classes
	 */
	paginationItemDotActiveClass: {
		type: String,
		default: "scale-100",
	},
	/**
	 * @namespace Classes
	 */
	navigationClass: {
		type: String,
		default: "absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-between",
	},
	/**
	 * @namespace Classes
	 */
	navigationItemClass: {
		type: String,
		default:
			"size-16 relative before:absolute before:inset-0 before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-10 active:before:opacity-20 before:duration-300 disabled:pointer-events-none disabled:opacity-30 transition-opacity",
	},
	/**
	 * @namespace Classes
	 */
	navigationPrevClass: {
		type: String,
		default: "-translate-x-full",
	},
	/**
	 * @namespace Classes
	 */
	navigationNextClass: {
		type: String,
		default: "translate-x-full",
	},
	transitionSpeed: {
		type: [String, Number],
		default: 200,
	},
	slideTransitionTimingClass: {
		type: String,
		default: "ease-linear",
	},
	pauseOnHover: {
		type: Boolean,
		default: false,
	},
	disableOnNavigation: {
		type: Boolean,
		default: false,
	},
	hoverDelayEnter: {
		type: [String, Number],
		default: 0,
	},
	hoverDelayLeave: {
		type: [String, Number],
		default: 0,
	},
});

const config = useResponsiveConfig(props);
provide(configKey, config);

const slides = computed(() => {
	const slot = useSlots().default();
	const slides = slot
		.reduce((acc, curr) => {
			if (curr.type === Fragment) acc.push(...curr.children);
			else acc.push(curr);
			return acc;
		}, [])
		.map((slide, index) => {
			slide.key ??= index;
			return slide;
		});
	return slides;
});

const currentIndex = ref(checkPosition(props.initialIndex, slides.value.length, config));
const setCurrentIndex = (newIndex) => {
	currentIndex.value = checkPosition(newIndex, slides.value.length, config);
};
provide(currentIndexKey, readonly(currentIndex));
provide(setCurrentIndexKey, setCurrentIndex);

const isNavigating = ref(false);
const setIsNavigating = (value) => {
	isNavigating.value = value;
};
provide(isNavigatingKey, readonly(isNavigating));
provide(setIsNavigatingKey, setIsNavigating);

/* *********************************************
 * HOVER STATE
 * ******************************************* */
const sliderRef = ref(null);
const isHovered = useElementHover(sliderRef, {
	delayEnter: +props.hoverDelayEnter,
	delayLeave: +props.hoverDelayLeave,
});

provide(isHoveredKey, readonly(isHovered));
</script>
