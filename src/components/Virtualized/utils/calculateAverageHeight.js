/**
 * calculateAverageHeight.js
 * https://github.com/reactabular/reactabular/blob/v8.17.0/packages/reactabular-virtualized/src/calculate-average-height.js
 *
 * Forked from version 8.17.0
 * */

import { resolveRowKey } from 'reactabular-table';

const calculateAverageHeight = ({ measuredRows, rows, rowKey }) => {
  const resolvedRowKeys = rows.map((rowData, rowIndex) => resolveRowKey({ rowData, rowIndex, rowKey }));
  const measuredAmounts = Object.keys(measuredRows)
    .filter(key => resolvedRowKeys.indexOf(key) >= 0)
    .map(key => measuredRows[key]);
  const amountOfMeasuredRows = measuredAmounts.length;
  const averageHeight = measuredAmounts.reduce((a, b) => a + b / amountOfMeasuredRows, 0);
  // prevent divide by zero exception
  return averageHeight > 0 ? averageHeight : 1;
};

export default calculateAverageHeight;
