<<<<<<< HEAD
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
=======
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
from gtts import gTTS
from datetime import datetime, timedelta
import json
import shutil
import time
import asyncio
from concurrent.futures import ThreadPoolExecutor
<<<<<<< HEAD
from .db_sync import sync_news_to_django
=======
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/news")
async def get_news():
    try:
<<<<<<< HEAD
        # Fetch fresh news
        news_items = []
        
        # Parallel fetch from sources
        tasks = [
            quick_scrape_hindustan_times(),
            quick_scrape_times_of_india()
        ]
        
        for items in tasks:
            if isinstance(items, list):
                news_items.extend(items)
        
        # Remove duplicates
        seen_headlines = set()
        unique_items = []
        for item in news_items:
            if item.headline not in seen_headlines:
                seen_headlines.add(item.headline)
                unique_items.append(item)
        
        # Format data for Django sync
        news_data = {
            "latest-headlines": unique_items,
            "last_updated": datetime.now().isoformat(),
            "updating": False
        }
        
        # Save to cache
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "news_cache.json"), "w") as f:
            json.dump(news_data, f, default=lambda x: x.dict() if hasattr(x, 'dict') else str(x))
        
        # Sync with Django database
        sync_news_to_django(news_data)
        
        return news_data
=======
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "news_cache.json"), "r") as f:
            news_data = json.load(f)
            return news_data
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# This route is replaced by the combined route handler below

genai.configure(api_key="AIzaSyA3d7kYEhN7HWFGWLQ0I7z9xln-LTpcq_0")
gemini_limit_reached = False

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

def cleanup_static_directory():
    if os.path.exists(STATIC_DIR):
        shutil.rmtree(STATIC_DIR)
    os.makedirs(STATIC_DIR)

class NewsItem(BaseModel):
    headline: str
    summary: str
    url: str
    audio_url: Optional[str] = None
    source: str
    timestamp: str
    category: str

CATEGORIES = {
    "latest-headlines": {
        "name": "Latest Headlines",
        "keywords": []
    },
    "politics-global-affairs": {
        "name": "Politics & Global Affairs",
        "keywords": ["politics", "government", "election", "minister", "president", "parliament", 
                    "democracy", "party", "diplomatic", "global", "international", "world", "UN", 
                    "foreign", "treaty", "summit"]
    },
    "business-finance": {
        "name": "Business & Finance",
        "keywords": ["business", "economy", "market", "stock", "trade", "finance", "investment",
                    "company", "startup", "entrepreneur", "banking", "industry", "corporate",
                    "revenue", "profit", "economic"]
    },
    "technology-innovation": {
        "name": "Technology & Innovation",
        "keywords": ["technology", "tech", "digital", "software", "ai", "artificial intelligence",
                    "innovation", "cyber", "robot", "automation", "blockchain", "startup",
                    "gadget", "device", "computer", "internet", "mobile", "app"]
    }
}

def text_to_speech(text, filename):
    if not text.strip():
        return None

    filepath = os.path.join(STATIC_DIR, filename)
    tts = gTTS(text=text, lang="en")
    tts.save(filepath)
    
    return f"/static/{filename}"

<<<<<<< HEAD
def clean_content(content):
    if not content:
        return ""
        
    noise_phrases = [
        "Recommended Topics", "Share this article", "Share Via",
        "Copy Link", "Get Current Updates", "Latest News at Hindustan Times",
        "ADVERTISEMENT", "Sponsored Content", "Related Stories"
    ]
    
    for noise in noise_phrases:
        content = content.replace(noise, "")
    
    # Remove extra whitespace and normalize spaces
    content = ' '.join(content.split())
    return content

=======
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
def summarize_news(title, content):
    if not content or content == "Content not available.":
        return "Summary not available due to missing content."

    try:
        if not gemini_limit_reached:
            model = genai.GenerativeModel("gemini-pro")
            prompt = f"""Please provide a concise summary of this news article in 2-3 sentences:

Title: {title}
Content: {content}

Focus on the key points and main message. Make it clear and easy to understand."""
            
            response = model.generate_content(prompt)
            
            if hasattr(response, "text"):
                return response.text.strip()

        # Fallback to simple summarization if Gemini fails
