/*!
 * jira-cli-documentation v0.0.1 (http://jiracl.com)
 * Copyright 2019 Foxy Themes all rights reserved 
 */
var App = (function () {

	//Core private functions
	function leftSidebarInit(){
		$( ".left-sidebar-toggle" ).click(function() {
			$( '.left-sidebar' ).toggleClass( "left-sidebar-open" );
		});

		/*Close sidebar on click outside*/
		$( document ).on("mousedown touchstart",function( e ){
			if ( !$( e.target ).closest( '.left-sidebar' ).length && !$( e.target ).closest( $( ".left-sidebar-toggle" ) ).length && $('.left-sidebar').hasClass('left-sidebar-open') ) {
				$('.left-sidebar').removeClass( 'left-sidebar-open' );
			}
		});
	}

	return {
		init: function (options) {
			leftSidebarInit();
			prettyPrint();
		}
	};
 
})();