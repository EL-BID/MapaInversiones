/*!
  * Bootstrap v5.1.0 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core')) :
  typeof define === 'function' && define.amd ? define(['@popperjs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory(global.Popper));
***REMOVED***(this, (function (Popper) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***);
***REMOVED***
    n['default'] = e;
    return Object.freeze(n);
  ***REMOVED***

  var Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  const toType = obj => {
    if (obj === null || obj === undefined) {
      return `${obj***REMOVED***`;
***REMOVED***

    return {***REMOVED***.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  ***REMOVED***;
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
***REMOVED*** while (document.getElementById(prefix));

    return prefix;
  ***REMOVED***;

  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');

    if (!selector || selector === '#') {
      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273

      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
        return null;
  ***REMOVED*** // Just in case some CMS puts out a full URL with the anchor appended


      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
        hrefAttr = `#${hrefAttr.split('#')[1]***REMOVED***`;
  ***REMOVED***

      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
***REMOVED***

    return selector;
  ***REMOVED***;

  const getSelectorFromElement = element => {
    const selector = getSelector(element);

    if (selector) {
      return document.querySelector(selector) ? selector : null;
***REMOVED***

    return null;
  ***REMOVED***;

  const getElementFromSelector = element => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
  ***REMOVED***;

  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
***REMOVED*** // Get transition-duration of the element


    let {
      transitionDuration,
      transitionDelay
***REMOVED*** = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
***REMOVED*** // If multiple durations are defined, take the first


    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  ***REMOVED***;

  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  ***REMOVED***;

  const isElement = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
***REMOVED***

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
***REMOVED***

    return typeof obj.nodeType !== 'undefined';
  ***REMOVED***;

  const getElement = obj => {
    if (isElement(obj)) {
      // it's a jQuery object or a node element
      return obj.jquery ? obj[0] : obj;
***REMOVED***

    if (typeof obj === 'string' && obj.length > 0) {
      return document.querySelector(obj);
***REMOVED***

    return null;
  ***REMOVED***;

  const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${componentName.toUpperCase()***REMOVED***: Option "${property***REMOVED***" provided type "${valueType***REMOVED***" but expected type "${expectedTypes***REMOVED***".`);
  ***REMOVED***
***REMOVED***);
  ***REMOVED***;

  const isVisible = element => {
    if (!isElement(element) || element.getClientRects().length === 0) {
      return false;
***REMOVED***

    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  ***REMOVED***;

  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
***REMOVED***

    if (element.classList.contains('disabled')) {
      return true;
***REMOVED***

    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
***REMOVED***

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  ***REMOVED***;

  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
***REMOVED*** // Can find the shadow root otherwise it'll return the document


    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
***REMOVED***

    if (element instanceof ShadowRoot) {
      return element;
***REMOVED*** // when we don't find a shadow root


    if (!element.parentNode) {
      return null;
***REMOVED***

    return findShadowRoot(element.parentNode);
  ***REMOVED***;

  const noop = () => {***REMOVED***;
  /**
   * Trick to restart an element's animation
   *
   * @param {HTMLElement***REMOVED*** element
   * @return void
   *
   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
   */


  const reflow = element => {
    // eslint-disable-next-line no-unused-expressions
    element.offsetHeight;
  ***REMOVED***;

  const getjQuery = () => {
    const {
      jQuery
***REMOVED*** = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
***REMOVED***

    return null;
  ***REMOVED***;

  const DOMContentLoadedCallbacks = [];

  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      // add listener on the first call when the document is in loading state
      if (!DOMContentLoadedCallbacks.length) {
        document.addEventListener('DOMContentLoaded', () => {
          DOMContentLoadedCallbacks.forEach(callback => callback());
    ***REMOVED***);
  ***REMOVED***

      DOMContentLoadedCallbacks.push(callback);
***REMOVED*** else {
      callback();
***REMOVED***
  ***REMOVED***;

  const isRTL = () => document.documentElement.dir === 'rtl';

  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
    ***REMOVED***;
  ***REMOVED***
***REMOVED***);
  ***REMOVED***;

  const execute = callback => {
    if (typeof callback === 'function') {
      callback();
***REMOVED***
  ***REMOVED***;

  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
      execute(callback);
      return;
***REMOVED***

    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;

    const handler = ({
      target
***REMOVED***) => {
      if (target !== transitionElement) {
        return;
  ***REMOVED***

      called = true;
      transitionElement.removeEventListener(TRANSITION_END, handler);
      execute(callback);
***REMOVED***;

    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(transitionElement);
  ***REMOVED***
  ***REMOVED*** emulatedDuration);
  ***REMOVED***;
  /**
   * Return the previous/next element of a list.
   *
   * @param {array***REMOVED*** list    The list of elements
   * @param activeElement   The active element
   * @param shouldGetNext   Choose to get next or previous element
   * @param isCycleAllowed
   * @return {Element|elem***REMOVED*** The proper element
   */


  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
    let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed

    if (index === -1) {
      return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
***REMOVED***

    const listLength = list.length;
    index += shouldGetNext ? 1 : -1;

    if (isCycleAllowed) {
      index = (index + listLength) % listLength;
***REMOVED***

    return list[Math.max(0, Math.min(index, listLength - 1))];
  ***REMOVED***;

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {***REMOVED***; // Events storage

  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  ***REMOVED***;
  const customEventsRegex = /^(mouseenter|mouseleave)/i;
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
  /**
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   */

  function getUidEvent(element, uid) {
    return uid && `${uid***REMOVED***::${uidEvent++***REMOVED***` || element.uidEvent || uidEvent++;
  ***REMOVED***

  function getEvent(element) {
    const uid = getUidEvent(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {***REMOVED***;
    return eventRegistry[uid];
  ***REMOVED***

  function bootstrapHandler(element, fn) {
    return function handler(event) {
      event.delegateTarget = element;

      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
  ***REMOVED***

      return fn.apply(element, [event]);
***REMOVED***;
  ***REMOVED***

  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);

      for (let {
        target
  ***REMOVED*** = event; target && target !== this; target = target.parentNode) {
        for (let i = domElements.length; i--;) {
          if (domElements[i] === target) {
            event.delegateTarget = target;

            if (handler.oneOff) {
              // eslint-disable-next-line unicorn/consistent-destructuring
              EventHandler.off(element, event.type, selector, fn);
        ***REMOVED***

            return fn.apply(target, [event]);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED*** // To please ESLint


      return null;
***REMOVED***;
  ***REMOVED***

  function findHandler(events, handler, delegationSelector = null) {
    const uidEventList = Object.keys(events);

    for (let i = 0, len = uidEventList.length; i < len; i++) {
      const event = events[uidEventList[i]];

      if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
        return event;
  ***REMOVED***
***REMOVED***

    return null;
  ***REMOVED***

  function normalizeParams(originalTypeEvent, handler, delegationFn) {
    const delegation = typeof handler === 'string';
    const originalHandler = delegation ? delegationFn : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);
    const isNative = nativeEvents.has(typeEvent);

    if (!isNative) {
      typeEvent = originalTypeEvent;
***REMOVED***

    return [delegation, originalHandler, typeEvent];
  ***REMOVED***

  function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
***REMOVED***

    if (!handler) {
      handler = delegationFn;
      delegationFn = null;
***REMOVED*** // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does


    if (customEventsRegex.test(originalTypeEvent)) {
      const wrapFn = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;

      if (delegationFn) {
        delegationFn = wrapFn(delegationFn);
  ***REMOVED*** else {
        handler = wrapFn(handler);
  ***REMOVED***
***REMOVED***

    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const events = getEvent(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {***REMOVED***);
    const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

    if (previousFn) {
      previousFn.oneOff = previousFn.oneOff && oneOff;
      return;
***REMOVED***

    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
    fn.delegationSelector = delegation ? handler : null;
    fn.originalHandler = originalHandler;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, delegation);
  ***REMOVED***

  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);

    if (!fn) {
      return;
***REMOVED***

    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  ***REMOVED***

  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {***REMOVED***;
    Object.keys(storeElementEvent).forEach(handlerKey => {
      if (handlerKey.includes(namespace)) {
        const event = storeElementEvent[handlerKey];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
  ***REMOVED***
***REMOVED***);
  ***REMOVED***

  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  ***REMOVED***

  const EventHandler = {
    on(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, false);
  ***REMOVED***

    one(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, true);
  ***REMOVED***

    off(element, originalTypeEvent, handler, delegationFn) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
  ***REMOVED***

      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getEvent(element);
      const isNamespace = originalTypeEvent.startsWith('.');

      if (typeof originalHandler !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!events || !events[typeEvent]) {
          return;
    ***REMOVED***

        removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
        return;
  ***REMOVED***

      if (isNamespace) {
        Object.keys(events).forEach(elementEvent => {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
    ***REMOVED***);
  ***REMOVED***

      const storeElementEvent = events[typeEvent] || {***REMOVED***;
      Object.keys(storeElementEvent).forEach(keyHandlers => {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');

        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          const event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
    ***REMOVED***
  ***REMOVED***);
  ***REMOVED***

    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
  ***REMOVED***

      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      const isNative = nativeEvents.has(typeEvent);
      let jQueryEvent;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      let evt = null;

      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
  ***REMOVED***

      if (isNative) {
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(typeEvent, bubbles, true);
  ***REMOVED*** else {
        evt = new CustomEvent(event, {
          bubbles,
          cancelable: true
    ***REMOVED***);
  ***REMOVED*** // merge custom information in our event


      if (typeof args !== 'undefined') {
        Object.keys(args).forEach(key => {
          Object.defineProperty(evt, key, {
            get() {
              return args[key];
        ***REMOVED***

      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***

      if (defaultPrevented) {
        evt.preventDefault();
  ***REMOVED***

      if (nativeDispatch) {
        element.dispatchEvent(evt);
  ***REMOVED***

      if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
        jQueryEvent.preventDefault();
  ***REMOVED***

      return evt;
***REMOVED***

  ***REMOVED***;

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const elementMap = new Map();
  var Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
  ***REMOVED***

      const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used

      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]***REMOVED***.`);
        return;
  ***REMOVED***

      instanceMap.set(key, instance);
  ***REMOVED***

    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
  ***REMOVED***

      return null;
  ***REMOVED***

    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
  ***REMOVED***

      const instanceMap = elementMap.get(element);
      instanceMap.delete(key); // free up element references if there are no instances left for an element

      if (instanceMap.size === 0) {
        elementMap.delete(element);
  ***REMOVED***
***REMOVED***

  ***REMOVED***;

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const VERSION = '5.1.0';

  class BaseComponent {
    constructor(element) {
      element = getElement(element);

      if (!element) {
        return;
  ***REMOVED***

      this._element = element;
      Data.set(this._element, this.constructor.DATA_KEY, this);
***REMOVED***

    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      Object.getOwnPropertyNames(this).forEach(propertyName => {
        this[propertyName] = null;
  ***REMOVED***);
***REMOVED***

    _queueCallback(callback, element, isAnimated = true) {
      executeAfterTransition(callback, element, isAnimated);
***REMOVED***
    /** Static */


    static getInstance(element) {
      return Data.get(getElement(element), this.DATA_KEY);
***REMOVED***

    static getOrCreateInstance(element, config = {***REMOVED***) {
      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
***REMOVED***

    static get VERSION() {
      return VERSION;
***REMOVED***

    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
***REMOVED***

    static get DATA_KEY() {
      return `bs.${this.NAME***REMOVED***`;
***REMOVED***

    static get EVENT_KEY() {
      return `.${this.DATA_KEY***REMOVED***`;
***REMOVED***

  ***REMOVED***

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/component-functions.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const enableDismissTrigger = (component, method = 'hide') => {
    const clickEvent = `click.dismiss${component.EVENT_KEY***REMOVED***`;
    const name = component.NAME;
    EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name***REMOVED***"]`, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
  ***REMOVED***

      if (isDisabled(this)) {
        return;
  ***REMOVED***

      const target = getElementFromSelector(this) || this.closest(`.${name***REMOVED***`);
      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

      instance[method]();
***REMOVED***);
  ***REMOVED***;

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$d = 'alert';
  const DATA_KEY$c = 'bs.alert';
  const EVENT_KEY$c = `.${DATA_KEY$c***REMOVED***`;
  const EVENT_CLOSE = `close${EVENT_KEY$c***REMOVED***`;
  const EVENT_CLOSED = `closed${EVENT_KEY$c***REMOVED***`;
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$8 = 'show';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$d;
***REMOVED*** // Public


    close() {
      const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

      if (closeEvent.defaultPrevented) {
        return;
  ***REMOVED***

      this._element.classList.remove(CLASS_NAME_SHOW$8);

      const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);

      this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
***REMOVED*** // Private


    _destroyElement() {
      this._element.remove();

      EventHandler.trigger(this._element, EVENT_CLOSED);
      this.dispose();
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Alert.getOrCreateInstance(this);

        if (typeof config !== 'string') {
          return;
    ***REMOVED***

        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config***REMOVED***"`);
    ***REMOVED***

        data[config](this);
  ***REMOVED***);
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  enableDismissTrigger(Alert, 'close');
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Alert to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Alert);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$c = 'button';
  const DATA_KEY$b = 'bs.button';
  const EVENT_KEY$b = `.${DATA_KEY$b***REMOVED***`;
  const DATA_API_KEY$7 = '.data-api';
  const CLASS_NAME_ACTIVE$3 = 'active';
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$b***REMOVED***${DATA_API_KEY$7***REMOVED***`;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$c;
***REMOVED*** // Public


    toggle() {
      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Button.getOrCreateInstance(this);

        if (config === 'toggle') {
          data[config]();
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
    const data = Button.getOrCreateInstance(button);
    data.toggle();
  ***REMOVED***);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Button to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Button);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  function normalizeData(val) {
    if (val === 'true') {
      return true;
***REMOVED***

    if (val === 'false') {
      return false;
***REMOVED***

    if (val === Number(val).toString()) {
      return Number(val);
***REMOVED***

    if (val === '' || val === 'null') {
      return null;
***REMOVED***

    return val;
  ***REMOVED***

  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()***REMOVED***`);
  ***REMOVED***

  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)***REMOVED***`, value);
  ***REMOVED***

    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)***REMOVED***`);
  ***REMOVED***

    getDataAttributes(element) {
      if (!element) {
        return {***REMOVED***;
  ***REMOVED***

      const attributes = {***REMOVED***;
      Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
  ***REMOVED***);
      return attributes;
  ***REMOVED***

    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)***REMOVED***`));
  ***REMOVED***

    offset(element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
  ***REMOVED***;
  ***REMOVED***

    position(element) {
      return {
        top: element.offsetTop,
        left: element.offsetLeft
  ***REMOVED***;
***REMOVED***

  ***REMOVED***;

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const NODE_TEXT = 3;
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  ***REMOVED***

    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
  ***REMOVED***

    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
  ***REMOVED***

    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode;

      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
        if (ancestor.matches(selector)) {
          parents.push(ancestor);
    ***REMOVED***

        ancestor = ancestor.parentNode;
  ***REMOVED***

      return parents;
  ***REMOVED***

    prev(element, selector) {
      let previous = element.previousElementSibling;

      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
    ***REMOVED***

        previous = previous.previousElementSibling;
  ***REMOVED***

      return [];
  ***REMOVED***

    next(element, selector) {
      let next = element.nextElementSibling;

      while (next) {
        if (next.matches(selector)) {
          return [next];
    ***REMOVED***

        next = next.nextElementSibling;
  ***REMOVED***

      return [];
  ***REMOVED***

    focusableChildren(element) {
      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector***REMOVED***:not([tabindex^="-"])`).join(', ');
      return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
***REMOVED***

  ***REMOVED***;

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$b = 'carousel';
  const DATA_KEY$a = 'bs.carousel';
  const EVENT_KEY$a = `.${DATA_KEY$a***REMOVED***`;
  const DATA_API_KEY$6 = '.data-api';
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const SWIPE_THRESHOLD = 40;
  const Default$a = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  ***REMOVED***;
  const DefaultType$a = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  ***REMOVED***;
  const ORDER_NEXT = 'next';
  const ORDER_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const KEY_TO_DIRECTION = {
    [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
    [ARROW_RIGHT_KEY]: DIRECTION_LEFT
  ***REMOVED***;
  const EVENT_SLIDE = `slide${EVENT_KEY$a***REMOVED***`;
  const EVENT_SLID = `slid${EVENT_KEY$a***REMOVED***`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$a***REMOVED***`;
  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$a***REMOVED***`;
  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$a***REMOVED***`;
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$a***REMOVED***`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$a***REMOVED***`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$a***REMOVED***`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$a***REMOVED***`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$a***REMOVED***`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$a***REMOVED***`;
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a***REMOVED***${DATA_API_KEY$6***REMOVED***`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a***REMOVED***${DATA_API_KEY$6***REMOVED***`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_END = 'carousel-item-end';
  const CLASS_NAME_START = 'carousel-item-start';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SELECTOR_ACTIVE$1 = '.active';
  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_INDICATOR = '[data-bs-target]';
  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const POINTER_TYPE_TOUCH = 'touch';
  const POINTER_TYPE_PEN = 'pen';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent);

      this._addEventListeners();
***REMOVED*** // Getters


    static get Default() {
      return Default$a;
***REMOVED***

    static get NAME() {
      return NAME$b;
***REMOVED*** // Public


    next() {
      this._slide(ORDER_NEXT);
***REMOVED***

    nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
  ***REMOVED***
***REMOVED***

    prev() {
      this._slide(ORDER_PREV);
***REMOVED***

    pause(event) {
      if (!event) {
        this._isPaused = true;
  ***REMOVED***

      if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
        triggerTransitionEnd(this._element);
        this.cycle(true);
  ***REMOVED***

      clearInterval(this._interval);
      this._interval = null;
***REMOVED***

    cycle(event) {
      if (!event) {
        this._isPaused = false;
  ***REMOVED***

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
  ***REMOVED***

      if (this._config && this._config.interval && !this._isPaused) {
        this._updateInterval();

        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
  ***REMOVED***
***REMOVED***

    to(index) {
      this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
  ***REMOVED***

      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
  ***REMOVED***

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
  ***REMOVED***

      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

      this._slide(order, this._items[index]);
***REMOVED*** // Private


    _getConfig(config) {
      config = { ...Default$a,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {***REMOVED***)
  ***REMOVED***;
      typeCheckConfig(NAME$b, config, DefaultType$a);
      return config;
***REMOVED***

    _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
  ***REMOVED***

      const direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0;

      if (!direction) {
        return;
  ***REMOVED***

      this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
***REMOVED***

    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
  ***REMOVED***

      if (this._config.pause === 'hover') {
        EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
        EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
  ***REMOVED***

      if (this._config.touch && this._touchSupported) {
        this._addTouchEventListeners();
  ***REMOVED***
***REMOVED***

    _addTouchEventListeners() {
      const start = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchStartX = event.clientX;
    ***REMOVED*** else if (!this._pointerEvent) {
          this.touchStartX = event.touches[0].clientX;
    ***REMOVED***
  ***REMOVED***;

      const move = event => {
        // ensure swiping with one touch and not pinching
        this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
  ***REMOVED***;

      const end = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchDeltaX = event.clientX - this.touchStartX;
    ***REMOVED***

        this._handleSwipe();

        if (this._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          this.pause();

          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
      ***REMOVED***

          this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
    ***REMOVED***
  ***REMOVED***;

      SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
        EventHandler.on(itemImg, EVENT_DRAG_START, e => e.preventDefault());
  ***REMOVED***);

      if (this._pointerEvent) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));

        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
  ***REMOVED*** else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
  ***REMOVED***
***REMOVED***

    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
  ***REMOVED***

      const direction = KEY_TO_DIRECTION[event.key];

      if (direction) {
        event.preventDefault();

        this._slide(direction);
  ***REMOVED***
***REMOVED***

    _getItemIndex(element) {
      this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
      return this._items.indexOf(element);
***REMOVED***

    _getItemByOrder(order, activeElement) {
      const isNext = order === ORDER_NEXT;
      return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
***REMOVED***

    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget);

      const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));

      return EventHandler.trigger(this._element, EVENT_SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
  ***REMOVED***);
***REMOVED***

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
        activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
        activeIndicator.removeAttribute('aria-current');
        const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);

        for (let i = 0; i < indicators.length; i++) {
          if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
            indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
            indicators[i].setAttribute('aria-current', 'true');
            break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    _updateInterval() {
      const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      if (!element) {
        return;
  ***REMOVED***

      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

      if (elementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
        this._config.interval = elementInterval;
  ***REMOVED*** else {
        this._config.interval = this._config.defaultInterval || this._config.interval;
  ***REMOVED***
***REMOVED***

    _slide(directionOrOrder, element) {
      const order = this._directionToOrder(directionOrOrder);

      const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeElementIndex = this._getItemIndex(activeElement);

      const nextElement = element || this._getItemByOrder(order, activeElement);

      const nextElementIndex = this._getItemIndex(nextElement);

      const isCycling = Boolean(this._interval);
      const isNext = order === ORDER_NEXT;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

      const eventDirectionName = this._orderToDirection(order);

      if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
        this._isSliding = false;
        return;
  ***REMOVED***

      if (this._isSliding) {
        return;
  ***REMOVED***

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.defaultPrevented) {
        return;
  ***REMOVED***

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
  ***REMOVED***

      this._isSliding = true;

      if (isCycling) {
        this.pause();
  ***REMOVED***

      this._setActiveIndicatorElement(nextElement);

      this._activeElement = nextElement;

      const triggerSlidEvent = () => {
        EventHandler.trigger(this._element, EVENT_SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex
    ***REMOVED***);
  ***REMOVED***;

      if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
        nextElement.classList.add(orderClassName);
        reflow(nextElement);
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);

        const completeCallBack = () => {
          nextElement.classList.remove(directionalClassName, orderClassName);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
          this._isSliding = false;
          setTimeout(triggerSlidEvent, 0);
    ***REMOVED***;

        this._queueCallback(completeCallBack, activeElement, true);
  ***REMOVED*** else {
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        this._isSliding = false;
        triggerSlidEvent();
  ***REMOVED***

      if (isCycling) {
        this.cycle();
  ***REMOVED***
***REMOVED***

    _directionToOrder(direction) {
      if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
        return direction;
  ***REMOVED***

      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
  ***REMOVED***

      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
***REMOVED***

    _orderToDirection(order) {
      if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
        return order;
  ***REMOVED***

      if (isRTL()) {
        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
  ***REMOVED***

      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
***REMOVED*** // Static


    static carouselInterface(element, config) {
      const data = Carousel.getOrCreateInstance(element, config);
      let {
        _config
  ***REMOVED*** = data;

      if (typeof config === 'object') {
        _config = { ..._config,
          ...config
    ***REMOVED***;
  ***REMOVED***

      const action = typeof config === 'string' ? config : _config.slide;

      if (typeof config === 'number') {
        data.to(config);
  ***REMOVED*** else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action***REMOVED***"`);
    ***REMOVED***

        data[action]();
  ***REMOVED*** else if (_config.interval && _config.ride) {
        data.pause();
        data.cycle();
  ***REMOVED***
***REMOVED***

    static jQueryInterface(config) {
      return this.each(function () {
        Carousel.carouselInterface(this, config);
  ***REMOVED***);
***REMOVED***

    static dataApiClickHandler(event) {
      const target = getElementFromSelector(this);

      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
        return;
  ***REMOVED***

      const config = { ...Manipulator.getDataAttributes(target),
        ...Manipulator.getDataAttributes(this)
  ***REMOVED***;
      const slideIndex = this.getAttribute('data-bs-slide-to');

      if (slideIndex) {
        config.interval = false;
  ***REMOVED***

      Carousel.carouselInterface(target, config);

      if (slideIndex) {
        Carousel.getInstance(target).to(slideIndex);
  ***REMOVED***

      event.preventDefault();
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

    for (let i = 0, len = carousels.length; i < len; i++) {
      Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
***REMOVED***
  ***REMOVED***);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Carousel to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Carousel);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$a = 'collapse';
  const DATA_KEY$9 = 'bs.collapse';
  const EVENT_KEY$9 = `.${DATA_KEY$9***REMOVED***`;
  const DATA_API_KEY$5 = '.data-api';
  const Default$9 = {
    toggle: true,
    parent: null
  ***REMOVED***;
  const DefaultType$9 = {
    toggle: 'boolean',
    parent: '(null|element)'
  ***REMOVED***;
  const EVENT_SHOW$5 = `show${EVENT_KEY$9***REMOVED***`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$9***REMOVED***`;
  const EVENT_HIDE$5 = `hide${EVENT_KEY$9***REMOVED***`;
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9***REMOVED***`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9***REMOVED***${DATA_API_KEY$5***REMOVED***`;
  const CLASS_NAME_SHOW$7 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.show, .collapsing';
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._isTransitioning = false;
      this._config = this._getConfig(config);
      this._triggerArray = [];
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);

        if (selector !== null && filterElement.length) {
          this._selector = selector;

          this._triggerArray.push(elem);
    ***REMOVED***
  ***REMOVED***

      this._initializeChildren();

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
  ***REMOVED***

      if (this._config.toggle) {
        this.toggle();
  ***REMOVED***
***REMOVED*** // Getters


    static get Default() {
      return Default$9;
***REMOVED***

    static get NAME() {
      return NAME$a;
***REMOVED*** // Public


    toggle() {
      if (this._isShown()) {
        this.hide();
  ***REMOVED*** else {
        this.show();
  ***REMOVED***
***REMOVED***

    show() {
      if (this._isTransitioning || this._isShown()) {
        return;
  ***REMOVED***

      let actives = [];
      let activesData;

      if (this._config.parent) {
        const children = SelectorEngine.find(`.${CLASS_NAME_COLLAPSE***REMOVED*** .${CLASS_NAME_COLLAPSE***REMOVED***`, this._config.parent);
        actives = SelectorEngine.find(SELECTOR_ACTIVES, this._config.parent).filter(elem => !children.includes(elem)); // remove children if greater depth
  ***REMOVED***

      const container = SelectorEngine.findOne(this._selector);

      if (actives.length) {
        const tempActiveData = actives.find(elem => container !== elem);
        activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null;

        if (activesData && activesData._isTransitioning) {
          return;
    ***REMOVED***
  ***REMOVED***

      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

      if (startEvent.defaultPrevented) {
        return;
  ***REMOVED***

      actives.forEach(elemActive => {
        if (container !== elemActive) {
          Collapse.getOrCreateInstance(elemActive, {
            toggle: false
      ***REMOVED***).hide();
    ***REMOVED***

        if (!activesData) {
          Data.set(elemActive, DATA_KEY$9, null);
    ***REMOVED***
  ***REMOVED***);

      const dimension = this._getDimension();

      this._element.classList.remove(CLASS_NAME_COLLAPSE);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.style[dimension] = 0;

      this._addAriaAndCollapsedClass(this._triggerArray, true);

      this._isTransitioning = true;

      const complete = () => {
        this._isTransitioning = false;

        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

        this._element.style[dimension] = '';
        EventHandler.trigger(this._element, EVENT_SHOWN$5);
  ***REMOVED***;

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension***REMOVED***`;

      this._queueCallback(complete, this._element, true);

      this._element.style[dimension] = `${this._element[scrollSize]***REMOVED***px`;
***REMOVED***

    hide() {
      if (this._isTransitioning || !this._isShown()) {
        return;
  ***REMOVED***

      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

      if (startEvent.defaultPrevented) {
        return;
  ***REMOVED***

      const dimension = this._getDimension();

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]***REMOVED***px`;
      reflow(this._element);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

      const triggerArrayLength = this._triggerArray.length;

      for (let i = 0; i < triggerArrayLength; i++) {
        const trigger = this._triggerArray[i];
        const elem = getElementFromSelector(trigger);

        if (elem && !this._isShown(elem)) {
          this._addAriaAndCollapsedClass([trigger], false);
    ***REMOVED***
  ***REMOVED***

      this._isTransitioning = true;

      const complete = () => {
        this._isTransitioning = false;

        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE);

        EventHandler.trigger(this._element, EVENT_HIDDEN$5);
  ***REMOVED***;

      this._element.style[dimension] = '';

      this._queueCallback(complete, this._element, true);
***REMOVED***

    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$7);
***REMOVED*** // Private


    _getConfig(config) {
      config = { ...Default$9,
        ...Manipulator.getDataAttributes(this._element),
        ...config
  ***REMOVED***;
      config.toggle = Boolean(config.toggle); // Coerce string values

      config.parent = getElement(config.parent);
      typeCheckConfig(NAME$a, config, DefaultType$9);
      return config;
***REMOVED***

    _getDimension() {
      return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
***REMOVED***

    _initializeChildren() {
      if (!this._config.parent) {
        return;
  ***REMOVED***

      const children = SelectorEngine.find(`.${CLASS_NAME_COLLAPSE***REMOVED*** .${CLASS_NAME_COLLAPSE***REMOVED***`, this._config.parent);
      SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent).filter(elem => !children.includes(elem)).forEach(element => {
        const selected = getElementFromSelector(element);

        if (selected) {
          this._addAriaAndCollapsedClass([element], this._isShown(selected));
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

    _addAriaAndCollapsedClass(triggerArray, isOpen) {
      if (!triggerArray.length) {
        return;
  ***REMOVED***

      triggerArray.forEach(elem => {
        if (isOpen) {
          elem.classList.remove(CLASS_NAME_COLLAPSED);
    ***REMOVED*** else {
          elem.classList.add(CLASS_NAME_COLLAPSED);
    ***REMOVED***

        elem.setAttribute('aria-expanded', isOpen);
  ***REMOVED***);
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const _config = {***REMOVED***;

        if (typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
    ***REMOVED***

        const data = Collapse.getOrCreateInstance(this, _config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config***REMOVED***"`);
      ***REMOVED***

          data[config]();
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
      event.preventDefault();
***REMOVED***

    const selector = getSelectorFromElement(this);
    const selectorElements = SelectorEngine.find(selector);
    selectorElements.forEach(element => {
      Collapse.getOrCreateInstance(element, {
        toggle: false
  ***REMOVED***).toggle();
***REMOVED***);
  ***REMOVED***);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Collapse to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Collapse);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$9 = 'dropdown';
  const DATA_KEY$8 = 'bs.dropdown';
  const EVENT_KEY$8 = `.${DATA_KEY$8***REMOVED***`;
  const DATA_API_KEY$4 = '.data-api';
  const ESCAPE_KEY$2 = 'Escape';
  const SPACE_KEY = 'Space';
  const TAB_KEY$1 = 'Tab';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY***REMOVED***|${ARROW_DOWN_KEY***REMOVED***|${ESCAPE_KEY$2***REMOVED***`);
  const EVENT_HIDE$4 = `hide${EVENT_KEY$8***REMOVED***`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8***REMOVED***`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$8***REMOVED***`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$8***REMOVED***`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8***REMOVED***${DATA_API_KEY$4***REMOVED***`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8***REMOVED***${DATA_API_KEY$4***REMOVED***`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8***REMOVED***${DATA_API_KEY$4***REMOVED***`;
  const CLASS_NAME_SHOW$6 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPEND = 'dropend';
  const CLASS_NAME_DROPSTART = 'dropstart';
  const CLASS_NAME_NAVBAR = 'navbar';
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
  const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
  const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
  const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
  const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
  const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
  const Default$8 = {
    offset: [0, 2],
    boundary: 'clippingParents',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
    autoClose: true
  ***REMOVED***;
  const DefaultType$8 = {
    offset: '(array|string|function)',
    boundary: '(string|element)',
    reference: '(string|element|object)',
    display: 'string',
    popperConfig: '(null|object|function)',
    autoClose: '(boolean|string)'
  ***REMOVED***;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();
***REMOVED*** // Getters


    static get Default() {
      return Default$8;
***REMOVED***

    static get DefaultType() {
      return DefaultType$8;
***REMOVED***

    static get NAME() {
      return NAME$9;
***REMOVED*** // Public


    toggle() {
      return this._isShown() ? this.hide() : this.show();
***REMOVED***

    show() {
      if (isDisabled(this._element) || this._isShown(this._menu)) {
        return;
  ***REMOVED***

      const relatedTarget = {
        relatedTarget: this._element
  ***REMOVED***;
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);

      if (showEvent.defaultPrevented) {
        return;
  ***REMOVED***

      const parent = Dropdown.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar

      if (this._inNavbar) {
        Manipulator.setDataAttribute(this._menu, 'popper', 'none');
  ***REMOVED*** else {
        this._createPopper(parent);
  ***REMOVED*** // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
        [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
  ***REMOVED***

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      this._menu.classList.add(CLASS_NAME_SHOW$6);

      this._element.classList.add(CLASS_NAME_SHOW$6);

      EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
***REMOVED***

    hide() {
      if (isDisabled(this._element) || !this._isShown(this._menu)) {
        return;
  ***REMOVED***

      const relatedTarget = {
        relatedTarget: this._element
  ***REMOVED***;

      this._completeHide(relatedTarget);
***REMOVED***

    dispose() {
      if (this._popper) {
        this._popper.destroy();
  ***REMOVED***

      super.dispose();
***REMOVED***

    update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper) {
        this._popper.update();
  ***REMOVED***
***REMOVED*** // Private


    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);

      if (hideEvent.defaultPrevented) {
        return;
  ***REMOVED*** // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
  ***REMOVED***

      if (this._popper) {
        this._popper.destroy();
  ***REMOVED***

      this._menu.classList.remove(CLASS_NAME_SHOW$6);

      this._element.classList.remove(CLASS_NAME_SHOW$6);

      this._element.setAttribute('aria-expanded', 'false');

      Manipulator.removeDataAttribute(this._menu, 'popper');
      EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
***REMOVED***

    _getConfig(config) {
      config = { ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
  ***REMOVED***;
      typeCheckConfig(NAME$9, config, this.constructor.DefaultType);

      if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Popper virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$9.toUpperCase()***REMOVED***: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
  ***REMOVED***

      return config;
***REMOVED***

    _createPopper(parent) {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
  ***REMOVED***

      let referenceElement = this._element;

      if (this._config.reference === 'parent') {
        referenceElement = parent;
  ***REMOVED*** else if (isElement(this._config.reference)) {
        referenceElement = getElement(this._config.reference);
  ***REMOVED*** else if (typeof this._config.reference === 'object') {
        referenceElement = this._config.reference;
  ***REMOVED***

      const popperConfig = this._getPopperConfig();

      const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
      this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);

      if (isDisplayStatic) {
        Manipulator.setDataAttribute(this._menu, 'popper', 'static');
  ***REMOVED***
***REMOVED***

    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$6);
***REMOVED***

    _getMenuElement() {
      return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
***REMOVED***

    _getPlacement() {
      const parentDropdown = this._element.parentNode;

      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
  ***REMOVED***

      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
  ***REMOVED*** // We need to trim the value because custom properties can also include spaces


      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
  ***REMOVED***

      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
***REMOVED***

    _detectNavbar() {
      return this._element.closest(`.${CLASS_NAME_NAVBAR***REMOVED***`) !== null;
***REMOVED***

    _getOffset() {
      const {
        offset
  ***REMOVED*** = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
  ***REMOVED***

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
  ***REMOVED***

      return offset;
***REMOVED***

    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
      ***REMOVED***
      ***REMOVED*** {
          name: 'offset',
          options: {
            offset: this._getOffset()
      ***REMOVED***
    ***REMOVED***]
  ***REMOVED***; // Disable Popper if we have a static display

      if (this._config.display === 'static') {
        defaultBsPopperConfig.modifiers = [{
          name: 'applyStyles',
          enabled: false
    ***REMOVED***];
  ***REMOVED***

      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
  ***REMOVED***;
***REMOVED***

    _selectMenuItem({
      key,
      target
***REMOVED***) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

      if (!items.length) {
        return;
  ***REMOVED*** // if target isn't included in items (e.g. when expanding the dropdown)
      // allow cycling to get the last item in case key equals ARROW_UP_KEY


      getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Dropdown.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
    ***REMOVED***

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config***REMOVED***"`);
    ***REMOVED***

        data[config]();
  ***REMOVED***);
***REMOVED***

    static clearMenus(event) {
      if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1)) {
        return;
  ***REMOVED***

      const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

      for (let i = 0, len = toggles.length; i < len; i++) {
        const context = Dropdown.getInstance(toggles[i]);

        if (!context || context._config.autoClose === false) {
          continue;
    ***REMOVED***

        if (!context._isShown()) {
          continue;
    ***REMOVED***

        const relatedTarget = {
          relatedTarget: context._element
    ***REMOVED***;

        if (event) {
          const composedPath = event.composedPath();
          const isMenuTarget = composedPath.includes(context._menu);

          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
            continue;
      ***REMOVED*** // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
            continue;
      ***REMOVED***

          if (event.type === 'click') {
            relatedTarget.clickEvent = event;
      ***REMOVED***
    ***REMOVED***

        context._completeHide(relatedTarget);
  ***REMOVED***
***REMOVED***

    static getParentFromElement(element) {
      return getElementFromSelector(element) || element.parentNode;
***REMOVED***

    static dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
        return;
  ***REMOVED***

      const isActive = this.classList.contains(CLASS_NAME_SHOW$6);

      if (!isActive && event.key === ESCAPE_KEY$2) {
        return;
  ***REMOVED***

      event.preventDefault();
      event.stopPropagation();

      if (isDisabled(this)) {
        return;
  ***REMOVED***

      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
      const instance = Dropdown.getOrCreateInstance(getToggleButton);

      if (event.key === ESCAPE_KEY$2) {
        instance.hide();
        return;
  ***REMOVED***

      if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
        if (!isActive) {
          instance.show();
    ***REMOVED***

        instance._selectMenuItem(event);

        return;
  ***REMOVED***

      if (!isActive || event.key === SPACE_KEY) {
        Dropdown.clearMenus();
  ***REMOVED***
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    event.preventDefault();
    Dropdown.getOrCreateInstance(this).toggle();
  ***REMOVED***);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Dropdown to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Dropdown);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';

  class ScrollBarHelper {
    constructor() {
      this._element = document.body;
***REMOVED***

    getWidth() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
***REMOVED***

    hide() {
      const width = this.getWidth();

      this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


      this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


      this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

      this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
***REMOVED***

    _disableOverFlow() {
      this._saveInitialAttribute(this._element, 'overflow');

      this._element.style.overflow = 'hidden';
***REMOVED***

    _setElementAttributes(selector, styleProp, callback) {
      const scrollbarWidth = this.getWidth();

      const manipulationCallBack = element => {
        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
          return;
    ***REMOVED***

        this._saveInitialAttribute(element, styleProp);

        const calculatedValue = window.getComputedStyle(element)[styleProp];
        element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))***REMOVED***px`;
  ***REMOVED***;

      this._applyManipulationCallback(selector, manipulationCallBack);
***REMOVED***

    reset() {
      this._resetElementAttributes(this._element, 'overflow');

      this._resetElementAttributes(this._element, 'paddingRight');

      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
***REMOVED***

    _saveInitialAttribute(element, styleProp) {
      const actualValue = element.style[styleProp];

      if (actualValue) {
        Manipulator.setDataAttribute(element, styleProp, actualValue);
  ***REMOVED***
***REMOVED***

    _resetElementAttributes(selector, styleProp) {
      const manipulationCallBack = element => {
        const value = Manipulator.getDataAttribute(element, styleProp);

        if (typeof value === 'undefined') {
          element.style.removeProperty(styleProp);
    ***REMOVED*** else {
          Manipulator.removeDataAttribute(element, styleProp);
          element.style[styleProp] = value;
    ***REMOVED***
  ***REMOVED***;

      this._applyManipulationCallback(selector, manipulationCallBack);
***REMOVED***

    _applyManipulationCallback(selector, callBack) {
      if (isElement(selector)) {
        callBack(selector);
  ***REMOVED*** else {
        SelectorEngine.find(selector, this._element).forEach(callBack);
  ***REMOVED***
***REMOVED***

    isOverflowing() {
      return this.getWidth() > 0;
***REMOVED***

  ***REMOVED***

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  const Default$7 = {
    className: 'modal-backdrop',
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    isAnimated: false,
    rootElement: 'body',
    // give the choice to place backdrop under different elements
    clickCallback: null
  ***REMOVED***;
  const DefaultType$7 = {
    className: 'string',
    isVisible: 'boolean',
    isAnimated: 'boolean',
    rootElement: '(element|string)',
    clickCallback: '(function|null)'
  ***REMOVED***;
  const NAME$8 = 'backdrop';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$5 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$8***REMOVED***`;

  class Backdrop {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
***REMOVED***

    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
  ***REMOVED***

      this._append();

      if (this._config.isAnimated) {
        reflow(this._getElement());
  ***REMOVED***

      this._getElement().classList.add(CLASS_NAME_SHOW$5);

      this._emulateAnimation(() => {
        execute(callback);
  ***REMOVED***);
***REMOVED***

    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
  ***REMOVED***

      this._getElement().classList.remove(CLASS_NAME_SHOW$5);

      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
  ***REMOVED***);
***REMOVED*** // Private


    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement('div');
        backdrop.className = this._config.className;

        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$4);
    ***REMOVED***

        this._element = backdrop;
  ***REMOVED***

      return this._element;
***REMOVED***

    _getConfig(config) {
      config = { ...Default$7,
        ...(typeof config === 'object' ? config : {***REMOVED***)
  ***REMOVED***; // use getElement() with the default "body" to get a fresh Element on each instantiation

      config.rootElement = getElement(config.rootElement);
      typeCheckConfig(NAME$8, config, DefaultType$7);
      return config;
***REMOVED***

    _append() {
      if (this._isAppended) {
        return;
  ***REMOVED***

      this._config.rootElement.append(this._getElement());

      EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
  ***REMOVED***);
      this._isAppended = true;
***REMOVED***

    dispose() {
      if (!this._isAppended) {
        return;
  ***REMOVED***

      EventHandler.off(this._element, EVENT_MOUSEDOWN);

      this._element.remove();

      this._isAppended = false;
***REMOVED***

    _emulateAnimation(callback) {
      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
***REMOVED***

  ***REMOVED***

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/focustrap.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  const Default$6 = {
    trapElement: null,
    // The element to trap focus inside of
    autofocus: true
  ***REMOVED***;
  const DefaultType$6 = {
    trapElement: 'element',
    autofocus: 'boolean'
  ***REMOVED***;
  const NAME$7 = 'focustrap';
  const DATA_KEY$7 = 'bs.focustrap';
  const EVENT_KEY$7 = `.${DATA_KEY$7***REMOVED***`;
  const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7***REMOVED***`;
  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7***REMOVED***`;
  const TAB_KEY = 'Tab';
  const TAB_NAV_FORWARD = 'forward';
  const TAB_NAV_BACKWARD = 'backward';

  class FocusTrap {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isActive = false;
      this._lastTabNavDirection = null;
***REMOVED***

    activate() {
      const {
        trapElement,
        autofocus
  ***REMOVED*** = this._config;

      if (this._isActive) {
        return;
  ***REMOVED***

      if (autofocus) {
        trapElement.focus();
  ***REMOVED***

      EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event));
      EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
      this._isActive = true;
***REMOVED***

    deactivate() {
      if (!this._isActive) {
        return;
  ***REMOVED***

      this._isActive = false;
      EventHandler.off(document, EVENT_KEY$7);
***REMOVED*** // Private


    _handleFocusin(event) {
      const {
        target
  ***REMOVED*** = event;
      const {
        trapElement
  ***REMOVED*** = this._config;

      if (target === document || target === trapElement || trapElement.contains(target)) {
        return;
  ***REMOVED***

      const elements = SelectorEngine.focusableChildren(trapElement);

      if (elements.length === 0) {
        trapElement.focus();
  ***REMOVED*** else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
        elements[elements.length - 1].focus();
  ***REMOVED*** else {
        elements[0].focus();
  ***REMOVED***
***REMOVED***

    _handleKeydown(event) {
      if (event.key !== TAB_KEY) {
        return;
  ***REMOVED***

      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
***REMOVED***

    _getConfig(config) {
      config = { ...Default$6,
        ...(typeof config === 'object' ? config : {***REMOVED***)
  ***REMOVED***;
      typeCheckConfig(NAME$7, config, DefaultType$6);
      return config;
***REMOVED***

  ***REMOVED***

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$6 = 'modal';
  const DATA_KEY$6 = 'bs.modal';
  const EVENT_KEY$6 = `.${DATA_KEY$6***REMOVED***`;
  const DATA_API_KEY$3 = '.data-api';
  const ESCAPE_KEY$1 = 'Escape';
  const Default$5 = {
    backdrop: true,
    keyboard: true,
    focus: true
  ***REMOVED***;
  const DefaultType$5 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean'
  ***REMOVED***;
  const EVENT_HIDE$3 = `hide${EVENT_KEY$6***REMOVED***`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6***REMOVED***`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6***REMOVED***`;
  const EVENT_SHOW$3 = `show${EVENT_KEY$6***REMOVED***`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6***REMOVED***`;
  const EVENT_RESIZE = `resize${EVENT_KEY$6***REMOVED***`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$6***REMOVED***`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6***REMOVED***`;
  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6***REMOVED***`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6***REMOVED***`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6***REMOVED***${DATA_API_KEY$3***REMOVED***`;
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_SHOW$4 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._isShown = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollBar = new ScrollBarHelper();
***REMOVED*** // Getters


    static get Default() {
      return Default$5;
***REMOVED***

    static get NAME() {
      return NAME$6;
***REMOVED*** // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
***REMOVED***

    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
  ***REMOVED***

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
  ***REMOVED***);

      if (showEvent.defaultPrevented) {
        return;
  ***REMOVED***

      this._isShown = true;

      if (this._isAnimated()) {
        this._isTransitioning = true;
  ***REMOVED***

      this._scrollBar.hide();

      document.body.classList.add(CLASS_NAME_OPEN);

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
        EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
          if (event.target === this._element) {
            this._ignoreBackdropClick = true;
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***);

      this._showBackdrop(() => this._showElement(relatedTarget));
***REMOVED***

    hide() {
      if (!this._isShown || this._isTransitioning) {
        return;
  ***REMOVED***

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

      if (hideEvent.defaultPrevented) {
        return;
  ***REMOVED***

      this._isShown = false;

      const isAnimated = this._isAnimated();

      if (isAnimated) {
        this._isTransitioning = true;
  ***REMOVED***

      this._setEscapeEvent();

      this._setResizeEvent();

      this._focustrap.deactivate();

      this._element.classList.remove(CLASS_NAME_SHOW$4);

      EventHandler.off(this._element, EVENT_CLICK_DISMISS);
      EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

      this._queueCallback(() => this._hideModal(), this._element, isAnimated);
***REMOVED***

    dispose() {
      [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));

      this._backdrop.dispose();

      this._focustrap.deactivate();

      super.dispose();
***REMOVED***

    handleUpdate() {
      this._adjustDialog();
***REMOVED*** // Private


    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value
        isAnimated: this._isAnimated()
  ***REMOVED***);
***REMOVED***

    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
  ***REMOVED***);
***REMOVED***

    _getConfig(config) {
      config = { ...Default$5,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {***REMOVED***)
  ***REMOVED***;
      typeCheckConfig(NAME$6, config, DefaultType$5);
      return config;
***REMOVED***

    _showElement(relatedTarget) {
      const isAnimated = this._isAnimated();

      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.append(this._element);
  ***REMOVED***

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.scrollTop = 0;

      if (modalBody) {
        modalBody.scrollTop = 0;
  ***REMOVED***

      if (isAnimated) {
        reflow(this._element);
  ***REMOVED***

      this._element.classList.add(CLASS_NAME_SHOW$4);

      const transitionComplete = () => {
        if (this._config.focus) {
          this._focustrap.activate();
    ***REMOVED***

        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
    ***REMOVED***);
  ***REMOVED***;

      this._queueCallback(transitionComplete, this._dialog, isAnimated);
***REMOVED***

    _setEscapeEvent() {
      if (this._isShown) {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
          if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
            event.preventDefault();
            this.hide();
      ***REMOVED*** else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
            this._triggerBackdropTransition();
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED*** else {
        EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
  ***REMOVED***
***REMOVED***

    _setResizeEvent() {
      if (this._isShown) {
        EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
  ***REMOVED*** else {
        EventHandler.off(window, EVENT_RESIZE);
  ***REMOVED***
***REMOVED***

    _hideModal() {
      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      this._isTransitioning = false;

      this._backdrop.hide(() => {
        document.body.classList.remove(CLASS_NAME_OPEN);

        this._resetAdjustments();

        this._scrollBar.reset();

        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
  ***REMOVED***);
***REMOVED***

    _showBackdrop(callback) {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false;
          return;
    ***REMOVED***

        if (event.target !== event.currentTarget) {
          return;
    ***REMOVED***

        if (this._config.backdrop === true) {
          this.hide();
    ***REMOVED*** else if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
    ***REMOVED***
  ***REMOVED***);

      this._backdrop.show(callback);
***REMOVED***

    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_FADE$3);
***REMOVED***

    _triggerBackdropTransition() {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

      if (hideEvent.defaultPrevented) {
        return;
  ***REMOVED***

      const {
        classList,
        scrollHeight,
        style
  ***REMOVED*** = this._element;
      const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed

      if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
        return;
  ***REMOVED***

      if (!isModalOverflowing) {
        style.overflowY = 'hidden';
  ***REMOVED***

      classList.add(CLASS_NAME_STATIC);

      this._queueCallback(() => {
        classList.remove(CLASS_NAME_STATIC);

        if (!isModalOverflowing) {
          this._queueCallback(() => {
            style.overflowY = '';
        ***REMOVED*** this._dialog);
    ***REMOVED***
    ***REMOVED*** this._dialog);

      this._element.focus();
***REMOVED*** // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // ----------------------------------------------------------------------


    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      const scrollbarWidth = this._scrollBar.getWidth();

      const isBodyOverflowing = scrollbarWidth > 0;

      if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
        this._element.style.paddingLeft = `${scrollbarWidth***REMOVED***px`;
  ***REMOVED***

      if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
        this._element.style.paddingRight = `${scrollbarWidth***REMOVED***px`;
  ***REMOVED***
***REMOVED***

    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
***REMOVED*** // Static


    static jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        const data = Modal.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
    ***REMOVED***

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config***REMOVED***"`);
    ***REMOVED***

        data[config](relatedTarget);
  ***REMOVED***);
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
***REMOVED***

    EventHandler.one(target, EVENT_SHOW$3, showEvent => {
      if (showEvent.defaultPrevented) {
        // only register focus restorer if modal will actually get shown
        return;
  ***REMOVED***

      EventHandler.one(target, EVENT_HIDDEN$3, () => {
        if (isVisible(this)) {
          this.focus();
    ***REMOVED***
  ***REMOVED***);
***REMOVED***);
    const data = Modal.getOrCreateInstance(target);
    data.toggle(this);
  ***REMOVED***);
  enableDismissTrigger(Modal);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Modal to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Modal);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): offcanvas.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$5 = 'offcanvas';
  const DATA_KEY$5 = 'bs.offcanvas';
  const EVENT_KEY$5 = `.${DATA_KEY$5***REMOVED***`;
  const DATA_API_KEY$2 = '.data-api';
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5***REMOVED***${DATA_API_KEY$2***REMOVED***`;
  const ESCAPE_KEY = 'Escape';
  const Default$4 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  ***REMOVED***;
  const DefaultType$4 = {
    backdrop: 'boolean',
    keyboard: 'boolean',
    scroll: 'boolean'
  ***REMOVED***;
  const CLASS_NAME_SHOW$3 = 'show';
  const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
  const OPEN_SELECTOR = '.offcanvas.show';
  const EVENT_SHOW$2 = `show${EVENT_KEY$5***REMOVED***`;
  const EVENT_SHOWN$2 = `shown${EVENT_KEY$5***REMOVED***`;
  const EVENT_HIDE$2 = `hide${EVENT_KEY$5***REMOVED***`;
  const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5***REMOVED***`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5***REMOVED***${DATA_API_KEY$2***REMOVED***`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5***REMOVED***`;
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();

      this._addEventListeners();
***REMOVED*** // Getters


    static get NAME() {
      return NAME$5;
***REMOVED***

    static get Default() {
      return Default$4;
***REMOVED*** // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
***REMOVED***

    show(relatedTarget) {
      if (this._isShown) {
        return;
  ***REMOVED***

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
        relatedTarget
  ***REMOVED***);

      if (showEvent.defaultPrevented) {
        return;
  ***REMOVED***

      this._isShown = true;
      this._element.style.visibility = 'visible';

      this._backdrop.show();

      if (!this._config.scroll) {
        new ScrollBarHelper().hide();
  ***REMOVED***

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.classList.add(CLASS_NAME_SHOW$3);

      const completeCallBack = () => {
        if (!this._config.scroll) {
          this._focustrap.activate();
    ***REMOVED***

        EventHandler.trigger(this._element, EVENT_SHOWN$2, {
          relatedTarget
    ***REMOVED***);
  ***REMOVED***;

      this._queueCallback(completeCallBack, this._element, true);
***REMOVED***

    hide() {
      if (!this._isShown) {
        return;
  ***REMOVED***

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);

      if (hideEvent.defaultPrevented) {
        return;
  ***REMOVED***

      this._focustrap.deactivate();

      this._element.blur();

      this._isShown = false;

      this._element.classList.remove(CLASS_NAME_SHOW$3);

      this._backdrop.hide();

      const completeCallback = () => {
        this._element.setAttribute('aria-hidden', true);

        this._element.removeAttribute('aria-modal');

        this._element.removeAttribute('role');

        this._element.style.visibility = 'hidden';

        if (!this._config.scroll) {
          new ScrollBarHelper().reset();
    ***REMOVED***

        EventHandler.trigger(this._element, EVENT_HIDDEN$2);
  ***REMOVED***;

      this._queueCallback(completeCallback, this._element, true);
***REMOVED***

    dispose() {
      this._backdrop.dispose();

      this._focustrap.deactivate();

      super.dispose();
***REMOVED*** // Private


    _getConfig(config) {
      config = { ...Default$4,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {***REMOVED***)
  ***REMOVED***;
      typeCheckConfig(NAME$5, config, DefaultType$4);
      return config;
***REMOVED***

    _initializeBackDrop() {
      return new Backdrop({
        className: CLASS_NAME_BACKDROP,
        isVisible: this._config.backdrop,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: () => this.hide()
  ***REMOVED***);
***REMOVED***

    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
  ***REMOVED***);
***REMOVED***

    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          this.hide();
    ***REMOVED***
  ***REMOVED***);
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Offcanvas.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
    ***REMOVED***

        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config***REMOVED***"`);
    ***REMOVED***

        data[config](this);
  ***REMOVED***);
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
***REMOVED***

    if (isDisabled(this)) {
      return;
***REMOVED***

    EventHandler.one(target, EVENT_HIDDEN$2, () => {
      // focus on trigger when it is closed
      if (isVisible(this)) {
        this.focus();
  ***REMOVED***
***REMOVED***); // avoid conflict when clicking a toggler of an offcanvas, while another is open

    const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

    if (allReadyOpen && allReadyOpen !== target) {
      Offcanvas.getInstance(allReadyOpen).hide();
***REMOVED***

    const data = Offcanvas.getOrCreateInstance(target);
    data.toggle(this);
  ***REMOVED***);
  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => SelectorEngine.find(OPEN_SELECTOR).forEach(el => Offcanvas.getOrCreateInstance(el).show()));
  enableDismissTrigger(Offcanvas);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  defineJQueryPlugin(Offcanvas);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const uriAttrs = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  const allowedAttribute = (attr, allowedAttributeList) => {
    const attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.includes(attrName)) {
      if (uriAttrs.has(attrName)) {
        return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue));
  ***REMOVED***

      return true;
***REMOVED***

    const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp); // Check if a regular expression validates the attribute.

    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attrName)) {
        return true;
  ***REMOVED***
***REMOVED***

    return false;
  ***REMOVED***;

  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  ***REMOVED***;
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
***REMOVED***

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
***REMOVED***

    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const allowlistKeys = Object.keys(allowList);
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i];
      const elName = el.nodeName.toLowerCase();

      if (!allowlistKeys.includes(elName)) {
        el.remove();
        continue;
  ***REMOVED***

      const attributeList = [].concat(...el.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elName] || []);
      attributeList.forEach(attr => {
        if (!allowedAttribute(attr, allowedAttributes)) {
          el.removeAttribute(attr.nodeName);
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

    return createdDocument.body.innerHTML;
  ***REMOVED***

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$4 = 'tooltip';
  const DATA_KEY$4 = 'bs.tooltip';
  const EVENT_KEY$4 = `.${DATA_KEY$4***REMOVED***`;
  const CLASS_PREFIX$1 = 'bs-tooltip';
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const DefaultType$3 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(array|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacements: 'array',
    boundary: '(string|element)',
    customClass: '(string|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    allowList: 'object',
    popperConfig: '(null|object|function)'
  ***REMOVED***;
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  ***REMOVED***;
  const Default$3 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: [0, 0],
    container: false,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    boundary: 'clippingParents',
    customClass: '',
    sanitize: true,
    sanitizeFn: null,
    allowList: DefaultAllowlist,
    popperConfig: null
  ***REMOVED***;
  const Event$2 = {
    HIDE: `hide${EVENT_KEY$4***REMOVED***`,
    HIDDEN: `hidden${EVENT_KEY$4***REMOVED***`,
    SHOW: `show${EVENT_KEY$4***REMOVED***`,
    SHOWN: `shown${EVENT_KEY$4***REMOVED***`,
    INSERTED: `inserted${EVENT_KEY$4***REMOVED***`,
    CLICK: `click${EVENT_KEY$4***REMOVED***`,
    FOCUSIN: `focusin${EVENT_KEY$4***REMOVED***`,
    FOCUSOUT: `focusout${EVENT_KEY$4***REMOVED***`,
    MOUSEENTER: `mouseenter${EVENT_KEY$4***REMOVED***`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$4***REMOVED***`
  ***REMOVED***;
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW$2 = 'show';
  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL***REMOVED***`;
  const EVENT_MODAL_HIDE = 'hide.bs.modal';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
  ***REMOVED***

      super(element); // private

      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {***REMOVED***;
      this._popper = null; // Protected

      this._config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
***REMOVED*** // Getters


    static get Default() {
      return Default$3;
***REMOVED***

    static get NAME() {
      return NAME$4;
***REMOVED***

    static get Event() {
      return Event$2;
***REMOVED***

    static get DefaultType() {
      return DefaultType$3;
***REMOVED*** // Public


    enable() {
      this._isEnabled = true;
***REMOVED***

    disable() {
      this._isEnabled = false;
***REMOVED***

    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
***REMOVED***

    toggle(event) {
      if (!this._isEnabled) {
        return;
  ***REMOVED***

      if (event) {
        const context = this._initializeOnDelegatedTarget(event);

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
    ***REMOVED*** else {
          context._leave(null, context);
    ***REMOVED***
  ***REMOVED*** else {
        if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$2)) {
          this._leave(null, this);

          return;
    ***REMOVED***

        this._enter(null, this);
  ***REMOVED***
***REMOVED***

    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

      if (this.tip) {
        this.tip.remove();
  ***REMOVED***

      if (this._popper) {
        this._popper.destroy();
  ***REMOVED***

      super.dispose();
***REMOVED***

    show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
  ***REMOVED***

      if (!(this.isWithContent() && this._isEnabled)) {
        return;
  ***REMOVED***

      const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
  ***REMOVED***

      const tip = this.getTipElement();
      const tipId = getUID(this.constructor.NAME);
      tip.setAttribute('id', tipId);

      this._element.setAttribute('aria-describedby', tipId);

      if (this._config.animation) {
        tip.classList.add(CLASS_NAME_FADE$2);
  ***REMOVED***

      const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

      const attachment = this._getAttachment(placement);

      this._addAttachmentClass(attachment);

      const {
        container
  ***REMOVED*** = this._config;
      Data.set(tip, this.constructor.DATA_KEY, this);

      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.append(tip);
        EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
  ***REMOVED***

      if (this._popper) {
        this._popper.update();
  ***REMOVED*** else {
        this._popper = Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
  ***REMOVED***

      tip.classList.add(CLASS_NAME_SHOW$2);

      const customClass = this._resolvePossibleFunction(this._config.customClass);

      if (customClass) {
        tip.classList.add(...customClass.split(' '));
  ***REMOVED*** // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => {
          EventHandler.on(element, 'mouseover', noop);
    ***REMOVED***);
  ***REMOVED***

      const complete = () => {
        const prevHoverState = this._hoverState;
        this._hoverState = null;
        EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this);
    ***REMOVED***
  ***REMOVED***;

      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

      this._queueCallback(complete, this.tip, isAnimated);
***REMOVED***

    hide() {
      if (!this._popper) {
        return;
  ***REMOVED***

      const tip = this.getTipElement();

      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
    ***REMOVED***

        if (this._hoverState !== HOVER_STATE_SHOW) {
          tip.remove();
    ***REMOVED***

        this._cleanTipClass();

        this._element.removeAttribute('aria-describedby');

        EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);

        if (this._popper) {
          this._popper.destroy();

          this._popper = null;
    ***REMOVED***
  ***REMOVED***;

      const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);

      if (hideEvent.defaultPrevented) {
        return;
  ***REMOVED***

      tip.classList.remove(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
  ***REMOVED***

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

      this._queueCallback(complete, this.tip, isAnimated);

      this._hoverState = '';
***REMOVED***

    update() {
      if (this._popper !== null) {
        this._popper.update();
  ***REMOVED***
***REMOVED*** // Protected


    isWithContent() {
      return Boolean(this.getTitle());
***REMOVED***

    getTipElement() {
      if (this.tip) {
        return this.tip;
  ***REMOVED***

      const element = document.createElement('div');
      element.innerHTML = this._config.template;
      const tip = element.children[0];
      this.setContent(tip);
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
      this.tip = tip;
      return this.tip;
***REMOVED***

    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
***REMOVED***

    _sanitizeAndSetContent(template, content, selector) {
      const templateElement = SelectorEngine.findOne(selector, template);

      if (!content && templateElement) {
        templateElement.remove();
        return;
  ***REMOVED*** // we use append for html objects to maintain js events


      this.setElementContent(templateElement, content);
***REMOVED***

    setElementContent(element, content) {
      if (element === null) {
        return;
  ***REMOVED***

      if (isElement(content)) {
        content = getElement(content); // content is a DOM node or a jQuery

        if (this._config.html) {
          if (content.parentNode !== element) {
            element.innerHTML = '';
            element.append(content);
      ***REMOVED***
    ***REMOVED*** else {
          element.textContent = content.textContent;
    ***REMOVED***

        return;
  ***REMOVED***

      if (this._config.html) {
        if (this._config.sanitize) {
          content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
    ***REMOVED***

        element.innerHTML = content;
  ***REMOVED*** else {
        element.textContent = content;
  ***REMOVED***
***REMOVED***

    getTitle() {
      const title = this._element.getAttribute('data-bs-original-title') || this._config.title;

      return this._resolvePossibleFunction(title);
***REMOVED***

    updateAttachment(attachment) {
      if (attachment === 'right') {
        return 'end';
  ***REMOVED***

      if (attachment === 'left') {
        return 'start';
  ***REMOVED***

      return attachment;
***REMOVED*** // Private


    _initializeOnDelegatedTarget(event, context) {
      return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
***REMOVED***

    _getOffset() {
      const {
        offset
  ***REMOVED*** = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
  ***REMOVED***

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
  ***REMOVED***

      return offset;
***REMOVED***

    _resolvePossibleFunction(content) {
      return typeof content === 'function' ? content.call(this._element) : content;
***REMOVED***

    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
      ***REMOVED***
      ***REMOVED*** {
          name: 'offset',
          options: {
            offset: this._getOffset()
      ***REMOVED***
      ***REMOVED*** {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
      ***REMOVED***
      ***REMOVED*** {
          name: 'arrow',
          options: {
            element: `.${this.constructor.NAME***REMOVED***-arrow`
      ***REMOVED***
      ***REMOVED*** {
          name: 'onChange',
          enabled: true,
          phase: 'afterWrite',
          fn: data => this._handlePopperPlacementChange(data)
    ***REMOVED***],
        onFirstUpdate: data => {
          if (data.options.placement !== data.placement) {
            this._handlePopperPlacementChange(data);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;
      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
  ***REMOVED***;
***REMOVED***

    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${this._getBasicClassPrefix()***REMOVED***-${this.updateAttachment(attachment)***REMOVED***`);
***REMOVED***

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
***REMOVED***

    _setListeners() {
      const triggers = this._config.trigger.split(' ');

      triggers.forEach(trigger => {
        if (trigger === 'click') {
          EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
    ***REMOVED*** else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
          EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
    ***REMOVED***
  ***REMOVED***);

      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
    ***REMOVED***
  ***REMOVED***;

      EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

      if (this._config.selector) {
        this._config = { ...this._config,
          trigger: 'manual',
          selector: ''
    ***REMOVED***;
  ***REMOVED*** else {
        this._fixTitle();
  ***REMOVED***
***REMOVED***

    _fixTitle() {
      const title = this._element.getAttribute('title');

      const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

      if (title || originalTitleType !== 'string') {
        this._element.setAttribute('data-bs-original-title', title || '');

        if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
          this._element.setAttribute('aria-label', title);
    ***REMOVED***

        this._element.setAttribute('title', '');
  ***REMOVED***
***REMOVED***

    _enter(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
  ***REMOVED***

      if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
  ***REMOVED***

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      if (!context._config.delay || !context._config.delay.show) {
        context.show();
        return;
  ***REMOVED***

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
    ***REMOVED***
    ***REMOVED*** context._config.delay.show);
***REMOVED***

    _leave(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
  ***REMOVED***

      if (context._isWithActiveTrigger()) {
        return;
  ***REMOVED***

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;

      if (!context._config.delay || !context._config.delay.hide) {
        context.hide();
        return;
  ***REMOVED***

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
    ***REMOVED***
    ***REMOVED*** context._config.delay.hide);
***REMOVED***

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
    ***REMOVED***
  ***REMOVED***

      return false;
***REMOVED***

    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      Object.keys(dataAttributes).forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
          delete dataAttributes[dataAttr];
    ***REMOVED***
  ***REMOVED***);
      config = { ...this.constructor.Default,
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {***REMOVED***)
  ***REMOVED***;
      config.container = config.container === false ? document.body : getElement(config.container);

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
    ***REMOVED***;
  ***REMOVED***

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
  ***REMOVED***

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
  ***REMOVED***

      typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
  ***REMOVED***

      return config;
***REMOVED***

    _getDelegateConfig() {
      const config = {***REMOVED***;

      for (const key in this._config) {
        if (this.constructor.Default[key] !== this._config[key]) {
          config[key] = this._config[key];
    ***REMOVED***
  ***REMOVED*** // In the future can be replaced with:
      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
      // `Object.fromEntries(keysWithDifferentValues)`


      return config;
***REMOVED***

    _cleanTipClass() {
      const tip = this.getTipElement();
      const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()***REMOVED***\\S+`, 'g');
      const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
  ***REMOVED***
***REMOVED***

    _getBasicClassPrefix() {
      return CLASS_PREFIX$1;
***REMOVED***

    _handlePopperPlacementChange(popperData) {
      const {
        state
  ***REMOVED*** = popperData;

      if (!state) {
        return;
  ***REMOVED***

      this.tip = state.elements.popper;

      this._cleanTipClass();

      this._addAttachmentClass(this._getAttachment(state.placement));
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tooltip.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config***REMOVED***"`);
      ***REMOVED***

          data[config]();
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tooltip to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$3 = 'popover';
  const DATA_KEY$3 = 'bs.popover';
  const EVENT_KEY$3 = `.${DATA_KEY$3***REMOVED***`;
  const CLASS_PREFIX = 'bs-popover';
  const Default$2 = { ...Tooltip.Default,
    placement: 'right',
    offset: [0, 8],
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
  ***REMOVED***;
  const DefaultType$2 = { ...Tooltip.DefaultType,
    content: '(string|element|function)'
  ***REMOVED***;
  const Event$1 = {
    HIDE: `hide${EVENT_KEY$3***REMOVED***`,
    HIDDEN: `hidden${EVENT_KEY$3***REMOVED***`,
    SHOW: `show${EVENT_KEY$3***REMOVED***`,
    SHOWN: `shown${EVENT_KEY$3***REMOVED***`,
    INSERTED: `inserted${EVENT_KEY$3***REMOVED***`,
    CLICK: `click${EVENT_KEY$3***REMOVED***`,
    FOCUSIN: `focusin${EVENT_KEY$3***REMOVED***`,
    FOCUSOUT: `focusout${EVENT_KEY$3***REMOVED***`,
    MOUSEENTER: `mouseenter${EVENT_KEY$3***REMOVED***`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$3***REMOVED***`
  ***REMOVED***;
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$2;
***REMOVED***

    static get NAME() {
      return NAME$3;
***REMOVED***

    static get Event() {
      return Event$1;
***REMOVED***

    static get DefaultType() {
      return DefaultType$2;
***REMOVED*** // Overrides


    isWithContent() {
      return this.getTitle() || this._getContent();
***REMOVED***

    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);

      this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
***REMOVED*** // Private


    _getContent() {
      return this._resolvePossibleFunction(this._config.content);
***REMOVED***

    _getBasicClassPrefix() {
      return CLASS_PREFIX;
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Popover.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config***REMOVED***"`);
      ***REMOVED***

          data[config]();
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Popover to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Popover);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$2 = 'scrollspy';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2***REMOVED***`;
  const DATA_API_KEY$1 = '.data-api';
  const Default$1 = {
    offset: 10,
    method: 'auto',
    target: ''
  ***REMOVED***;
  const DefaultType$1 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  ***REMOVED***;
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2***REMOVED***`;
  const EVENT_SCROLL = `scroll${EVENT_KEY$2***REMOVED***`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2***REMOVED***${DATA_API_KEY$1***REMOVED***`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS***REMOVED***, ${SELECTOR_LIST_ITEMS***REMOVED***, .${CLASS_NAME_DROPDOWN_ITEM***REMOVED***`;
  const SELECTOR_DROPDOWN$1 = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
      this._config = this._getConfig(config);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
      this.refresh();

      this._process();
***REMOVED*** // Getters


    static get Default() {
      return Default$1;
***REMOVED***

    static get NAME() {
      return NAME$2;
***REMOVED*** // Public


    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      const targets = SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target);
      targets.map(element => {
        const targetSelector = getSelectorFromElement(element);
        const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;

        if (target) {
          const targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
      ***REMOVED***
    ***REMOVED***

        return null;
  ***REMOVED***).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
        this._offsets.push(item[0]);

        this._targets.push(item[1]);
  ***REMOVED***);
***REMOVED***

    dispose() {
      EventHandler.off(this._scrollElement, EVENT_KEY$2);
      super.dispose();
***REMOVED*** // Private


    _getConfig(config) {
      config = { ...Default$1,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {***REMOVED***)
  ***REMOVED***;
      config.target = getElement(config.target) || document.documentElement;
      typeCheckConfig(NAME$2, config, DefaultType$1);
      return config;
***REMOVED***

    _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
***REMOVED***

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
***REMOVED***

    _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
***REMOVED***

    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;

      const scrollHeight = this._getScrollHeight();

      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
  ***REMOVED***

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
    ***REMOVED***

        return;
  ***REMOVED***

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
  ***REMOVED***

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    _activate(target) {
      this._activeTarget = target;

      this._clear();

      const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector***REMOVED***[data-bs-target="${target***REMOVED***"],${selector***REMOVED***[href="${target***REMOVED***"]`);
      const link = SelectorEngine.findOne(queries.join(','), this._config.target);
      link.classList.add(CLASS_NAME_ACTIVE$1);

      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
  ***REMOVED*** else {
        SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS***REMOVED***, ${SELECTOR_LIST_ITEMS***REMOVED***`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
            SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***

      EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target
  ***REMOVED***);
***REMOVED***

    _clear() {
      SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = ScrollSpy.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
    ***REMOVED***

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config***REMOVED***"`);
    ***REMOVED***

        data[config]();
  ***REMOVED***);
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
  ***REMOVED***);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .ScrollSpy to jQuery only if jQuery is present
   */

  defineJQueryPlugin(ScrollSpy);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$1 = 'tab';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1***REMOVED***`;
  const DATA_API_KEY = '.data-api';
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1***REMOVED***`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1***REMOVED***`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1***REMOVED***`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1***REMOVED***`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1***REMOVED***${DATA_API_KEY***REMOVED***`;
  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = ':scope > li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$1;
***REMOVED*** // Public


    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
        return;
  ***REMOVED***

      let previous;
      const target = getElementFromSelector(this._element);

      const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = SelectorEngine.find(itemSelector, listElement);
        previous = previous[previous.length - 1];
  ***REMOVED***

      const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
        relatedTarget: this._element
  ***REMOVED***) : null;
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
        relatedTarget: previous
  ***REMOVED***);

      if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
        return;
  ***REMOVED***

      this._activate(this._element, listElement);

      const complete = () => {
        EventHandler.trigger(previous, EVENT_HIDDEN$1, {
          relatedTarget: this._element
    ***REMOVED***);
        EventHandler.trigger(this._element, EVENT_SHOWN$1, {
          relatedTarget: previous
    ***REMOVED***);
  ***REMOVED***;

      if (target) {
        this._activate(target, target.parentNode, complete);
  ***REMOVED*** else {
        complete();
  ***REMOVED***
***REMOVED*** // Private


    _activate(element, container, callback) {
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

      const complete = () => this._transitionComplete(element, active, callback);

      if (active && isTransitioning) {
        active.classList.remove(CLASS_NAME_SHOW$1);

        this._queueCallback(complete, element, true);
  ***REMOVED*** else {
        complete();
  ***REMOVED***
***REMOVED***

    _transitionComplete(element, active, callback) {
      if (active) {
        active.classList.remove(CLASS_NAME_ACTIVE);
        const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

        if (dropdownChild) {
          dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
    ***REMOVED***

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
    ***REMOVED***
  ***REMOVED***

      element.classList.add(CLASS_NAME_ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
  ***REMOVED***

      reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE$1)) {
        element.classList.add(CLASS_NAME_SHOW$1);
  ***REMOVED***

      let parent = element.parentNode;

      if (parent && parent.nodeName === 'LI') {
        parent = parent.parentNode;
  ***REMOVED***

      if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = element.closest(SELECTOR_DROPDOWN);

        if (dropdownElement) {
          SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
    ***REMOVED***

        element.setAttribute('aria-expanded', true);
  ***REMOVED***

      if (callback) {
        callback();
  ***REMOVED***
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tab.getOrCreateInstance(this);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config***REMOVED***"`);
      ***REMOVED***

          data[config]();
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

  ***REMOVED***
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
***REMOVED***

    if (isDisabled(this)) {
      return;
***REMOVED***

    const data = Tab.getOrCreateInstance(this);
    data.show();
  ***REMOVED***);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tab to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Tab);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'toast';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY***REMOVED***`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY***REMOVED***`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY***REMOVED***`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY***REMOVED***`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY***REMOVED***`;
  const EVENT_HIDE = `hide${EVENT_KEY***REMOVED***`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY***REMOVED***`;
  const EVENT_SHOW = `show${EVENT_KEY***REMOVED***`;
  const EVENT_SHOWN = `shown${EVENT_KEY***REMOVED***`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  ***REMOVED***;
  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  ***REMOVED***;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;

      this._setListeners();
***REMOVED*** // Getters


    static get DefaultType() {
      return DefaultType;
***REMOVED***

    static get Default() {
      return Default;
***REMOVED***

    static get NAME() {
      return NAME;
***REMOVED*** // Public


    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

      if (showEvent.defaultPrevented) {
        return;
  ***REMOVED***

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
  ***REMOVED***

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);

        EventHandler.trigger(this._element, EVENT_SHOWN);

        this._maybeScheduleHide();
  ***REMOVED***;

      this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated


      reflow(this._element);

      this._element.classList.add(CLASS_NAME_SHOW);

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
***REMOVED***

    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
  ***REMOVED***

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

      if (hideEvent.defaultPrevented) {
        return;
  ***REMOVED***

      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE); // @deprecated


        this._element.classList.remove(CLASS_NAME_SHOWING);

        this._element.classList.remove(CLASS_NAME_SHOW);

        EventHandler.trigger(this._element, EVENT_HIDDEN);
  ***REMOVED***;

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
***REMOVED***

    dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
  ***REMOVED***

      super.dispose();
***REMOVED*** // Private


    _getConfig(config) {
      config = { ...Default,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {***REMOVED***)
  ***REMOVED***;
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
***REMOVED***

    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
  ***REMOVED***

      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
  ***REMOVED***

      this._timeout = setTimeout(() => {
        this.hide();
    ***REMOVED*** this._config.delay);
***REMOVED***

    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          this._hasMouseInteraction = isInteracting;
          break;

        case 'focusin':
        case 'focusout':
          this._hasKeyboardInteraction = isInteracting;
          break;
  ***REMOVED***

      if (isInteracting) {
        this._clearTimeout();

        return;
  ***REMOVED***

      const nextElement = event.relatedTarget;

      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
  ***REMOVED***

      this._maybeScheduleHide();
***REMOVED***

    _setListeners() {
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
***REMOVED***

    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
***REMOVED*** // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Toast.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config***REMOVED***"`);
      ***REMOVED***

          data[config](this);
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

  ***REMOVED***

  enableDismissTrigger(Toast);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Toast to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Toast);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): index.umd.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  var index_umd = {
    Alert,
    Button,
    Carousel,
    Collapse,
    Dropdown,
    Modal,
    Offcanvas,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Tooltip
  ***REMOVED***;

  return index_umd;

***REMOVED***)));
//# sourceMappingURL=bootstrap.js.map

