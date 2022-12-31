window.onload = function () {
    let messageBox = document.getElementById('longform-message');
    messageBox.addEventListener("input", longformMessageChecker);
}

const longformMessageChecker = () => {
    let messageBox = document.getElementById('longform-message');
    let feedbackMessage = document.getElementById('longform-message-feedback-label');
    let currentLength = messageBox.value.length;
    let maxLength = messageBox.maxLength;

    let differential = maxLength - currentLength;
    console.log(maxLength,currentLength,differential);
    feedbackMessage.textContent='Characters remaining: ' +differential;
}