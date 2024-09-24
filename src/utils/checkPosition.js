import { EVO_VUE_CAROUSEL_MODE } from "./constants";

/**
 * Checks the index position is valid
 * @param { number } newIndex The target index
 * @param { number } totalSlides The total number of slides
 * @param { import("vue").ComputedRef<import("../composables/useResponsiveConfig").ResponsiveConfig> } config The current config
 * @returns { number } The validated target index
 */
export const checkPosition = (newIndex, totalSlides, config) => {
	// Non-wrap should stop on the last page
	const isGallery = config.value.mode === EVO_VUE_CAROUSEL_MODE.GALLERY;
	const shouldWrap = config.value.wrap === true;
	const perPage = config.value.perPage;
	const finalPage = totalSlides - perPage;

	if (isGallery) {
		if ((newIndex < 0 && shouldWrap === false) || finalPage < 0 || newIndex > totalSlides) return 0;
		else return newIndex;
	}

	if (shouldWrap === false && newIndex < 0) return 0;
	else if (shouldWrap === false && newIndex >= totalSlides) return finalPage;
	else return newIndex;
};
