from django import forms
from django.db import models

from django.contrib.auth.forms import UserCreationForm
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout,Submit

from .models import DropUser

class SignUpForm(UserCreationForm):

  class Meta:
    model = DropUser
    fields = ['first_name','last_name','email','password1', 'password2']

  '''


  def __init__(self, *args, **kwargs):
      super().__init__(*args, **kwargs)
      self.helper = FormHelper()    
      self.helper.form_method = 'post'
      self.helper.form_class = 'form-horizontal'
      self.helper.label_class = 'col-lg-2 pb-2 pt-2'
      self.helper.field_class = 'col-lg-8 pb-2 pt-2'

      self.helper.layout = Layout(         
        'name','email', 'number','gender','password1', 'password2',
          Submit('submit', 'Submit')
        )
  '''
        
class LogInForm():

  class Meta:
    model = DropUser
    fields = ['email', 'password1']

  '''


  def __init__(self, *args, **kwargs):
      super().__init__(*args, **kwargs)
      self.helper = FormHelper()     
      self.helper.form_method = 'post'
      self.helper.form_class = 'form-horizontal'
      self.helper.label_class = 'col-lg-2 pb-2 pt-2'
      self.helper.field_class = 'col-lg-8 pb-2 pt-2'

      self.helper.layout = Layout(        
        'username',    
        'password1', 
        Submit('submit', 'Submit')
      )
  '''