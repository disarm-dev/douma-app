<template>
  <md-toolbar class="md-dense sub_toolbar">
    <slot name="primary_action"></slot>

    <md-menu md-direction="bottom right" md-size="6">
      <md-button class="md-icon-button md-primary md-raised" md-menu-trigger>
        <md-icon>more_vert</md-icon>
      </md-button>

      <md-menu-content>
        <slot name="menu_items"></slot>
      </md-menu-content>
    </md-menu>

    <div class="text">
      <slot name="text"></slot>
    </div>

    <slot name="buttons">
    </slot>
  </md-toolbar>

</template>

<script>
  export default {
    name: 'controls'
  }
</script>

<style scoped>
  .sub_toolbar {
    background-color: #dedede !important;
    color: #696969 !important;
    position: sticky;
    top: 48px;
    z-index: 10;
  }

</style>
