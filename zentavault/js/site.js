startBg = 4; 

(function($) {

	$(function() {
		

		var showSocial = false;
		var isOnBottom = false;

		var screenH = $(window).height();
		var timeout = 0;
		var waiting = false;

		$(".message").click(function(){
			$(this).fadeOut(200);
		})

		$(document).keydown(function(e){

		    
		    var key = e.keyCode;

		    if (key == 38) { 
		       cameraSpeed += 0.15;

		    }
		   	if (key == 40) { 
		   	   cameraSpeed -= 0.05;		   	   
		   	}

		   	cameraSpeed = Math.max(0.1, cameraSpeed);
		   	cameraSpeed = Math.min(9, cameraSpeed);

			if (key == 37) { 
				$(".prev").click();

			}
	   		if (key == 39) { 
	   		   $(".next").click();   	   
	   		}
	   		if (key == 32) { 
	   		   $("body").toggleClass('no-cursor');
	   		}

		   	//return false;
		   	 
		});


		$(document).on("mousemove", function(e){
			var pos = {
				x : e.pageX,
				y : e.pageY
			};
			isOnBottom = pos.y > screenH * 0.7;

			if ( isOnBottom ) {
				if ( timeout ) return;
				timeout = setTimeout(function(){
					$("body").addClass("onbottom");					
				}, 2000);
			} else {
				clearTimeout(timeout);
				timeout = 0;
				$("body").removeClass("onbottom");
			}

		});

		$(document).on("click", function(){
			$("body").removeClass("no-cursor");
		})



		var bg = startBg;

		var fogs = {
			"1" : "#bebfcb",
			"2" : "#ddd",
			"6" : "#185d41",
			"7" : "#4584b4",
			"8" : "#292e31"
		};

		setFog = function(color) {
			material.uniforms.fogColor.value.set(color);
		}
		var setBg = function(i) {
			console.log(i);
			$("body").css("background-image", "url(bg/" + i + ".jpg)" );
			if ( !$("body").hasClass('no-webgl') ) {
				if ( typeof fogs[i] !== "undefined" ) {
					setFog( fogs[i] );
				} else {
					setFog("#ddd");
				}
			}
		}



		$(".next").click(function(){			
			bg++;
			if ( bg > 9 ) bg = 1;
			setBg(bg);
		});	
		$(".prev").click(function(){
			bg--;
			if ( bg < 1 ) bg = 9;
			setBg(bg);
		});	



	}); 

})(jQuery);
