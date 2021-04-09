const cheerio = require('cheerio')
const fs = require('fs')

exports.scrape = function (content) {
    //const $ = cheerio.load(fs.readFileSync(url))
    const $ = cheerio.load(content)
    const table = $("#testzentren").find("table > tbody").first()

    const config = []
    table.find('tr').each((index, tr) => {
        const tds = $(tr).find('td')
        handleName(config, tds)
        handleAddress(config, tds, index)
        handleTelephone(config, tds, index)
        handleOpening(config, tds, index)
    })
    
    const configObj = {
        testcenters: config
    }
    fs.writeFileSync('./config.json', JSON.stringify(configObj, null, 2), 'utf-8')
}

const handleName = function(config, tds) {
    config.push({
        name: tds[0].children[0].data.trim()
    })
}

const handleAddress = function(config, tds, index) {
    config[index].address = tds[1].children[0].data.trim()
}

const handleTelephone = function(config, tds, index) {
    config[index].telephone = tds[2].children[0].data.trim()
}

const handleOpening = function(config, tds, index) {
    config[index].openingHours = tds[3] && tds[3].children[0].data.trim()
}
