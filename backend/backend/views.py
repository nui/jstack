import json
import os
import socket

from django.http import HttpResponse
from django.template import loader

from assets.webpack import assets, bootstrap


def is_devserver_running():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 8080))
    return result == 0


def index(request):
    template = loader.get_template('backend/index.html')
    context = {
        'assets': assets,
        'devServer': is_devserver_running()
    }
    return HttpResponse(template.render(context, request))
