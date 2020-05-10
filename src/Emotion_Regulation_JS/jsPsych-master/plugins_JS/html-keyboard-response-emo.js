/**
 * jspsych-html-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["html-keyboard-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-keyboard-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
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
      fixation: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'fixation trial',
        default: false,
        description: 'If true, this is a fixation cross.'
      },
      condition: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Condition Emotion',
        default: null,
        description: 'What is the condition of the trial (DC or BC)'
      },
      reward: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Condition Reward',
        default: null,
        description: 'What are the incentives of the trial (smallRwd or largeRwd).'
      },
      training: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Training',
        default: null,
        description: 'Is the current trial part of the training'
      },

    }
  }

  plugin.trial = function(display_element, trial) {

    var new_html = '<div id="jspsych-html-keyboard-response-stimulus">'+trial.stimulus+'</div>';

    // add prompt
    if(trial.prompt !== null){
      new_html += trial.prompt;
    }

    // add condition
    if (trial.condition !== null){
      if (trial.condition == 1){
        var condi = '<img src="'+imgCondi[0]+'" alt="DC Condition" id="condi-instr" style="position:absolute; top: 50px; right: 20px;" ></img>';
      } else if (trial.condition == 2){
        var condi = '<img src="'+imgCondi[1]+'" alt="BC Condition" id="condi-instr" style="position:absolute; top: 50px; right: 20px;" ></img>';
      }
    }

    if (trial.reward !== null){
      if (trial.reward == 1){
        var rwd = '<img src="'+imgRwd[0]+'" alt="Small Rwd" id="rwd-instr" style="position:absolute; top: 50px; right: 100px;" ></img>';
      } else if (trial.reward == 2){
        var rwd = '<img src="'+imgRwd[1]+'" alt="Large Rwd" id="rwd-instr" style="position:absolute; top: 50px; right: 100px;" ></img>';
      }
    }

    // draw

    if (trial.training == 1){
      display_element.innerHTML = [new_html + condi];
    } else if (trial.training == 0 && trial.condition !== null && trial.reward !== null){
      display_element.innerHTML = [new_html + condi + rwd];
    } else if (trial.condition == null && trial.reward == null){
      display_element.innerHTML = [new_html];
    }

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
        "responses": "999",
        "key_press": response.key
      };

      if (trial.fixation) { // if this is a fixation trial
            var trial_data = {
                  "rt": 999,
                  "stimulus": "fixation_cross",
                  "responses": "999",
                  "key_press": 999
            };
      }

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-keyboard-response-stimulus').className += ' responded';

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
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
