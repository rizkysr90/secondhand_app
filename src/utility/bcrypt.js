const bcrypt = require('bcrypt');
const salt = +process.env.SALT_ROUNDS;

const hash = async (plainPassword) => {
    // Akan mengembalikan password yang sudah dihash
    return await bcrypt.hash(plainPassword,salt);
}
const compare = async (plainPassword,hash) => {
    // Akan mengembalikan nilai boolean true/false
    return await bcrypt.compare(plainPassword,hash);
}
module.exports = {  
    hash,
    compare
}