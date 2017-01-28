from __future__ import unicode_literals
from django.utils import timezone
import datetime 
from django.db import models
from django import forms 
from datetime import datetime
import uuid
from authentication.views import Account


class User(models.Model): 
	name = models.CharField(max_length=50)

# Used to be CallAccount
class Lead(models.Model): 
	# defines to which account it belongs
	owner = models.ForeignKey(Account, blank=True, null=True)
	name = models.CharField(max_length=100)
	EmailAddress = models.email = models.EmailField(max_length=254)
	PhoneNumber = models.DecimalField(max_digits=15, decimal_places=0)
	URL = models.CharField(max_length=200, null=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __unicode__(self):
		return self.name

class PhoneCall(models.Model): 
	DateTime = models.DateTimeField(default=datetime.now, blank=True, null=True)
	notes = models.CharField(max_length=10000)
	lead = models.ForeignKey('Lead', blank=True, null=True)
	owner = models.ForeignKey(Account, blank=True, null=True)
	contact = models.ForeignKey('Contact', blank=True, null=True)
	duration = models.DurationField(null=True)
	completed = models.BooleanField()

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

class Contact(models.Model):
	fname = models.CharField(max_length=100)
	lname = models.CharField(max_length=100)
	PhoneNumber = models.DecimalField(max_digits=20, decimal_places=0)
	email = models.email = models.EmailField(max_length=254)
	owner = models.ForeignKey(Account, blank=True, null=True)
	lead = models.ForeignKey('Lead', blank=True, null=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __unicode__(self):
		return self.lname

class Task(models.Model):
	name = models.CharField(max_length=1000)
	DueDate = models.DateTimeField(blank=True, null=True)
	description = models.TextField()	
	completed = models.BooleanField(default=False)
	
	contact = models.ForeignKey('Contact', blank=True, null=True)
	lead = models.ForeignKey('Lead', blank=True, null=True)
	owner = models.ForeignKey(Account, blank=True, null=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __unicode__(self):
		return self.name

class Opportunity(models.Model):
	owner = models.ForeignKey(Account, blank=True, null=True)
	lead = models.ForeignKey('Lead', blank=True, null=True)
	size = models.DecimalField(max_digits=15, decimal_places=2)
	qualify = models.CharField(max_length=100)
	DateClose = models.DateTimeField(blank=True, null=True)
	comments = models.CharField(max_length=1000, null=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __unicode__(self):
		return self.lead

class EmailModel(models.Model): 
	notes = models.CharField(max_length=10000, null=True)
	
	contact = models.ForeignKey('Contact', blank=True, null=True)
	lead = models.ForeignKey('Lead', blank=True, null=True)
	owner = models.ForeignKey(Account, blank=True, null=True)

	message_id = models.CharField(max_length=1000, null=False, unique=True)
	DateTime = models.DateTimeField(blank=True, null=True)
	sender = models.CharField(max_length=1000, null=True)
	sender_name = models.CharField(max_length=1000, null=True)
	from_field = models.CharField(max_length=1000, null=True)	
	from_field_name = models.CharField(max_length=1000, null=True)
	subject = models.CharField(max_length=1000, null=True)
	EmailContent = models.TextField(max_length=10000)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __unicode__(self):
		return self.lead

