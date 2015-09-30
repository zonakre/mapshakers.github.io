var headerHeight = $('#header').outerHeight();
var headerTitle = $('header');
var carousel = $('#carousel');
var carouselContent = $('#carouselContent');
var carouselNav = $('#carouselNav');

headerResizer();

function headerResizer(){
    var docHeight = $(window).outerHeight();

    var carouselHeight = docHeight-headerHeight;


    if (carouselHeight>carouselContent.outerHeight()){
        headerTitle.height(docHeight);
        carousel.height(carouselHeight);
    } else {
        headerTitle.css('height','100%');
    }
}

var articles = createCarousel('gis','app','styles','mapkeyicons');

var index = 1;

var interval = startCarousel();

function startCarousel(){
    carouselContent.html(articles[0].html.clone().html());
    carouselContent.show();
    return setInterval(function(){

        carouselContent.fadeOut(1000,function(){
            carouselNav.children().removeClass('active');
            carouselContent.html(articles[index].html.clone().html());

            articles[index].nav.addClass('active');
            carouselContent.fadeIn(1000)
            headerResizer();
            if (++index>=articles.length){index = 0;}
        });
    },4000);
}

function createCarousel(carouselItemQuery){

    var args = Array.prototype.slice.call(arguments);

    var carItem = [];


    $.each(args, function( index, value ) {
        var carouselItem = {};
        carouselItem.html = $('#'+value);
        carouselItem.nav = $('<div>',{class:'carouselNavItem'}).appendTo(carouselNav)
        if (index==0) {carouselItem.nav.addClass('active')}
        carouselItem.nav.on('click',function(){
            clearInterval(interval);
            setTimeout(function(){interval = startCarousel()},5000)
            carouselContent.fadeOut(200,function(){
                carouselNav.children().removeClass('active');
                carouselContent.html( carouselItem.html.clone().html());
                carouselItem.nav.addClass('active');
                carouselContent.fadeIn(200);
            });
        });
        carItem.push(carouselItem)
    });

    return carItem;
}

/** EVENTS **/

$(window).on('resize',function(){
    headerResizer()
});