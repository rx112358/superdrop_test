from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit,Layout,Row,Column

from .models import Drop

class DropForm(forms.ModelForm):

    class Meta:

        model=Drop
        fields="__all__"
        exclude=['user','drop_loc']