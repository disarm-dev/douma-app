<template>
  <div>
    <h3>Campaign summary</h3>
    <p>Working with {{selected_target_area_ids.length}} {{planning_level_name}}, containing in total {{number_of_structures_formatted}} {{enumerable_name}}</p>

    <div>
      <b>Resource estimate:</b> {{days_to_spray}} days. (At a rate of <input class="slim-input" type="number" v-model="calculator.enumerables"/> {{enumerable_name}} per team per day, with  <input
      class="slim-input" type="number" v-model="calculator.teams"/> teams)
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import isNumber from 'is-number'
  import numeral from 'numeral'

  import cache from 'config/cache.js'
  import {get_planning_level_name, get_denominator_fields} from 'lib/instance_data/spatial_hierarchy_helper'

  export default {
    name: 'plan-calculator',
    data() {
      return {
        calculator: {
          enumerables: 40,
          teams: 20
        },
      }
    },
    computed: {
      ...mapState({
        slug: state => state.instance_config.instance.slug,
        instance_config: state => state.instance_config
      }),
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids'
      }),
      enumerable_field_name() {
        const denominator = get_denominator_fields()
        const field = Object.keys(denominator)[0] // number_of_structures or number_of_households
        return denominator[field] // gets 'NumHouseho' or 'NmStrct'
      },
      enumerable_name() {
        const denominator = get_denominator_fields()
        const field = Object.keys(denominator)[0]
        return field
      },
      days_to_spray() {
        const structures_per_day = this.calculator.enumerables * this.calculator.teams
        const days_to_spray = this.number_of_structures / structures_per_day
        return numeral(days_to_spray).format('0.0')
      },
      planning_level_name() {
        return get_planning_level_name()
      },
      selected_areas() {
        return cache.geodata[this.planning_level_name].features.filter(feature => {
          return this.selected_target_area_ids.includes(feature.properties.__disarm_geo_id)
        })
      },
      number_of_structures() {
        return this.selected_areas.reduce((sum, area) => {
          const hope_is_number = area.properties[this.enumerable_field_name]
          if (isNumber(hope_is_number)) {
            return sum + hope_is_number
          } else {
            return sum
          }
        }, 0)
      },
      number_of_structures_formatted() {
        return numeral(this.number_of_structures).format('0,0')
      }
    }
  }
</script>

<style scoped>
  .slim-input {
    width: 60px;
  }
</style>
