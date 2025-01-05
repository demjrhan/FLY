
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
    await mainPageLoggedIn(result.id);
}

function validateFields(formData, validationMessages) {
    let isValid = true;

    Object.keys(formData).forEach((field) => {
        if (!formData[field]) {
            isValid = false;
            const input = document.getElementById(field);
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

        postElement.innerHTML = `
      <div class="post-header">
            <span class="owner" onclick="fetchUserPostsRequest(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="tag">@${post.owner.nickname}</span><span class="description"> ${post.description}</span>
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

        container.appendChild(postElement);
    });
}

async function renderUserProfile(user) {
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
    profileContainer.appendChild(profileInfo);}

function fetchUserPostsRequest(userId) {
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
async function addPostRequest(){
    window.location.href = "/AddPostRequest";
}
async function addPost(userId,post) {
}
function mainPage() {
    window.location.href = "/";
}

function mainPageLoggedIn(loggedInUserId) {
    window.location.href = `/logInUser/${loggedInUserId}`;
}