<script setup>
import BoardHeader from '~/components/Board/BoardHeader.vue'
</script>

<template>
  <div>
    <BoardHeader />
    <main style="max-width:1200px;margin:0 auto;padding:20px">
      <slot />
    </main>
  </div>
</template>
