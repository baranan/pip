define(['utils/timeout'],function(timeout){
	
	/*
	 * timeout listenter
	 * 
	 * requires definitions.duration, otherwise fires immediately
	 */
	
	return function(listener, definitions){
		
		// all this has to happen in a closure so that the different timers don't overide one anather
		var Timeout = new function(){
			
			var duration = definitions.duration || 0;
			var timerID;

			this.on = function(callback){
				timerID = timeout(duration,function(){
					callback({},'timeout');
				});
			}
			
			this.off = function(){
				clearTimeout(timerID);
			}
		}
		
		listener.on = Timeout.on;
		listener.off = Timeout.off;		
	}
});