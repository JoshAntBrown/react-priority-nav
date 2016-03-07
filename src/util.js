/**
 * Created by jamie on 07/03/2016.
 */

export var classNames = function() {
    var args = Array.prototype.slice.call(arguments);
    var classes = [];
    args.forEach((arg) => {
        var argType = typeof arg;
        // if string or number just add to classes
        if (argType === 'string'  || argType === 'number') {
            classes.push(arg);
        }

        // if an array, recurse values and add to classes
        else if (Array.isArray(arg)) {
            classes.push(classNames.apply(null, arg));
        }

        // if object, add to classes if value is truthy
        else if (argType === 'object') {
            for (var key in arg) {
                if (arg.hasOwnProperty(key) && arg[key]) {
                    classes.push(key);
                }
            }
        }
    });
    return classes.join(' ');
};

/**
 * Get innerwidth without padding
 * @param element
 * @returns {number}
 */
export const getElementContentWidth = (element) => {
    const styles = window.getComputedStyle(element);
    const padding = parseFloat(styles.paddingLeft) +
        parseFloat(styles.paddingRight);
    return element.clientWidth - padding;
};

/**
 * @returns {{width: number, height: number}}
 */
export const viewportSize = () => {
    var doc = document, w = window;
    var docEl = (doc.compatMode && doc.compatMode === "CSS1Compat")?
        doc.documentElement: doc.body;

    var width = docEl.clientWidth;
    var height = docEl.clientHeight;

    // mobile zoomed in?
    if ( w.innerWidth && width > w.innerWidth ) {
        width = w.innerWidth;
        height = w.innerHeight;
    }

    return {width: width, height: height};
};