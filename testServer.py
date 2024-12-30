import requests

try:
    response = requests.get('http://localhost:5000/stats')
    if response.status_code == 200:
        print('Server is running and accessible.')
        print('Response:', response.json())
    else:
        print('Server is running but returned:', response.status_code)
except Exception as e:
    print('Error: Server not running')
    print('Exception:', e)

