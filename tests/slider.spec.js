import { expect, test } from "vitest";
import { render } from "@testing-library/vue";
import * as matchers from "vitest-axe/matchers";
import { axe } from "vitest-axe";
import VueCarousel from "../src/component/index.vue";

expect.extend(matchers);

test("VueCarousel should have no accessibility violations", async () => {
	const { container } = render(VueCarousel, {
		props: {
			label: "Submit",
		},
	});

	const results = await axe(container);
	expect(results).toHaveNoViolations();
});
