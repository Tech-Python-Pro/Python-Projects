
from django.db import models
from django.utils import timezone

class Skill(models.Model):
    name = models.CharField(max_length=100)
    proficiency = models.IntegerField(default=0)  # 0-100
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    skills = models.ManyToManyField(Skill, related_name='projects')
    is_ai_game = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField(help_text='Markdown supported')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} <{self.email}>"

# Create your models here.
