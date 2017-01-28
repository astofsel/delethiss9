import os
import json
from django.db import IntegrityError
from datetime import datetime
from django.shortcuts import render
from django.views.generic import ListView, View
from models import Lead, Opportunity, Contact, PhoneCall, EmailModel, Task
from permissions import IsOwnerOrReadOnly
from permissions import IsOwnerofLead
from serializers import LeadSerializer, ContactSerializer, TaskSerializer, PhoneCallSerializer, OpportunitySerializer, EmailSerializer  

from django.views.generic.base import TemplateView
from django.shortcuts import render_to_response 
from rest_framework import permissions, viewsets, views, status
from rest_framework.response import Response

from GmailAPI.GmailAPI import PythonGmailAPI

import Contextio.contextio as c

# Remove view invocation
from djng.views.mixins import JSONResponseMixin, allow_remote_invocation

import quotequail


# The below is using the tutorial's ModelViewSet, let's see if it works. 
# creates viewset for Leads to be displayed in the api
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.order_by('name')
    serializer_class = LeadSerializer

    # Should make sure that only user can access their own Leads
    def get_permission(self): 
        return (permissions.IsOwnerofLead(),)

    # associates the lead with an account, and returns it creating back 
    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        return super(LeadViewSet, self).perform_create(serializer)

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.order_by('-DateClose')
    serializer_class = OpportunitySerializer

    def get_permission(self): 
        return (permissions.IsOwnerofOpportunity(),)

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        return super(OpportunityViewSet, self).perform_create(serializer)

class PhoneCallViewSet(viewsets.ModelViewSet):
    queryset = PhoneCall.objects.order_by('-created_at')
    serializer_class = PhoneCallSerializer

    def get_permission(self): 
        return (permissions.IsOwnerofPhoneCall(),)

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        return super(PhoneCallViewSet, self).perform_create(serializer)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.order_by('-created_at')
    serializer_class = TaskSerializer

    def get_permission(self): 
        return (permissions.IsOwnerofTask(),)

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        return super(TaskViewSet, self).perform_create(serializer)

class EmailViewSet(viewsets.ModelViewSet):
    queryset = EmailModel.objects.order_by('-created_at')
    serializer_class = EmailSerializer

    def get_permission(self): 
        return (permissions.IsOwnerofEmail(),)

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        return super(EmailViewSet, self).perform_create(serializer)

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.order_by('-created_at')
    serializer_class = ContactSerializer

    def get_permission(self): 
        return (permissions.IsOwnerofContact(),)

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        return super(ContactViewSet, self).perform_create(serializer)



# Below Viewsets space for nested views

