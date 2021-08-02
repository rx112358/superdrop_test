from django.shortcuts import render,redirect,reverse
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib import auth
from django.contrib.auth import login,authenticate,logout
from django.contrib import messages 
from django.contrib.auth.forms import AuthenticationForm 
from .auth_forms import SignUpForm,LogInForm
from .models import DropUser

def get_user_id(request,email):

    '''
    Set user id in the session cookie
    '''
    d = DropUser.objects.get(email=email)
    request.session['user_id'] = d.id

def test_cookies(request):

    '''
    Testing if cookies are allowed, otherwise ask user to enable it
    '''

    if request.session.test_cookie_worked():
            request.session.delete_test_cookie()
    else:
        return HttpResponse("Please enable cookies and try again.")


def user_register(request):

    if request.method == "POST":
        first_name = request.POST.get('first_name')
        last_name  = request.POST.get('last_name')
        email      = request.POST.get('email')
        password   = request.POST.get('password')
        print(email, password)
        
        user = DropUser.objects.create_user(first_name=first_name,last_name=last_name,email=email,password=password)

        print(user)
        login(request, user)

        messages.success(request, "Registration successful." )
        get_user_id(request,email)

        return redirect(reverse('home'))
    
    messages.error(request, "Unsuccessful registration. Invalid information.")

    return render(request, 'register.html')

def user_login(request):

    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')
        print(email, password)
        user = authenticate(email=email, password=password)
        print(user)
        if user is not None:
            login(request, user)
            get_user_id(request,email)
  
            print('User found')
            return redirect(reverse('home'))
        # Return an 'invalid login' error message.
        messages.error(request, "Unsuccessful registration. Invalid information.")
            
    return render(request,"login.html")

def user_logout(request):

    logout(request)
    return render(request, 'home.html')
