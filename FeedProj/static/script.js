document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/posts")
        .then(response => response.json())
        .then(data => {
            console.log("✅ API Response:", data); // Debugging: See what's returned

            if (!Array.isArray(data)) {
                throw new Error("Unexpected API response format");
            }

            const postsContainer = document.getElementById("posts-container");
            postsContainer.innerHTML = ""; // Clear old content

            data.forEach(post => {
                const postElement = document.createElement("div");
                postElement.classList.add("post");

                postElement.innerHTML = `
                    <time datetime="${post.post_date}">${new Date(post.post_date).toLocaleString()}</time>
                    <h2><a href="/post/${new URL(post.url).pathname.split('/').filter(Boolean).pop()}">${post.title}</a></h2>
                    <h3>${post.subtitle}</h3>
                `;


                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error("Error fetching posts:", error));
});


