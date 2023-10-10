import { DOMUtils, StorageUtils } from "./options-utils.js";
import { IllegalArgumentError } from "../errors.js";

const EventHelpers = {
  isEnterKey: function (event) {
    return event.key === "Enter" || event.keyCode === 13;
  },
  isClick: function (event) {
    return event.type === "click";
  },
};

export const Handlers = {
  usernameInputKeyPress: function (event) {
    if (EventHelpers.isEnterKey(event)) {
      Utils.saveUsername();
    }
  },
  usernameSaveButtonClick(event) {
    if (EventHelpers.isClick(event)) {
      event.preventDefault();
      Utils.saveUsername();
    }
  },
  handleRemoveUserClick(event) {
    if (EventHelpers.isClick(event)) {
      let targetElement = event.target;
      // If clicked on <i>, adjust targetElement to the parent button
      if (
        targetElement.tagName === "I" &&
        targetElement.parentElement.tagName === "BUTTON"
      ) {
        targetElement = targetElement.parentElement;
      }

      // Now check if the targetElement is the button
      if (targetElement.tagName === "BUTTON") {
        Utils.removeUsername(targetElement);
      }
    }
  },
};

export const Listeners = {
  addUsernameSaveButtonListener() {
    const saveButton = document.getElementById("save-btn");
    saveButton.addEventListener("click", Handlers.usernameSaveButtonClick);
  },
  addUsernameInputListener() {
    const usernameInput = document.getElementById("username-to-hide");
    usernameInput.addEventListener("keypress", Handlers.usernameInputKeyPress);
  },
  addHiddenUsersRemoveButtonListener() {
    const hiddenUsersList = document.getElementById("hidden-users");
    hiddenUsersList.addEventListener("click", Handlers.handleRemoveUserClick);
  },
};

const Utils = {
  saveUsername: function () {
    const username = document.getElementById("username-to-hide").value;
    document.getElementById("username-to-hide").value = "";
    const successMessage = document.getElementById("success-message");

    StorageUtils.saveUsername(username)
      .then((username) => {
        console.log("inside");
        // Set the success message text
        successMessage.textContent = `Username ${username} added!`;

        // Display the success message with animation
        successMessage.classList.add("show");

        console.log(successMessage);

        // Hide the message after a delay (e.g., 3 seconds)
        setTimeout(() => {
          successMessage.classList.remove("show");
        }, 1500);

        DOMUtils.renderHiddenUserList();
      })
      .catch((err) => {
        if (err instanceof IllegalArgumentError) {
          alert(err.message);
        } else {
          console.log(err);
        }
      });
  },
  removeUsername: function (buttonElement) {
    const listItem = buttonElement.closest("li");
    const usernameSpan = listItem.querySelector(".hidden-user");
    const username = usernameSpan.textContent;

    // Apply the fade-out animation
    listItem.classList.add("fade-out");

    // Add the event listener for the end of the animation
    listItem.addEventListener(
      "animationend",
      function () {
        listItem.remove();
        StorageUtils.removeUsername(username)
          .then(() => {
            // Call the render function after the animation completes
            DOMUtils.renderHiddenUserList();
          })
          .catch((err) => {
            if (err instanceof IllegalArgumentError) {
              alert(err.message);
            } else {
              console.log(err);
            }
          });
      },
      { once: true },
    ); // Ensure the listener is only called once
  },
};
