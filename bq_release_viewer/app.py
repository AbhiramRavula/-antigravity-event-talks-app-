import re
import requests
import xml.etree.ElementTree as ET
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def clean_html_tags(text):
    # Remove HTML tags to get plain text for Twitter sharing
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text).strip()

def parse_release_notes():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(FEED_URL, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch BigQuery release notes feed. Status code: {response.status_code}")
    
    xml_content = response.content
    root = ET.fromstring(xml_content)
    
    # Atom namespace
    ns = {'atom': 'http://www.w3.org/2005/Atom'}
    
    entries = []
    
    for entry in root.findall('atom:entry', ns):
        date = entry.find('atom:title', ns).text
        updated = entry.find('atom:updated', ns).text
        
        link_elem = entry.find("atom:link[@rel='alternate']", ns)
        link = link_elem.attrib.get('href') if link_elem is not None else ""
        
        content_elem = entry.find('atom:content', ns)
        content_html = content_elem.text if content_elem is not None else ""
        
        # Parse updates inside HTML (separated by <h3>)
        # Using regex to split by <h3>...</h3> tags
        parts = re.split(r'<h3>(.*?)</h3>', content_html)
        updates = []
        
        if len(parts) > 1:
            for i in range(1, len(parts), 2):
                update_type = parts[i].strip()
                update_body = parts[i+1].strip() if i+1 < len(parts) else ""
                plain_text = clean_html_tags(update_body)
                
                updates.append({
                    "type": update_type,
                    "html": update_body,
                    "text": plain_text
                })
        else:
            plain_text = clean_html_tags(content_html)
            updates.append({
                "type": "General",
                "html": content_html,
                "text": plain_text
            })
            
        entries.append({
            "date": date,
            "updated": updated,
            "link": link,
            "updates": updates
        })
        
    return entries

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/releases')
def get_releases():
    try:
        releases = parse_release_notes()
        return jsonify({"success": True, "releases": releases})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
