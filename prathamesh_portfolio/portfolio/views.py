
import os
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import groq
import json
import requests
from dotenv import load_dotenv
import requests
import feedparser
import re
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.core.mail import send_mail
from django.conf import settings
from .models import Project, Skill, BlogPost
import markdown as md
import os

# Load environment variables from .env file
load_dotenv()

def strip_html(text):
    if not text:
        return ''
    return re.sub('<[^<]+?>', '', text)

def homepage(request):
    return HttpResponse("<h1>Welcome to Prathamesh's Portfolio!</h1>")

def home(request):
    projects = Project.objects.order_by('-created_at')[:3]
    skills = Skill.objects.order_by('-proficiency')
    return render(request, 'index.html', {'projects': projects, 'skills': skills})

def about(request):
    return render(request, 'about.html')

def projects(request):
    skill_id = request.GET.get('skill')
    if skill_id:
        projects = Project.objects.filter(skills__id=skill_id)
    else:
        projects = Project.objects.all()
    skills = Skill.objects.all()
    return render(request, 'projects.html', {'projects': projects, 'skills': skills, 'selected_skill': skill_id})

def ai_game_showcase(request):
    games = Project.objects.filter(is_ai_game=True)
    return render(request, 'ai_games.html', {'games': games})

@csrf_exempt
def groq_chat(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get('message', '')
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key or not user_message:
            return JsonResponse({'error': 'Missing API key or message'}, status=400)
        client = groq.Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful, fun AI assistant."},
                {"role": "user", "content": user_message}
            ],
            model="llama-3.3-70b-versatile",
            stream=False,
            max_tokens=256
        )
        content = chat_completion.choices[0].message.content
        return JsonResponse({'response': content})
    return JsonResponse({'error': 'POST only'}, status=405)

@csrf_exempt
def groq_story(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        prompt = data.get('prompt', '')
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key or not prompt:
            return JsonResponse({'error': 'Missing API key or prompt'}, status=400)
        client = groq.Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a creative AI story and poem generator."},
                {"role": "user", "content": f"Write a creative story or poem about: {prompt}"}
            ],
            model="llama-3.3-70b-versatile",
            stream=False,
            max_tokens=512
        )
        content = chat_completion.choices[0].message.content
        return JsonResponse({'response': content})
    return JsonResponse({'error': 'POST only'}, status=405)

@csrf_exempt
def groq_code_explain(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        code = data.get('code', '')
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key or not code:
            return JsonResponse({'error': 'Missing API key or code'}, status=400)
        client = groq.Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert code explainer. Explain the following code in simple terms."},
                {"role": "user", "content": code}
            ],
            model="llama-3.3-70b-versatile",
            stream=False,
            max_tokens=512
        )
        content = chat_completion.choices[0].message.content
        return JsonResponse({'response': content})
    return JsonResponse({'error': 'POST only'}, status=405)

