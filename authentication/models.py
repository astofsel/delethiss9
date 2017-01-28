from __future__ import unicode_literals
from django.utils import timezone
import datetime 
from django.db import models
from django import forms 
from datetime import datetime
import uuid

from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.contrib.auth.models import BaseUserManager

# The in built User model in Django does not allow for any additional information
# However it inherits from AbstractBaseUser. So that will be used to 
# create a new model called Account. 


class AccountManager(BaseUserManager):
	def create_user(self, email, password=None, **kwargs):
		if not email:
			raise ValueError('Users must have a valid email address :)')

		if not kwargs.get('username'):
			raise ValueError('Users must have a valid username :)')

		account = self.model(
			email=self.normalize_email(email), username=kwargs.get('username')
		)

		account.set_password(password)
		account.save()

		return account

	def create_superuser(self, email, password, **kwargs):
		account = self.create_user(email, password, **kwargs)

		account.is_admin = True
		account.save()

		return Account

class Account(AbstractBaseUser):
	email = models.EmailField(unique=True)
	username = models.CharField(max_length=40, unique=True)

	name = models.CharField(max_length=40, blank=True)

	is_admin = models.BooleanField(default=False)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	objects = AccountManager()

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	def __unicode__(self):
		return self.email

	def get_full_name(self): 
		return ' '.join([self.name])