from django.contrib import admin

from .models import User, Lead, Contact, Task, PhoneCall

class UserAdmin(admin.ModelAdmin):
	list_display = ['name']
	class Meta: 
		model = User

class LeadAdmin(admin.ModelAdmin): 
	list_display = ['name', 'EmailAddress', 'PhoneNumber', 'URL', 'created_at', 'updated_at']
	class Meta: 
		model = Lead

class PhoneCallAdmin(admin.ModelAdmin): 
	list_display = ['DateTime', 'notes', 'lead', 'owner', 'contact', 'duration', 'created_at', 'updated_at']
	class Meta: 
		model = PhoneCall

class ContactAdmin(admin.ModelAdmin): 
	list_display = ['fname', 'lname', 'PhoneNumber', 'email', 'lead', 'created_at', 'updated_at']
	class Meta: 
		model = Contact

class TaskAdmin(admin.ModelAdmin): 
	list_display = ['name', 'description', 'DueDate', 'completed', 'lead', 'owner', 'created_at', 'updated_at']
	class Meta: 
		model = Contact

admin.site.register(User, UserAdmin)
admin.site.register(Lead, LeadAdmin)
admin.site.register(PhoneCall, PhoneCallAdmin)
admin.site.register(Contact, ContactAdmin)
admin.site.register(Task, TaskAdmin)