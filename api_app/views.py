#from django.shortcuts import render
from django.views import View
from django.http import HttpResponse,HttpResponseNotFound
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt,csrf_protect

from django.contrib import messages

from django.db.models import Count

from django.shortcuts import redirect

import json
from django.core import serializers

from .models import Drop,DropLocation
from .forms import DropForm

from customauth.models import DropUser

# Test view 
def test_view(View):

    return HttpResponse('<html><body>Test view</body></html>')

def wrong_path(View):

    '''
    Wrong url paths should return a custom HTTP 404 error page

    '''

    return HttpResponse('<html><body style="padding:30vh;"><h1>Page not found</h1><h3>404</h3> </body></html>')

#@login_required(login_url='/accounts/login/')
def get_drop_form(request):
    '''

    Creating an empty drop form object that is rendered with the home page

    '''
    response=render(request, "index.html")
    return response

@csrf_exempt
def create_drop(request):

    '''
    Creating drop data object from the drop data form values, only if the form is valid
    Any other reponse, should return HTTP 404 error
    '''

    if request.method == 'POST':

        # Getting the drop data - store in Drop models

        title          = request.POST.get('drop_title')
        category       = request.POST.get('drop_category')
        url            = request.POST.get('drop_url')
        asset_id       = request.POST.get('drop_asset_id')
        description    = request.POST.get('drop_description')
        drop_location_data=json.loads(request.POST.get('drop_locations'))

        #user_id=request.session['user_id']
        user_id=1
        user=DropUser.objects.get(id=user_id)

        drop=Drop(user=user,
        drop_title = title,
        drop_category   = category    ,
        drop_url        = url         ,
        drop_asset=asset_id        ,
        drop_description= description )

        print(drop)

        drop.save()

        for venue in drop_location_data:

            name    =        venue['name']
            lat     = float( venue['lat'] )
            lon     = float( venue['lon'] )

            drop_location_obj=DropLocation.objects.create(drop_long=lon,drop_lat=lat,drop_locname=name)
            drop.drop_loc.add(drop_location_obj)

        '''

        for asset_id in assets_id_list:

            drop_assets_obj=DropAsset.objects.create(drop_asset=asset_id)
            drop.drop_assets.add(drop_assets_obj)
        '''
    
        return JsonResponse({"dropId":drop.id},status=200)

    else:

        return HttpResponseNotFound()

@csrf_exempt
def update_drop(request):

    '''
    Updating drop data object from the drop data form values, only if the form is valid
    Any other reponse, should return HTTP 404 error
    '''

    #user_id=request.session['user_id']
    user_id=1
    user=DropUser.objects.get(id=user_id)

    if request.method == 'POST':

        # Getting the drop data - store in Drop models

        drop_id        = request.POST.get('drop_id')
        title          = request.POST.get('drop_title')
        category       = request.POST.get('drop_category')
        url            = request.POST.get('drop_url')
        asset_id       = request.POST.get('drop_asset_id')
        description    = request.POST.get('drop_description')
        drop_location_data=json.loads(request.POST.get('drop_locations'))

        try:
            drop=Drop.objects.get(pk=drop_id)
            drop.drop_title = title
            drop.drop_category   = category           
            drop.drop_url        = url         
            drop.drop_asset=asset_id        
            drop.drop_description= description 

            drop.save()

            for venue in drop_location_data:

                name    =        venue['name']
                lat     = float( venue['lat'] )
                lon     = float( venue['lon'] )

                drop_location_obj=DropLocation.objects.create(drop_long=lon,drop_lat=lat,drop_locname=name)
                drop.drop_loc.add(drop_location_obj)

        except Drop.DoesNotExist:
            print('Drop not found')
            return JsonResponse({"Drop not found":drop.id},status=200)
    
        return JsonResponse({"dropId":drop.id},status=200)

    elif request.method=='DELETE':

        try:
            drop_id=json.loads(request.body)
        except ValueError:  # includes simplejson.decoder.JSONDecodeError
            print('Decoding JSON has failed')

        drop = Drop.objects.get(pk=drop_id)
        if drop:
            drop.delete()
        return JsonResponse({drop_id:" The drop is deleted "},status=200)


@csrf_exempt
def get_drops_in_location(request):

    '''
    Get all the drop data in a particular location
    
    '''
    location_drops=[]

    if request.method=="POST":

        data=json.loads(request.body)
        print(data)

        for location_details in data:

            name=location_details['name']
            lat =location_details['lat']
            lon =location_details['lon']

            drop_data = Drop.objects.filter(drop_loc__drop_locname=name).values()

            if drop_data.exists():
                location_drops.append(drop_data)

        if  len(location_drops)>0:
            user_drops=list(location_drops)

            print(user_drops)

            context={'drops':user_drops}

            return render(request,"view_location_drops.html",context)
        else:
            return HttpResponse('<html><body>No drops in the area</body></html>')

@csrf_exempt
def get_user_drops(request):

    '''
    Get all the drop data of a particular user
    
    '''

    user_drops=[]

    if request.method=="GET":

        #user_id=request.session['user_id']
        user_id=1

        drop_data = Drop.objects.filter(user__pk=user_id).values()

        print(drop_data)

        if drop_data.exists():
            user_drops=list(drop_data)

        print(user_drops)

        context={'drops':user_drops}

        return render(request,"view_drops.html",context)

@csrf_exempt
def get_drop(request):

    if request.method=='POST':

        '''
        Get the drop whose id is selected
        
        '''
        print(request.body)
        data=json.loads(request.body)
        drop_id=data[0]["drop id"]
        
        drop_locations=[]
        user_drop= Drop.objects.filter(pk=drop_id).values()
        drop=list(user_drop)[0]    
        locations = Drop.objects.filter(pk=drop_id).values("drop_loc__drop_locname","drop_loc__pk")
        for location in locations:
            drop_locations.append({"location_name":location['drop_loc__drop_locname'],"location_id":location['drop_loc__pk']})

        context = {'drop':drop,'locations': drop_locations }
        return render(request,"drop_details.html",context)

@csrf_exempt
def remove_drop_location(request):

    '''
    Delete the location whose id is selected
    
    '''
    #print(request.body)
    location_id=json.loads(request.body)

    if request.method=='DELETE':

        location = DropLocation.objects.get(pk=location_id)
        location.delete()
        return JsonResponse({location_id:" The location is deleted "},status=200)

@csrf_exempt
def get_popular_locations(request):

    '''
    Get all distinct locations ordered by popularity
    
    '''
    popular_locations=DropLocation.objects.values().annotate(popularity_count=Count('drop_locname')).order_by('-popularity_count').distinct()[:6]
    return JsonResponse(list(popular_locations),status=200,safe=False)