<<<<<<< HEAD
=======
        gemini_limit_reached = True
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
        print("Gemini API failed or limit reached. Using local summarization.")
        sentences = content.split('.')
        summary = f"{title}. {' '.join(sentences[:3])}"
        return summary

    except Exception as e:
<<<<<<< HEAD
=======
        gemini_limit_reached = True
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
        print(f"Error with Gemini API: {str(e)}")
        # Fallback to simple summarization
        sentences = content.split('.')
        summary = f"{title}. {' '.join(sentences[:3])}"
        return summary

def clean_content(content):
    noise_phrases = [
        "Recommended Topics", "Share this article", "Share Via",
        "Copy Link", "Get Current Updates", "Latest News at Hindustan Times"
    ]
    
    for noise in noise_phrases:
        content = content.replace(noise, "")
    
    return ' '.join(content.split())

def categorize_news(headline, content=""):
    text = (headline + " " + content).lower()
    
    # Define more specific category rules
    if any(word in text for word in [
        "stock market", "shares", "investors", "profit", "revenue",
        "company results", "quarterly", "fiscal", "financial",
        "market cap", "sensex", "nifty", "nasdaq", "trading"
    ]):
        return "Business & Finance"
    
    if any(word in text for word in [
        "artificial intelligence", "machine learning", "blockchain",
        "cryptocurrency", "digital transformation", "robotics",
        "quantum computing", "cybersecurity", "software",
        "startup", "innovation", "tech giant", "algorithm"
    ]):
        return "Technology & Innovation"
    
    if any(word in text for word in [
        "election", "parliament", "prime minister", "president",
        "foreign policy", "diplomatic", "bilateral", "summit",
        "democracy", "constitution", "legislation", "political party",
        "cabinet", "ministry", "international relations"
    ]):
        return "Politics & Global Affairs"
    
    return "Latest Headlines"

