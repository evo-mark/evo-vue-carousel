/**
 * @param { number } newIndex
 * @param { number } totalSlides
 * @param { import("vue").ComputedRef<import("../composables/useResponsiveConfig").ResponsiveConfig> } config
 * @returns { number }
 */
export const checkPosition = (newIndex, totalSlides, config) => {
	// Non-wrap should stop on the last page
	const shouldWrap = config.value.wrap === true;
	const perPage = config.value.perPage;
	const finalPage = totalSlides - perPage;

	if (shouldWrap === false && newIndex < 0) return 0;
	else if (shouldWrap === false && newIndex >= totalSlides) return finalPage;
	else return newIndex;
};
