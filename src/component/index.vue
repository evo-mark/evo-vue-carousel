<template>
	<div
		ref="sliderRef"
		class="evo-vue-carousel relative max-h-full"
		:class="{
			'is-hovered': isHovered,
		}"
	>
		<div class="evo-vue-carousel__content h-full max-h-full relative">
			<ForwardSlots :slots="$slots" :only="['default']">
				<EvoVueCarouselViewportGallery
					v-if="config.mode === 'gallery'"
					:total-slides="slideCount"
					:is-init="sliderIsInit"
				/>
				<EvoVueCarouselViewportSlider
					v-else
					:class="props.viewportClass"
					:total-slides="slideCount"
					:is-init="sliderIsInit"
				/>
			</ForwardSlots>
			<div v-if="$slots.overlay" class="evo-vue-carousel__overlay absolute inset-0">
				<slot name="overlay"></slot>
			</div>
			<ForwardSlots
				v-if="config.hideNavigation !== true"
				:slots="$slots"
				:only="['navigation-prev', 'navigation-next', 'navigation']"
			>
				<EvoVueCarouselNavigation
					:class="props.navigationClass"
					:item-class="props.navigationItemClass"
					:item-size-class="props.navigationItemSizeClass"
					:prev-class="props.navigationPrevClass"
					:next-class="props.navigationNextClass"
					:total-slides="slideCount"
					:disable-on-navigation="props.disableOnNavigation"
				/>
			</ForwardSlots>
		</div>
		<ForwardSlots v-if="config.hidePagination !== true" :slots="$slots" :only="['pagination', 'pagination-item']">
			<EvoVueCarouselPagination
				:class="props.paginationClass"
				:background-class="props.paginationBackgroundClass"
				:item-class="props.paginationItemClass"
				:item-size-class="props.paginationItemSizeClass"
				:item-active-class="props.paginationItemActiveClass"
				:item-dot-class="props.paginationItemDotClass"
				:item-dot-active-class="props.paginationItemDotActiveClass"
				:total-slides="slideCount"
				:per-page="config.perPage"
				:wrap="config.wrap"
				:disable-on-navigation="props.disableOnNavigation"
			/>
		</ForwardSlots>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { ForwardSlots } from "@evomark/vue-forward-slots";
import {
	EvoVueCarouselPagination,
	EvoVueCarouselNavigation,
	EvoVueCarouselViewportSlider,
	EvoVueCarouselViewportGallery,
} from "../main.js";
import { EVO_VUE_CAROUSEL_MODE } from "../utils/constants.js";
import { useRegisterSlide } from "../composables/useRegisterSlide.js";
import { useCarouselHost } from "../composables/useCarousel.js";

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
		default: "bg-zinc-900/10 py-1 backdrop-blur-sm",
	},
	/**
	 * @namespace Classes
	 */
	paginationItemClass: {
		type: String,
		default:
			"border-white/50 border-2 rounded-full p-0.5 flex justify-center items-center hover:border-white/100 transition-colors duration-300",
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
		default: "rounded-full origin-center scale-0 bg-white/50 transition-transform",
	},
	/**
	 * @namespace Classes
	 */
	paginationItemSizeClass: {
		type: String,
		default: "size-4",
	},
	/**
	 * @namespace Classes
	 */
	paginationItemDotActiveClass: {
		type: String,
		default: "scale-100 bg-white/70",
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
			"relative before:absolute before:inset-0 before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-10 active:before:opacity-20 before:duration-300 disabled:pointer-events-none disabled:opacity-30 transition-opacity",
	},
	/**
	 * @namespace Classes
	 */
	navigationItemSizeClass: {
		type: String,
		default: "size-16",
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

const sliderRef = ref(null);
const { slideCount, isInit: sliderIsInit } = useRegisterSlide();
const { config, isHovered } = useCarouselHost(props, slideCount, sliderRef);
</script>
