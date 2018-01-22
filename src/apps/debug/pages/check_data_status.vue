<template>
  <div>
    <md-list>
      <md-list-item><span>instance_config (check is valid against schema?)</span></md-list-item>

      <md-list-item>
        <md-icon>assignment</md-icon>
        <span>things which rely on form fields</span>

        <md-list-expand>
          <md-list-item @click="log_form_elements"><span>form (check against what?)</span></md-list-item>
          <md-list-item @click="check_validations_fields"><span>validations</span><md-icon v-if="success.validations">check</md-icon></md-list-item>
          <md-list-item @click="check_aggregations_fields"><span>aggregations</span><md-icon v-if="success.aggregations">check</md-icon></md-list-item>
          <md-list-item @click="check_presenters_fields"><span>presenters</span><md-icon v-if="success.presenters">check</md-icon></md-list-item>
          <md-list-item @click="check_fake_form_fields"><span>fake_form</span><md-icon v-if="success.fake_form">check</md-icon></md-list-item>
        </md-list-expand>
      </md-list-item>
      <md-divider class="md-inset"></md-divider>


      <md-list-item>
        <md-icon>explore</md-icon>
        <span>geodata (lots!)</span>
        <md-list-expand>
          <md-list-item @click="get_geodata"><span>Get geodata</span><md-icon v-if="success.local_geodata_ready">check</md-icon></md-list-item>
          <md-list-item @click="check_geodata_valid"><span>Check data exists</span><md-icon v-if="success.geodata_valid">check</md-icon></md-list-item>
          <md-list-item @click="decorate_geodata"><span>Decorate geodata</span><md-icon v-if="success.decorated_geodata">check</md-icon></md-list-item>
          <md-list-item @click="create_location_selection"><span>Create and download location selection</span><md-icon v-if="success.location_selection_created">check</md-icon></md-list-item>
        </md-list-expand>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex'
  import moment from 'moment-mini'
  import download from 'downloadjs'

  // Form
  import {get_form_elements} from 'lib/instance_data/form_helpers'
  import {fields_for_aggregations_exist_in_form} from 'lib/models/response/aggregations/aggregator.instance_assertions.js'
  import {fields_for_validations_exist_in_form} from 'lib/models/response/validations/instance_assertions'
  import {fields_for_presenters_exist_in_form} from 'lib/instance_data/presenters.instance_assertions'
  import {fields_for_fake_form_exist_in_form} from 'lib/debug/fake_form.instance_assertions'

  // Geodata
  import cache from 'config/cache'
  import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
  import {decorate_geodata_on_cache} from 'lib/models/geodata/geodata.decorate'
  import {generate_location_selections} from 'lib/debug/generate_location_selection'

  export default {
    name: 'check_data_status',
    mounted() {
    },
    data() {
      return {
        success: {
          validations: false,
          aggregations: false,
          presenters: false,
          fake_form: false,

          // Geodata
          local_geodata_ready: false,
          geodata_valid: false,
          decorated_geodata: false,
          location_selection_created: false,
        }
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
      })
    },
    mounted() {
    },
    methods: {
      log_form_elements() {
        console.table(get_form_elements(this.instance_config.form))
      },
      check_validations_fields() {
        const result = fields_for_validations_exist_in_form({validations: this.instance_config.validations, form: this.instance_config.form})
        this.success.validations = result
      },
      check_aggregations_fields() {
        const result = fields_for_aggregations_exist_in_form({aggregations: this.instance_config.aggregations, form: this.instance_config.form})
        this.success.aggregations = result
      },
      check_presenters_fields() {
        const result = fields_for_presenters_exist_in_form({presenters: this.instance_config.presenters, form: this.instance_config.form})
        this.success.presenters = result
      },
      check_fake_form_fields() {
        const result = fields_for_fake_form_exist_in_form({fake_form: this.instance_config.fake_form, form: this.instance_config.form})
        this.success.fake_form = result
      },
      // Geodata
      get_geodata() {
        this.success.local_geodata_ready = false
        console.log('replace get_geodata function')
//        get_geodata(this.$store, true).then(() => this.success.local_geodata_ready = true)
      },
      check_geodata_valid() {
        const result = geodata_in_cache_and_valid()
        if (!result) console.log('geodata_has_all_levels', geodata_has_all_levels())
        this.success.geodata_valid = result
      },
      decorate_geodata() {
        const result = decorate_geodata_on_cache(cache.geodata)
        this.success.decorated_geodata = result
      },
      create_location_selection() {
        const result = generate_location_selections()

        const content = JSON.stringify(result)
        const date = moment().format('YYYY-MM-DD_HHmm')
        download(content, `${this.instance_config.instance.slug}.location_selection.${date}.json`)

        this.success.location_selection_created = !!(result)
      }
    }
  }
</script>

<style scoped>

</style>
