<template>
  <div></div>
</template>
<script>
export default {
  components: {
    'remote': {
      render(createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: this.src } });
      },
      props: {
        src: { type: String, required: true },
      },
    },
  },
}
</script>

