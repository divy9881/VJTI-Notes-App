let express = require('express')
let bodyParser = require('body-parser')
let crypto = require('crypto')
var mysql      = require('mysql');

let app = express()

app.use(bodyParser.urlencoded({extended:false}))

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : process.env.PASSWORD,
    database : 'vjti_app'
});

let encryption_algorithm = 'aes256'
let secret = process.env.SECRET

app.get('/', (req, res, next) => {
    res.send('Home Page');
})

app.get('/app/sites/list', (req, res, next) => {
    let userId = req.query.user;
    connection.query('SELECT note FROM `NOTES` WHERE userId = ?', [userId], (error, results, fields) => {
        if(error){
            console.log(error)
            res.send({status: 'account not created'})
        } else {
            let decrypted_notes = []
            for(let note of results){
                let decipher = crypto.createDecipher(encryption_algorithm, secret)
                let deciphered_note = decipher.update(note.note, 'hex', 'utf8') + decipher.final('utf8');
                decrypted_notes.push(deciphered_note);
            }
            res.send(decrypted_notes)
        }
    });
})

app.post('/app/user', (req, res, next) => {
    console.log(req.body)
    let username = req.body.username;
    let password = req.body.password;
    if(username != '' && password != ''){
        connection.query('INSERT INTO `CREDENTIALS` (`username`, `password`) VALUES ( ?, ? )', [username, password], (error, results, fields) => {
            if(error){
                console.log(error)
                res.send({status: 'account not created'})
            } else {
                res.send({status: 'account created'})
            }
        });
    }
})

app.post('/app/user/auth', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    connection.query('SELECT * from `CREDENTIALS` WHERE `username` = ? and `password` = ?', [username, password], (error, results, fields) => {
        if(error){
            console.log(error)
            res.send({status: 'failue, bad credentials'})
        } else {
            res.send({status: 'success', userId: results.userId})
        }
    });
})

app.post('/app/sites', (req, res, next) => {
    let userId = req.query.user;
    let note = req.body.note;
    let cipher = crypto.createCipher(encryption_algorithm, secret)
    let encrypted_note = cipher.update(note, 'utf8', 'hex') + cipher.final('hex');
    connection.query('INSERT INTO `NOTES` (`userId`, `note`) VALUES( ?, ? )', [userId, encrypted_note], (error, results, fields) => {
        if(error){
            console.log(error)
            res.send({status: 'failue'})
        } else {
            res.send({status: 'success'})
        }
    });
})

let server = app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Listening to '+server.address().port + ' and ' + server.address().address );
})