async def scrape_hindustan_times():
    url = "https://www.hindustantimes.com/india-news/"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        print("Scraping Hindustan Times...")
        r = requests.get(url, headers=headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        newsDivs = soup.find_all(["h2", "h3"], {"class": ["hdg3", "hdg4", "story-heading"]})
        count = 0
        
        for news in newsDivs[:10]:
            try:
                headline = news.text.strip()
                link = news.find('a')
                
                if link:
                    article_url = link['href'] if link['href'].startswith("http") else "https://www.hindustantimes.com" + link['href']
                    print(f"\nProcessing article: {headline}")
                    
                    article_res = requests.get(article_url, headers=headers)
                    article_soup = BeautifulSoup(article_res.content, 'html.parser')
                    content_div = article_soup.find('div', class_='storyDetail') or article_soup.find('div', class_='storyDetails') or article_soup.find('div', class_='content')
                    
                    if content_div:
                        content = clean_content(content_div.text.strip())
                        
                        if content and len(content.split()) > 20:
                            summary = summarize_news(headline, content)
                            category = categorize_news(headline, content)
                            audio_file = text_to_speech(summary, f"hindustan_{count}.mp3")
                            
                            news_item = NewsItem(
                                headline=headline,
                                summary=summary,
                                url=article_url,
                                audio_url=audio_file,
                                source="Hindustan Times",
                                timestamp=datetime.now().isoformat(),
                                category=category
                            )
                            news_items.append(news_item)
                            print(f"Added article with category: {category}")
                            
                            count += 1
            except Exception as e:
                print(f"Error processing article: {str(e)}")
                continue
        
        return news_items
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping Hindustan Times: {str(e)}")

async def scrape_times_of_india():
    url = "https://timesofindia.indiatimes.com/briefs"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        print("\nScraping Times of India...")
        r = requests.get(url, headers=headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='brief_box')
        count = 0
        
        for article in articles[:10]:
            try:
                headline_tag = article.find('h2')
                content_div = article.find('p')
                link = article.find('a', href=True)
                
                if headline_tag and content_div and link:
                    headline = headline_tag.text.strip()
                    content = clean_content(content_div.text.strip())
                    article_url = "https://timesofindia.indiatimes.com" + link['href']
                    
                    print(f"\nProcessing article: {headline}")
                    
                    if content and len(content.split()) > 20:
                        summary = summarize_news(headline, content)
                        category = categorize_news(headline, content)
                        audio_file = text_to_speech(summary, f"toi_{count}.mp3")
                        
                        news_item = NewsItem(
                            headline=headline,
                            summary=summary,
                            url=article_url,
                            audio_url=audio_file,
                            source="Times of India",
                            timestamp=datetime.now().isoformat(),
                            category=category
                        )
                        news_items.append(news_item)
                        print(f"Added article with category: {category}")
                        
                        count += 1
            except Exception as e:
                print(f"Error processing article: {str(e)}")
                continue
        
        return news_items
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping Times of India: {str(e)}")

async def scrape_ndtv():
    url = "https://www.ndtv.com/latest"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        print("\nScraping NDTV...")
        r = requests.get(url, headers=headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='news_item')
        count = 0
        
        for article in articles[:10]:
            try:
                headline = article.find('h2', class_='newsHdng').text.strip()
                content = article.find('p', class_='newsCont').text.strip()
                link = article.find('a', href=True)['href']
                
                if content and len(content.split()) > 20:
                    summary = summarize_news(headline, content)
                    category = categorize_news(headline, content)
                    audio_file = text_to_speech(summary, f"ndtv_{count}.mp3")
                    
                    news_item = NewsItem(
                        headline=headline,
                        summary=summary,
                        url=link,
                        audio_url=audio_file,
                        source="NDTV",
                        timestamp=datetime.now().isoformat(),
                        category=category
                    )
                    news_items.append(news_item)
                    count += 1
            except Exception as e:
                print(f"Error processing NDTV article: {str(e)}")
                continue
                
        return news_items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping NDTV: {str(e)}")

async def scrape_india_today():
    url = "https://www.indiatoday.in/news"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        print("\nScraping India Today...")
        r = requests.get(url, headers=headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='story-wrapper')
        count = 0
        
        for article in articles[:10]:
            try:
                headline = article.find('h2').text.strip()
                link = "https://www.indiatoday.in" + article.find('a', href=True)['href']
                
                # Get full article content
                article_res = requests.get(link, headers=headers)
                article_soup = BeautifulSoup(article_res.content, 'html.parser')
                content_div = article_soup.find('div', class_='story-details')
                
                if content_div:
                    content = clean_content(content_div.text.strip())
                    if content and len(content.split()) > 20:
                        summary = summarize_news(headline, content)
                        category = categorize_news(headline, content)
                        audio_file = text_to_speech(summary, f"indiatoday_{count}.mp3")
                        
                        news_item = NewsItem(
                            headline=headline,
                            summary=summary,
                            url=link,
                            audio_url=audio_file,
                            source="India Today",
                            timestamp=datetime.now().isoformat(),
                            category=category
                        )
                        news_items.append(news_item)
                        count += 1
            except Exception as e:
                print(f"Error processing India Today article: {str(e)}")
                continue
                
        return news_items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping India Today: {str(e)}")

async def scrape_the_hindu():
    url = "https://www.thehindu.com/latest-news/"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        print("\nScraping The Hindu...")
        r = requests.get(url, headers=headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='story-card')
        count = 0
        
        for article in articles[:10]:
            try:
                headline = article.find('h3').text.strip()
                link = article.find('a', href=True)['href']
                
                article_res = requests.get(link, headers=headers)
                article_soup = BeautifulSoup(article_res.content, 'html.parser')
                content_div = article_soup.find('div', class_='article-body')
                
                if content_div:
                    content = clean_content(content_div.text.strip())
                    if content and len(content.split()) > 20:
                        summary = summarize_news(headline, content)
                        category = categorize_news(headline, content)
                        audio_file = text_to_speech(summary, f"thehindu_{count}.mp3")
                        
                        news_item = NewsItem(
                            headline=headline,
                            summary=summary,
                            url=link,
                            audio_url=audio_file,
                            source="The Hindu",
                            timestamp=datetime.now().isoformat(),
                            category=category
                        )
                        news_items.append(news_item)
                        count += 1
            except Exception as e:
                print(f"Error processing The Hindu article: {str(e)}")
                continue
                
        return news_items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping The Hindu: {str(e)}")

async def scrape_bbc():
    url = "https://www.bbc.com/news"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        print("\nScraping BBC News...")
        r = requests.get(url, headers=headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='gs-c-promo')
        count = 0
        
        for article in articles[:10]:
            try:
                headline_tag = article.find('h3')
                if headline_tag:
                    headline = headline_tag.text.strip()
                    link_tag = article.find('a', href=True)
                    if link_tag:
                        link = "https://www.bbc.com" + link_tag['href'] if not link_tag['href'].startswith('http') else link_tag['href']
                        
                        article_res = requests.get(link, headers=headers)
                        article_soup = BeautifulSoup(article_res.content, 'html.parser')
                        content_div = article_soup.find('article')
                        
                        if content_div:
                            content = clean_content(content_div.text.strip())
                            if content and len(content.split()) > 20:
                                summary = summarize_news(headline, content)
                                category = categorize_news(headline, content)
                                audio_file = text_to_speech(summary, f"bbc_{count}.mp3")
                                
                                news_item = NewsItem(
                                    headline=headline,
                                    summary=summary,
                                    url=link,
                                    audio_url=audio_file,
                                    source="BBC News",
                                    timestamp=datetime.now().isoformat(),
                                    category=category
                                )
                                news_items.append(news_item)
                                count += 1
            except Exception as e:
                print(f"Error processing BBC article: {str(e)}")
                continue
                
        return news_items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping BBC: {str(e)}")

async def scrape_cnn():
    url = "https://www.cnn.com/world"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        print("\nScraping CNN...")
        r = requests.get(url, headers=headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='card')
        count = 0
        
        for article in articles[:10]:
            try:
                headline_tag = article.find('span', class_='card-headline')
                if headline_tag:
                    headline = headline_tag.text.strip()
                    link_tag = article.find('a', href=True)
                    if link_tag:
                        link = "https://www.cnn.com" + link_tag['href'] if not link_tag['href'].startswith('http') else link_tag['href']
                        
                        article_res = requests.get(link, headers=headers)
                        article_soup = BeautifulSoup(article_res.content, 'html.parser')
                        content_div = article_soup.find('div', class_='article__content')
                        
                        if content_div:
                            content = clean_content(content_div.text.strip())
                            if content and len(content.split()) > 20:
                                summary = summarize_news(headline, content)
                                category = categorize_news(headline, content)
                                audio_file = text_to_speech(summary, f"cnn_{count}.mp3")
                                
                                news_item = NewsItem(
                                    headline=headline,
                                    summary=summary,
                                    url=link,
                                    audio_url=audio_file,
                                    source="CNN",
                                    timestamp=datetime.now().isoformat(),
                                    category=category
                                )
                                news_items.append(news_item)
                                count += 1
            except Exception as e:
                print(f"Error processing CNN article: {str(e)}")
                continue
                
        return news_items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping CNN: {str(e)}")

# Initialize cache
NEWS_CACHE = {}
<<<<<<< HEAD
CACHE_DURATION = 4000  # 5 minutes
=======
CACHE_DURATION = 300  # 5 minutes
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0

def quick_scrape_hindustan_times():
    url = "https://www.hindustantimes.com/india-news/"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        r = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        newsDivs = soup.find_all(["h2", "h3"], {"class": ["hdg3", "hdg4", "story-heading"]})
        
        for news in newsDivs[:10]:
            try:
                headline = news.text.strip()
                link = news.find('a')
                
                if link:
                    article_url = link['href'] if link['href'].startswith("http") else "https://www.hindustantimes.com" + link['href']
                    
                    # Fetch article content
                    article_res = requests.get(article_url, headers=headers, timeout=5)
                    article_soup = BeautifulSoup(article_res.content, 'html.parser')
                    content_div = article_soup.find('div', class_='storyDetail') or article_soup.find('div', class_='storyDetails') or article_soup.find('div', class_='content')
                    
                    if content_div:
                        content = clean_content(content_div.text.strip())
                        if content and len(content.split()) > 20:
                            summary = summarize_news(headline, content)
                            category = categorize_news(headline, content)
                            
                            news_item = NewsItem(
                                headline=headline,
                                summary=summary,
                                url=article_url,
                                source="Hindustan Times",
                                timestamp=datetime.now().isoformat(),
                                category=category
                            )
                            news_items.append(news_item)
            except Exception as e:
                print(f"Error processing HT article: {str(e)}")
                continue
        
        return news_items
    except Exception as e:
        print(f"Error scraping HT: {str(e)}")
        return []

def quick_scrape_times_of_india():
    url = "https://timesofindia.indiatimes.com/briefs"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        r = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='brief_box')
        
        for article in articles[:10]:
            try:
                headline_tag = article.find('h2')
                content_div = article.find('p')
                link = article.find('a', href=True)
                
                if headline_tag and content_div and link:
                    headline = headline_tag.text.strip()
                    content = clean_content(content_div.text.strip())
                    article_url = "https://timesofindia.indiatimes.com" + link['href']
                    
                    if content and len(content.split()) > 20:
                        summary = summarize_news(headline, content)
                        category = categorize_news(headline, content)
                        
                        news_item = NewsItem(
                            headline=headline,
                            summary=summary,
                            url=article_url,
                            source="Times of India",
                            timestamp=datetime.now().isoformat(),
                            category=category
                        )
                        news_items.append(news_item)
            except Exception as e:
                print(f"Error processing TOI article: {str(e)}")
                continue
        
        return news_items
    except Exception as e:
        print(f"Error scraping TOI: {str(e)}")
        return []

