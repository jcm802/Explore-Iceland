// Javascript code facilitating page elements gradually sliding up on scroll
(function($) {

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *     the user visible viewport of a web browser.
     *     only accounts for vertical position, not horizontal.
     */
  
    $.fn.visible = function(partial) {
      
        var $t            = $(this),
            $w            = $(window),
            viewTop       = $w.scrollTop(),
            viewBottom    = viewTop + $w.height(),
            _top          = $t.offset().top,
            _bottom       = _top + $t.height(),
            compareTop    = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;
      
      return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
  
    };
      
  })(jQuery);
  
  const win = $(window);
  
  const homeDiv1 = $(".text-container-2"),
     homeDiv2 = $(".image-container-3"),
     homeDiv3 = $(".image-container-4-row"),
     thingstodos = $(".img-things-to-do-container-responsive"),
     thingstodoGallery = $(".slideshow-container"),
     thingstodoTours = $(".tours-container"),
     thingstodoMap = $(".things-to-do-details-map"),
     thingstodosMap = $(".things-to-do-map"),
     cards = $('.card');

  // Helper Methods
  const visible = (el) => {
    var el = $(el);
    if (el.visible(true)) {
      el.addClass("already-visible"); 
    } 
  }

  const comeIn = (el) => {
    var el = $(el);
    if (el.visible(true)) {
      el.addClass("come-in"); 
    } 
  }
  
  // Home
  homeDiv1.each(function(i, el) {
     visible(el);
  });
  
  win.scroll(function(event) {
    
    homeDiv1.each(function(i, el) {
      comeIn(el);
    });
  });

  homeDiv2.each(function(i, el) {
     visible(el);
  });
  
  win.scroll(function(event) {
    
    homeDiv2.each(function(i, el) {
      comeIn(el);
    });
  });

  homeDiv3.each(function(i, el) {
     visible(el);
  });
  
  win.scroll(function(event) {
    
    homeDiv3.each(function(i, el) {
      comeIn(el);
    });
    
  });

  // Things to do
  thingstodos.each(function(i, el) {
     visible(el);
  });
  
  win.scroll(function(event) {
    
    thingstodos.each(function(i, el) {
      comeIn(el);
    });
  });

// Things To Do Details Divs
  thingstodoGallery.each(function(i, el) {
     visible(el);
  });
  
  win.scroll(function(event) {
    
    thingstodoGallery.each(function(i, el) {
      comeIn(el);
    });
  });

  thingstodoTours.each(function(i, el) {
     visible(el);
  });
  
  win.scroll(function(event) {
    
    thingstodoTours.each(function(i, el) {
      comeIn(el);
    });
  });

  thingstodoMap.each(function(i, el) {
     visible(el);
  });
  
  win.scroll(function(event) {
    
    thingstodoMap.each(function(i, el) {
      comeIn(el);
    });
  });

  thingstodosMap.each(function(i, el) {
     visible(el);
  });
  
  win.scroll(function(event) {
    
    thingstodosMap.each(function(i, el) {
      comeIn(el);
    });
  });

  // All cards
if(cards !== null){
  cards.each(function(i, el) {
     visible(el);
  });
  
  win.scroll(function(event) {
    
    cards.each(function(i, el) {
      comeIn(el);
    });
  });
}