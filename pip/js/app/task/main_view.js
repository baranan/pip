/*
 * The main view, responsible for managing the canvas
 */
define(['backbone','jquery','./adjust_canvas','app/task/script'], function(Backbone, $, adjust_canvas,script){

    var View = Backbone.View.extend({
    	
    	id: 'canvas',
    	
    	initialize: function(){
    		this.activate = $.proxy(this.activate,this);
    		this.render = $.proxy(this.render,this);    		    		    		    		    		
    		$(window).on('orientationchange resize', $.proxy(this.adjustCanvas,this));    		
    	},
    	
    	render: function(){    		    		
    		this.adjustCanvas();
    		return this;
    	},
    	
    	activate: function(){
    		// canvas decorations    		
    		var settings = script.settings.canvas || {};
    		if (settings.background) $('body').css('background-color',settings.background);
    		if (settings.canvasBackground) this.$el.css('background-color',settings.canvasBackground);
    		if (settings.borderColor) this.$el.css('border-color',settings.borderColor);
    		if (settings.borderWidth) this.$el.css('border-width',settings.borderWidth);
    		if (settings.css) this.$el.css(settings.css);
    		    		
    		this.$el.appendTo('body');
    		this.render();    		
    		
    	},
    	
    	empty: function(){
    		this.$el.empty();
    	},
    	
    	// sets canvas size (used also for refreshing upon orientation change)
    	adjustCanvas: adjust_canvas
	});	
	
    // Returns the View class
    return new View();
});


