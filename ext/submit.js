const error_msg = require('./error_msg')
module.exports = {
    send(data = null,err_code = 0){
        let obj = {
            mate: {
                err_code:err_code,
                message: error_msg[err_code]
            }
        }
        if(data != null){
            obj.data = data
        }
        return obj
    }
}