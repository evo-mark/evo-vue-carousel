export const nextFrame = (frames = 1) => {
	if (frames <= 1) {
		return new Promise((resolve) => requestAnimationFrame(resolve));
	}

	return new Promise((resolve) => requestAnimationFrame(() => nextFrame(frames - 1).then(resolve)));
};
