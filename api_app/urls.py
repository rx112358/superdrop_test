from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views import test_view,wrong_path, create_drop, update_drop, get_drop, get_user_drops,get_drops_in_location, get_popular_locations,get_drop_form,remove_drop_location

from django.http import HttpResponseNotFound

urlpatterns = [
    path('home', get_drop_form, name="home"),
    path('createDrop', create_drop, name="createDrop"),
    path('updateDrop', update_drop, name="updateDrop"),
    path('dropDetails',get_drops_in_location,name="dropDetails"),
    path('userdropDetails',get_user_drops,name="user-details"),
    path('userDrop',get_drop,name="user-drop"),
    path('updateLocation',remove_drop_location),
    path('trendingLocations',get_popular_locations)
]
