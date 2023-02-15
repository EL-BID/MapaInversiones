ko.bindingHandlers.enterKey = {
    init: function(element, valueAccessor, allBindings, vm) {
        ko.utils.registerEventHandler(element, "keyup", function(event) {
            if (event.keyCode === 13) {
                ko.utils.triggerEvent(element, "change");
                valueAccessor().call(vm, vm); //set "this" to the data and also pass it as first arg, in case function has "this" bound
            }

            return true;
        });
    }         
};