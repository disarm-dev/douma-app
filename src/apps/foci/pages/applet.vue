<template>
  <div>
    <md-toolbar>
      <div class="md-toolbar-container">
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

    <md-button @click="get_case_clusters">
      Get remote case clusters 
    </md-button>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    this.get_local();
  },
  methods: {
    get_case_clusters() {
      this.$store.dispatch("foci/get_case_clusters");
    },
    get_local() {
      this.$store.dispatch("foci/get_case_clusters_local");
    }
  }
};
</script>
<style>
  .filter_name {
    margin: 0 10px;
  }
</style>
