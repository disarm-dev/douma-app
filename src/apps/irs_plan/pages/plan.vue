<template>
  <div>
    <controls>
      <md-button
        slot="primary_action"
        class="md-primary md-icon-button md-raised"
        :class="{'md-warn': edit_mode}"
        :disabled="!$can('write', 'irs_plan') || edit_disabled || isLoading('irs_plan/load_plan') || !can_and_have_focused_planned"
        @click.native='edit_mode = !edit_mode'
      >
        <md-icon>edit</md-icon>
      </md-button>

      <template slot="menu_items">
        <md-menu-item @click="load_plan" :disabled="!$can('read', 'irs_plan') || isLoading('irs_plan/load_plan')">
          <md-icon>assignment_turned_in</md-icon>
          <span>Load plan</span>
        </md-menu-item>

        <!--EDIT MODE-->
        <md-menu-item :disabled="!$can('write', 'irs_plan') || !unsaved_changes" @click="save_plan">
          <md-icon>save</md-icon>
          <span>Save plan</span>
        </md-menu-item>

        <md-menu-item :disabled="!$can('write', 'irs_plan') || !can_clear" @click.native="clear_plan">
          <md-icon>delete</md-icon>
          <span>Clear plan</span>
        </md-menu-item>
      </template>

      <div slot="text">
        {{title}} plan {{current_plan_date ? `from ${current_plan_date}` : ''}}
      </div>
    </controls>

    <div class='applet_container'>
      <div>
        <!-- FILTER TO LIMIT PLAN -->
        <plan_filter
          v-if="must_focus_planning "
          :unsaved_changes="unsaved_changes"
        ></plan_filter>


        <!--PLAN MAP-->
        <md-card>
          <md-card-content>
            <plan_calculator ></plan_calculator>
            <plan_map
              :edit_mode="edit_mode"
              :selected_filter_area_id="selected_filter_area_id"
              @map_ready="edit_disabled = false"
            ></plan_map>
          </md-card-content>
        </md-card>


        <!--PLAN SUMMARY-->
        <md-card class="card"><md-card-content>
          <plan_summary></plan_summary>
        </md-card-content></md-card>

      </div>

      <!-- Progress-->
      <md-dialog ref="geodata_loading_modal" :md-click-outside-to-close="false">
        <md-dialog-title>Loading base layers</md-dialog-title>


        <md-dialog-actions>
          <md-button class="md-primary" @click.native="$refs.geodata_loading_modal.close()">Start planning!</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import moment from 'moment-mini'
  import whichPolygon from 'which-polygon';
  import {featureCollection} from '@turf/helpers'
  import centroid from '@turf/centroid'
  import get from 'lodash.get'

  import controls from 'components/controls.vue'
  import plan_filter from './plan-filter.vue'
  import plan_summary from './plan-summary.vue'
  import plan_map from './plan-map.vue'
  import plan_calculator from './plan-calculator.vue'
  import cache from 'config/cache.js'
  import {Plan} from 'lib/models/plan/model.js'
  import {get_geodata} from 'lib/models/geodata/remote'

  import {get_planning_level_name, get_next_level_up_from_planning_level} from 'lib/instance_data/spatial_hierarchy_helper'
  import {target_areas_inside_focus_filter_area} from '../helpers/target_areas_helper.js'
  import {geodata_in_cache_and_valid} from '../../../lib/models/geodata/geodata.valid'

  export default {
    name: 'Plan',
    components: {controls, plan_filter, plan_summary, plan_map, plan_calculator},
    data() {
      return {
        edit_mode: false,
        edit_disabled: true
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,

        current_plan: state => state.irs_plan.current_plan,
        selected_filter_area_id: state => get(state, 'irs_plan.selected_filter_area_option.id', null),
        unsaved_changes: state => state.irs_plan.unsaved_changes,
        current_plan_date: state =>  {
          if (state.irs_plan.current_plan) {
            return moment(state.irs_plan.current_plan.planned_at).format('hh:mm a DD MMM YYYY')
          }
        },
      }),
      ...mapGetters({
        isLoading: 'loading/isLoading'
      }),
      must_focus_planning() {
        // TODO: @refac Improve checking if planning can be focused
        return get_next_level_up_from_planning_level()
      },
      can_and_have_focused_planned() {
        if (!this.must_focus_planning) return true
        return !!(this.selected_filter_area_id)
      },
      next_level_up_from_planning_level() {
        return get_next_level_up_from_planning_level()
      },
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids',
        selected_filter_area: 'irs_plan/selected_filter_area'
      }),
      title() {
        if (!this.edit_mode) return "View"
        if (this.edit_mode && !this.current_plan_date) return "Create"
        if (this.edit_mode && this.current_plan_date) return "Edit"
       },
      can_clear() {
        return this.selected_target_area_ids.length !== 0
      }
    },
    created() {
      if (!geodata_in_cache_and_valid()) {
        this.$store.commit('meta/set_snackbar', {message: 'Message from PLAN: Problem with geodata'})
        this.$router.push({name: 'meta:geodata'})
      }
    },
    methods: {
      load_plan() {
        this.$startLoading('irs_plan/load_plan')

        this.$store.dispatch('irs_plan/get_network_plan')
          .then(() => { this.$endLoading('irs_plan/load_plan') })
          .catch(() => { this.$endLoading('irs_plan/load_plan') })

      },
      save_plan() {
        let focus_filter_area
        let selected_target_area_ids


        if (!this.selected_filter_area) {
           // Default values if no selected filter area
          focus_filter_area = null
          selected_target_area_ids = this.selected_target_area_ids

        } else {
          // Modify plan if there is a selected_filter_area
          // TODO: @feature Make it obvious to the user that they need to select a filter_area before they can save.
          focus_filter_area = {
            id: this.selected_filter_area.properties[this.next_level_up_from_planning_level.field_name]
          }

          selected_target_area_ids = target_areas_inside_focus_filter_area({
            area_ids: this.selected_target_area_ids,
            selected_filter_area: this.selected_filter_area
          })
        }

        const plan = new Plan().create({
          instance_config: this.instance_config,
          focus_filter_area,
          selected_target_area_ids
        })

        this.$startLoading('irs_plan/save_plan')
        this.$store.dispatch('irs_plan/save_plan', plan)
          .then(() => {
            this.$store.commit('root:set_snackbar', {message: 'Successful save'})
            this.$endLoading('irs_plan/save_plan')
          })
          .catch((e) => {
            // Check if 401 (will already have displayed snackbar)
            if (e.response.status !== 401) {
              this.$store.commit('root:set_snackbar', {message: 'Not saved. Something wrong.'})
            }
            this.$endLoading('irs_plan/save_plan')
          })
      },
      clear_plan() {
        this.$store.commit('irs_plan/clear_plan')
      }
    }
  }
</script>

<style scoped>
  .card {
    margin-top: 10px;
  }

  .centred {
    margin: 0 auto;
  }


</style>
