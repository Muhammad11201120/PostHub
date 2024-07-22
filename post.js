let params = new URLSearchParams(window.location.search);
let id = params.get("postid");
let comments = [];

function getPost() {
    axios
        .get(baseUrl + `/posts/${id}`)
        .then((response) => {
            console.log(response.data.data);
            comments = response.data.data.comments;
            console.log(comments);
            FillPost(response.data.data, comments);
            SetUpUI();
        })
        .catch((error) => {
            ShowAlert(error.response.data.message, "danger", "danger-alert");
        });
}
function FillPost(data, comments) {
    document.getElementById("posts").innerHTML = "";

    let userImage = `images/userNone.jpg`;
    let bodyImage = "images/nature.jpg";
    let title = "";
    let body = "";
    let userName = "";
    let tags = [];
    if (JSON.stringify(data.image) != "{}") bodyImage = data.image;
    if (data.title != null) title = data.title;
    if (data.body != null) body = data.body;
    if (data.tags.length != 0) {
        for (let tag of data.tags) tags.append(tag);
    }
    if (data.author.username != null) userName = data.author.username;
    if (JSON.stringify(data.author.profile_image) != "{}")
        userImage = data.author.profile_image;

    document.getElementById("post-username").innerHTML = data.author.username;
    let commentsContent = ``;
    for (let comment of comments) {
        let commentAuthorImage = "images/userNone.jpg";
        if (JSON.stringify(comment.author.profile_image) != "{}")
            commentAuthorImage = comment.author.profile_image;
        commentsContent += `<div class="p-3 my-1 text-white bg-dark">
                        <div>
                            <img src="${commentAuthorImage}" class="rounded-circle user-image" alt="user-image">
                            <b>${comment.author.username}</b>
                        </div>
                        <div>
                            ${comment.body}
                        </div>
                    </div>`;
    }
    let content = ` <div id="post" class="card col-9 shadow text-white bg-secondary">
                <div class="card-header">
                    <img src="${userImage}" alt="user-image" id="user-image" class="rounded-circle m-2 user-image">
                    <p class="d-inline"><b>${userName}</b></p>
                </div>
                <div class="card-body d-flex justify-content-center flex-column">
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
                <div id="comments" class="p-3">

                </div>
                 <!--Create New Comment-->
                <div id="Add-comment-div" class="input-group mb-2 p-3">
                    <input type="text" id="comment-body" class="form-control mx-1" placeholder="Add Your Comment Here..." />
                    <button id="send-comment" class="btn btn-dark" onclick="addComment()">
                        SEND
                    </button>
                </div>
                <!--End Create New Comment-->
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
    document.getElementById("comments").innerHTML += commentsContent;
}
getPost();
function addComment() {
    let commentBody = document.getElementById("comment-body").value;
    let params = {
        body: commentBody,
    };
    let token = localStorage.getItem("token");
    axios
        .post(`${baseUrl}/posts/${id}/comments`, params, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            getPost();
        })
        .catch((error) => {
            ShowAlert(error.response.data.message, "danger", "danger-alert");
        });
}
