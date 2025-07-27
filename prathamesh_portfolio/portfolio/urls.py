from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('projects/', views.projects, name='projects'),
    path('ai-games/', views.ai_game_showcase, name='ai_game_showcase'),
    path('blog/', views.blog, name='blog'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('resume/', views.resume, name='resume'),
    path('contact/', views.contact, name='contact'),

    # Legacy/alternate API endpoints for frontend JS compatibility
    path('api/groq_chat/', views.groq_chat),
    path('api/groq_story/', views.groq_story),
    path('api/groq_code_explain/', views.groq_code_explain),
    path('api/groq_emoji_sentiment/', views.groq_emoji_sentiment),
]
