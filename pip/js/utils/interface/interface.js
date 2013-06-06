define(['jquery','./listener', '../is_touch'],function($,Listener,is_touch_device){
	
	/*
	 * adds and removes listeners from the stack
	 * 
	 * function add(definitions): add listener, see ./binder.js for more details and options 
	 * 
	 * definitions = {
	 * 		handle: 'listener name',
	 * 		on: listener type (click, keypressed, various shortcuts)
	 * }
	 * 
	 */
	
	var listenerStack = []; // holds all active listeners
	
	return {		
		// add listeners
		add: function(definitions){
			// make sure definitions is set as an array
			var definitionsArr = $.isArray(definitions) ? definitions : [definitions];
			
			// for each definitions object create a listener
			$.each(definitionsArr,function(key,definition){
				// if this listener is targeted specificaly at a touch\!touch device 
				if (typeof definition.touch != 'undefined') {
					// if needed, skip this listener 
					if (is_touch_device && !definition.touch) return true;
					if (!is_touch_device && definition.touch) return true;
				}			
					
				var listener = new Listener(definition);				 
				listenerStack.push(listener);			
			});
					
		},
		
		// remove listeners
		remove: function(handleList){
			 handleList = $.isArray(handleList ) ? handleList  : [handleList ];			
			
			// go through the listener stack and remove any listeners that fit the handle list
			// note that we do this in reverse so that the index does not change			
			for (var i = listenerStack.length - 1; i >= 0 ; i--){
				var listener = listenerStack[i];
								
				if ($.inArray(listener.handle, handleList) != -1){					
					listener.off();
					listenerStack.splice(i,1);
				}
			} 
			
		},
		
		// remove all listeners
		destroy: function(){
			
			// destroy each listener
			for (var i in listenerStack){
				listenerStack[i].destroy();
			}
			// empty stack
			listenerStack = [];			
		}
	}
});