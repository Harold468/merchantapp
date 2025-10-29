from .models import Merchant
from rest_framework import serializers


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = '__all__'
        read_only_fields = ("id", "created_at", "updated_at")
        
    def validate_business_registration_number(self, value):
        if not value.strip():
            raise serializers.ValidationError("Business registration number cannot be blank.")
        return value

