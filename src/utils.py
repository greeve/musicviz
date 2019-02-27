import json


class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        return obj.__dict__


class SetEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)
