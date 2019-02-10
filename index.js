const express = require('express'),
    app = express(),
    fs = require('fs'),
    bodyParser = require('body-parser');

app.use(bodyParser.json()); // parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // parsing application/x-www-form-urlencoded
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true); //false
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Length, Authorization, Origin, X-Requested-With, Content-Type, Accept, application/json");
    next();
});
app.get('/get-system-ids', (req, res) => {

    try {
        var systems = [];
        fs.readFile(`data.json`, `utf8`, (err, data) => {
            if(err) {
                throw new Error(err);
            }
            let result = JSON.parse(data);
            let sss = [];
            result.forEach(entity => {
                console.log(entity._systemId);
                    return sss.push(entity._systemId);
                });
            systems = sss;
            console.log(sss);
            });
            fs.close(2,function (error) {
                if (error) {
                    console.error("close error:  " + error.message);
                } else {
                    console.log("File was closed!");
                }
            });
            console.log(systems);
            res.status(200).json(systems);

    } catch (e) {
        console.error(e);
        return res.status(500).json(`${e.message}`);
    }
});
app.get('/get-by-system-id/:id', (req, res) => {
    console.log(req.params.id);
    if (!req.params.id || isNaN(req.params.id)) {
        return res.status(404).json(`wrong input!`);
    }
    try {
        fs.readFile(`data.json`, `utf8`, (err, data) => {
            if(err) {
                throw new Error(err);
            }
            let result = JSON.parse(data);
            result = result.filter(entity => {
                return entity._systemId == req.params.id;
            });
            fs.close(2,function (error) {
                if (error) {
                    console.error("close error:  " + error.message);
                } else {
                    console.log("File was closed!");
                }
            });
            res.status(200).json(result);
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json(`${e.message}`);
    }
});
app.get('/get-by-entity-id/:entitytypeid',(req,res) => {
    console.log(req.params.entitytypeid);
    if (!req.params.entitytypeid || isNaN(req.params.entitytypeid)) {
        return res.status(404).json(`wrong input!`);
    }

    try{
        var response;
        fs.readFile(`data.json`, `utf8`, (err, data) => {
            if(err) {
                throw new Error(err);
            }

            let result = JSON.parse(data);
            result.forEach(entity => {
                entity.EntityTypes.forEach(item => {
                    if (item._entityTypeId == req.params.entitytypeid) {
                        return response = item;
                    }
                })
            });
            fs.close(2,function (error) {
                if (error) {
                    console.error("close error:  " + error.message);
                } else {
                    console.log("File was closed!");
                }
            });
            res.status(200).json(response);
        });



    }catch (e) {
        console.error(e);
        return res.status(500).json(`${e.message}`);
    }
});
app.post('/update-entity', (req, res) => {
    let {name, id} = req.body;
    console.log(name);
    if (!id || !name) {
        return res.status(404).json(`wrong input!`);
    }

    try{
        fs.readFile(`data.json`, `utf8`, (err, data) => {
            if(err) {
                throw new Error(err);
            }
            let success = false;
            let result = JSON.parse(data);
            result.forEach(entity => {
                entity.EntityTypes.forEach(item => {
                    if (item._entityTypeId == id) {
                        item._name = name;
                        success = true;
                    }
                })
            });

            if (success) {
                fs.writeFile(`data.json`, JSON.stringify(result), (err, data) => {
                    if(err) {
                        throw new Error(err);
                    }
                    else {

                        let message = "success:"+`_entitytypeid -> ${id} was updated with name: ${name}`;
                        console.log(message);
                        res.status(200).json(message);
                    }
                });
            }
        });
    }catch (e) {
        console.error(e);
        return res.status(500).json(`${e.message}`);
    }

});

app.listen(8899, () => {
   console.log(`server is up`);
});