# returns a list of leads that belong to each account 
class AccountLeadViewSet(viewsets.ViewSet):
    queryset = Lead.objects.order_by('name').select_related('owner').all()
    serializer_class = LeadSerializer


    def list(self, request, account_id=None):
        queryset = self.queryset.filter(owner__id=account_id)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class AccountOpportunityViewSet(viewsets.ViewSet):
    queryset = Opportunity.objects.select_related('owner').all()
    serializer_class = OpportunitySerializer


    def list(self, request, account_id=None):
        queryset = self.queryset.filter(owner__id=account_id)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class LeadContactViewSet(viewsets.ViewSet):
    queryset = Contact.objects.order_by('fname').select_related('lead').all()
    serializer_class = ContactSerializer
    

    def list(self, request, Lead_pk=None):
        queryset = self.queryset.filter(lead__pk=Lead_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class ContactPhoneCallViewSet(viewsets.ViewSet):
    queryset = PhoneCall.objects.select_related('contact').all()
    serializer_class = PhoneCallSerializer


    def list(self, request, Contact_pk=None):
        queryset = self.queryset.filter(contact__pk=Contact_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class LeadPhoneCallViewSet(viewsets.ViewSet):
    queryset = PhoneCall.objects.select_related('lead').all()
    serializer_class = PhoneCallSerializer
    

    def list(self, request, Lead_pk=None):
        queryset = self.queryset.filter(lead__pk=Lead_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class LeadEmailViewSet(viewsets.ViewSet):
    queryset = EmailModel.objects.select_related('lead').all()
    serializer_class = EmailSerializer
    

    def list(self, request, Lead_pk=None):
        queryset = self.queryset.filter(lead__pk=Lead_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class AccountEmailViewSet(viewsets.ViewSet):
    queryset = EmailModel.objects.select_related('owner').all()
    serializer_class = EmailSerializer


    def list(self, request, account_id=None):
        queryset = self.queryset.filter(owner__id=account_id)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class AccountPhoneCallViewSet(viewsets.ViewSet):
    queryset = PhoneCall.objects.select_related('owner').all()
    serializer_class = PhoneCallSerializer


    def list(self, request, account_id=None):
        queryset = self.queryset.filter(owner__id=account_id)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class AccountContactViewSet(viewsets.ViewSet):
    queryset = Contact.objects.order_by('fname').select_related('owner').all()
    serializer_class = ContactSerializer


    def list(self, request, account_id=None):
        queryset = self.queryset.filter(owner__id=account_id)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class AccountTaskViewSet(viewsets.ViewSet):
    queryset = Task.objects.select_related('owner').all()
    serializer_class = TaskSerializer


    def list(self, request, account_id=None):
        queryset = self.queryset.filter(owner__id=account_id)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class AccountLeadViewSet(viewsets.ViewSet):
    queryset = Lead.objects.order_by('name').select_related('owner').all()
    serializer_class = LeadSerializer


    def list(self, request, account_id=None):
        queryset = self.queryset.filter(owner__id=account_id)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class LeadTaskViewSet(viewsets.ViewSet):
    queryset = Task.objects.select_related('lead').all()
    serializer_class = TaskSerializer
    

    def list(self, request, Lead_pk=None):
        queryset = self.queryset.filter(lead__pk=Lead_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

class LeadOpportunityViewSet(viewsets.ViewSet):
    queryset = Opportunity.objects.select_related('lead').all()
    serializer_class = OpportunitySerializer
    

    def list(self, request, Lead_pk=None):
        queryset = self.queryset.filter(lead__pk=Lead_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


# testView
class test_gmailApi(JSONResponseMixin, TemplateView): 
    template_name = 'test_gmailApi.html'       


class IndexView(TemplateView): 
    template_name = 'base.html'

class register(TemplateView):
    template_name = 'register.html'

class login(TemplateView):
    template_name = 'login.html'


class profile_settings(TemplateView):
    template_name = 'profile_settings.html'

class next_action(TemplateView):
    template_name = 'next_action.html'

class my_opportunities(TemplateView):
    template_name = 'my_opportunities.html'

class leads_lead(JSONResponseMixin, TemplateView):
    template_name = 'unique_lead.html'

class landing(TemplateView):
    template_name = 'landing.html'
    
    
class nav(JSONResponseMixin, TemplateView): 
    template_name = 'nav.html'



    # Because of the Angular's routes, the remote invocation methods are under navbar 
    # This 'view' is always ON. If the below method is set under leads_leads, then it will return null
    # In other words, all methods that are activated remotely, should be placed below
    @allow_remote_invocation
    def sendEmail(self, in_data):

        print 'sendEmail invoked remotely'
        subject = in_data['email_subject']
        auth_user_email = PythonGmailAPI().getProfile()['emailAddress']
        # sender = 'Anup <tomas.sabat@gmail.com>'
        sender =  in_data['auth_username'] + ' <' + auth_user_email + '>'
        to = in_data['email_to']
        message_text = in_data['email_body']
        PythonGmailAPI().gmail_send(sender, to, subject, message_text)

    @allow_remote_invocation
    def deleteEmail(self, in_data):
        CONSUMER_KEY = "xwjxqe5q"
        CONSUMER_SECRET = "OK1Ro2wUVVw844yt"
        api = c.ContextIO(consumer_key=CONSUMER_KEY, consumer_secret=CONSUMER_SECRET, debug=True)
        auth_user_email = PythonGmailAPI().getProfile()['emailAddress']
        auth_account = api.get_accounts(email=auth_user_email)
        EXISTING_ACCOUNT_ID = auth_account[0].id
        account = c.Account(api, {'id': EXISTING_ACCOUNT_ID})
        selected_message = c.Message(account, {'message_id': in_data['message_id']})
        selected_message.delete()
        return 

    @allow_remote_invocation
    def loginGmail(self):
        PythonGmailAPI().get_credentials()
        auth_user_email = PythonGmailAPI().getProfile()['emailAddress']
        print 'User has (already) been authenticated on Google with email: %s' % auth_user_email
        api = c.ContextIO(consumer_key="xwjxqe5q", consumer_secret="OK1Ro2wUVVw844yt", debug=True)
        account_2 = api.get_accounts(email=auth_user_email)
        try:
            # If no account can be found with auth_user_email, account_2 will give []
            # In order to catch this, we try to through an IndexError if no account exists
            boo = account_2[0]
            print 'Email account already exists on ContextIO'
        except IndexError: 
            print 'Email account does not exist on ContextIO '
            # Now obtaining the refresh_token from /credentials
            home_dir = os.path.expanduser('~')
            credential_dir = os.path.join(home_dir, '.credentials')
            credential_path = os.path.join(credential_dir,
                                           'gmail-python-quickstart.json')       

            with open(credential_path) as json_data:
                credentials_file = json.load(json_data)
            refresh_token_auth_user = credentials_file['refresh_token']

            # Sometimes the OAuth credentials file does not contain a refresh token, so here we try to catch that error 
            if refresh_token_auth_user is not None:
                print 'Refresh token obtained and now authenticated ContextIO and creating account..'
                # Creates account and source on ContextIO
                account = api.post_account(email=auth_user_email, server='imap.gmail.com', username=auth_user_email, use_ssl=1, port=993, 
                    provider_refresh_token=refresh_token_auth_user, type='IMAP', 
                    provider_consumer_key='818251833067-m8263itqgem7krheil71mjocs4onq542.apps.googleusercontent.com')
            else: 
                print 'Refresh token is NONE, cannot create account on ContextIO'


    @allow_remote_invocation
    def deleteCredentials(self):
        PythonGmailAPI().delete_credentials()

    @allow_remote_invocation
    def updateEmailDatabase(self):
        # Below the set up code for context.io
        # Start ContextIO API
        CONSUMER_KEY = "xwjxqe5q"
        CONSUMER_SECRET = "OK1Ro2wUVVw844yt"
        api = c.ContextIO(consumer_key=CONSUMER_KEY, consumer_secret=CONSUMER_SECRET, debug=True)
        # Select Account object ID on ContextIO for the Authenticated user through Gmail API        
        auth_user_email = PythonGmailAPI().getProfile()['emailAddress']
        auth_account = api.get_accounts(email=auth_user_email)
        EXISTING_ACCOUNT_ID = auth_account[0].id
        account = c.Account(api, {'id': EXISTING_ACCOUNT_ID})

        # Get all leads saved
        leads = Lead.objects.all()
        # List of all contact instances
        all_contacts = Contact.objects.all()

        # Going through each contact instance 
        for i in all_contacts:
            # Obtaining lead, id and email of contact 
            contact_email = i.email
            contact_lead = i.lead
            contact_id = i.id
            
            # Fetching all emails using contact's email
            emails_lead = account.get_messages(email=contact_email)
            
            if emails_lead == []:
                print 'contact has no emails'
            else:
                # Loop to save correctly each message of each contact
                for e in emails_lead:
                    # Checking if message already exists
                    try: 
                        EmailModel.objects.get(message_id=e.message_id)
                        print 'message_id already exists'
                    except Exception: 
                        print 'Message is new. First parsing, then saving'
                        # obtaining message_id 
                        email_id = e.message_id
                        # converting email's date
                        email_date_str = str(datetime.fromtimestamp(e.date))
                        email_subject = e.subject

                        
                        # When sending an email thruogh the platform, 
                        # name is not sent out with the email
                        # That's why the KeyError is captured 
                        # Instead of name, the email is saved as the name
                        try: 
                            email_sender_name = e.addresses['to'][0]['name']
                        except KeyError: 
                            email_sender_name = e.addresses['to'][0]['email']
                        email_sender = e.addresses['to'][0]['email']

                        try: 
                            email_from_field_name = e.addresses['from']['name']
                        except KeyError: 
                            email_from_field_name = e.addresses['from']['email']    
                        email_from_field = e.addresses['from']['email']


                        message_object = c.Message(account, {'message_id': e.message_id})
                        message_body = message_object.get_body()                         
                        
                        email_content = message_body[0]['content']

                        try:
                            email_content_without_quotes = quotequail.unwrap(email_content)['text_top']
                        except TypeError:
                            email_content_without_quotes = email_content
                        except KeyError:
                            email_content_without_quotes = email_content
                        
                        email_lead = Lead.objects.get(id=contact_lead.id)
                        email_contact = Contact.objects.get(id=contact_id)

                        emailmodel = EmailModel.objects.create(EmailContent=email_content_without_quotes, lead=contact_lead, contact=email_contact, DateTime=email_date_str, message_id=email_id, subject=email_subject, sender=email_sender, sender_name=email_sender_name, from_field=email_from_field, from_field_name=email_from_field_name)
                        emailmodel.save()

