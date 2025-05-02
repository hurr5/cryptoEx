from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Устанавливаем переменную окружения DJANGO_SETTINGS_MODULE
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crypto_backend.settings')

# Создаем экземпляр Celery
app = Celery('crypto_backend')

# Загружаем настройки из settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Добавляем эти явные настройки для надежности
app.conf.update(
    worker_hijack_root_logger=False,  # Предотвращаем перехват корневого логгера
    # Для отладки - выполнять задачи синхронно
    task_always_eager=True,           # Временно включить для отладки
    task_eager_propagates=True,       # Распространение исключений в eager mode
    task_serializer='json',           # Используем json для сериализации
    accept_content=['json'],          # Принимаем только json
    result_serializer='json',         # Используем json для результатов
    broker_connection_retry_on_startup=True,  # Повторные попытки подключения
)

# Автоматически обнаруживаем задачи во всех установленных приложениях
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))