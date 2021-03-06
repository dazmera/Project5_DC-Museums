var iconList = ko.observableArray([]);
var infowindow;
var locations = ko.observableArray([]);

function initMap(){
  //Create map and set initial coordinates and zoom level
  this.Map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.9071923, lng: -77.0368707},
    zoom: 12,
  });
  this.center = this.Map.getCenter();
  //Map resizes and centers when the window is resized
  google.maps.event.addDomListener(window, "resize", function() {
    google.maps.event.trigger(this.Map, "resize");
    this.Map.setCenter(this.center); 

  });

  infowindow = new google.maps.InfoWindow();
  //Function for creating points at different locations on the map
    var Point = function (map, name, lat, lon) {
    var markerLat = lat;
    var markerLon = lon;

    //Places a marker on the map
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      animation: google.maps.Animation.DROP,
      name: name
    });

    this.marker = ko.observable(marker);
    iconList.push(marker);

    //brings information from foursquare on marker click
    google.maps.event.addListener(marker, 'click', (function(marker)  {
            return function() {

              $.ajax({
                url: 'https://api.foursquare.com/v2/venues/search'+
                  //'?client_id=PRENND0ZKZI4DRHMGHP5GMBASHGUI5FYL2R53VK5J5VVGQCB'+
                  '?client_id=Y2V1XZ3XFXPTFEG2OEF5EEAXVQHC3KXKD14M3KQHCNF1G2UJ'+
                  //'&client_secret=VHTNW4NDFQSZACFPINV0OC2YEWAISSPXTOHY1UIOZIFVGDLO'+
                  '&client_secret=CZ2DML5DI532FAU4O0DQ4GSKGSKCVHTE3MFK1OBWL5BQK2TX'+
                  '&v=20151224'+
                  '&ll=' + markerLat + ',' + markerLon +
                  '&query=' + marker.name,
                dataType: 'json',
                success: function(response) {
                      var venue = response.response.venues[0];
                      var venueName = venue.name;
                      var venuePhone = venue.contact.formattedPhone;
                      var venueAddress = venue.location.formattedAddress;
                      var venueId = venue.id;
                      var windowContent ='<div id="window">' + '<a href="https://foursquare.com/v/' + venueId + '">' + venueName + '</a>' + '<p>' + venuePhone + '</p>' + '<p>' + venueAddress + '</p>'+'</div>';
                      infowindow.setContent(windowContent);
                },
                error: function(){
                  alert('Unable to retrieve Foursquare data');
                }

              });
                          
                //Open infowindow and pan to clicked marker
                marker.setAnimation(google.maps.Animation.BOUNCE); //Makes marker bounce
                setTimeout(function(){marker.setAnimation(null); }, 750); //Makes marker stop bouncing after one bounce
                map.panTo(marker.getPosition());
                infowindow.open(map, marker);        

            }; 
        })(marker)); 
  }; 

   //Model 
  locations = ko.observableArray ([
  new Point(this.Map, 'National Air and Space Museum', 38.8881601,  -77.0198679),
  new Point(this.Map, 'National Gallery of Art', 38.891298, -77.019965),
  new Point(this.Map, 'National Museum of Natural History', 38.8912662, -77.0260654),
  new Point(this.Map, 'International Spy Museum', 38.8969908, -77.0236404),
  new Point(this.Map, 'African American Civil War Museum', 38.9163027, -77.0253167),
  
  ]);

  for (i=0; i<iconList().length; i++) {
        iconList()[i].setMap(this.Map);
        
  }
}

// viewModel
var viewModel = function(){
  var self = this;

  //Triggers marker click when corresponding museum item is clicked
  self.museumClick = function(clicked){
      var pos = iconList().indexOf(this);
      google.maps.event.trigger(iconList()[pos], 'click');
  
    };

  self.query = ko.observable('');

  //Filters museum items and markers based on user input in the search bar
  self.filterIcons = ko.computed(function () {
    var search  = self.query().toLowerCase();
    return ko.utils.arrayFilter(iconList(), function (marker) {
        var doesMatch = marker.name.toLowerCase().indexOf(search) >= 0;
        if (doesMatch){
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
          infowindow.close(this.Map);
        }
        return doesMatch;

      });
    
  });
  

};
ko.applyBindings(viewModel);