<<<<<<< HEAD
def quick_scrape_ndtv():
    url = "https://www.ndtv.com/latest"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        r = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='news_item')
        
        for article in articles[:10]:
            try:
                headline = article.find('h2', class_='newsHdng').text.strip()
                content = article.find('p', class_='newsCont').text.strip()
                link = article.find('a', href=True)['href']
                
                if content and len(content.split()) > 20:
                    summary = summarize_news(headline, content)
                    category = categorize_news(headline, content)
                    
                    news_item = NewsItem(
                        headline=headline,
                        summary=summary,
                        url=link,
                        source="NDTV",
                        timestamp=datetime.now().isoformat(),
                        category=category
                    )
                    news_items.append(news_item)
            except Exception as e:
                print(f"Error processing NDTV article: {str(e)}")
                continue
        
        return news_items
    except Exception as e:
        print(f"Error scraping NDTV: {str(e)}")
        return []

def quick_scrape_india_today():
    url = "https://www.indiatoday.in/news"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        r = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='story-wrapper')
        
        for article in articles[:10]:
            try:
                headline = article.find('h2').text.strip()
                link = "https://www.indiatoday.in" + article.find('a', href=True)['href']
                
                # Get full article content
                article_res = requests.get(link, headers=headers, timeout=5)
                article_soup = BeautifulSoup(article_res.content, 'html.parser')
                content_div = article_soup.find('div', class_='story-details')
                
                if content_div:
                    content = clean_content(content_div.text.strip())
                    if content and len(content.split()) > 20:
                        summary = summarize_news(headline, content)
                        category = categorize_news(headline, content)
                        
                        news_item = NewsItem(
                            headline=headline,
                            summary=summary,
                            url=link,
                            source="India Today",
                            timestamp=datetime.now().isoformat(),
                            category=category
                        )
                        news_items.append(news_item)
            except Exception as e:
                print(f"Error processing India Today article: {str(e)}")
                continue
        
        return news_items
    except Exception as e:
        print(f"Error scraping India Today: {str(e)}")
        return []

