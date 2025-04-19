from django.contrib import admin
from django.urls import path
from news import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/news/', views.get_news, name='get_news'),
] 