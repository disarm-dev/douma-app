<template>
<div>
  <md-chips
    v-model="date_list"
    md-input-placeholder="Add a season start date"
    md-input-type="date">
  </md-chips>
</div>
</template>

<script>
  import { mapGetters } from 'vuex'

    export default {
        name: "seasons",
      data(){
          return{
          }
      },
      computed: {
        // mix the getters into computed with object spread operator
        date_list:{
          get(){
            return this.season_start_dates
          },
          set(val){
            return val.sort((a,b) => a>b)
          }
        },
        ...mapGetters({
          season_start_dates: 'seasons/irs_seasons'
        })
      }
    }
</script>

<style scoped>

</style>
