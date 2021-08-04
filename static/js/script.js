import { create_marker,createSearch, create_draggable_marker} from './drop_map.js';
import { getVenueData,getCoordinates,getUserCoordinates} from './getSearchResults.js';

let place_drop_geocoderControl='';
let edit_drop_geocoderControl='';

function showAlert(message){
    var alert_container = document.getElementById("alert-message");
    alert_container.innerHTML = message;
    alert_container.classList.add("show-alert");
    setTimeout(function(){
      alert_container.classList.remove("show-alert");
    }, 3000);
}

function removeLocation(parent)
{
    parent.remove();
}

function addLocation(location_id,drop_locname,drop_lat,drop_lon)
{
    let new_location_html=`<p><span class="drop-locname-list" data-drop-lat='${drop_lat}' data-drop-lon='${drop_lon}'>${drop_locname}</span><button type="button" class="drop-location-remove-btn btn btn-sm" style="float:right; color:none">x</button></p>`       
    document.querySelector(location_id).innerHTML+=new_location_html    
    document.querySelectorAll('.drop-location-remove-btn').forEach(el => el.addEventListener('click',function(){ 
        removeLocation(el.parentElement)})
        )

    // hide trending locations 
    let trending_loc_container=document.querySelector(location_id).parentElement.querySelector('.trending-loc-list')
    if(trending_loc_container.style.display!='none')
    {
        trending_loc_container.style.display='none'
    }
}

function addtoDrop(){
    let asset_list = document.getElementById("drop-assets-list");
    asset_list.classList.add("show-alert");
    asset_list.innerHTML = '<p>Item added to drop<p>';
    setTimeout(function(){
    asset_list.classList.remove("show-alert");
    }, 3000);
}

function removeDropLocation(location_id)
{
    // create an AJAX call
    $.ajax({
        type:   "DELETE", 
        url:    '/updateLocation',
        headers: {
            'Content-Type': 'application/json'
        },
        data:   location_id,  
        
        // on success
        success: 
            function (response) {
                //console.log(reponse.status)                
            },
        // on error
        error: function (response) {
            console.log(response.errors) }
        });// end of ajax call

}

function reverse_geocode(lat,lon)
{
    let reverse_geocoding_url=`https://us1.locationiq.com/v1/reverse.php?key=pk.a786af1c5686dfc7212755d279ba275b&lat=${lat}&lon=${lon}&format=json`
    return fetch(reverse_geocoding_url)
    .then(response => response.json())
    .then(data =>
        {
            // check if reverse geocoding was done successfully
            // if so,return data
            if('error' in Object.keys(data))
                {//console.log(data)
                    alert("Unable to identify your current location");
                }
            else
                return data
        })
    .catch(err=> console.log(err));
}

function get_geocode_locations(location_list_id,lat,lon)
{
    reverse_geocode(lat,lon)
    .then(user_location=>
    {
        if(user_location!=undefined)
        {
        let drop_placename=user_location['display_name']
        let drop_lat=user_location['lat']
        let drop_lon=user_location['lon']
        //console.log(user_location)

        if(drop_lat!=undefined && drop_lon!=undefined && drop_placename!=undefined)
            addLocation(location_list_id,drop_placename,drop_lat,drop_lon)
        }
    })
    .catch(err=>{
        //console.log(err)
    });

}


