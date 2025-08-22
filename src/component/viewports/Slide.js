import { useId, getCurrentInstance, onUnmounted, watch, ref, h } from "vue";
import { useElementSize } from "@vueuse/core";
import { useRegisterSlideClient } from "../../composables/useRegisterSlide";

export default {
	props: {
		isClone: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, { slots }) {
		const slideRef = ref(null);
		const id = useId();
		const vm = getCurrentInstance();
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

		return () =>
			h(
				"div",
				{
					ref: slideRef,
					role: "group",
					"aria-roledescription": "Slide",
				},
				slots.default(),
			);
	},
};
