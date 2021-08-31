const express = require('express')
const session = require('express-session')
const cors= require('cors')
const dataservice = require('./services/data.services')
const app = express()

app.use(cors({
    origin: 'http://localhost:4200',
    credentials:true
}))
app.use(session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    console.log("middleware");
    next()
})

const autMiddleware = (req, res, next) => {
    if (!req.session.currentAcc) {
        return res.json({
            statusCode: 422,
            status: false,
            message: "please logIn"
        })
    }
    else {
        next()
    }
}
app.use(express.json())

app.get('/', (req, res) => {
    res.send("GET METHOD")
})
app.post('/', (req, res) => {
    res.send("POST METHOD")
})
app.put('/', (req, res) => {
    res.send("PUT METHOD")
})
app.patch('/', (req, res) => {
    res.send("PATCH METHOD")
})

app.post('/register', (req, res) => {
    // console.log(req.body);
    dataservice.register(req.body.acno, req.body.username, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})

app.post('/login', (req, res) => {

    dataservice.authentication(req, req.body.acno, req.body.pswd)
        .then(result => {
            res.status(result.statusCode).json(result)
        })


})

app.post('/deposit', autMiddleware, (req, res) => {
    dataservice.deposit(req.body.acno, req.body.pswd, req.body.amount)
        .then(result => { 
            res.status(result.statusCode).json(result) 
        })
    
})

app.post('/withdraw', autMiddleware, (req, res) => {
    dataservice.withdraw(req,req.body.acno, req.body.pswd, req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})
app.post('/transaction', autMiddleware, (req, res) => {
   dataservice.getTransaction(req.body.acno)
   .then(result=>{
    res.status(result.statusCode).json(result)
   })
    
})
app.delete('/deleteAcc/:acno', autMiddleware,(req,res)=>{
    dataservice.deleteAcc(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.listen(3000, () => {
    console.log("server stared at port:3000")
})

