/*Flow

  mouse up event:
    1. if the pop up is already in DOM and outside the popup is clicked -> close the popup
    2. if the pop up is not in DOM and some text is selected -> insert popup with the text
*/

const popup = document.createElement("div");
const text = document.createElement("p");
const loader = document.createElement("div");

let command = "Summarize this";

loader.setAttribute("id", "extention-loading");
popup.setAttribute("id", "extention-popup");

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

    popup.appendChild(loader);
    document.body.appendChild(popup);
    
    // fetch summary
    const response = await fetch("https://100.25.4.202:4000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `${command}: ${selectedText}`,
      }),
    });
    const data = await response.json();
    console.log(data);
    let output = "";
    if (response.status == 400) {
      output = data.error.message
    }
    else {
      output = data.summary;
    }
  
    // insert it
    popup.removeChild(loader);
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
