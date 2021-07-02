const jwt = require('jsonwebtoken');

const authUser = (render,redir) => {
    return async(req, res, next) => {
        try {
            const tooken = req.cookies.jwt;
            const verifyUser = jwt.verify(tooken, process.env.JWT_SECRET);
            next();
            return verifyUser; 
        }
        catch (err) {
            if(redir === undefined){
                res.status(401).render(render,{
                    signinAndProfile: 'SIGN-IN',
                    signupAndSignout: 'Sign-Up'
                });
            }
            else {
                res.redirect(redir);
            }     
            return err;
        }
    } 
}


module.exports = authUser;