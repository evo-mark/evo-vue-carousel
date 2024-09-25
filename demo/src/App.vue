<template>
	<header class="bg-zinc-900 py-4">
		<div class="container">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 648.69 87.39" class="h-8 lg:h-12">
				<path
					class="fill-white"
					d="M21.17,62.64c8.51,10.93,22.3,11.18,25.36,11.18,10.02,0,18.41-3.39,24.71-10.34l8.56,10.01c-7.75,9.05-19.54,13.89-33.76,13.89C18.42,87.38,0,69.13,0,43.61S18.25,0,42.96,0s42.32,17.77,42.32,44.09c0,1.29-.16,3.23-.32,4.69H24.83v-11.15h45.6c-1.62-14.38-12.44-24.55-27.46-24.55-2.3,0-11.11,.14-18.53,6.68-9.32,8.21-9.24,20.14-9.21,23.73,.02,3.26,.08,11.62,5.94,19.14h0Z"
				></path>
				<path
					class="fill-white"
					d="M180.92,.82l-37.47,85.61h-15.83L90.15,.82h16.15l29.4,68.65L165.74,.82h15.18Z"
				></path>
				<path
					class="fill-white"
					d="M185.11,43.62C185.11,18.1,204.01,0,229.69,0s44.42,18.09,44.42,43.61-18.74,43.77-44.42,43.77-44.58-18.25-44.58-43.77Zm73.33,0c0-18.25-12.27-30.04-28.75-30.04s-28.91,11.79-28.91,30.04,12.44,30.21,28.91,30.21,28.75-11.95,28.75-30.21Z"
				></path>
				<path
					class="fill-white"
					d="M375.74,86.68l-.12-71.41-34.93,60.32h-2.98l-34.93-60.08V86.68h-5.96V3.23h5.13l37.31,64.49L376.57,3.23h5.01l.12,83.45h-5.96Z"
				></path>
				<path
					class="fill-white"
					d="M462.39,63.19h-48.4l-10.61,23.48h-6.56L435.21,3.22h6.08l38.38,83.45h-6.56l-10.73-23.48h0Zm-2.26-5.13l-21.93-48.16-21.81,48.16h43.74Z"
				></path>
				<path
					class="fill-white"
					d="M552.75,86.68l-19.91-27.89c-2.62,.36-5.24,.6-8.1,.6h-23.84v27.3h-6.08V3.24h29.92c20.98,0,33.62,10.49,33.62,28.13,0,13.23-7.15,22.41-19.55,26.11l20.86,29.21h-6.92Zm-28.01-32.67c17.88,0,27.42-8.34,27.42-22.65s-9.54-22.65-27.42-22.65h-23.84V54.02h23.84Z"
				></path>
				<path
					class="fill-white"
					d="M605.43,45.55l-18.72,19.19v21.93h-6.08V3.22h6.08V56.86L638.8,3.22h7.39l-36.72,37.91,39.22,45.54h-7.39l-35.88-41.13h0Z"
				></path>
			</svg>
		</div>
	</header>
	<div class="container">
		<EvoVueCarousel
			wrap
			:responsive="responsiveConfig"
			per-page="1"
			slide-by="1"
			:gap="40"
			pause-on-hover
			disable-on-navigation
			pagination-background-class="py-1 bg-white/50 backdrop-blur"
		>
			<div v-for="slide in slides" :key="slide" class="relative w-full h-full">
				<img :src="slide" class="w-full h-full object-cover" />
				<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500 flex flex-col">
					<div class="flex gap-4">
						<SvgIcon v-for="n in 4" :key="n" :path="mdiStar" size="48" />
					</div>
					Testing
				</div>
			</div>
		</EvoVueCarousel>
		<h2 class="my-4">Gallery Mode</h2>
		<EvoVueCarousel
			:wrap="false"
			mode="gallery"
			:responsive="responsiveConfig"
			per-page="1"
			gap="40"
			pause-on-hover
			disable-on-navigation
			navigation-item-size-class="size-8"
		>
			<div v-for="slide in slides" :key="slide">
				<img :src="slide" />
			</div>
			<template #pagination="{ isNavigating }">
				<span
					:class="{
						'text-red-600': isNavigating,
					}"
					>Testing</span
				>
			</template>
		</EvoVueCarousel>
	</div>
</template>

<script setup>
import { mdiStar } from "@mdi/js";
import { EvoVueCarousel } from "evo-vue-carousel";
import SvgIcon from "vue3-icon";

const responsiveConfig = {
	something: {
		autoplay: true,
	},
	1024: {
		perPage: 3,
	},
	768: {
		gap: 20,
		perPage: 2,
		slideBy: 1,
		autoplay: 5000,
		wrap: true,
	},
	340: {
		autoplay: true,
		wrap: true,
	},
};

const slides = [
	"https://picsum.photos/seed/sic-mundus-creatus-est/1920/1080",
	"https://picsum.photos/seed/alpha-and-omega/1920/1080",
	"https://picsum.photos/seed/the-end-is-the-beginning/1920/1080",
	"https://picsum.photos/seed/tannhaus/1920/1080",
	"https://picsum.photos/seed/inside-the-knot/1920/1080",
];
</script>
