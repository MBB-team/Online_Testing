/**
* jspsych-html-slider-response
* a jspsych plugin for free response survey questions
*
* Josh de Leeuw
*
* documentation: docs.jspsych.org
*
*/


jsPsych.plugins['html-slider-response-effort-want-WH'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-slider-response-effort-want-WH',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: 50,
        description: 'Sets the starting value of the slider',
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name:'Slider width',
        default: null,
        description: 'Width of the slider in pixels.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Ok',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
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
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
      effort: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Is this the effort want question?',
        default: false,
        description: 'If true, a number will appear below the slider indicating its current value'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var t0 = new Date();
    var t1;
    var timeDiff;

    var html = '<div id="jspsych-html-slider-response-wrapper" style="margin: 50px 0px;">';

    if (trial.prompt !== null){
      html += trial.prompt;
    }

    html += '<div id="jspsych-html-slider-response-stimulus">' + trial.stimulus + '</div>';
    html += '<div class="jspsych-html-slider-response-container" style="display:flex; justify-content:center; position:relative; margin: 0 auto 1em auto; ';
    if(trial.slider_width !== null){
      html += 'width:'+trial.slider_width+'px;';
    }
    html += '">';
    html += '<div style="display: inline-block; position: relative; text-align: center; width: auto; margin: 0 1em 0 1em">';
    html += '<span style="text-align: center; font-size: 100%;">Min: '+trial.min+' secondes</span>';
    html += '</div>';
    html += '<div style="width:auto; display: inline-block; position: relative;"><input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-html-slider-response-response" oninput="this.nextElementSibling.value = this.value"></input>';
    if (trial.effort){
      html += 'Vous avez choisi <output>'+trial.start+'</output> secondes';
    }
    html += '</div>';
    html += '<div style="display: inline-block; position: relative; text-align: center; width: auto; margin: 0 1em 0 1em">';
    html += '<span style="text-align: center; font-size: 100%;">Max: '+trial.max+' secondes</span>';

    html += '</div>';
    html += '</div>';
    html += '</div>';

    // add submit button
    html += '<button id="jspsych-html-slider-response-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';

    display_element.innerHTML = html;

    var response = {
      rt: null,
      response: null
    };

    if(trial.require_movement){
      display_element.querySelector('#jspsych-html-slider-response-response').addEventListener('change', function(){
        display_element.querySelector('#jspsych-html-slider-response-next').disabled = false;
      })
    }

    display_element.querySelector('#jspsych-html-slider-response-next').addEventListener('click', function() {
      // measure response time
      var endTime = performance.now();
      response.rt = endTime - startTime;
      response.response = display_element.querySelector('#jspsych-html-slider-response-response').value;

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-html-slider-response-next').disabled = true;
      }

    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();
      t1 = new Date();
      timeDiff = t1-t0;
      // save data
      var trial_data = {
        "rt":               response.rt,   // integer
        "stimulus":         trial.stimulus,  // string
        "button_pressed":   999,   // integer
        "effort":           999,   // integer
        "slider_response":  parseInt(response.response),   // integer
        "response_row":     "999",   // string
        "response_col":     "999",   // string
        "target_row":       999,   // integer
        "target_col":       999,   // integer
        "correct_row":      999,   // integer
        "correct_col":      999,   // integer
        "correct":          null,   // BOOL
        "trial_time_elapsed": timeDiff  // integer
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trial_data);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-slider-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = performance.now();
  };

  return plugin;
})();