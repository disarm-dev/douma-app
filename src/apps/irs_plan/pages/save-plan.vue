<template>
  <md-dialog md-open-from="#custom" md-close-to="#custom" ref="save_plan_dialog">
    <md-dialog-title>Save Plan</md-dialog-title>
    <md-dialog-content>
      <md-list class="md-double-line">
        <md-list-item v-for="plan in plan_list" :key="plan.date">
          <div class="md-list-text-container">
            <span>{{plan.name?plan.name:'No Name'}}</span>
            <span>{{(new Date(plan.date)).toLocaleString()}}-{{plan.targets}} targets</span>
          </div>
          <span>
            <md-button flat @click="update(plan)" >update</md-button>
          </span>
          <span>
            <md-button @click="clear(plan)" class="md-icon-button md-list-action" flat>
              <md-icon>clear</md-icon>
            </md-button>
          </span>
        </md-list-item>
        <md-list-item>
          <div class="md-list-text-container">
              <span>
             <md-input-container>
                <label>Plan Name</label>
                <md-input required></md-input>

             </md-input-container>
          </span>
            <span>{{new Date().toLocaleString()}} </span>
          </div>
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
    data(){
      return {
        new_plan_name:''
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
