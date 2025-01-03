async function registerUserToServer(event) {
    event.preventDefault(); // Prevent the form from submitting

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

    await submitForm('/api/LoginUser', formData, form);
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
        } else {
            alert(result.message || "Operation successful!");
            form.reset();
        }
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


function mainPage() {
    window.location.href = `/`;
}

function mainPageLoggedIn(userId) {
    window.location.href = `/${userId}`;
}