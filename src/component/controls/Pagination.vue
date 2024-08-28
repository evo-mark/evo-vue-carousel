<template>
	<div class="evo-vue-carousel__pagination" :class="props.backgroundClass">
		<template v-for="(page, index) in pages" :key="page">
			<ForwardSlots :slots="$slots">
				<PaginationItem
					:class="props.itemClass"
					:active-class="props.itemActiveClass"
					:dot-class="props.itemDotClass"
					:dot-active-class="props.itemDotActiveClass"
					:page="page"
					:page-index="index"
					:is-active="isCurrentPage(index)"
				/>
			</ForwardSlots>
		</template>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useCurrentIndex } from "../../composables/useCurrentIndex";
import { chunk, findLastIndex } from "lodash-es";
import PaginationItem from "./PaginationItem.vue";
import { ForwardSlots } from "@evomark/vue-forward-slots";

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
});

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

const currentIndex = useCurrentIndex();

const isCurrentPage = (index) => {
	const foundIndex = findLastIndex(pages.value, (item) => item.includes(currentIndex.value));
	return foundIndex === index;
};
</script>
