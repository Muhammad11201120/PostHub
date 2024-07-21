let currentPage = 1;
let lastPage = 0;
/* window.addEventListener("scroll", function () {
    const endOfPage =
        window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
    if (endOfPage && currentPage < lastPage) {
        currentPage += 1;
        getPosts(false, currentPage);
    }
}); */
SetUpUI();
const baseUrl = "https://tarmeezacademy.com/api/v1";

function LoginButtonClicked() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const params = {
        username: username,
        password: password,
    };
    axios
        .post(baseUrl + "/login", params)
        .then((response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            // closing modal
            const modal = document.getElementById("login-modal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            ShowAlert(
                "WELCOME .. You Have Logged In Successfully",
                "success",
                "success-alert"
            );
            SetUpUI();
        })
        .catch((error) => {
            ShowAlert(error.message, "danger", "danger-alert");
        });
}
function RegisterBtnClicked() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const name = document.getElementById("register-name").value;
    const userImage = document.getElementById("register-image").files[0];

    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("image", userImage);
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    axios
        .post(url + "/register", formData, {
            headers: headers,
        })
        .then((response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            // closing modal
            const modal = document.getElementById("register-modal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            ShowAlert(
                "WELCOME .. New User Have Registered  Successfully",
                "success",
                "success-alert"
            );
            SetUpUI();
        })
        .catch((error) => {
            ShowAlert(error.message, "danger", "danger-alert");
        });
}
function Logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    SetUpUI();
    ShowAlert("You Have Just Loged Out Successfully", "danger", "danger-alert");
}
function ShowAlert(Custommessage, alertType, element) {
    const alertPlaceholder = document.getElementById(element);
    const alert = (message, type) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = [
            `<div class="alert alert-${alertType} alert-dismissible" role="alert">`,
            `   <div>${Custommessage}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            "</div>",
        ].join("");

        alertPlaceholder.append(wrapper);
    };
    alert(Custommessage, alertType);
    //Hiding alert

    setTimeout(function () {
        const alertHide = bootstrap.Alert.getOrCreateInstance("#" + element);
        alertHide.close();
    }, 3000);
}
function SetUpUI() {
    const login = document.getElementById("login-div");
    const logout = document.getElementById("logout-div");
    const addBtn = document.getElementById("add-post");
    if (localStorage.getItem("token") == null) {
        login.style.setProperty("display", "flex", "important");
        logout.style.setProperty("display", "none", "important");
        if (addBtn != null)
            addBtn.style.setProperty("display", "none", "important");
    } else {
        login.style.setProperty("display", "none", "important");
        logout.style.setProperty("display", "flex", "important");
        if (addBtn != null)
            addBtn.style.setProperty("display", "flex", "important");
    }
    loadUserImage();
}
function loadUserImage() {
    document.getElementById("user-profile-image").style.display = "none";
    if (localStorage.getItem("token") != null) {
        let user = JSON.parse(localStorage.getItem("user"));
        let username = user.username;
        let userImage = document.getElementById("user-profile-image");
        let user_image = `images/user.jpg`;
        document.getElementById("user-username").innerHTML = username;

        if (JSON.stringify(user.profile_image) != "{}")
            user_image = user.profile_image;
        userImage.setAttribute("src", user_image);
        userImage.style.display = "flex";
        console.log(user_image);
    }
}
