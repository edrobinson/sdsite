'''
Application configuration file
'''
SECRET_KEY = "secretkey"

DATABASE = "./db/sddb.sqlite3"
HELPFOLDER = "./static/adminhelp"
BOOKDOCS = "./text-files/books/" 
POEMDOCS = "./text-files/poems/"
IMAGEPATH = "./static/assets/img/"

#Session control
SESSION_PERMANENT = False
SESSION_TYPE = "filesystem" 
SESSION_FILE_DIR = './sessions'

#Flask Mail config options
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 465
MAIL_USE_TLS = False
MAIL_USE_SSL = True
MAIL_USERNAME = 'edrobinsonjr@gmail.com'
MAIL_PASSWORD = 'degz ofjc lqsc plvp'
MAIL_DEFAULT_SENDER = 'edrobinsonjr@gmail.com'

SITE_OWNER = 'Sharla'
SITE_OWNER_EMAIL = 'edrobinsonjr@gmail.com' #Change for production
CONTACTEMAIL = " sharladawnpoet@gmail.com"