function get_drop_location(location_container)
{

    let marker='',marker_coord=[undefined,undefined];
    // get drop location from coordinates
    document.querySelector(location_container['user_coordinates_container']['search_btn']).addEventListener('click',function()
        {
            let search_input=getUserCoordinates(location_container['user_coordinates_container']['search_box_id']);
            if(search_input!=undefined)
            {
                let coord=getCoordinates(search_input)
                if(coord!=undefined)
                {
                    marker_coord[0]=coord[0]
                    marker_coord[1]=coord[1]
                        // add marker to map
                    marker=create_draggable_marker(marker_coord[0],marker_coord[1])
                    //get_geocode_locations(location_container['location_list_id'],coord[0],coord[1]);
                }
            }

        })
    // get drop location from auto complete search box
      //Initialize the geocoder
    location_container['geocoderControl'].on('select', (e) =>  {  
        marker_coord[0]=e-latlng.lat;
        marker_coord[1]=e-latlng.lng;
        marker=create_draggable_marker(marker_coord[0],marker_coord[1])    
    });

    // placing marker on map and getting coordinates of marker
    let place_drop_btn=document.querySelector(location_container['place_drop_coordinates'][0])
    let confirm_drop_btn=document.querySelector(location_container['place_drop_coordinates'][1]);
        
    place_drop_btn.addEventListener('click',()=>{
        marker=create_draggable_marker();

    })


    confirm_drop_btn.addEventListener('click',function(){
        //marker.remove();
        if(marker_coord[0] !=undefined || marker_coord[1]!=undefined )
        {
            if(marker !=undefined)
            {
                let position = marker.getLatLng();
                marker_coord[0]=position.lat
                marker_coord[1]=position.lng
                get_geocode_locations(location_container['location_list_id'],marker_coord[0],marker_coord[1])
            }
        }
    })


}
function editDrop(drop_id)
{
    let url='/userDrop'

    function updateEditTab(doc)
    {
        
        $('.update-drop-list').hide();
        $('.drop-edit-details-tab').show();
        document.querySelector('.drop-edit-details-tab').innerHTML=doc.innerHTML;
        updateUserInputType('edit_drop_category');

        let location_container={'user_coordinates_container':{'search_box_id':'#edit-drop-coord','search_btn':'#edit-drop-coord-btn'},'search_coordinates_container_id':{'search_box_id':'#update-drop-loc-search-box','search_results':'update-drop-coord-locname'},'place_drop_coordinates':['#edit-drop-coord-marker','#confirm-edit-drop'],'location_list_id':'.edit-drop-location-list','geocoderControl':'edit_drop_geocoderControl'}

        // change update drop tabs
        document.querySelector('#edit-tab-3-control-b-btn').addEventListener('click',function() {    $('.drop-edit-details-tab').children().hide(); $('#drop-edit-details-tab-2').show();  if( checkIfEmpty('#update-drop-loc-search-box')) { edit_drop_geocoderControl=createSearch(location_container['search_coordinates_container_id']['search_box_id'],options,location_container['search_coordinates_container_id']['search_results']); get_drop_location(place_drop_location_container); }  //get_trending_locations(location_container['location_list_id'],'#edit-drop-coord-trending')  
        }   )
        document.querySelector('#edit-tab-1-control-f-btn').addEventListener('click',function() {    $('.drop-edit-details-tab').children().hide(); $('#drop-edit-details-tab-2').show();  if( checkIfEmpty('#update-drop-loc-search-box')) { edit_drop_geocoderControl=createSearch(location_container['search_coordinates_container_id']['search_box_id'],options,location_container['search_coordinates_container_id']['search_results']); get_drop_location(place_drop_location_container); }  //get_trending_locations(location_container['location_list_id'],'#edit-drop-coord-trending') 
        }   )
        document.querySelector('#edit-tab-2-control-f-btn').addEventListener('click',function() {    $('.drop-edit-details-tab').children().hide(); $('#drop-edit-details-tab-3').show();   show_asset_lib("#edit_drop_assets");  })
        document.querySelector('#edit-tab-2-control-b-btn').addEventListener('click',function() {    $('.drop-edit-details-tab').children().hide(); $('#drop-edit-details-tab-1').show();   }   )

        document.querySelectorAll('.drop-location-remove-btn').forEach(el => el.addEventListener('click',function(){
            removeDropLocation(el.dataset.locId)
            removeLocation(el.parentElement)

        }))

        // update drop when btn is clicked
        document.querySelector("#update-drop-btn").addEventListener('click', function(event) {updateDrop(this.dataset.dropId);   reset_markers();}   )
    }

    let drop_data=[{"drop id":drop_id}]

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:   JSON.stringify(drop_data),  
        })
        .then(function (response) {
          //console.log(response.status);
          return response.text();
        })
        .then(function (html) {
  
        // Convert the HTML string into a document object
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        return doc.body 
        })
        .then( function(doc)
        {
            updateEditTab(doc)   
        })
        .catch(error => {
        console.error('Error:', error);
        });

}

