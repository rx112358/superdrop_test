import unittest
from django.test import TestCase

from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located

from django.urls import resolve
#from .views import get_drop_data


class SetPage():

    browser = webdriver.Firefox()

    def startBrowser(self):

        options = Options()
        options.page_load_strategy = 'normal'

        self.browser.firefox_options=options 
        self.browser.implicitly_wait(3)
        self.browser.get('http://127.0.0.1:8000/home')

    def querypage(self):
        self.browser.get('http://127.0.0.1:8000/home')
        assert 'Search' in self.browser.title
        print(" Title is: "+self.browser.title)

    def quitBrowser(self):
        
        self.browser.quit()

class TestDropForm(TestCase):

    s=SetPage()


    def test_getSearch(self):

        self.s.startBrowser()
        web=self.s.browser

        '''
        <input class="leaflet-locationiq-input" spellcheck="false" title="Search" placeholder="Search">
        '''

        WebDriverWait(web,timeout=3).until(  lambda web: web.find_element(By.CLASS_NAME,'leaflet-locationiq-input') )
        search_box_input=web.find_element(By.CLASS_NAME,'leaflet-locationiq-input')
        search_box_input.send_keys("triv")

        # wait until the api returns search reults for the given input
        WebDriverWait(web,timeout=3).until( lambda web:web.find_element(By.CLASS_NAME,'leaflet-locationiq-results' ))
        results=web.find_element(By.CLASS_NAME,'leaflet-locationiq-results' )
        web.implicitly_wait(5)
        
        #get the first result value
        result=web.find_element(By.CLASS_NAME,'leaflet-locationiq-result')
        selected_result_class='leaflet-locationiq-result leaflet-locationiq-selected'

        change_class_script='arguments[0].setAttribute(arguments[1], arguments[2])'

        web.implicitly_wait(5)
        web.execute_script(change_class_script,result,'class',selected_result_class)

        web.implicitly_wait(5)
        result.click()
    
        # click done when the search result is selected
        #   <button class="btn" id="search-userLocation-btn">Done</button>

        search_submit_btn=web.find_element(By.ID,'search-userLocation-btn')

        web.implicitly_wait(5)
        search_submit_btn.click()

        #web.quit()

    '''

    def test_drop_form(TestCase):

        # wait till the form is found
        WebDriverWait(web,timeout=3).until( lambda web:web.find_element(BY.ID,'drop_data_form') )
        
        # Enter in test details

        title          = 'drop_title'
        category       = 'drop_category'
        type           = 'drop_type'
        url            = 'https://testurl.com'             
        description    = 'test_description'


        # test if form works with valid input

        
        # test if form reports when invalid/missing input is given

    '''





if __name__=='__main__':
    unittest.main(warnings='ignore')








