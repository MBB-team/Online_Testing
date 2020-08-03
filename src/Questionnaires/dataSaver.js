
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
    
    this.save = function(data)
    {
        //add to buffer
        var index = this.bufferIndex += 1;
        this.buffer[index] = data;

        //action with this data
        switch(mode)
        {
            case dataSaverModes.LOG :
                console.log("dataSaver: Index:" + index + "\n" + data);
                //console log should not fail, remove from buffer
                delete this.buffer[index];
                break;
            case dataSaverModes.SERVER :
                /*var indexes=[];
                indexes.push(index);
                this.send(indexes);*/
                break;
            default :
                break;
        }
    }

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
                    //console.log(xhr.responseText);
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
        //console.log(JSON.stringify(data));
        xhr.send(JSON.stringify(data)); // allows to save it every trial
        
        if(!async)
        {
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
    }

    this.onDataSaverResult = function(response)
    {
        
        for (const [key, value] of Object.entries(response))
        {
            if(key=='message')
                continue;

            if(value == 1)
                delete this.buffer[key];
        }
        if(response['message']!='')
        {
            console.log('dataSaver: error: '+response['message'])
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
}