<template>
	<div
		class="evo-vue-carousel__viewport evo-vue-carousel__viewport--gallery min-h-12 relative"
		:class="{
			'is-navigating': isNavigating,
		}"
	>
		<Transition
			mode="in-out"
			enter-active-class="transition-all duration-1000 absolute inset-0"
			leave-active-class="transition-none absolute hidden"
			enter-from-class="opacity-0"
			@before-enter="setIsNavigating(true)"
			@after-leave="setIsNavigating(false)"
		>
			<div :key="currentIndex" class="flex">
				<component
					:is="slide"
					v-for="(slide, index) in viewport"
					:key="index"
					class="evo-vue-carousel__slide evo-vue-carousel__slide--visible"
				>
				</component>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { slice, concat } from "lodash-es";
import { useConfig } from "../../composables/useConfig";
import { useCurrentIndex } from "../../composables/useCurrentIndex";
import { useIsNavigating, useSetIsNavigating } from "../../composables/useIsNavigating";

const props = defineProps({
	slides: {
		type: Array,
		default: () => [],
	},
});

const isNavigating = useIsNavigating();
const setIsNavigating = useSetIsNavigating();

const config = useConfig();
const currentIndex = useCurrentIndex();

const viewport = computed(() => {
	const endRange = currentIndex.value + config.value.perPage;
	if (config.value.wrap === false || endRange <= props.slides.length) {
		return slice(props.slides, currentIndex.value, endRange);
	}
	const first = slice(props.slides, currentIndex.value, endRange);
	const second = slice(props.slides, 0, endRange % props.slides.length);
	return concat(first, second);
});
</script>
