const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');

/* GET users listing. */
router.get("/test", (req, res) => {

    res.send("test de NEO4J");
})

router.get("/getetab", (req,res)=>{


    (async () => {
        // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
        const URI = 'neo4j://localhost'
        const USER = 'neo4j'
        const PASSWORD = '#E3tA5b_'
        let driver

        try {
            driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
            const serverInfo = await driver.getServerInfo()
            console.log('Connection established')
            console.log(serverInfo)


            //---------------------- Request ---------------------------------------
            const { records, summary, keys } = await driver.executeQuery(
                'match (E:ETAB)-[:EST_DANS]->(C:COMMUNE) where C.nom = \'Chambéry\' return E',
                {},
                { database: 'neo4j' }
            )

            // Summary information
            console.log(
                `>> The query ${summary.query.text} ` +
                `returned ${records.length} records ` +
                `in ${summary.resultAvailableAfter} ms.`
            )

            // Loop through results and do something with them
            console.log('>> Results')
            var result = {};
            let tabres = []
            for(record of records) {
                console.log(record.get('E'))
                tabres.push(record.get('E').properties.nom)
                result = result + record.get('E').properties.nom;
            }
            console.log(tabres)
            res.send(tabres)

            // ------------------------------------ End request ---------------------------------------

            driver.close()


        } catch(err) {
            console.log(`Connection error\n${err}\nCause: ${err.cause}`)
        }
    })();




})
module.exports = router;