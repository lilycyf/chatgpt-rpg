from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
import requests

def chatbot(request):
    message = request.GET.get('message', '')
    api_key = settings.OPENAI_API_KEY

    endpoint = f'https://api.openai.com/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": message}]
    }
    headers = {'Authorization': f'Bearer {api_key}'}
    response = requests.post(endpoint, headers=headers, json=data)
    response = response.json()['choices'][0]['message']
    response_text = response['content']
    return JsonResponse({'response': response_text})

def home(request):
    return render(request, 'index.html')
