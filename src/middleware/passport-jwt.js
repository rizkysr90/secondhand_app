const passport = require('passport');
const {User} = require('./../models/');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const optionsForDecodeJWT = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET,
};

const strategy = new JwtStrategy(optionsForDecodeJWT,async (payload,done) => {
    const options = {
        attributes: {exclude: ['password']},
        where : {
            username : payload.sub
        }
    };
    try {
        const foundUser = await User.findOne(options)
        if(!foundUser) {
            return done(null,false);
        }
        return done(null,foundUser);
    } catch (error) {
        console.error(error);
        return done(error,false);
    }
})
passport.use(strategy);
module.exports = passport.authenticate('jwt',{session:false});
