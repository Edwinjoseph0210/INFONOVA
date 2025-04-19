from django.core.management.base import BaseCommand
from news.models import NewsArticle
import json
from django.utils import timezone
from datetime import datetime
import os

class Command(BaseCommand):
    help = 'Syncs news from news_cache.json to Django database'

    def handle(self, *args, **options):
        try:
            # Read news from cache file
            cache_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'backend', 'news_cache.json')
            
            with open(cache_file, 'r') as f:
                news_data = json.load(f)
            
            self.stdout.write(f"Reading news from cache file")
            
            # Clear old news (older than 1 day)
            one_day_ago = timezone.now() - timezone.timedelta(days=1)
            NewsArticle.objects.filter(timestamp__lt=one_day_ago).delete()
            
            # Process each category
            for category, items in news_data.items():
                # Skip non-news items
                if category in ['last_updated', 'updating']:
                    continue
                    
                # Process news items in each category
                for item in items:
                    try:
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
                        self.stdout.write(self.style.ERROR(f'Error processing item: {str(e)}'))
                        self.stdout.write(f'Item data: {json.dumps(item, indent=2)}')
            
            self.stdout.write(self.style.SUCCESS(f'Successfully synced news items'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error syncing news: {str(e)}')) 