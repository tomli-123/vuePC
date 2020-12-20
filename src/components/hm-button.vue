<template>
  <button class="hm-button">
    <slot></slot>
  </button>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.hm-button {
  width: 150px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: pink;
  border-radius: 15px;
}
</style>
