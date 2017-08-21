import json

from copy import deepcopy
from django.conf import settings
from django.contrib.staticfiles.templatetags.staticfiles import static

_ASSETS_DIR = settings.BASE_DIR.parent.joinpath('assets')


def _load_webpack_assets():
    assets_path = _ASSETS_DIR.joinpath('webpack-assets.json')
    return json.loads(open(assets_path, 'rt').read())


def _read_bootstrap(assets_json):
    bootstrap_path = _ASSETS_DIR.joinpath(assets_json['bootstrap']['js'])
    return open(bootstrap_path, 'rt').read()


def _transform_webpack_assets(webpack_assets):
    webpack_assets = deepcopy(webpack_assets)
    for _, chunk in webpack_assets.items():
        for asset_kind, value in chunk.items():
            chunk[asset_kind] = static(value)
    return webpack_assets


def assets():
    if not hasattr(assets, 'result') or settings.DEBUG:
        webpack_assets = _load_webpack_assets()
        assets.result = _transform_webpack_assets(webpack_assets)
    return assets.result


def bootstrap():
    if not hasattr(bootstrap, 'result') or settings.DEBUG:
        webpack_assets = _load_webpack_assets()
        bootstrap.result = _read_bootstrap(webpack_assets)
    return bootstrap.result


__all__ = ['assets', 'bootstrap']
