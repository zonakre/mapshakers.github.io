/*    var map = L.map('map',{attributionControl:false,zoomControl:false}).setView([40,4 ], 1);
 var mapkeyTiles = L.tileLayer.mapkey({
 style: 'greyDark',
 key: 'your-API-key',
 minZoom:1,
 });
 mapkeyTiles.addTo(map);*/

var searchinput = $('#search_input');
var search = $('#search');

var dataItems = $('#dataItems');

var keyBtns = $('#keyBtns')

searchinput.on('focus',function(){
    search.addClass('focus')
});

searchinput.on('blur',function(){
    search.removeClass('focus')
});

searchinput.on('keyup',function(e){
    searchMaps($(e.target).val());
});

function searchMaps(val){
    var findings = index.search(val);
    dataItems.empty()
    $.each( findings, function( key, val ) {
        createMapItem(maps[val.ref]).appendTo(dataItems)
    });
}

var keys = ['Europe','city plan','tourism','capitals','countries']
$.each( keys, function( key, val ) {
    var btn = $('<button>',{class:'keyBtn'})
        .html(val)
        .on('click',function(){
            searchinput.val(val)
            searchMaps(val);
        })
        .appendTo(keyBtns);
});


var urlPath = 'http://geo.mapint.eu:222/websites/gisdata/';

var index = lunr(function () {
    this.field('name', {boost: 10});
    this.field('keywords');
    this.field('zoom');
    this.field('style');
    this.field('constant');
    this.ref('filename');
})

var maps = {};
$.getJSON(urlPath+'maps.json', function( data ) {
    $.each( data, function( key, val ) {
        maps[val.filename] = val;
        index.add({
            name: val.name,
            keywords: val.keywords,
            zoom: val.zoom,
            style: val.style,
            constant: 'all',
            filename: val.filename
        });
    });

    console.log(index)
});



function createMapItem(data){
    var dataItem = $('<div>',{class:'dataItem'});
    var close = $('<div>',{class:'close'}).html('&times;')
        .on('click',function(){
            dataItem.fadeOut();
        })
        .appendTo(dataItem);

    var imgWrapper = $('<div>',{style:'position:relative;'}).appendTo(dataItem);
    var imgUrl = urlPath+'thumbs/'+data.filename.replace('tiff','jpg');
    var img = $('<img>',{src:imgUrl}).appendTo(imgWrapper);
    var heading = $('<div>',{class:'heading'}).appendTo(imgWrapper);
    var h1 = $('<h1>').html(data.name).appendTo(heading);
    var style = $('<div>').html('style: '+data.style).appendTo(heading);
    var zoom = $('<div>').html('zoom: '+data.zoom).appendTo(heading);

    var table = $('<table>').appendTo(dataItem);
        $('<tr>').appendTo(table)
        .append($('<th>').html('width'))
        .append($('<tr>').html(data.width + ' px'));
    $('<tr>').appendTo(table)
        .append($('<th>').html('height'))
        .append($('<tr>').html(data.height + ' px'));
    /* $('<tr>').appendTo(table)
     .append($('<th>').html('zoom'))
     .append($('<tr>').html(data.zoom));*/
    $('<tr>').appendTo(table)
        .append($('<th>').html('pixel size'))
        .append($('<tr>').html((Math.round(data.pixelSize*100000)/100000).toString()+' m/px'));
    $('<tr>').appendTo(table)
        .append($('<th>').html('filesize'))
        .append($('<tr>').html(data.fileSizeHuman));
    var buttons = $('<div>').appendTo(dataItem);
    var map = $('<a>',{href:'#'}).html('<span class="mki-intext mki-map"></span> show bounds').appendTo(dataItem);
    var download = $('<a>',{href:'#'}).html('<span class="mki-intext mki-download"></span> download').appendTo(dataItem);
    return dataItem;
}