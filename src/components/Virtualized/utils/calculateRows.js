/**
 * calculateRows.js
 * https://github.com/reactabular/reactabular/blob/v8.17.0/packages/reactabular-virtualized/src/calculate-rows.js
 *
 * Forked from version 8.17.0; includes the following modifications:
 * 1) Calculate actual row heights in determining startIndex. This allows dynamic row heights.
 * */
import calculateAverageHeight from './calculateAverageHeight';

const calculateRows = ({ measuredRows, height, rowKey, rows, scrollTop = 0 }) => {
  // used exact measured row heights for determining `startIndex` for smooth scroll
  // average heights are not accurate when there is lots of variation in row heights
  let startIndex = 0;
  let startHeight = 0;
  let accruedHeight = 0;
  for (let i = 0; i < Object.keys(measuredRows).length; i++) {
    accruedHeight += measuredRows[`${i}-row`];
    if (scrollTop < accruedHeight) {
      startIndex = i;
      break;
    } else {
      startHeight = accruedHeight;
    }
  }

  // averageHeight of measuredRows can still be used to closely approximate amount of rows to render
  // if this causes issues w/ row visibility, exact heights can still be used
  const averageHeight = calculateAverageHeight({ measuredRows, rows, rowKey });
  const amountOfRowsToRender = Math.ceil(height / averageHeight) + 2;

  const zeroedIndex = startIndex;
  const rowsToRender = rows.slice(zeroedIndex, Math.max(startIndex + amountOfRowsToRender, 0));

  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window.LOG_VIRTUALIZED) {
    console.log(
      // eslint-disable-line no-console
      'update rows to render',
      'scroll top',
      scrollTop,
      'measured rows',
      measuredRows,
      'amount of rows to render',
      amountOfRowsToRender,
      'rows to render',
      rowsToRender,
      'start index',
      startIndex
    );
  }

  // Escape if there are no rows to render for some reason
  if (!rowsToRender.length) {
    return null;
  }

  // Calculate the padding of the last row so we can match whole height. This
  // won't be totally accurate if row heights differ but should get close
  // enough in most cases.
  const endHeight = Math.max((rows.length - amountOfRowsToRender) * averageHeight - startHeight, 0);

  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window.LOG_VIRTUALIZED) {
    console.log(
      // eslint-disable-line no-console
      'average height',
      averageHeight,
      'body height',
      height,
      'scroll top',
      scrollTop,
      'start height',
      startHeight,
      'end height',
      endHeight
    );
  }

  return {
    amountOfRowsToRender,
    startIndex: zeroedIndex,
    showExtraRow: !(zeroedIndex % 2),
    startHeight,
    endHeight
  };
};

export default calculateRows;
