<template>
  <div
    class="flex w-full text-center text-gray-700 font-bold pt-4 m-auto max-w-2xl"
  >
    <div
      v-for="tab in tabs"
      :key="tab"
      @click="$emit('nav', tab)"
      class="flex-1 cursor-pointer"
      :class="{ 'text-teal-700': active === tab }"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['active'],
  data() {
    return {
      tabs: ['clock', 'active', 'hours']
    }
  }
}
</script>
