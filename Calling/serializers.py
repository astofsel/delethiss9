from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers 
from Calling.models import Lead, PhoneCall, Contact, Task, Opportunity, EmailModel
from django.contrib.auth.models import User 
from authentication.serializers import AccountSerializer

class LeadSerializer(serializers.HyperlinkedModelSerializer):
	owner = AccountSerializer(read_only=True, required=False)
	
	
	class Meta:
		model = Lead
		fields = ('id', 'owner', 'name', 'EmailAddress', 'PhoneNumber', 'URL', 'created_at', 'updated_at') 
		read_only_fields = ('created_at', 'updated_at')

	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(LeadSerializer, self).get_validation_exclusions()

		# because of nested nested relationships, we must skip owner in the lsit of validation
		return exclusions + ['owner']

	def create(self, validated_data):
			return Lead.objects.create(**validated_data)

class ContactSerializer(serializers.ModelSerializer):
	lead = LeadSerializer(read_only=True, required=False)
	owner = AccountSerializer(read_only=True, required=False)
	lead_id = serializers.PrimaryKeyRelatedField(queryset=Lead.objects.all(), write_only=True)

	class Meta: 
		model = Contact
		fields = ('id', 'fname', 'lname', 'PhoneNumber', 'email', 'lead', 'lead_id', 'owner', 'created_at', 'updated_at')
		read_only_fields = ('created_at', 'updated_at')
	
	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(ContactSerializer, self).get_validation_exclusions()

		return exclusions + ['owner', 'lead', 'contact']

	def create(self, validated_data):
			lead = validated_data.pop('lead_id')
			return Contact.objects.create(lead=lead, **validated_data)

	def update(self, instance, validated_data):
		print validated_data
		try: 
			instance.fname = validated_data.pop('fname')
		except KeyError: 
			pass
		try: 
			instance.lname = validated_data.pop('lname')
		except KeyError: 
			pass
		try: 
			instance.email = validated_data.pop('email')
		except KeyError: 
			pass
		try: 
			instance.PhoneNumber = validated_data.pop('PhoneNumber')
		except KeyError: 
			pass
		try: 
			instance.lead = validated_data.pop('lead_id')
		except KeyError: 
			pass
		instance.save()
		return instance

class PhoneCallSerializer(serializers.ModelSerializer):
	owner = AccountSerializer(read_only=True, required=False)
	lead = LeadSerializer(read_only=True, required=False)
	lead_id = serializers.PrimaryKeyRelatedField(queryset=Lead.objects.all(), write_only=True)
	contact = ContactSerializer(read_only=True, required=False)
	contact_id = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all(), write_only=True)

	class Meta: 
		model = PhoneCall
		fields = ('id', 'DateTime', 'notes', 'lead', 'lead_id', 'owner', 'contact', 'contact_id', 'duration', 'completed', 'created_at', 'updated_at')
		read_only_fields = ('created_at', 'updated_at')
	
	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(PhoneCallSerializer, self).get_validation_exclusions()

		return exclusions + ['owner', 'lead', 'contact']

	def create(self, validated_data):
		contact = validated_data.pop('contact_id')
		lead = validated_data.pop('lead_id')
		return PhoneCall.objects.create(contact=contact, lead=lead, **validated_data)

	def update(self, instance, validated_data):
		instance.DateTime = validated_data.get('DateTime', instance.DateTime)
		instance.save()
		return instance


class TaskSerializer(serializers.ModelSerializer):
	owner = AccountSerializer(read_only=True, required=False)
	lead = LeadSerializer(read_only=True, required=False)
	lead_id = serializers.PrimaryKeyRelatedField(queryset=Lead.objects.all(), write_only=True)
	contact = ContactSerializer(read_only=True, required=False)
	contact_id = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all(), write_only=True)

	class Meta: 
		model = Task
		fields = ('id', 'name', 'description', 'DueDate', 'contact', 'contact_id', 'completed', 'lead', 'lead_id', 'owner', 'created_at', 'updated_at')
		read_only_fields = ('created_at', 'updated_at')
	
	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(TaskSerializer, self).get_validation_exclusions()

		return exclusions + ['owner', 'lead', 'contact']

	def create(self, validated_data):
		print validated_data
		contact = validated_data.pop('contact_id')
		lead = validated_data.pop('lead_id')
		return Task.objects.create(contact=contact, lead=lead, **validated_data)

	def update(self, instance, validated_data):
		instance.completed = validated_data.get('completed', instance.completed)
		instance.DueDate = validated_data.get('DueDate', instance.DueDate)
		instance.save()
		return instance

class OpportunitySerializer(serializers.ModelSerializer):
	owner = AccountSerializer(read_only=True, required=False)
	lead = LeadSerializer(read_only=True, required=False)
	lead_id = serializers.PrimaryKeyRelatedField(queryset=Lead.objects.all(), write_only=True)	

	class Meta: 
		model = Opportunity
		fields = ('id', 'owner', 'lead', 'lead_id', 'size', 'qualify', 'DateClose', 'comments', 'created_at')
		read_only_fields = ('created_at', 'updated_at')
	
	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(OpportunitySerializer, self).get_validation_exclusions()

		return exclusions + ['owner', 'lead']

	def create(self, validated_data):
		print validated_data
		lead = validated_data.pop('lead_id')
		return Opportunity.objects.create(lead=lead, **validated_data)

	def update(self, instance, validated_data):
		try: 
			instance.size = validated_data.pop('size')
		except KeyError: 
			pass
		try: 
			instance.DateClose = validated_data.pop('DateClose')
		except KeyError: 
			pass
		try: 
			instance.comments = validated_data.pop('comments')
		except KeyError: 
			pass
		try: 
			instance.qualify = validated_data.pop('qualify')
		except KeyError: 
			pass
		try: 
			instance.lead = validated_data.pop('lead_id')
		except KeyError: 
			pass
		instance.save()
		return instance

class EmailSerializer(serializers.ModelSerializer):
	owner = AccountSerializer(read_only=True, required=False)
	lead = LeadSerializer(read_only=True, required=False)
	lead_id = serializers.PrimaryKeyRelatedField(queryset=Lead.objects.all(), write_only=True)
	contact = ContactSerializer(read_only=True, required=False)
	contact_id = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all(), write_only=True)

	class Meta: 
		model = EmailModel
		fields = ('message_id', 'sender', 'sender_name', 'from_field', 'from_field_name', 'subject', 'id', 'DateTime', 'notes', 'contact_id', 'EmailContent', 'created_at', 'updated_at', 'lead', 'lead_id', 'owner', 'contact')
		read_only_fields = ('created_at', 'updated_at')
	
	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(EmailSerializer, self).get_validation_exclusions()

		return exclusions + ['owner', 'lead']

	# def update(self, validated_data):
	# 	instance.DateTime = validated_data.get('DateTime', instance.DueDate)
	# 	instance.contact = validated_data.get('contact_id', instance.contact)
	# 	instance.lead = validated_data.get('lead_id', instance.lead)
	# 	instance.save()
	# 	return instance

	def create(self, validated_data):
		DateTime = validated_data.pop('DateTime')
		contact = validated_data.pop('contact_id')
		lead = validated_data.pop('lead_id')
		return EmailModel.objects.create(DateTime=DateTime, contact=contact, lead=lead, **validated_data)