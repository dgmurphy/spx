var express = require('express');
var fs = require('fs')
var router = express.Router();

router.post('/', (req, res) => {
    callName(req, res)
    //print(str(req.body))
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
    var process =spawn('python3', ["./py/parse_tree_a.py"])


    // Takes stdout data from script which executed 
    // with arguments and send this data to res object 
    process.stdout.on('data', function (data) {

        console.log(data)
        res.send(data);
    })

    process.on('error', function(err) {
        console.log('Parse Tree A Error ' + err);
    });   

}


function callName(req, res) {

    //console.log(req.body)

    let filePath = __dirname.substring(0, __dirname.lastIndexOf("/"))
    filePath += '/py/uploads/parse-tree-a-upload.txt';

    //let content = req.body.text
    //let jsonStr = JSON.parse(content)
    text = req.body.text

    fs.writeFile(filePath, text, (err) => {
        if (err) {
            console.error(err)
            return
        }

        console.log("//parse tree a file written successfully")
        execPy(res)

    })

}


// router.get('/', function(req, res, next) {
//     res.send('API is working properly');
// });

module.exports = router;