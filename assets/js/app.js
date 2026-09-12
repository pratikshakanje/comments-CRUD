const cl = console.log;

const BASE_URL = "https://jsonplaceholder.typicode.com"

const COMMENT_URL = `${BASE_URL}/comments`

let xhr = new XMLHttpRequest()

xhr.open("GET", COMMENT_URL)

xhr.onload = function () {
    if (xhr.status === 200) {
        let data = JSON.parse(xhr.response)
        console.log(data);

        let result = ``

        data.forEach(comment => {
            result += `<div class="col-md-4 mt-4" id="${comment.id}">
                <div class="card h-100">
                    <div class="card-header">
                    <h4><span class="text-success">${comment.postId}.</span> ${comment.name}</h4>
                </div>
                <div class="card-body">
                    <p>${comment.body}</p>

                    <h6><span>${comment.email}</span></h6>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <div class="btn btn-sm btn-primary">Edit</div>
                    <div class="btn btn-sm btn-danger">Delete</div>
                </div>
                </div>
            </div>`


            const commentContainer = document.getElementById("commentContainer")
            commentContainer.innerHTML = result
        });
    } else {
        cl("error")
    }
}

xhr.send()