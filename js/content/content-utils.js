export const getUsernameFromStorage = function () {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("hiddenUsernames", function (data) {
      if (data && data.hiddenUsernames && data.hiddenUsernames.length > 0) {
        resolve(data.hiddenUsernames[0]);
      } else {
        reject("No username found");
      }
    });
  });
};

export const addCustomStyles = function (styles) {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
};

export const hidePostsByUsername = function (username) {
  // TODO implement ability to set custom message
  // First method (hiding posts based on quoted posts)
  let postMessageDivs = document.querySelectorAll('div[id*="post_message"]');
  for (let postMessageDiv of postMessageDivs) {
    let quoteDivs = Array.from(postMessageDiv.querySelectorAll("div")).filter(
      (div) => div.textContent.includes("Quote:"),
    );
    for (let quoteDiv of quoteDivs) {
      let userElems = quoteDiv.querySelectorAll("strong");
      for (let userElem of userElems) {
        if (userElem.textContent.trim().toLowerCase() === username) {
          let parentRow = userElem.closest("tr");
          if (parentRow) {
            parentRow.innerHTML = `<td colspan="2" class="hidden-post-message">${customMessage}</td>`;
          }
        }
      }
    }
  }

  // Second method (hiding posts based on bigusername class)
  let userElems = document.querySelectorAll("a.bigusername");
  console.log(userElems);
  for (let userElem of userElems) {
    if (userElem.textContent.trim().toLowerCase() === username) {
      let firstTR = userElem.closest("tr");
      if (firstTR) {
        let parentOfFirstTR = firstTR.parentNode;
        if (parentOfFirstTR) {
          let secondTR = parentOfFirstTR.closest("tr").nextElementSibling;
          if (secondTR) {
            let messageDiv = secondTR.querySelector('div[id*="post_message"]');
            if (messageDiv) {
              messageDiv.innerHTML = `<div class="hidden-post-message">${customMessage}</div>`;
            }
          }
        }
      }
    }
  }
};
