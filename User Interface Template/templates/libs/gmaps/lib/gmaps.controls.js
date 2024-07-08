GMaps.prototype.createControl = function(options) {
  var control = document.createElement('div');

  control.style.cursor = 'pointer';

  if (options.disableDefaultStyles !== true) {
    control.style.fontFamily = 'Roboto, Arial, sans-serif';
    control.style.fontSize = '11px';
    control.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
  ***REMOVED***

  for (var option in options.style) {
    control.style[option] = options.style[option];
  ***REMOVED***

  if (options.id) {
    control.id = options.id;
  ***REMOVED***

  if (options.title) {
    control.title = options.title;
  ***REMOVED***

  if (options.classes) {
    control.className = options.classes;
  ***REMOVED***

  if (options.content) {
    if (typeof options.content === 'string') {
      control.innerHTML = options.content;
***REMOVED***
    else if (options.content instanceof HTMLElement) {
      control.appendChild(options.content);
***REMOVED***
  ***REMOVED***

  if (options.position) {
    control.position = google.maps.ControlPosition[options.position.toUpperCase()];
  ***REMOVED***

  for (var ev in options.events) {
    (function(object, name) {
      google.maps.event.addDomListener(object, name, function(){
        options.events[name].apply(this, [this]);
  ***REMOVED***);
***REMOVED***)(control, ev);
  ***REMOVED***

  control.index = 1;

  return control;
***REMOVED***;

/**
 * Add a custom control to the map UI.
 *
 * @param {object***REMOVED*** options - The `options` object should contain:
 * * `style` (object): The keys and values of this object should be valid CSS properties and values.
 * * `id` (string): The HTML id for the custom control.
 * * `classes` (string): A string containing all the HTML classes for the custom control.
 * * `content` (string or HTML element): The content of the custom control.
 * * `position` (string): Any valid [`google.maps.ControlPosition`](https://developers.google.com/maps/documentation/javascript/controls#ControlPositioning) value, in lower or upper case.
 * * `events` (object): The keys of this object should be valid DOM events. The values should be functions.
 * * `disableDefaultStyles` (boolean): If false, removes the default styles for the controls like font (family and size), and box shadow.
 * @returns {HTMLElement***REMOVED***
 */
GMaps.prototype.addControl = function(options) {
  var control = this.createControl(options);

  this.controls.push(control);
  this.map.controls[control.position].push(control);

  return control;
***REMOVED***;

/**
 * Remove a control from the map. `control` should be a control returned by `addControl()`.
 *
 * @param {HTMLElement***REMOVED*** control - One of the controls returned by `addControl()`.
 * @returns {HTMLElement***REMOVED*** the removed control.
 */
GMaps.prototype.removeControl = function(control) {
  var position = null,
      i;

  for (i = 0; i < this.controls.length; i++) {
    if (this.controls[i] == control) {
      position = this.controls[i].position;
      this.controls.splice(i, 1);
***REMOVED***
  ***REMOVED***

  if (position) {
    for (i = 0; i < this.map.controls.length; i++) {
      var controlsForPosition = this.map.controls[control.position];

      if (controlsForPosition.getAt(i) == control) {
        controlsForPosition.removeAt(i);

        break;
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  return control;
***REMOVED***;
