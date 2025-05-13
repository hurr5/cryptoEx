from celery import shared_task
import telebot
import logging
from functools import wraps
from django.conf import settings
logger = logging.getLogger(__name__)

bot = telebot.TeleBot(settings.TELEGRAM_BOT_TOKEN)

def safe_task(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Task error: {e}")
            return {"error": str(e)}
    return wrapper

@shared_task(name="main.wrapped_tasks.notify_about_order_safe")
@safe_task
def notify_about_order_safe(order_id, amount, currency):
    """Безопасная версия задачи для обхода проблем с _loc в trace.py"""
    logger.info(f"Processing notification: id={order_id}, amount={amount}, currency={currency}")
    
    message = f"🆕 Новый ордер #{order_id}\nСумма: {amount} {currency}"
    
    bot.send_message("848516691", message)
    
    logger.info(f"Notification sent for order #{order_id}")
    return True