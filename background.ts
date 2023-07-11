export {}
 
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log('url changed', tab.url)
  chrome.tabs.sendMessage( tabId, {
    message: 'changedTab',
  })
});