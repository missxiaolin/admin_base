<template>
  <div class="app-container">
    侧黑
  </div>
</template>

<script>

export default {
  name: 'PagePermission',
  components: { },
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() })
    }
  }
}
</script>
