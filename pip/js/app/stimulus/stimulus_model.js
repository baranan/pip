define(function(require) {
	var MyModel = require("models/model")
		,mediaView = require("app/media/media_constructor")
		,timeout = require("utils/timeout")
		,pubsub = require("utils/pubsub")
		,_ = require("underscore")
		,is_touch = require("utils/is_touch")
		,settings = require("app/task/settings");

	
    var Model = MyModel.extend({
    	initialize: function(){    		
        	// set trial in the model        	        
        	if (this.collection.trial) this.trial = this.collection.trial;        	
    		
    		// set model handle    		
    		this.attributes.data = this.attributes.data || {}; // make sure we have a data object 
    		this.attributes.data.handle = this.attributes.data.handle || this.attributes.handle; // set the handle in the data object 
    		this.handle =  this.attributes.data.handle; // set the handle in the stimulus object
    		
	        // pick the correct media according to if this is a touch device	        
	        var mediaSource = is_touch && this.get('touchMedia') ? this.get('touchMedia') : this.get('media')
	        // take the media source and inflate it into a full fledged view 	        	                
        	this.media = new mediaView(mediaSource,this);
        	
    	},    	

        // Default values for all of the attributes
        defaults: {        	        
			location: {top: 'center', left: 'center', bottom: 'auto', right: 'auto'},
			size: {height: 'auto', width: 'auto'},
			timeline: {before:0,after:0},
			css:{}
        },
                
        
        // activate stimulus listeners (maybe these shoud sit in one of the trial modules? call with apply)
        // ----------------------------------------------------------------------------------------------------------
    	
    	activate: function(){
    		var self = this;    		
    		var stimHandle = this.handle;
    		var timeline = this.get('timeline');
    		this.timeStack = this.timeStack || [];
    		this.pubsubStack = this.pubsubStack || [];
    		
    		// subscribe to start action
    		// -------------------------
    		pubsub.subscribe('stim:start', self.pubsubStack, function(handle){    			
    			if (!_.include([stimHandle,'All'], handle)) return false; // make sure this publication is aimed at us
    			    			
    			// wait before presenting the stimulus
    			timeout(timeline.before, self.timeStack, function(){
    				self.media.show();    				
    			});    			
    		});
    		
    		// subscribe to set attribute action
    		// ---------------------------------
    		
    		pubsub.subscribe('stim:setAttr', self.pubsubStack, function(handle,setter){
    			if (!_.include([handle,'All'], stimHandle)) return false; // make sure this publication is aimed at us
    			
    			// if this is a function let it do whatever it wants with this model, otherwise simply call set.
    			if (_.isFunction(setter)) setter.apply(self);
    			else {
    				var data = this.get('data') || {};    				
    				data = _.extend(data, setter);
    				self.set('data', data);
    			};
    		});
    		
    		// subscribe to stom stimulus action
    		// ---------------------------------
    		pubsub.subscribe('stim:stop', self.pubsubStack, function(handle){
    			if (!_.include([handle,'All'], stimHandle)) return false; // make sure this publication is aimed at us
    			
    			// hide the stimulus
    			self.media.hide();
    			
    			// wait after the stimulus
    			timeout(timeline.after, self.timeStack, function(){
    				
    			});    			    			
    			
    		});
    	},
    	
    	disable: function(){
    		// hide the stimulus
    		this.media.hide();
    		
    		// make sure the stacks exist
    		this.timeStack = this.timeStack || [];
    		this.pubsubStack = this.pubsubStack || [];    		
    		
    		// clear stack listeners
    		_.each(this.timeStack, function(handle) {
				clearTimeout(handle);
			});
			
    		_.each(this.pubsubStack, function(handle) {    			
				pubsub.unsubscribe(handle);
			});
			
			// empty stacks
    		this.timeStack = [];
    		this.pubsubStack = [];    		
    	},
    	
    	name: function(){
			var attr = this.attributes;
			if (attr.data.alias) return attr.data.alias; // if we have an alias ues it
			if (attr.inherit && attr.inherit.set) return attr.inherit.set; // otherwise try using the set we inherited from
			if (attr.handle) return attr.handle; // otherwise use handle
			return false; // we're out of options here
    	},
    	
    	mediaName: function(){
    		var media = this.media.options.source; 
    		var fullpath = settings.logger && settings.logger.fullpath; // should we use the full path or just the file name
    		
    		if (media.alias) return media.alias; // if we have an alias ues it    		    		
    		for (var prop in media) if (prop != 'inherit') {    			
    			if (_.contains(['image','template'],prop) && !fullpath) return media[prop].replace(/^.*[\\\/]/, ''); 
    			else return media[prop];
    		}
    	}

    });
        		
    // Returns the Model class
    return Model;

});