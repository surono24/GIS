var map, featureList, kabupatenSearch = [];

/* Fungsi resize control layer */
$(window).resize(function() {
  sizeLayerControl();
});

/* Fungsi Highlight */
$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

/* Fungsi tombol untuk about-btn */
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/* Fungsi tombol untuk full-extent-btn */
$("#full-extent-btn").click(function() {
  map.fitBounds(kabupaten.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/* Fungsi tombol untuk legend-btn */
$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/* Fungsi tombol untuk nav-btn */
$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

/* Fungsi size control layer */
function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

/* Fungsi clear highlight */
function clearHighlight() {
  highlight.clearLayers();
}

/* Basemap */
var basemap1 = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
   maxZoom: 20,
   subdomains:['mt0','mt1','mt2','mt3'],
   attribution: 'Google Streets | <a href="https://drive.google.com/file/d/1MREcqvD-a_pSkyP5kFX7TaLVazrtZjIS/view?usp=sharing" target="_blank">Surono</a>' 
}); 
var basemap2 = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
   maxZoom: 20,
   subdomains:['mt0','mt1','mt2','mt3'],
   attribution: 'Google Satellite | <a href="https://drive.google.com/file/d/1MREcqvD-a_pSkyP5kFX7TaLVazrtZjIS/view?usp=sharing" target="_blank">Surono</a>'
});
var basemap3 = L.tileLayer('http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
   maxZoom: 20,
   subdomains:['mt0','mt1','mt2','mt3'],
   attribution: 'Stamen Terrain | <a href="https://drive.google.com/file/d/1MREcqvD-a_pSkyP5kFX7TaLVazrtZjIS/view?usp=sharing" target="_blank">Surono</a>'
});
var basemap4 = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
   maxZoom: 20,
   subdomains:['mt0','mt1','mt2','mt3'],
   attribution: 'Google Terrain | <a href="https://drive.google.com/file/d/1MREcqvD-a_pSkyP5kFX7TaLVazrtZjIS/view?usp=sharing" target="_blank">Surono</a>'
});

/* Overlay Layers Highlight */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

 var adminkab_color = {
          "BOLAANG MONGONDOW":"#ffffc0", 
          "MINAHASA SELATAN":"#ffffc0", 
          "BITUNG":"#ffffc0", 
          "MINAHASA UTARA":"#ffffc0", 
          "BOLAANG MONGONDOW UTARA":"#1a9641", 
          "BOLAANG MONGONDOW SELATAN":"#1a9641", 
          "BOLAANG MONGONDOW TIMUR":"#1a9641", 
          "SIAU TAGULANDANG BIARO":"#1a9641", 
          "KEPULAUAN TALAUD":"#1a9641", 
          "KOTAMOBAGU":"#a6d96a", 
          "TOMOHON":"#a6d96a", 
          "MINAHASA TENGGARA":"#a6d96a", 
          "KEPULAUAN SANGIHE":"#a6d96a", 
          "MINAHASA":"#fdae61","MANADO":"#d7171c"
          };
