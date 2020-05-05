/**
 * html+image-keyboard-response
 * plugin modification  of "jspsych-html-button-response" (original author: Josh de Leeuw)
 * *
 * documentation: docs.jspsych.org
 *
 * plugin modification for displaying a stimulus (html_string) + an image and getting a button responses
 * author of modification: Cynthia Cabañas (cynthiacabanas@gmail.com)
 **/

jsPsych.plugins["html+image-button-response"] = (function() {

  var plugin = {};
  // --------------------------------- PRE-LOAD MEDIA  -----------------------//
    // Example
      var piechart = [];
      for(var t=0;t < 82+1;t++){
        piechart[t] = 'stimuli/img_piechart/piechart ('+t+').png'; // Pre-load all the jpg files in this folder
      };
  // ---------------------------------------------------------------------------------//

  plugin.info = {
    name: 'html+image-button-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      phase: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Phase',
        default: null,
        description: 'What phase is it doing? [Decision/Prediction]'
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
        default: '<button class="jspsych-btn">%choice%</button>',//'<button class="button">%choice%</button>'
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
      trial_ends_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the end of the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '500px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '150px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
      probabilities: { // Piechart Image
        type: jsPsych.plugins.parameterType.INT, // interval with probabilities
        pretty_name: 'Pie Chart Probabilities',
        default: null,
        description: 'Probability index for pie chart images'
      },
      dummy: {
        type: jsPsych.plugins.parameterType.INT, // interval with probabilities
        pretty_name: 'Dummy number',
        default: null,
        description: 'Dummy number to check later for parameters'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // display stimulus
    var new_html = '<div id="jspsych-html-button-response-stimulus" style="position:absolute; top: 280px; right: 740px;">'+trial.stimulus+'</div>';

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
    new_html += '<div id="jspsych-html-button-response-btngroup">';
    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      new_html += '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    new_html += '</div>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      new_html += '<div id:"myPrompt" style="position:absolute; top: 50px; right: 600px;">'+trial.prompt+'</div>';
    }

    // add piechart with probabilities
    if (trial.probabilities !== null){
      var new_piechart = '<img src="'+piechart[trial.probabilities]+'" alt="probabiliy to lose" style="position:absolute; top: 100px; right: 220px;" ></img>';
    }


    // DISPLAY ELEMENTS
    if (trial.probabilities !== null){
      display_element.innerHTML = [new_html + new_piechart];
    } else if (trial.probabilities == null){
        display_element.innerHTML = [new_html]
      }


    // start time
    var start_time = performance.now();

    // add event listeners to buttons
    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
         //e.currentTarget.setAttribute('style', 'border: 1px solid blue;');
         e.currentTarget.style.border = "3px solid blue";
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
      //document.querySelector.setAttribute('style', 'background-color: red;');


      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
        //btns[i].setAttribute('style', 'background-color: red;');
      }

      // end trial if time limit is set
      if (trial.trial_ends_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                  end_trial();
            }, trial.trial_ends_duration);
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button,
        "dummy_number": trial.dummy
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


  };

  return plugin;
})();
