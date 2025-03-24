
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

                // The title is wrapped in an anchor.
                postElement.innerHTML = `
                    <time datetime="${post.post_date}">${new Date(post.post_date).toLocaleString()}</time>
                    <h2><a href="/post/${new URL(post.url).pathname.split('/').filter(Boolean).pop()}">${post.title}</a></h2>
                    <h3>${post.subtitle}</h3>
                `;

                postsContainer.appendChild(postElement);
            });
            
            // Now wrap each h2's anchor text into clickable magnet-word spans.
            const titles = postsContainer.querySelectorAll("h2");
            titles.forEach(title => {
                const anchor = title.querySelector("a");
                if (!anchor) return;
                const href = anchor.getAttribute("href");
                // Get the text from the anchor
                const text = anchor.textContent;
                // Split into words
                const words = text.split(" ");
                // Clear the anchor content
                anchor.innerHTML = "";
                // Rebuild the anchor, wrapping each word in a span.
                words.forEach((word, index) => {
                    const span = document.createElement("span");
                    span.textContent = word;
                    span.classList.add("magnet-word");
                    // Optionally add a slight random rotation:
                    const rotation = Math.random() * 10 - 5;
                    span.style.transform = `rotate(${rotation}deg)`;
                    // Append the magnet word span inside the anchor.
                    anchor.appendChild(span);
                    // Append a space between words
                    if (index < words.length - 1) {
                        anchor.appendChild(document.createTextNode(" "));
                    }
                });
                // The anchor already has its href, so each magnet word is clickable.
            });
        })
        .catch(error => console.error("Error fetching posts:", error));
});
