/*
 * adjust canvas according to window size and settings
 * this module is built to be part of the main view
 */
define(['jquery','app/task/script', 'utils/screen_size','app/trial/current_trial'],function($, script, screen_size,trial){
	
		
	
	
	// the function to be used by the main view
	return function(){		
		var self = this;
		// get canvas settings
		var settings = script.settings.canvas || {};
		 
		// calculate proportions (as height/width)
		var proportions; 
		if (settings.proportions)
			proportions = $.isPlainObject(settings.proportions) 
			? settings.proportions.height/settings.proportions.width // if proportions are an object they should include width and height 
			: settings.proportions;
				
		// we put this in a time out because of a latency of orientation change on android devices  
		setTimeout(function(){
    		var height, width;
    		var screenSize = screen_size(); // get current screen size
    			
    		var maxHeight = screenSize.height;
    		var maxWidth = Math.min(settings.maxWidth, screenSize.width);
    		
    		// calculate the correct size for this screen size 
    		if (maxHeight > proportions * maxWidth) {
    			height = maxWidth*proportions;
    			width = maxWidth;
    		} else {
    			height = maxHeight;
    			width = maxHeight/proportions; 	    			
    		}
    		
    		// remove border width and top margin from calculated width (can't depend on cool box styles yet...)
    		// we compute only margin-top because of a difference calculating margins between chrome + IE and firefox + mobile
			height -= parseInt(self.$el.css('border-top-width'),10) + parseInt(self.$el.css('border-bottom-width'),10) + parseInt(self.$el.css('margin-top'),10)
    		width -= parseInt(self.$el.css('border-left-width'),10) + parseInt(self.$el.css('border-right-width'),10)
														
    		// reset canvas size	    		
    		self.$el.width(width);
    		self.$el.height(height);
    		
    		// refreash all stimuli (we don't want to do this before we have trials)
    		if (trial()) {
	    		trial()._layout_collection.refresh();
	    		trial()._stimulus_collection.refresh();    			
			}
    			    			    	
			// scroll to top of window (hides some of the mess on the top of mobile devices)
			window.scrollTo(0, 1);				
							    		
		},500); // end timeout
	}    		
	
});
