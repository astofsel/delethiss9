from django.shortcuts import render
from django.views.generic import ListView
from models import Account
from django.views.generic.base import TemplateView
from django.shortcuts import render_to_response 
from rest_framework import permissions, viewsets, views, status

from permissions import IsAccountOwner
from serializers import AccountSerializer
from rest_framework.response import Response
import json 
from django.contrib.auth import authenticate, login

from django.contrib.auth import logout

# Below creates accounts
class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'id'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request :(',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

#Below creates the view for the login view
class LoginView(views.APIView): 

    # because all api calls are blocked unless account is authenticated, we have to 
    # allow a POST request when the user is logging in, obviously 
    def get_permissions(self):
        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    # This just logs the user in a Django session, and returns the account as JSON 
    def post(self, request, format=None):
        print 'post has been called'

        data = json.loads(request.body)
        email = data.get('email', None) 
        password = data.get('password', None)

        account = authenticate(email=email, password=password)

        if account is not None: 
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return Response(serialized.data)
            else: 
                print 'Account is diasbled'
                return Response({
                    'status': 'Unauthorized', 
                    'message': 'This account has been disabled :('
                    }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            print 'Username/password combination invalid'
            return Response({
                'status': 'Unauthorized', 
                'message': 'Username/password combination invalid :('
                }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)