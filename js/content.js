import { stylingForHiddenPost } from "./content/styles.js";
import {
  addCustomStyles,
  getUsernameFromStorage,
  hidePostsByUsername,
} from "./content/content-utils.js";

getUsernameFromStorage()
  .then((usernameToHide) => {
    if (!usernameToHide) {
      throw new Error("No username found");
    }
    const normalizedUsernameToHide = usernameToHide.trim().toLowerCase();
    hidePostsByUsername(normalizedUsernameToHide);
    addCustomStyles(stylingForHiddenPost);
  })
  .catch((err) => {
    console.log(err);
  });
