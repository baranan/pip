/*
 * media preloader
 */
define(['jquery'], function(){
	var srcStack = [] 				// an array holding all our sources
	var defStack = []				// an array holding all the deferreds
	var stackDone = 0; 				// the number of sources we have completed downloading
	var allDone = $.Deferred();		// General deferred, notifies upon source completion	
	
	// load a single source
	var load = function(src, type){		
		type = type || 'image';				
		// if we haven't loaded this yet
		if ($.inArray(src, srcStack) == -1) {
			var deferred = $.Deferred();
			
			
			switch (type) {
				case 'template':									
					try {
						require(['text!' + src], function(template){							
							deferred.resolve();
						});	
					} catch(err) {
						deferred.reject();
					}					
					break;
				case 'image':
				default :
					var img = new Image();	// create img object
					$(img).on('load',function(){deferred.resolve()}) // resolve deferred on load
					$(img).on('error',function(){deferred.reject()}) // reject deferred on error
					img.src = src;										
					break;
			}
			
			// keep defered and source for later.
			defStack.push(deferred);
			srcStack.push(src);
			
			// count this defered as done
			deferred
				.done(function(){
					// increment the completed counter
					stackDone++;							
					// notify allDone that we advanced another step
					allDone.notify(stackDone,defStack.length);
				});
			
			
		}
		
		
		
		return deferred || false;
	}	
	
	return {
		// loads a single source
		add: load,		
		
		activate: function(){
			// fail or reject allDone according to our defStack
			$.when.apply($,defStack)
				.done(function(){allDone.resolve()})
				.fail(function(){allDone.reject()});
				
			return allDone.promise();
		},
		
		// reset globals so we can reuse this object
		reset: function(){
			srcStack = [];
			defStack = [];
			stackDone = 0;
			allDone = $.Deferred();
		}
	};
	
});
