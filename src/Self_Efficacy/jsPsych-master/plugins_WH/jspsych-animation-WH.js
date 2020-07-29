/**
* jsPsych plugin for showing animations and recording keyboard responses
* Josh de Leeuw
*
* MODIFIED by William Hopper
*
*
* documentation: docs.jspsych.org
*/

jsPsych.plugins["animation-WH"] = (function() {

  var plugin = {};

  //  jsPsych.pluginAPI.registerPreload('animation', 'stimuli', 'image');

  plugin.info = {
    name: 'animation-WH',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'The images to be displayed.'
      },
      frame_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Frame time',
        default: 250,
        description: 'Duration to display each image.'
      },
      frame_isi: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Frame gap',
        default: 0,
        description: 'Length of gap to be shown between each image.'
      },
      sequence_reps: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sequence repetitions',
        default: 1,
        description: 'Number of times to show entire sequence.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        array: true,
        description: 'Keys subject uses to respond to stimuli.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below stimulus.'
      },
      feedback: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Feedback',
        default: false,
        description: 'Indicates a feedback trial if true. If true, must indicate which responses were correct!'
      },
      correct_responses: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Correct Response array',
        array: true,
        default: null,
        description: 'Array indicating which responses were correct.'
      },
      clicked: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Location of click',
        default: null,
        array: true,
        description: 'Grid indexes of where the participant responded.'
      },
      target: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Location of target',
        default: null,
        array: true,
        description: 'Grid indexes of where the target was.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var interval_time = trial.frame_time + trial.frame_isi;
    var animate_frame = -1;
    var reps = 0;
    var startTime = performance.now();
    var animation_sequence = [];
    var animation_sequence_summary = []; // stimulus parameters only to reduce saved size in database
    var responses = [];
    var current_stim = "";

    var animate_interval = setInterval(function() {
      var showImage = true;
      display_element.innerHTML = ''; // clear everything
      animate_frame++;
      if (animate_frame == trial.stimuli.length) {
        animate_frame = 0;
        reps++;
        if (reps >= trial.sequence_reps) {
          endTrial();
          clearInterval(animate_interval);
          showImage = false;
        }
      }
      if (showImage) {
        show_next_frame();
      }
    }, interval_time);

    function show_next_frame() {
      // show image
      display_element.innerHTML = trial.stimuli[animate_frame]['stimulus'];

      // if feedback trial, highlight correct responses
      if (trial.feedback){
    //    console.log(trial.clicked[animate_frame])
        if (trial.clicked[animate_frame] !== null){
          var square_clicked = display_element.querySelector('#jspsych-SE_WH-stimulus-cell-'+trial.clicked[animate_frame][0]+'-'+trial.clicked[animate_frame][1])
        }
        var square_target  = display_element.querySelector('#jspsych-SE_WH-stimulus-cell-'+trial.target[animate_frame][0]+'-'+trial.target[animate_frame][1])
        if (square_clicked !== null){
          if(trial.correct_responses[animate_frame]){
            square_clicked.style.outline = "5px solid rgb(51, 204, 51)";
          } else {
            square_clicked.style.outline = "5px solid rgb(255, 0, 0)";
          }
        }
        square_target.style.outline = "5px solid yellow";
      }

      current_stim = trial.stimuli[animate_frame]['stimulus'];

      var now = performance.now(); //only one call to use the same time for two arrays
      // record when image was shown
      animation_sequence.push({
        "stimulus": trial.stimuli[animate_frame]['stimulus'],
        "time": now - startTime
      });
      animation_sequence_summary.push({
        "stimulus": trial.stimuli[animate_frame]['stimulus_summary'],
        "time": now - startTime
      })

      if (trial.prompt !== null) {
        display_element.innerHTML += trial.prompt;
      }

      if (trial.frame_isi > 0) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-animation-image').style.visibility = 'hidden';
          current_stim = 'blank';
          var now = performance.now(); //only one call to use the same time for two arrays
          // record when blank image was shown
          animation_sequence.push({
            "stimulus": 'blank',
            "time": now - startTime
          });
          animation_sequence_summary.push({
            "stimulus": trial.stimuli[animate_frame]['stimulus_summary'],
            "time": now - startTime
          })
        }, trial.frame_time);
      }
    }

    var after_response = function(info) {

      responses.push({
        key_press: info.key,
        rt: info.rt,
        stimulus: current_stim
      });

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-animation-image').className += ' responded';
    }

    // hold the jspsych response listener object in memory
    // so that we can turn off the response collection when
    // the trial ends
    var response_listener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: trial.choices,
      rt_method: 'performance',
      persist: true,
      allow_held_key: false
    });

    function endTrial() {

      jsPsych.pluginAPI.cancelKeyboardResponse(response_listener);

      // gather trial data
      var trial_data = {
        "rt":               999,   // integer
        "stimulus":         JSON.stringify(animation_sequence_summary),  // string
        "button_pressed":   999,   // integer
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
        "correct":          null   // BOOL
      };
      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();
