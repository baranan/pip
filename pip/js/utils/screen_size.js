/*
 * returns a function that calculates screen size
 * ?? see http://tripleodeon.com/2011/12/first-understand-your-screen
 */
define(['utils/is_touch'],function(is_touch){
	return function(){
		return {
			width: $(window).innerWidth(),
			height: $(window).innerHeight()
		}					
	}
});