let [tab] = await chrome.tabs.query({active: true, currentWindow: true})
chrome.tabs.sendMessage(
  tab.id,
  {q: "command"},
  (res) => {
    console.log(res);
  }
)
