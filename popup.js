let searchButton = document.getElementById("search");
let inputField = document.getElementById("input");
let resultsContainer = document.getElementById("container");
var root = document.querySelector(':root');

chrome.storage.sync.get("color", ({ color }) => {
    searchButton.style.backgroundColor = color;
    root.style.setProperty("--colorTheme", color)
});

// When the button is clicked or "enter" is pressed, query api and show informations
searchButton.addEventListener("click", async () => {
    useFreeDictionaryApi()
});

document.onkeydown = function(e) {
    if(e.key == "Enter") useFreeDictionaryApi()
};

function useFreeDictionaryApi(){
    let list = document.getElementById("container")

    if(inputField.value !== "") {
        let response = httpGet('https://api.dictionaryapi.dev/api/v2/entries/en/' + inputField.value);
        response = JSON.parse(response);
        console.log(response)
        if(response.title !== "No Definitions Found")
            list.innerHTML = convertJSONToHTML(0, response[0])
        else 
            list.innerHTML = "Nothing found"
    } 
    else list.innerHTML = "Please enter a word!"
}

    


function convertJSONToHTML(depth, obj) {
    let keys
    let values
    if(typeof obj === "object") {
        keys = Object.keys(obj);
        values = Object.values(obj);
    }
    final = ''

    for(let i = 0; i < keys.length; i++){
        if(!filterKey(keys[i]))continue

        if (obj[keys[i]] instanceof(Array) && obj[keys[i]].length == 0) continue

        if (typeof obj[keys[i]] !== "string" && obj[values[i]] !== "") {
            if (obj[keys[i]] === "array") {console.log("ARRRAYYY mit Länge: " + obj[keys[i]].length); }
            final += "<li><details><summary>" + keys[i] + ": </summary>"
            final += "<ul id=" + depth + ">" + convertJSONToHTML(depth + 1, obj[keys[i]]) + "</ul>"
            final += "</details></li>"
        }
        else {
            if(isNaN(keys[i])) final += keys[i] + ": "
            if (values[i].endsWith(".mp3")) {
                final += "<audio controls class='value'><source src='" + values[i] + "' type='audio/mpeg'>Your browser does not support the audio element.</audio>"
            }
            else if (values[i].startsWith("http")) final += "<a class='value' href='" + values[i] + "'>" + values[i] + "</a>"
            else final += "<span class='value'>" + values[i] + "</span>"
            final += "<br>"
        }
    }
    return final
}

function filterKey(key){
    switch (key) {
        case "sourceUrl":
            return false;
        case "license":
            return false;
        case "word":
            return false;
        case "phonetic":
            return false;
        default:
            return true;
    }
}

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
