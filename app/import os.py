import os
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
from summa.summarizer import summarize
from gtts import gTTS


genai.configure(api_key="AIzaSyA3d7kYEhN7HWFGWLQ0I7z9xln-LTpcq_0")


gemini_limit_reached = False


STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

def text_to_speech(text, filename):

    if not text.strip():
        print(f" No text to speak for {filename}. Skipping audio generation.")
        return None

    filepath = os.path.join(STATIC_DIR, filename)
    tts = gTTS(text=text, lang="en")
    tts.save(filepath)

    return filepath

def summarize_news(title, content):

    global gemini_limit_reached

    if not content or content == "Content not available.":
        return "Summary not available due to missing content."

    try:
        if not gemini_limit_reached:
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(f"Summarize this news:\nTitle: {title}\nContent: {content}")

            if hasattr(response, "text"):
                return response.text.strip()


        gemini_limit_reached = True
        print(" Gemini API failed or limit reached. Using local summarization.")
        return summarize(content, words=50) or "Summary generation failed."

    except Exception:
        gemini_limit_reached = True
        print(" Gemini API failed or limit reached. Using local summarization.")
        return summarize(content, words=50) or "Summary generation failed."

def clean_content(content):

    noise_phrases = [
        "Recommended Topics", "Share this article", "Share Via",
        "Copy Link", "Get Current Updates", "Latest News at Hindustan Times"
    ]

    for noise in noise_phrases:
        content = content.replace(noise, "")

    return ' '.join(content.split())

def scrape_hindustan_times():

    url = "https://www.hindustantimes.com/india-news/"
    headers = {"User-Agent": "Mozilla/5.0"}
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.content, 'html.parser')

    newsDivs = soup.find_all(["h2", "h3"], {"class": ["hdg3", "hdg4", "story-heading"]})
    count = 0

    for news in newsDivs:
        if count >= 50:
            break

        headline = news.text.strip()
        link = news.find('a')

        if link:
            article_url = link['href'] if link['href'].startswith("http") else "https://www.hindustantimes.com" + link['href']
            article_res = requests.get(article_url, headers=headers)
            article_soup = BeautifulSoup(article_res.content, 'html.parser')
            content_div = article_soup.find('div', class_='storyDetail') or article_soup.find('div', class_='storyDetails') or article_soup.find('div', class_='content')

            if content_div:
                content = clean_content(content_div.text.strip())

                if content and len(content.split()) > 20:
                    summary = summarize_news(headline, content)


                    audio_file = text_to_speech(summary, f"hindustan_{count}.mp3")

                    print(f"📰 **{headline}**\n📄 {summary}\n🔗 [Read more]({article_url})")
                    if audio_file:
                        print(f"🔊 Audio: {audio_file}\n")

                    count += 1

def scrape_times_of_india():

    url = "https://timesofindia.indiatimes.com/briefs"
    headers = {"User-Agent": "Mozilla/5.0"}
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.content, 'html.parser')

    articles = soup.find_all('div', class_='brief_box')
    count = 0

    for article in articles:
        if count >= 50:
            break

        headline_tag = article.find('h2')
        content_div = article.find('p')
        link = article.find('a', href=True)

        if headline_tag and content_div and link:
            headline = headline_tag.text.strip()
            content = clean_content(content_div.text.strip())
            article_url = "https://timesofindia.indiatimes.com" + link['href']

            if content and len(content.split()) > 20:
                summary = summarize_news(headline, content)


                audio_file = text_to_speech(summary, f"toi_{count}.mp3")

                print(f"📰 **{headline}**\n📄 {summary}\n🔗 [Read more]({article_url})")
                if audio_file:
                    print(f"🔊 Audio: {audio_file}\n")

                count += 1

if __name__ == "__main__":
    print("🔹 **Hindustan Times News:**\n")
    scrape_hindustan_times()
    print("\n🔹 **Times of India News:**\n")
    scrape_times_of_india()