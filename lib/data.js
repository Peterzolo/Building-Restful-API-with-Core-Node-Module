const fs = require('fs');
const  path = require('path')





const lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');

lib.create = function(dir,file,data,callback){
fs.open(lib.baseDir+dir+file+'.json', 'wx', function(err,fileDescription){
    if(!err && fileDescription){

        const stringData = JSON.stringify(data)

        fs.writeFile(fileDescription, stringData, function(err) {
   if(!err){
       fs.close(fileDescription, function(err){
           if(!err){  
               callback(false)  

           }else{
               callback("Could not close the file")
           }

       })

   }else{
       callback("Could not write to the file")
   }
        })

    }else{
        callback("Could not create the file")
    }
})
}


module.exports = lib;