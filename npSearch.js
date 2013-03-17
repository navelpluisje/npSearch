/**
 * Easy plugin for creating instant searchfunctionality
 * @author Erwin Goossen <info at navelpluisje dot nl>
 * 
 */

(function($) {
	$.fn.npSearch = function( options ) {

		// extend the defaults with the options
		options = $.extend({}, $.fn.npSearch.defaults, options);
		// set our haystack
		var haystack;

		haystack = setHaystack( options.selector, options.paralel );

		// And now our actual logic
		this.each( function() {
			var $self = $( this );
			var resultId = createResultId();
			// first check if there is a resultspace
			if ( $( '#' + resultId ).length === 0 ) {
				$( 'body' ).append( '<div id="' + resultId + '" class="resultset"></div>' );
				$( '#' + resultId ).on( 'click', 'span.close', function() {
							$( '#' + resultId ).slideUp(250);
						})
						.css({
							'position': 'absolute',
							'top' : ( $self.position().top + $self.height() + 10 ) + 'px',
							'left': $self.position().left
						})
						.slideUp( 0 );
			}

			$self.keyup( function() {
				var result = '',
					i,
					inputlength = $self.val().length;

				// The input is sufficient, let's take some action
				if ( inputlength >= options.charStart ) {
					var len = haystack[0].length;

					for ( i = 0;  i < len; i++ ) {
						bFirst = false; // only usefull for paralel search. To avoid duplicate sets
						if ( $(haystack[0][i]).text().search( $self.val() ) > 0 ) {
							bFirst = true;
							result += '<dt>' + $( haystack[0][i] ).text() + '</dt>';
							result += (options.paralel) ? '<dd>' + $( haystack[1][i] ).text() + '</dd><hr />' : '<hr />';
						}
						if ( options.paralel && ! bFirst && $(haystack[1][i]).text().search( $self.val() ) > 0 ) {
							result += '<dt>' + $( haystack[0][i] ).text() + '</dt>';
							result += '<dd>' + $( haystack[1][i] ).text() + '</dd><hr />';
						}
					}

				} else {
					$( '#' + resultId ).slideUp(250);
				}

				if ( options.highlight ) {
					result = setHighlight( $self.val(), result );
				}
				if ( result.length > 0 ) {
					$( '#' + resultId ).html( '<span class="close">X</span><dl>' + result + '</dl>' )
								.slideDown(250);
				}

			}).focusout( function() {
				$( '#' + resultId ).html( '' )
								.slideUp(250);
				$self.val('');
			});
		});
		// returns the jQuery object to allow for chainability.
		return this;
	};

		// private functions
	/**
	 * set a span around the search-text
	 * @param {string} needle   string to search for and surround by span
	 * @param {string} haystack The haystach to search in
	 * @return {string} modified string
	 */
	function setHighlight( needle, haystack ) {
		var regexp = new RegExp( needle, 'g' );
		return haystack.replace( regexp, '<span>' + needle + '</span>' );
	}

	/**
	 * Create an array to search throug
	 * @param {array}    selector array of selectors to search for
	 * @param {booolean} paralel  if set there is a paralel search for eg. FAQ
	 * @return {array} list of all the strings to search through
	 */
	function setHaystack( selector, paralel ) {
		var haystack;
		if ( paralel ) {
			haystack = {};
			for ( i = 0; i < 2; i++ ) {
				haystack[i] = $( selector[i] );
			}
		} else {
			haystack = '';
			for ( i = 0; i < selector.length; i++ ) {
				haystack += $( selector[i] );
			}
		}
		return haystack;
	}

	/**
	 * Create an id for the result element
	 * @return {string}  the Id
	 */
	function createResultId() {
		var count = 8;
		var result = 'result_';

		while ( count !== 0 ) {
			result += Math.floor((Math.random()*10)+1);
			count--;
		}
		return result;
	}

	$.fn.npSearch.defaults = {
		'charStart'     : 3,
		'paralel'       : false, // usable for paring like in FAQ. only 2 selectors are allowed
		'selector'      : [],
		'highlight'     : true
	};


})(jQuery);
