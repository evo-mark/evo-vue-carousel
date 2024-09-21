<template>
	<div class="evo-vue-carousel__pagination" :class="props.backgroundClass">
		<slot name="pagination" :page="pages" :is-current-page="isCurrentPage" :is-navigating="isNavigating">
			<template v-for="(page, index) in pages" :key="page">
				<ForwardSlots :slots="$slots" only="pagination-item">
					<PaginationItem
						:class="props.itemClass"
						:active-class="props.itemActiveClass"
						:dot-class="normalizeClass([props.itemDotClass, props.itemSizeClass])"
						:dot-active-class="props.itemDotActiveClass"
						:page="page"
						:page-index="index"
						:is-active="isCurrentPage(index)"
						:disabled="props.disableOnNavigation && isNavigating"
					/>
				</ForwardSlots>
			</template>
		</slot>
	</div>
</template>

<script setup>
import { computed, normalizeClass } from "vue";
import { chunk, findLastIndex } from "lodash-es";
import PaginationItem from "./PaginationItem.vue";
import { ForwardSlots } from "@evomark/vue-forward-slots";
import { useCarouselClient } from "../../composables/useCarousel";

const props = defineProps({
	totalSlides: {
		type: Number,
		required: true,
	},
	perPage: {
		type: Number,
		required: true,
	},
	wrap: {
		type: Boolean,
		default: false,
	},
	backgroundClass: {
		type: String,
		default: "",
	},
	itemClass: {
		type: String,
		default: "",
	},
	itemSizeClass: {
		type: String,
		default: "",
	},
	itemActiveClass: {
		type: String,
		default: "",
	},
	itemDotClass: {
		type: String,
		default: "",
	},
	itemDotActiveClass: {
		type: String,
		default: "",
	},
	disableOnNavigation: {
		type: Boolean,
		default: false,
	},
});

const { currentIndex, isNavigating } = useCarouselClient();

const pages = computed(() => {
	const slideArray = Array.from(Array(props.totalSlides).keys());
	const chunks = chunk(slideArray, props.perPage);

	return chunks.map((ch) => {
		const initial = ch[0];
		let newIndex = initial - 1;
		while (ch.length < props.perPage) {
			ch.unshift(newIndex);
			newIndex--;
		}
		return ch;
	});
});

const isCurrentPage = (index) => {
	const foundIndex = findLastIndex(pages.value, (item) => item.includes(currentIndex.value));
	return foundIndex === index;
};
</script>
