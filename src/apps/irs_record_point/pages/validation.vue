<template>
  <div>
    <md-card-header>
      <div class="md-title"><md-icon class="error">error</md-icon> {{validations.errors.length || 0}} Errors</div>
      <div class="md-subhead">cannot save without fixing</div>
    </md-card-header>

    <md-card-content>
      <validation_list
        v-if="validations.errors.length > 0"
        :messages="validations.errors"
        :survey="survey"
        v-on:show_location="$emit('show_location')">
      </validation_list>
    </md-card-content>

    <md-card-header>
      <div class="md-title"><md-icon class="warning">warning</md-icon> {{validations.warnings.length || 0}} Warnings</div>
      <div class="md-subhead">can save without fixing</div>
    </md-card-header>

    <md-card-content>
      <validation_list
        v-if="validations.warnings.length > 0"
        :messages="validations.warnings"
        :survey="survey"
        v-on:show_location="$emit('show_location')">
      </validation_list>
    </md-card-content>
  </div>
</template>

<script>
  import validation_list from './validation_list.vue'

  export default {
    props: ['validations', 'survey'],
    components: {validation_list},
    name: 'validations'
  }
</script>

<style lang="css" scoped>
  .error {
    color: red;
  }

  .warning {
    color: orange;
  }

  .all_clear {
    color: green;
  }
</style>
