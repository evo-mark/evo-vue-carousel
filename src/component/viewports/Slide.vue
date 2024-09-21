<template>
	<div ref="slide">
		<slot></slot>
	</div>
</template>

<script setup>
import { useId, getCurrentInstance, useTemplateRef, onUnmounted, watch } from "vue";
import { useElementSize } from "@vueuse/core";
import { useRegisterSlideClient } from "../../composables/useRegisterSlide";

const props = defineProps({
	isClone: {
		type: Boolean,
		default: false,
	},
});

const id = useId();
const vm = getCurrentInstance();
const slideRef = useTemplateRef("slide");
const { width, height, stop } = useElementSize(slideRef);

const { registerSlide, updateSlide, unregisterSlide } = useRegisterSlideClient();

if (props.isClone === false) {
	registerSlide(id, vm);
} else {
	stop();
}

onUnmounted(() => {
	if (props.isClone === false) {
		unregisterSlide(id);
	}
});

watch([width, height], ([newWidth, newHeight]) => {
	if (props.isClone === false) {
		updateSlide(id, { width: newWidth, height: newHeight });
	}
});
</script>
