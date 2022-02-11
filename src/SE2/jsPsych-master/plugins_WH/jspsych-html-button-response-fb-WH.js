/**
 * jspsych-html-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response with highlighting of target and clicked locations
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["html-button-response-fb-WH"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-button-response-fb-WH',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
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
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
      target: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target location',
        default: null,
        description: 'An array of the locations of the target that was shown to the participant during testing'
      },
      correct_responses: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Correct Response array',
        array: true,
        default: null,
        description: 'Array indicating which responses were correct.'
      },
      target_correct: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Location of the correct number',
        default: null,
        array: true,
        description: 'Grid indexes of where the participant should have responded.'
      },
      target_score: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial target score',
        default: null,
        array: true,
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var t0 = new Date();
    var t1;
    var timeDiff;

    // display stimulus
    var html = '<div id="jspsych-html-button-response-stimulus">'+trial.stimulus+'</div>';

    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in html-button-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    html += '<div id="jspsych-html-button-response-btngroup">';
    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html += '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    html += '</div>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }
    display_element.innerHTML = html;

    // Highlight the appropriate cells
    for (var pair_i = 0; pair_i < numbersImg.length; pair_i++){
      // Highlight the pair we showed yellow
      var square_target  = display_element.querySelector('#jspsych-SE_WH-stimulus-cell-'+trial.target[pair_i][0]+'-'+trial.target[pair_i][1]); // get the cell
      // square_target.style.outline = "5px solid yellow"; // set its outline to yellow
      // Highlight the pair the participant click on depending if they were correct or not and if they clicked it
      if (trial.correct_responses[pair_i] !== null){
        var square_clicked = display_element.querySelector('#jspsych-SE_WH-stimulus-cell-'+trial.target_correct[pair_i][0]+'-'+trial.target_correct[pair_i][1])
      };
      if (square_clicked !== null){
        if(trial.correct_responses[pair_i]){
          square_target.style.outline = "5px solid rgb(51, 204, 51)";
          square_clicked.style.outline = "5px solid rgb(51, 204, 51)";
        } else {
          square_clicked.style.outline = "5px solid rgb(255, 0, 0)";
          square_target.style.outline = "5px solid rgb(255, 0, 0)";
        }
      };
    };

    // start time
    var start_time = performance.now();

    // add event listeners to buttons
    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

          if(response.button == null){
                response.button = 20
          }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();
      t1 = new Date();
      timeDiff = t1-t0;
      // gather the data to store for the trial
      var trial_data = {
        "rt":               response.rt,   // integer
        "stimulus":         trial.stimulus,  // string
        "button_pressed":   parseInt(response.button),   // integer
        "flips":            999,   // integer
        "conf_response":    999,   // integer
        "responses":       "999",  // string
        "SE_max":           999,   // integer
        "SE_min":           999,   // integer
        "SE_max_ini":       999,   // integer
        "SE_min_ini":       999,   // integer
        "response_row":     999,   // integer
        "response_col":     999,   // integer
        "target_row":       999,   // integer
        "target_col":       999,   // integer
        "correct_row":      999,   // integer
        "correct_col":      999,   // integer
        "correct":          null,   // BOOL
        "trial_time_elapsed": timeDiff  // integer
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-button-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
