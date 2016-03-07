import {Component, PropTypes, cloneElement} from 'react';
import {findDOMNode} from 'react-dom';
import {classNames as cx} from 'common/util/ReactUtil';
import {getElementContentWidth, viewportSize} from 'util';

const OUTER = "outerWrapper";
const TOGGLE = "TOGGLE";
const MENU_LIST = "MENU_LIST";
const NAV_LIST = "NAV_LIST";

class PriorityNav extends Component {
    constructor(props) {
        super(props);

        this.handleResize = this.onResize.bind(this);
        this.handleDocMouseOver = this.onDocMouseOver.bind(this);
        this.handleNavMouseOver = this.onNavMouseOver.bind(this);
        this.handleNavMouseOut = this.onNavMouseOut.bind(this);

        this.breaks = {};
        this.state = {
            items: null,
            menuItems: [],
            navItems: [],
            navItemActive: false,
            outterClass: props.outterClass,
            navVisible: false,
            resizeId: null,

            totalWidth: 0,
            dropDownWidth: 0,
            restWidth: 0,
            viewportWidth: 0
        }
    }

    /**
     * @param e
     */
    onResize(e) {
        clearTimeout(this.state.resizeId);
        this.state.resizeId = setTimeout(this.doesItFit.bind(this), 50);
    }

    /**
     * @param e
     */
    onDocMouseOver(e) {
        const domNode = findDOMNode(this);
        const isChild = domNode.contains(e.target);
        if (domNode && !isChild) {
            this.handleNavMouseOut();
        }
    }

    /**
     *
     */
    onNavMouseOver() {
        document.addEventListener("mouseover", this.handleDocMouseOver);
        this.setState({navVisible: true});
    }

    /**
     *
     */
    onNavMouseOut() {
        document.removeEventListener("mouseover", this.handleDocMouseOver);
        this.setState({navVisible: false});
    }

