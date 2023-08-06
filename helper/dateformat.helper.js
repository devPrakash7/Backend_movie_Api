const moment = require('moment');


//set current timestamp
exports.set_current_timestamp = function(){
    return moment().format("MM/DD/YYYY HH:mm:ss");
}

//convert date to timestamp
exports.getDateFormatFromTimeStamp = function(dt){
    return moment.unix(dt).format("MM/DD/YYYY")    
}
