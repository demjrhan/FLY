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


function renderPostsAdmin(posts) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post.id;

        postElement.innerHTML = `
      <div class ="button">
        <button class="delete-button" onclick="deletePostRequest(${post.id})">Delete</button>
        <button class="edit-button" onclick="editPostRequest(${post.id})">Edit</button>
        <button class="warn-button" onclick="warnUser(${post.ownerId})">Warn</button>
        <button class="ban-button" onclick="banUser(${post.ownerId})">Ban</button>

      </div>
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

        const additionalInfo = document.createElement('div');
        additionalInfo.className = 'additional-info';
        additionalInfo.innerHTML = `
        <div class="user-info">
            <span class="email">Email: ${post.email}</span>
            <span class="password">Password: ${post.password}</span>
        </div>
        `;

        container.appendChild(additionalInfo);
        container.appendChild(postElement);
    });
}

function editPost(post) {
    document.addEventListener('input', (event) => {
        const textarea = event.target.closest('.post-edit-description textarea');
        if (textarea) {
            const lines = textarea.value.split('\n');
            if (lines.length > 2) {
                textarea.value = lines.slice(0, 2).join('\n');
            }
        }
    });


    const container = document.querySelector('.small-container');
    container.innerHTML = '';

    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.postId = post.id;


    postElement.innerHTML = `
      <div class ="button">
        <button class="main-page-button" onclick="goMainPage(${post.id})">Return</button>
        <button class="save-button" onclick="">Save</button>
      </div>
      <div class="post-header">
        <span class="owner">${post.owner}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-edit-description">
        <span class="description">
          <span class="post-edit-tag">@${post.nickname}</span>
        </span>
        <textarea class="post-edit-description" rows="2">${post.description}</textarea>
      </div>
    `;
    container.appendChild(postElement);
}

function deletePost(post) {
    const container = document.querySelector('.small-container');
    container.innerHTML = '';

    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.postId = post.id;


    postElement.innerHTML = `
      <div class ="button">
        <button class="main-page-button" onclick="goMainPage(${post.id})">Return</button>
        <button class="delete-button" onclick="">Delete</button>
      </div>
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
      </div>
    `;
    container.appendChild(postElement)

}

async function fetchPostsAdmin() {
    try {
        const response = await fetch('http://localhost:5000/api/getPostsAdmin');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

}async function fetchPostByIdAdmin(postId) {
    try {
        const response = await fetch(`http://localhost:5000/api/getPostAdmin/${postId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

}


function goMainPage(){
    window.location.href = '/';
}
function deletePostRequest(postId) {
    window.location.href = `/deletePostRequest/${postId}`;
}
function editPostRequest(postId) {
    window.location.href = `/editPostRequest/${postId}`;
}

function banUser(ownerId) {
    window.location.href = `/banUser/${ownerId}`;
}
function warnUser(ownerId) {
    window.location.href = `/warnUser/${ownerId}`;
}