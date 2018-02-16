<template>
  <div>
    <md-toolbar>

      <div class="md-toolbar-container">
        
        <div v-if="show_back_button">
          <md-button @click="go_back()" class="md-icon-button">
            <md-icon>arrow_back</md-icon>
          </md-button>
        </div>

        <div class="filter_name">
          <span>Status:</span>
        </div>

        <div>
          <md-input-container>
            <md-select>
              <md-option value="inactive">inactive</md-option>
              <md-option value="active">active</md-option>
              <md-option value="cleared">cleared</md-option>
            </md-select>
          </md-input-container>
        </div>

        <div class="filter_name">
          <span>Investigation Status:</span>
        </div>

        <div>
          <md-input-container>
            <md-select>
              <md-option value="investigated">investigated</md-option>
              <md-option value="suggested">suggested</md-option>
              <md-option value="visual_review">visual review</md-option>
            </md-select>
          </md-input-container>
        </div>
      </div>

    </md-toolbar>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    show_back_button() {
      const routes_to_show_button = ['foci:detail', 'foci:map', 'foci:list', 'foci:status']
      const current_page = this.$route.name
      if (routes_to_show_button.includes(current_page)) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.get_local();
  },
  methods: {
    get_local() {
      this.$store.dispatch("foci/get_case_clusters_local");
      this.$store.dispatch("foci/get_case_locations_local");
    },
    go_back() {
      this.$router.go(-1)
    }
  }
};
</script>
<style>
  .filter_name {
    margin: 0 10px;
  }
</style>
