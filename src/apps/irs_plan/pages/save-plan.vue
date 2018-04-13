<template>
  <md-dialog md-open-from="#custom" md-close-to="#custom" ref="save_plan_dialog">
    <md-dialog-title>Save Plan</md-dialog-title>
    <md-dialog-content>
      <md-list>
        <md-list-item v-for="plan in plan_list">
          <span>
            {{(new Date(plan.date)).toLocaleString()}}
          </span>
          <span>
            <md-button flat @click="update(plan)">update</md-button>
          </span>
          <span>
            <md-button @click="clear(plan)" flat>
              <md-icon>clear</md-icon>
            </md-button>
          </span>
        </md-list-item>
        <md-list-item>
          <span>{{new Date().toLocaleString()}} </span>
          <span><md-button flat @click="create()">Create</md-button></span>
        </md-list-item>
      </md-list>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="cancel()">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  export default {
    props: {
      'plan_list': {
        type: Array
      },
      'show': {
        type: Boolean
      }
    },
    name: "save-plan",
    watch: {
      show: function (val) {
        console.log('Show')
        if (val) {
          this.$refs['save_plan_dialog'].open();
        } else {
          this.$refs['save_plan_dialog'].close();
        }
      }
    },
    methods: {
      update(item) {
        this.$emit('update', item)
      },
      clear(item) {
        this.$emit('clear', item)
      },
      create() {
        this.$emit('create')
      },
      cancel() {
        this.$emit('cancel')
      }
    }
  }

</script>

<style scoped>

</style>
