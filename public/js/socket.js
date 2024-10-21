import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

var socket = io();

// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if(formChat) {
  const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
    multiple: true,
    maxFileCount: 6
  });

  formChat.addEventListener("submit", (event) => {
    event.preventDefault();

    const content = formChat.content.value;
    const images = upload.cachedFileArray || [];

    if(content || images.length > 0) {
      const data = {
        content: content,
        images: images
      };
      socket.emit("CLIENT_SEND_MESSAGE", data);

      formChat.content.value = "";

      upload.resetPreviewPanel();
    }
  })
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  console.log(data);
  const myId = document.querySelector(".chat").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");

  let htmlFullName = "";

  if(myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  let htmlContent = "";

  if(data.content) {
    htmlContent = `
      <div class="inner-content">${data.content}</div>
    `;
  }

  let htmlImages = "";

  if(data.images.length > 0) {
    htmlImages += `<div class="inner-images">`;

    for (const image of data.images) {
      htmlImages += `<img src="${image}" />`;
    }

    htmlImages += `</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `;

  const elementListTyping = document.querySelector(".chat .inner-list-typing");
  body.insertBefore(div, elementListTyping);

  socket.emit("CLIENT_SEND_TYPING", false);

  body.scrollTop = body.scrollHeight;

  new Viewer(div);
})
// End SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;

  // ViewerJS
  new Viewer(bodyChat);
  // End ViewerJS
}
// End Scroll Chat To Bottom

// Show Icon
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker) {
  const buttonIcon = document.querySelector('.chat .inner-form .button-icon');
  const tooltip = document.querySelector('.tooltip');

  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('shown');
  })

  const inputChat = document.querySelector(".chat .inner-form input[name='content']");

  emojiPicker.addEventListener('emoji-click', event => {
    inputChat.value = inputChat.value + event.detail.unicode;
  });

  var timeOutTyping;

  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", true);

    clearTimeout(timeOutTyping);

    timeOutTyping = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", false);
    }, 3000)
  })
}
// End Show Icon

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if(elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if(data.type) {
      const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);

      if(!existBoxTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        
        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;
    
        elementListTyping.appendChild(boxTyping);

        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
      if(existBoxTyping) {
        elementListTyping.removeChild(existBoxTyping);
      }
    }
  })
}
// End SERVER_RETURN_TYPING

// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-add-friend");

      button.closest(".box-user").classList.add("add");

      socket.emit("CLIENT_ADD_FRIEND", userIdB);
    })
  })
}
// Hết Chức năng gửi yêu cầu