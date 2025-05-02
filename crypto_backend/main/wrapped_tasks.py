# main/wrapped_tasks.py
from celery import shared_task
import telebot
import logging
from functools import wraps

# Настраиваем логирование
logger = logging.getLogger(__name__)

# Инициализируем бота
bot = telebot.TeleBot("7394017273:AAECE86i2vJPFemrVvd6rGgcYS83hHscRbY")

# Обёрточная функция для безопасного выполнения задач
def safe_task(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Task error: {e}")
            # Вернуть ошибку, но не вызывать исключение в Celery worker
            return {"error": str(e)}
    return wrapper

# Задача уведомления без параметра bind
@shared_task(name="main.wrapped_tasks.notify_about_order_safe")
@safe_task
def notify_about_order_safe(order_id, amount, currency):
    """Безопасная версия задачи для обхода проблем с _loc в trace.py"""
    logger.info(f"Processing notification: id={order_id}, amount={amount}, currency={currency}")
    
    message = f"🆕 Новый ордер #{order_id}\nСумма: {amount} {currency}"
    
    # Отправляем сообщение
    bot.send_message("848516691", message)
    
    logger.info(f"Notification sent for order #{order_id}")
    return True