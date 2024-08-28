/**
 * Takes a value and loops it into an acceptable range
 * @param { number } value The value of the next slide index to select
 * @param { number } rangeStart Where the valid range starts
 * @param { number } rangeEnd Where the valid range ends
 * @returns { number} The new index
 */
export function loopedValue(value, rangeStart = 0, rangeEnd) {
	const range = rangeEnd - rangeStart;
	return ((((value - rangeStart) % range) + range) % range) + rangeStart;
}
