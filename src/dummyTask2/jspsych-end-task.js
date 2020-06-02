/*
 * end-task plugin
 * Call and wait endTask script on server to record task is done
 */

jsPsych.plugins["end-task"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "end-task",
    parameters: {
      displayWaitingAnimation:{
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name:'Display Waiting Animation',
        default: true,
        description: 'If true, display a rotating circle while waiting answer from server.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    html = '';
    if(trial.displayWaitingAnimation) {
      // display waiting animation
      html = '<style>';
      html+= '.endTaskWait {';
      html+= ' border: 16px solid #f3f3f3;';
      html+= ' border-radius: 50%;';
      html+= ' border-top: 16px solid #505050;';
      html+= ' border-left: 16px solid #a0a0a0;';
      html+= ' border-bottom: 16px solid #d0d0d0;';
      html+= ' width: 120px;';
      html+= ' height: 120px;';
      html+= ' animation: spinEndTaskWait 2s linear infinite';
      html+= '}';
      html+= '@keyframes spinEndTaskWait {';
      html+= ' 0% { transform: rotate(0deg);}';
      html+= ' 100% {transform: rotate(360deg);}';
      html+= '}';
      html+= '</style>';
      html+= '<div class="endTaskWait"></div>';
    }
    display_element.innerHTML = html;

    //prepare endTask request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'endTask.php');
    xhr.onload = function() {
      if(xhr.status == 200){
        //console.log(xhr);
        var response = JSON.parse(xhr.responseText); // $.parseJSON
        //console.log(response);
      }
      if(xhr.status != 200 || !response.success)
      {
        console.log("error on update run");
      }
      // clear screen when server's answer is received
      display_element.innerHTML = '';
      // end trial
      jsPsych.finishTrial();
    };
    //set a 5s timeout
    xhr.timeout = 5000;
    xhr.ontimeout = function(){
      console.log("error on update run : timeout reached");
      jsPsych.finishTrial();
    }

    //do endTask request
    xhr.send();
  };

  return plugin;
})();
