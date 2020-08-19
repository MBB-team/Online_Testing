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
      html_string: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        array: true,
        description: 'The HTML string for the rsvp stimuli'
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
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      target: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Initial target side',
        array: true,
        default: undefined,
        description: 'The inital side that the target stimulus is expected to appear. 0 = left; 1 = right'
      },
      optout_question_index: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Optout Question Indexes',
        array: true,
        default: [],
        description: 'Index of explicit opt out question'
      },
      number_stim: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Number of Stimuli',
        default: 231,
        description: 'The number of stimuli in a trial'
      },
      difficulty: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Trial Difficulty',
        default: undefined,
        description: 'The difficulty of the trial (Easy (1) or Hard (2))'
      },
      main: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Train or Main',
        default: 1,
        description: 'Is this training (0) or main experiment (1)?'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // initialisation
    var nbStim = -1;
    var target_side = trial.target;
    var switch_stim;
    var new_html;
    var update_stim = 1;
    var pt_cor_responses = Array(32).fill([null]).flat();
    var pt_FA_responses = [];
    var tar_times = [];
    var swi_times = [];
    var target_counter = -1;
    var tar_indexes = getAllIndexes(trial.stimulus[0].flat(),7).map(v => [v, v + 1, v + 2]).flat();
    var result;
    var response = {
      rt: null,
      key: null
    };
    var t0 = performance.now(); // trial start time

    // function to end trial when it is time
    var end_trial = function(){

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();
      clearInterval(stim_interval);

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      if (result != 5 && result != 6){
        if (getAllIndexes(pt_cor_responses, null).length < 5 && pt_FA_responses.length < 5){
          result = 1; // success
        }

        if (getAllIndexes(pt_cor_responses, null).length > 5){
          result = 2; // missed too many targets
        }

        if (pt_FA_responses.length >= 5){
          result = 3; // too many false alarms
        }
      }

      // save data
      var trial_data = {
        "rt":               999,
        "responses":       "999",  // string
        "button":           parseInt(response.button), // integer
        "trial_result":     result,
        "pt_cor_responses": pt_cor_responses,
        "FA":               pt_FA_responses,
        "tar_times":        JSON.stringify(tar_times),
        "swi_times":        JSON.stringify(swi_times),
        "optout_i":         nbStim
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);

    }; // end_trial

    // function to handle responses by the subject
    var after_response = function(info){

      if (info.key == 13){
        if (trial.main == 1 && nbStim == trial.optout_question_index[0] || nbStim == trial.optout_question_index[1]){
          result = 6; // explicit opt out
        } else {
          result = 5; // opted out
        }
        end_trial();
      } else {

        if (tar_indexes.some(e => e == (nbStim))){ // if this is a target trial, response is correct

          if (pt_cor_responses[target_counter] == null){ // only record first response
            pt_cor_responses[target_counter] = info.rt - tar_times[target_counter][1];
          }

        } else { // else response is incorrect

          if (tar_times.length != 0){
            pt_FA_responses.push([target_counter + 1, info.rt - tar_times[target_counter][1]]);
          }
        }
      }

    }; // after_response

    // Keyboard responses
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: true,
        allow_held_key: false
      });
    };

    // Display
    display_stim(); // initial stim

    var stim_interval = setInterval(display_stim, trial.trial_duration); // set interval

    // display stimulus
    function display_stim(){
      if (nbStim == trial.number_stim){
        clearInterval(stim_interval);
        end_trial();
      } else {
        if (trial.main == 1 && nbStim == trial.optout_question_index[0] || nbStim == trial.optout_question_index[1]){ // if we need to display the explicit optout question
          if (update_stim){ // only update the optout HTML once
            new_html = "<p style='font-size: 50px'>Voulez-vous arre&#770ter cet exercice ?</p><p>Si oui, appuyez la touche <b><< Entre&#769e >></b> !</p>";
            display_element.innerHTML = new_html;
            update_stim = 0;

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
              jsPsych.pluginAPI.setTimeout(function(){nbStim++; update_stim = 1;}, 500);

            },4000)

          } // update stim

        } else if (!fscreen.fullscreenElement()){ // check fullscreen before display rsvp stim

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

          nbStim++; // iterate the stim

          new_html = trial.html_string;

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

          if (trial.stimulus[0][nbStim] == 7){
            target_counter++;
            tar_times.push([7, performance.now() - t0]);
          }


          // insert target streams content
          display_element.querySelectorAll("div[stream = target]")[target_side].innerHTML = trial.stimulus[0][nbStim];
          display_element.querySelectorAll("div[stream = target]")[1 - target_side].innerHTML = trial.stimulus[2][nbStim];

          // insert switch Content
          switch_stim = trial.stimulus[1][nbStim]

          if (switch_stim == 3){ // if this is a switch stim
            swi_times.push([3, performance.now() - t0]);
            if (trial.difficulty == 1){ // if its NOT HARD, need to change 3s to arrows
              if (target_side == 0){
                switch_stim = '>';
              } else if (target_side == 1){
                switch_stim = '<';
              }
            }
            target_side = 1 - target_side;
          }

          display_element.querySelector("div[stream = switch]").innerHTML = switch_stim;


        } // if not fullscreen or optout but display stim
      } // if not last stim
    }; // display_stim

  }; // plugin.trial

  return plugin;
})();
