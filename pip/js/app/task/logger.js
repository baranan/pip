/*
 * activate logger
 * 
 * note that we are loading modules into the global object here (json2) 
 */
define(['jquery','utils/pubsub','app/trial/current_trial','app/task/settings','libs/json2'],function($, pubsub,trial,settings){
	
	var logCount = 0;
	var logStack = [];
	
	var defaultLogger = function(trialData, inputData, actionData,logStack){
		
		var stimList = this._stimulus_collection.get_stimlist();
		
		var mediaList = this._stimulus_collection.get_medialist();
		
		return {
			log_serial : logCount,
			trial_id: this._id,
			name: this.name(),			
			responseHandle: inputData.handle,			
			latency: inputData.latency,
			stimuli: stimList,
			media: mediaList,
			data: trialData
		}
	}
	
	var send = function(){		
		
		var url = settings.logger && settings.logger.url
			, deff = $.Deferred()
			, json;
		

		// if the stack is empty, or we don't have a url,  we don't need to do anything
		if (!logStack.length || !url) return $.Deferred().resolve();			
		
		// build data
		json = JSON.stringify(logStack);
		a = json
		var data = {
			json: json			
		}
		$.extend(data, settings.metaData || {});
		
		
		// lets post our data
		deff = $.post(url,data);
				
		// empty logstack
		logStack=[];
						 
		return deff;		
	} 		
	
	/*
	 * create log row and push it into log stack
	 */
	pubsub.subscribe('log',function(options, input_data){
		var logger = settings.logger || {};
		var callback = logger.logger ? logger.logger : defaultLogger;
		
		// add row to log stack
		logCount++;		
		var row = callback.apply(trial(),[trial().data, input_data, options,logStack]);
		logStack.push(row);
		
	});
	
	/*
	 * send logstack to server, but only if it is full
	 */
	pubsub.subscribe('log:send',function(){		
		var pulse = settings.logger && settings.logger.pulse;
		// if logstack if full, lets send it
		if (pulse && logStack.length >= pulse) send();		
	});
	
	return send;
	
});
