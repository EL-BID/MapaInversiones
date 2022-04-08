/**
 * Flickity fade v1.0.0
 * Fade between Flickity slides
 */

/* jshint browser: true, undef: true, unused: true */

( function( window, factory ) {
    // universal module definition
    /*globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( [
        'flickity/js/index',
        'fizzy-ui-utils/utils',
      ], factory );
***REMOVED*** else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory(
        require('flickity'),
        require('fizzy-ui-utils')
      );
***REMOVED*** else {
      // browser global
      factory(
        window.Flickity,
        window.fizzyUIUtils
      );
***REMOVED***
  
  ***REMOVED***( this, function factory( Flickity, utils ) {
  
  // ---- Slide ---- //
  
  var Slide = Flickity.Slide;
  
  var slideUpdateTarget = Slide.prototype.updateTarget;
  Slide.prototype.updateTarget = function() {
    slideUpdateTarget.apply( this, arguments );
    if ( !this.parent.options.fade ) {
      return;
***REMOVED***
    // position cells at selected target
    var slideTargetX = this.target - this.x;
    var firstCellX = this.cells[0].x;
    this.cells.forEach( function( cell ) {
      var targetX = cell.x - firstCellX - slideTargetX;
      cell.renderPosition( targetX );
***REMOVED***);
  ***REMOVED***;
  
  Slide.prototype.setOpacity = function( alpha ) {
    this.cells.forEach( function( cell ) {
      cell.element.style.opacity = alpha;
***REMOVED***);
  ***REMOVED***;
  
  // ---- Flickity ---- //
  
  var proto = Flickity.prototype;
  
  Flickity.createMethods.push('_createFade');
  
  proto._createFade = function() {
    this.fadeIndex = this.selectedIndex;
    this.prevSelectedIndex = this.selectedIndex;
    this.on( 'select', this.onSelectFade );
    this.on( 'dragEnd', this.onDragEndFade );
    this.on( 'settle', this.onSettleFade );
    this.on( 'activate', this.onActivateFade );
    this.on( 'deactivate', this.onDeactivateFade );
  ***REMOVED***;
  
  var updateSlides = proto.updateSlides;
  proto.updateSlides = function() {
    updateSlides.apply( this, arguments );
    if ( !this.options.fade ) {
      return;
***REMOVED***
    // set initial opacity
    this.slides.forEach( function( slide, i ) {
      var alpha = i == this.selectedIndex ? 1 : 0;
      slide.setOpacity( alpha );
  ***REMOVED*** this );
  ***REMOVED***;
  
  /* ---- events ---- */
  
  proto.onSelectFade = function() {
    // in case of resize, keep fadeIndex within current count
    this.fadeIndex = Math.min( this.prevSelectedIndex, this.slides.length - 1 );
    this.prevSelectedIndex = this.selectedIndex;
  ***REMOVED***;
  
  proto.onSettleFade = function() {
    delete this.didDragEnd;
    if ( !this.options.fade ) {
      return;
***REMOVED***
    // set full and 0 opacity on selected & faded slides
    this.selectedSlide.setOpacity( 1 );
    var fadedSlide = this.slides[ this.fadeIndex ];
    if ( fadedSlide && this.fadeIndex != this.selectedIndex ) {
      this.slides[ this.fadeIndex ].setOpacity( 0 );
***REMOVED***
  ***REMOVED***;
  
  proto.onDragEndFade = function() {
    // set flag
    this.didDragEnd = true;
  ***REMOVED***;
  
  proto.onActivateFade = function() {
    if ( this.options.fade ) {
      this.element.classList.add('is-fade');
***REMOVED***
  ***REMOVED***;
  
  proto.onDeactivateFade = function() {
    if ( !this.options.fade ) {
      return;
***REMOVED***
    this.element.classList.remove('is-fade');
    // reset opacity
    this.slides.forEach( function( slide ) {
      slide.setOpacity('');
***REMOVED***);
  ***REMOVED***;
  
  /* ---- position & fading ---- */
  
  var positionSlider = proto.positionSlider;
  proto.positionSlider = function() {
    if ( !this.options.fade ) {
      positionSlider.apply( this, arguments );
      return;
***REMOVED***
  
    this.fadeSlides();
    this.dispatchScrollEvent();
  ***REMOVED***;
  
  var positionSliderAtSelected = proto.positionSliderAtSelected;
  proto.positionSliderAtSelected = function() {
    if ( this.options.fade ) {
      // position fade slider at origin
      this.setTranslateX( 0 );
***REMOVED***
    positionSliderAtSelected.apply( this, arguments );
  ***REMOVED***;
  
  proto.fadeSlides = function() {
    if ( this.slides.length < 2 ) {
      return;
***REMOVED***
    // get slides to fade-in & fade-out
    var indexes = this.getFadeIndexes();
    var fadeSlideA = this.slides[ indexes.a ];
    var fadeSlideB = this.slides[ indexes.b ];
    var distance = this.wrapDifference( fadeSlideA.target, fadeSlideB.target );
    var progress = this.wrapDifference( fadeSlideA.target, -this.x );
    progress = progress / distance;
  
    fadeSlideA.setOpacity( 1 - progress );
    fadeSlideB.setOpacity( progress );
  
    // hide previous slide
    var fadeHideIndex = indexes.a;
    if ( this.isDragging ) {
      fadeHideIndex = progress > 0.5 ? indexes.a : indexes.b;
***REMOVED***
    var isNewHideIndex = this.fadeHideIndex != undefined &&
      this.fadeHideIndex != fadeHideIndex &&
      this.fadeHideIndex != indexes.a &&
      this.fadeHideIndex != indexes.b;
    if ( isNewHideIndex ) {
      // new fadeHideSlide set, hide previous
      this.slides[ this.fadeHideIndex ].setOpacity( 0 );
***REMOVED***
    this.fadeHideIndex = fadeHideIndex;
  ***REMOVED***;
  
  proto.getFadeIndexes = function() {
    if ( !this.isDragging && !this.didDragEnd ) {
      return {
        a: this.fadeIndex,
        b: this.selectedIndex,
  ***REMOVED***;
***REMOVED***
    if ( this.options.wrapAround ) {
      return this.getFadeDragWrapIndexes();
***REMOVED*** else {
      return this.getFadeDragLimitIndexes();
***REMOVED***
  ***REMOVED***;
  
  proto.getFadeDragWrapIndexes = function() {
    var distances = this.slides.map( function( slide, i ) {
      return this.getSlideDistance( -this.x, i );
  ***REMOVED*** this );
    var absDistances = distances.map( function( distance ) {
      return Math.abs( distance );
***REMOVED***);
    var minDistance = Math.min.apply( Math, absDistances );
    var closestIndex = absDistances.indexOf( minDistance );
    var distance = distances[ closestIndex ];
    var len = this.slides.length;
  
    var delta = distance >= 0 ? 1 : -1;
    return {
      a: closestIndex,
      b: utils.modulo( closestIndex + delta, len ),
***REMOVED***;
  ***REMOVED***;
  
  proto.getFadeDragLimitIndexes = function() {
    // calculate closest previous slide
    var dragIndex = 0;
    for ( var i=0; i < this.slides.length - 1; i++ ) {
      var slide = this.slides[i];
      if ( -this.x < slide.target ) {
        break;
  ***REMOVED***
      dragIndex = i;
***REMOVED***
    return {
      a: dragIndex,
      b: dragIndex + 1,
***REMOVED***;
  ***REMOVED***;
  
  proto.wrapDifference = function( a, b ) {
    var diff = b - a;
  
    if ( !this.options.wrapAround ) {
      return diff;
***REMOVED***
  
    var diffPlus = diff + this.slideableWidth;
    var diffMinus = diff - this.slideableWidth;
    if ( Math.abs( diffPlus ) < Math.abs( diff ) ) {
      diff = diffPlus;
***REMOVED***
    if ( Math.abs( diffMinus ) < Math.abs( diff ) ) {
      diff = diffMinus;
***REMOVED***
    return diff;
  ***REMOVED***;
  
  // ---- wrapAround ---- //
  
  var _getWrapShiftCells = proto._getWrapShiftCells;
  proto._getWrapShiftCells = function() {
    if ( !this.options.fade ) {
      _getWrapShiftCells.apply( this, arguments );
***REMOVED***
  ***REMOVED***;
  
  var shiftWrapCells = proto.shiftWrapCells;
  proto.shiftWrapCells = function() {
    if ( !this.options.fade ) {
      shiftWrapCells.apply( this, arguments );
***REMOVED***
  ***REMOVED***;
  
  return Flickity;
  
  ***REMOVED***));