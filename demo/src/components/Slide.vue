<template>
	<div>
		<Rating />
		<slot></slot>
	</div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const Rating = defineAsyncComponent(() => import("./Rating.vue"));
</script>

<style lang="scss" scoped></style>
