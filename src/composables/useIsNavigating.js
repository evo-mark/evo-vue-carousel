import { isNavigatingKey, setIsNavigatingKey } from "../setup/keys";
import { inject } from "vue";

export const useIsNavigating = () => {
	return inject(isNavigatingKey);
};

export const useSetIsNavigating = () => {
	return inject(setIsNavigatingKey);
};
