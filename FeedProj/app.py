from flask import Flask, jsonify, render_template
from substack_api import Newsletter

app = Flask(__name__)

# Initialize the newsletter
newsletter = Newsletter("https://www.erininthemorning.com")

@app.route('/api/posts', methods=['GET'])
def get_recent_posts():
    try:
        recent_posts = newsletter.get_posts(limit=15)  # Returns Post objects
        posts_data = []

        for post in recent_posts:
            metadata = post.get_metadata()  # Fetch metadata details
            
            posts_data.append({
                "title": metadata.get("title", "No Title"),
                "subtitle": metadata.get("subtitle", "No Subtitle"),
                "url": metadata.get("canonical_url", "No URL"),
                "post_date": metadata.get("post_date", "No Date"),
                "cover_image": metadata.get("cover_image", ""),
                "audience": metadata.get("audience", ""),
                "comment_count": metadata.get("write_comment_permissions", ""),
                "description": metadata.get("description", "No Description")
            })
        
        return jsonify(posts_data)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)


