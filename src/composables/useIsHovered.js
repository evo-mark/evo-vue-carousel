import { isHoveredKey } from "../setup/keys";
import { inject } from "vue";

export const useIsHovered = () => {
	return inject(isHoveredKey);
};
