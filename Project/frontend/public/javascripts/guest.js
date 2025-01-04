async function renderPostsGuest(posts) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post.id;

        postElement.innerHTML = `
      <div class="post-header">
            <span class="owner" onclick="fetchUserPostsRequestGuest(${post.owner.id})">${post.owner.name} ${post.owner.surname}</span>
      </div>
      <div class="post-image">
        <img src="${post.imageUrl}" alt="Post Image">
      </div>
      <div class="post-description">
        <span class="tag">@${post.owner.nickname}</span><span class="description"> ${post.description}</span>
      </div>
      <div class="post-actions">
        <div class="likes">
        <span class="like-count">${post.likes} likes</span>
        </div>
      </div>
    `;

        container.appendChild(postElement);
    });
}

async function renderUserProfileGuest(user, posts) {
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


    await renderPostsGuest(posts);
}
function fetchUserPostsRequestGuest(userId) {
    window.location.href = `/viewUserProfileGuest/${userId}`;
}

async function fetchUserPostsGuest(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/GetUserPostsGuest/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}
async function fetchPostsGuest() {
    try {
        const response = await fetch('http://localhost:5000/api/GetAllPostsGuest');
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

function loginUserRequest() {
    window.location.href = `/loginUserRequest`;
}
function registerUserRequest() {
    window.location.href = `/registerUserRequest`;
}

function mainPage(){
    window.location.href = `/`;
}