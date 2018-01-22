<template>
  <div>
    <!-- Toolbar -->
    <toolbar></toolbar>

    <!-- Sidenav -->
    <sidebar></sidebar>

    <!-- Notifications (snackbar and serviceWorker dialog) -->
    <notifications></notifications>

    <!-- Help -->
    <help></help>

    <!-- Applet container -->
    <router-view></router-view>
  </div>
</template>

<script>
  import toolbar from 'components/toolbar.vue'
  import notifications from 'components/notifications.vue'
  import sidebar from 'components/sidebar.vue'
  import help from 'components/help.vue'

  export default {
    name: 'DOUMA',
    components: {toolbar, sidebar, notifications, help}
  }
</script>

<style>
  body {
    background-color: white;
    padding-top: 48px;
  }

  .applet_container {
    margin: 0.6em auto;
    width: 100%;
    padding: 0 1em;
  }

  @media screen and (min-width: 600px) {
    .applet_container {
      width: 90%;
    }
  }



</style>
