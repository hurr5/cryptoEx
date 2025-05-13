from celery import shared_task
import telebot
import logging
from django.conf import settings
logger = logging.getLogger(__name__)


bot = telebot.TeleBot(settings.TELEGRAM_BOT_TOKEN)

@shared_task(bind=True, max_retries=3, thread_sensitive=False)
def notify_about_order(self, order_id, amount, currency):
    try:
        logger.info(f"Processing order notification: id={order_id}, amount={amount}, currency={currency}")
        
        message = f"🆕 Новый ордер #{order_id}\nСумма: {amount} {currency}"
        
        bot.send_message("848516691", message)
        
        logger.info(f"Notification sent successfully for order #{order_id}")
        return True
    except Exception as exc:
        logger.error(f"Error sending notification for order #{order_id}: {exc}")
        self.retry(exc=exc, countdown=60)