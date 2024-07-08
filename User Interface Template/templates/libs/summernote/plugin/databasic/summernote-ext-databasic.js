(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  ***REMOVED*** else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  ***REMOVED*** else {
    // Browser globals
    factory(window.jQuery);
  ***REMOVED***
***REMOVED***(function($) {
  // pull in some summernote core functions
  var ui = $.summernote.ui;
  var dom = $.summernote.dom;

  // define the popover plugin
  var DataBasicPlugin = function(context) {
    var self = this;
    var options = context.options;
    var lang = options.langInfo;

    self.icon = '<i class="fa fa-object-group"/>';

    // add context menu button for dialog
    context.memo('button.databasic', function() {
      return ui.button({
        contents: self.icon,
        tooltip: lang.databasic.insert,
        click: context.createInvokeHandler('databasic.showDialog'),
  ***REMOVED***).render();
***REMOVED***);

    // add popover edit button
    context.memo('button.databasicDialog', function() {
      return ui.button({
        contents: self.icon,
        tooltip: lang.databasic.edit,
        click: context.createInvokeHandler('databasic.showDialog'),
  ***REMOVED***).render();
***REMOVED***);

    //  add popover size buttons
    context.memo('button.databasicSize100', function() {
      return ui.button({
        contents: '<span class="note-fontsize-10">100%</span>',
        tooltip: lang.image.resizeFull,
        click: context.createInvokeHandler('editor.resize', '1'),
  ***REMOVED***).render();
***REMOVED***);
    context.memo('button.databasicSize50', function() {
      return ui.button({
        contents: '<span class="note-fontsize-10">50%</span>',
        tooltip: lang.image.resizeHalf,
        click: context.createInvokeHandler('editor.resize', '0.5'),
  ***REMOVED***).render();
***REMOVED***);
    context.memo('button.databasicSize25', function() {
      return ui.button({
        contents: '<span class="note-fontsize-10">25%</span>',
        tooltip: lang.image.resizeQuarter,
        click: context.createInvokeHandler('editor.resize', '0.25'),
  ***REMOVED***).render();
***REMOVED***);

    self.events = {
      'summernote.init': function(we, e) {
        // update existing containers
        $('data.ext-databasic', e.editable).each(function() { self.setContent($(this)); ***REMOVED***);
        // TODO: make this an undo snapshot...
    ***REMOVED***
      'summernote.keyup summernote.mouseup summernote.change summernote.scroll': function() {
        self.update();
    ***REMOVED***
      'summernote.dialog.shown': function() {
        self.hidePopover();
    ***REMOVED***
***REMOVED***;

    self.initialize = function() {
      // create dialog markup
      var $container = options.dialogsInBody ? $(document.body) : context.layoutInfo.editor;

      var body = '<div class="form-group row-fluid">' +
          '<label>' + lang.databasic.testLabel + '</label>' +
          '<input class="ext-databasic-test form-control" type="text" />' +
          '</div>';
      var footer = '<button href="#" class="btn btn-primary ext-databasic-save">' + lang.databasic.insert + '</button>';

      self.$dialog = ui.dialog({
        title: lang.databasic.name,
        fade: options.dialogsFade,
        body: body,
        footer: footer,
  ***REMOVED***).render().appendTo($container);

      // create popover
      self.$popover = ui.popover({
        className: 'ext-databasic-popover',
  ***REMOVED***).render().appendTo('body');
      var $content = self.$popover.find('.popover-content');

      context.invoke('buttons.build', $content, options.popover.databasic);
***REMOVED***;

    self.destroy = function() {
      self.$popover.remove();
      self.$popover = null;
      self.$dialog.remove();
      self.$dialog = null;
***REMOVED***;

    self.update = function() {
      // Prevent focusing on editable when invoke('code') is executed
      if (!context.invoke('editor.hasFocus')) {
        self.hidePopover();
        return;
  ***REMOVED***

      var rng = context.invoke('editor.createRange');
      var visible = false;

      if (rng.isOnData()) {
        var $data = $(rng.sc).closest('data.ext-databasic');

        if ($data.length) {
          var pos = dom.posFromPlaceholder($data[0]);

          self.$popover.css({
            display: 'block',
            left: pos.left,
            top: pos.top,
      ***REMOVED***);

          // save editor target to let size buttons resize the container
          context.invoke('editor.saveTarget', $data[0]);

          visible = true;
    ***REMOVED***
  ***REMOVED***

      // hide if not visible
      if (!visible) {
        self.hidePopover();
  ***REMOVED***
***REMOVED***;

    self.hidePopover = function() {
      self.$popover.hide();
***REMOVED***;

    // define plugin dialog
    self.getInfo = function() {
      var rng = context.invoke('editor.createRange');

      if (rng.isOnData()) {
        var $data = $(rng.sc).closest('data.ext-databasic');

        if ($data.length) {
          // Get the first node on range(for edit).
          return {
            node: $data,
            test: $data.attr('data-test'),
      ***REMOVED***;
    ***REMOVED***
  ***REMOVED***

      return {***REMOVED***;
***REMOVED***;

    self.setContent = function($node) {
      $node.html('<p contenteditable="false">' + self.icon + ' ' + lang.databasic.name + ': ' +
        $node.attr('data-test') + '</p>');
***REMOVED***;

    self.updateNode = function(info) {
      self.setContent(info.node
        .attr('data-test', info.test));
***REMOVED***;

    self.createNode = function(info) {
      var $node = $('<data class="ext-databasic"></data>');

      if ($node) {
        // save node to info structure
        info.node = $node;
        // insert node into editor dom
        context.invoke('editor.insertNode', $node[0]);
  ***REMOVED***

      return $node;
***REMOVED***;

    self.showDialog = function() {
      var info = self.getInfo();
      var newNode = !info.node;
      context.invoke('editor.saveRange');

      self
        .openDialog(info)
        .then(function(dialogInfo) {
          // [workaround] hide dialog before restore range for IE range focus
          ui.hideDialog(self.$dialog);
          context.invoke('editor.restoreRange');

          // insert a new node
          if (newNode) {
            self.createNode(info);
      ***REMOVED***

          // update info with dialog info
          $.extend(info, dialogInfo);

          self.updateNode(info);
    ***REMOVED***)
        .fail(function() {
          context.invoke('editor.restoreRange');
    ***REMOVED***);
***REMOVED***;

    self.openDialog = function(info) {
      return $.Deferred(function(deferred) {
        var $inpTest = self.$dialog.find('.ext-databasic-test');
        var $saveBtn = self.$dialog.find('.ext-databasic-save');
        var onKeyup = function(event) {
          if (event.keyCode === 13) {
            $saveBtn.trigger('click');
      ***REMOVED***
    ***REMOVED***;

        ui.onDialogShown(self.$dialog, function() {
          context.triggerEvent('dialog.shown');

          $inpTest.val(info.test).on('input', function() {
            ui.toggleBtn($saveBtn, $inpTest.val());
      ***REMOVED***).trigger('focus').on('keyup', onKeyup);

          $saveBtn
            .text(info.node ? lang.databasic.edit : lang.databasic.insert)
            .click(function(event) {
              event.preventDefault();

              deferred.resolve({ test: $inpTest.val() ***REMOVED***);
        ***REMOVED***);

          // init save button
          ui.toggleBtn($saveBtn, $inpTest.val());
    ***REMOVED***);

        ui.onDialogHidden(self.$dialog, function() {
          $inpTest.off('input keyup');
          $saveBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
      ***REMOVED***
    ***REMOVED***);

        ui.showDialog(self.$dialog);
  ***REMOVED***);
***REMOVED***;
  ***REMOVED***;

  // Extends summernote
  $.extend(true, $.summernote, {
    plugins: {
      databasic: DataBasicPlugin,
  ***REMOVED***

    options: {
      popover: {
        databasic: [
          ['databasic', ['databasicDialog', 'databasicSize100', 'databasicSize50', 'databasicSize25']],
        ],
    ***REMOVED***
  ***REMOVED***

    // add localization texts
    lang: {
      'en-US': {
        databasic: {
          name: 'Basic Data Container',
          insert: 'insert basic data container',
          edit: 'edit basic data container',
          testLabel: 'test input',
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

  ***REMOVED***);
***REMOVED***));
