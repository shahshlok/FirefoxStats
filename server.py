from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import json
import os
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(CURRENT_DIR, 'static')
DATA_FILE = os.path.join(CURRENT_DIR, 'ublock_stats.json')

def ensure_file_exists():
    if not os.path.exists(DATA_FILE):
        initial_stats = {
            'blocked_count': 0,
            'bandwidth_saved': 0,
            'domains_blocked': [],
            'last_updated': '',
            'today_blocked': 0,
            'types_blocked': {}
        }
        with open(DATA_FILE, 'w') as f:
            json.dump(initial_stats, f)

@app.route('/')
def index():
    logger.info('Index page requested')
    try:
        return send_from_directory(STATIC_DIR, 'index.html')
    except Exception as e:
        logger.error(f'Error serving index.html: {e}')
        return f'Error: {str(e)}', 500

@app.route('/stats', methods=['GET'])
def get_stats():
    logger.info('Stats requested')
    try:
        with open(DATA_FILE, 'r') as f:
            stats = json.load(f)
        logger.info(f'Returning stats: {stats}')
        return jsonify(stats)
    except Exception as e:
        logger.error(f'Error reading stats: {e}')
        return jsonify({"error": str(e)}), 500

@app.route('/update', methods=['POST'])
def update_stats():
    logger.info('Received update request')
    try:
        data = request.json
        logger.info(f'Request data: {data}')
        
        with open(DATA_FILE, 'r') as f:
            stats = json.load(f)
        
        stats['blocked_count'] += 1
        stats['bandwidth_saved'] += data.get('size', 0)
        stats['today_blocked'] += 1
        
        if 'url' in data:
            try:
                from urllib.parse import urlparse
                domain = urlparse(data['url']).netloc
                if domain and domain not in stats['domains_blocked']:
                    stats['domains_blocked'].append(domain)
            except Exception as e:
                logger.error(f'Error parsing URL: {e}')
        
        stats['last_updated'] = datetime.now().isoformat()
        
        with open(DATA_FILE, 'w') as f:
            json.dump(stats, f)
        
        logger.info(f'Updated stats: {stats}')
        return jsonify({"status": "success"})
    except Exception as e:
        logger.error(f'Error updating stats: {e}')
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ensure directories exist
    os.makedirs(STATIC_DIR, exist_ok=True)
    
    # Check if index.html exists
    if not os.path.exists(os.path.join(STATIC_DIR, 'index.html')):
        logger.error('index.html not found in static directory!')
        
    ensure_file_exists()
    logger.info('Server starting...')
    logger.info(f'Static directory: {STATIC_DIR}')
    logger.info(f'Stats file location: {DATA_FILE}')
    app.run(port=5000, debug=True)
