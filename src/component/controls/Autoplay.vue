<template>
	<slot name="controls" :pause="pauseAutoplay" :play="resumeAutoplay" :playing="autoplayIsActive"></slot>
</template>

<script setup>
import { useCarouselClient } from "../../composables/useCarousel";

const { pauseAutoplay, resumeAutoplay, autoplayIsActive } = useCarouselClient();
</script>
