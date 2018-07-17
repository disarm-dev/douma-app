<template>
  <div>
    Just login already, ok?
    <md-button class="md-primary" @click="do_login">Login</md-button>
  </div>
</template>

<script>
  export default {
    name: 'login',
    methods: {
      do_login() {
        const user = {
          '_id': 'dev2',
          'name': 'Jonathan',
          'username': 'js',
          'key': 'b48fbf5e746e6bfbd6c36dca5ff088b3',
          'instance_slug': 'all',
          'allowed_apps': {
            'read': ['irs_record_point', 'record2', 'bod-client', 'debug'],
            'write': ['irs_record_point', 'record2', 'bod-client', 'debug']
          },
          'permissions': ['read:irs_monitor', 'read:irs_record_point', 'read:record2', 'write:record2', 'read:debug', 'write:irs_monitor', 'write:irs_record_point', 'write:debug', 'read:bod-client', 'write:bod-client']
        }
        this.$store.commit('set_user', user)
        this.$router.push({name: 'shell:instance_configs'})
      }
    }
  }
</script>

<style scoped>

</style>