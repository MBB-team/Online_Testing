/**
 * jspsych-image-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["piechart-keyboard-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'piechart-keyboard-response',
    description: '',
    parameters: {
      probabilities: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Piechart probabilities',
        default: undefined,
        description: 'The probabilities to be displayed by the piechart'
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
    }
  }

  plugin.trial = function(display_element, trial) {


    // var data = [{
    //   type: "pie",
    //   marker: {
    //     colors: ['rgb(0, 128, 0)','rgb(255, 0, 0)']
    //   },
    //   values: trial.probabilities,
    //   labels: ["Win", "Lose"],
    //   textinfo: "label",
    //   textposition: "inside",
    //   automargin: true
    // }]
    //
    // var layout = {
    //   height: 400,
    //   width: 400,
    //   showlegend: false
    // }
    //
    //
    // var newpiechart = Plotly.newPlot(PIE, data, layout)


    var d3 = Plotly.d3;
    var img_jpg= d3.select('#jpgexp');

    var data = [{
      values: [19, 26, 55],
      labels: ['blabla', 'Non-Residential', 'Utility'],
      type: 'pie'
    }];

    var layout = {title : "Simple JavaScript Graph"};

    Plotly.newPlot(
          PIETEST,
          data,
          layout)
    .then(function(gd)
          {Plotly.toImage(gd,{height:300,width:300})
          .then(
                function(url)
                {img_jpg.attr("src", url);
                //console.log(url)
            }
               )
         });

    //var new_html = '<div id="jspsych-html-keyboard-response-stimulus">'+trial.stimulus+'</div>';
   //var new_html= '<img id="'+jpg-export+'"></img>';
   var new_html= '<img id="jpgexp"></img>';

   //var html = '<img src="'+trial.stimulus+'" id="jspsych-image-keyboard-response-stimulus" style="';;

    display_element.innerHTML = new_html;

    // add prompt
    if (trial.prompt !== null){
      html += trial.prompt;
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
        "key_press": response.key
      };

      console.log(trial_data);

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      //display_element.querySelector('#piechart-keyboard-response').className += ' responded';

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
        display_element.querySelector('#jspsych-image-keyboard-response-stimulus').style.visibility = 'hidden';
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
