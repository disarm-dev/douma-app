<template>
  <div>
    <h4>Select instance_config to load</h4>
    <ul>
      <li @click="load_instance('instance_1')">instance_1</li>
      <li @click="load_instance('instance_2')">instance_2</li>
    </ul>
  </div>
</template>

<script>
  import pubsubcache from 'lib/helpers/pubsubcache'

  export default {
    name: 'instance_configs',
    methods: {
      load_instance(instance_config_id) {
        const instance_config = {
          '_id': 'bwa@1.0.19',
          'config_id': 'bwa',
          'config_version': '1.0.19',
          'applets': {
            'irs_monitor': {
              'charts': [{
                'chart_type': 'text',
                'id': 'variable_definition',
                'options': {
                  'text': '**Room**: \nAn enclosed space (e.g. bedrooms, living rooms, kitchen)\n\n**Other structure**: \nBesides rooms, any other structures that are sprayable (e.g. bathrooms, toilets, passages, open-kitchens)\n\n**Building**: \nOne or more conjoined rooms\n\n**Homestead**: \nA yard with one or more buildings\n\n**Household**: \nA group of people who share the same home\n\n**Head of household**: \nAny person responsible for the people who live in a household',
                  'title': 'Variable definitions'
                },
                'style': {'height_constraint': 'none', 'width_constraint': 'half'}
              }, {
                'id': 'room_coverage',
                'options': {
                  'bin_by': 'recorded_on',
                  'chart_type': 'line',
                  'cumulative': true,
                  'geographic_level_refactor_this_key_name': 'location.selection.id',
                  'layout': {
                    'showlegend': true,
                    'title': 'Room coverage as % of target',
                    'xaxis': {'title': 'Period commencing'},
                    'yaxis': {'title': '% coverage'}
                  },
                  'multi_series': [{'aggregation_name': 'room spray coverage (%)'}],
                  'time_series': true
                },
                'style': {'height_constraint': 'none', 'width_constraint': 'half'}
              }, {
                'id': 'spray_status_absolute',
                'options': {
                  'bin_by': '_decorated.sprayed_status',
                  'chart_type': 'bar',
                  'layout': {
                    'showlegend': true,
                    'title': 'Spray status',
                    'xaxis': {'title': 'Spray status'},
                    'yaxis': {'title': '# of households'}
                  },
                  'single_series': {'aggregation_name': 'count'}
                },
                'style': {'height_constraint': 'none', 'width_constraint': 'half'}
              }, {
                'id': 'spray_status_pie',
                'options': {
                  'chart_type': 'pie',
                  'generate_series_from': '_decorated.sprayed_status',
                  'layout': {'title': 'Sprayed status proportion'}
                },
                'style': {'height_constraint': 'none', 'width_constraint': 'half'}
              }, {
                'id': 'room_coverage_by_week',
                'options': {
                  'bin_by': 'recorded_on',
                  'chart_type': 'bar',
                  'cumulative': true,
                  'layout': {
                    'barmode': 'stack',
                    'showlegend': true,
                    'title': 'Spray room coverage',
                    'xaxis': {'title': 'Period commencing'},
                    'yaxis': {'title': '# of rooms'}
                  },
                  'multi_series': [{
                    'aggregation_name': 'number of rooms sprayed',
                    'colour': 'green'
                  }, {'aggregation_name': 'number of rooms not sprayed', 'colour': 'red'}],
                  'time_series': true
                },
                'style': {'height_constraint': 'none', 'width_constraint': 'half'}
              }, {
                'id': 'total_rooms_sprayed_per_week',
                'options': {
                  'bin_by': 'recorded_on',
                  'chart_type': 'bar',
                  'layout': {
                    'showlegend': true,
                    'title': 'Total number of rooms sprayed per week',
                    'xaxis': {'title': 'Period commencing'},
                    'yaxis': {'title': '# of rooms'}
                  },
                  'multi_series': [{'aggregation_name': 'number of rooms sprayed'}],
                  'time_series': true
                },
                'style': {'height_constraint': 'none', 'width_constraint': 'half'}
              }, {
                'id': 'spray_status_pie_reason',
                'options': {
                  'chart_type': 'pie',
                  'layout': {'title': 'Reasons for not spraying room'},
                  'multi_series': [{'aggregation_name': 'number of rooms not sprayed - locked'}, {'aggregation_name': 'number of rooms not sprayed - nobody'}, {'aggregation_name': 'number of rooms not sprayed - refusal'}, {'aggregation_name': 'number of rooms not sprayed - baby'}, {'aggregation_name': 'number of rooms not sprayed - patient'}, {'aggregation_name': 'number of rooms not sprayed - funeral'}, {'aggregation_name': 'number of rooms not sprayed - kitchen'}, {'aggregation_name': 'number of rooms not sprayed - food storage'}, {'aggregation_name': 'number of rooms not sprayed - material'}, {'aggregation_name': 'number of rooms not sprayed - other'}]
                },
                'style': {'height_constraint': 'none', 'width_constraint': 'half'}
              }],
              'map': {
                'aggregation_names': ['number of rooms sprayed', 'room spray coverage (%)'],
                'bin_by': 'location.selection.id',
                'chart_type': 'map',
                'property_layers': [{'label': 'Risk', 'property': 'risk'}, {
                  'label': 'Number of rooms',
                  'property': 'Num_Rooms'
                }],
                'response_point_fields': ['recorded_on', 'form_data.number_of_buildings_in_homesteads', 'form_data.number_of_rooms', '_decorated.sprayed_status', 'form_data.number_sprayed', 'form_data.number_of_rooms_not_sprayed']
              },
              'season_start_dates': ['2018-09-01', '2018-06-01', '2017-09-01'],
              'table': {
                'aggregation_names': ['number of people in homestead (total)', 'number of people in the homestead (<5 yrs)', 'number of people in the homestead (>5 yrs)', 'number of buildings visited', 'number of rooms visited', 'number of rooms sprayed', 'room spray coverage (%)', 'number of rooms sprayed with DDT', 'number of rooms sprayed with lambda-cyhalothrin', 'number of rooms sprayed with actellic', 'number of other structures visited', 'Total other structures sprayed', 'number of rooms not sprayed', 'number of rooms not sprayable (N)', 'number of rooms not sprayable (%)', 'Number of sprayable rooms not sprayed', 'number of rooms not sprayed - locked', 'number of rooms not sprayed - locked (%)', 'number of rooms not sprayed - nobody', 'number of rooms not sprayed - nobody (%)', 'number of rooms not sprayed - refusal', 'number of rooms not sprayed - refusal (%)', 'number of rooms not sprayed - baby', 'number of rooms not sprayed - baby (%)', 'number of rooms not sprayed - patient', 'number of rooms not sprayed - patient (%)', 'number of rooms not sprayed - funeral', 'number of rooms not sprayed - funeral (%)', 'number of rooms not sprayed - kitchen', 'number of rooms not sprayed - kitchen (%)', 'number of rooms not sprayed - food storage', 'number of rooms not sprayed - food storage (%)', 'number of rooms not sprayed - other', 'number of rooms not sprayed - other (%)'],
                'bin_by': 'location.selection.id',
                'chart_type': 'table',
                'property_layers': [{'label': 'Name', 'property': '__disarm_geo_name'}, {
                  'label': 'Number of rooms',
                  'property': 'Num_Rooms'
                }]
              },
              'title': 'Dashboard'
            },
            'irs_plan': {
              'table_output': [{
                'display_name': 'District name',
                'source_field': 'name_2'
              }, {
                'display_name': 'Village name',
                'source_field': 'VILLAGE'
              }, {
                'display_name': 'Number of buildings enumerated',
                'source_field': 'NumStrct'
              }, {
                'display_name': 'Estimated number of rooms',
                'source_field': 'Num_Rooms'
              }, {'display_name': 'Predicted risk', 'source_field': 'risk'}], 'title': 'Planning + Management'
            },
            'irs_record_point': {
              'metadata': {'optional_fields': [], 'show': true},
              'title': 'Data Collection + Reporting',
              'filter_field': 'household_name'
            },
            'seasons': {'title': 'Admin'},
            'debug': {},
            'meta': {}
          },
          'aggregations': [{
            'denominator_field': 'Num_Rooms',
            'name': 'room spray coverage (%)',
            'numerator_expr': 'number_sprayed'
          }, {
            'name': 'number of people in homestead (total)',
            'numerator_expr': 'n_people_homestead_underage5 + n_people_homestead_overage5'
          }, {
            'name': 'number of people in the homestead (<5 yrs)',
            'numerator_expr': 'n_people_homestead_underage5'
          }, {
            'name': 'number of people in the homestead (>5 yrs)',
            'numerator_expr': 'n_people_homestead_overage5'
          }, {
            'name': 'number of buildings visited',
            'numerator_expr': 'number_of_buildings_in_homesteads'
          }, {
            'name': 'number of rooms visited',
            'numerator_expr': 'number_of_rooms'
          }, {
            'name': 'number of rooms sprayed',
            'numerator_expr': 'number_sprayed'
          }, {
            'name': 'number of rooms sprayed with DDT',
            'numerator_expr': 'number_sprayed_ddt'
          }, {
            'name': 'number of rooms sprayed with lambda-cyhalothrin',
            'numerator_expr': 'number_sprayed_lambdacyhalothrin'
          }, {
            'name': 'number of rooms sprayed with actellic',
            'numerator_expr': 'number_sprayed_actellic'
          }, {
            'name': 'number of other structures visited',
            'numerator_expr': 'number_other_structures'
          }, {
            'name': 'Total other structures sprayed',
            'numerator_expr': 'number_sprayed_other_partial_spray'
          }, {
            'name': 'number of rooms not sprayed',
            'numerator_expr': 'number_of_rooms_not_sprayed'
          }, {
            'name': 'number of rooms not sprayable (N)',
            'numerator_expr': 'n_rooms_material'
          }, {
            'denominator_field': 'Num_Rooms',
            'name': 'number of rooms not sprayable (%)',
            'numerator_expr': 'n_rooms_material'
          }, {
            'name': 'Number of sprayable rooms not sprayed',
            'numerator_expr': 'number_of_rooms_not_sprayed'
          }, {
            'name': 'number of rooms not sprayed - locked',
            'numerator_expr': 'rooms_locked'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - locked (%)',
            'numerator_expr': 'rooms_locked'
          }, {
            'name': 'number of rooms not sprayed - nobody',
            'numerator_expr': 'n_rooms_nobody'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - nobody (%)',
            'numerator_expr': 'n_rooms_nobody'
          }, {
            'name': 'number of rooms not sprayed - refusal',
            'numerator_expr': 'n_rooms_refused'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - refusal (%)',
            'numerator_expr': 'n_rooms_refused'
          }, {
            'name': 'number of rooms not sprayed - baby',
            'numerator_expr': 'n_rooms_baby'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - baby (%)',
            'numerator_expr': 'n_rooms_baby'
          }, {
            'name': 'number of rooms not sprayed - patient',
            'numerator_expr': 'n_rooms_patient'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - patient (%)',
            'numerator_expr': 'n_rooms_patient'
          }, {
            'name': 'number of rooms not sprayed - funeral',
            'numerator_expr': 'n_rooms_funeral'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - funeral (%)',
            'numerator_expr': 'n_rooms_funeral'
          }, {
            'name': 'number of rooms not sprayed - kitchen',
            'numerator_expr': 'n_rooms_kitchen'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - kitchen (%)',
            'numerator_expr': 'n_rooms_kitchen'
          }, {
            'name': 'number of rooms not sprayed - food storage',
            'numerator_expr': 'n_rooms_food'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - food storage (%)',
            'numerator_expr': 'n_rooms_food'
          }, {
            'name': 'number of rooms not sprayed - material',
            'numerator_expr': 'n_rooms_material'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - material (%)',
            'numerator_expr': 'n_rooms_material'
          }, {
            'name': 'number of rooms not sprayed - other',
            'numerator_expr': 'n_rooms_other'
          }, {
            'denominator_aggregation': 'Number of sprayable rooms not sprayed',
            'name': 'number of rooms not sprayed - other (%)',
            'numerator_expr': 'n_rooms_other'
          }, {'name': 'count', 'numerator_expr': '1'}],
          'decorators': {
            'sprayed_status': [{'not sprayable': 'n_rooms_material == number_of_rooms'}, {'not sprayed': 'any_sprayed == \'no\''}, {'partial': 'number_of_rooms > number_sprayed'}, {'sprayed': 'number_of_rooms == number_sprayed'}],
            'status': [{'blue': 'n_rooms_material == number_of_rooms'}, {'red': 'any_sprayed == \'no\''}, {'yellow': 'number_of_rooms > number_sprayed'}, {'green': 'number_of_rooms == number_sprayed'}]
          },
          'fake_form': [{
            'LLINS_provided': 'no',
            'LLIN_used_sleeping': 'no',
            'Mop_up': 'yes',
            'any_sprayed': 'no',
            'household_name': 'name',
            'n_people_homestead': 3,
            'n_people_homestead_overage5': 2,
            'n_people_homestead_underage5': 1,
            'n_rooms_baby': 2,
            'n_rooms_kitchen': 2,
            'n_rooms_material': 2,
            'number_of_buildings_in_homesteads': 3,
            'number_of_rooms': 4,
            'number_of_rooms_not_sprayed': 10,
            'number_other_structures': 0,
            'number_rooms_modern': 2,
            'number_rooms_traditional': 2,
            'rooms_locked': 4,
            'unsprayed_reason': ['locked', 'kitchen', 'newborn', 'material']
          }, {
            'LLINS_provided': 'no',
            'LLIN_used_sleeping': 'no',
            'Mop_up': 'no',
            'any_sprayed': 'yes',
            'household_name': 'name',
            'n_people_homestead': 4,
            'n_people_homestead_overage5': 2,
            'n_people_homestead_underage5': 2,
            'number_of_buildings_in_homesteads': 2,
            'number_of_rooms': 3,
            'number_of_rooms_not_sprayed': 0,
            'number_other_structures': 0,
            'number_rooms_modern': 3,
            'number_rooms_traditional': 0,
            'number_sprayed': 3,
            'number_sprayed_ddt': 1,
            'number_sprayed_lambdacyhalothrin': 1,
            'number_sprayed_actellic': 1,
            'number_sprayed_modern_partial_spray': 3,
            'number_sprayed_other_partial_spray': 0,
            'number_sprayed_traditional_partial_spray': 0
          }],
          'form': {
            'pages': [{
              'elements': [{
                'choices': [{'text': 'Yes', 'value': 'yes'}, {
                  'text': 'No',
                  'value': 'no'
                }],
                'isRequired': true,
                'name': 'Mop_up',
                'title': 'Is this a mop-up or return visit? ',
                'type': 'radiogroup'
              }], 'name': 'Mop up'
            }, {
              'elements': [{
                'name': 'household_name',
                'title': 'Record head of household name(s). (If there is more than one, separate each name with a comma)',
                'type': 'text'
              }], 'name': 'household'
            }, {
              'elements': [{
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_of_buildings_in_homesteads',
                'title': 'How many buildings are in this homestead?',
                'type': 'text',
                'validators': [{'minValue': 1, 'text': 'Value must be one or greater', 'type': 'numeric'}]
              }], 'name': 'buildings count'
            }, {
              'elements': [{
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_people_homestead',
                'title': 'Total Number of People in this Homestead',
                'type': 'text',
                'validators': [{'text': 'Minimum value must be zero', 'type': 'numeric'}]
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_people_homestead_underage5',
                'title': 'Number of people in the homestead UNDER the age of 5',
                'type': 'text',
                'validators': [{'text': 'Minimum value must be zero', 'type': 'numeric'}]
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_people_homestead_overage5',
                'title': 'Number of people in the homestead at the age of 5 or ABOVE',
                'type': 'text',
                'validators': [{'text': 'Minimum value must be zero', 'type': 'numeric'}]
              }], 'name': 'people count'
            }, {
              'elements': [{
                'choices': [{'text': 'Yes', 'value': 'yes'}, {'text': 'No', 'value': 'no'}],
                'isRequired': true,
                'name': 'LLIN_used_sleeping',
                'title': 'Does this homestead have any LLINs used while sleeping?',
                'type': 'radiogroup'
              }, {
                'isRequired': true,
                'name': 'number_LLIN_used',
                'title': 'If yes, how many LLINs does the homestead own? ',
                'type': 'text',
                'validators': [{'text': 'Minimum value must be zero', 'type': 'numeric'}],
                'visible': false,
                'visibleIf': '{LLIN_used_sleeping} = yes'
              }], 'name': 'pre LLIN'
            }, {
              'elements': [{
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_of_rooms',
                'title': 'How many rooms are in this homestead?  (Count all rooms in all buildings)',
                'type': 'text',
                'validators': [{'minValue': 1, 'text': 'Minimum value must be one', 'type': 'numeric'}]
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_rooms_modern',
                'title': 'How many rooms in this homestead are modern?',
                'type': 'text',
                'validators': [{'text': 'Minimum value must be zero', 'type': 'numeric'}]
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_rooms_traditional',
                'title': 'How many rooms in this homestead are traditional?',
                'type': 'text',
                'validators': [{'text': 'Minimum value must be zero', 'type': 'numeric'}]
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_other_structures',
                'title': 'How many other structures are in this homestead? (Other structures such as toilets and corridors)',
                'type': 'text',
                'validators': [{'text': 'Minimum value must be zero', 'type': 'numeric'}]
              }], 'name': 'room count'
            }, {
              'elements': [{
                'choices': [{'text': 'Yes', 'value': 'yes'}, {'text': 'No', 'value': 'no'}],
                'isRequired': true,
                'name': 'any_sprayed',
                'title': 'Were there any rooms SPRAYED in this homestead?',
                'type': 'radiogroup'
              }], 'name': 'any SPRAYED'
            }, {
              'elements': [{
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_sprayed',
                'title': 'How many rooms were sprayed?',
                'type': 'text',
                'validators': [{'text': 'Minimum value is 0', 'type': 'numeric'}],
                'visible': false,
                'visibleIf': '{any_sprayed} = \'yes\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_sprayed_modern_partial_spray',
                'title': '     How many SPRAYED rooms in this homestead are modern?',
                'type': 'text',
                'validators': [{'text': 'Minimum value is 0', 'type': 'numeric'}],
                'visible': false,
                'visibleIf': '{any_sprayed} = \'yes\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_sprayed_traditional_partial_spray',
                'title': 'How many SPRAYED rooms in this homestead are traditional?',
                'type': 'text',
                'validators': [{'text': 'Minimum value is 0', 'type': 'numeric'}],
                'visible': false,
                'visibleIf': '{any_sprayed} = \'yes\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_sprayed_other_partial_spray',
                'title': 'How many other structures in this homestead were sprayed?',
                'type': 'text',
                'validators': [{'text': 'Minimum value is 0', 'type': 'numeric'}],
                'visible': false,
                'visibleIf': '{any_sprayed} = \'yes\''
              }], 'name': 'SPRAYED details 1', 'visible': false, 'visibleIf': '{any_sprayed} = \'yes\''
            }, {
              'elements': [{
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_sprayed_ddt',
                'title': 'How many rooms in this homestead were sprayed with DDT?  (If none, enter 0)',
                'type': 'text',
                'validators': [{'minValue': 0, 'text': 'Minimum Value is 0', 'type': 'numeric'}],
                'visible': false,
                'visibleIf': '{any_sprayed} = \'yes\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_sprayed_lambdacyhalothrin',
                'title': 'How many rooms in this homestead were sprayed with Lambdacyhalothrin? (If none, enter 0)',
                'type': 'text',
                'validators': [{'minValue': 0, 'text': 'Minimum Value is 0', 'type': 'numeric'}],
                'visible': false,
                'visibleIf': '{any_sprayed} = \'yes\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_sprayed_actellic',
                'title': 'How many rooms in this homestead were sprayed with Actellic?  (If none, enter 0)',
                'type': 'text',
                'validators': [{'minValue': 0, 'text': 'Minimum Value is 0', 'type': 'numeric'}],
                'visible': false,
                'visibleIf': '{any_sprayed} = \'yes\''
              }], 'name': 'SPRAYED details 2', 'visible': false, 'visibleIf': '{any_sprayed} = \'yes\''
            }, {
              'elements': [{
                'inputType': 'number',
                'isRequired': true,
                'name': 'number_of_rooms_not_sprayed',
                'title': 'How many rooms were NOT sprayed?',
                'type': 'text',
                'validators': [{'text': 'Minimum Value is 0', 'type': 'numeric'}]
              }], 'name': 'UNSPRAYED details 1'
            }, {
              'elements': [{
                'choices': [{'text': 'Locked', 'value': 'locked'}, {
                  'text': 'No one home',
                  'value': 'no_one_home'
                }, {'text': 'Head of household refused', 'value': 'hh_refused'}, {
                  'text': 'There is a newborn',
                  'value': 'newborn'
                }, {'text': 'There is a funeral', 'value': 'funeral'}, {
                  'text': 'Room is a kitchen',
                  'value': 'kitchen'
                }, {'text': 'Room is a food store', 'value': 'food_store'}, {
                  'text': 'There is a patient in the home',
                  'value': 'patient_elderly'
                }, {'text': 'Room was not sprayable due to material (ie canvas)', 'value': 'material'}],
                'hasOther': true,
                'isRequired': true,
                'name': 'unsprayed_reason',
                'title': 'Reasons for not spraying rooms',
                'type': 'checkbox'
              }], 'name': 'UNSPRAYED details 2', 'visible': false, 'visibleIf': '{number_of_rooms_not_sprayed} > 0'
            }, {
              'elements': [{
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_rooms_other',
                'title': 'Other reason',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'other\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_rooms_patient',
                'title': 'There is a patient in the home',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'patient_elderly\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_rooms_food',
                'title': 'Room is a food store',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'food_store\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_rooms_kitchen',
                'title': 'Room is a kitchen',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'kitchen\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_rooms_funeral',
                'title': 'There is a funeral',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'funeral\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_rooms_baby',
                'title': 'There is a newborn',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'newborn\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_rooms_nobody',
                'title': 'No one home',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'no_one_home\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'rooms_locked',
                'title': 'Locked',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'locked\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_rooms_refused',
                'title': 'Head of household refused',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'hh_refused\''
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_rooms_material',
                'title': 'Room was not sprayable due to material (ie canvas)',
                'type': 'text',
                'visible': false,
                'visibleIf': '{unsprayed_reason} contains \'material\''
              }], 'name': 'UNSPRAYED details 3', 'visible': false, 'visibleIf': '{number_of_rooms_not_sprayed} > 0'
            }, {
              'elements': [{
                'choices': [{'text': 'Yes', 'value': 'yes'}, {'text': 'No', 'value': 'no'}],
                'isRequired': true,
                'name': 'LLINS_provided',
                'title': 'Were LLINs provided to this homestead?” ',
                'type': 'radiogroup'
              }, {
                'inputType': 'number',
                'isRequired': true,
                'name': 'n_LLINs_given',
                'title': 'How many LLINs were given? ',
                'type': 'text',
                'validators': [{'text': 'Minimum Value is 0', 'type': 'numeric'}],
                'visible': false,
                'visibleIf': '{LLINS_provided} = \'yes\''
              }], 'name': 'UNSPRAYED LLINs'
            }]
          },
          'instance': {'location_name': 'Botswana', 'slug': 'bwa', 'title': 'Botswana IRS Database'},
          'map_focus': {'centre': {'lat': -20.37552680342694, 'lng': 24.158935546875004}, 'zoom': 7},
          'presenters': {
            'popup_description': [{'field': 'recorded_on', 'title': 'Date'}, {
              'field': 'user',
              'title': 'Recorded by'
            }, {'field': 'any_sprayed', 'title': 'Sprayed'}, {
              'field': 'n_people_homestead',
              'title': 'Number of people'
            }]
          },
          'spatial_hierarchy': {
            'data_version': 11,
            'ignore_planning_level_restriction': true,
            'levels': [{
              'display_field_name': 'CODE',
              'field_name': 'NAME',
              'name': 'districts'
            }, {
              'display_field_name': 'VILLAGE',
              'field_name': 'Id',
              'group_by_field': 'name_2',
              'name': 'villages'
            }, {'display_field_name': 'SP_ID_1', 'field_name': 'ClusterID', 'name': 'clusters'}],
            'markers': {
              'denominator_fields': {'estimated_rooms': 'Num_Rooms'},
              'planning_level_name': 'villages',
              'record_location_selection_level_name': 'villages'
            }
          },
          'validations': [{
            'expression': 'number_of_rooms_not_sprayed == (rooms_locked + n_rooms_nobody + n_rooms_refused + n_rooms_baby + n_rooms_patient + n_rooms_funeral + n_rooms_kitchen + n_rooms_food + n_rooms_material + n_rooms_other)',
            'message': 'Reasons for rooms unsprayed must = total # of rooms unsprayed.',
            'name': 'rooms_unsprayed_refusal_count',
            'precondition': '',
            'type': 'error'
          }, {
            'expression': 'number_of_rooms == (number_rooms_modern + number_rooms_traditional)',
            'message': 'Modern + traditional rooms must = total rooms',
            'name': 'number_of_rooms',
            'precondition': '',
            'type': 'error'
          }, {
            'expression': 'n_people_homestead == (n_people_homestead_underage5 + n_people_homestead_overage5)',
            'message': '# of people under 5 + over 5 must = total people',
            'name': 'number_of_people',
            'precondition': '',
            'type': 'error'
          }, {
            'expression': 'n_people_homestead <51',
            'message': 'Is this the correct # of people in the homestead? ',
            'name': 'max_number_of_people',
            'precondition': '',
            'type': 'warning'
          }, {
            'expression': 'number_of_rooms < 51',
            'message': 'Is this the correct # of rooms in this homestead?',
            'name': 'max_number_of_rooms',
            'precondition': '',
            'type': 'warning'
          }, {
            'expression': ' number_sprayed <= number_of_rooms',
            'message': '# rooms sprayed must be < or = to total # of rooms',
            'name': 'numer_of_rooms_sprayed_total',
            'precondition': '',
            'type': 'error'
          }, {
            'expression': 'number_sprayed_modern_partial_spray <= number_rooms_modern',
            'message': '# sprayed modern rooms must be < or = to total # of modern rooms',
            'name': 'number_of_rooms_sprayed_modern',
            'precondition': '',
            'type': 'error'
          }, {
            'expression': 'number_sprayed_traditional_partial_spray <= number_rooms_traditional',
            'message': '# sprayed traditional rooms must be < or = to total # of traditional rooms',
            'name': 'number_of_rooms_sprayed_traditional',
            'precondition': '',
            'type': 'error'
          }, {
            'expression': '(number_sprayed_ddt + number_sprayed_lambdacyhalothrin + number_sprayed_actellic) == number_sprayed',
            'message': '# of rooms sprayed with DDT/Lamda/actellic must = total # of rooms sprayed ',
            'name': 'number_of_rooms_sprayed_by_insecticide',
            'precondition': '',
            'type': 'error'
          }, {
            'expression': '(number_of_rooms_not_sprayed + number_sprayed) == number_of_rooms',
            'message': 'sprayed + unsprayed rooms must = total room count',
            'name': 'number_of_rooms_sprayed_unsprayed',
            'precondition': '',
            'type': 'error'
          }]
        }
        const user = {}
        pubsubcache.publish('shell:launch_with_config', {instance_config, user})
      }
    }
  }
</script>

<style scoped>

</style>