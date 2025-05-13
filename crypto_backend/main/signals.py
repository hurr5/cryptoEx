from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from .wrapped_tasks import notify_about_order_safe
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Order)
def order_created_handler(sender, instance, created, **kwargs):
    if created:
        logger.info(f"New order created: {instance.client_order_id}")
        
        if not all([instance.client_order_id, instance.amount, instance.from_currency]):
            logger.error("Missing required order data")
            return
        
        notify_about_order_safe.delay(
            instance.client_order_id,
            instance.amount,
            instance.from_currency
        )
        
        logger.info(f"Notification task queued for order: {instance.client_order_id}")