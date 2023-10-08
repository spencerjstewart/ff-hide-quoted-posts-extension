const saveUsername = function () {
    document.getElementById('save').addEventListener('click', function() {
        const username = document.getElementById('usernameToHide').value;
        chrome.storage.sync.set({ 'usernameToHide': username }, function() {
            alert('Username saved.');
        });
    });
};

const showUsernames = function () {
    // When opening the options page, retrieve all usernames in storage
    chrome.storage.sync.get('usernameToHide', function(data) {
        document.getElementById('hiddenUser').textContent = data.usernameToHide;
    });

    // Attach event listener to hiddenUser so that when it is clicked, it is removed from storage
    document.getElementById('hiddenUser').addEventListener('click', function() {
        chrome.storage.sync.remove('usernameToHide', function() {
            alert('Username removed.');
        });
    });
};

document.addEventListener('DOMContentLoaded', function () {
    saveUsername();
    showUsernames();
});
