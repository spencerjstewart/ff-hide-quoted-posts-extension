
const getUsernameFromStorage = function () {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('usernameToHide', function(data) {
            if (data && data.usernameToHide) {
                resolve(data.usernameToHide);
            } else {
                reject('No username found');
            }
        });
    });
};

let customMessage;
getUsernameFromStorage().then(usernameToHide => {
    if (!usernameToHide) {
        throw new Error('No username found');
    }
    customMessage = `Hidden post by ${usernameToHide}`;
    const normalizedUsernameToHide = usernameToHide.trim().toLowerCase();
    hidePostsByUsername(normalizedUsernameToHide);
}).catch(err => {
    console.log(err);
    usernameToHide = '';
});


const stylingForHiddenPost = `
    .hidden-post-message {
        font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        font-size: 20px;
        border: 2px solid #ddd;
        padding: 10px;
        text-align: center;
        font-weight: bold;
        color: #666;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1),
                    0 6px 20px rgba(0,0,0,0.05);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .hidden-post-message:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.2),
                    0 8px 24px rgba(0,0,0,0.1);
    }
`;

// Function to add custom styles
function addCustomStyles(styles) {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

function hidePostsByUsername(username) {
    console.log('Chrome extension script is active.');

    addCustomStyles(stylingForHiddenPost);

    // First method (hiding posts based on quoted posts)
    let postMessageDivs = document.querySelectorAll('div[id*="post_message"]');
    for (let postMessageDiv of postMessageDivs) {
        let quoteDivs = Array.from(postMessageDiv.querySelectorAll('div')).filter(div => div.textContent.includes('Quote:'));
        for (let quoteDiv of quoteDivs) {
            let userElems = quoteDiv.querySelectorAll('strong');
            for (let userElem of userElems) {
                if (userElem.textContent.trim().toLowerCase() === username) {
                    let parentRow = userElem.closest('tr');
                    if (parentRow) {
                        parentRow.innerHTML = `<td colspan="2" class="hidden-post-message">${customMessage}</td>`;
                    }
                }
            }
        }
    }

    // Second method (hiding posts based on bigusername class)
    let userElems = document.querySelectorAll('a.bigusername');
    console.log(userElems);
    for (let userElem of userElems) {
        if (userElem.textContent.trim().toLowerCase() === username) {
            let firstTR = userElem.closest('tr');
            if (firstTR) {
                let parentOfFirstTR = firstTR.parentNode;
                if (parentOfFirstTR) {
                    let secondTR = parentOfFirstTR.closest('tr').nextElementSibling;
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
}


