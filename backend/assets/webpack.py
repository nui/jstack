import json

from copy import deepcopy
from django.conf import settings
from django.contrib.staticfiles.templatetags.staticfiles import static

WEBPACK_ASSETS_DIR = settings.WEBPACK_ASSETS_DIR
_CACHE = {}


def _load_assets_json():
    assets_path = WEBPACK_ASSETS_DIR.joinpath('webpack-assets.json')
    return json.loads(open(assets_path, 'rt').read())


def _read_bootstrap(assets_json):
    bootstrap_path = WEBPACK_ASSETS_DIR.joinpath(assets_json['bootstrap']['js'])
    return open(bootstrap_path, 'rt').read()


def _transform_webpack_assets(assets_json):
    assets_json = deepcopy(assets_json)
    for _, chunk in assets_json.items():
        for asset_kind, value in chunk.items():
            chunk[asset_kind] = static(value)
    return assets_json


def assets():
    cache_key = assets.__name__
    if cache_key not in _CACHE or settings.DEBUG:
        assets_json = _load_assets_json()
        _CACHE[cache_key] = _transform_webpack_assets(assets_json)
    return _CACHE[cache_key]


def bootstrap():
    cache_key = bootstrap.__name__
    if cache_key not in _CACHE or settings.DEBUG:
        assets_json = _load_assets_json()
        _CACHE[cache_key] = _read_bootstrap(assets_json)
    return _CACHE[cache_key]


__all__ = ['assets', 'bootstrap']
