
# #gpt wrote this code thorugh my requests and feedback
# import json
# from substack_api import newsletter, user

# newsletter_slug = "erininthemorn"
# try:
#     # Fetch post metadata
#     raw_response = newsletter.get_newsletter_post_metadata(newsletter_slug, start_offset=0, end_offset=5)

#     if not raw_response:
#         print("\n⚠️ API returned an empty response or invalid newsletter slug.")
#     else:
#         print("\n📝 Recent Posts from Newsletter:")
#         for post in raw_response:
#             title = post.get("title", "No Title")
#             url = post.get("canonical_url", "No URL")
#             subtitle = post.get("subtitle", "No Subtitle")
#             author_names = [author.get("name", "Unknown") for author in post.get("publishedBylines", [])]
#             post_date = post.get("post_date", "No Date Found")
#             reaction_count = post.get("reaction_count", 0)
#             cover_image = post.get("cover_image", "No Cover Image")
#             comment_count = post.get("comment_count", 0)


#             print(f"\nTitle: {title}")
#             print(f"Published At: {post_date}")
#             print(f"Author: {author_names}")
#             print(f"URL: {url}")
#             print(f"Subtitle: {subtitle}")
#             print(f"Cover Image: {cover_image}")
#             print(f"Reaction Count: {reaction_count}")
#             print(f"Comment Count: {comment_count}")



# except Exception as e:
#     print("\n⚠️ API Request Failed:", str(e))


# import substack_api.newsletter
# print(dir(substack_api.newsletter))

from substack_api import Newsletter

newsletter = Newsletter("https://www.erininthemorning.com")

try:
    recent_posts = newsletter.get_posts(limit=5)
    print(recent_posts)
except Exception as e:
    print("Error:", str(e))


