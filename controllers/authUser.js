const jwt = require('jsonwebtoken');

const authUser = (render,redir) => {
    return async(req, res, next) => {
        try {
            const tooken = req.cookies.jwt;
            const verifyUser = await jwt.verify(tooken, process.env.JWT_SECRET); // here we have make a changes
            next();
            return verifyUser; 
        }
        catch (err) {
            if(!redir){
                res.status(401).render(render);
            }
            else {
                res.status(401).redirect(redir);
            }     
            return err;
        }
    } 
}


module.exports = authUser;