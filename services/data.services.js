const db = require('./db')

users = {
    1000: { acno: 1000, username: "jio", password: "jio", balance: 5000, transaction: [] },
    1001: { acno: 1001, username: "sam", password: "sam", balance: 4000, transaction: [] },
    1002: { acno: 1002, username: "ram", password: "ram", balance: 6000, transaction: [] },
    1003: { acno: 1003, username: "raju", password: "raju", balance: 7000, transaction: [] },
    1004: { acno: 1004, username: "lio", password: "lio", balance: 9000, transaction: [] }
}

const register = (acno, username, password) => {

    return db.User.findOne({ acno })
        .then(user => {
            if (user) {
                return {
                    statusCode: 422,
                    status: false,
                    message: "User exist...Please LogIn"
                }
            }
            else {

                const newUser = new db.User({
                    acno,
                    username,
                    password,
                    balance: 0,
                    transaction: []
                })
                newUser.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: "successfully registed"
                }


            }
        })


}

const authentication = (req, acno, pswd) => {

    return db.User.findOne({
        acno,
        password: pswd
    })
        .then(user => {
            if (user) {

                req.session.currentAcc = user.acno
                console.log(user);

                return {
                    statusCode: 200,
                    status: true,
                    message: "successfully logedIn",
                    userName: user.username,
                    currentAcc: user.acno
                }

            }
            return {
                statusCode: 422,
                status: false,
                message: "invalid account number or password"
            }


        })
}
const deposit = (acno, pswd, amount) => {

    return db.User.findOne({
        acno,
        password: pswd
    }).then(user => {
        if (user) {
            var amt = parseInt(amount)
            user.balance += amt

            user.transaction.push({
                amount: amt, type: "CREDIT"
            })
            user.save()
            return {
                statusCode: 200,
                status: true,
                message: `${amt} successfully deposited, available balance is ${user.balance} `
            }
        }
        else {

            return {
                statusCode: 422,
                status: false,
                message: "invalid account details"
            }
        }
    })

}

const withdraw = (req, acno, pswd, amount) => {

    return db.User.findOne({
        acno,
        password: pswd
    }).then(user => {

        if (user) {
            if (req.session.currentAcc != user.acno) {
                return {
                    statusCode: 422,
                    status: false,
                    message: "invalid session"
                }
            }
            var amt = parseInt(amount)
            if (user.balance >= amt) {
                user.balance -= amt

                user.transaction.push({
                    amount: amt, type: "DEBIT"
                })
                user.save()
                return {

                    statusCode: 200,
                    status: true,
                    message: `${amt} successfully debited, available balance is ${user.balance} `
                }
            }
            else {

                return {
                    statusCode: 422,
                    status: false,
                    message: "insufficient balance"
                }
            }
        }
        else {

            return {
                statusCode: 422,
                status: false,
                message: "invalid account details"
            }
        }
    })
}




const getTransaction = (acno) => {
    return db.User.findOne({
        acno
         //  acno: req.session.currentAcc
    }).then(user=>{ 
        if(user){
        return {
            statusCode: 200,
            status: true,
            transaction: user.transaction
    
        }
        
    }
    else{
        return {
            statusCode: 422,
            status: false,
            message: "invalid operations"
        }
    }
    })
   
}

const deleteAcc= (acno)=>{
 return db.User.deleteOne({acno})
 .then(user=>{
     if(!user){
        return {
            statusCode: 422,
            status: false,
            message: "invalid operations"
        }
     }
     else{
        return {

            statusCode: 200,
            status: true,
            message: ` successfully debited account no: ${acno} `
        }

     }
 })
}
module.exports = { register, authentication, deposit, withdraw, getTransaction,deleteAcc }