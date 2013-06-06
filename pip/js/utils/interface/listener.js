define(['./binder','./triggerEvent'],function(binder,trigger){
	
	/*
	 * listener constructor
	 */
	return function(definitions){
		
		// set listener handle
		this.handle = definitions.handle;
		
		// decorate listener with on and off functions 
		binder(this,definitions);
		
		// activate listener:
		this.on(function(e,type){					
			trigger(e,type,definitions);
		});
			
		// for now the destroyer simply unbinds the event
		this.destroy = this.off;				
	}
	
});
