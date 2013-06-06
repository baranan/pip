define(['jquery','utils/is_touch'],function($,is_touch_device){

	/*
	 * takes care of click events
	 * 
	 * accepts a listener object to decorate and definitions
	 * 
	 * the function accepts either 
	 * 		a class to which to bind the event (definitions.stimClass)
	 * 		or an element to add to the canvas definitions.element (optionaly a jquery css object may be added: definitions.css) 
	 *	
	 * -- if we want to attach the event to an existing element
	 * definitions = {
	 * 		stimClass: 'firstStim'
	 * }
	 * 
	 * -- if we want to create a interface specific element
	 * definitions = {
	 * 		element: $('<div>'),
	 * 		css: {background:red; 'font-size': 2em'}   // optional
	 * }
	 */
	
	return function(listener,definitions){
		var eventName = is_touch_device ? 'touchstart' : 'mousedown';
		
		var interfaceElement = definitions.stimClass ? false : true; // does this click refer to an existing element 
		var $element = $(definitions.element); // @todo: may be overwritten for multiple elements. rewrite as closure.
		
		listener.on = function(callback){
			var activateCallback = function(e){ callback(e,eventName); }		
				
			if (interfaceElement){
				// the element to attach				
				$element
					.css(definitions.css || {})
					.appendTo('#canvas')							// @todo, not great form, we should probably have a variable pointing there... 
					.on(eventName+'.interface',activateCallback);
				
			}						
					
			else $(document).on(eventName + '.interface','.'+definitions.stimClass, activateCallback);
		}
		
		listener.off = function(){
			if (interfaceElement) $element.remove(); 								// this also removes the events
			else $(document).off(eventName + '.interface','.'+definitions.stimClass);
		}
		
	}
});