def quick_scrape_the_hindu():
    url = "https://www.thehindu.com/latest-news/"
    headers = {"User-Agent": "Mozilla/5.0"}
    news_items = []
    
    try:
        r = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        articles = soup.find_all('div', class_='story-card')
        
        for article in articles[:10]:
            try:
                headline = article.find('h3').text.strip()
                link = article.find('a', href=True)['href']
                
                article_res = requests.get(link, headers=headers, timeout=5)
                article_soup = BeautifulSoup(article_res.content, 'html.parser')
                content_div = article_soup.find('div', class_='article-body')
                
                if content_div:
                    content = clean_content(content_div.text.strip())
                    if content and len(content.split()) > 20:
                        summary = summarize_news(headline, content)
                        category = categorize_news(headline, content)
                        
                        news_item = NewsItem(
                            headline=headline,
                            summary=summary,
                            url=link,
                            source="The Hindu",
                            timestamp=datetime.now().isoformat(),
                            category=category
                        )
                        news_items.append(news_item)
            except Exception as e:
                print(f"Error processing The Hindu article: {str(e)}")
                continue
        
        return news_items
    except Exception as e:
        print(f"Error scraping The Hindu: {str(e)}")
        return []

=======
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
@app.get("/")
async def root():
    return {"message": "News API is running"}

