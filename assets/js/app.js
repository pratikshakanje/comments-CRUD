const cl = console.log;

const commentForm = document.getElementById("commentForm")
const name = document.getElementById("name")
const body = document.getElementById("body")
const email = document.getElementById("email")
const postId = document.getElementById("postId")
const addComment = document.getElementById("addComment")
const updateComment = document.getElementById("updateComment")
const commentContainer = document.getElementById("commentContainer")

const BASE_URL = "https://jsonplaceholder.typicode.com";

const COMMENT_URL = `${BASE_URL}/comments`;

let xhr = new XMLHttpRequest()

xhr.open("GET", COMMENT_URL)
xhr.send(null)
xhr.onload = function () {
    if (xhr.status === 200) {
        let data = JSON.parse(xhr.response)
        // cl(data);

        let result = ``

        data.forEach(comment => {
            result += `<div class="col-4 mt-4" id="${comment.id}">
                <div class="card h-100">
                    <div class="card-header">
                    <h4>${comment.name}</h4>
                </div>
                <div class="card-body">
                    <p>${comment.body}</p>

                    <h6> <a href="">${comment.email}</a></h6>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <div onclick="onEdit(this)" class="btn btn-sm btn-primary">Edit</div>
                    <div onclick="onRemove(this)" class="btn btn-sm btn-danger">Delete</div>
                </div>
                </div>
            </div>`
        });
        commentContainer.innerHTML = result;
    } else {
        cl("error")
    }
}

//create 
function onCreateComment(eve){
    eve.preventDefault();

    let commentObj = {
        name: name.value,
        body: body.value,
        email: email.value,
        postId: postId.value,
    }
  
    let xhr = new XMLHttpRequest()
    xhr.open("POST", COMMENT_URL)
    xhr.send(JSON.stringify(commentObj))
    xhr.onload = function(){
        let res = JSON.parse(xhr.response)

        if(xhr.status === 201){
            let newComment = document.createElement("div")
            newComment.className = "col-4 mt-4"
            newComment.id = res.id
            newComment.innerHTML = `<div class="card h-100">
                <div class="card-header">
                    <h4>${commentObj.name}</h4>
                </div>
                <div class="card-body">
                    <p>${commentObj.body}</p>

                    <h6> <a href="">${commentObj.email}</a></h6>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <div onclick="onEdit(this)" class="btn btn-sm btn-primary">Edit</div>
                    <div onclick="onRemove(this)" class="btn btn-sm btn-danger">Delete</div>
                </div>
                </div>`

                commentContainer.prepend(newComment)
                commentForm.reset()

               Swal.fire({
                text: `Post ${commentObj.name} created successfully`,
                icon: "success",
                timer: 2500
            }) 
        }else{
            cl("error")
        }
    }
    
}

//edit

function onEdit(ele){
    const editId = ele.closest(".col-4").id
//  cl(editId)
    localStorage.setItem("updateId", editId)
    let editUrl = `${BASE_URL}/comments/${editId}`

    let xhr = new XMLHttpRequest()
    xhr.open("GET",editUrl)
    xhr.send(null)
    xhr.onload =() =>{
         if(xhr.status == 200 ){
            let res = JSON.parse(xhr.response)

            name.value = res.name;
            body.value = res.body;
            email.value = res.email;
            postId.value = res.postId;

            updateComment.classList.remove("d-none")
            addComment.classList.add("d-none")
 
         }
         else{
            cl(" ")
         }
    }
}


//update
function onUpdate(){
    const updateId = localStorage.getItem("updateId")

    const updateObj = {
       name: name.value,
       body: body.value,
       email: email.value,
       postId: postId.value, 
    }

    let xhr = new XMLHttpRequest()
    xhr.open("PATCH", `${COMMENT_URL}/${updateId}`)
    xhr.send(JSON.stringify(updateObj))
    
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)

            let updateCommentCard = document.getElementById(updateId)
           updateCommentCard.querySelector("h4").innerHTML = updateObj.name
           updateCommentCard.querySelector("p").innerHTML = updateObj.body
           updateCommentCard.querySelector("h6").innerHTML = updateObj.email


            updateComment.classList.add("d-none")
            addComment.classList.remove("d-none")

            commentForm.reset()
            localStorage.removeItem("updateId")

            Swal.fire({
                text: `Post ${updateObj.name} update successfully`,
                icon: "success",
                timer: 2500
            }) 
        }
        else{
            cl("error")
        }
    }
}

//delete

function onRemove(ele){
    const deleteId = ele.closest(".col-4").id

    let xhr = new XMLHttpRequest()
    const deleteUrl = `${BASE_URL}/comments/${deleteId}`

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
    if (result.isConfirmed){

    xhr.open("DELETE", deleteUrl)
    xhr.send(null)
    xhr.onload = () =>{
        if(xhr.status === 200){
            ele.closest(".col-4").remove()

            Swal.fire({
                text: `Post with id : ${deleteId} deleted successfully`,
                icon: "success",
                timer: 2500
            }) 
        }
        else{
            cl("error")
        }
    }
  }
 })
}

commentForm.addEventListener("submit", onCreateComment)
updateComment.addEventListener("click", onUpdate)

