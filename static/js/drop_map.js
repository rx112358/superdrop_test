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
function set_lat_lng(display_name, lat, lng,result_id,add_location) {

  //let resultId=getResultId();
  let resultString = {'locationName':display_name ,'lat': lat,'lon': lng};
  document.querySelector(`#${result_id}`).value = resultString;
  document.querySelector(`#${result_id}`).style.visibility="hidden";

  if(result_id=='user-loc-result')
  { showDrops();  } 
  if(add_location.display_location=='true')
  {
    get_geocode_locations(add_location.location_id,lat,lng)
  }

}

function create_marker(lat,lng)
{
  // panning the map to the point lat,lng
  map.setView([lat,lng],15);

  // adding the marker to the point lat,lng
  var marker=L.marker([lat, lng]);
  
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

function create_draggable_marker()
{
  let center=map.getCenter()
  // Add a 'marker'
  var marker = L.marker( center, {draggable: true} )
  .addTo(map)
  .bindPopup(`Current LatLng`,center.toString())
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

function createSearch(search_box_id,options,result_id,add_location={display_location:'false',location_id:undefined})
{
  //Get the "search-box" div
  let searchBoxControl = document.querySelector(search_box_id);

  //Initialize the geocoder
  let geocoderControl = L.control.geocoder(key,options).addTo(map).on('select', 
    function (e) {
      set_lat_lng(e.feature.feature.display_name, e.latlng.lat, e.latlng.lng,result_id,add_location);
    });

  let geocoderContainer = geocoderControl.getContainer();

  //Get the geocoder container from the leaflet map
  //Append the geocoder container to the "search-box" div
  searchBoxControl.appendChild(geocoderContainer);        

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