function getDropLocations(location_list_id)
{
    let drop_locations=[]
    let parent=document.querySelector(location_list_id)
    parent.querySelectorAll('.drop-locname-list').forEach((ele,index)=>{
        let drop_locname=ele.innerHTML
        let drop_lat    =ele.dataset.dropLat
        let drop_lon    =ele.dataset.dropLon
        drop_locations.push({'name':drop_locname,'lat':drop_lat,'lon':drop_lon})
    })
    return drop_locations
}

function updateDrop(drop_id)
{
    let data = {},valid_fields=true;

    let drop_location_container='.edit-drop-location-list'
    let drop_locations=getDropLocations(drop_location_container)
    let message='';

    let field_values={
    'title'         :   clean_ipfield(document.querySelector('#edit_drop_title').value)       ,
    'category'      :   document.querySelector('#edit_drop_category').value    ,
    'description'   :   clean_ipfield(document.querySelector('#edit_drop_description').value) ,
    }
    let url        =   document.querySelector('#edit_drop_url').value                            
    let file       =   document.querySelector('#edit_drop_file').value  

    Object.keys(field_values).forEach((key)=>{
        //console.log(field_values[key])
        if(field_values[key]==undefined || field_values[key]=='')
        {
            message=message+`<p>The field drop ${key} is required<p>`
            valid_fields=false;
        }
    })

    if(field_values['category']==4)
    {
        message=message+`<p>The field drop url is required<p>`
        valid_fields=false;
    }

    if(field_values['category']==5)
    {
        message=message+`<p>The field drop file is required<p>`
        valid_fields=false;
    }

    let asset_id=document.querySelector('#edit_drop_assets').dataset.assetId

    if(asset_id=='')
    {
        message=message+`<p>The field drop assets is required<p>`
            valid_fields=false
    }
    if( drop_location_container.childElementCount==0  ) 
    {
        message=message+`<p>The field drop locations is required<p>`
            valid_fields=false
    }
    if(valid_fields==false)
        showAlert(message)

    if(valid_fields==true)
    {               
        data={
        'drop_id'          : drop_id,
        'drop_title'       : field_values['title'],
        'drop_category'    : field_values['category'],
        'drop_description' : field_values['description'],
        'drop_url'	       : url,
        'drop_file'        : file,
        'drop_asset_id'    : asset_id,
        'drop_locations'   : JSON.stringify(drop_locations)                          
        }
    
        // create an AJAX call
        $.ajax({
        type:   "POST", // GET or POST
        url:    "/updateDrop",
        data:   data, // get the form data
        
        // on success
        success: 
            function (response) {
                
                let drop_id=response['dropId'];
                showAlert('<p>The drop details have been updated.</p>')
                console.log(" Form data submitted ",drop_id);
            },
        // on error
        error: function (response) {
            console.log(response.errors) }
        });// end of ajax call

    }


}

function delDrop(ele,drop_id)
{
    // create an AJAX call
    $.ajax({
        type:   "DELETE", 
        url:    '/updateDrop',
        headers: {
            'Content-Type': 'application/json'
        },
        data:   drop_id,  
        
        // on success
        success: 
            function (response) {
                //console.log(response.status)
                ele.parentNode.parentNode.remove()    
            },
        // on error
        error: function (response) {
            //console.log(response.errors) 
        }
        });// end of ajax call

}

