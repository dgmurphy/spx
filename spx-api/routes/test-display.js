var express = require('express');
var fs = require('fs')
var router = express.Router();

router.post('/', (req, res) => {
    callName(req, res)
})

//router.post('/', callName);


function execPy(res) {

    
    // Use child_process.spawn method from  
    // child_process module and assign it 
    // to variable spawn 
    var spawn = require("child_process").spawn;

    // Parameters passed in spawn - 
    // 1. type_of_script 
    // 2. list containing Path of the script 
    //    and arguments for the script  

    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will 
    // so, first name = Mike and last name = Will 
    var process = spawn('python3', ["./py/display_dep.py"])


    // Takes stdout data from script which executed 
    // with arguments and send this data to res object 
    process.stdout.on('data', function (data) {

        let test='{"words":[{"text": "This", "tag": "DET"},{"text": "is", "tag": "AUX"},{"text": "a", "tag": "DET"},{"text": "test", "tag": "NOUN"},{"text": "sentence.", "tag": "NOUN"}],"arcs":[{"start": 0, "end": 1, "label": "nsubj", "dir": "left"},{"start": 2, "end": 4, "label": "det", "dir": "left"},{"start": 3, "end": 4, "label": "compound", "dir": "left"}, {"start": 1, "end": 4, "label": "attr", "dir": "right"}],"settings": {"lang": "en", "direction": "ltr"}}'


        //jsonData = JSON.parse(data)
        //jsonData = data.toString()
        console.log(data)
        res.send(data);
    })

}


function callName(req, res) {

    //console.log(req.body)
    execPy(res)

}


module.exports = router;