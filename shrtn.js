document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    console.log("hell");

    var links = [];
    var summary = [];
    var words = [];
    var linknum = 0;
    var processedLinks = [];

    chrome.windows.getAll({populate:true},function(windows){
      windows.forEach(function(window){
        window.tabs.forEach(function(tab){
          //collect all of the urls here, I will just log them instead
          theTabID = tab.id;
          console.log('the tab is');
          console.log(theTabID);
          console.log('the window is ');
          console.log(window.id);

          /// links.push(tab.url);
          /// console.log(tab.url);
          ///using the url extract the text

          if (tab.url.slice(12,28) == 'lifetechnologies') {
            var retrievedContent = contentGet(tab.url);
            var retriedContentJSON = JSON.parse(retrievedContent);

            linknum = linknum + 1;

            console.log('************************************');
            console.log('the retrieved content is: ');
            console.log(retrievedContent);
            console.log(retrievedContentJSON.text);

            ///get the summary
            var contentSummary = summaryGet(tab.url);
            console.log('the summary of this content is: ');
            console.log(contentSummary);

            ///using the text get the topics
            words = getWords(retrievedContentJSON.text);
            console.log('the topics are: ');
            console.log(words);
            console.log('************************************');

            linkDict = {
              'link': tab.url,
              'topics': words,
              'summary': contentSummary,
              'linkID': linknum
              };

          }
          /// list of all the processed links
          processedLinks.push(linkDict);
          /// generate the html for display
          HTMLGenerate(processedLinks);
          /// store the processed links
          tabStorage(processedLinks);
          ///make the list
          makeList(tab.title);
          /// close selected tabs
          /// open summary page in browser
        });
      });
    });
 });
});

function summaryGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    var fullRequest= "https://shorticle.p.mashape.com/summary/?limit=5&return_content=false&show_images=false&url=" + encodeURIComponent(theUrl);
    xmlHttp.open( "GET", fullRequest, false );
    xmlHttp.withCredentials = true;
    xmlHttp.setRequestHeader("X-Mashape-Key","3XbEvI5NrBmshqm3W7yJzMaowzQ5p1sBGHQjsnaaCSSGozlV8g");
    xmlHttp.send( null );
    console.log(xmlHttp.status);
    console.log(xmlHttp.statusText);
    return xmlHttp.responseText;
}

function contentGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    var fullRequest= "https://alchemy.p.mashape.com/url/URLGetText?jsonp=&outputMode=json&useMetadata=false&url=" + encodeURIComponent(theUrl);
    xmlHttp.open( "GET", fullRequest, false );
    /// xmlHttp.withCredentials = true;
    xmlHttp.setRequestHeader("X-Mashape-Key","3XbEvI5NrBmshqm3W7yJzMaowzQ5p1sBGHQjsnaaCSSGozlV8g");
    xmlHttp.send( null );
    console.log(xmlHttp.status);
    console.log(xmlHttp.statusText);
    return xmlHttp.responseText;
}

function getWords(text)
{
    var xmlHttp = new XMLHttpRequest();
    var fullRequest= "https://twinword-topic-tagging.p.mashape.com/generate/?text=" + text;
    xmlHttp.open( "GET", fullRequest, false );
    xmlHttp.withCredentials = true;
    xmlHttp.setRequestHeader("X-Mashape-Key","3XbEvI5NrBmshqm3W7yJzMaowzQ5p1sBGHQjsnaaCSSGozlV8g");
    /// xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlHttp.setRequestHeader("Accept","application/json");
    xmlHttp.send();
    console.log(xmlHttp.status);
    console.log(xmlHttp.statusText);
    return xmlHttp.responseText;
}

function tabStorage(links)
{
    console.log("Saving");
    console.log(links);
    chrome.storage.sync.set({'links': links}, function() {
        console.log('Settings saved');
    });
    chrome.storage.sync.get("links", function (retVal) {
            console.log("Got it? " + retVal.links);
    });
}

function showList(tablist){
  for (i = 0; i < tablist.length; i++) {
    var node=document.createElement("LI");
    var textnode=document.createTextNode(tablist[i]);
    node.appendChild(textnode);
    document.getElementById("demo").appendChild(node);
    node.appendChild(listItemCheckbox);
}
}

function makeList(taburl){
  var listItemCheckbox = document.createElement('input');
  listItemCheckbox.type = 'checkbox';
  var node=document.createElement("LI");
  var textnode=document.createTextNode(taburl);
  node.appendChild(listItemCheckbox);
  node.appendChild(textnode);
  document.getElementById("demo").appendChild(node);
}


/*

TODO:

* use select box to kill tabs
* generate the html
* set a summary session
* retrieve summary session

*/
