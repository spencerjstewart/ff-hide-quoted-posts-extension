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
      Utils.saveUsername();
    }
  },

  hiddenUsersRemoveButtonClick(event) {
    if (EventHelpers.isClick(event)) {
      Utils.removeUsername(event);
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
    hiddenUsersList.addEventListener(
      "click",
      Handlers.hiddenUsersRemoveButtonClick,
    );
  },
};

const Utils = {
  saveUsername: function () {
    const username = document.getElementById("username-to-hide").value;
    StorageUtils.saveUsername(username)
      .then((username) => {
        alert(`Username ${username} saved.`);
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
  removeUsername: function (event) {
    const usernameSpan =
      event.target.parentElement.querySelector(".hidden-user");
    const username = usernameSpan.textContent;
    StorageUtils.removeUsername(username)
      .then((username) => {
        alert(`Username ${username} removed.`);
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
};
