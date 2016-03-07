/**
 * Created by jamie on 07/03/2016.
 */


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