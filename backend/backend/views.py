import json
import os
import socket

from django.conf import settings
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.http import HttpResponse
from django.template import loader

webpack_assets = json.loads(open(settings.WEBPACK_ASSETS_JSON).read())


def is_devserver_running():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 8080))
    return result == 0


def get_assets_path():
    return {
        chunk: {
            asset: static(os.path.join('assets', path)) for asset, path in assets.items()
            } for chunk, assets in webpack_assets.items()}


def index(request):
    template = loader.get_template('backend/index.html')
    assets = get_assets_path()
    context = {
        'assets': assets,
        'webpackAssets': webpack_assets,
        'devServer': is_devserver_running()
    }
    return HttpResponse(template.render(context, request))
