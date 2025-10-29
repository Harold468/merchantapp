import uuid
from django.db import models

from .helpers.parsePhone import normalize_phone_number

class Merchant(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Pending", "Pending"),
        ("Suspended", "Suspended"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    business_registration_number = models.CharField(max_length=128, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, blank=True, null=True, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        normalized_phone = normalize_phone_number(self.phone, "GH")
        if not normalized_phone:
            raise ValueError("Invalid phone number.")
        self.phone = normalized_phone
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} ({self.business_registration_number})"