const mongo = require('mongoose')

 async function connectToDatabase(url){
   return mongo.connect(url)
 }

 module.exports = {
   connectToDatabase
 };