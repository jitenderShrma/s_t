const cryptoJSON = require('crypto-json');
const algorithm = 'camellia-128-cbc';
const encoding = 'hex';



const fs = require('fs');

// var license = require('./license.json');
var encrypted_json = require('./enc_license.json');


// const input = license;


const password = "1234Qwerty!";


const keys = ['companies_allowed', 'users_allowed'];



// const output = cryptoJSON.encrypt(
//     input, password, {encoding, keys, algorithm}
//   );

//  data = JSON.stringify(output); 
//  fs.writeFileSync('enc_license.json',data); 


function decryptOutput(){

const decrypt_output = cryptoJSON.decrypt(encrypted_json, password, {encoding, keys, algorithm}); 
return decrypt_output;
}


module.exports = {
    decrypt:decryptOutput

};

  
  
  