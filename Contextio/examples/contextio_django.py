import helpers
import Contextio.contextio as c
# import contextio as c

def getLucyEmails():
	CONSUMER_KEY = "xwjxqe5q"
	CONSUMER_SECRET = "OK1Ro2wUVVw844yt"
	EXISTING_ACCOUNT_ID = "587bd27deecf3723365bf7d8" # see the ContextIO dev console

	CONTEXTIO_API_URL = 'https://api.context.io/2.0/accounts/587bd27deecf3723365bf7d8/messages/587c0d9a6f1c820001c21503/body'

	api = c.ContextIO(consumer_key=CONSUMER_KEY, consumer_secret=CONSUMER_SECRET, debug=True)


	account = c.Account(api, {'id': '587bd27deecf3723365bf7d8'})

	print 'getting messages from Lucy'
	# This gets all messages in my account from Lucy
	a = account.get_messages(email='lucy@bridge-u.com')



	# Below creates a list of tuples with date and message_ids 
	email_date_id = []
	
	print 'creating email_date_id'
	for i in a:
		print 'processing..'
		obj = {}
		obj['date'] = i.date
		obj['message_id'] = i.message_id

		if obj

		message_object = c.Message(account, {'message_id': i.message_id})
		message_body = message_object.get_body()
		message_body_content = message_body[0]['content'].encode('utf-8')

		obj['EmailContent'] = message_body_content

		email_date_id.append(obj)


	return email_date_id





# account = c.Account(api, {"id": EXISTING_ACCOUNT_ID})

# helpers.headerprint("FETCHING ACCOUNT INFO (Lite API)")

# account.get()

# helpers.cprint("id", account.id)
# helpers.cprint("username", account.username)
# helpers.cprint("created", account.created)
# helpers.cprint("suspended", account.suspended)
# helpers.cprint("email_addresses", account.email_addresses)
# # helpers.cprint("first_name", account.first_name)
# helpers.cprint("last_name", account.last_name)
# helpers.cprint("password_expired", account.password_expired)
# helpers.cprint("sources", account.sources)
# helpers.cprint("resource_url", account.resource_url)
# print "\n"

