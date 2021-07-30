from django.test import TestCase
from django.db.models.query import QuerySet

from api_app.models import User,Drop,DropLocation


class DropTest(TestCase):

    def test_object_create(self):
        '''
        Test that a object Drop is created
        '''
        self.drop=Drop.objects.create(drop_title="test_drop",drop_category='0',drop_type="WEB",drop_url="https://test_url.com",drop_description="test_description")
        
        d=Drop.objects.filter(drop_title="test_drop",drop_category='0',drop_type="WEB",drop_url="https://test_url.com",drop_description="test_description")
        self.assertIsNot(type(d),QuerySet)

    def test_object_create_missing_fields(self):
        '''
        Test that a object Drop is not created when field is missing
        '''
        drop=Drop.objects.create(drop_category='0',drop_type="WEB",drop_url="https://test_url.com",drop_description="test_description")
        self.assertIsNot(type(drop),QuerySet)
    
    def test_object_create_wrong_category(self):
        '''
        Test thatDrop object creation fails when wrong category is given
        '''
        drop=Drop.objects.create(drop_title="test_drop",drop_category='100',drop_type="WEB",drop_url="https://test_url.com",drop_description="test_description")
        self.assertIsNot(type(drop),QuerySet)

    def test_object_create(self):
        '''
        Test that Drop object creation fails when wrong drop_type is given
        '''
        drop=Drop.objects.create(drop_title="test_drop",drop_category='0',drop_type="XYZ",drop_url="https://test_url.com",drop_description="test_description")
        self.assertIsNot(type(drop),QuerySet)

class DropLocationTest(TestCase):

    def test_object_create(self):
        '''
        Test that a object Drop is created
        '''
        self.drop_location=DropLocation.objects.create(drop_long=0,drop_lat=0,drop_locname="Test location")
        
        d=DropLocation.objects.filter(drop_long=0,drop_lat=0,drop_locname="Test location")
        
        self.assertIs(type(d),QuerySet)

    def test_object_create_missing_fields(self):
        '''
        Test that a object Drop is not created when field is missing
        '''
        drop_location=DropLocation.objects.create()
        self.assertIsNot(type(drop_location),QuerySet)
    
    def test_object_create_wrong_lat_datatype(self):
        '''
        Test thatDrop object creation fails when wrong category is given
        '''
        drop_location=DropLocation.objects.create(drop_long="9",drop_lat=0,drop_locname="Test location")
        self.assertIsNot(type(drop_location),QuerySet)

    def test_object_create_wrong_locname_datatype(self):
        '''
        Test that Drop object creation fails when wrong drop_type is given
        '''
        drop_location=DropLocation.objects.create(drop_long=0,drop_lat=0,drop_locname=9999)
        self.assertIsNot(type(drop_location),QuerySet)
     
                

