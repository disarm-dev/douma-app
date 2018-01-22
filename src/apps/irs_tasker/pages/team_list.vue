<template>
  <div style="margin-top:1em;">
    <md-card>
      <md-list>

        <md-list-item>
          <p class="md-title">Teams for {{instance_location_name}}</p>
        </md-list-item>


        <md-list-item v-if="!decorated_teams.length">
          There are currently no teams. Add one below.
        </md-list-item>

        <md-list-item
          v-for="({team_name, colour, count}, index) in decorated_teams"
          :key="index"
          @click.stop="select_team(team_name)">

          <md-avatar :style="{'background-color': colour}" class="md-avatar-icon">
            <md-icon>people</md-icon>
          </md-avatar>

          <div class="md-list-text-container">
            <span>{{team_name}}</span>
            <span>Assigned {{count}} areas</span>
          </div>

          <md-button
            v-if="team_name !== DECORATED_UNASSIGNED_TEAM.team_name"
            class="md-icon-button md-list-action"
            @click.native="delete_team(team_name)"
          >
            <md-icon>delete</md-icon>
          </md-button>

        </md-list-item>

        <form @submit.prevent="add_team" class="new_team">
          <md-input-container>
            <label>Add new team</label>
            <md-input ref='new_team_name' v-model="new_name"></md-input>
          </md-input-container>
        </form>

      </md-list>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {DECORATED_UNASSIGNED_TEAM} from '../unassigned_team'

  export default {
    props: ['decorated_teams'],
    data() {
      return {
        new_name: '',
        DECORATED_UNASSIGNED_TEAM
      }
    },
    computed: {
      ...mapState({
        instance_location_name: state => state.instance_config.instance.location_name,
        team_names: state => state.irs_tasker.teams,
        assignments: state => state.irs_tasker.assignments,
      }),
    },
    methods: {
      select_team(team_name) {
        this.$emit('selected_team', team_name)
      },
      add_team() {
        // Maximum 8 teams (number of colours in palette)
        const max_teams = 8
        if (this.team_names.length == max_teams) {
          return this.$store.commit('root:set_snackbar', {message: `Maximum ${max_teams} teams.`})
        }
        // Names must be unique
        if (this.team_names.includes(this.new_name)) {
          return this.$store.commit('root:set_snackbar', {message: 'Names must be unique.'})
        }

        // Name cannot be "Unassigned". We use that.
        if (this.new_name.toLowerCase() === DECORATED_UNASSIGNED_TEAM.team_name.toLowerCase()) {
          this.new_name = ''
          return this.$store.commit('root:set_snackbar', {message: `Cannot use "${DECORATED_UNASSIGNED_TEAM.team_name}" as team name!`})
        }

        // Commit all team names
        this.$store.dispatch('irs_tasker/update_teams', this.team_names.concat(this.new_name)).then(() => {
          this.$store.commit('irs_tasker/set_selected_team_name', this.new_name)
          this.new_name = ""
          this.$refs.new_team_name.$el.focus()
        })
      },
      delete_team(team_name) {
        this.$store.dispatch('irs_tasker/delete_team', team_name)
      }
    }
  }
</script>

<style scoped>
  .list {
    max-width: 700px;
    margin: 0 auto;
  }

  .new_team {
    padding: 0 16px;
  }

</style>
