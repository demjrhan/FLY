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
function addPostAdminRequest() {
    window.location.href = `/addPostAdminRequest`;
}

async function addPostToServer() {
    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = `
            <div class="post-content">
                <h2>Add New Post</h2>
                <label for="description">Description:</label>
                <textarea id="post-description" rows="3" placeholder="Enter post description"></textarea>
                <label for="image-url">Image URL:</label>
                <input type="text" id="image-url" placeholder="Enter image URL">
                <label for="user-id">User ID:</label>
                <input type="number" id="user-id" placeholder="Enter your user ID">
                <div class="post-actions">
                    <button id="submit-post">Submit</button>
                    <button id="cancel-post">Cancel</button>
                </div>
            </div>
        `;
    document.body.appendChild(post);

    document.getElementById('submit-post').addEventListener('click', async () => {
        const description = document.getElementById('post-description').value.trim();
        const imageUrl = document.getElementById('image-url').value.trim();
        const userId = parseInt(document.getElementById('user-id').value.trim(), 10);



        const postData = {
            Description: description,
            ImageUrl: imageUrl,
            UserId: userId,
        };

        try {
            const response = await fetch('http://localhost:5000/api/AddPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || 'Unknown error'}`);
            }
            goMainPage();

        } catch (error) {
            console.error('Error adding post:', error);
            alert(`Failed to add post: ${error.message}`);
        }
    });

    document.getElementById('cancel-post').addEventListener('click', async () => {
        goMainPage();
    })

}

async function renderPostsAdmin(posts) {

    const navigation = document.createElement('div');
    navigation.className = 'navigation-container';

    navigation.innerHTML = `
        <nav>
            <ul>
                <li><a href="#" onclick="">Profile</a></li>
                <li><a href="#" onclick="addPostAdminRequest()">Add Photo</a></li>
            </ul>
        </nav>
    `;

    const navigationController = document.querySelector('body'); // Adjust selector if needed
    navigationController.prepend(navigation);

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
        <button class="warn-button" onclick="warnUserRequest(${post.id})">Warn</button>
        <button class="ban-button" onclick="banUserRequest(${post.owner.id})">Ban</button>
      </div>
      <div class="post-header">
            <span class="owner" onclick="fetchUserPostsRequestAdmin(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="tag">@${post.owner.nickname}</span><span class="description"> ${post.description}</span>
      </div>
      <div class="post-actions">
        <div class="likes">
        <span class="like-count" onclick="seeLikeDetails(event)">${post.likes} likes</span>
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

function banUserRequest(userId) {
    window.location.href = `/banUserRequestAdmin/${userId}`;
}
async function banUserFromServer(userId){

    try {
        const response = await fetch(`http://localhost:5000/api/BanUser/${userId}`, {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || 'Unknown error'}`);
        }
        goMainPage()
    } catch (error) {
        console.error('Error warning user:', error);
    }

}
async function renderBanPanelAdmin(posts,userId){
    const navigation = document.createElement('div');
    navigation.className = 'navigation-container';

    navigation.innerHTML = `
        <nav>
            <ul>
                <li><a href="#" onclick="banUserFromServer(${userId})">Ban</a></li>
                <li><a href="#" onclick="fetchUserPostsRequestAdmin(${userId})">Cancel</a></li>
            </ul>
        </nav>
    `;

    const navigationController = document.querySelector('body');
    navigationController.prepend(navigation);

    const container = document.querySelector('.container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post.id;

        postElement.innerHTML = `
      <div class="post-header">
            <span class="owner" onclick="fetchUserPostsRequestAdmin(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="description"><span class="tag">@${post.owner.nickname}</span> ${post.description}</span>
      </div>
      <div class="post-actions">
        <div class="likes">
        <span class="like-count" onclick="seeLikeDetails(event)">${post.likes} likes</span>
        </div>
      </div>
    `;

        container.appendChild(postElement);
    });
}

async function warnUserFromServer(userId,postId) {

    try {
        const response = await fetch(`http://localhost:5000/api/WarnUser/${userId}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || 'Unknown error'}`);
        }

        await deletePostFromServer(postId)
    } catch (error) {
        console.error('Error warning user:', error);
        alert(`Failed to warning user: ${error.message}`);
    }

}

async function warnUser(post) {
    const container = document.querySelector('.small-container');
    container.innerHTML = '';

    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.postId = post.id;


    postElement.innerHTML = `
      <div class ="button">
        <button class="main-page-button" onclick="goMainPage(${post.id})">Return</button>
        <button class="delete-button" onclick="warnUserFromServer(${post.owner.id},${post.id})">Warn</button>
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
        <button class="save-button" onclick="editPostFromServer(${post.id}, ${post.owner.id})">Save</button>
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
        <button class="delete-button" onclick="deletePostFromServer(${post.id}, ${post.owner.id})">Delete</button>
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
        const response = await fetch('http://localhost:5000/api/getAllPostsAdmin');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

}

function fetchUserPostsRequestAdmin(userId) {
    window.location.href = `/viewUserProfileAdmin/${userId}`;
}

async function fetchUserPostsAdmin(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/GetUserPostsAdmin/${userId}`);
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

function warnUserRequest(postId) {
    window.location.href = `/warnUserRequestAdmin/${postId}`;
}

async function deletePostFromServerAdmin(postId,userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/DeletePostById/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
            fetchUserPostsRequestAdmin(userId)
    } catch (error) {
        console.error('Error deleting post:', error);
        alert(`Failed to delete post: ${error.message}`);
    }
}


