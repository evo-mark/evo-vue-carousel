import { vi } from "vitest";

// Provide a mock implementation for matchMedia
Object.defineProperty(window, "matchMedia", {
	get: () =>
		vi.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(), // deprecated
			removeListener: vi.fn(), // deprecated
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
});
