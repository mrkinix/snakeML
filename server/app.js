const express = require('express');
const app = express();
const cors = require("cors")


app.use(cors())
app.get('/test', (req, res) => {
    console.log('received')
    const {spawn} = require('child_process');
    const path = require('path');
    function runScript(){
        return spawn('python', [
              path.join(__dirname, './machine.py'),
        ]);
    }
    const subprocess = runScript();
    subprocess.stdout.on('data', (data) => {
        res.send(data)
    });
})

app.listen(8081, "192.168.100.44")