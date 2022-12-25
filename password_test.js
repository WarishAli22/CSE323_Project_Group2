const bcrypt = require('bcrypt');

let plainPass = "123recTUM7#$9";

// const hashingPassword = async(plainPass)=>{
//   const salt = await bcrypt.genSalt(2);
//   const hash = await bcrypt.hash(plainPass, salt);
//   console.log(hash);
// }

// const hashPass = hashingPassword(plainPass);
// console.log(plainPass);
// console.log(hashPass);

const genHash = async function(plainPass){
  let hashPass;
  hashPass = await bcrypt.hash(plainPass, 10);
  return hashPass;
}

const hashedP = ()=>{
  genHash.then((a)=>{
    return a;
  })
  
}
console.log(hashedP());


