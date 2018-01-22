<template>
  <div class="container">
    <md-list>
      <md-list-item v-for="applet in applets" :key="applet" @click="clear_applet_storage(applet)">
        <md-icon>delete</md-icon><span>clear storage for {{applet}}</span>
      </md-list-item>
      <md-list-item @click="clear_local_storage"><md-icon class="md-warn">delete_forever</md-icon><span>clear local storage (wipes all records, data, etc)</span></md-list-item>
    </md-list>
  </div>
</template>

<script>
  import cache from 'config/cache.js'
  import get from 'lodash.get'

  export default {
    name: 'clear_data',
    data () {
      return {
        geodata_cleared: false
      }
    },
    computed: {
      applets() {
        return get(this.$store.state.meta, 'user.allowed_apps.read', [])
      },
    },
    methods: {
      clear_local_storage() {
        localStorage.clear()
        console.log('Cleared localStorage')
        this.$router.push('/')
        location.reload()
      },
      clear_applet_storage(applet) {
        const mutation  = `${applet}/clear_data_storage`
        this.$store.commit(mutation, {}, {root: true})
        this.$store.commit('root:set_snackbar', {message: `Cleared storage for ${applet}`})
      },
    }
  }
</script>

<style lang="css" scoped>
</style>