const mongoose= require('mongoose')

mongoose.connect('mongodb://localhost:27017/BankAppBOne',{
    useNewUrlParser:true,
    useUnifiedTopology: true
})

const User = mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports= {User}