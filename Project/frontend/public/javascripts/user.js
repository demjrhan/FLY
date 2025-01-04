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

    await submitForm('/api/RegisterUser', formData, form);
    alert("User registered successfully. Please log in.");
    loginUserRequest()

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
        }
        return result;
    } catch (error) {
        console.error("Error during form submission:", error);
        alert("An unexpected error occurred. Please try again.");
    }
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


async function renderPostsUser(posts) {

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

        container.appendChild(postElement);
    });
}

async function renderUserProfile(user, posts) {
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

    await renderPostsUser(posts);
}

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

function mainPage() {
    window.location.href = "/";
}

function mainPageLoggedIn(loggedInUserId) {
    window.location.href = `/logInUser/${loggedInUserId}`;
}