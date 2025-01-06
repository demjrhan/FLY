async function likePost(type, event, loggedInUserId, postId) {
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
        try {
            const response = await fetch(`http://localhost:5000/api/LikePost/${loggedInUserId}/${postId}/${type}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId: loggedInUserId, postId, reactionType: type}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.alreadyLiked) {
                console.log(result.message);
            } else {
                console.log(result.message);
                const likeCountElement = postElement.querySelector('.like-count');
                const currentLikes = parseInt(likeCountElement.textContent.split(' ')[0]);
                likeCountElement.textContent = `${currentLikes + 1} likes`;

            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }

    }
}


async function addPostToServer(event, loggedInUserId) {
    event.preventDefault();

    const form = document.getElementById("add-post-form");
    clearErrorMessages(form);

    const formData = {
        description: document.getElementById("description").value.trim(),
        userId: loggedInUserId,
        imageUrl: "/images/photos/sample_photo.png"
    };

    const validationMessages = {
        description: "Description is required."
    };

    if (!validateFields(formData, validationMessages)) return;

    const result = await submitForm('/api/AddPost', formData, form);

    if (result && result.success) {
        alert("Adding post successful.");
        await viewUserProfileAdmin(loggedInUserId)
    } else {
        console.log("Adding post failed. Errors are displayed.");
    }
}


function validateFields(formData, validationMessages) {
    let isValid = true;

    Object.keys(formData).forEach((field) => {
        if (!formData[field]) {
            const input = document.getElementById(field);
            if (!input) {
                console.error(`Field '${field}' does not exist in the form.`);
                return;
            }
            isValid = false;
            const errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.style.color = "red";
            errorMessage.style.fontSize = "12px";
            errorMessage.textContent = validationMessages[field];
            input.parentElement.insertBefore(errorMessage, input.nextSibling);
        }
    });

    return isValid;
}

async function submitForm(endpoint, formData, form = null) {
    try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (form) {
            if (!response.ok) {
                handleBackendErrors(result, form);
                return {success: false};
            }
        }

        return {success: true, result};
    } catch (error) {
        console.error("Error during form submission:", error);
        alert("An unexpected error occurred. Please try again.");
        return {success: false};
    }
}

function clearErrorMessages(form) {
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());
}

async function renderPostsAdmin(posts, loggedInUserId) {

    const container = document.querySelector('.container');
    container.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post.id;

        if (!post.owner.isBanned) {
            postElement.innerHTML = `
        <div class="button">
            <button class="delete-button" onclick="deletePostRequest(${post.id}, ${post.owner.id})">Delete</button>
            <button class="edit-button" onclick="editPostRequest(${post.id}, ${post.owner.id})">Edit</button>
            <button class="warn-button" onclick="warnUserRequest(${post.id}, ${post.owner.id})">Warn</button>
            <button class="ban-button" onclick="banUserRequest(${post.owner.id})">Ban</button>
        </div>
        <div class="post-header">
            <span class="owner" onclick="viewUserProfileAdmin(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
        </div>
        <div class="post-image">
            <img src="${post.imageUrl}" alt="Post Image">
        </div>
        <div class="post-description">
            <span class="tag" onclick="viewUserProfileAdmin(${post.owner.id})">@${post.owner.nickname}</span>
            <span class="description"> ${post.description}</span>
        </div>
        <div class="post-actions">
            <div class="likes">
                <span class="like-count" onclick="seeLikeDetails(event)">${post.likes} likes</span>
            </div>
            <div class="reactions">
                <button class="reaction" onclick="likePost('smiling', event, ${loggedInUserId}, ${post.id})">
                    <img src="/images/emojis/smiling.png" alt="Smiling" class="emoji">
                </button>
                <button class="reaction" onclick="likePost('lovely', event, ${loggedInUserId}, ${post.id})">
                    <img src="/images/emojis/lovely.png" alt="Lovely" class="emoji">
                </button>
            </div>
        </div>
    `;
        } else {
            postElement.innerHTML = `
        <div class="post-header">
            <span class="owner" onclick="viewUserProfileAdmin(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
        </div>
        <div class="post-image">
            <img src="${post.imageUrl}" alt="Post Image">
        </div>
        <div class="post-description">
            <span class="tag" onclick="viewUserProfileAdmin(${post.owner.id})">@${post.owner.nickname}</span>
            <span class="description"> ${post.description}</span>
        </div>
    `;
        }


        const additionalInfo = document.createElement('div');
        additionalInfo.className = 'additional-info';
        additionalInfo.innerHTML = `
        <div class="user-info">
            <span class="nickname">Nickname: ${post.owner.nickname}</span>
            <span class="password">Password: ${post.owner.password}</span>
        </div>
        `;

        container.appendChild(additionalInfo);
        container.appendChild(postElement);
    });
}


async function renderNoPost() {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    const postElement = document.createElement('div');
    postElement.className = 'no-post';
    postElement.innerHTML = `
        <div class="post-image">
            <img src="/images/photos/no_post.jpg" alt="No Posts Available" /> 
        </div>
        <div class="empty-post-description">
            <p>No posts are available at the moment. Please check back later.</p>
        </div>
    `;

    container.appendChild(postElement);
}

function banUserRequest(userId) {
    window.location.href = `/banUserRequestAdmin/${userId}`;
}

async function banUserFromServer(userId) {

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
        await viewUserProfileAdmin(userId);

    } catch (error) {
        console.error('Error warning user:', error);
    }

}

async function renderBanPanelAdmin(posts) {

    const container = document.querySelector('.container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post.id;

        postElement.innerHTML = `
      <div class="post-header">
            <span class="owner" onclick="viewUserProfileAdmin(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
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

async function warnUserFromServer(userId, postId) {

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
        const responseData = await response.json();

        if (responseData.message && responseData.message.includes('banned')) {
            alert(`User banned: ${responseData.message}`);
            await mainPageLoggedIn(loggedInUserId);
        } else {
            alert(responseData.message);
            await deletePostFromServerAdmin(postId, userId);
        }
    } catch (error) {
        console.error('Error warning user:', error);
        alert(`Failed to warning user: ${error.message}`);
    }

}


async function renderWarnPanelAdmin(post) {

    const container = document.querySelector('.container');
    container.innerHTML = '';

    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.postId = post.id;


    postElement.innerHTML = `
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
        <span class="like-count" onclick="seeLikeDetails(event)">${post.likes} likes</span>
        </div>
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

function viewUserProfileAdmin(userId) {
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
        console.log(response)
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

}

function deletePostPage(post) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.postId = post.id;


    postElement.innerHTML = `
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

function goMainPage() {
    window.location.href = `/`;
}

async function deletePostRequest(postId, postOwnerId) {
    window.location.href = `/DeletePostRequest/${postId}/${postOwnerId}`;
}

function warnUserRequest(postId, userId) {
    window.location.href = `/warnUserRequestAdmin/${postId}/${userId}`;
}

async function deletePostFromServerAdmin(postId, userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/DeletePostById/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await viewUserProfileAdmin(userId)
    } catch (error) {
        console.error('Error deleting post:', error);
        alert(`Failed to delete post: ${error.message}`);
    }
}


async function editPostRequest(postId, postOwnerId) {
    window.location.href = `/EditPostRequest/${postId}/${postOwnerId}`;
}

async function seeLikeDetails(event) {
    const postElement = event.target.closest('.post');

    let likeDetailsBox = postElement.nextElementSibling;
    if (likeDetailsBox && (likeDetailsBox.classList.contains('like-details-box') || likeDetailsBox.classList.contains('like-details-box-empty'))) {
        likeDetailsBox.classList.toggle('hidden');
    } else {
        const postId = postElement.dataset.postId;
        const response = await fetch(`http://localhost:5000/api/GetLikeDetails/${postId}`);
        const likeDetails = await response.json();

        if (!isValidResponse(likeDetails)) {
            likeDetailsBox = document.createElement('div');
            likeDetailsBox.className = 'like-details-box-empty';
            likeDetailsBox.innerHTML = `
                <p><strong>There is nothing to see here :<</p>
            `;
            if (postElement.nextSibling) {
                postElement.parentNode.insertBefore(likeDetailsBox, postElement.nextSibling);
            } else {
                postElement.parentNode.appendChild(likeDetailsBox);
            }
            return;
        }

        let currentPage = 0;
        const itemsPerPage = 3;

        const renderPage = () => {
            const startIndex = currentPage * itemsPerPage;
            const paginatedLikes = likeDetails.slice(startIndex, startIndex + itemsPerPage);

            likeDetailsBox.innerHTML = `
                <div class="like-details-box">
                    ${paginatedLikes.map(like => `
                        <div class="like-item">
                            <p><strong>Nickname:</strong> ${like.nickname}</p>
                            <p><strong>Reaction:</strong> ${like.reactionType}</p>
                        </div>
                    `).join('')}
                    <div class="pagination-buttons">
                        <button id="prev-page" ${currentPage === 0 ? 'disabled' : ''}>Previous</button>
                        <button id="next-page" ${startIndex + itemsPerPage >= likeDetails.length ? 'disabled' : ''}>Next</button>
                    </div>
                </div>
            `;
            attachButtonEvents();
        };

        const attachButtonEvents = () => {
            const prevButton = likeDetailsBox.querySelector('#prev-page');
            const nextButton = likeDetailsBox.querySelector('#next-page');

            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    if (currentPage > 0) {
                        currentPage--;
                        renderPage();
                    }
                });
            }

            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    if ((currentPage + 1) * itemsPerPage < likeDetails.length) {
                        currentPage++;
                        renderPage();
                    }
                });
            }
        };

        likeDetailsBox = document.createElement('div');
        likeDetailsBox.className = 'like-details-box';
        if (postElement.nextSibling) {
            postElement.parentNode.insertBefore(likeDetailsBox, postElement.nextSibling);
        } else {
            postElement.parentNode.appendChild(likeDetailsBox);
        }
        renderPage();
    }
}



