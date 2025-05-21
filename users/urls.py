from django.urls import path
from .views.activation import activate_account

urlpatterns = [
    path('activate/<uidb64>/<token>/', activate_account, name='activate'),
]
