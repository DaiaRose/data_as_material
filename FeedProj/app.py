from flask import Flask, jsonify, render_template
from substack_api import Newsletter
from bs4 import BeautifulSoup  # Make sure you have this installed

app = Flask(__name__)

# Initialize the newsletter
newsletter = Newsletter("https://www.erininthemorning.com")


@app.route('/api/posts', methods=['GET'])
def get_recent_posts():
    try:
        recent_posts = newsletter.get_posts(limit=15)
        posts_data = []

        for post in recent_posts:
            metadata = post.get_metadata()
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


@app.route('/api/post/<slug>', methods=['GET'])
def get_post_by_slug(slug):
    try:
        all_posts = newsletter.get_posts(limit=50)

        for post in all_posts:
            metadata = post.get_metadata()
            url = metadata.get("canonical_url", "")
            if slug in url:
                content_html = post.get_content()
                
                # Strip HTML and split into words
                soup = BeautifulSoup(content_html, "html.parser")
                text = soup.get_text(separator=" ")
                words = [word for word in text.split() if word.strip()]
                
                return jsonify(words)

        return jsonify({"error": "Post not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/post/<slug>")
def view_post(slug):
    try:
        all_posts = newsletter.get_posts(limit=50)

        for post in all_posts:
            metadata = post.get_metadata()
            url = metadata.get("canonical_url", "")
            if slug in url:
                title = metadata.get("title", "Untitled")
                return render_template("post.html", slug=slug, title=title)

        return "Post not found", 404
    except Exception as e:
        return f"Error loading post: {str(e)}", 500



if __name__ == '__main__':
    app.run(debug=True)



