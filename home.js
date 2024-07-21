function getPosts(reload = true, page = 1) {
    axios
        .get(baseUrl + `/posts?limit=5&page=${page}`)
        .then((response) => {
            if (reload) document.getElementById("posts").innerHTML = "";

            lastPage = response.data.meta.last_page;
            console.log(response.data);
            let userImage = `images/userNone.jpg`;
            let bodyImage = `images/nature.jpg`;
            let title = "";
            let body = "";
            let userName = "";
            let tags = [];

            for (let data of response.data.data) {
                // show or hide (Edit) Button
                let user = getCurrentUser();
                let isMyPost = user != null && data.author.id == user.id;
                let buttonEditContent = ``;
                if (isMyPost) {
                    buttonEditContent = `<button class="btn btn-secondary mt-2" onclick="editPostClicked('${encodeURIComponent(
                        JSON.stringify(data)
                    )}')"
                        style="float: right; padding: 8px 20px;">EDIT</button>`;
                }

                if (JSON.stringify(data.image) != "{}") bodyImage = data.image;
                if (data.title != null) title = data.title;
                if (data.body != null) body = data.body;
                if (data.tags.length != 0) {
                    for (let tag of data.tags) tags.append(tag);
                }
                if (data.author.username != null)
                    userName = data.author.username;
                if (JSON.stringify(data.author.profile_image) != "{}")
                    userImage = data.author.profile_image;
                FillPosts(
                    data,
                    userImage,
                    bodyImage,
                    title,
                    body,
                    userName,
                    tags,
                    buttonEditContent
                );
            }
            SetUpUI();
        })
        .catch((error) => {
            console.log(error);
        });
}
function getPostClicked(postID) {
    window.location = `post.html?postid=${postID}`;
}
function FillPosts(
    data,
    userImage,
    bodyImage,
    title,
    body,
    username,
    tags,
    buttonEditContent
) {
    let content = ` <div id="post" class="card col-9 shadow" ">
                <div class="card-header">
                    <img src="${userImage}" alt="user-image" id="user-image" class="rounded-circle m-2 user-image">
                    <p class="d-inline"><b>${username}</b></p>
                    ${buttonEditContent}
                </div>
                <div class="card-body d-flex justify-content-center flex-column" style="cursor:pointer" onclick="getPostClicked(${data.id})">
                    <img src="${bodyImage}" alt="" id="body-image" class="w-100">
                    <h6>${data.created_at}</h6>
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${body}</p>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pen" viewBox="0 0 16 16">
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                        </svg>
                        <span>
                            (${data.comments_count}) comments
                        </span>
                        <span id="tags${data.id}">

                        </span>
                    </div>
                </div>
            </div>`;

    if (tags.length > 0) {
        let counter = 0;
        for (let tag of tags) {
            counter++;
            let content2 = `<button class="btn btn-sm rounded5" style="background-color : gray; color: white">${tag.name}</button>`;
            document.getElementById(`tags${data.id}`).innerHTML += content2;
        }
    }
    document.getElementById("posts").innerHTML += content;
}
getPosts(1);
function CreateNewPostBtnClicked() {
    let url = ``;
    const postID = document.getElementById("post-id-input").value;
    const postTitle = document.getElementById("post-title").value;
    const postBody = document.getElementById("post-body").value;
    const postImage = document.getElementById("post-image").files[0];
    let isCreate = postID == null || postID == "";

    let formData = new FormData();
    formData.append("body", postBody);
    formData.append("title", postTitle);
    formData.append("image", postImage);

    let headers = {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (isCreate) {
        url = `${baseUrl}/posts`;
    } else {
        formData.append("_method", "put");
        url = `${baseUrl}/posts/${postID}`;
    }
    axios
        .post(url, formData, {
            headers: headers,
        })
        .then((response) => {
            // closing modal
            const modal = document.getElementById("create-post-modal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            ShowAlert(
                "New Post Has Been Created Successfully",
                "success",
                "success-alert"
            );
            getPosts();
        })
        .catch((error) => {
            ShowAlert(error.message, "danger", "danger-alert");
        });
}
function editPostClicked(data) {
    let post = JSON.parse(decodeURIComponent(data));
    console.log(post);
    document.getElementById("create-modal-submit-btn").innerHTML = "UPDATE";
    document.getElementById("post-modal-title").innerHTML = "Edit Post";
    document.getElementById("post-id-input").value = post.id;
    document.getElementById("post-title").value = post.title;
    document.getElementById("post-body").value = post.body;
    let postModal = new bootstrap.Modal(
        document.getElementById("create-post-modal"),
        {}
    );
    postModal.toggle();
}

function addNewPostBtnClicked() {
    document.getElementById("create-modal-submit-btn").innerHTML = "CREATE";
    document.getElementById("post-modal-title").innerHTML = "Create A New Post";
    document.getElementById("post-id-input").value = "";
    document.getElementById("post-title").value = "";
    document.getElementById("post-body").value = "";
    let postModal = new bootstrap.Modal(
        document.getElementById("create-post-modal"),
        {}
    );
    postModal.toggle();
}

function getCurrentUser() {
    let user = null;
    const storedUser = localStorage.getItem("user");
    if (storedUser != null) user = JSON.parse(storedUser);
    return user;
}
