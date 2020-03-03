var express = require('express');
var fs = require('fs')
var router = express.Router();

router.post('/', (req, res) => {
    callName(req, res)
})


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
    var process =spawn('python3', ["./py/partsofspeech.py"])


    // Takes stdout data from script which executed 
    // with arguments and send this data to res object 
    process.stdout.on('data', function (data) {

        console.log(data)
        res.send(data);
    })

    process.on('error', function(err) {
        console.log('POS parse Error ' + err);
    });   

}


function callName(req, res) {


    let filePath = __dirname.substring(0, __dirname.lastIndexOf("/"))
    filePath += '/py/uploads/pos-upload.txt';

    text = req.body.text

    fs.writeFile(filePath, text, (err) => {
        if (err) {
            console.error(err)
            return
        }

        console.log("//pos file written successfully")
        execPy(res)

    })

}


module.exports = router;