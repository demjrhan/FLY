
async function likePost(type,event,loggedInUserId,postId) {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: loggedInUserId, postId, reactionType: type }),
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


async function loginUserToServer(event) {
    event.preventDefault();

    const form = document.getElementById("login-form");
    clearErrorMessages(form);

    const formData = {
        nickname: document.getElementById("nickname").value.trim(),
        password: document.getElementById("password").value.trim(),
    };

    const validationMessages = {
        nickname: "Nickname is required.",
        password: "Password is required.",
    };

    if (!validateFields(formData, validationMessages)) return;

    const result = await submitForm('/api/LoginUser', formData, form);
    if (result && result.success) {
        alert("Logged in successfully.");
        await mainPageLoggedIn(result.result.id);
    } else {
        await mainPage()
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


async function registerUserToServer(event) {
    event.preventDefault();

    const form = document.getElementById("register-form");
    clearErrorMessages(form);

    const formData = {
        name: document.getElementById("name").value.trim(),
        surname: document.getElementById("surname").value.trim(),
        nickname: document.getElementById("nickname").value.trim(),
        birthDate: document.getElementById("birthDate").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
    };

    const validationMessages = {
        name: "Name is required.",
        surname: "Surname is required.",
        nickname: "Nickname is required.",
        birthDate: "Birth Date is required.",
        email: "Email is required.",
        password: "Password is required.",
    };

    if (!validateFields(formData, validationMessages)) return;

    const result = await submitForm('/api/RegisterUser', formData, form);

    if (result && result.success) {
        alert("Registered successfully. Please log in.");
        loginUserRequest();
    } else {
        console.log("Registration failed. Errors are displayed.");
    }
}

async function submitForm(endpoint, formData, form) {
    try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
            handleBackendErrors(result, form);
            return { success: false };
        }
        return { success: true, result };
    } catch (error) {
        console.error("Error during form submission:", error);
        alert("An unexpected error occurred. Please try again.");
        return { success: false };
    }
}


async function addPostToServer(event,loggedInUserId) {
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
        await viewUserProfile(loggedInUserId)
    } else {
        console.log("Adding post failed. Errors are displayed.");
    }
}
function displayBackendErrors(errors) {
    Object.keys(errors).forEach((field) => {
        const normalizedField = field.charAt(0).toLowerCase() + field.slice(1);
        const input = document.getElementById(normalizedField);
        if (input) {
            const errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.style.color = "red";
            errorMessage.style.fontSize = "12px";
            errorMessage.textContent = errors[field];
            input.parentElement.insertBefore(errorMessage, input.nextSibling);
        }
    });
}



function handleBackendErrors(result, form) {
    const generalErrorContainer = document.getElementById("validation-error");
    if (result.errors) {
        displayBackendErrors(result.errors);
    } else {
        generalErrorContainer.style.display = "block";
        generalErrorContainer.textContent = result.message || "An error occurred.";
    }
}

function clearErrorMessages(form) {
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());
}



async function renderPostsUser(posts,loggedInUserId) {

    const container = document.querySelector('.container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post.id;
        if (!post.owner.isBanned) {
            postElement.innerHTML = `
      <div class="post-header">
            <span class="owner" onclick="viewUserProfile(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="tag" onclick="viewUserProfile(${post.owner.id})">@${post.owner.nickname}</span>
        <span class="description"> ${post.description}</span>
      </div>
      <div class="post-actions">
        <div class="likes">
        <span class="like-count"">${post.likes} likes</span>
        </div>
        <div class="reactions">
          <button class="reaction" onclick="likePost('smiling', event,${loggedInUserId},${post.id})">
            <img src="/images/emojis/smiling.png" alt="Smiling" class="emoji">
          </button>
          <button class="reaction" onclick="likePost('lovely', event,${loggedInUserId},${post.id})">
            <img src="/images/emojis/lovely.png" alt="Lovely" class="emoji">
          </button>
        </div>
      </div>
    `;
        } else {
            postElement.innerHTML = `
      <div class="post-header">
            <span class="owner" onclick="viewUserProfile(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="tag" onclick="viewUserProfile(${post.owner.id})">@${post.owner.nickname}</span>
        <span class="description"> ${post.description}</span>
      </div>
    `;
        }


        container.appendChild(postElement);
    });
}

async function renderUserProfile(posts,loggedInUserId) {

    const container = document.querySelector('.container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post.id;

        if (!post.owner.isBanned) {
            postElement.innerHTML = `
        <div class ="button">
        <button class="delete-button" onclick="deletePostRequest(${post.id}, ${post.owner.id})">Delete</button>
        <button class="edit-button" onclick="editPostRequest(${post.id}, ${post.owner.id})">Edit</button>
      </div>
      <div class="post-header">
            <span class="owner" onclick="viewUserProfile(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="tag" onclick="viewUserProfile(${post.owner.id})">@${post.owner.nickname}</span>
        <span class="description"> ${post.description}</span>
      </div>
      <div class="post-actions">
        <div class="likes">
        <span class="like-count"">${post.likes} likes</span>
        </div>
        <div class="reactions">
          <button class="reaction" onclick="likePost('smiling', event,${loggedInUserId},${post.id})">
            <img src="/images/emojis/smiling.png" alt="Smiling" class="emoji">
          </button>
          <button class="reaction" onclick="likePost('lovely', event,${loggedInUserId},${post.id})">
            <img src="/images/emojis/lovely.png" alt="Lovely" class="emoji">
          </button>
        </div>
      </div>
    `;
        } else {
            postElement.innerHTML = `
       
      <div class="post-header">
            <span class="owner" onclick="viewUserProfile(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="tag">@${post.owner.nickname}</span><span class="description"> ${post.description}</span>
      </div>

    `;
        }


        container.appendChild(postElement);
    });
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

function viewUserProfile(userId) {
    window.location.href = `/viewUserProfile/${userId}`;
}

async function fetchUserPosts(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/GetUserPosts/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
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
async function fetchAllPosts() {
    try {
        const response = await fetch('http://localhost:5000/api/GetAllPostsUser');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

}

async function logOutUserRequest(){
    window.location.href = "/logOutUser";
}
async function addPostRequest(){
    window.location.href = "/AddPostRequest";
}

async function deletePostRequest(postId,postOwnerId){
    window.location.href = `/DeletePostRequest/${postId}/${postOwnerId}`;
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
async function deletePostFromServer(postId,loggedInUserId){
    try {
        const response = await fetch(`http://localhost:5000/api/DeletePostById/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await viewUserProfile(loggedInUserId)
    } catch (error) {
        console.error('Error deleting post:', error);
        alert(`Failed to delete post: ${error.message}`);
    }
}
async function editPostRequest(postId,postOwnerId){
    window.location.href = `/EditPostRequest/${postId}/${postOwnerId}`;
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
async function editPostFromServer(postId,loggedInUserId){
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
        await viewUserProfile(loggedInUserId);
    } catch (error) {
        console.error('Error updating post:', error);
        alert(`Failed to update post: ${error.message}`);
    }
}
async function fetchPostById(postId) {
    try {
        const response = await fetch(`http://localhost:5000/api/GetPostById/${postId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

}

async function isAdmin(loggedInUserId){
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
function mainPage() {
    window.location.href = "/";
}

async function mainPageLoggedIn(loggedInUserId) {
    if(await isAdmin(loggedInUserId)){
        console.log(loggedInUserId);
        window.location.href = `/logInAdmin/${loggedInUserId}`;
    } else {
        window.location.href = `/logInUser/${loggedInUserId}`;
    }

}