def blog(request):
    posts = BlogPost.objects.order_by('-created_at')
    latest_articles = []
    # Dev.to
    try:
        devto_url = 'https://dev.to/api/articles?tag=python,ai&per_page=5'
        api_resp = requests.get(devto_url, timeout=5)
        if api_resp.status_code == 200:
            for art in api_resp.json():
                latest_articles.append({
                    'title': art['title'],
                    'url': art['url'],
                    'source': 'Dev.to',
                    'author': art['user']['username'],
                    'date': art['readable_publish_date'],
                    'summary': strip_html(art.get('description', '')),
                    'thumbnail': art.get('cover_image')
                })
    except Exception:
        pass
    # Medium (Python tag RSS)
    try:
        feed = feedparser.parse('https://medium.com/feed/tag/python')
        for entry in feed.entries[:5]:
            # Try to extract image from content if available
            thumb = ''
            if 'media_content' in entry and entry.media_content:
                thumb = entry.media_content[0].get('url', '')
            elif 'content' in entry and entry.content:
                img_match = re.search(r'<img[^>]+src="([^"]+)"', entry.content[0].value)
                if img_match:
                    thumb = img_match.group(1)
            latest_articles.append({
                'title': entry.title,
                'url': entry.link,
                'source': 'Medium',
                'author': entry.get('author', 'Medium'),
                'date': entry.get('published', '')[:16],
                'summary': strip_html(entry.get('summary', '')),
                'thumbnail': thumb
            })
    except Exception:
        pass
    # Reddit (r/MachineLearning, r/Python)
    try:
        reddit_feeds = [
            ('https://www.reddit.com/r/MachineLearning/.rss', 'Reddit r/MachineLearning'),
            ('https://www.reddit.com/r/Python/.rss', 'Reddit r/Python'),
        ]
        for url, src in reddit_feeds:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                thumb = ''
                if 'media_thumbnail' in entry and entry.media_thumbnail:
                    thumb = entry.media_thumbnail[0].get('url', '')
                latest_articles.append({
                    'title': entry.title,
                    'url': entry.link,
                    'source': src,
                    'author': entry.get('author', 'Reddit'),
                    'date': entry.get('published', '')[:16],
                    'summary': strip_html(entry.get('summary', '')),
                    'thumbnail': thumb
                })
    except Exception:
        pass
    # Quora (AI, Python topics RSS)
    try:
        quora_feeds = [
            ('https://www.quora.com/topic/Artificial-Intelligence-AI/rss', 'Quora AI'),
            ('https://www.quora.com/topic/Python-programming-language/rss', 'Quora Python'),
        ]
        for url, src in quora_feeds:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                latest_articles.append({
                    'title': entry.title,
                    'url': entry.link,
                    'source': src,
                    'author': entry.get('author', 'Quora'),
                    'date': entry.get('published', '')[:16],
                    'summary': strip_html(entry.get('summary', '')),
                    'thumbnail': ''
                })
    except Exception:
        pass
    # NewsAPI (if API key set in settings)
    newsapi_key = os.environ.get('NEWSAPI_KEY')
    if newsapi_key:
        try:
            news_url = f'https://newsapi.org/v2/everything?q=python+ai&sortBy=publishedAt&apiKey={newsapi_key}&pageSize=5'
            resp = requests.get(news_url, timeout=5)
            if resp.status_code == 200:
                for art in resp.json().get('articles', []):
                    latest_articles.append({
                        'title': art['title'],
                        'url': art['url'],
                        'source': 'NewsAPI',
                        'author': art.get('author', 'News'),
                        'date': art.get('publishedAt', '')[:16],
                        'summary': strip_html(art.get('description', '')),
                        'thumbnail': art.get('urlToImage', '')
                    })
        except Exception:
            pass
    # Sort by date (if available)
    latest_articles = sorted(latest_articles, key=lambda x: x.get('date', ''), reverse=True)
    unique_sources = sorted(set(a['source'] for a in latest_articles))
    return render(request, 'blog.html', {'posts': posts, 'latest_articles': latest_articles, 'unique_sources': unique_sources})

def blog_detail(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    html_content = md.markdown(post.content)
    return render(request, 'blog_detail.html', {'post': post, 'html_content': html_content})

def resume(request):
    # Assumes resume.pdf in static folder
    from django.http import FileResponse, Http404
    import os
    resume_path = os.path.join(settings.BASE_DIR, 'prathamesh_portfolio', 'portfolio', 'static', 'resume.pdf')
    if os.path.exists(resume_path):
        return FileResponse(open(resume_path, 'rb'), as_attachment=True, filename='resume.pdf')
    raise Http404('Resume not found')

def contact(request):
    message_sent = False
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        if name and email and message:
            send_mail(
                f'Portfolio Contact from {name}',
                message,
                email,
                [settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
            message_sent = True
    return render(request, 'contact.html', {'message_sent': message_sent})

@csrf_exempt
def groq_emoji_sentiment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        emoji = data.get('emoji', '')
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key or not emoji:
            return JsonResponse({'error': 'Missing API key or emoji'}, status=400)
        client = groq.Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert at understanding human emotions and can explain the sentiment and meaning behind any emoji in detail."},
                {"role": "user", "content": f"Analyze the sentiment and meaning of this emoji: {emoji}. Explain what mood or feeling it represents and why."}
            ],
            model="llama-3.3-70b-versatile",
            stream=False,
            max_tokens=256
        )
        content = chat_completion.choices[0].message.content
        return JsonResponse({'response': content})
    return JsonResponse({'error': 'POST only'}, status=405)