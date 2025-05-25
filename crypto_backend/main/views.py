from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from .models import Order, PaymentDetails, Review
from .serializers import OrderSerializer, PaymentDetailsSerializer, ReviewSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

class PaymentDetailsViewSet(viewsets.ModelViewSet):
    queryset = PaymentDetails.objects.all()
    serializer_class = PaymentDetailsSerializer
    
    def get_queryset(self):
        """
        Optionally filters the payment details by currency_code and type.
        """
        queryset = PaymentDetails.objects.all()
        currency_code = self.request.query_params.get('currency_code', None)
        currency_type = self.request.query_params.get('type', None)
        
        if currency_code:
            queryset = queryset.filter(currency_code=currency_code)
        if currency_type:
            queryset = queryset.filter(type=currency_type)
            
        return queryset


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data

        if instance.payment_details:
            data['payment_address'] = instance.payment_details.address
        else:
            data['payment_address'] = None

        return Response(data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Отмена заказа: меняет статус на 'canceled'."""
        order = get_object_or_404(Order, pk=pk)
        if order.status == 'canceled':
            return Response({'detail': 'Order is already canceled.'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = 'canceled'
        order.save()
        return Response({'detail': 'Order canceled successfully.'}, status=status.HTTP_200_OK)

class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

    def create(self, request, *args, **kwargs):
        order_id = request.data.get('order_id')
        try:
            order = Order.objects.get(client_order_id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(order=order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)