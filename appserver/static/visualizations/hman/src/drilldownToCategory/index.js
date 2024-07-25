/* exported SplunkVisualizationBase */
const SplunkVisualizationBase = require('api/SplunkVisualizationBase');
/**
 * To be called from the visualization's click handler, after computing the
 * correct category name and value from the target of the click.
 *
 * @param categoryName - the field name for the category
 * @param categoryFieldValue - the value for the category
 * @param browserEvent - the original browser event that caused the drilldown
 *
 * example usage:
 *
 * this.drilldownToCategory('State', 'Oregon', e);
 */

const _drilldownToCategory = function (categoryName, categoryFieldValue, browserEvent) {
  var data = {};
  data[categoryName] = categoryFieldValue;

  this.drilldown({
    action: SplunkVisualizationBase.FIELD_VALUE_DRILLDOWN,
    data: data
  }, browserEvent);
}

module.exports = _drilldownToCategory;