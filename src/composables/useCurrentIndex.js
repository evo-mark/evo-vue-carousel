import { currentIndexKey, setCurrentIndexKey } from "../setup/keys";
import { inject } from "vue";

export const useCurrentIndex = () => {
	return inject(currentIndexKey);
};

export const useSetCurrentIndex = () => {
	return inject(setCurrentIndexKey);
};
