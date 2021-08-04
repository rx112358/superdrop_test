from django.db import models
from django.forms import ModelForm
from customauth.models import DropUser

class DropLocation(models.Model):

    drop_long   =models.FloatField()
    drop_lat    =models.FloatField()
    drop_locname=models.CharField(max_length=200,default=" ")
        
class Drop(models.Model):

    cat_Animation ='0'
    cat_Art       ='1'
    cat_Video     ='2'
    cat_Nft       ='3'
    cat_Image     ='4'
    cat_Links     ='5'    

    '''  

    type_Website   ='WEB'
    type_Youtube   ='YT'
    type_Image     ='IMG'
    type_Animation ='ANI'
    type_Audio     ='AUD'

    '''

    category_choices = [
        
        ( cat_Animation , 'Animation'   ),
        ( cat_Art       , 'ART'         ),
        ( cat_Video     , 'Video'       ),
        ( cat_Nft       , 'NFT'         ),
        ( cat_Image     , 'Image'       ),
        ( cat_Links     , 'Links'       ),
    ]

    '''
    type_choices=[
    ( type_Website    , 'Website'      ),
    ( type_Youtube    , 'Youtube Video'),
    ( type_Image      , 'Photo'         ),
    ( type_Animation  , 'Animation'   ),
    ( type_Audio      , 'Audio'           )
    ]
    '''

    user=models.ForeignKey(DropUser, on_delete=models.CASCADE,null=True)

    drop_title=models.CharField(" Title ",max_length=200)
    
    # category choices
    drop_category=models.CharField(" Category ",
        max_length=60,
        choices=category_choices,
        default=cat_Animation,
    )

    '''
    # type choices
    drop_type=models.CharField(" Type of drop ",
        max_length=30,
        choices=type_choices,
        default=type_Website,
    )
    '''

    drop_description=models.TextField(" Add Description ")

    drop_url=models.URLField(" Paste your link here ",null=True,blank=True)

    drop_file=models.FileField(upload_to='media',null=True,blank=True)

    drop_asset=models.CharField(" Choose your asset ",max_length=200,default='asset_1')

    drop_loc=models.ManyToManyField(DropLocation,null=True)
    
