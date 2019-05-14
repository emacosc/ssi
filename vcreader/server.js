var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const ngrok = require('ngrok')
const bodyParser = require('body-parser')

var ejs = require('ejs')

var open = require('open');

app.use(express.static(__dirname + 'views'));


import {
  Credentials
} from 'uport-credentials'

const decodeJWT = require('did-jwt').decodeJWT
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util
const helper = require('../itut/helper.js')
// const itut = require('../itut/core.js')

console.log('loading server...')

const Time30Days = () => Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60
let endpoint = 'localhost'

app.use(bodyParser.json({
  type: '*/*'
}))

//Setting up EJS view Engine and where to get the views from
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('views'))

// const credentials = itut.setUpCredentials('did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840', '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3')

const credentials = new Credentials({
  did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840',
  privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
})

var currentConnections = {};

app.get('/', (req, res) => {
  res.render('home', {})
})

app.post('/vc', (req, res) => {
  const jwt = req.body.access_token
  const socketid = req.query['socketid']
  console.log('someone sent a vc')
  if (jwt != null) {
    credentials.authenticateDisclosureResponse(jwt).then(creds => {
      decodedJwt = decodeJWT(jwt)
      helper.messageLogger(decodeJWT(jwt), 'Shared VC from a User')
      console.log(creds)
      currentConnections[socketid].socket.emit('emitVC', {
        iat: decodedJwt.payload.iat,
        exp: decodedJwt.payload.exp,
        credentialSubject: decodedJwt.payload.own,
        iss: decodedJwt.payload.iss,
        did: decodedJwt.payload.aud
      })
    })
  }
});


//Socket Events
io.on('connection', function(socket) {
  console.log('a user connected: ' + socket.id);
  currentConnections[socket.id] = {
    socket: socket
  };
  credentials.createDisclosureRequest({
    requested: ["name"],
    notifications: false,
    callbackUrl: endpoint + '/vc?socketid=' + socket.id
  }).then(requestToken => {
    var uri = message.paramsToQueryString(message.messageToURI(requestToken), {
      callback_type: 'post'
    })
    // uri = utils.concatDeepUri(uri)
    const qr = transports.ui.getImageDataURI(uri)
    // messageLogger(requestToken, "Request Token")
    socket.emit('emitQR', {
      qr: qr,
      uri: uri
    })
  })

  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected...')
    delete currentConnections[socket.id];
  })
});


http.listen(8088, () => {
  console.log('ready!!!')
  ngrok.connect(8088).then(ngrokUrl => {
    endpoint = ngrokUrl
    console.log(`VC Reader Service running, open at ${endpoint}`)
    open(endpoint, {
      app: 'chrome'
    })
  });
})