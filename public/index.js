var fields = [
    "title",
    "passed",
    "type",
    "parent",
    "start",
    "end",
    "error"
];

document.getElementById("search-inp").addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();
        search();
    }
});

let fieldsPanel = document.getElementById("fields-panel");
fieldsPanel.innerHTML = "<div class='cbActions'><p onclick='allFields()'>All</p><p onclick='noFields()'>None</p></div>";
for (let field of fields) {
    fieldsPanel.innerHTML += `<label><input id="${field}-cb" type="checkbox" checked/>${field.slice(0, 1).toUpperCase() + field.slice(1)}</label>`;
}

let table = document.getElementById("results-table");
let header = table.createTHead();
let row = header.insertRow(0);
for (let field of fields) {
    row.insertCell(-1).outerHTML = `<th>${field.slice(0, 1).toUpperCase() + field.slice(1)}</th>`;
}

makeTableResizable();

async function search() {
    let table = document.getElementById("results-table");
    while (table.rows.length > 1)
        table.deleteRow(-1);    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(this.responseText);
            displayResults(jsonResponse);
        }
    };
    let searchterm = document.getElementById("search-inp").value;
    let fieldsToSearch = "";
    let atLeastOne = false;
    for (let field of fields) {
        fieldsToSearch += `&${field}=${document.getElementById(`${field}-cb`).checked ? "1" : "0"}`;
        if (!atLeastOne && document.getElementById(`${field}-cb`).checked)
            atLeastOne = true;
    }
    if (searchterm !== "" && atLeastOne) {
        xhttp.open("GET", `/search?term=${searchterm}${fieldsToSearch}`, true);
        xhttp.send();
    }
    else {
        document.getElementById("no-match").style.display = "block";
    }
}

function displayResults(results) {
    if (results.length > 0)
        document.getElementById("no-match").style.display = "none";
    else
        document.getElementById("no-match").style.display = "block";
    let table = document.getElementById("results-table");
    for (let result of results) {
        result = result._source;
        let row = table.insertRow(-1);
        for (let field of fields)
            row.insertCell(-1).innerHTML = result[field];
    }
    makeTableResizable();
}

/* SEARCH FIELDS ACCORDION */

function allFields() {
    for (let field of fields) {
        document.getElementById(`${field}-cb`).checked = true;
    }
}

function noFields() {
    for (let field of fields) {
        document.getElementById(`${field}-cb`).checked = false;
    }
}

// https://www.w3schools.com/howto/howto_js_accordion.asp 

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}