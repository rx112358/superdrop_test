import { checkIfEmpty } from './script.js'
import { create_marker } from './drop_map.js'

function getUserCoordinates(search_id)
{

    let search_venue_input=document.querySelector(search_id);
    let search_input=search_venue_input.value;

    if(search_input===undefined)
    {
        alert("Unable to identify your current location");
    }
    else
        return search_input
         
}

function getCoordinates(search_input)
{
    /*
    Convert the given user input into valid coordinates

    The user input is in the form of a string and can be of 3 kinds,

    Degrees, minutes, and seconds (DMS): 41°24'12.2"N 2°10'26.5"E
    Degrees and decimal minutes (DMM): 41 24.2028, 2 10.4418

    Decimal degrees (DD): 41.40338, 2.17403

    Use the degree symbol instead of "d".
    Use periods as decimals, not commas. Incorrect: 41,40338, 2,17403. Correct: 41.40338, 2.17403. 
    List latitude coordinates before longitude coordinates.
    first number in your latitude coordinate is between -90 and 90.
    first number in your longitude coordinate is between -180 and 180.

    */

    const dms_re= /-?\d+°\d+'[\d\.]+"[NSEW]*/g;
    const ddm_re= /-?\d+°*\s[\d\.]+'*[NSEW]/g;
    const dd_re = /-?[\d\.]+°*[NSEW]*/g;

    const wrong_input_message=`
                Please enter the input in the format of one of 3 kinds,

                Degrees, minutes, and seconds (DMS): 41°24'12.2"N 2°10'26.5"E or
                Degrees and decimal minutes (DMM): 41 24.2028, 2 10.4418 or
                Decimal degrees (DD): 41.40338, 2.17403`;

    let coordinates=[],lat=0.0,lon=0.0

    search_input=search_input.replace(/[,-]/g,'')
    search_input=search_input.replace(/\s\s+/g,' ')
    search_input=search_input.replace(/\s*°\s*/g,`°`)
    search_input=search_input.replace(/\s*'\s*/g,`'`)
    search_input=search_input.replace(/\s*"\s*/g,`"`)
    search_input=search_input.replace(/[A-Za-z]/g,'')

    switch(true)
    {
        case dms_re.test(search_input):
            search_input=search_input.replace(/[\s*°\s*|\s*'\s*|\s*"\s*]/g,` `)
            search_input=search_input.replace(/\s\s+/g,' ')
            coordinates=search_input.split(' ')

            lat=  parseFloat( coordinates[0] ) + 
                ( parseFloat( coordinates[1] ) /60 ) + 
                ( parseFloat( coordinates[2] ) /3600 )

            lon=  parseFloat( coordinates[3]) +
                ( parseFloat( coordinates[4]) /60 ) + 
                ( parseFloat( coordinates[5] ) /3600 )

            lat = parseFloat(lat.toFixed(5))
            lon = parseFloat(lon.toFixed(5))

            break

        case ddm_re.test(search_input):
            search_input=search_input.replace(/[\s*°\s*|\s*'\s*|\s*"\s*]/g,` `)
            search_input=search_input.replace(/\s\s+/g,' ')
            coordinates=search_input.split(' ')
            lat=( parseFloat( coordinates[0] ) + ( parseFloat( coordinates[1] ) / 60) )
            lon=( parseFloat( coordinates[2] ) + ( parseFloat( coordinates[3] ) / 60 ) )
            break

        case dd_re.test(search_input):
            search_input=search_input.replace(/[\s*°\s*|\s*'\s*|\s*"\s*]/g,' ')
            search_input=search_input.replace(/\s\s+/g,' ')
            coordinates=search_input.split(' ')
            lat=parseFloat(coordinates[0])
            lon=parseFloat(coordinates[1])
            break

        default:
            //alert(wrong_input_message);
            //alert("Unable to identify your current location");
            lat=undefined
            lon=undefined
    }

//console.log(lat,lon,coordinates)

let res=[]; 
res.push(lat); res.push(lon); 

if( isNaN(res[0])|| isNaN(res[1]) || res[0]==undefined || res[1]==undefined)
  {
  alert("Unable to identify your current location");
  res[0]=undefined
  res[1]=undefined
  }
else
    {

        if( lat==undefined || lon==undefined)
        {
            //console.log('Location not found')
            return undefined
        }

        else
        {
            return res
        }
    }
    return undefined
  
}

//console.log(getCoordinates( `41 °  24 ' 12.2 " N 2°10'26.5"E` ) )
//console.log(getCoordinates( `41 24.2028, 2 10.4418`) )
//console.log(getCoordinates( `41.40338, 2.17403` ) )
//console.log(getCoordinates( `8.5241 ° N, 76.9366    ° E `))
//console.log(getCoordinates(`40° 51' 59" N 124° 4' 58" W`))
//console.log(getCoordinates(`40° 51' 59" N 124° 4'`))
//console.log(getCoordinates( ` .40338, .17403` ) )


function getVenueData(point_lat,point_lon)
{

    // getting the results (location name,lat,lon) of search location

    let lat=0.0,lon=0.0;

    if(point_lat===undefined && point_lon===undefined)
    {

        let search_venue_input=document.querySelector(`#get-drop-coord`);
        let search_input=search_venue_input.value;

        if(search_input===undefined)
        {
            alert("Unable to identify your current location");
        }

        let coordinates=getCoordinates(search_input);

        lat=coordinates[0];
        lon=coordinates[1];
    }
    else
    {
        lat=point_lat;
        lon=point_lon;
    }

    let radius=2000;

    // maximum number of results returned by the API call
    let numResults=30;
    let tag='restaurant,hotel,cinema,supermarket,stadium,cardealer';

    let key='pk.a786af1c5686dfc7212755d279ba275b';

    //let test_url=`https://us1.locationiq.com/v1/nearby.php?key=pk.a786af1c5686dfc7212755d279ba275b&lat=-37.870983&lon=144.980714&tag=restaurant&radius=100&format=json'`
    
    // current place tag list -> &tag=restaurant,hotel,cinema,supermarket,stadium,cardealer

    let nearest_search_results=`https://us1.locationiq.com/v1/nearby.php?key=${key}&lat=${lat}&lon=${lon}&radius=${radius}&tags=${tag}&limit=${numResults}&format=json`;
    
    //let search_url=`https://us1.locationiq.com/v1/reverse.php?key=${key}&lat=${lat}&lon=${lon}&format=json`;

    if(lat!=undefined && lon!=undefined)
    {
            // getting locations within 2000m max_lon,max_lat,min_lon,min_lat
        return fetch(nearest_search_results)
        .then(response => response.json())
        .then(data =>
            {
                return data
            });
    }
    
}

function getLocationDrops(venueData)
{
    let location_drops=[]

    Object.keys(venueData).forEach(function(key) {
        // Getting venue name,coordinates from selected location
                    
        let venue_name=	venueData[key]['display_name'];
        let venue_lat=	venueData[key]['lat'];
        let venue_lon=	venueData[key]['lon'];
        
        // add location item to array location_drops
        if(venue_name!=undefined && venue_lat!=undefined && venue_lon!=undefined)
            if(venue_name.trim()!='' && venue_lat.trim()!='' && venue_lon.trim()!='')
                location_drops.push({'name':venue_name,'lat':venue_lat,'lon':venue_lon})
                    
    }); // end of loop
    
    let url='/dropDetails'

    function updateEditTab(doc)
    {
        document.querySelector('.location-drop-details').style.display='block'; 
        document.querySelector('.location-drop-details').innerHTML=doc.innerHTML; 
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(location_drops)
        })
        .then(function (response) {
          //console.log(response.status);
          return response.text();
        })
        .then(function (html) {
  
        // Convert the HTML string into a document object
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        return doc.body
        })
        .then( function(doc)
        {
            let location_drops_container=document.querySelector('.location-drop-details')
        location_drops_container.style.display='block'; 
        location_drops_container.innerHTML='';
        location_drops_container.innerHTML='<h3 class="p-3">Drops in location<button class="btn p-2" id="hide-locdrops-btn"style="float:right; background-color:none">X</button></h3>';
        location_drops_container.innerHTML+=doc.innerHTML; 
        document.querySelector("#hide-locdrops-btn" ).addEventListener('click',function(){ 
            location_drops_container.style.display='none';
        } )
        })
        .catch(error => {
        console.error('Error:', error);
        });
}

function showDrops()
{

    let user_search_result=document.querySelector('#user-loc-result')
    // check if the value of user input is not empty
    if(user_search_result.value!=='')
    {
        let location_val=user_search_result.value;
        let loc_name=location_val['locationName']
        let loc_lat=location_val['lat']
        let loc_lon=location_val['lon']

        // Create a function to add a marker to leaflet map with click listener
        let marker = create_marker(loc_lat,loc_lon);
        marker.on('click', function() 
        {
            // get the venueData data
            getVenueData(loc_lat,loc_lon)
            .then(venueData =>
            {
                //console.log(venueData);
                getLocationDrops(venueData);
            })
            .catch(err =>
            {
                console.log(err);
            });

        })
    }

}

// Create a function to add a marker to leaflet map
function addMarker(lat,lon) {
    var marker = L.marker(new L.LatLng(lat, lon));
    map.addLayer(marker);
  }

export {showDrops,getVenueData,getCoordinates,getLocationDrops,getUserCoordinates};
