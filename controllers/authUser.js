const jwt = require('jsonwebtoken');

const authUser = (render,redir,obj) => {
    return async(req, res, next) => {
        try {
            const tooken = req.cookies.jwt;
            const verifyUser = jwt.verify(tooken, process.env.JWT_SECRET);
            next();
            return verifyUser; 
        }
        catch (err) {
            if(redir === null){
                res.status(401).render(render,obj);
            }
            else {
                res.status(401).redirect(redir);
            }     
            return err;
        }
    } 
}


module.exports = authUser;