from django.contrib import admin
from .models import Merchant
# Register your models here.


class MerchantAdmin(admin.ModelAdmin):
    list_display = ('id','name','business_registration_number','email','phone','status','created_at','updated_at',)
    list_filter = ('name',)
    search_fields = ('name','business_registration_number')
    list_per_page = 10

admin.site.register(Merchant,MerchantAdmin)