import os

# from django.core.wsgi import get_wsgi_application
from configurations.wsgi import get_wsgi_application

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kebek.config')
os.environ.setdefault('DJANGO_CONFIGURATION', 'Production')

application = get_wsgi_application()
