define(['underscore'],function(){
	
	/*
	 * mixes an array according to mix objects
	 * 
	 * The basic structure of such an obect is:
	 * {
	 *		mixer: 'functionType',
	 *		data: [task1, task2]
	 *	}
	 * 
	 * @param list - the array to be mixed
	 * @param shallow - for inner use only: mix without opening wrappers. this allows us to open randoms and repeats
	 */
	var mix = function(list,shallow){		
		
		var stack = [];
		
		_.each(list, function(value){
			var mixer = _.isObject(value) ? value.mixer : undefined;
									
			// if the value is wrapped in a mixer object we want to extract it and push it into the stack
			switch (mixer){
				case 'random' :				
					var mixed = _.shuffle(mix(value.data,true));
					var result = shallow ? mixed : mix(mixed); // if this is top level lets open all those wrappers now										 
					stack = stack.concat(result);					
					break;
				case 'repeat' :
					var mixed = mix(value.data,true);					 				
					var result = shallow ? mixed : mix(mixed); // if this is top level lets open all those wrappers now																		
					for (var i = 0; i < value.times; i++) stack = stack.concat(result);					
					break; 
				case 'wrapper' :
					// if this is a shallow mix, don't mix the wrapper 
					if (shallow) stack.push(value);
					else stack = stack.concat(mix(value.data));
					break;
				default:					
					// the value is unwrapped, lets push it as it is.
					stack.push(value);
			}	
		});
		
		return stack;
		
	}
	
	return mix;
});
