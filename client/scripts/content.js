/*Flow

  mouse up event:
    1. if the pop up is already in DOM and outside the popup is clicked -> close the popup
    2. if the pop up is not in DOM and some text is selected -> insert popup with the text
*/

const popup = document.createElement("div");
let command = "Summarize this";

addEventListener("mouseup", async (e) => {
  const selectedText = document.getSelection().toString();

  // if the pop up is clicked
  if (e.target.closest("#extention-popup")) {
    // do nothing
    return;
  }

  // if the pop up is open
  if (document.getElementById("extention-popup")) {
    // delete the existing popup
    popup.remove();
  }

  // if selected is not empty
  if (selectedText) {
    // fetch summary
    const response = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `${command}: ${selectedText}`,
      }),
    });
    const data = await response.json();
    let output = "";
    if (response.status == 400) {
      output = data.error.message
    }
    else {
      output = data.summary;
    }

    // insert it
    popup.setAttribute("id", "extention-popup");
    popup.textContent = output;
    document.body.appendChild(popup);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.q == "command") {
    sendResponse({ command });
  } else if (request.q == "setCommand") {
    command = request.command;
    sendResponse({ command });
  }
});