    /**
     * Adds listeners an do an initial 'doesItFit'
     */
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.doesItFit();
    }

    /**
     * Clean up
     */
    componentWillUnmount() {
        document.removeEventListener("mouseover", this.handleDocMouseOver);
        window.removeEventListener("resize", this.handleResize);
        clearInterval(this.state.resizeId);
    }

    /**
     * @returns {XML}
     */
    render() {
        const {outterClass, navItems} = this.state;
        const {id, className, tag: Tag} = this.props;
        const classNames = cx(className, outterClass, {'priority-nav-has-dropdown': navItems.length});
        return (
            <Tag ref={OUTER} className={classNames} id={id}>
                {this.renderMenu()}
                {this.renderNav()}
            </Tag>
        )
    }

    /**
     * @returns {*}
     */
    renderMenu() {
        const {children, navRef} = this.props;
        return React.Children.map(children, child => {
            if (child.ref == navRef) {
                return cloneElement(child, {
                    children: this.updateItems(child.props.children),
                    ref: MENU_LIST
                })
            }
            return child;
        })
    }

    /**
     * @returns {XML}
     */
    renderNav() {
        const {navDropdown} = this.props;
        const spanClasses = cx(`${navDropdown}-wrapper`, 'priority-nav__wrapper');
        return (
            <span className={spanClasses}>
				{this.renderNavList()}
                {this.renderNavToggle()}
			</span>
        )
    }

    /**
     * @returns {XML}
     */
    renderNavList() {
        const {navDropdown, navStyles} = this.props;
        const classNames = cx(navDropdown, 'priority-nav__dropdown menu', {'show': this.state.navVisible});
        const props = {
            className: classNames,
            ref: NAV_LIST
        };
        return (
            <ul {...props} style={navStyles}>
                {this.state.navItems}
            </ul>
        )
    }

    /**
     * @returns {XML}
     */
    renderNavToggle() {
        const {navDropdownLabel, navDropdownToggle, navItemActiveClass} = this.props;
        const props = {
            ref: TOGGLE,
            onMouseOver: this.handleNavMouseOver,
            onClick: this.handleNavMouseOut,
            className: cx(
                navDropdownToggle,
                {[navItemActiveClass]: this.state.navItemActive},
                {'priority-nav-is-visible': this.state.navItems.length},
                {'is-open': this.state.navVisible},
                'priority-nav__dropdown-toggle'
            )
        }
        return (
            <button {...props}>{navDropdownLabel}</button>
        )
    }

    /**
     * @param children
     * @returns {Array}
     */
    updateItems(children) {
        this.updateMenuItems(children);
        const length = this.state.menuItems.length;

        React.Children.forEach(children, (child, i) => {
            // calculate which set we're needing to update
            const items = i < length ? 'menuItems' : 'navItems';
            const index = i < length ? i : i - length;

            // clone updated children into correct set
            const item = this.state[items][index];
            const element = cloneElement(item, child.props);

            this.state[items][index] = element;
        }, this);

        this.updateToggleActiveState();
        return this.state.menuItems;
    }

    /**
     * Populates the menuItems array if not done so previously
     * @param children
     */
    updateMenuItems(children) {
        if (this.state.menuItems.length) return;
        this.state.menuItems = React.Children.map(children, (li, i) => {
            // use this opportunity to add a ref to each menu item
            return cloneElement(li, {ref: `ITEM${i}`});
        });
    }

    /**
     * Adds the 'navItemActiveClass' to the nav toggle button, if any of the nav items are selected
     * @param className
     * @param inNav
     */
    updateToggleActiveState() {
        const {itemActiveClass} = this.props;
        this.state.navItemActive = false;
        this.state.navItems.forEach(child => {
            const className = child.props.className;
            const itemActive = className.includes(itemActiveClass);
            if (!this.state.navItemActive && itemActive) {
                this.state.navItemActive = true;
            }
        }, this);
    }

    /**
     * Get width
     * @param elem
     * @returns {number}
     */
    calculateWidths () {
        const domNode = findDOMNode(this);
        const totalWidth = getElementContentWidth(domNode);
        const toggleWidth = this.refs[TOGGLE] ? this.refs[TOGGLE].offsetWidth : 0;
        return {
            total: totalWidth,
            offset: this.props.offsetPixels,
            toggle: toggleWidth
        }
    };

    /**
     *
     */
    doesItFit() {
        const {menuItems, navItems} = this.state;
        const {total, toggle, offset} = this.calculateWidths();
        var totalWidth = 0;

        // check if all menu items full within available width
        const toRemove = menuItems.reduce((remove, item) => {
            const itemWidth = this.refs[item.ref].offsetWidth;
            if ((totalWidth + itemWidth + offset) > (total - toggle)) {
                remove.push(item);
            }
            totalWidth += itemWidth;
            return remove;
        }, [], this);

        if (toRemove.length) {
            this.toDropDown(toRemove);
            return;
        }

        // check if any nav items can be moved back to menu
        this.toMenu(navItems.reduce((add, item) => {
            const itemWidth = this.breaks[item.ref];
            if ((totalWidth + itemWidth + toggle + offset) < total) {
                add.push(item);
            }
            totalWidth += itemWidth;
            return add;
        }, [], this));
    }

    /**
     * Drops a menu item off into the nav menu
     */
    toDropDown(items) {
        if (!items.length) return;
        this.state.navItems = items.concat(this.state.navItems);
        this.state.menuItems.splice(-items.length);
        // store the item with as when not added to dom (in the nav menu) we
        // don't know what it's width is in order to replace it in the menu
        items.forEach(item => {
            const domNode = this.refs[item.ref];
            this.breaks[item.ref] = domNode.offsetWidth;
        }, this);
        this.forceUpdate();
    }

    /**
     * Drops a nav item off back into the menu
     */
    toMenu(items) {
        if (!items.length) return;
        this.state.navItems.splice(0, items.length);
        this.state.menuItems = this.state.menuItems.concat(items);
        this.forceUpdate();
    }
}

PriorityNav.propTypes = {

};

PriorityNav.defaultProps = {
    // outer component props
    id: null,
    tag: 'div',
    className: null,

    navRef: 'list',

    itemActiveClass: 'active',
    navItemActiveClass: 'active',

    navStyles: {},

    outterClass: 'priority-nav',
    navDropdown: "navdropdown", // class used for the dropdown.
    navDropdownToggle: "navdropdown-toggle", // class used for the dropdown toggle.
    navDropdownLabel: 'MORE', // Text that is used for the dropdown toggle.
    throttleDelay: 50, // this will throttle the calculating logic on resize because i'm a responsible dev.
    offsetPixels: 0 // increase to decrease the time it takes to move an item.
};

export default PriorityNav;
