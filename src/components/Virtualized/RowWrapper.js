import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash-es';
import { columnsAreEqual } from 'reactabular-table';
import { RowWrapper } from '@patternfly/react-table';
import { VirtualizedBodyContext } from './Body';

class VirtualizedRowWrapper extends React.Component {
  trRef = null;

  setTrRef = element => {
    this.trRef = element;
  };

  updateRowHeight = () => {
    if (this.trRef) {
      const { updateHeight, rowProps } = this.props;
      updateHeight(rowProps['data-rowkey'], this.getAbsoluteHeight(this.trRef));
    }
  };

  // offsetHeight does not include margins, so we use this helper for better accuracy
  getAbsoluteHeight = el => {
    const styles = window.getComputedStyle(el);
    const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    return Math.ceil(el.offsetHeight + margin);
  };

  static shouldComponentUpdate(nextProps) {
    const { columns, rowData } = this.props;
    // Update only if a row has not been measured and either
    // columns or rowData hasn't changed
    if (nextProps.rowData._measured) {
      return !(columnsAreEqual(columns, nextProps.columns) && isEqual(rowData, nextProps.rowData));
    }
    return true;
  }

  componentDidMount() {
    this.updateRowHeight();
  }
  componentDidUpdate() {
    // Capture height data only during initial measurement or during resize
    if (this.props.initialMeasurement) {
      this.updateRowHeight();
    }
  }

  render() {
    const { updateHeight, initialMeasurement, row, ...props } = this.props;
    return <RowWrapper trRef={this.setTrRef} row={row} aria-rowindex={row['aria-rowindex']} {...props} />;
  }
}
VirtualizedRowWrapper.propTypes = {
  ...RowWrapper.propTypes,
  rowProps: PropTypes.shape({
    'data-rowkey': PropTypes.string.isRequired
  }).isRequired,
  updateHeight: PropTypes.func.isRequired,
  initialMeasurement: PropTypes.bool.isRequired
};

const VirtualizedRowWrapperWithContext = props => (
  <VirtualizedBodyContext.Consumer>
    {({ updateHeight, initialMeasurement }) => (
      <VirtualizedRowWrapper {...props} updateHeight={updateHeight} initialMeasurement={initialMeasurement} />
    )}
  </VirtualizedBodyContext.Consumer>
);

export default VirtualizedRowWrapperWithContext;