@app.get("/categories")
async def get_categories():
    return {
        "categories": [
            {
                "id": category_id,
                "name": category_info["name"],
                "keywords": category_info["keywords"]
            }
            for category_id, category_info in CATEGORIES.items()
        ]
    }

<<<<<<< HEAD
=======
from fastapi import Request

>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
@app.get("/news")
@app.options("/news")
async def get_news(request: Request, category: str = None):
    if request.method == "OPTIONS":
        return {}
        
    try:
        # Check cache
        cache_key = f"news_{category if category else 'all'}"
        current_time = time.time()
        
        if cache_key in NEWS_CACHE:
            cached_data = NEWS_CACHE[cache_key]
            if current_time - cached_data["timestamp"] < CACHE_DURATION:
<<<<<<< HEAD
                # Sync cached data with Django
                sync_news_to_django(cached_data["data"])
=======
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
                return cached_data["data"]
        
        # Fetch fresh news
        news_items = []
        
        # Parallel fetch from sources
        tasks = [
            quick_scrape_hindustan_times(),
            quick_scrape_times_of_india()
        ]
        
        for items in tasks:
            if isinstance(items, list):
                news_items.extend(items)
        
        # Remove duplicates
        seen_headlines = set()
        unique_items = []
        for item in news_items:
            if item.headline not in seen_headlines:
                seen_headlines.add(item.headline)
                unique_items.append(item)
        
        # Cache results
        NEWS_CACHE[cache_key] = {
            "data": unique_items,
            "timestamp": current_time
        }
        
<<<<<<< HEAD
        # Sync with Django database
        sync_news_to_django(unique_items)
        
=======
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
        return unique_items
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Removed duplicate route handler

