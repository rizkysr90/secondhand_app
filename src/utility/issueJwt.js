const jsonwebtoken = require('jsonwebtoken');

const issueJWT = (user) => {
    const expiresIn = "1 days";
    const payload = {
        sub: user.id,
        name : user.name,
    };
    const signedToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
    return {
        token : signedToken,
        expires: expiresIn
    }
}


module.exports = issueJWT;