from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Merchant

class MerchantAPITest(APITestCase):
    def test_create_and_get_merchant(self):
        url = reverse('merchant-list')
        data = {
            "name": "Test Merchant",
            "business_registration_number": "BRN12345",
            "email": "test@example.com",
            "phone": "0244000000",
            "status": "Active"
        }
        resp = self.client.post(url, data, format='json')
        
        # Print the error to see what's happening
        if resp.status_code != status.HTTP_201_CREATED:
            print(f"Error: {resp.json()}")
        
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        
        # fetch list
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(any(m["business_registration_number"] == "BRN12345" for m in resp.json()))