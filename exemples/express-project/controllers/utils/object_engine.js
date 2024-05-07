class RequestResponse
{
    constructor(API = "none", requestType = "GET" , data = null, type= "text", informations = null, error = null, code = 200)
    {
        this.metaData = 
        {
            "APIRequest"    : API,
            "requestType"   : requestType,
            "timestamp"     : new Date(),
            "by"            : "RequestResponse builder",
            "dataType"      : type,
            "informations"  : informations,
        };
        this.data = data;
        this.error = error;
        this.error ? this.code = 500 : this.code = code;

    }
    
    get prototype() 
    {
        return (
            {
                "metaData" : this.metaData,
                "data"     : this.data,
                "code"     : this.code,
                "error"    : this.error
            }
        )
    }

    set setCode(code)
    {
        this.code = code;
    }
}

module.exports = {RequestResponse};