/**
* jspsych-html-keyboard-response
* Josh de Leeuw
*
* plugin for displaying a stimulus and getting a keyboard response
*
* documentation: docs.jspsych.org
*
**/


jsPsych.plugins["html-keyboard-response-WH-EM-V2"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-keyboard-response-WH-EM-V2',
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
        pretty_name: 'Initial target side',
        array: true,
        default: undefined,
        description: 'The inital side that the target stimulus is expected to appear. 0 = left; 1 = right'
      },
      target_trial: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target Trial Indicator',
        array: true,
        default: undefined,
        description: 'Indicates if this trial falls within the three trial response window and, if yes, the index of the target'
      },
      optout_question_index: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Optout Question Indexes',
        array: true,
        default: undefined,
        description: 'Index of explicit opt out question'
      },
      number_stim: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Number of Stimuli',
        default: 232,
        description: 'The number of stimuli in a trial'
      },
      difficulty: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial Difficulty',
        default: undefined,
        description: 'The difficulty of the trial (Easy (0) or Hard (1))'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var nbStim = 0;
    var target_side = trial.target;
    var switch_stim;
    var new_html;
    var update_stim = 1;
    var response = {
      rt: null,
      key: null
    };
    display_stim(); // initial stim

    var stim_interval = setInterval(display_stim, trial.trial_duration); // set interval

    // display stimulus
    function display_stim(){
      if (nbStim == trial.number_stim){
        clearInterval(stim_interval);
        end_trial();
      } else {
        if (nbStim == trial.optout_question_index[0] || nbStim == trial.optout_question_index[1]){ // if we need to display the explicit optout question
          if (update_stim){ // only update the optout HTML once
            new_html = "<p style='font-size: 50px'>Voulez-vous arre&#770ter cet exercice ?</p><p>Si oui, appuyez la touche <b><< Entre&#769e >></b> !</p>";

            display_element.innerHTML = new_html;

            var optout_keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: function(info){

                // only record first response
                if (response.key == null){
                  response = info;
                }

                // if opted out
                if (info.key == 13){
                  end_trial();
                }

              },
              valid_responses: 13,
              rt_method: 'performance',
              persist: false,
              allow_held_key: false
            });


            var optout_question = jsPsych.pluginAPI.setTimeout(function(){
              switch (target_side) {
                case 0:
                new_html = "<p style='font-size: 100px'><</p>"
                break;
                case 1:
                new_html = "<p style='font-size: 100px'>></p>"
                break;
              }

              display_element.innerHTML = new_html;

              // resume
              jsPsych,pluginAPI.setTimeout(function(){nbStim++; update_stim = 1;}, 500);

            },4000)

          } // update stim

        } else if (!document.fullscreenElement || !document.mozFullScreenElement || !document.webkitFullscreenElement || !document.msFullscreenElement){ // check fullscreen before display rsvp stim

          display_element.innerHTML = "Vous devez \352tre en mode plein \351cran pour continuer l'exp\351rience!  <br></br> Veuillez cliquer sur le bouton ci-dessous pour passer en mode plein \351cran.<br></br><p>" + '<button id="jspsych-fullscreen-btn" class="jspsych-btn">Continuer</button>';
          var listener = display_element.querySelector('#jspsych-fullscreen-btn').addEventListener('click', function() {
            var element = document.documentElement;
            if (element.requestFullscreen) {
              element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
              element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
              element.msRequestFullscreen();
            }
          });


        } else { // display stim

          new_html = trial.stimulus;

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
          display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-0-5").style.verticalAlign = "bottom";
          display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-1-6").style.textAlign     = "left";
          display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-2-5").style.verticalAlign = "top";

          // set spacing cells
          var spacing = ""+sizeInDeg-70+"px"
          display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-0-2").style.width = spacing;
          display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-0-4").style.width = spacing;
          display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-1-2").style.width = spacing;
          display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-1-4").style.width = spacing;
          display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-2-2").style.width = spacing;
          display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-2-4").style.width = spacing;

          var distractor_streams = display_element.querySelectorAll("div[stream = distractor]");

          // insert distractor content
          for (var distr_i = 0; distr_i < distractor_streams.length; distr_i++){
            distractor_streams[distr_i].innerHTML = trial.stimulus[distr_i+3][nbStim];
          }

          // insert target streams content
          display_element.querySelectorAll("div[stream = target]")[target_side].innerHTML = trial.stimulus[0][nbStim];
          display_element.querySelectorAll("div[stream = target]")[1 - target_side].innerHTML = trial.stimulus[2][nbStim];

          // insert switch Content
          switch_stim = trial.stimulus[1][nbStim]

          if (switch_stim == 3){ // if this is a switch stim
            if (!trial.difficulty){ // if its NOT HARD, need to change 3s to arrows
              if (target_side == 0){
                switch_stim = '<';
              } else if (target_side == 1){
                switch_stim = '>';
              }
            }
            target_side = 1 - target_side;
          }

          display_element.querySelector("div[stream = switch]").innerHTML = switch_stim;

          nbStim++; // iterate the stim

        } // if not fullscreen or optout but display stim
      } // if not last stim
    }; // display_stim








    ////////////////////======================================================
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
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-0-5").style.verticalAlign = "bottom";
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-1-6").style.textAlign     = "left";
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-2-5").style.verticalAlign = "top";

    // set spacing cells
    var spacing = ""+sizeInDeg-70+"px"
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-0-2").style.width = spacing;
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-0-4").style.width = spacing;
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-1-2").style.width = spacing;
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-1-4").style.width = spacing;
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-2-2").style.width = spacing;
    display_element.querySelector("#jspsych-RSVP-EM-stimulus-cell-2-4").style.width = spacing;


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

      // determine response correctness
      if (trial.target_trial[0]){ // if this is a target trial
        if (response.key == 32){
          correct = 1; // hit (correct)
          //    // if this is not the first stimulus presentation trial, correct the previous one
          //    if (trial.target_trial[1] == 1){jsPsych.data.get().addToLast({correct: 4, rt: response.rt + 350*trial.target_trial[1]})}
          //    if (trial.target_trial[1] == 2){
          //      jsPsych.data.get().last(2).addToAll({correct: 4, rt: response.rt + 350*trial.target_trial[1]})
          //    }
        } else if (response.key == 13){
          correct = 5; // opted out
        } else {
          correct = 2; // miss (incorrect)
        }
      } else {
        if (response.key == 32){ // if this is not a target trial
          correct = 3; // false alarm
        } else if (response.key == 13){
          correct = 5; // opted out
        } else {
          correct = 999; // no response expected
        };
      }


      // check to see if participant correctly responded in the last trial
      // gather the data to store for the trial
      //var data = jsPsych.data.getLastTrialData().values()[0];

      if (response.key != null){
        if (trial.target_trial[0] && response.key == 32){
          var trial_data = {
            "rt":                 response.rt + 350*trial.target_trial[1],
            "correct":            correct,
            "stimulus":           trial.stimulus,
            "key_press":          response.key,
            "responses":         "999",  // string
            "button_pressed":     999 // integer
          }
        } else {
          var trial_data = {
            "rt":                 response.rt,
            "correct":            correct,
            "stimulus":           trial.stimulus,
            "key_press":          response.key,
            "responses":         "999",  // string
            "button_pressed":     999 // integer
          }
        };
      } else {
        var trial_data = {
          "rt":                 999,
          "correct":            correct,
          "stimulus":           trial.stimulus,
          "key_press":          1,
          "responses":         "999",  // string
          "button_pressed":     999 // integer
        }
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

  return plugin;
})();
