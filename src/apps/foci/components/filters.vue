<template>
    <div class="filter-container">
      
      <div class="filter_name">
        <span>Status:</span>
      </div>

      <div class="filter-select">
        <md-input-container>
          <md-select v-model="status">
            <md-option value="inactive">inactive</md-option>
            <md-option value="active">active</md-option>
            <md-option value="cleared">cleared</md-option>
            <md-option value=""></md-option>
          </md-select>
        </md-input-container>
      </div>

      <div class="filter_name">
        <span>Investigation Status:</span>
      </div>

      <div class="filter-select">
        <md-input-container>
          <md-select v-model="investigation_status">
            <md-option value="investigated">investigated</md-option>
            <md-option value="suggested">suggested</md-option>
            <md-option value="visual_review">visual review</md-option>
            <md-option value=""></md-option>
          </md-select>
        </md-input-container>
      </div>

      <md-button id="clear" @click="clear_filters">
        Clear
      </md-button>

    </div>
</template>
<script>
export default {
  computed: {
    investigation_status: {
      get() {
        const filter = this.$store.state.foci.filters.find(filter => filter.name === "investigation_status")
        if (filter) {
          return filter.value
        } else {
          return ''
        }
      },
      set(value) {
        this.$store.commit('foci/set_filter', {name: 'investigation_status', value})
      }
    },
    status: {
      get() {
        const filter = this.$store.state.foci.filters.find(filter => filter.name === "status")
        if (filter) {
          return filter.value
        } else {
          return ''
        }
      },
      set(value) {
        this.$store.commit('foci/set_filter', {name: 'status', value})
      }
    }
  },
  methods: {
    clear_filters() {
      const value = ''
      this.$store.commit('foci/set_filter', {name: 'investigation_status', value})
      this.$store.commit('foci/set_filter', {name: 'status', value})
    }
  }
}
</script>

<style scoped>
  .filter-container {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    align-self: flex-start;
  }

  .filter_name {
    margin: 0 10px;
  }

  .filter-select {
    margin-right: 15px;
  }
</style>
