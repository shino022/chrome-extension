const setPlaceholder = (command) => {
  const inputElem = document.getElementById("command");
  inputElem.setAttribute("placeholder", command);
};

const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
chrome.tabs.sendMessage(
  tab.id,
  {q: "command"},
  (res) => setPlaceholder(res.command)
)

const handleFormSubmit = async (e) => {
  const command = e.target[0].value;
  //send a message to content to set the commend with the new input
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
  chrome.tabs.sendMessage(
    tab.id,
    {q: "setCommand", command},
    (res) => setPlaceholder(res.command)
  )
}

const formElem = document.getElementById("form");
formElem.addEventListener("submit", (handleFormSubmit));