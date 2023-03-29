from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('chatbot/', views.chatbot, name='chatbot'),
    path('editbot/', views.editbot, name='editbot'),
    path('chat/', views.chat, name='chat'),
    path('edit/', views.edit, name='edit'),
]

