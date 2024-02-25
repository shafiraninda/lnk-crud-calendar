function successWithData(msg, data){
    let result = {
        message: `${msg}`,
        data: data
    }
    return result
}

module.exports = {
    successWithData
}