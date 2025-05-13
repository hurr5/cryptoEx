from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crypto_backend.settings')

app = Celery('crypto_backend')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.update(
    worker_hijack_root_logger=False, 
    task_always_eager=True,           #Временно для отладки
    task_eager_propagates=True,       
    task_serializer='json',           
    accept_content=['json'],        
    result_serializer='json',         
    broker_connection_retry_on_startup=True,  
)

app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))