function showDrops()
{
    let url='/userdropDetails'

    // send data to view 
    fetch(url, {
        method: 'GET',
        })
        .then(function (response) {
          //console.log(response.status);
          return response.text();
        })
        .then(function (html) {
  
        // Convert the HTML string into a document object
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        //console.log(doc.body);
        return doc.body   
        }).then(function(doc)
        {
            document.querySelector('.update-drop-list').innerHTML=doc.innerHTML;
            document.querySelectorAll(".edit-drop-btn").forEach(el => el.addEventListener('click',function(){ editDrop(this.dataset.dropId)}))
            document.querySelectorAll(".del-drop-btn" ).forEach(el => el.addEventListener('click',function(){ delDrop(el,this.dataset.dropId) }))    
        })
        .catch(error => {
        console.error('Error:', error);
        });
}

function get_trending_locations(location_id,container_id)
{
    // fetch trending locations from get_popular_locations
    let url='/trendingLocations'
    // send data to view 
    fetch(url, {
        method: 'GET',
        })
        .then(response => response.json())
        .then(data =>
        {
            /*
            {'id': 2, 'drop_long': -111.8265049, 'drop_lat': 34.8791806, 'drop_locname': 'test loc', 'popularity_count': 1}, 
            */
            //console.log(data)
            let trending_loc_container=document.querySelector(container_id)
            trending_loc_container.style.display='block'
            trending_loc_container.querySelectorAll('.trending-loc').forEach((el,index)=> { 

                let drop_lat=data[index]['drop_lat']
                let drop_lon=data[index]['drop_long']
                let drop_locname=data[index]['drop_locname']

                if(drop_locname!=undefined)
                {   el.innerHTML=       drop_locname
                    el.dataset.dropLat= drop_lat
                    el.dataset.dropLon= drop_lon       
                    el.addEventListener('click',function(){
                        //console.log('location selected')
                        addLocation(location_id,drop_locname,this.dataset.dropLat,this.dataset.dropLon)
                    })
                }
                else
                    el.style.display='none'
            })
        })
        .catch(error => {
        console.error('Error:', error);
        });

}
  
function validFileType(file) {
    // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
    const imageFileTypes = [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon"
    ];
    return imageFileTypes.includes(file.type);
}

