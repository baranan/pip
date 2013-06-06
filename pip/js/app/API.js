/*
 * The player API
 * used to set the script object and run the player
 * will be exported to window
 */

define(['jquery','./task/script','app/task/main_view','app/task/parser','app/sequencer/player'],function($,script,main,parse,play){

	// the API object
	var API = {};

	/*
	 * add set function
	 * type: pertains to the type of set we're adding (should be hord coded in the API)
	 * set: set name, or full set object
	 * setObj: in case set was a name - the set to add
	 * 
	 * use examples:
	 * function('trial',{
	 * 		intro: [intro1, intro2],
	 * 		Default: [defaultTrial]
	 * })
	 * function('trial','intro',[intro1, intro2]) 
	 * function('trial','Default',defaultTrial)
	 * 
	 */
	function add_set(type, set, setObj){
		// get the sets we want to extend (or create them)		
		var targetSets = script[type + "Sets"] || (script[type + "Sets"] = {});
		
		// if we get an explicit object, simply extend the set
		if (typeof set != "string") $.extend(true, targetSets,set);
		
		// if we got a named object 
		else {
			// make sure the objects to add are wrapped in an array
			$.isArray(setObj) || (setObj = [setObj]); 
			// if this is a whole set merge it into the existing set (or create a new one)
			targetSets[set] = targetSets[set] ? $.merge(targetSets[set], setObj) : setObj; 
		} 
	}
	
	$.extend(API, {
		// settings
		addSettings: function(settings, settingsObj){
			script.settings || (script.settings = {})
			if (typeof settings != "string") $.extend(true, script.settings ,settings);
			else {
				if ($.isPlainObject(script.settings[settings])) $.extend(true, script.settings[settings], settingsObj);
				else script.settings[settings] = settingsObj;
			}
		},
		
		// add set function
		addTrialSets: function(set,setObj){add_set('trial',set,setObj);},
		addStimulusSets: function(set,setObj){add_set('stimulus',set,setObj);},
		addMediaSets: function(set,setObj){add_set('media',set,setObj);},			
		
		// add sequence
		addSequence: function(sequence){
			// make sure the sequence is an array
			$.isArray(sequence) || (sequence = [sequence]);
			// set sequence
			script.sequence = script.sequence ? $.merge(script.sequence, sequence) : sequence;			 
		},
		
		// push a whole script
		addScript: function(json){								
			$.extend(true,script,json);
		},
		
		// returns script (for debuging probably)
		script: function(){
			return script;
		},
		
		// run the player, returns deferred
		play: function(){							
			return parse()
				.progress(function(done, remaining){
					// log('stim done: ',done,' stim left: ', remaining);
				})
				.done(function(){
					new main.activate();		
					play();	
				})
				.fail(function(src){					
					throw Error('loading resource failed, do something about it! (you can start by checking the error log)')
				});				
			
		}
	});	
	
	return API;
});
