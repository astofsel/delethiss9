
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth.models import User

from Calling.views import nav, IndexView, register, login, LeadViewSet, AccountLeadViewSet, profile_settings, next_action, my_opportunities, leads_lead, test_gmailApi, landing
from Calling.views import LeadViewSet, OpportunityViewSet, PhoneCallViewSet, TaskViewSet, EmailViewSet, ContactViewSet, LeadContactViewSet, ContactPhoneCallViewSet, LeadPhoneCallViewSet, AccountPhoneCallViewSet, LeadEmailViewSet, AccountEmailViewSet, AccountTaskViewSet, LeadTaskViewSet, AccountContactViewSet, AccountOpportunityViewSet, LeadOpportunityViewSet

from django.conf.urls import *
from rest_framework import routers
from rest_framework_nested import routers
from authentication.views import AccountViewSet, LoginView, LogoutView 


# Below normal API routers for serializers. Note that Emails is called EmailModel in the models
router = routers.DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'Leads', LeadViewSet) 
router.register(r'Opportunities', OpportunityViewSet) 
router.register(r'PhoneCalls', PhoneCallViewSet) 
router.register(r'Tasks', TaskViewSet) 
router.register(r'Emails', EmailViewSet) 
router.register(r'Contacts', ContactViewSet) 

# Below go the nested routers 
# The below creates the following route: /api/v1/accounts/<pk>/CallAccounts/<pk>
accounts_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')   
accounts_router.register(r'Leads', AccountLeadViewSet)


ContactPhoneCall_router = routers.NestedSimpleRouter(router, r'Contacts', lookup='Contact')   
ContactPhoneCall_router.register(r'PhoneCalls', ContactPhoneCallViewSet)


AccountsPhoneCall_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')   
AccountsPhoneCall_router.register(r'PhoneCalls', AccountPhoneCallViewSet)

AccountsEmail_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')   
AccountsEmail_router.register(r'Emails', AccountEmailViewSet)

AccountsTask_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')   
AccountsTask_router.register(r'Tasks', AccountTaskViewSet)

AccountsContact_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')   
AccountsContact_router.register(r'Contacts', AccountContactViewSet)

AccountsOpportunity_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')   
AccountsOpportunity_router.register(r'Opportunities', AccountOpportunityViewSet)


LeadContact_router = routers.NestedSimpleRouter(router, r'Leads', lookup='Lead')   
LeadContact_router.register(r'Contacts', LeadContactViewSet)

LeadPhoneCall_router = routers.NestedSimpleRouter(router, r'Leads', lookup='Lead')   
LeadPhoneCall_router.register(r'PhoneCalls', LeadPhoneCallViewSet)

LeadEmail_router = routers.NestedSimpleRouter(router, r'Leads', lookup='Lead')   
LeadEmail_router.register(r'Emails', LeadEmailViewSet)

LeadTask_router = routers.NestedSimpleRouter(router, r'Leads', lookup='Lead')   
LeadTask_router.register(r'Tasks', LeadTaskViewSet)

LeadOpportunity_router = routers.NestedSimpleRouter(router, r'Leads', lookup='Lead')   
LeadOpportunity_router.register(r'Opportunities', LeadOpportunityViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', landing.as_view()),

    # nav bar URLs
    url(r'^app/$', nav.as_view()),

    #new web app URLs
    url(r'^app/next_action/$', next_action.as_view()),    
    url(r'^app/my_opportunities/$', my_opportunities.as_view()),
    url(r'^app/leads/', leads_lead.as_view()),
    url(r'^app/profile_settings/$', profile_settings.as_view()),

    # Registration, login, etc
    url(r'^register/$', register.as_view()),
    url(r'^login/$', login.as_view()), 
    url(r'^test/$', test_gmailApi.as_view()), 


    # Main API URLs
	url(r'^api/v1/', include(router.urls)),
    # Nested URLs
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/', include(ContactPhoneCall_router.urls)),
    url(r'^api/v1/', include(AccountsPhoneCall_router.urls)),
    url(r'^api/v1/', include(AccountsEmail_router.urls)),
    url(r'^api/v1/', include(AccountsTask_router.urls)),
    url(r'^api/v1/', include(AccountsContact_router.urls)),
    url(r'^api/v1/', include(AccountsOpportunity_router.urls)),

    url(r'^app/api/v1/', include(LeadOpportunity_router.urls)),
    url(r'^app/api/v1/', include(LeadContact_router.urls)),
    url(r'^app/api/v1/', include(LeadPhoneCall_router.urls)),
    url(r'^app/api/v1/', include(LeadEmail_router.urls)),
    url(r'^app/api/v1/', include(LeadTask_router.urls)),

    # To build an OAuth2 provider. Not sure this will be needed eventually
    url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),

    # Login APIs
	url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
	url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
	url(r'^,*$', IndexView.as_view(), name='index'),
]

