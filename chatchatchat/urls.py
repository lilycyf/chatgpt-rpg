from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('chatbot/', views.chatbot, name='chatbot'),
    path('editbot/', views.editbot, name='editbot'),
    path('roleplaybot/', views.roleplaybot, name='roleplaybot'),
    path('embedding/', views.embedding, name='embedding'),
    path('chat/', views.chat, name='chat'),
    path('edit/', views.edit, name='edit'),
    path('roleplay/', views.roleplay, name='roleplay'),
]

