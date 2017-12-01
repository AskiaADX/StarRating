(function () {
    
     // Polyfill: Add a getElementsByClassName function IE < 9
    function polyfillGetElementsByClassName() {
        if (!document.getElementsByClassName) {
            document.getElementsByClassName = function(search) {
                var d = document, elements, pattern, i, results = [];
                if (d.querySelectorAll) { // IE8
                    return d.querySelectorAll("." + search);
                }
                if (d.evaluate) { // IE6, IE7
                    pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
                    elements = d.evaluate(pattern, d, null, 0, null);
                    while ((i = elements.iterateNext())) {
                        results.push(i);
                    }
                } else {
                    elements = d.getElementsByTagName("*");
                    pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
                    for (var j = 0, l = elements.length; j < l; j++) {
                        if ( pattern.test(elements[j].className) ) {
                            results.push(elements[j]);
                        }
                    }
                }
                return results;
            };
        }
	}
    
    function hasClass(el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
	}

	function addClass(el, className) {
        if (el.classList) el.classList.add(className);
        else if (!hasClass(el, className)) el.className += ' ' + className;
	}

	function removeClass(el, className) {
        if (el.classList) el.classList.remove(className);
        else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
	}
    
    function tbBorder(el) {
		var margin = el.offsetHeight - el.clientHeight;
		return margin;
	}
		
	function lrBorder(el) {
		var margin = el.offsetWidth - el.clientWidth;
		return margin;
	}
		
	function outerHeight(el) {
		var height = el.offsetHeight;
		var style = el.currentStyle || getComputedStyle(el);

		height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		return height;
	}
		
	function outerWidth(el) {
		var width = el.offsetWidth;
		var style = el.currentStyle || getComputedStyle(el);

        width += parseInt(style.marginLeft) + parseInt(style.marginRight);
		return width;
	}
	
	function StarRating(options) {
        this.instanceId = options.instanceId || 1;
        var container = document.getElementById("adc_" + this.instanceId),
            images = [].slice.call(container.getElementsByTagName("img")),
        	total_images = container.getElementsByTagName("img").length;
        
        function loadImages( images, callback ) {
            var count = 0;

            function check( n ) {
                if( n == total_images ) {
                    callback();
                }
            }

            for( i = 0; i < total_images; ++i ) {
                var src = images[i].src;
                var img = document.createElement( "img" );
                img.src = src;

                img.addEventListener( "load", function() {
                    if( this.complete ) {
                        count++;
                        check( count );
                    }
                });
            }

        }

        window.addEventListener( "load", function() {
            if ( total_images > 0 ) {
                loadImages( images, function() {
                    init(options);
                });
            } else {
                init(options);
            }
        });
        
    }
    
    function init(options) {
        
		this.instanceId = options.instanceId || 1;
		this.options = options;
        (options.use = options.use || "star");
		(options.width = options.width || 400);
		(options.height = options.height || "auto");
		(options.animate = Boolean(options.animate));
		(options.autoForward = Boolean(options.autoForward));
        (options.currentQuestion = options.currentQuestion || '');
        
		polyfillGetElementsByClassName();
        
        var container = document.getElementById("adc_" + this.instanceId),
			isInLoop = Boolean(options.isInLoop),
            useStar = options.use,
			showTooltips = Boolean(options.showTooltips),
			tooltipStyle = options.tooltipStyle,
			tooltipCurvedCorners = options.tooltipCurvedCorners,
			tooltipShadow = options.tooltipShadow,
			rowVerticalAlignment = options.rowVerticalAlignment,
			isSingle = Boolean(options.isSingle),
			valuesArray = [],
            instanceId = options.instanceId,
			dkSingle = Boolean(options.dkSingle),
            images = container.getElementsByTagName("img"),
			inputs = [].slice.call(document.getElementsByTagName("input")),
            captions =  [].slice.call(container.getElementsByClassName('caption')),
            controlContainers = [].slice.call(container.getElementsByClassName('controlContainer')),
            allStars = [].slice.call(container.querySelectorAll('.' + useStar)),
            items = options.items,
            submitBtns = [],
            nextBtn,
            total_images = container.getElementsByTagName("img").length,
			images_loaded = 0,
        	animateResponses = Boolean(options.animateResponses);
                
        for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].type.toLowerCase() === 'submit') {
               submitBtns.push(inputs[i]);
            }
        }
        nextBtn = submitBtns[submitBtns.length-2];
                        
        container.style.maxWidth = options.maxWidth;
        container.style.width = options.controlWidth;
        container.parentNode.style.width = '100%';
        container.parentNode.style.overflow = 'hidden';
		
		if ( options.controlAlign === "center" ) {
            container.parentNode.style.textAlign = 'center';
            container.style.margin = '0px auto';
		} else if ( options.controlAlign === "right" ) {
            container.style.margin = '0 0 0 auto';
		}
        
        if ( isInLoop ) {
            container.parentNode.style.width = '100%';
        	container.parentNode.style.overflow = 'hidden';
        }
		
        container.querySelector('.starContainer').width = outerWidth(container.querySelector('.' + useStar)) * document.querySelectorAll('#adc_' + instanceId + ' .starContainer .' + useStar).length;
		
        if (captions.length > 0) {
            var width = outerWidth(captions[0]);
            var maxCaptionWidth = outerWidth(captions[0]);
            for ( i = 0; i < captions.length; i++) {
                maxCaptionWidth = Math.max(width, outerWidth(captions[i]));
            }

            if ( maxCaptionWidth + outerWidth(container.querySelector('.starContainer')) > container.offsetWidth ) {
                container.querySelector('.starContainer').style.float = "left";
                for ( i = 0; i < captions.length; i++) {
                    captions[i].style.display = "block";
                }
            }
        }
            
		// Check for missing images and resize
        for ( i=0; i<images.length; i++) {
            var size = {
                width: images[i].width,
                height: images[i].height
            };

            if (options.forceImageSize === "height" ) {
                if ( size.height > parseInt(options.maxImageHeight,10) ) {
                    var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
                    size.height *= ratio;
                    size.width  *= ratio;
                }
            } else if (options.forceImageSize === "width" ) {
                if ( size.width > parseInt(options.maxImageWidth,10) ) {
                    var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
                    size.width  *= ratio;
                    size.height *= ratio;
                }
            } else if (options.forceImageSize === "both" ) {
                if ( parseInt(options.maxImageHeight,10) > 0 && size.height > parseInt(options.maxImageHeight,10) ) {
                    var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
                    size.height *= ratio;
                    size.width  *= ratio;
                }

                if ( parseInt(options.maxImageWidth,10) > 0 && size.width > parseInt(options.maxImageWidth,10) ) {
                    var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
                    size.width  *= ratio;
                    size.height *= ratio;
                }

            } 
            images[i].width = size.width;
            images[i].height = size.height;
        }

		// Check for DK	
		var DKID = items[0].element.id.replace(/[^0-9]/g, ''),
			hasDK = ( document.querySelectorAll('input[name="M' + DKID + ' -1"]').length > 0 ) ? true : false;
		if ( hasDK ) {
            if ( document.querySelector('input[name="M' + DKID + ' -1"]') ) document.querySelector('input[name="M' + DKID + ' -1"]').style.display = "none";
            if ( document.querySelector('img[id$="M' + DKID + '_-1"]') ) document.querySelector('img[id$="M' + DKID + '_-1"]').style.display = "none";
            if ( document.querySelector('span#cpt' + DKID + '_-1') ) document.querySelector('span#cpt' + DKID + '_-1').style.display = "none";
            // image ends with M1_-1   $
            // caption cpt1_-1
            // input same as before
        }
		
		if ( isSingle ) {
			if ( isInLoop ) {
				var allValuesArray = items[0].allValues.split(",");
				for ( i=0; i<allValuesArray.length; i++ ) {
					valuesArray.push( parseInt( allValuesArray[i] ) );	
				}
			} else {
				for ( i=0; i<items.length; i++ ) {
					valuesArray.push(items[i].value);	
				}
			}
		} else {
            var allValuesArray = items[0].allValues.split(",");
			for ( i=0; i<allValuesArray.length; i++ ) {
				valuesArray.push( parseInt( allValuesArray[i] ) );	
			}
		}
        
        for ( i=0; i<controlContainers.length; i++ ) {
            if ( rowVerticalAlignment === "top" ) {

			} else if ( rowVerticalAlignment === "middle" ) {
                if (captions.length > 0) {
                    if ( outerHeight(controlContainers[i].querySelector('.captionContainer')) > outerHeight(controlContainers[i].querySelector('.starContainer')) ) {
                        var paddingFix = Math.floor( (outerHeight(controlContainers[i].querySelector('.captionContainer')) - outerHeight(controlContainers[i].querySelector('.starContainer')) )/2 );
                        controlContainers[i].querySelector('.starContainer').style.paddingTop = paddingFix+'px';
                        controlContainers[i].querySelector('.starContainer').style.paddingBottom = paddingFix+'px';
                    } else { 
                        var paddingFix = Math.floor( (outerHeight(controlContainers[i].querySelector('.starContainer')) - outerHeight(controlContainers[i].querySelector('.captionContainer')) )/2 );
                        controlContainers[i].querySelector('.captionContainer').style.paddingTop = paddingFix+'px';
                        controlContainers[i].querySelector('.captionContainer').style.paddingBottom = paddingFix+'px';
                    }
                }
			} else if ( rowVerticalAlignment === "bottom" ) {
                if (captions.length > 0) {
                    if ( outerHeight(controlContainers[i].querySelector('.captionContainer')) > outerHeight(controlContainers[i].querySelector('.starContainer')) ) {
                        var paddingFix = Math.floor( outerHeight(controlContainers[i].querySelector('.captionContainer')) - outerHeight(controlContainers[i].find('.starContainer')) );
                        controlContainers[i].querySelector('.starContainer').style.paddingTop = paddingFix+'px';
                    } else { 
                        var paddingFix = Math.floor( outerHeight(controlContainers[i].querySelector('.starContainer')) - outerHeight(controlContainers[i].querySelector('.captionContainer')) );
                        controlContainers[i].querySelector('.captionContainer').style.paddingTop = paddingFix+'px';
                    }
                }
			}
        }
        
		// Select a statement
		// @this = target node
		function selectStars(target) {
            			
			var starContainer = target.parentNode,
                input = isInLoop ? items[starContainer.getAttribute('data-iteration')].element : items[0].element,
				value = target.getAttribute('data-value'),
				starValue = value,
				DKID = input.id.replace(/[^0-9]/g, '');
            
            var selectedElements = [].slice.call(starContainer.getElementsByClassName('selected'));
            for ( i=0; i<selectedElements.length; i++) {
                removeClass(selectedElements[i], 'selected');
            }

			if ( hasDK || dkSingle ) {
                removeClass( target.parentNode.parentNode.querySelector('.dk'), 'selected');
                if ( document.querySelector('input[name="M' + DKID + ' -1"]') )
					document.querySelector('input[name="M' + DKID + ' -1"]').checked = false;
			}
			
			if ( isSingle ) starValue = valuesArray.indexOf(parseInt(value)) + 1;
            
            var starsToSelect = [].slice.call(starContainer.querySelectorAll('.' + useStar)).slice(0,starValue);
            for ( i=0; i<starsToSelect.length; i++) {
                addClass(starsToSelect[i], 'selected');
            }                                 
			input.value = value;
            if (window.askia 
                && window.arrLiveRoutingShortcut 
                && window.arrLiveRoutingShortcut.length > 0
                && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
                askia.triggerAnswer();
            }
			
			// if auto forward and all answered
			if ( options.autoForward ) {
				var totalAnswers = 0;
                for ( i=0; i<inputs.length; i++ ){
					if ( inputs[i].value > 0 ) {
						totalAnswers++;
					}
				}
                if ( totalAnswers === items.length && !isInLoop ) {
                    nextBtn.click();
                }
			}
			
		}
		
		function hoverStars(target) {
            var starContainer = target.parentNode,
				starValue = valuesArray.indexOf(parseInt(target.getAttribute('data-value'))) + 1,
            	stars =[].slice.call( starContainer.querySelectorAll('.' + useStar)).slice(0,starValue);
            
            for ( i=0; i<stars.length; i++ ) {
                addClass(stars[i],'hover');
            }
            if ( showTooltips ) {
    			tippy('#' + target.id);
            }
		}
		
		function unHoverStars(target) {
            var starContainer = target.parentNode,
                 stars = starContainer.querySelectorAll('.' + useStar);
            for ( i=0; i<stars.length; i++ ) {
                removeClass(stars[i],'hover');
            }
		}
		
		function selectDK(target) {
			var starContainer = target.parentNode,
				input = isInLoop ? items[starContainer.getAttribute('data-iteration')].element : items[0].element,
				value = parseInt(target.getAttribute('data-value')),
				DKID = input.id.replace(/[^0-9]/g, ''),
                stars = starContainer.querySelectorAll('.' + useStar + '.selected');
				
			// unselect all stars
            for ( i=0; i<stars.length; i++ ) {
                removeClass(stars[i],'selected');
            }
			if ( hasClass(target, 'selected') ) {
				removeClass(target, 'selected');
				input.value = '';
                if ( document.querySelector('input[name="M' + DKID + ' -1"]') )
                	document.querySelector('input[name="M' + DKID + ' -1"]').checked = false;
			} else {
                addClass(target, 'selected');
                input.value = value;
                if ( document.querySelector('input[name="M' + DKID + ' -1"]') )
                    document.querySelector('input[name="M' + DKID + ' -1"]').checked = true;
			}
            if (window.askia 
                && window.arrLiveRoutingShortcut 
                && window.arrLiveRoutingShortcut.length > 0
                && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
                askia.triggerAnswer();
            }
			
			
			// if auto forward and all answered
			if ( options.autoForward ) {
				var totalAnswers = 0;
				for ( i=0; i<inputs.length; i++ ) {
					if ( inputs[i].value > 0 ) {
						totalAnswers++;
					}
				}
				if ( totalAnswers === items.length && !isInLoop ) {
                    nextBtn.click();
                }
			}
			
		}
		
		// Detect DK
		var DKID = items[0].element.id.replace(/[^0-9]/g, '');
		if ( document.querySelectorAll('input[name="M' + DKID + ' -1"]').length > 0 || dkSingle ) {
			//$(this).find('dk').hide();
		} else {
			if ( container.querySelector('.dk') ) container.querySelector('.dk').style.display = 'none';
		}
		
		// Remember value
    	for ( i=0; i<items.length; i++ ) {
			if ( items[i].element.value > 0 ) {
                var currentContainer = container.querySelector('.' + items[i].element.id),
					starValue = isSingle ? valuesArray.indexOf(parseInt(items[i].element.value)) + 1 : items[i].element.value;
                
				if ( dkSingle && isSingle && valuesArray.indexOf(parseInt(items[i].element.value)) === currentContainer.querySelectorAll('.' + useStar).length ) {
                    addClass(currentContainer.parentNode.querySelector('.dk'), 'selected');
				} else {
                    stars = [].slice.call(currentContainer.querySelectorAll('.' + useStar)).slice(0,starValue);
                    for ( j=0; j<stars.length; j++ ) {
                        addClass(stars[j],'selected');
                    }
				}
			} else if ( document.querySelector('input[name="M' + DKID + ' -1"]') ) {
				if ( document.querySelector('input[name="M' + DKID + ' -1"]').checked == true ) {
                    addClass(container.querySelector('.dk'), 'selected');
				}
			}
		}
		
		// Attach all events
        for ( i=0; i<allStars.length; i++ ) {
            allStars[i].onclick = function(e) {
                selectStars(this);
            };
           allStars[i].onmouseover = function(e) {
                hoverStars(this);
               	if (this.querySelector('span')) {
                    var topAdj = outerHeight(this.querySelector('span')) + 5,
                        leftAdj = (outerWidth(this.querySelector('span')) - outerWidth(this))/2;
                    this.querySelector('.classic').style.top = -topAdj+'px';
                    this.querySelector('.classic').style.left = -leftAdj+'px';
				}
            };
            allStars[i].onmouseout = function(e) {
                unHoverStars(this);
            };
		}
		if ( container.querySelectorAll( '.dk' ).length > 0 ) {
            for ( i=0; i<container.querySelectorAll( '.dk' ).length; i++ )
			container.querySelectorAll( '.dk' )[i].onclick = function(e) {
				selectDK(this);
			};
		}
        
        // animate
        if ( animateResponses ){
			for ( i=0; i<allStars.length; i++ ) {
                allStars[i].style.left = "2000px";
                addClass(allStars[i], 'animate');
            }
        }
        
        function revealEl(el, delay) {
            setTimeout(function(){
                el.style.left = "0px";
            }, delay);
            setTimeout(function(){
                removeClass(el,'animate');
            }, 500);
        }
        
      	// reveal control      
        container.style.visibility = "visible";
        if ( options.animateResponses ){
			for ( i=0; i<allStars.length; i++ ) {
                revealEl( allStars[i], 100+ (i*50) );
            }
         }
	}

	window.StarRating = StarRating;
}());