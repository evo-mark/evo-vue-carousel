import { configKey } from "../setup/keys";
import { inject } from "vue";

export const useConfig = () => {
	return inject(configKey);
};
