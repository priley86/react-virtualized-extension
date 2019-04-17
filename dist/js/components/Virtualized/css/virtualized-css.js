'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.virtualizedCss = undefined;

var _reactStyles = require('@patternfly/react-styles');

var virtualizedCss = exports.virtualizedCss = _reactStyles.StyleSheet.parse('\n  /* virtualized tables use aria-hidden tr\'s to offset scrolled rows -\n     do not add extra spacing to these elements as offset height is important\n  */\n  .pf-virtualized-spacer {\n    padding: 0 !important;\n    margin: 0 !important;\n    border: 0 !important;\n  }\n\n  /* Based on the following css from reactabular-virtualized:\n    https://reactabular.js.org/#/features/virtualization?a=using-relative-column-widths\n  */\n  .pf-c-virtualized.pf-c-table {\n    display: flex;\n    flex-flow: column;\n  }\n\n  .pf-c-virtualized.pf-c-table thead,\n  .pf-c-virtualized.pf-c-table tbody tr {\n    display: table;\n    table-layout: fixed;\n  }\n\n  .pf-c-virtualized.pf-c-table thead {\n    /* flex: 0 0 auto; */\n    width: 100%;\n  }\n\n  .pf-c-virtualized.pf-c-table thead tr {\n    /* 0.9em approximates scrollbar width  */\n    /* width: calc(100% - 0.9em); */\n    width: 100%;\n  }\n\n  .pf-c-virtualized.pf-c-table tbody {\n    display: block;\n    /* flex: 1 1 auto; */\n    overflow-y: scroll;\n    scroll-behavior: smooth;\n    -webkit-overflow-scrolling: touch;\n  }\n\n  .pf-c-virtualized.pf-c-table tbody tr {\n    width: 100%;\n  }\n  .pf-c-virtualized.pf-c-table th,\n  .pf-c-virtualized.pf-c-table td {\n    width: 20%;\n  }\n');