function deleteImage() {
    const postImage = document.querySelector('.post-image img');
    if (postImage) {
        postImage.src = '/images/photos/empty.jpg';
    }
}

async function isAdmin(loggedInUserId) {
    try {
        const response = await fetch(`http://localhost:5000/api/isAdmin/${loggedInUserId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

async function mainPageLoggedIn(loggedInUserId) {
    if (await isAdmin(loggedInUserId)) {
        console.log(loggedInUserId);
        window.location.href = `/logInAdmin/${loggedInUserId}`;
    } else {
        window.location.href = `/logInUser/${loggedInUserId}`;
    }

}

function isValidResponse(response) {
    return response && response.length > 0;
}

async function logOutUserRequest() {
    window.location.href = "/logOutUser";
}

async function fetchUser(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/GetUser/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

async function renderUserProfileCard(user) {
    const profileContainer = document.querySelector('.profile-container');
    profileContainer.innerHTML = '';

    const profileInfo = document.createElement('div');
    profileInfo.className = 'profile-info';

    const profileIcon = document.createElement('div');
    profileIcon.className = 'profile-icon';
    profileIcon.innerHTML = '<img src="/images/photos/profile-icon.png" alt="Profile Icon">';

    profileInfo.appendChild(profileIcon);

    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';

    const nameElement = document.createElement('p');
    nameElement.className = 'name';
    nameElement.textContent = user.name;

    const surnameElement = document.createElement('p');
    surnameElement.className = 'surname';
    surnameElement.textContent = user.surname;

    textContainer.appendChild(nameElement);
    textContainer.appendChild(surnameElement);

    profileInfo.appendChild(textContainer);
    profileContainer.appendChild(profileInfo);
}

async function renderUserProfile(posts, loggedInUserId) {

    const container = document.querySelector('.container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post.id;

            postElement.innerHTML = `
        <div class="button">
            <button class="delete-button" onclick="deletePostRequest(${post.id}, ${post.owner.id})">Delete</button>
            <button class="edit-button" onclick="editPostRequest(${post.id}, ${post.owner.id})">Edit</button>
            <button class="warn-button" onclick="warnUserRequest(${post.id}, ${post.owner.id})">Warn</button>
            <button class="ban-button" onclick="banUserRequest(${post.owner.id})">Ban</button>
        </div>
        <div class="post-header">
            <span class="owner" onclick="viewUserProfileAdmin(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
        </div>
        <div class="post-image">
            <img src="${post.imageUrl}" alt="Post Image">
        </div>
        <div class="post-description">
            <span class="tag" onclick="viewUserProfileAdmin(${post.owner.id})">@${post.owner.nickname}</span>
            <span class="description"> ${post.description}</span>
        </div>
        <div class="post-actions">
            <div class="likes">
                <span class="like-count" onclick="seeLikeDetails(event)">${post.likes} likes</span>
            </div>
            <div class="reactions">
                <button class="reaction" onclick="likePost('smiling', event, ${loggedInUserId}, ${post.id})">
                    <img src="/images/emojis/smiling.png" alt="Smiling" class="emoji">
                </button>
                <button class="reaction" onclick="likePost('lovely', event, ${loggedInUserId}, ${post.id})">
                    <img src="/images/emojis/lovely.png" alt="Lovely" class="emoji">
                </button>
            </div>
        </div>
    `;

        const additionalInfo = document.createElement('div');
        additionalInfo.className = 'additional-info';
        additionalInfo.innerHTML = `
        <div class="user-info">
            <span class="nickname">Nickname: ${post.owner.nickname}</span>
            <span class="password">Password: ${post.owner.password}</span>
        </div>
        `;

        container.appendChild(additionalInfo);
        container.appendChild(postElement);
    });
}

async function editPostFromServer(postId, userId) {
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
        await viewUserProfileAdmin(userId);
    } catch (error) {
        console.error('Error updating post:', error);
        alert(`Failed to update post: ${error.message}`);
    }
}

function editPostPage(post) {
    document.addEventListener('input', (event) => {
        const textarea = event.target.closest('.post-edit-description textarea');
        if (textarea) {
            const lines = textarea.value.split('\n');
            if (lines.length > 2) {
                textarea.value = lines.slice(0, 2).join('\n');
            }
        }
    });


    const container = document.querySelector('.container');
    container.innerHTML = '';

    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.postId = post.id;


    postElement.innerHTML = `
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

async function addPostRequest() {
    window.location.href = "/AddPostRequestAdmin";
}