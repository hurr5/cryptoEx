from django.db import models
from django.utils import timezone
import string
import random


class PaymentDetails(models.Model):
    FIAT = 'fiat'
    CRYPTO = 'crypto'
    TYPE_CHOICES = [
        (FIAT, 'Fiat'),
        (CRYPTO, 'Crypto'),
    ]

    currency_code = models.CharField(max_length=10)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    address = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.currency_code} ({self.type})"

def generate_so_fucking_short_unique_id():
    from main.models import Order
    while True:
        new_id = ''.join(random.choices(string.digits, k=8))
        if not Order.objects.filter(client_order_id=new_id).exists():
            return new_id


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    from_currency = models.CharField(max_length=10)
    to_currency = models.CharField(max_length=10)
    amount = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    rate = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    total = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    email = models.EmailField(max_length=255)
    payment_details = models.ForeignKey('PaymentDetails', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    wallet_address = models.CharField(max_length=255, blank=True, null=True)
    client_order_id = models.CharField(max_length=8, unique=True, default=generate_so_fucking_short_unique_id)

    def __str__(self):
        return f"Order #{self.id} from {self.from_currency} to {self.to_currency}"