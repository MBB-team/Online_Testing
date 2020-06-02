<?php
function isMobile()
{
    if(preg_match("/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i", $_SERVER['HTTP_USER_AGENT'],$matches))
    {
        return true;
    }
    return false;
}

function isCompatibleBrowser()
{
    preg_match("/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i", $_SERVER['HTTP_USER_AGENT'], $matches);

    if(count($matches)<2) //unknown browser
        return false;
    if(!strcasecmp($matches[1],'chrome')) //chrome or variante
    {
            preg_match("/\b(OPR|Edge)\/(\d+)/", $_SERVER['HTTP_USER_AGENT'], $tem);
            //Edge or Opera
            if(count($tem)>0)
                return false;
            else //real Chrome
                return true;
    }
    if(!strcasecmp($matches[1],'firefox'))
    {
        return true;
    }
    //print_r($matches);
}
?>