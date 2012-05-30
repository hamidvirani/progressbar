(function($) {
	var defaults = {
		maxVal : 100,
		bufferedMaxVal : 100
	};
	var methods = {
		init : function(opt) {
			var settings = $.extend(defaults, opt);
			var data;
			return this.each(function() {
				var $this = $(this);
				if(!$this.data("data")) {
					methods.createProgressBar($this, settings);
				} else {
					data = $this.data("data");
					data.maxVal = settings.maxVal;
					data.bufferedMaxVal = settings.maxVal;
					data.played.width(0);
					data.buffered.width(0);
					data.handle.css({ left : 0 - data.handle.width() / 2});
				}

			});

		},

		createProgressBar : function(el, opt) {
			//console.log(el);
			var maxVal = opt.maxVal;
			var bufferedMaxVal = opt.bufferedMaxVal;
			var dragging = false;
			var container = $("<div class='container' />").appendTo(el);
			var full = $("<div class='full' />").appendTo(container);
			var buffered = $("<div class='buffered' />").appendTo(full);
			var played = $("<div class='played' />").appendTo(buffered);
			var handle = $("<div class='handle' />").appendTo(played);
			var handleOffset = handle.width() / 2;
			
			handle.css({left : 0 - handle.width() / 2});
			el.data("data", {
					container : container, 
					full : full, 
					buffered : buffered,
					played: played, 
					handle: handle,
					maxVal: maxVal, 
					bufferedMaxVal : bufferedMaxVal
			});

			full.click(function(e) {
				var mousePos = e.pageX - this.offsetLeft;
				var playedWidth = mousePos;
				if (playedWidth > full.width()) {
					playedWidth = full.width();
				}
				played.width(playedWidth);
				handle.css("left", playedWidth  - handleOffset );

				el.triggerHandler("progressbar.handlechange", {
					value : played.width() / full.width() * maxVal,
					bufferedValue : buffered.width() / full.width() * bufferedMaxVal
				});
			});

			handle.bind ('mousedown', function(event) {
				dragging = true;
				$(document).bind ('mousemove', move);
				$(document).bind('mouseup', upEvent);
				return false;
			});

			function move(e) {
				var pos = e.pageX - full[0].offsetLeft;
				var parWidth = full.width();
				if (pos > 0 - handleOffset && pos <= parWidth - handleOffset) {
					handle.css({left : pos});
				}
			}

			function upEvent(e) {
				dragging = false;
				//console.log(handleOffset);
				var playedWidth = parseInt(handle.css("left"), 10) + handleOffset;
				played.width(playedWidth);
				el.triggerHandler("progressbar.handlechange", {
					value : played.width() / full.width() * maxVal,
					bufferedValue : buffered.width() / full.width() * bufferedMaxVal
				});
				//console.log(playedWidth );
				$(document).unbind('mousemove', move);
				$(document).unbind('mouseup', upEvent);
			}                                    

		},

		value : function(val) {
			var el = $(this);
            var calcWidth;
            var data = el.data("data");
            var totVal = data.maxVal;
            var played = data.played;
            var handle = data.handle;
            var full = data.full;
			
			if (val) {
				if (val >= totVal) {
					played.width(full.width());
				}
				calcWidth = (val / totVal) * full.width();
				played.width(calcWidth);
				handle.css({left : calcWidth - handle.width() / 2});
			}
			//console.log(played.width() / full.width() * totVal);
			return played.width() / full.width() * totVal;
		},

		bufferedValue : function(val) {
			var el = $(this);
			var calcWidth;
			var data = el.data("data");
			var totVal = data.bufferedMaxVal;
			var buffered = data.buffered;
			var full = data.full;
		
			if (val) {
				if (val >= totVal) {
					buffered.width(full.width());
				}
				calcWidth = (val / totVal) * full.width();
				buffered.width(calcWidth);
			}
			return buffered.width() / full.width() * totVal;
		}
	};
	$.fn.progressbar = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method : " + method + " does not exist for progressbar.");
		}

	};
}($));
