function authUser(req, res, next){
    if(req.user == null){
        res.status(403)
        return res.send("you need to sign in")
    }
}

module.exports ={
    authUser
}