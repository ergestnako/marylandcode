function center_box(){
	var dimArray = getPageSize();
	var scrollArray = getPageScroll();
	var box_height = $('#lightbox').height();
	var box_width = $('#lightbox').width();
	var screen_height = dimArray[3];
	var screen_width = dimArray[2];

	var top = (screen_height / 2) - (box_height / 2) + scrollArray[1];
	var left = (screen_width / 2) - (box_width / 2);

	$('#lightbox').css('top', top);
	$('#lightbox').css('left', left);
}

//
// getPageSize()
// Returns array with page width, height and window width, height
// Core code from - quirksmode.org
// Edit for Firefox by pHaez
//
function getPageSize(){
	
	var xScroll, yScroll;
	
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	
	var windowWidth, windowHeight;
	if (self.innerHeight) {	// all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}	
	
	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}

	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = windowWidth;
	} else {
		pageWidth = xScroll;
	}


	arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight) ;
	return arrayPageSize;
}

//
// getPageScroll()
// Returns array with x,y page scroll values.
// Core code from - quirksmode.org
//
function getPageScroll(){

	var yScroll;

	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
	} else if (document.documentElement && document.documentElement.scrollTop){	 // Explorer 6 Strict
		yScroll = document.documentElement.scrollTop;
	} else if (document.body) {// all other Explorers
		yScroll = document.body.scrollTop;
	}

	arrayPageScroll = new Array('',yScroll) ;
	return arrayPageScroll;
}

function closeLightbox(){
	$('#lightbox-bg').animate({"opacity": "0"}, 500, 'swing', function(){
		$(this).css('display', 'none');
	});
	$('#lightbox').animate({"opacity": "0"}, 500, 'swing', function(){
		$(this).css('display', 'none');
	});
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function openLightbox(){
	
	$('#lightbox-bg').animate({"opacity": ".70"}, 500);
	$('#lightbox').animate({"opacity": "1.0"}, 500);
	$('#lightbox-bg, #lightbox').css('display', 'block');
	
	$(window).resize(function(){
		center_box();
	});

	$(window).scroll(function(){
		center_box();
	});
}

function isOverflowing(element){
    element.wrapInner('<div />'); // wrap inner contents
    var hidden = element.height() < element.children('div').height();

    element.children('div').replaceWith( element.children('div').html() ); //unwrap

    return hidden;
}

function checkNav(){
	$('li.search').css('float', 'none');
	if(isOverflowing($('#main_navigation'))){
		$('#main_navigation').addClass('contracted');
	}
	else{
		$('#main_navigation').removeClass('contracted');
	}
	$('li.search').css('float', 'right');
}

/** Lightbox **/
$(document).ready(function(){
	$('#contactable').contactable({
		subject: 'Feedback Message'
	});
	
	// checkNav();
	// 	
	// 	$(window).resize(function(){
	// 		checkNav();
	// 	});
	
	/** Build search url as a permalink **/
	$('form:first').submit(function(){
		//Grab the search form value
		var searchTerm = $(this).children('input[type="search"]').val();
		
		//Build relative permalink
		var url = '/term/' + searchTerm.replace(' ', '-') + '/';
		
		//Build complete url
		url = window.location.origin + url;
		
		//Redirect
		window.location.href = url;
		
		//Cancel default submission
		return false;
	});
	
	if(typeof $.cookie('entrance_cookie') == 'undefined' && $(window).width() > 690){
		//Set lightbox content
		$('#lightbox-content').html('<img src="/images/lightbox-ticket" alt="Enter Ticket" /><img src="/images/open-law-badge.png" alt="Open Law Badge" style="width:200px; margin-top:-75px;"/>');
		
		//Show lightbox
		openLightbox();
		
		//Set close handlers
		$('#lightbox-bg').click(function(){
			closeLightbox();
			$.cookie('entrance_cookie', true, {path: '/'});
		});
		$('#lightbox-close').click(function(){
			closeLightbox();
			$.cookie('entrance_cookie', true, {path: '/'});
		});
		
		//Center lightbox
		center_box();
	}
	
	//Share data button
	$('#get_yours').click(function(){
		$('#lightbox-content').html('<h1>Let\'s Open the Law in Your Home Town</h1><p style="text-align:center;">Click <a href="mailto:sayhello@opengovfoundation.org">here</a> to tell us what city or state laws we should open next.</p>');
		$('#lightbox').addClass('no-bg');
		openLightbox();
		$('#lightbox-bg').click(closeLightbox);
		$('#lightbox-close').click(closeLightbox);
	});

	$('#stay-updated').click(function(){
		var email = $('#signup-email').val();
		
		if(!validateEmail(email)){
			$('#submit_response').css('color', 'red').html('Please enter a valid email address');
			return;
		}
		
		$.post('signup.php', {'email': email}, function(data){
			data = JSON.parse(data);
			
			if(data.success == true){
				$('#submit_response').css('color', 'green').html(data.msg);
			}else{
				$('#submit_response').css('color', 'red').html(data.msg);
			}
		});
	});
});
	
