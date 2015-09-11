console.log("hell");
chrome.tabs.onCreated.addListener(function(){
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
      alert("sometext");
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
