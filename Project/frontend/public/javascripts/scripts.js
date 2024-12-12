function animateReaction(type, event) {
    const reactionElement = document.createElement('div');
    const { clientX, clientY } = event;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    reactionElement.classList.add('floating-reaction');
    reactionElement.style.position = 'absolute';
    reactionElement.style.left = `${clientX + scrollX}px`;
    reactionElement.style.top = `${clientY + scrollY}px`;
    reactionElement.innerHTML = `<img src="/images/emojis/${type}.png" alt="${type}" class="emoji">`;

    document.body.appendChild(reactionElement);

    setTimeout(() => {
        reactionElement.remove();
    }, 1000);

    const postElement = event.currentTarget.closest('.post');
    if (postElement) {
        const likeCountElement = postElement.querySelector('.likes');
        const currentLikes = parseInt(likeCountElement.textContent.split(' ')[0]);
        likeCountElement.textContent = `${currentLikes + 1} likes`;
    }
}


function updateDescription(id, name, message) {
    const postElement = document.querySelector(`.post[data-post-id="${id}"]`);
    if (postElement) {
        const descriptionElement = postElement.querySelector('.description');
        descriptionElement.innerHTML = `<span class="tag">@${name}</span> ${message}`;
    }
}

function updateInfo(id, name, surname) {
    const postElement = document.querySelector(`.post[data-post-id="${id}"]`);
    if (postElement) {
        const ownerElement = postElement.querySelector('.owner');
        ownerElement.innerHTML = `<span class="name">${name}</span> <span class="surname">${surname}</span>`;
    }
}

function renderPosts(posts) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post.id;

        postElement.innerHTML = `
      <div class="post-header">
        <span class="owner">${post.owner}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="description"><span class="tag">@${post.nickname}</span> ${post.description}</span>
      </div>
      <div class="post-actions">
        <span class="likes">${post.likes} likes</span>
        <div class="reactions">
          <button class="reaction" onclick="animateReaction('smiling', event)">
            <img src="/images/emojis/smiling.png" alt="Smiling" class="emoji">
          </button>
          <button class="reaction" onclick="animateReaction('lovely', event)">
            <img src="/images/emojis/lovely.png" alt="Lovely" class="emoji">
          </button>
        </div>
      </div>
    `;

        container.appendChild(postElement);
    });
}


async function fetchPosts() {
    return [
        {
            id:1,
            owner: "John Doe",
            nickname: "johndoe",
            imageUrl: "/images/photos/sample_1.jpg",
            description: "Post 1 description",
            likes: 100,
        },
        {
            id:2,
            owner: "User2",
            nickname: "user2",
            imageUrl: "images/photos/sample_2.jpg",
            description: "Post 2 description",
            likes: 200,
        },
        {
            id:5,
            owner: "User2",
            nickname: "user2",
            imageUrl: "images/photos/sample_2.jpg",
            description: "Post 2 description",
            likes: 200,
        },
        {
            id:3,
            owner: "User2",
            nickname: "user2",
            imageUrl: "images/photos/sample_2.jpg",
            description: "Post 2 description",
            likes: 200,
        },
    ];
}

