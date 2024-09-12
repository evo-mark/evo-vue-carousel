<template>
	<div class="flex items-center">
		<SvgIcon v-for="n in 5" :key="n" :path="mdiStar" />
	</div>
</template>

<script setup>
import SvgIcon from "vue3-icon";
import { mdiStar } from "@mdi/js";
</script>

<style lang="scss" scoped></style>
