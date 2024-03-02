const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchButton = document.querySelector("#available-posts button");
const postList = document.querySelector("ul");

function sendHttpRequest(method, url, data) {
  const promise = new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open(method, url);
    //     xhr.responseType = "json";

    //     xhr.onload = function () {
    //       if (xhr.status >= 200 && xhr.status < 300) {
    //         resolve(xhr.response);
    //       } else {
    //         console.log("Error:", xhr.status);
    //       }
    //     };

    //     xhr.send(Json.stringify(data));

    //     xhr.onerror = function () {
    //       console.log(xhr.status);
    //       console.log(xhr.responseType);
    //       reject(new Error("Something went wrong!"));
    //     };

    fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          response.json().then((errData) => {
            console.log(errData);
            throw new Error("Something went wrong - server-side.");
          });
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });

  return promise;
}

async function fetchPosts() {
  try {
    const responseData = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    console.log(responseData);
    const listOfPosts = responseData.data;

    for (const post of listOfPosts) {
      const postEl = document.importNode(postTemplate.content, true);
      postEl.querySelector("h2").textContent = post.title.toUpperCase();
      postEl.querySelector("p").textContent = post.body;
      postEl.querySelector("li").id = post.id;
      listElement.append(postEl);
    }
  } catch (error) {
    console.log(error);
  }
}
async function createPost(title, content) {
  const userId = Math.random();
  const post = {
    title,
    body: content,
    userId,
  };

  const fd = new FormData();
  fd.append("title", title);
  fd.append("body", content);
  fd.append("userId", userId);

  axios.post("https://jsonplaceholder.typicode.com/posts", post);
}

fetchButton.addEventListener("click", fetchPosts);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredTitle = event.currentTarget.querySelector("#title").value;
  const enteredContent = event.currentTarget.querySelector("#content").value;

  createPost(enteredTitle, enteredContent);
});

postList.addEventListener("click", (event) => {
  console.log(event);
  if (event.target.tagName === "BUTTON") {
    console.log(event.target.closest("li"));
    const postId = event.target.closest("li").id;
    console.log(postId);
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  }
});
