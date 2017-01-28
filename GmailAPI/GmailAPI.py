
from __future__ import print_function
import httplib2
import os

from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage
from apiclient import errors
from googleapiclient.discovery import build

from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import mimetypes
import base64


# Link to secret file
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
json_1 = os.path.join(os.path.dirname(base_dir), 'MakeCalls', 'GmailAPI', 'client_secret.json')

CLIENT_SECRET_FILE = json_1
# This is the file that will be created in ~/.credentials holding your credentials. It will be created automatically
# the first time you authenticate and will mean you don't have to re-authenticate each time you connect to the API.
# Give it a name that is unique to this project
CREDENTIAL_FILE = 'python_gmail_api_credentials.json'

APPLICATION_NAME = 'SellEasy'
# Set to True if you want to authenticate manually by visiting a given URL and supplying the returned code
# instead of being redirected to a browser. Useful if you're working on a server with no browser.
# Set to False if you want to authenticate via browser redirect.
MANUAL_AUTH = True

# If modifying these scopes, delete your previously saved credentials at ~/.credentials/gmail-python-quickstart.json
SCOPES = ['https://mail.google.com/',
          'https://www.googleapis.com/auth/gmail.compose',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://www.googleapis.com/auth/gmail.send']




try:
    import argparse
    flags = tools.argparser.parse_args([])
except ImportError:
    flags = None


class PythonGmailAPI:
    def __init__(self):
        pass

    def gmail_send(self, sender_address, to_address, subject, body):
        print('Sending message, please wait...')
        message = self.__create_message(sender_address, to_address, subject, body)
        credentials = self.get_credentials()
        service = self.__build_service(credentials)
        raw = message['raw']
        raw_decoded = raw.decode("utf-8")
        message = {'raw': raw_decoded}
        message_id = self.__send_message(service, 'me', message)
        print('Message sent. Message ID: ' + message_id)



    def get_credentials(self):
        """Gets valid user credentials from storage.

        If nothing has been stored, or if the stored credentials are invalid,
        the OAuth2 flow is completed to obtain the new credentials.

        Returns:
            Credentials, the obtained credential.
        """
        home_dir = os.path.expanduser('~')
        credential_dir = os.path.join(home_dir, '.credentials')
        if not os.path.exists(credential_dir):
            os.makedirs(credential_dir)
        credential_path = os.path.join(credential_dir,
                                       'gmail-python-quickstart.json')

        store = Storage(credential_path)
        credentials = store.get()
        if not credentials or credentials.invalid:
            flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
            flow.user_agent = APPLICATION_NAME
            if flags:
                credentials = tools.run_flow(flow, store, flags)
            else: # Needed only for compatibility with Python 2.6
                credentials = tools.run(flow, store)
            print('Storing credentials to ' + credential_path)
        return credentials

    def delete_credentials(self):
        """Deletes saved Gmail credentials
        """
        
        try: 
          home_dir = os.path.expanduser('~')
          credential_dir = os.path.join(home_dir, '.credentials')
          credential_path = os.path.join(credential_dir,
                                       'gmail-python-quickstart.json')
          os.remove(credential_path)
          print('Credentials deleted')
        except Exception: 
          print('Could not delete credentials')
        
    def getProfile(self):
      """Obtain Profile infornation
      Args: 
        user_id: The special value 'me' will be used to indicate authenticated user
      """
      credentials = self.get_credentials()
      service = self.__build_service(credentials)
      user_profile = service.users().getProfile(userId='me').execute()
      return user_profile


    def __create_message(self, sender, to, subject, message_text):
      """Create a message for an email.
      Args:
        sender: Email address of the sender.
        to: Email address of the receiver.
        subject: The subject of the email message.
        message_text: The text of the email message.
      Returns:
        An object containing a base64url encoded email object.
      """
      message = MIMEText(message_text, 'plain', 'utf-8')
      message['to'] = to
      message['from'] = sender
      message['subject'] = subject
      encoded_message = {'raw': base64.urlsafe_b64encode(message.as_string())}
      return encoded_message

    def __send_message(self, service, user_id, message):
      """Send an email message.
      Args:
        service: Authorized Gmail API service instance.
        user_id: User's email address. The special value "me"
        can be used to indicate the authenticated user.
        message: Message to be sent.
      Returns:
        Sent Message ID.
      """
      message = (service.users().messages().send(userId=user_id, body=message)
                .execute())
      print('Message Id: %s' % message['id'])
      return message['id']

    def __build_service(self, credentials):
        """Build a Gmail service object.
        Args:
            credentials: OAuth 2.0 credentials.
        Returns:
            Gmail service object.
        """
        http = httplib2.Http()
        http = credentials.authorize(http)
        return build('gmail', 'v1', http=http)

def main():
    sender_address = input('Sender address: ')
    to_address = input('To address: ')
    subject = input('Subject: ')
    body = input('Body: ')
    PythonGmailAPI().gmail_send(sender_address, to_address, subject, body)

if __name__ == '__main__':
    main()