@app.get("/news/{category}")
@app.options("/news/{category}")
async def get_news_by_category(request: Request, category: str):
    if request.method == "OPTIONS":
        return {}
        
    try:
        # Check cache
        cache_key = f"news_{category}"
        current_time = time.time()
        
        if cache_key in NEWS_CACHE:
            cached_data = NEWS_CACHE[cache_key]
            if current_time - cached_data["timestamp"] < CACHE_DURATION:
                return cached_data["data"]
        
        # Fetch fresh news
        news_items = []
        
        # Parallel fetch from sources
        tasks = [
            quick_scrape_hindustan_times(),
            quick_scrape_times_of_india()
        ]
        
        for items in tasks:
            if isinstance(items, list):
                news_items.extend(items)
        
        # Filter by category if specified
        if category in CATEGORIES:
            filtered_items = []
            for item in news_items:
                if category == "latest-headlines" or any(keyword in item.headline.lower() for keyword in CATEGORIES[category]["keywords"]):
                    item.category = CATEGORIES[category]["name"]
                    filtered_items.append(item)
            news_items = filtered_items
        
        # Remove duplicates
        seen_headlines = set()
        unique_items = []
        for item in news_items:
            if item.headline not in seen_headlines:
                seen_headlines.add(item.headline)
                unique_items.append(item)
        
        # Cache results
        NEWS_CACHE[cache_key] = {
            "data": unique_items,
            "timestamp": current_time
        }
        
        return unique_items
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Removed duplicate route handler

@app.get("/news/latest-headlines")
@app.options("/news/latest-headlines")
async def get_latest_headlines(request: Request):
    if request.method == "OPTIONS":
        return {}
    
    try:
        # Check cache
        cache_key = "news_latest-headlines"
        current_time = time.time()
        
        if cache_key in NEWS_CACHE:
            cached_data = NEWS_CACHE[cache_key]
            if current_time - cached_data["timestamp"] < CACHE_DURATION:
                return cached_data["data"]
        
        # Fetch fresh news
        news_items = []
        
<<<<<<< HEAD
        # Try all available sources
        sources = [
            quick_scrape_hindustan_times,
            quick_scrape_times_of_india,
            quick_scrape_ndtv,
            quick_scrape_india_today,
            quick_scrape_the_hindu
        ]
        
        for source in sources:
            try:
                items = source()
                if isinstance(items, list):
                    news_items.extend(items)
            except Exception as e:
                print(f"Error fetching from {source.__name__}: {str(e)}")
                continue
        
        # If no news items were fetched, try BBC and CNN as fallback
        if not news_items:
            print("No news from Indian sources, trying international sources...")
            try:
                bbc_items = await scrape_bbc()
                if isinstance(bbc_items, list):
                    news_items.extend(bbc_items)
            except Exception as e:
                print(f"Error fetching from BBC: {str(e)}")
            
            try:
                cnn_items = await scrape_cnn()
                if isinstance(cnn_items, list):
                    news_items.extend(cnn_items)
            except Exception as e:
                print(f"Error fetching from CNN: {str(e)}")
        
        # If still no news items, return cached data if available
        if not news_items and cache_key in NEWS_CACHE:
            print("No fresh news available, returning cached data")
            return NEWS_CACHE[cache_key]["data"]
        
        # Remove duplicates
        seen_headlines = set()
        unique_items = []
        for item in news_items:
            if item.headline not in seen_headlines:
                seen_headlines.add(item.headline)
                unique_items.append(item)
        
        # Cache results
        NEWS_CACHE[cache_key] = {
            "data": unique_items,
            "timestamp": current_time
        }
        
        return unique_items
        
    except Exception as e:
        print(f"Error in get_latest_headlines: {str(e)}")
        # Return cached data if available
        if cache_key in NEWS_CACHE:
            return NEWS_CACHE[cache_key]["data"]
=======
        # Parallel fetch from sources
        tasks = [
            quick_scrape_hindustan_times(),
            quick_scrape_times_of_india()
        ]
        
        for items in tasks:
            if isinstance(items, list):
                news_items.extend(items)
        
        # Cache results
        NEWS_CACHE[cache_key] = {
            "data": news_items,
            "timestamp": current_time
        }
        
        return news_items
        
    except Exception as e:
>>>>>>> 30a74b5b6ed1499b838acbb40724f91f773a96c0
        raise HTTPException(status_code=500, detail=str(e))

# Removed duplicate route handler

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)