define(["backbone","underscore"], function(Backbone, _) {

    var Model = Backbone.Collection.extend({
    	// holds a list of the next members to call if we're using the exclusive randomisation
    	orderList: [],
    	
		// similar to the collection function where, only searches the data attribute 
	    whereData: function(attrs) {
	      if (_.isEmpty(attrs)) return [];
	      return this.filter(function(model) {
	      	var data = model.get('data') || {};
	        for (var key in attrs) {
	          if (attrs[key] !== data[key]) return false;
	        }
	        return true;
	      });
	    },
    	
    	// plain randomization    	
    	random: function(definitions){
    		return this.at(Math.floor(Math.random()*this.length)).attributes;
    	},
    	
    	// randomize without repeat
    	exRandom: function(){
    		this.orderList = this.orderList.length ? this.orderList : _.shuffle(_.range(this.length));    		    		
    		return this.at(this.orderList.pop()).attributes;
    	},
    	
    	// find model by data attributes
    	// check if all attributes of the handle appear in the model data
    	// if the handle is not an abject compare to data.handle
    	byData : function(definitions){
			// if a handle object isn't  defined use the keyword "handle"    			
			var data = _.isEmpty(definitions.data) ? {data:definitions.data} : definitions.data;
			
			// get the first element that fits the handle
    		var element = this.whereData(data)[0];  
    		if (!element) throw new Error('Inherit by Handle failed. Handle not found: ' + definitions.data)
    		return  element.attributes;    		
    	},
    	
    	inherit: function(definitions){
    		// if this is a function, return it with the set as "this"
    		if (_.isFunction(definitions.type)) return definitions.type.call(this,definitions);    		
			
			// otherwise call the appropriate built in function    		    		    		    		
    		switch (definitions.type) {
    			case 'byData' : return this.byData(definitions);break;  			
    			case 'exRandom' : return this.exRandom(); break;    			
    			case 'random' : // or default 
    			default:
    				return this.random();
    		}
    	}
    	
    });

    // Returns the Model class
    return Model;

});