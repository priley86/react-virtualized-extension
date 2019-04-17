/**
 * dimensions.js
 * https://github.com/bvaughn/react-virtualized/blob/9.21.0/source/WindowScroller/utils/dimensions.js
 * Brian Vaughn
 *
 * Forked from version 9.21.0
 * */

var isWindow = function isWindow(element) {
  return element === window;
};

var getBoundingBox = function getBoundingBox(element) {
  return element.getBoundingClientRect();
};

export function getDimensions(scrollElement, props) {
  if (!scrollElement) {
    return {
      height: props.serverHeight,
      width: props.serverWidth
    };
  } else if (isWindow(scrollElement)) {
    var _window = window,
        innerHeight = _window.innerHeight,
        innerWidth = _window.innerWidth;

    return {
      height: typeof innerHeight === 'number' ? innerHeight : 0,
      width: typeof innerWidth === 'number' ? innerWidth : 0
    };
  }
  return getBoundingBox(scrollElement);
}

/**
 * Gets the vertical and horizontal position of an element within its scroll container.
 * Elements that have been “scrolled past” return negative values.
 * Handles edge-case where a user is navigating back (history) from an already-scrolled page.
 * In this case the body’s top or left position will be a negative number and this element’s top or left will be increased (by that amount).
 */
export function getPositionOffset(element, container) {
  if (isWindow(container) && document.documentElement) {
    var containerElement = document.documentElement;
    var _elementRect = getBoundingBox(element);
    var _containerRect = getBoundingBox(containerElement);
    return {
      top: _elementRect.top - _containerRect.top,
      left: _elementRect.left - _containerRect.left
    };
  }
  var scrollOffset = getScrollOffset(container);
  var elementRect = getBoundingBox(element);
  var containerRect = getBoundingBox(container);
  return {
    top: elementRect.top + scrollOffset.top - containerRect.top,
    left: elementRect.left + scrollOffset.left - containerRect.left
  };
}

/**
 * Gets the vertical and horizontal scroll amount of the element, accounting for IE compatibility
 * and API differences between `window` and other DOM elements.
 */
export function getScrollOffset(element) {
  if (isWindow(element) && document.documentElement) {
    return {
      top: 'scrollY' in window ? window.scrollY : document.documentElement.scrollTop,
      left: 'scrollX' in window ? window.scrollX : document.documentElement.scrollLeft
    };
  }
  return {
    top: element.scrollTop,
    left: element.scrollLeft
  };
}