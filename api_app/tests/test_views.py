from django.test import TestCase, RequestFactory,Client

import json
from api_app.views import get_drop_form,get_drops_in_location

class IndexViewTestCase(TestCase):

    def setUp(self):
        self.client=Client()

    def test_index_view_basic(self):
        """
        Test that home view returns a 200 response
        """
        response = self.client.get('/home')
        self.assertEqual(response.status_code, 200)
    
    def test_index_view_basic(self):
        """
        Test that home view uses the correct template
        """
        response = self.client.get('/home')
        self.assertEqual(response.title, "Search")

    def test_wrong_path(self):
        # view not returning error 
        """
        Test that wrong request does not return a 200 response
        """
        request = self.client.get('/xyz?*^%-')
        wrong_path_content='<html><body style="padding:30vh;"><h1>Page not found</h1><h3>404</h3> </body></html>'
        self.assertEqual(response.content, wrong_path_content)

class DropFormTestCase(TestCase):

    def setUp(self):
        self.client=Client()
    
    def test_form_errors(self):
        response=self.client.get('/home')
        # Find whether if there are any errors in the form, using the error field
        #form_content_errors=(reponse.content).find(")
        #form_rendered=False
        self.assertEqual(form_rendered,True)

    def test_form(self):
        """
        Test whether the form generates errors when any of the fields are missing
        """
        pass


class DropLocationTestCase(TestCase):

    def setUp(self):
        self.client=Client()

    def test_view(self):
        '''
        Test that view returns a valid HTML response when sending valid data
        '''

        data=[{'name': 'Sri Sathya Sai Higher Secondary School Vellanad', 'lat': '8.572525', 'lon': '77.04648403'}]
        headers={'Content-Type':'application/json'}
        response=self.client.post('/dropDetails',data,content_type='application/json')
        #response=get_drops_in_location(request)
        print(response)
        self.assertEquals(response.status_code,200)
    
    def test_view_bad_request(self):
        '''
        Test that view returns a invalid response when sending invalid data
        '''

        data=[{'name': 'undefined', 'lat': '', 'lon': '77.04648403'}]
        headers={'Content-Type':'application/json'}
        response=self.client.post('/dropDetails',data,content_type='application/json')
        #response=get_drops_in_location(request)
        print(response)
        self.assertNotEquals(response.status_code,200)