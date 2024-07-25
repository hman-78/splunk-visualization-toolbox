/* exported SplunkVisualizationBase */

const SplunkVisualizationBase = require('api/SplunkVisualizationBase');

/**
 * To be called from the visualization's click handler, after computing the
 * correct category names and values.
 *
 */

const _drilldownToCategories = function (categoryNames, categoryValues, browserEvent) {
  var data = {};
  if (categoryNames != null) {
    for (let i = 0; i < categoryNames.length; i++) {
      data[categoryNames[i]] = categoryValues[i];
    }
  }
  this.drilldown({
    action: SplunkVisualizationBase.FIELD_VALUE_DRILLDOWN,
    data: data
  }, browserEvent);
}

module.exports = _drilldownToCategories;