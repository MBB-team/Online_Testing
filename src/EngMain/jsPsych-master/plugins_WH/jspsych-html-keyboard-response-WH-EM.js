/**
* jspsych-html-keyboard-response
* Josh de Leeuw
*
* plugin for displaying a stimulus and getting a keyboard response
*
* documentation: docs.jspsych.org
*
**/


jsPsych.plugins["html-keyboard-response-WH-EM"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-keyboard-response-WH-EM',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        array: true,
        description: 'The stimulus (i.e. letter) to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      target: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target side',
        array: true,
        default: undefined,
        description: 'The side that the target stimulus is currently expected to appear. 0 = left; 1 = right'
      },
      grid: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Grid',
        array: true,
        default: [[1,1,1,1]],
        description: 'This array represents the grid of boxes shown on the screen.'
      },
      grid_square_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Grid square size',
        default: 100,
        description: 'The width and height in pixels of each square in the grid.'
      },
      target_trial: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target Trial Indicator',
        array: true,
        default: undefined,
        description: 'Indicates if this trial falls within the three trial response window'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var new_html = this.stimulus(trial.grid, trial.grid_square_size, trial.target, trial.stimulus);


    // add prompt
    if(trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

    // align text appropriately
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-0-1").style.verticalAlign = "bottom";
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-1-0").style.textAlign     = "right";
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-2-1").style.verticalAlign = "top";
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-0-3").style.verticalAlign = "bottom";
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-1-4").style.textAlign     = "left";
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-2-3").style.verticalAlign = "top";

    var distractor_streams = display_element.querySelectorAll("div[stream = distractor]");


    // insert distractor content
    for (var distr_i = 0; distr_i < distractor_streams.length; distr_i++){
      distractor_streams[distr_i].innerHTML = trial.stimulus[distr_i+3];
    }

    // insert switch Content
    display_element.querySelector("div[stream = switch]").innerHTML = trial.stimulus[1];

    // insert target streams content
    display_element.querySelectorAll("div[stream = target]")[trial.target].innerHTML = trial.stimulus[0];
    display_element.querySelectorAll("div[stream = target]")[1 - trial.target].innerHTML = trial.stimulus[2];

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
    //  display_element.querySelector('#jspsych-html-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
//    if (trial.stimulus_duration !== null) {
//      jsPsych.pluginAPI.setTimeout(function() {
//        display_element.querySelector('#jspsych-html-keyboard-response-stimulus').style.visibility = 'hidden';
//      }, trial.stimulus_duration);
//    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  plugin.stimulus = function(grid, square_size, target, string){
    var stimulus = "<div id='jspsych-RSVP-EM-stimulus' style='margin:auto; display:table; table-layout:fixed; border-spacing:"+square_size/4+"px'>";
    for(var i=0; i<grid.length; i++){
      stimulus += "<div class='jspsych-RSVP-EM-stimulus-row' style='display:table-row;'>";
      for(var j=0; j<grid[i].length; j++){
        var classname = 'jspsych-RSVP-EM-stimulus-cell';

        stimulus += "<div class='"+classname+"' id='jspsych-RSVP-EM-stimulus-cell-"+i+"-"+j+"' "+
        "data-row="+i+" data-column="+j+" "+
        "style='width:"+square_size+"px; height:"+square_size+"px; display:table-cell; vertical-align:middle; text-align:center; font-size:"+square_size/2+"px;' ";

        if(grid[i][j] == 1){
          stimulus += "stream = 'target' "
        }
        if(grid[i][j] == 2){
          stimulus += "stream = 'switch' "
        }
        if(grid[i][j] == 3){
          stimulus += "stream = 'distractor'"
        }

        stimulus += ">";

        stimulus += "</div>";
      }
      stimulus += "</div>";
    }
    stimulus += "</div>";

    return stimulus;
  }

  return plugin;
})();
