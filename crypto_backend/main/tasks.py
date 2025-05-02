# main/tasks.py
from celery import shared_task
import telebot
import logging

# Настраиваем логирование
logger = logging.getLogger(__name__)

# Инициализируем бота
bot = telebot.TeleBot("7394017273:AAECE86i2vJPFemrVvd6rGgcYS83hHscRbY")

@shared_task(bind=True, max_retries=3, thread_sensitive=False)
def notify_about_order(self, order_id, amount, currency):
    try:
        logger.info(f"Processing order notification: id={order_id}, amount={amount}, currency={currency}")
        
        message = f"🆕 Новый ордер #{order_id}\nСумма: {amount} {currency}"
        
        # Отправляем сообщение
        bot.send_message("848516691", message)
        
        logger.info(f"Notification sent successfully for order #{order_id}")
        return True
    except Exception as exc:
        logger.error(f"Error sending notification for order #{order_id}: {exc}")
        # Автоматический повтор задачи в случае ошибки
        self.retry(exc=exc, countdown=60)  # повтор через 60 секунд