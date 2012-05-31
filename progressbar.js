(function($) {
	var defaults = {
		maxVal : 100,
		bufferedMaxVal : 100
	};
	var methods = {
		init : function(opt) {
			var settings, data;
			settings = $.extend(defaults, opt);

			return this.each(function() {
				var $this = $(this);
				if(!$this.data("data")) {
					methods.createProgressBar($this, settings);
				} else {
					data = $this.data("data");
					data.maxVal = settings.maxVal;
					data.bufferedMaxVal = settings.bufferedMaxVal;
					data.played.width(0);
					data.buffered.width(0);
					data.handle.css({ left : 0 - data.handle.width() / 2});
				}

			});

		},

		createProgressBar : function(el, opt) {
			var dragging, container, full, buffered, played, handle, handleOffset;

			dragging = false;
			container = $("<div class='container' />").appendTo(el);
			full = $("<div class='full' />").appendTo(container);
			buffered = $("<div class='buffered' />").appendTo(full);
			played = $("<div class='played' />").appendTo(buffered);
			handle = $("<div class='handle' />").appendTo(played);
			handleOffset = handle.width() / 2;
			
			handle.css({left : 0 - handle.width() / 2});
			el.data("data", {
					container : container, 
					full : full, 
					buffered : buffered,
					played: played, 
					handle: handle,
					maxVal: opt.maxVal, 
					bufferedMaxVal : opt.bufferedMaxVal
			});

			full.click(function(e) {
				var mousePos, playedWidth, data, maxVal, bufferedMaxVal;
				data = el.data("data");
				maxVal = data.maxVal;
				bufferedMaxVal = data.bufferedMaxVal;
				mousePos = e.pageX - this.offsetLeft;
				playedWidth = mousePos;
				
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
				var pos, parWidth;

				pos = e.pageX - full[0].offsetLeft;
				parWidth = full.width();
				if (pos > 0 - handleOffset && pos <= parWidth - handleOffset) {
					handle.css({left : pos});
				}
			}

			function upEvent(e) {
				var data, maxVal, bufferedMaxval;

				dragging = false;
				data = el.data("data");
				maxVal = data.maxVal;
				bufferedMaxVal = data.bufferedMaxVal;
				playedWidth = parseInt(handle.css("left"), 10) + handleOffset;
				played.width(playedWidth);
				el.triggerHandler("progressbar.handlechange", {
					value : played.width() / full.width() * maxVal,
					bufferedValue : buffered.width() / full.width() * bufferedMaxVal
				});
				$(document).unbind('mousemove', move);
				$(document).unbind('mouseup', upEvent);
			}                                    

		},

		value : function(val) {
			var el, calcWidth, data, totVal, played, handle, full, fullWidth;

			el = $(this);
            data = el.data("data");
            totVal = data.maxVal;
            played = data.played;
            handle = data.handle;
            full = data.full;
			fullWidth = full.width();
			if (val) {
				if (val > totVal) {
					calcWidth = fullWidth;
				} else {
					calcWidth = (val / totVal) * fullWidth;
				}
				played.width(calcWidth);
				handle.css({left : calcWidth - handle.width() / 2});
			}
			return played.width() / fullWidth * totVal;
		},

		bufferedValue : function(val) {
			var el, calcWidth, data, totVal, buffered, full, fullWidth;

			el = $(this);
			data = el.data("data");
			totVal = data.bufferedMaxVal;
			buffered = data.buffered;
			full = data.full;
			fullWidth = full.width();
		
			if (val) {
				if (val > totVal) {
					calcWidth = fullWidth;
				} else {
					calcWidth = (val / totVal) * fullWidth;
				}
				buffered.width(calcWidth);
			}
			return buffered.width() / fullWidth * totVal;
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
})($);
