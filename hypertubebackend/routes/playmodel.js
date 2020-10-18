var  _  = require('lodash')

let playvidioe = {}

playvidioe.doextension = function(string){
    let extension = string.match(/.*(\..+?)$/);
    return extension[1].toLowerCase();
}
 

module.exports = playvidioe;