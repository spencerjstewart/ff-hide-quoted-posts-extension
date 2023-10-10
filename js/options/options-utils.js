import { IllegalArgumentError, KeyNotFoundError } from "../errors.js";

export const DOMUtils = {
  renderHiddenUserList: function () {
    StorageUtils.getHiddenUsernames()
      .then((hiddenUsernames) => {
        DOMUtils.appendUsernamesToHiddenUserList(hiddenUsernames);
      })
      .catch((err) => {
        if (err instanceof KeyNotFoundError) {
          console.log(err.message);
        } else {
          console.log(err);
        }
      });
  },
  createHiddenUserLi: function (username) {
    const hiddenUserListItem = document.createElement("li");

    const hiddenUserSpan = document.createElement("span");
    hiddenUserSpan.classList.add("hidden-user");
    hiddenUserSpan.textContent = username;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "X";

    hiddenUserListItem.appendChild(hiddenUserSpan);
    hiddenUserListItem.appendChild(removeBtn);

    return hiddenUserListItem;
  },
  appendUsernamesToHiddenUserList: function (hiddenUsernames) {
    const hiddenUsernameList = document.getElementById("hidden-users");
    hiddenUsernameList.innerHTML = "";
    for (const username of hiddenUsernames) {
      hiddenUsernameList.appendChild(DOMUtils.createHiddenUserLi(username));
    }
  },
};

export const StorageUtils = {
  getHiddenUsernames: function () {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get("hiddenUsernames", function (data) {
        if (data.hiddenUsernames) {
          resolve(data.hiddenUsernames);
        } else {
          reject(new KeyNotFoundError("hiddenUsernames"));
        }
      });
    });
  },
  saveUsername: function (username) {
    if (!username) {
      return Promise.reject(
        new IllegalArgumentError("Username cannot be empty"),
      );
    }
    return new Promise(function (resolve) {
      chrome.storage.sync.get("hiddenUsernames", function (data) {
        if (!data.hiddenUsernames) {
          chrome.storage.sync.set({ hiddenUsernames: [] });
        }
        if (!data.hiddenUsernames.includes(username)) {
          data.hiddenUsernames.push(username);
          chrome.storage.sync.set({ hiddenUsernames: data.hiddenUsernames });
        }
        resolve(username);
      });
    });
  },
  removeUsername(username) {
    if (!username) {
      return Promise.reject(
        new IllegalArgumentError("Username cannot be empty"),
      );
    }
    return new Promise(function (resolve) {
      chrome.storage.sync.get("hiddenUsernames", function (data) {
        if (!data.hiddenUsernames) {
          return Promise.reject(new KeyNotFoundError("hiddenUsernames"));
        }
        if (data.hiddenUsernames.includes(username)) {
          data.hiddenUsernames = data.hiddenUsernames.filter(
            (name) => name !== username,
          );
          chrome.storage.sync.set({ hiddenUsernames: data.hiddenUsernames });
        }
        resolve(username);
      });
    });
  },
};
