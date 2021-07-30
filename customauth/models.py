from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.db import models

from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, first_name,last_name,email,password,**extra_fields):
        """
        Creates and saves a User with the given email
        """
        if not email:
            raise ValueError('Users must have an email address')

        email=self.normalize_email(email)
        user = self.model(
            first_name=first_name,last_name=last_name,email=email
        )

        print(email)
        print(password)
        
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_admin', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(first_name='',last_name='',email=email,password=password, **extra_fields)

class DropUser(AbstractBaseUser,PermissionsMixin):

    first_name=models.CharField(max_length=200,unique=False,null=True)
    last_name =models.CharField(max_length=200,unique=False,null=True)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    #user_name=models.CharField()
    #user_profile=models.ImageField()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email



