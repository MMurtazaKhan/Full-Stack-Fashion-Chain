
from django.urls import path, include
from base.views import product_views as views

urlpatterns = [
    path('', views.getProducts, name="products"),
    path('get-blockchain/', views.getBlockchain, name="order-blockchain"),
    path('create/', views.createProduct, name="product-create"),
    path('top/', views.getTopProducts, name="top"),
    path('uploadImage/', views.uploadImage, name="product-image-upload"),
    path('<str:pk>/', views.getProduct, name="product"),
    path('<str:pk>/reviews/', views.createProductReview, name="review"),
    path('delete/<str:pk>/', views.deleteProduct, name="product-delete"),
    path('update/<str:pk>/', views.updateProduct, name="product-update"),
]
