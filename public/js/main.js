const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("sw.js", {
          scope: "/",
        });
        if (registration.installing) {
          console.log("Service worker installing");
        } else if (registration.waiting) {
          console.log("Service worker installed");
        } else if (registration.active) {
          console.log("Service worker active");
        }
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  };
  
  // …
  
  registerServiceWorker();


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