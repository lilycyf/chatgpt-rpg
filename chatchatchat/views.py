from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
import requests
import json

def chatbot(request):
    messageHistory = request.GET.get('messageHistory')
    print("testtest")
    print(messageHistory)
    messageHistory = json.loads(messageHistory)

    api_key = settings.OPENAI_API_KEY

    endpoint = f'https://api.openai.com/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": messageHistory
    }
    headers = {'Authorization': f'Bearer {api_key}'}
    response = requests.post(endpoint, headers=headers, json=data)
    response = response.json()['choices'][0]['message']
    response_text = response['content']
    return JsonResponse({'response': response_text})


def editbot(request):
    editInput = request.GET.get('input')
    editInstruction = request.GET.get('instruction')
    print("testtest")
    print(editInput)
    print(editInstruction)

    api_key = settings.OPENAI_API_KEY

    endpoint = f'https://api.openai.com/v1/edits'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        "model": "text-davinci-edit-001",
        "input": editInput,
        "instruction": editInstruction,
    }
    headers = {'Authorization': f'Bearer {api_key}'}
    response = requests.post(endpoint, headers=headers, json=data)
    response_text = response.json()['choices'][0]['text']
    return JsonResponse({'response': response_text})

def roleplaybot(request):
    messageHistory = request.GET.get('messageHistory')
    print("testtest")
    print(messageHistory)
    messageHistory = json.loads(messageHistory)

    api_key = settings.OPENAI_API_KEY

    endpoint = f'https://api.openai.com/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": messageHistory
    }
    headers = {'Authorization': f'Bearer {api_key}'}
    response = requests.post(endpoint, headers=headers, json=data)
    response = response.json()['choices'][0]['message']
    response_text = response['content']
    return JsonResponse({'response': response_text})

def home(request):
    return render(request, 'index.html')

def chat(request):
    return render(request, 'index.html')

def edit(request):
    return render(request, 'index.html')

def roleplay(request):
    return render(request, 'index.html')