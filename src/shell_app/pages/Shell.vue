<template>
  <div>
    <md-toolbar class="md-whiteframe-1dp md-dense">
      <md-button class="md-icon-button" disabled>
        <md-icon>menu</md-icon>
      </md-button>

      <!-- BREADCRUMBS -->
      <h2 class="md-title" style="flex: 1">
        DiSARM Launcher {{app_version}}
      </h2>

      <toolbar-controls
          :sw_update_downloading="false"
          :sw_update_available="false"
          :online="true"
      ></toolbar-controls>

    </md-toolbar>
    <router-view></router-view>
  </div>
</template>

<script>
  import ToolbarControls from './ToolbarControls'
  import BUILD_TIME from 'config/build-time'

  export default {
    name: 'shell',
    components: {ToolbarControls},
    computed: {
      app_version() {
        return BUILD_TIME.VERSION_COMMIT_HASH_SHORT
      }
    },
  }
</script>

<style scoped>

</style>