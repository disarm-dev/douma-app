<template>
  <div>
    <controls>
      <template slot="menu_items">
        <md-menu-item :disabled="!$can('read', 'irs_tasker') || isLoading('irs_tasker/load_plan')" @click="load_plan">
          <md-icon>assignment_turned_in</md-icon>
          <span>Load plan</span>
        </md-menu-item>
        <md-menu-item :disabled="!$can('write', 'irs_tasker') || isLoading('irs_tasker/save_assignments') || !plan_target_ids.length || !assignments.length || !unsynced_changes" @click="save_assignments">
          <md-icon>save</md-icon>
          <span>Save assignments</span>
        </md-menu-item>
        <md-menu-item :disabled="!$can('read', 'irs_tasker') || isLoading('irs_tasker/load_assignments') || !plan_target_ids.length" @click="load_assignments">
          <md-icon>group</md-icon>
          <span>Load assignments</span>
        </md-menu-item>
      </template>

      <div slot="text">Assign teams to areas of the plan.</div>

    </controls>

    <div class="applet_container">

      <md-card>
        <md-card-content>
          <!--LEGEND-->
          <map_legend
            :entries="entries_for_legend"
            :selected_entry="selected_team_name"
            @select="select_team"
            title="Teams"
          ></map_legend>

          <!--MAP-->
          <tasker_map
            :plan_target_ids="plan_target_ids"
            :assignments="assignments"
            :decorated_teams="decorated_teams"

            @assign_areas_to_selected_team="assign_areas_to_selected_team"
          ></tasker_map>
        </md-card-content>
      </md-card>

      <!--TEAM LIST-->
      <team_list
        :assignments="assignments"
        :decorated_teams="decorated_teams"
        @selected_team="select_team"
      ></team_list>

    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import chroma from 'chroma-js'

  import controls from 'components/controls.vue'
  import team_list from './team_list'
  import map_legend from 'components/map_legend.vue'
  import tasker_map from './tasker-map.vue'
  import {AssignmentPlan} from 'lib/models/assignment_plan/model'
  import {DECORATED_UNASSIGNED_TEAM} from '../unassigned_team'
  import {get_geodata} from 'lib/models/geodata/remote.js'
  import {geodata_in_cache_and_valid} from '../../../lib/models/geodata/geodata.valid'

  const PALETTE = chroma.brewer.Set2

  export default {
    components: {controls, team_list, tasker_map, map_legend},
    data() {
      return {
        _geodata_areas: null,
        target_areas: null,
        click_handler: null,
      }
    },
    computed: {
      ...mapState({
        instance_slug: state => state.instance_config.instance.slug,

        unsynced_changes: state => state.irs_tasker.unsynced_changes,
        selected_team_name: state => state.irs_tasker.selected_team_name,
        plan_target_ids: state => state.irs_tasker.plan_target_ids,
        assignments: state => state.irs_tasker.assignments
      }),
      ...mapGetters({
        isLoading: 'loading/isLoading'
      }),
      entries_for_legend() {
        return this.decorated_teams.map(({team_name, colour, count}) => {
          return {
            colour: colour,
            text: team_name
          }
        })
      },
      decorated_teams() {
        const team_names = this.$store.state.irs_tasker.teams
        const unassigned_count = this.assignments.filter(a => a.team_name === DECORATED_UNASSIGNED_TEAM.team_name).length

        return team_names.map((team_name, index) => {
          return {
            team_name,
            colour: PALETTE[index],
            count: this.assignments.filter(a => a.team_name === team_name).length
          }
        }).filter(t => t.team_name !== DECORATED_UNASSIGNED_TEAM.team_name)
          .concat({...DECORATED_UNASSIGNED_TEAM, count: unassigned_count})
      }
    },
    created() {
      if (!geodata_in_cache_and_valid()) {
        this.$store.commit('meta/set_snackbar', {message: 'Message from TASK: Problem with geodata'})
        this.$router.push({name: 'meta:geodata'})
      }
    },
    methods: {
      // Load plan, and load-and-save assignments
      load_plan() {
        this.$startLoading('irs_tasker/load_plan')

        this.$store.dispatch('irs_tasker/get_current_plan')
          .then(() => { this.$endLoading('irs_tasker/load_plan') })
          .catch(() => { this.$endLoading('irs_tasker/load_plan') })
      },
      load_assignments() {
        this.$startLoading('irs_tasker/load_assignments')

        this.$store.dispatch('irs_tasker/load_assignment_plan')
          .then(() => { this.$endLoading('irs_tasker/load_assignments') })
          .catch(() => { this.$endLoading('irs_tasker/load_assignments') })
      },
      save_assignments() {
        this.$startLoading('irs_tasker/save_assignments')

        this.$store.dispatch('irs_tasker/save_assignment_plan')
          .then(() => { this.$endLoading('irs_tasker/save_assignments') })
          .catch(() => { this.$endLoading('irs_tasker/save_assignments') })
      },
      // Select team and assign
      assign_areas_to_selected_team(area_ids) {
        if (!Array.isArray(area_ids)) area_ids = [area_ids]

        area_ids.forEach(area_id => {
          this.$store.dispatch('irs_tasker/assign_area_to_team', {area_id, team_name: this.selected_team_name})
        })
      },
      select_team(team_name) {
        this.$store.commit('irs_tasker/set_selected_team_name', team_name)
      },

    }
  }
</script>

<style scoped>
  .buttons {
    margin-bottom: 1em;
  }
</style>
