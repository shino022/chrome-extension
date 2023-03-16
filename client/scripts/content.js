/*Flow

  mouse up event:
    1. if the pop up is already in DOM and outside the popup is clicked -> close the popup
    2. if the pop up is not in DOM and some text is selected -> insert popup with the text
*/

const popup = document.createElement("div");
let command = "Summarize this";
let loading = false;
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
    while (popup.firstChild) {
      popup.removeChild(popup.firstChild);
    }
    const loader = document.createElement("div");
    loader.setAttribute("id", "extention-loading");
    popup.setAttribute("id", "extention-popup");
    popup.appendChild(loader);
    document.body.appendChild(popup);
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
    popup.removeChild(loader);
    const text = document.createElement("p");
    text.textContent = output;
    popup.appendChild(text)

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
