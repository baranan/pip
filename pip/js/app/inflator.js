/*
 * inflates a trial/stimulus/media
 * this function is responsible for inheritance from the sets
 * 
 * function inflate(source,type)
 * where source is the script for a component, and type is the type of component (trial/stimulus/media)
 * 
 * the function returns an inflated script object (to be parsed by the constuctors)
 */
define(['jquery','./trial/trial_sets','./stimulus/stimulus_sets','./media/media_sets'],function($,trialSets,stimulusSets,mediaSets){
	
	var inflate = function(source,type){
		
		switch (type) {
			case 'trial': var sets = trialSets(); break; 
			case 'stimulus': var sets = stimulusSets(); break;
			case 'media': var sets = mediaSets(); break;
		}
		
		// if we do not need to inherit anything, simply return source
		if (!source.inherit) return source;
		
		//if the inherit object is not an abject then it is probably a string and refers to a vanila set
		var inherit = $.isPlainObject(source.inherit) ? source.inherit : {set:source.inherit};
						
		// make sure we know the set we're inheriting from		
		if (!sets[inherit.set]) throw new Error('Unknown Trialset: ' + inherit.set);
		
		// get parent
		var parent = inflate(sets[inherit.set].inherit(inherit),type);
		
		// create inflated child
		var child = $.extend(true,{},source);
		$.each(parent, function(key, value) {
			// if this key is not set yet, copy it out of the parent (choose the copy method according to the type of data)
			if (!child[key]){
				// arrays
				if 		($.isArray(parent[key])) child[key] = $.extend(true, [], parent[key]);
				// objects
				else if (typeof parent[key] == 'object') child[key] = $.extend(true, {}, parent[key]);
				// primitives
				else 	child[key] = parent[key];				
			}
		});
		
		// we want to extend the childs data even if it already exists 
		if (parent.data) child.data = $.extend(true, {}, parent.data, child.data);

		// return inflated trial
		return child;
	}
	
	return inflate;
});