import os
from dotenv import load_dotenv

load_dotenv()

ADA_USER = os.getenv('ADA_USER')
ADA_KEY  = os.getenv('ADA_KEY')
SERVER_HOST = os.getenv('SERVER_HOST')
SERVER_PORT = os.getenv('SERVER_PORT')