import unittest
from django.test import TestCase

import selenium

from django.urls import resolve

from api_app.views import get_drop_form

class TestUrls(unittest.TestCase):

    def test_homePage(self):

        home=resolve('/home')
        self.assertEqual(home.func,get_drop_form)