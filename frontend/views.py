from django.shortcuts import render

# Create your views here.
# this allows us to render the index.html template
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')