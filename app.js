let express = require('express')
let bodyParser = require('body-parser')
let crypto = require('crypto')

let app = express()

app.use(bodyParser.urlencoded({extended:false}))

let encryption_algorithm = 'aes256'
let secret = 'secret'

let cipher = crypto.createCipher(encryption_algorithm, secret)
let decipher = crypto.createDecipher(encryption_algorithm, secret)

app.get('/', (req, res, next) => {
    res.send('Home Page');
})

app.get('/app/sites/list/', (req, res, next) => {
    let userId = req.query.user;

})

app.post('/app/user', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    res.send({status: 'account created'})
})

app.post('/app/user/auth', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    res.send({status: 'success', userId: -1})
})

app.post('/app/sites?user={userId}', (req, res, next) => {
    let note = req.body.note;
    var encrypted_note = cipher.update(note, 'utf8', 'hex') + cipher.final('hex');
    // var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    res.send({status: 'success'})
})

let server = app.listen('3000', '127.0.0.1', () => {
    console.log('Listening to '+server.address().port + ' and ' + server.address().address );
})