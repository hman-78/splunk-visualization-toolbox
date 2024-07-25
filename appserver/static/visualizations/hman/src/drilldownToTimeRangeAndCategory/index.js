/* exported SplunkVisualizationBase */
const SplunkVisualizationBase = require('api/SplunkVisualizationBase');

/**
 * To be called from the visualization's click handler, after computing the
 * correct category name, value AND time range from the target of the click.
 * 
 * Combines the two calls drilldownToCategory and drilldownToTimeRange.
 * 
 * 
 *
*/

const _drilldownToTimeRangeAndCategory = function (earliestTime, latestTime, categoryName, categoryValue, browserEvent) {
  var data = {};
  data[categoryName] = categoryValue;
  this.drilldown({
    action: SplunkVisualizationBase.FIELD_VALUE_DRILLDOWN,
    data: data,
    earliest: earliestTime,
    latest: latestTime
  }, browserEvent);
}

module.exports = _drilldownToTimeRangeAndCategory;