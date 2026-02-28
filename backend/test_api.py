import urllib.request
import json

req = urllib.request.Request("http://127.0.0.1:8000/optimize", 
                             data=json.dumps({"target_strength":20.0}).encode('utf-8'),
                             headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print(response.status)
        print(response.read().decode())
except Exception as e:
    print(e)
    if hasattr(e, 'read'):
        print(e.read().decode())
