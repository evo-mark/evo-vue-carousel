import { useConfig } from "./useConfig";
import { computed, cloneVNode } from "vue";

export const useProcessedSlides = (props) => {
	const config = useConfig();

	return computed(() => {
		const slideElements = props.slides.map((s, index) => ({
			component: s,
			index,
			isClone: false,
		}));
		if (config.value.wrap === false) return slideElements;
		else {
			const prefixSlides = slideElements.map((s, index) => ({
				component: cloneVNode(s.component, {
					key: s.component.key + "_clone_prefix",
					class: "evo-vue-carousel__slide-clone evo-vue-carousel__slide-prefix",
				}),
				isClone: true,
				index: -slideElements.length + index,
			}));
			const suffixSlides = slideElements.map((s, index) => ({
				component: cloneVNode(s.component, {
					key: s.component.key + "_clone_suffix",
					class: "evo-vue-carousel__slide-clone evo-vue-carousel__slide-suffix",
				}),
				isClone: true,
				index: slideElements.length + index,
			}));
			return [...prefixSlides, ...slideElements, ...suffixSlides];
		}
	});
};
