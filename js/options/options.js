import { DOMUtils, StorageUtils } from "./options-utils.js";
import { Listeners } from "./eventListeners.js";

const fetchData = function () {
  return {
    hiddenUsernames: StorageUtils.getHiddenUsernames(),
  };
};

const renderData = function (data) {
  DOMUtils.renderHiddenUserList(data.hiddenUsernames);
};

const bindEvents = function () {
  Listeners.addUsernameSaveButtonListener();
  Listeners.addUsernameInputListener();
  Listeners.addHiddenUsersRemoveButtonListener();
};

const init = function () {
  renderData(fetchData());
  bindEvents();
};

document.addEventListener("DOMContentLoaded", function () {
  init();
});
