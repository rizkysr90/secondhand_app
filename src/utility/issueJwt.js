const jsonwebtoken = require('jsonwebtoken');

const issueJWT = (user) => {
    const payload = {
        sub: user.id,
        name : user.name,
    };
    const signedToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 days" });
    return {
        token : signedToken
    }
}


module.exports = issueJWT;