import { ref, computed, readonly, provide, inject } from "vue";
import { debounce } from "lodash-es";

export const registerSlideKey = Symbol.for("evo-vue-carousel__register-slide");
export const registerSlideClientKey = Symbol.for("evo-vue-carousel__register-slide-client");

export const useRegisterSlide = () => {
	const slides = ref(new Map());
	const isInit = ref(false);
	const slideCount = computed(() => slides.value.size);

	const checkInit = debounce(() => {
		isInit.value = true;
	}, 5);

	const registerSlide = (id, instance, { width = 0 } = {}) => {
		slides.value.set(id, { instance, width });
		checkInit();
	};

	const updateSlide = (id, options) => {
		const existing = slides.value.get(id) ?? {};
		slides.value.set(id, Object.assign(existing, options));
	};

	const unregisterSlide = (id) => {
		slides.value.delete(id);
	};

	provide(registerSlideClientKey, {
		registerSlide,
		updateSlide,
		unregisterSlide,
	});

	return {
		slides: readonly(slides),
		slideCount: readonly(slideCount),
		isInit: readonly(isInit),
	};
};

export const useRegisterSlideClient = () => {
	return inject(registerSlideClientKey);
};
