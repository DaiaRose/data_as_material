
#gpt wrote this code thorugh my requests and feedback


from substack_api import newsletter, user


# List all available attributes and methods
print(dir(newsletter))

# List all available attributes and methods
print(dir(user))


# import json
# from substack_api import newsletter, user, post

# # Check available attributes in the user module
# print("\n🔍 Available User Methods:")
# print(dir(user))

# # Fetch and display categories
# categories = newsletter.list_all_categories()
# print("\n📌 Substack Categories:")
# for cat_name, cat_id in categories:  # Ensure correct order
#     print(f"- {cat_id}: {cat_name}")

# # Fetch newsletters in each category to test accuracy
# for cat_name, cat_id in categories:
#     try:
#         newsletters = newsletter.get_newsletters_in_category(cat_id, start_page=0, end_page=1)
#         print(f"\n📰 Newsletters in {cat_name} (ID: {cat_id}):")
#         for news in newsletters:
#             print(f"- {news.get('name', 'Unknown Name')} ({news.get('subdomain', 'No URL')})")
#     except Exception as e:
#         print(f"\n⚠️ Unable to fetch newsletters for category {cat_name}: {str(e)}")

# # Fetch recent post metadata from a specific newsletter
# newsletter_slug = "platformer"
# try:
#     recent_posts = newsletter.get_newsletter_post_metadata(newsletter_slug, start_offset=0, end_offset=5)
#     print("\n📝 Recent Posts from Platformer:")
#     for post in recent_posts:
#         title = post.get('title', 'No Title')
#         url = post.get('canonical_url', 'No URL')
#         slug = post.get('slug', None)  # Extract slug
#         print(f"- {title} ({url})")
# except Exception as e:
#     print("\n⚠️ Unable to fetch recent posts from Platformer:", str(e))

# # Fetch full post content if available
# if recent_posts:
#     print("\n📖 Full Post Content from Platformer:")
#     for post in recent_posts:
#         post_id = post.get('id')
#         title = post.get('title', 'No Title')
#         url = post.get('canonical_url', 'No URL')
#         slug = post.get('slug', None)
        
#         if slug:  # Moved inside the loop
#             try:
#                 full_post = newsletter.get_post_contents(newsletter_slug, slug)  # Pass both newsletter and post slug
#                 body = full_post.get('body', 'No Content Available')  # Extract body text
#                 print(f"\n📌 {title} ({url})")
#                 print(f"📝 Content Preview: {body[:500]}...")  # Show only first 500 chars
#             except Exception as e:
#                 print(f"\n⚠️ Unable to fetch full content for {title}: {str(e)}")
#         else:
#             print(f"\n⚠️ Missing slug for {title}, unable to fetch content.")

# # Set username manually or fetch it dynamically
# username = "kitedb"  # Replace with an actual username


# # Fetch user ID
# try:
#     user_id = user.get_user_id(username)
#     print(f"\n👤 User ID: {user_id}")
# except Exception as e:
#     print("\n⚠️ Unable to fetch user ID:", str(e))
#     user_id = None  # Set to None if fetching user_id fails

# # Fetch user's liked posts (only if user_id is available)
# if user_id:
#     try:
#         user_likes = user.get_user_likes(user_id)
#         if user_likes:
#             print("\n❤️ User Likes:")
#             for like in user_likes:
#                 post = like.get('post')
#                 if isinstance(post, dict) and post:
#                     title = post.get('title', 'No Title Available')
#                     url = post.get('canonical_url', 'No URL Available')
#                     print(f"- {title} ({url})")
#                 else:
#                     entity_type = like.get('type', 'Unknown Type')
#                     print(f"- Unable to extract post details (Entity Type: {entity_type})")
#         else:
#             print("\n⚠️ No user likes found.")
#     except Exception as e:
#         print("\n⚠️ Unable to fetch user likes:", str(e))

# # Fetch user notes (only if user_id is available)
# if user_id:
#     try:
#         user_notes = user.get_user_notes(user_id)
#         if user_notes:
#             print("\n📝 User Notes:")
#             for note in user_notes:
#                 body = note.get('body', 'No Content')
#                 print(f"- {body}")
#         else:
#             print("\n⚠️ No user notes found.")
#     except Exception as e:
#         print("\n⚠️ Unable to fetch user notes:", str(e))

# # Fetch user reads (only if username is available)
# if username:
#     try:
#         user_reads = user.get_user_reads(username)
#         if user_reads:
#             print("\n📖 User Reads:")
#             for read in user_reads:
#                 title = read.get('publication_name', 'No Title')
#                 print(f"- {title}")
#         else:
#             print("\n⚠️ No user reads found.")
#     except Exception as e:
#         print("\n⚠️ Unable to fetch user reads:", str(e))