var kabupaten = L.geoJson(null, {
       style: function (feature) {
          return {
             fillColor:adminkab_color [feature.properties.KABUPATEN],
             fillOpacity: 0.9,
             color: "black",
             weight: 1,
             opacity: 1
          };
       },
  onEachFeature: function (feature, layer) {
    kabupatenSearch.push({			//Search
      primaryname: layer.feature.properties.KABUPATEN,			//Nama utama
	  secondaryname: layer.feature.properties.KABUPATEN,		//Nama sekunder/kedua
      source: "Kabupaten",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
	layer.on({
      mouseover: function (e) {		//Highlight kursor mouse
        var layer = e.target;
        layer.setStyle({
          fillColor: "yellow",		//Warna highlight
          fillOpacity: 0.7			//Transparansi highlight
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        kabupaten.resetStyle(e.target);		//Kembali ke warna awal ketika kursor keluar dari feature
      }
    });
	if (feature.properties) {				//Popup
      var content = "<table class='table table-striped table-bordered table-condensed'>" +
          "<tr><th>Kabupaten/Kota</th><td>" + feature.properties.KABUPATEN + "</td></tr>" +
          "<tr><th>Jumlah Penduduk</th><td>" + feature.properties.PENDUDUK + "</td></tr>" +
          "<tr><th>Lambang Kabupaten</th><td>" + "<img src='" + feature.properties.LAMBANG + "' width='100'>" + "</td></tr>" +
          "</table>";			//Memanggil data atribut untuk ditampilkan pada popup modal
      layer.on({
        click: function (e) {
          $("#feature-title").html("KABUPATEN" + feature.properties.KABUPATEN);		//Judul pada popup modal
          $("#feature-info").html(content);										//Isi pada popup modal
          $("#featureModal").modal("show");										//featureModal ditampilkan
        }
      });
    }
  }
});
$.getJSON("data/kabsulut.geojson", function (data) {		//Lokasi data geojson
  kabupaten.addData(data);
  map.addLayer(kabupaten);
});


/* Map Extent */
map = L.map("map", {
  zoom: 6,															//Zoom peta
  center: [2.91,124.22],											//Titik tengah pada peta
  layers: [basemap3, kabupaten,highlight],			//Layer yang dimunculkan di awal kali ketika peta ditampilkan
  zoomControl: false,
  attributionControl: true
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* zoom control */
var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-street-view",
  metric: true,
  strings: {
    title: "Lokasi saya",
    popup: "Anda berada dalam radius {distance} {unit} dari titik ini",
    outsideMapBoundsMsg: "Anda berada di luar batas-batas peta"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

/* Control Layers */
var baseLayers = {				//Basemap layer
  "Google Street": basemap1,
  "Google Imagery": basemap2,
  "Stamen Terrain": basemap3,
  "Google Terrain": basemap4
};

var layerControl = L.control.groupedLayers(baseLayers,{
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to kabupaten bounds */
  map.fitBounds(kabupaten.getBounds());

  var kabupatenBH = new Bloodhound({
    primaryname: "Kabupaten",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.primaryname);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: kabupatenSearch,
    limit: 10
  });

  kabupatenBH.initialize();
 
 /* instantiate the typeahead UI */
  $("#searchbox").typeahead({			//Search Box Navbar
    minLength: 2,						//Panjang minimal karakter pada search untuk memunculkan daftar pencarian
    highlight: true,					//Highlight pada daftar pencarian aktif
    hint: false							//Menampilkan petunjuk pencarian dan minimal karakter
  }, {
    primaryname: "Kabupaten",			//Field yang digunakan sebagai dasar pencarian pada layer kabupaten
    displayKey: "primaryname",			
    source: kabupatenBH.ttAdapter(),
    templates: {						//Susunan kata yang dimunculkan pada daftar pencarian
      header: "<h4 class='typeahead-header'>Kabupaten/Kota</h4>",
	  suggestion: Handlebars.compile(["{{primaryname}}"].join(""))
    }
  }, 
  ).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Kabupaten") {
      map.fitBounds(datum.bounds);
	  if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

/* Leaflet patch to make layer control scrollable on touch browsers */
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

/* Print to file */
L.easyPrint({
   title: 'Print',
   position: 'bottomright',
}).addTo(map); 

/* ScaleBar */
L.control.betterscale({
   metric: true,
   imperial: false
}).addTo(map);  

/* Watermark */
L.Control.Watermark = L.Control.extend({
   onAdd: function(map) {
      var img = L.DomUtil.create('img');
      img.src = 'logo/oblique.png';
      img.style.width = '100px';
      return img;
   },
   onRemove: function(map) {
      // Nothing to do here
   }
});
L.control.watermark = function(opts) {
   return new L.Control.Watermark(opts);
}
L.control.watermark({ position: 'bottomleft' }).addTo(map);
