const nunjucks = require('nunjucks')
const fs = require('fs')
var request = require("request");
const { scrape } = require('./scraper.js')

//const url = '/media/daten/git/address-parser/test.html'

const url = 'https://www.leipzig.de/jugend-familie-und-soziales/gesundheit/neuartiges-coronavirus-2019-n-cov/testzentrum/'

request({
  uri: url,
}, function(error, response, body) {
    scrape(fs.readFileSync(url))
    nunjucks.configure({ autoescape: true });
    const template = fs.readFileSync('./city_template.njk', 'utf-8')
    const config = require('./config.json', 'utf-8')
    const newTestcenters = []
    config.testcenters.forEach(testcenter => {
        const newTestcenter = {}
        newTestcenter.location = testcenter.address
        newTestcenter.name = testcenter.name
        newTestcenter.coordinates = [51, 12]
        newTestcenter.telephone = testcenter.telephone
        newTestcenter.openingHours = testcenter.openingHours
        newTestcenters.push(newTestcenter)
    })
    config.testcenters = newTestcenters
    const rendered = nunjucks.renderString(template, config);
    fs.writeFileSync('./leipzig.json', rendered, 'utf-8')    
});


