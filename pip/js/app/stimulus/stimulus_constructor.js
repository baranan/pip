define(['./stimulus_model', '../inflator'], function(stim_model,inflate) {
	
	return function(modelData, options){
		
		// inflate trial source
		var data = inflate(modelData,'stimulus');
		// keep source for later use		
		data.source = modelData;
		
		return new stim_model(data, options);		
	}
	
});