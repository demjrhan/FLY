function animateReaction(type, event) {
    const reactionElement = document.createElement('div');
    const {clientX, clientY} = event;
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
        const likeCountElement = postElement.querySelector('.like-count');
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
        <button class="warn-button" onclick="warnUser(${post.owner.id})">Warn</button>
        <button class="ban-button" onclick="banUser(${post.owner.id})">Ban</button>
      </div>
      <div class="post-header">
            <span class="owner">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="description"><span class="tag">@${post.owner.nickname}</span> ${post.description}</span>
      </div>
      <div class="post-actions">
        <div class="likes">
        <span class="like-count">${post.likes} likes</span>
        <button class="like-button" onclick="seeLikeDetails(event)">Like Details</button>
        </div>
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
            <span class="email">Email: ${post.owner.email}</span>
            <span class="password">Password: ${post.owner.password}</span>
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
        <button class="delete-image-button" onclick="deleteImage(${post.id})">Delete Image</button>
        <button class="main-page-button" onclick="goMainPage()">Return</button>
        <button class="save-button" onclick="editPostFromServer(${post.id})">Save</button>
      </div>
      <div class="post-header">
        <span class="owner">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-edit-description">
        <span class="description">
          <span class="post-edit-tag">@${post.owner.nickname}</span>
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
        <button class="delete-button" onclick="deletePostFromServer(${post.id})">Delete</button>
      </div>
     <div class="post-header">
        <span class="owner">${post.owner.name} ${post.owner.surname}</span>
    </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="description"><span class="tag">@${post.owner.nickname}</span> ${post.description}</span>
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

}

async function fetchPostByPostIdAdmin(postId) {
    try {
        const response = await fetch(`http://localhost:5000/api/getPostByPostIdAdmin/${postId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

}


function goMainPage() {
    window.location.href = `/`;
}

function deletePostRequest(postId) {
    window.location.href = `/deletePostRequestAdmin/${postId}`;
}

async function deletePostFromServer(postId) {
    try {
        const response = await fetch(`http://localhost:5000/api/DeletePostById/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Post deleted successfully');
        goMainPage()
    } catch (error) {
        console.error('Error deleting post:', error);
        alert(`Failed to delete post: ${error.message}`);
    }
}


function editPostRequest(postId) {
    window.location.href = `/editPostRequestAdmin/${postId}`;
}

async function editPostFromServer(postId) {

    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    const textarea = postElement.querySelector('textarea');
    const imageUrl = postElement.querySelector('.post-image img').src;

    const description = textarea.value.trim();
    try {
        const response = await fetch(`http://localhost:5000/api/EditPost/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({description, imageUrl})
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || 'Unknown error'}`);
        }

        alert('Post updated successfully');
        goMainPage();
    } catch (error) {
        console.error('Error updating post:', error);
        alert(`Failed to update post: ${error.message}`);
    }

}

function seeLikeDetails(event) {
    const postElement = event.target.closest('.post');

    let likeDetailsBox = postElement.nextElementSibling;
    if (likeDetailsBox && likeDetailsBox.classList.contains('like-details-box')) {
        likeDetailsBox.style.display =
            likeDetailsBox.style.display === 'none' ? 'block' : 'none';
    } else {
        likeDetailsBox = document.createElement('div');
        likeDetailsBox.className = 'like-details-box';
        likeDetailsBox.innerHTML = `
            <h4>Like Details</h4>
            <p>No like data to display yet!</p>`;

        postElement.parentNode.insertBefore(likeDetailsBox, postElement.nextSibling);
    }
}


function deleteImage() {
    const postImage = document.querySelector('.post-image img');
    if (postImage) {
        postImage.src = '/images/photos/empty.jpg';
    }
}

function banUser(ownerId) {
}

function warnUser(ownerId) {
}

