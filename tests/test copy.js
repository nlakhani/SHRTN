console.log("hell");
chrome.windows.getLastFocused(
 // Without this, window.tabs is not populated.
 {populate: true},
 function (window)
 {
  var foundSelected = false;
  var all_tabs = [];
  for (var i = 0; i < window.tabs.length; i++)
  {
    all_tabs[i]=window.tabs[i].url;
   // Finding the selected tab.
   if (window.tabs[i].active)
   {
    foundSelected = true;
    for (var x = 0; x < window.tabs.length; x++){
      if (all_tabs[i]==all_tabs[x] && window.tabs[i].id != window.tabs[x].id){
      console.log("match");
    }}
   }
   // Finding the next tab.
   else if (foundSelected)
   {
    // Selecting the next tab.
    chrome.tabs.update(window.tabs[i].id, {active: true});
    return;
   }
  }
 });
