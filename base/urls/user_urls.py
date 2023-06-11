
from django.urls import path, include
from base.views import user_views as views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view( ), name='token_obtain_pair'),
    path('profile/', views.getProfile, name='user-profile'),
    path('profile/update/', views.updateProfile, name='user-profile-update'),
    path('register/', views.registerUser, name='user-register'),
    path('delete/<str:pk>', views.deleteUser, name='user-delete'),
    path('<str:pk>/', views.getUserById, name='user'),
    path('update/<str:pk>', views.updateUser, name='user-update'),
    path('', views.getUser, name='users'),
]
