from django.db import models
from django.utils import timezone

class NewsArticle(models.Model):
    SOURCE_CHOICES = [
        ('CNN', 'CNN'),
        ('HT', 'Hindustan Times'),
        ('TOI', 'Times of India'),
        ('NDTV', 'NDTV'),
        ('BBC', 'BBC'),
        ('HINDU', 'The Hindu'),
        ('IT', 'India Today'),
    ]
    
    CATEGORY_CHOICES = [
        ('latest-headlines', 'Latest Headlines'),
        ('politics-global-affairs', 'Politics & Global Affairs'),
        ('business-finance', 'Business & Finance'),
        ('technology-innovation', 'Technology & Innovation'),
    ]

    headline = models.CharField(max_length=500)
    summary = models.TextField()
    url = models.URLField()
    audio_url = models.URLField(null=True, blank=True)
    source = models.CharField(max_length=5, choices=SOURCE_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.get_source_display()}: {self.headline}" 