function updateFileDisplay() {

    const preview = document.querySelector('.preview');
    while(preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
  
    const curFiles = input.files;
    if(curFiles.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No files currently selected for upload';
      preview.appendChild(para);
    } else {
      const list = document.createElement('ol');
      preview.appendChild(list);
  
      for(const file of curFiles) {
        const listItem = document.createElement('li');
        const para = document.createElement('p');
        if(validFileType(file)) {
          para.textContent = `File name ${file.name}, file size ${returnFileSize(file.size)}.`;
          const image = document.createElement('img');
          image.src = URL.createObjectURL(file);
  
          listItem.appendChild(image);
          listItem.appendChild(para);
        } else {
          para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
          listItem.appendChild(para);
        }
  
        list.appendChild(listItem);
      }
    }
  }

function getFiles()
{
    const input = document.getElementsByName('file')[-1];

    //input.style.opacity = 0;

    input.addEventListener('change', updateFileDisplay);

}

function updateUserInputType(category_id)
{
    const selectElement = document.getElementById(category_id);

    let drop_url_container =    document.querySelector('.dropUrl');
    let drop_file_container=    document.querySelector('.dropFile');

    let drop_url_value= drop_url_container.getElementsByTagName('input')[0].value    
    let drop_file_value= drop_file_container.getElementsByTagName('input')[0].value

    selectElement.addEventListener('change', (event) => {
        switch(event.target.value)
        {
            case '4':
                drop_url_container.classList.remove('hideTab')
                drop_file_value=''
                break
            case '5':
                drop_file_container.classList.remove('hideTab')
                drop_url_value.value=''
                getFiles()
                break
            default:
                drop_url_value='';
                drop_file_value='';
        }
    });
}

document.querySelector("#drop-btn").addEventListener('click', function(event) {

    let asset_list = document.getElementById("alert-message");
    asset_list.innerHTML = ''
    let message='';


    let data = {},valid_fields=true;

    //let csrf_token = $('input[name="csrfmiddlewaretoken"]').val();

    let drop_locations=getDropLocations('.place-drop-location-list')

    let field_values={
    'title'         :   clean_ipfield(  document.querySelector('#id_drop_title').value )       ,
    'category'      :   document.querySelector('#id_drop_category').value                      ,
    'description'   :   clean_ipfield(  document.querySelector('#id_drop_description').value ) ,
    }

    let url        =   document.querySelector('#id_drop_url').value                            
    let file       =   document.querySelector('#id_drop_file').value  

    Object.keys(field_values).forEach((key)=>{
        //console.log(field_values[key])
        if(field_values[key]==undefined || field_values[key]=='')
        {
            message=message+`<p>The field drop ${key} is required<p>`
            valid_fields=false;
        }
    })

    if(field_values['category']==4)
    {
        message=message+`<p>The field drop url is required<p>`
        valid_fields=false;
    }

    if(field_values['category']==5)
    {
        message=message+`<p>The field drop file is required<p>`
        valid_fields=false;
    }

    let asset_id=document.querySelector('#id_drop_assets').dataset.assetId

    if(asset_id=='')
    {
        message=message+`<p>The field drop assets is required<p>`
            valid_fields=false
    }

    if(drop_locations.length==0)
    {
        message=message+`<p>The field drop locations is required</p>`
            valid_fields=false
    }
    if(valid_fields==false)
        showAlert(message)

    if(valid_fields==true)
    {               
        data={
        'drop_title'       : field_values['title'],
        'drop_category'    : field_values['category'],
        'drop_description' : field_values['description'],
        'drop_url'	       : url,
        'drop_file'        : file,
        'drop_asset_id'    : asset_id,
        'drop_locations'   : JSON.stringify(drop_locations)                          
        }
        
        // create an AJAX call
        $.ajax({
        type:   "POST", // GET or POST
        url:    "/createDrop",
        data:  data, // get the form data
        
        // on success
        success: 
            function (response) {
                
                let drop_id=response['dropId'];

                showAlert('<p>Your drop is discoverable at the target location’</p>')
                console.log(" Form data submitted ",drop_id);

                reset_markers();
            },
        // on error
        error: function (response) {
            //console.log(response.errors) 
        }
        });// end of ajax call
    
    }


})

function show_asset_lib(browse_btn_id)
{
     // change display attr of asset library to block when btn clicked
     document.querySelector(browse_btn_id).addEventListener('click',function(){
        document.querySelector(".asset-library").style.display='block';
    } )
    document.querySelectorAll(".add-asset-btn" ).forEach(el => el.addEventListener('click',function(){ 
            document.querySelector(browse_btn_id).dataset.assetId=this.dataset.assetId;
            addtoDrop();    })
            )
    document.querySelector("#hide-asset-lib-btn" ).addEventListener('click',function(){ 
        document.querySelector(".asset-library").style.display='none';
    } )
}

function reset_markers()
{
    Array.from(document.getElementsByClassName('leaflet-pane leaflet-tooltip-pane')[0].childNodes).forEach(marker=>marker.remove())
    Array.from(document.getElementsByClassName('leaflet-pane leaflet-marker-pane')[0].childNodes).forEach(marker=>marker.remove())
}

function reset_tab_coord(tab)
{
    Array.from(document.querySelector(tab).getElementsByTagName('input')).forEach( 
        function(element) {
           element.value = '';
        }
    );
    Array.from(document.querySelector(tab).getElementsByTagName('textarea')).forEach( 
        function(element) {
           element.value = '';
        }
    );

    //reset_markers();

    if(!('hideTab' in document.querySelector('.dropUrl' ).classList))         document.querySelector('.dropUrl' ).classList.add('hideTab')
    if(!('hideTab' in document.querySelector('.dropFile').classList))         document.querySelector('.dropFile').classList.add('hideTab')
    
    // hide trending locations 
    let trending_loc_container=document.querySelector(tab).parentElement.querySelector('.trending-loc-list')
    if(trending_loc_container.style.display=='none')
    {
        trending_loc_container.style.display='block'
    }
    document.querySelector('.place-drop-location-list').innerHTML='';
}

function showTab(tab)
{
    if( tab == 'place')
    {
        $('#pills-edit-drop').children().hide();    
        $('#pills-place-drop').children().hide();          
        $('#drop-details-tab-1').show(); 
        reset_tab_coord('#pills-place-drop')
        updateUserInputType('id_drop_category');
    }
    else
    {
        $('#pills-place-drop').children().hide();  
        $('#pills-edit-drop').children().hide();           
        $('.update-drop-list').show();                
        showDrops(); 
    }

}

function showEditTab(tab)
{
    document.querySelector('.drop-tab').style.display='none';
    document.querySelector('.drop-details-tab').style.display='block';

    document.querySelector("#pills-place-drop-tab").addEventListener('click',function(){showTab('place')} )
    document.querySelector("#pills-edit-drop-tab" ).addEventListener('click',function(){showTab('edit') } )
    
    showTab(tab);
}

document.querySelector("#place-drop-btn").addEventListener('click',function(){showEditTab('place')} )
document.querySelector("#edit-drop-btn" ).addEventListener('click',function(){showEditTab('edit') } )

// Create a function to check if geocodercontainer is already appended to searchbox 
function checkIfEmpty(element) {
    element=document.querySelector(element)
    if (element.innerHTML.trim().length == 0) {
      return true;
    } else {
      return false;
    }
  }

function clean_ipfield(value)
{
    let clean_field=value.replace(/[^a-zA-Z0-9 ]/g, "");
    return clean_field
}

let options = {
    bounds: false, 
    markers: false,         //To not add markers when we geocoder
    attribution: null,      //No need of attribution since we are not using maps
    expanded: true,         //The geocoder search box will be initialized in expanded mode
    panToPoint: false,       //Since no maps, no need to pan the map to the geocoded-selected location
    focus:false
}

let place_drop_location_container={'user_coordinates_container':{'search_box_id':'#get-drop-coord','search_btn':'#user-drop-coord'},'search_coordinates_container_id':{'search_box_id':'#drop-loc-search-box','search_results':'get-drop-coord-locname'},'place_drop_coordinates':['#get-drop-coord-marker','#confirm-drop-coord'],'location_list_id':'.place-drop-location-list','geocoderControl':'place_drop_geocoderControl'}

document.querySelector('#tab-3-control-b-btn').addEventListener('click',function() {    $('#pills-place-drop').children().hide(); $('#drop-details-tab-2').show();  if( checkIfEmpty('#drop-loc-search-box')) { place_drop_geocoderControl=createSearch(place_drop_location_container['search_coordinates_container_id']['search_box_id'],options,place_drop_location_container['search_coordinates_container_id']['search_results']); get_trending_locations(place_drop_location_container['location_list_id'],'#get-drop-coord-trending'); }    get_drop_location(place_drop_location_container);  }   )
document.querySelector('#tab-1-control-f-btn').addEventListener('click',function() {    $('#pills-place-drop').children().hide(); $('#drop-details-tab-2').show();  if( checkIfEmpty('#drop-loc-search-box')) { place_drop_geocoderControl=createSearch(place_drop_location_container['search_coordinates_container_id']['search_box_id'],options,place_drop_location_container['search_coordinates_container_id']['search_results']); get_trending_locations(place_drop_location_container['location_list_id'],'#get-drop-coord-trending'); }    get_drop_location(place_drop_location_container);  }   )

document.querySelector('#tab-2-control-f-btn').addEventListener('click',function() {    $('#pills-place-drop').children().hide(); $('#drop-details-tab-3').show();   show_asset_lib("#id_drop_assets")  }   )
document.querySelector('#tab-2-control-b-btn').addEventListener('click',function() {    $('#pills-place-drop').children().hide(); $('#drop-details-tab-1').show();   }   )

export {checkIfEmpty,get_geocode_locations}