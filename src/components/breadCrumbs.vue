<template>
  <router-link class='crumb' to='/'>{{crumb}}</router-link>
</template>

<script>
  export default {
    data() { 
      return { 
        crumb: ''
        // crumbs: [] 
      }
    },
    watch: { 
      '$route': 'set_crumbs' 
    },
    mounted() {
      this.crumb = this.$route.meta.title

      // this.set_crumbs()
    },
    methods: {
      set_crumbs() {
        return
        if(this.$route.matched.length === 0) return

        // Get route.meta values (e.g. icon, title, etc)
        const applet_meta_values = this.$router.options.routes.map((route) => {
          return {...route.meta, name: route.name}
        })

        const route_string = `${this.$route.matched[this.$route.matched.length - 1].path}`
        let path_elements = route_string.split('/')
        const params = this.$route.params

        // Remove first matched result, which seems to always be blank
        path_elements = path_elements.splice(1, path_elements.length) 

        // Convert variables into their values
        path_elements = path_elements.map((elem) => {
          return get_value_or_title(elem)
        })
        // Iterate each path_element, create the crumb
        let result = path_elements.map((part, i) => {
          // Force first element to be link to root route
          if (i == 0) {
            const applet = applet_meta_values.find((i) => i.name === part)
            return {
              title: applet.title, 
              icon: applet.icon,
              route: '/meta' // Has to be set to 'meta', as '/' fails to be recognised for some reason
            }
          }

          let title = part[0].toUpperCase() + part.substr(1)
          title = truncString(title, 10, '...')

          return {
            title: title,
            route: '/' + build_path(part, i + 1)
          }
        })

        this.crumbs = result


        // Helper functions
        function get_value_or_title(title){
          // Replace variables with values
          if (title.indexOf(':') === 0) {
             title = title.replace(/\:/, '')
             return params[title]
           } 
          // Or just return the text
          return title
        }

        function build_path(part, index) {
          let newArray = path_elements.slice(0, index)
          return newArray.join('/')
        }

        function truncString(str, max, add){
          add = add || '...';
          return (typeof str === 'string' && str.length > max ? str.substring(0,4)+add : str);
        }
      }
    }

  }
</script>

<style scoped>
  .crumb {
    color: white !important;
    text-decoration: none !important;
  }    
</style>