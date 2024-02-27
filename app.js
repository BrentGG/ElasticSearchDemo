var fields = [
    "title",
    "passed",
    "type",
    "parent",
    "start",
    "end",
    "error"
];

var Convert = require('ansi-to-html');
var convert = new Convert();

const express = require('express');
const app = express();
const port = 5000;

app.use(express.static(__dirname + '/public' ));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

app.get('/search', (req, res) => {
    let fieldsToSearch = [];
    for (let field of fields) {
        if (req.query[field] === "1")
            fieldsToSearch.push(field);
    }
    search(req.query.term, fieldsToSearch).then((response) => {
        res.send(response);
    });
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});


const { Client } = require('@elastic/elasticsearch');
const client = new Client({
    node: 'https://localhost:9200/',
    auth: {
        apiKey: "aFNXU3k0MEItRVpFR3k4cFZDTjA6R3hkc0pnSEdTOTZQUmhMQ0VTZEY2dw==",
    },
    tls: { 
        rejectUnauthorized: false 
    }
});

async function search(searchterm, fieldsToSearch) {
    const response = await client.search({
        index: "rest_results",
        query: {
            multi_match: {
                query: searchterm,
                fields: fieldsToSearch,
                fuzziness: "AUTO"
            }
        }
    });
    for (let hit of response.hits.hits) {
        hit._source.error = convert.toHtml(hit._source.error).replaceAll("#FFF", "#000");
    }

    return response.hits.hits;
}
