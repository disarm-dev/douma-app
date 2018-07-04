<template>
  <md-dialog-confirm
    :md-content-html="warning.contentHtml"
    :md-ok-text="warning.cancel"
    :md-cancel-text="warning.ok"
    @close="on_warning_close"
    ref="warning_dialog">
  </md-dialog-confirm>
</template>

<script>
  export default {
    name: "warning",
    data() {
      return {
        warning: {
          contentHtml: '<b>Editing seasons dates requires reloading the application</b>',
          ok: 'Continue',
          cancel: 'Go Back'
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs['warning_dialog'].open()
      })
    },
    methods: {
      on_warning_close(action) {
        if (action === 'ok') {
          history.back();
        }
      }
    }
  }
</script>

<style scoped>

</style>
