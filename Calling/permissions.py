from rest_framework import permissions 

class IsOwnerOrReadOnly(permissions.BasePermission):

	def has_object_permission(self, request, view, obj): 

		# if request.method in permissions.SAFE_METHODS:
		# 	return True 
		# return obj.owner == request.user 

		if request.method == 'DELETE':
			return True
		else:
			return request.user == obj

class IsOwnerofLead(permissions.BasePermission):
	def has_object_permission(self, request, view, post):		
		if request.user:
			return Lead.owner == request.user
		return False


class IsOwnerofOpportunity(permissions.BasePermission):
	def has_object_permission(self, request, view, post):		
		print 'has object permission'
		if request.user:
			return Opportunity.owner == request.user
		return False


class IsOwnerofPhoneCall(permissions.BasePermission):
	def has_object_permission(self, request, view, post):		
		print 'has object permission'
		if request.user:
			return PhoneCall.owner == request.user
		return False


class IsOwnerofTask(permissions.BasePermission):
	def has_object_permission(self, request, view, post):		
		print 'has object permission'
		if request.user:
			return Task.owner == request.user
		return False

class IsOwnerofEmail(permissions.BasePermission):
	def has_object_permission(self, request, view, post):		
		print 'has object permission'
		if request.user:
			return Email.owner == request.user
		return False

class IsOwnerofContact(permissions.BasePermission):
	def has_object_permission(self, request, view, post):		
		print 'has object permission'
		if request.user:
			return Contact.owner == request.user
		return False