import os
import sys
import django
import json
from datetime import datetime, timedelta
from django.utils import timezone

# Add the Django project root to the Python path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_root)

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from news.models import NewsArticle

def sync_news_to_django(news_data):
    """
    Sync news data from FastAPI to Django database
    """
    try:
        # Clear old news articles (older than 1 day)
        one_day_ago = timezone.now() - timedelta(days=1)
        NewsArticle.objects.filter(timestamp__lt=one_day_ago).delete()
        
        # Process each category
        for category, items in news_data.items():
            if category in ['last_updated', 'updating']:
                continue
                
            if not isinstance(items, list):
                continue
                
            for item in items:
                try:
                    # Get or create the news article
                    NewsArticle.objects.get_or_create(
                        headline=item.get('headline', ''),
                        defaults={
                            'summary': item.get('summary', ''),
                            'url': item.get('url', ''),
                            'audio_url': item.get('audio_url'),
                            'source': item.get('source', ''),
                            'timestamp': datetime.fromisoformat(item.get('timestamp', datetime.now().isoformat())),
                            'category': item.get('category', 'Latest Headlines')
                        }
                    )
                except Exception as e:
                    print(f"Error processing news item: {str(e)}")
                    continue
                    
        print("Successfully synced news to Django database")
        
    except Exception as e:
        print(f"Error syncing news to Django: {str(e)}")
        raise 