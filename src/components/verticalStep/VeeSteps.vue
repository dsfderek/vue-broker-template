<template>
	<div class="parent-steps">
		<slot></slot>
	</div>
</template>

<script>
export default {
	data() {
		return {
			steps: [], //记录步骤数数组
		}
	},
	props: {
		// 设置当前激活步骤，从1开始
		active: {
			type: Number,
		},
	},
	watch: {
		active(newVal, oldVal) {
			// 当前激活步骤改变时，触发父组件的change方法，将改变前和改变后的步骤作为参数传递出去
			this.$emit('change', newVal, oldVal)
		},
		steps(steps) {
			steps.forEach((child, index) => {
				child.index = index
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.parent-steps {
	position: relative;
	margin: 10px 20px;
}
</style>