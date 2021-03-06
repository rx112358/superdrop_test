import { showDrops } from "./getSearchResults.js";
import { get_geocode_locations } from "./script.js";

var key = 'pk.a786af1c5686dfc7212755d279ba275b';

let map_id=document.querySelector('#map');

var container = L.DomUtil.get(map_id);

if(container != null)
{
  container._leaflet_id = null;


  var map = L.map('map');
  
  map.setView([40.7259, -73.9805], 12);


  L.tileLayer(`https://{s}-tiles.locationiq.com/v2/obk/r/{z}/{x}/{y}.png?key=${key}`).addTo(map);

}

//Displays the geocoding response in the "result" div
function set_lat_lng(display_name, lat, lng,result_id) {

  let resultString = {'locationName':display_name ,'lat': lat,'lon': lng};
  document.querySelector(`#${result_id}`).value = resultString;
  document.querySelector(`#${result_id}`).style.visibility="hidden";
  /*
  if(result_id=='user-loc-result')
  { showDrops();  } 
  if(add_location.display_location=='true')
  {
    get_geocode_locations(add_location.location_id,lat,lng)
  }
  */
}

function create_icon()
{
  let options={
    iconUrl:'/static/icons/logo.svg'
  }
  let icon = L.icon(options);
  return icon;
}

function create_marker(lat,lng)
{
  // panning the map to the point lat,lng
  map.setView([lat,lng],15);

  let drop_icon=create_icon();

  // adding the marker to the point lat,lng
  var marker=L.marker([lat, lng],{icon:drop_icon});
  
  marker.addTo(map);

  // adding a circle with center lat,lng
  var circleCenter = [lat, lng];
  var circleOptions = {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.2
 }
 var circle = L.circle(circleCenter, 500, circleOptions);
 circle.addTo(map);

 return marker;

}

function create_draggable_marker(lat=undefined,lon=undefined)
{
  let position='';

  if(lat!=undefined && lon!=undefined)
    position=L.latLng([lat,lon])
  else
    position=map.getCenter();

  // panning the map to the point lat,lng
  map.setView(position);
  
  let drop_icon=create_icon();
  // Add a 'marker'
  var marker = L.marker( position, {draggable: true,icon:drop_icon} )
  .addTo(map)
  .bindPopup(`Current LatLng`,position.toString())
  .openPopup();


  marker.on('dragend', function(event) {
  var position = marker.getLatLng();
  marker.setLatLng(position, {
  draggable: 'true'
  })  .bindPopup("You're now at " + position.toString())
    .openPopup();

  });

  return marker;
}

function createSearch(search_box_id,options,result_id)
{
  //Get the "search-box" div
  let searchBoxControl = document.querySelector(search_box_id);
  let marker='';

  //Initialize the geocoder
  let geocoderControl = L.control.geocoder(key,options);
  geocoderControl.addTo(map);
  geocoderControl.on('select', 
    function (e) {
      set_lat_lng(e.feature.feature.display_name, e.latlng.lat, e.latlng.lng,result_id);
      //console.log(e.feature.feature.display_name, e.latlng.lat, e.latlng.lng);
      let lat=e.latlng.lat;
      let lng=e.latlng.lng;
          // add marker to map
      marker=create_draggable_marker(lat,lng)
    });

  let geocoderContainer = geocoderControl.getContainer();

  //Get the geocoder container from the leaflet map
  //Append the geocoder container to the "search-box" div
  searchBoxControl.appendChild(geocoderContainer);
  
  return marker;

}

let userSearchLocationOptions = {
  markers: false,         //To not add markers when we geocoder
  attribution: null,      //No need of attribution since we are not using maps
  expanded: true,         //The geocoder search box will be initialized in expanded mode
  panToPoint: false,       //Since no maps, no need to pan the map to the geocoded-selected location
  focus:true
}

createSearch('#user-loc-search-box',userSearchLocationOptions,'user-loc-result')

// Create a function to search locations using location iq api auto complete

export {createSearch,create_marker,create_draggable_marker};
