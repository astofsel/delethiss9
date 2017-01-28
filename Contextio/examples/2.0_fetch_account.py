import helpers
import contextio as c


CONSUMER_KEY = "xwjxqe5q"
CONSUMER_SECRET = "OK1Ro2wUVVw844yt"
EXISTING_ACCOUNT_ID = "587bd27deecf3723365bf7d8" # see the ContextIO dev console

api = c.ContextIO(consumer_key=CONSUMER_KEY, consumer_secret=CONSUMER_SECRET, debug=True)

account = c.Account(api, {"id": EXISTING_ACCOUNT_ID})

message = c.Message(account, {'message_id': '587bd3656f1c820001bae6c3'})

body = message.get_body()

content = body[0]['content'].encode('utf-8')


# helpers.headerprint("FETCHING ACCOUNT INFO (Lite API)")

# account.get()

# helpers.cprint("id", account.id)
# helpers.cprint("username", account.username)
# helpers.cprint("created", account.created)
# helpers.cprint("suspended", account.suspended)
# helpers.cprint("email_addresses", account.email_addresses)
# helpers.cprint("first_name", account.first_name)
# helpers.cprint("last_name", account.last_name)
# helpers.cprint("password_expired", account.password_expired)
# helpers.cprint("sources", account.sources)
# helpers.cprint("resource_url", account.resource_url)
# print "\n"

