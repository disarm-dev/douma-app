<template>
  <div>
    <router-link to="logout">Logout</router-link>
    Applet root for {{config_id}}
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'applet_root',
    props: {
      config_id: String
    }
  }
</script>
