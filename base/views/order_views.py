from base.models import *
from base.serializers import *
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
import stripe
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import redirect
from datetime import datetime
from django.conf import settings

import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeCheckoutView(APIView):
    def post(self, request,*args, **kwargs):
        id = self.kwargs.get('order_id')
      
    
        try:
            order = Order.objects.get(_id=id)

            product = stripe.Product.create(
                name='My Product',  # Replace with your desired product name
                type='good',  # Replace with 'service' or 'good' based on your product type
            )
            price = stripe.Price.create(
                unit_amount=int(order.totalPrice * 100),  # Stripe expects the amount in cents
                currency='usd',  # Replace with your desired currency
                product = product.id  # Replace with your product ID or name
            )

            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': price.id,
                        'quantity': 1,
                        
                    },
                ],
                payment_method_types=['card',],
                mode='payment',
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
            )

            order.isPaid = True
            order.paidAt = datetime.now()
            order.save()

            return redirect(checkout_session.url)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
# @permission_classes([IsAdminUser])
def getBlockchain(request):
    try:
        orders = Order.objects.filter(isPaid = True, totalPrice__gte = 100, walletAddress__isnull = False, isTokenize = False)
        
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)


@api_view(['PUT'])
# @permission_classes([IsAdminUser])
def updateIsTokenize(request, pk):
    try:
        order = Order.objects.get(_id = pk)
        order.isTokenize = True
        order.save()
        return Response({"message": "Success"})
    except Exception as e:
        print(e)


stripe.api_key = 'sk_test_51NH4ZtJ5ivuVpBy6kFv5ZbnpaQyBilNkOuxvY9c23wqVmKB4gM5qXfdFfaBvjTDSTuoXErclpb3yEZ1XdczuNWPm00uKRKNgSe'
@api_view(['POST'])
def test_payment(request):
    test_payment_intent = stripe.PaymentIntent.create(
        amount=1000, currency='pln', 
        payment_method_types=['card'],
        receipt_email='test@example.com')
    return Response(status=status.HTTP_200_OK, data=test_payment_intent)





API_URL="http://127.0.0.1:8000"
class CreateCheckOutSession(APIView):
    def post(self, request, *args, **kwargs):
        product_id=self.kwargs["pk"]
        try:
            product=Product.objects.get(id=product_id)
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                        'price_data': {
                            'currency':'usd',
                             'unit_amount':int(product.price) * 100,
                             'product_data':{
                                 'name':product.name,
                                 'images':[f"{API_URL}/{product.image}"]

                             }
                        },
                        'quantity': 1,
                    },
                ],
                metadata={
                    "product_id":product._id
                },
                mode='payment',
                success_url='http://localhost:3000/?success=true',
                cancel_url='http://localhost:3000/?canceled=true',
            )
            return redirect(checkout_session.url)
        except Exception as e:
            return Response({'msg':'something went wrong while creating stripe session','error':str(e)}, status=500)
        

@api_view(["PUT"])
def addWalletAddress(request, pk, address):
    try:
        order = Order.objects.get(_id = pk)
        data = request.data
        # order.walletAddress = data["address"]
        order.walletAddress = address
        order.save()
        return Response("Saved wallet address")
    except Exception as e:
        return Response(str(e))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']
    if orderItems and len(data['orderItems']) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice'],
            walletAddress = data["walletAddress"]
        )

        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country'],
            walletAddress = data["walletAddress"]
        )


        for i in orderItems:
            product = Product.objects.get(_id = i['product'])

            item = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name,
                qty = i['qty'],
                price = i['price'],
                image = product.image.url
             )

        product.countInStock -= item.qty
        product.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    user = request.user

    try:
        order = Order.objects.get(_id = pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authenticated to view this order'}, status= status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail':'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was paid')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