function editPostRequest(postId) {
    window.location.href = `/editPostRequestAdmin/${postId}`;
}

async function editPostFromServerADMIN(postId,userId) {

    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    const textarea = postElement.querySelector('textarea');
    const imageUrl = postElement.querySelector('.post-image img').src;

    const description = textarea.value.trim();
    try {
        const response = await fetch(`http://localhost:5000/api/EditPost/${postId}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({description, imageUrl})
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || 'Unknown error'}`);
        }

        alert('Post updated successfully');
        fetchUserPostsRequestAdmin(userId);
    } catch (error) {
        console.error('Error updating post:', error);
        alert(`Failed to update post: ${error.message}`);
    }

}


async function seeLikeDetails(event) {
    const postElement = event.target.closest('.post');

    let likeDetailsBox = postElement.nextElementSibling;
    if (likeDetailsBox && likeDetailsBox.classList.contains('like-details-box') || likeDetailsBox && likeDetailsBox.classList.contains('like-details-box-empty') ) {
        likeDetailsBox.style.display = likeDetailsBox.style.display === 'none' ? 'block' : 'none';
    } else {
        const postId = postElement.dataset.postId;
        const response = await fetch(`http://localhost:5000/api/GetLikeDetails/${postId}`);
        const likeDetails = await response.json();

        let likeDetailsHTML;

        if(isValidResponse(likeDetails)){
            likeDetailsHTML = `
            <div class="like-details-box">
                ${likeDetails.map(like => `
                    <div class="like-item">
                        <p><strong>Nickname:</strong> ${like.nickname}</p>
                        <p><strong>Reaction:</strong> ${like.reactionType}</p>
                    </div>
                `).join('')}
            </div>
        `;
        } else {
            likeDetailsHTML = `
            <div class="like-details-box-empty">
                        <p><strong>There is nothing to see here :<</p>
            </div>
        `;
        }


        likeDetailsBox = document.createElement('div');
        likeDetailsBox.className = 'like-details-box';
        likeDetailsBox.innerHTML = likeDetailsHTML;
        postElement.parentNode.insertBefore(likeDetailsBox, postElement.nextSibling);
    }
}


function deleteImage() {
    const postImage = document.querySelector('.post-image img');
    if (postImage) {
        postImage.src = '/images/photos/empty.jpg';
    }
}



function isValidResponse(response) {
    return response && response.length > 0;
}