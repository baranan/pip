/*
 * a function that takes a media object and creates appropriate html for it
 * 
 * html(media, context)
 * 		takes a media object such as {word: 'Morning'} (we do our best for the object to have only one property)
 * 		the context is the object used for templating
 */
define(['jquery'],function($){
	
	var html = function(media, context, base_url){
		 
		if (media.word) {
			media.displayType = 'element';
			media.type = 'word';
			media.el = $('<div>',{text:media.word});									
		}
		else if (media.image) {
			media.displayType = 'element';
			media.type = 'image';
			media.el = $('<img>',{src:media.image});
		}
		else if (media.jquery) {
			media.displayType = 'element';
			media.type = 'jquery';
			media.el = media.jquery;
		}
		else if (media.html) {
			media.displayType = 'element';
			media.type = 'html';
			media.el = $(_.template(media.html,context || {}));
		}
		else if (media.template) {
			media.displayType = 'element';
			media.type = 'html';
			// this require should be already loaded through the preloading module
			require(['text!' + media.template], function(template){			
				media.el = $(_.template(template,context || {}));				
			});									
		}
		else {
			return false; // this is not a supported html type
		}
	}
	
	return html;
	
});
