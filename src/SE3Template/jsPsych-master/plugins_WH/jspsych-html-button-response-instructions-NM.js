/**
* jspsych-html-button-response
* Josh de Leeuw
*
* plugin for displaying a stimulus and getting a keyboard response
*
* documentation: docs.jspsych.org
*
**/

jsPsych.plugins["html-button-response-instructions-NM"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: 'html-button-response-instructions-NM',
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
        blocked_duration: {
          type: jsPsych.plugins.parameterType.INT, 
          pretty_name: 'Duration before button clickable',
          default: null, 
          description: 'Fixed time to look at stimulus before enabling button click ability'
        }
      }
    }
  
    plugin.trial = function(display_element, trial) {
  
      var t0 = new Date();
      var t1;
      var timeDiff;
      var html = '';
  
      html += '<div>'
  
      // display stimulus
      html += '<div id="jspsych-html-button-response-stimulus">'+trial.stimulus+'</div>';
    
      //show prompt if there is one
     if (trial.prompt !== null) {
        html += trial.prompt;
      }

     // create the button to click through
      html += '<button id="jspsych-html-instr-next" class="jspsych-btn" '+ (trial.blocked_duration !== null ? "disabled" : "") + '>'+trial.choices+'</button>';
  
      display_element.innerHTML = html;
   
      // start time
      var start_time = performance.now();

     if (trial.blocked_duration !== null) {
        setTimeout(function() {
            display_element.querySelector('#jspsych-html-instr-next').removeAttribute('disabled');
        }, trial.blocked_duration);
    }
  
      // Add event listener directly to the button
      display_element.querySelector('#jspsych-html-instr-next').addEventListener('click', function(e) {
      after_response();
      });
  
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
          "effort":           999,   // integer
          "slider_response":  999,   // integer
          "response_row":     "999",   // string
          "response_col":     "999",   // string
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
  
      
  
    };
  
    return plugin;
  })();
  