(function ($) {
	"use strict";

	$.fn.adcStarRating = function adcStarRating(options) {
		
        (options.instanceId = options.instanceId || 1);
		(options.width = options.width || 400);
		(options.height = options.height || "auto");
		(options.animate = Boolean(options.animate));
		(options.autoForward = Boolean(options.autoForward));
		
		var isInLoop = Boolean(options.isInLoop),
			showTooltips = Boolean(options.showTooltips),
			tooltipStyle = options.tooltipStyle,
			tooltipCurvedCorners = options.tooltipCurvedCorners,
			tooltipShadow = options.tooltipShadow,
			rowVerticalAlignment = options.rowVerticalAlignment,
			isSingle = Boolean(options.isSingle),
			valuesArray = new Array(),
            instanceId = options.instanceId,
			dkSingle = Boolean(options.dkSingle);
						
		// Delegate .transition() calls to .animate() if the browser can't do CSS transitions.
		if (!$.support.transition) $.fn.transition = $.fn.animate;
		
		$(this).css({'max-width':options.maxWidth,'width':options.controlWidth});
		$(this).parents('.controlContainer').css({'width':'100%','overflow':'hidden'});
		
		if ( options.controlAlign === "center" ) {
			$(this).parents('.controlContainer').css({'text-align':'center'});
			$(this).css({'margin':'0px auto'});
		} else if ( options.controlAlign === "right" ) {
			$(this).css({'margin':'0 0 0 auto'});
		}
		
		if ( isInLoop ) $(this).parents('.controlContainer').css({'width':'100%','overflow':'hidden'});
		$('.starContainer').width( $('.star').outerWidth(true) * $('#adc_' + instanceId + ' .starContainer .star').size() );
		
		var maxCaptionWidth = Math.max.apply( null, $( '.caption' ).map( function () {
			return $( this ).outerWidth( true );
		}).get() );
		
		if ( maxCaptionWidth + $('.starContainer').outerWidth(true) > $(this).outerWidth() ) {
			$('.starContainer').css({'float':'left'});
			$('.caption').css({'display':'block'});
		}
		
		// Check for images and resize
		$container = $(this);
		$container.find('.captionContainer img').each(function forEachImage() {
			var size = {
				width: $(this).width(),
				height: $(this).height()
			};
			
			if (options.forceImageSize === "height" ) {
				if ( size.height > parseInt(options.maxImageHeight,10) ) {
					var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}
			} else if (options.forceImageSize === "width" ) {
				if ( size.width > parseInt(options.maxImageWidth,10) ) {
					var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}
				
			} else if (options.forceImageSize === "both" ) {
				if ( parseInt(options.maxImageHeight,10) > 0 && size.height > parseInt(options.maxImageHeight,10) ) {
					var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}
	
				if ( parseInt(options.maxImageWidth,10) > 0 && size.width > parseInt(options.maxImageWidth,10) ) {
					var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}
				
			} 
			$(this).css(size);
		});
		
		// Global variables
		var $container = $(this),
			items = options.items;
		
		// Check for DK	
		var DKID = items[0].element.attr('id').replace(/[^0-9]/g, ''),
			hasDK = ( $('input[name="M' + DKID + ' -1"]').size() > 0 ) ? true : false;
		if ( hasDK ) $('input[name="M' + DKID + ' -1"]').hide().next('span').hide();
		
		if ( isSingle ) {
			if ( isInLoop ) {
				var allValuesArray = items[0].allValues.split(",");
				for ( var i=0; i<allValuesArray.length; i++ ) {
					valuesArray.push( parseInt( allValuesArray[i] ) );	
				}
			} else {
				for ( var i=0; i<items.length; i++ ) {
					valuesArray.push(items[i].value);	
				}
			}
		} else {
			for ( var i=1; i<=items.length; i++ ) {
				valuesArray.push(i);	
			}
		}
			
		$container.find('.controlContainer').each(function forEachItem() {
			if ( rowVerticalAlignment === "top" ) {
				/*if ( $(this).find('.captionContainer').outerHeight() > $(this).find('.starContainer').outerHeight() ) {
					
				} else { 
				
				}*/
			} else if ( rowVerticalAlignment === "middle" ) {
				if ( $(this).find('.captionContainer').outerHeight() > $(this).find('.starContainer').outerHeight() ) {
					var paddingFix = Math.floor( ($(this).find('.captionContainer').outerHeight() - $(this).find('.starContainer').outerHeight() )/2 );
					$(this).find('.starContainer').css({'padding-top':paddingFix+'px', 'padding-bottom':paddingFix+'px'});
				} else { 
					var paddingFix = Math.floor( ($(this).find('.starContainer').outerHeight() - $(this).find('.captionContainer').outerHeight() )/2 );
					$(this).find('.captionContainer').css({'padding-top':paddingFix+'px', 'padding-bottom':paddingFix+'px'});
				}
			} else if ( rowVerticalAlignment === "bottom" ) {
				if ( $(this).find('.captionContainer').outerHeight() > $(this).find('.starContainer').outerHeight() ) {
					var paddingFix = Math.floor( $(this).find('.captionContainer').outerHeight() - $(this).find('.starContainer').outerHeight() );
					$(this).find('.starContainer').css({'padding-top':paddingFix+'px'});
				} else { 
					var paddingFix = Math.floor( $(this).find('.starContainer').outerHeight() - $(this).find('.captionContainer').outerHeight() );
					$(this).find('.captionContainer').css({'padding-top':paddingFix+'px'});
				}
			}
			//$(this).css({ x: 2000, opacity: 0 }).transition({ x: 0, opacity: 1, delay: delay }, options.animationSpeed, easing);
			//delay += 30;
		});
			
		// Select a statement
		// @this = target node
		function selectStars() {
			
			//console.log($(this).parents('.controlContainer').data('iteration'));
			
			var $container = $(this).parents('.starContainer'),
				$input = isInLoop ? items[$container.data('iteration')].element : items[0].element,
				$target = $(this),
				value = $target.attr('data-value'),
				starValue = value,
				DKID = $input.attr('id').replace(/[^0-9]/g, '');

			$container.find('.selected').removeClass('selected');
			if ( hasDK || dkSingle ) {
				$container.next('.dk').removeClass('selected');
				$('input[name="M' + DKID + ' -1"]').prop('checked', false);
			}
			//$target.addClass('selected');
			
			if ( isSingle ) starValue = $.inArray(parseInt(value), valuesArray) + 1;
			
			$container.find('.star').slice(0,starValue).addClass('selected');
			$input.val(value);
			
			// if auto forward and all answered
			if ( options.autoForward ) {
				var totalAnswers = 0;
				$container = $(this).parents('.adc-starRating');
				$container.find('input').each(function forEachItem() {
					if ( $(this).val() > 0 ) {
						totalAnswers++;
					}
				});
				if ( totalAnswers === items.length ) $(':input[name=Next]:last').click();
			}
			
		}
		
		function hoverStars(target) {
			$container = target.parents('.starContainer');
			var starValue = $.inArray(parseInt(target.data('value')), valuesArray) + 1;
			$container.find('.star').slice(0,starValue).addClass('hover');
		}
		
		function unHoverStars(target) {
			$container = target.parents('.starContainer');
			$container.find('.star').removeClass('hover');
		}
		
		function selectDK() {
			
			var $container = $(this).parents('.controlContainer'),
				$input = isInLoop ? items[$container.data('iteration')].element : items[0].element,
				$target = $(this),
				value = $(this).data('value'),
				DKID = $input.attr('id').replace(/[^0-9]/g, '');
				
			// unselect all stars
			$container.find('.star.selected').removeClass('selected');
			if ( $(this).hasClass('selected') ) {
				$(this).removeClass('selected');
				$input.val('');
				$('input[name="M' + DKID + ' -1"]').prop('checked', false);
			} else {
				$(this).addClass('selected');
				$input.val(value);
				$('input[name="M' + DKID + ' -1"]').prop('checked', true);
			}
			
			
			// if auto forward and all answered
			if ( options.autoForward ) {
				var totalAnswers = 0;
				$container = $(this).parents('.adc-starRating');
				$container.find('input').each(function forEachItem() {
					if ( $(this).val() > 0 ) {
						totalAnswers++;
					}
				});
				if ( totalAnswers === items.length ) $(':input[name=Next]:last').click();
			}
			
		}
		
		// Detect DK
		var DKID = items[0].element.attr('id').replace(/[^0-9]/g, '');
		if ( $('input[name="M' + DKID + ' -1"]').size() > 0 || dkSingle ) {
			//$(this).find('dk').hide();
		} else {
			$(this).find('.dk').hide();
		}
		
		// Remember value
		//if ( items[0].element.val() > 0 ) $container.find('.star').slice(0,items[0].element.val()).addClass('selected');
		$.each( items, function ( index, element ) {
			if ( items[index].element.val() > 0 ) {
				$container = $('.' + items[index].element.attr('id'));
				var starValue = isSingle  ? $.inArray(parseInt(items[index].element.val()), valuesArray) + 1 : items[index].element.val();
				if ( dkSingle && isSingle && $.inArray(parseInt(items[index].element.val()), valuesArray) === $container.find('.star').size() ) {
					$container.next('.dk').addClass('selected');
				} else {
					$container.find('.star').slice(0,starValue).addClass('selected');
				}
			} else if ( items[index].element.val() == -1 ) {
				var DKID = items[0].element.attr('id').replace(/[^0-9]/g, '');
				if ( $('input[name="M' + DKID + ' -1"]').prop('checked') ) {
					$container.next('.dk').addClass('selected');
				}
			}
		});
		
		if ( options.animate ) {
			var delay = 0,
				easing = (!$.support.transition)?'swing':'snap';
			
			$container = $('.starContainer');
			$container.find('.star').each(function forEachItem() {
				$(this).css({ x: 2000, opacity: 0 }).transition({ x: 0, opacity: 1, delay: delay }, options.animationSpeed, easing);
				delay += 30;
			});
		}
		
		// Attach all events
		$container = $(this);
		/*$container
			.delegate('.star', 'click', selectStars)
			.delegate('.star', 'mouseover mouseout', function(e) {
    			if (e.type == 'mouseover') {
      				hoverStars($(this))
    			} else {
      				unHoverStars($(this))
    			}
			});*/
		$container.on('click', '.star', selectStars);
		$container.on('mouseover mouseout', '.star',  function(e) {
			
			if (e.type == 'mouseover') {
				hoverStars($(this))
				var topAdj = $(this).find('span').outerHeight() + 5,
					leftAdj = ($(this).find('span').outerWidth() - $(this).outerWidth())/2;
				$(this).find('.classic').css({'top':-topAdj+'px', 'left':-leftAdj+'px'});
			} else {
				unHoverStars($(this))
			}
		});
		$container.on('click', '.dk', selectDK);
		// add dk hover
		

		// Returns the container
		return this;
	};

} (jQuery));