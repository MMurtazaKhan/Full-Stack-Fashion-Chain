
from django.urls import path, include
from base.views import order_views as views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', views.getOrders, name="orders"),
    path('test-payment/', views.test_payment, name="order-tst"),
    path('isTokenize/<str:pk>', views.updateIsTokenize, name="tokenize-tst"),
    path('create-checkout-session/<str:order_id>', views.StripeCheckoutView.as_view(), name='checkout_session'),
    path('wallet/<str:pk>/<str:address>', views.addWalletAddress, name='wallet address'),
    path('get-blockchain/', views.getBlockchain, name="order-blockchain"),
    path('add/', views.addOrderItems, name="add"),
    path('myorders/', views.getMyOrders, name="myorders"),
    path('<str:pk>/', views.getOrderById, name="order-id"),
    path('<str:pk>/pay/', views.updateOrderToPaid, name="order-pay"),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name="order-deliver"),
]
