<template>
  <div class="hm-input">
    <!-- 监听输入框的输入, 一旦输入框变化了, 就将变化后的值, 传递给父组件 -->
    <input type="text" :placeholder="placeholder" :value="value" @input="inputChange">
  </div>
</template>

<script>
export default {
  name: 'hm-input',
  props: ['placeholder', 'value'],
  methods: {
    inputChange (e) {
      // console.log('输入框被修改了', e.target)
      // console.log('输入框被修改了', e.target.value)
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang="less" scoped>
.hm-input {
  input {
    width: 150px;
    height: 30px;
    border: 3px solid #000;
    border-radius: 3px;
  }
}
</style>
