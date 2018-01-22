
export default class Presenter {
  constructor(instance_config) {
    this.instance_config = instance_config
    this.aggregations = {calculate: () => {}}
    this.presenters = this.instance_config.presenters
  }

  get_aggregated_responses({responses, denominators, instance_config}) {
    // Get from instance_config
    const required_aggregations = instance_config.applets.irs_monitor.aggregations.table

    // Collect responses for each area, and calculate every aggregation for each
    const responses_grouped_by_area = denominators.map((area_denominator) => {

      let denominator_row = {}
      denominator_row.__disarm_geo_id = area_denominator.id // Set header for first column i.e. 'locality' or 'region'

      // Get the relevant responses for this area
      const area_responses = responses.filter((response) => response.location.selection.id === area_denominator.id)

      if (area_responses.length === 0)  return null

    // Iterate each required aggregation, calculate it and push into the row for this area
      required_aggregations.forEach(aggregation_name => {
        denominator_row[aggregation_name] = this.aggregations.calculate({
          responses: area_responses,
          denominators: area_denominator,
          aggregation_name: aggregation_name
        })
      })
      return denominator_row
    })

    // Add total row
    let total_row = {}
    total_row.__disarm_geo_id = 'Total'
    required_aggregations.forEach(aggregation_name => {
      total_row[aggregation_name] = this.aggregations.calculate({responses, denominators, aggregation_name})
    })

    responses_grouped_by_area.push(total_row)

    // Remove null, empty, keep zeroes
    const truthy_responses_grouped_by_area = responses_grouped_by_area.filter(r => {
      if (r === 0) return true
      return r
    })

    return truthy_responses_grouped_by_area
  }

}

