<template>
	<slot
		name="pagination-item"
		:is-current-page="props.isActive"
		:page="props.page"
		:page-index="props.pageIndex"
		:attrs="{
			onClick: () => onNavigate(props.page, props.pageIndex),
			disabled: props.disabled,
		}"
	>
		<button
			v-bind="$attrs"
			:class="_itemClass"
			:aria-label="`Navigate to page ${props.pageIndex + 1}`"
			@click="onNavigate(props.page, props.pageIndex)"
		>
			<div :class="_itemDotClass"></div>
		</button>
	</slot>
</template>

<script setup>
import { computed } from "vue";
import { twMerge } from "tailwind-merge";
import { useCarouselClient } from "../../composables/useCarousel";

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	class: {
		type: String,
		default: "",
	},
	activeClass: {
		type: String,
		default: "",
	},
	dotClass: {
		type: String,
		default: "",
	},
	dotActiveClass: {
		type: String,
		default: "",
	},
	page: {
		type: Array,
		default: () => [],
	},
	pageIndex: {
		type: Number,
		default: 0,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const { setCurrentIndex, pauseAutoplay, resumeAutoplay } = useCarouselClient();

const onNavigate = (page) => {
	if (props.disabled) return false;
	setCurrentIndex(page[0]);
	pauseAutoplay();
	resumeAutoplay();
};

const _itemClass = computed(() =>
	twMerge(props.class, props.isActive && props.activeClass, props.disabled && "pointer-events-none"),
);
const _itemDotClass = computed(() => twMerge(props.dotClass, props.isActive && props.dotActiveClass));
</script>
