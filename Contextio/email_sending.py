# import smtplib

# from email.mime.text import MIMEText

# msg = MIMEText('LKAJDFA;LSDFN;')
# msg['Subject'] = "Hello"
# msg['From']    = "businessnetworkingclub@gmail.com"
# msg['To']      = "businessnetworkingclub@gmail.com"

# s = smtplib.SMTP('smtp.mailgun.org', 587)

# s.login('postmaster@sandboxf33606d7538f47f393f77e06f6c8b8f8.mailgun.org', 'fa32154d78ef52763415984a132d7692')
# s.sendmail(msg['From'], msg['To'], msg.as_string())
# s.quit()


from django.core.mail import send_mail

send_mail(
	'Test Subject', 
	'Hello how are you?',
	'tomas@gmail.com'
	['tomas.sabat@gmail.com'],
	fail_silently=False,
)