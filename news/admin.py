from django.contrib import admin
from .models import NewsArticle

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ('headline', 'source', 'category', 'timestamp')
    list_filter = ('source', 'category', 'timestamp')
    search_fields = ('headline', 'summary')
    ordering = ('-timestamp',) 