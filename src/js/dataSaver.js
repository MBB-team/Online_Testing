
// author : Gilles Rautureau

const dataSaverModes =
{
    UNKNOWN:    0,
    LOG:        1, //log on console
    SERVER:     2, //send to server
}

function DataSaver(mode, url="")
{
    
    this.mode = dataSaverModes.UNKNOWN;
    this.url = "";

    this.buffer = {};
    this.bufferIndex = -1;
    this.clientIds = null;

    switch(mode)
    {
        case dataSaverModes.LOG :
            this.mode = mode;
            this.url = "";
            break;
        case dataSaverModes.SERVER :
            this.mode = mode;
            this.url = url;
            break;
        default :
            console.log("dataSaver: Unknown mode");
            break;
    }

    this.SetClientIds = function(ids)
    {
        this.clientIds = ids;
    }
    
    this.save = function(data)
    {
        //add to buffer
        var index = this.bufferIndex += 1;
        this.buffer[index] = data;

        //action with this data
        switch(mode)
        {
            case dataSaverModes.LOG :
                console.log("dataSaver: logMode: Index:" + index + "\n" + data);
                //console log should not fail, remove from buffer
                delete this.buffer[index];
                break;
            case dataSaverModes.SERVER :
                var indexes=[];
                indexes.push(index);
                this.send(indexes);
                break;
            default :
                break;
        }
    }

    /* for internal use */
    this.send = function(indexes, async = true)
    {
        if(indexes.length<=0)
            return;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.url, async);
        xhr.setRequestHeader('Content-Type', 'application/json');
        if(async)
        {
            xhr.timeout = 2000;
            xhr.ontimeout = function () {
                console.error("dataSaver request timed out.");
            }.bind(this);
            xhr.onload = function()
            {
                if(xhr.status == 200)
                {
                    console.log(xhr.responseText);
                    var response = JSON.parse(xhr.responseText);
                    //console.log(response);
                    this.onDataSaverResult(response);
                }
                else
                {
                    console.log('dataSaver: error: xhr.status='+xhr.status);
                }
            }.bind(this);
        }
        
        var data={};
        for(i=0; i<indexes.length; i++)
        {
            data[indexes[i]] = this.buffer[indexes[i]];
        }
        if(this.clientIds != null)
        {
            //add client Ids
            data['clientIds'] = this.clientIds;
        }
        //console.log(JSON.stringify(data));

        if(async)
        {
            xhr.send(JSON.stringify(data));
        }
        else
        {
            try
            {
                xhr.send(JSON.stringify(data));
            
                if(xhr.status == 200)
                {
                    var response = JSON.parse(xhr.responseText);
                    //console.log(response);
                    this.onDataSaverResult(response);
                }
                else
                {
                    console.log('dataSaver: error: xhr.status='+xhr.status);
                }
            }
            catch (e)
            {
                //only log on network error
                if((e instanceof DOMException) && (e.code == DOMException.NETWORK_ERR))
                    console.log(e);
                else //rethrow other exception
                    throw e;
            }
        }
    }

    this.onDataSaverResult = function(response)
    {
        
        for (const [key, value] of Object.entries(response))
        {
            if(key=='message')
                continue;

            if(value == 2)
                console.log('dataSaver: Index ' + key + ' already saved');
                
            if(value >= 1)
                delete this.buffer[key];
        }
        if(response['message']!='')
        {
            console.log('dataSaver: Error: ' + response['message'])
        }
    }

    this.bufferLength = function()
    {
        return Object.keys(this.buffer).length;
    }

    this.sendAll = function(samplesGroup = 5)
    {
        //debugger;
        var indexes=[];
        for (const [key, value] of Object.entries(this.buffer))
        {
            indexes.push(key);
            if(indexes.length >= samplesGroup)
                break;
        }
        //console.log(indexes);
        if(indexes.length > 0)
            this.send(indexes, false);

        return this.bufferLength();
    }

    /* return true if succeded */
    /* endTask is not sent if buffer is not empty */
    this.sendEndTask = function()
    {
        if(this.bufferLength()>0)
        {
            console.log('dataSaver: Buffer is not empty. Not sending endTask.');
            return false;
        }

        switch(mode)
        {
            case dataSaverModes.LOG :
                console.log("dataSaver: logMode: endTask");
                //console log should not fail
                return true;
                break;
            case dataSaverModes.SERVER :
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'endTask.php', false); //synchronous mode
                xhr.setRequestHeader('Content-Type', 'application/json');
                var data={};
                if(this.clientIds != null)
                {
                    //add client Ids
                    data['clientIds'] = this.clientIds;
                }
                try
                {
                    xhr.send(JSON.stringify(data));
                
                    if(xhr.status == 200)
                    {
                        var response = JSON.parse(xhr.responseText);
                        //console.log(response);
                        if(response.success)
                        {
                            return true;
                        }
                    }
                    else
                    {
                        console.log('dataSaver: Error: xhr.status='+xhr.status);
                        return false;
                    }
                }
                catch (e)
                {
                    //only log on network error
                    if((e instanceof DOMException) && (e.code == DOMException.NETWORK_ERR))
                    {
                        console.log(e);
                        return false;
                    }
                    else //rethrow other exception
                        throw e;
                }
                break;
            default :
                break;
        }

        
    }
}