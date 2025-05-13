from rest_framework import serializers
from .models import Order, PaymentDetails

class PaymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDetails
        fields = ['id', 'currency_code', 'type', 'address']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'from_currency', 'to_currency', 'amount', 'rate', 
                  'total', 'email', 'payment_details', 'status', 'created_at', 'wallet_address', 'client_order_id']
        
    def create(self, validated_data):
        """
        Handle creating an order with wallet_address
        """
        return Order.objects.create(**validated_data)