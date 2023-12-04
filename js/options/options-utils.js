import { IllegalArgumentError, KeyNotFoundError } from "../errors.js";

export const DOMUtils = {
  renderHiddenUserList: function () {
    const hiddenUsersList = document.getElementById("hidden-users");
    let childNode = hiddenUsersList.firstChild;
    while (childNode) {
      let nextChild = childNode.nextSibling; // Save the next child reference before potentially removing the current child

      if (
        childNode.nodeType === Node.ELEMENT_NODE &&
        !childNode.classList.contains("fade-out")
      ) {
        hiddenUsersList.removeChild(childNode);
      }

      childNode = nextChild; // Move to the next child
    }

    // Append the updated list of usernames
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
    hiddenUserListItem.classList.add("list-group-item");

    const hiddenUserSpan = document.createElement("span");
    hiddenUserSpan.classList.add("hidden-user");
    hiddenUserSpan.textContent = username;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    const removeIcon = document.createElement("i");
    removeIcon.classList.add("fas", "fa-trash");
    removeBtn.appendChild(removeIcon);

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
          chrome.storage.sync.set({ hiddenUsernames: [] }).then(() => {
            resolve([]);
          });
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
