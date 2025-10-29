from .views import MerchantAPIView
from django.urls import path

urlpatterns = [
    path('api/merchant/', MerchantAPIView.as_view(),name='merchant-list'),
    path('api/merchant/<uuid:pk>/', MerchantAPIView.as_view()),
]