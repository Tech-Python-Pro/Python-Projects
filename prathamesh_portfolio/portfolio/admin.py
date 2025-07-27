
from django.contrib import admin
from .models import Project, Skill, BlogPost, ContactMessage

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "is_ai_game")
    list_filter = ("is_ai_game", "skills")
    search_fields = ("title", "description")

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "proficiency")
    search_fields = ("name",)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "updated_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "content")

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at", "is_read")
    list_filter = ("is_read",)
    search_fields = ("name", "email", "message")
