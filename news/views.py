from django.http import JsonResponse
from .models import NewsArticle

def get_news(request):
    news_items = NewsArticle.objects.all().order_by('-timestamp')
    data = [{
        'headline': item.headline,
        'summary': item.summary,
        'url': item.url,
        'audio_url': item.audio_url,
        'source': item.source,
        'category': item.category,
        'timestamp': item.timestamp.isoformat()
    } for item in news_items]
    return JsonResponse(data, safe=False) 