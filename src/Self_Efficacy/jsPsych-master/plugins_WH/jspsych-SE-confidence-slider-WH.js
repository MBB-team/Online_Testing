/*
* Example plugin template
*/

jsPsych.plugins["SE-confidence-slider-WH"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "SE-confidence-slider-WH",
    description: 'Creates a number line along which participants can move the position and range of a slider.',
    parameters: {
      range: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: 30,
        pretty_name: 'Number Line Range',
        description: 'The range of the number line.'
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        default: [1,30],
        array: true,
        pretty_name: 'Initial Number Line'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus'
      },
      square_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Square size',
        default: 50,
        description: 'The width and height in pixels of each square in the number line.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var response = {
      rt: null,
      max: null,
      min: null,
      max_ini: null,
      min_ini: null
    };

    // display stimulus
    var stimulus = plugin.generate_numberline(trial.range, trial.square_size);
    display_element.innerHTML = stimulus;

    // display prompt if there is one
    if (trial.prompt !== null){
      display_element.innerHTML += trial.prompt;
    };

    // clean up stimuli
    var endIndex = trial.range - 1;
    display_element.querySelector('#jspsych-SE-confidence-slider-stimulus-cell-0').style.borderLeft = "2px solid rgb(188,188,188)";
    display_element.querySelector('#jspsych-SE-confidence-slider-stimulus-cell-'+endIndex+'').style.borderRight = "2px solid rgb(188,188,188)";

    // Initialise slider location
    var sliderLimits_ini = Array(2);
    sliderLimits_ini[0] = trial.start[0];
    sliderLimits_ini[1] = trial.start[1];
    var sliderLimits = sliderLimits_ini;

    for (var i = sliderLimits[0]; i <= sliderLimits[1] ; i++) {

      display_element.querySelector('#jspsych-SE-confidence-slider-stimulus-cell-'+i+'').style.borderTop = "4px solid red";
      display_element.querySelector('#jspsych-SE-confidence-slider-stimulus-cell-'+i+'').style.borderBottom = "4px solid red";
    }

    // for when the participant is responding
    function after_response(info){

      var key_pressed = info.key;

      if (key_pressed == 37){ // left
        sliderLimits[0] = sliderLimits[0] - 1;
        sliderLimits[1] = sliderLimits[1] - 1;
      };

      if (key_pressed == 39){ // right
        sliderLimits[0] = sliderLimits[0] + 1;
        sliderLimits[1] = sliderLimits[1] + 1;
      }

      if (key_pressed == 38){ // up
        sliderLimits[1] = sliderLimits[1] + 1;
      }

      if (sliderLimits[0] !== sliderLimits[1]){
        if (key_pressed == 40){ // down
          sliderLimits[1] = sliderLimits[1] - 1;
        }
      }

      // don't go off line to the left
      if (sliderLimits[0] == -1){sliderLimits[0] = 0;};
      if (sliderLimits[0] == trial.range){sliderLimits[0] = trial.range - 1;};
      if (sliderLimits[1] == -1){sliderLimits[1] = 0;};
      if (sliderLimits[1] == trial.range){sliderLimits[1] = trial.range - 1;};

      // don't go off line to the right
      if (sliderLimits[0] == -1){sliderLimits[0] = 0;};
      if (sliderLimits[0] == trial.range){sliderLimits[0] = trial.range - 1;};
      if (sliderLimits[1] == -1){sliderLimits[1] = 0;};
      if (sliderLimits[1] == trial.range){sliderLimits[1] = trial.range - 1;};

      // don't invert the line
      if (sliderLimits[0] > sliderLimits[1]){sliderLimits[0] = sliderLimits[1];};
      if (sliderLimits[1] < sliderLimits[0]){sliderLimits[1] = sliderLimits[0];};

      var el = display_element.querySelectorAll('.jspsych-SE-confidence-slider-cell');
      for (var i = 0; i < el.length; i++) {
        el[i].style.borderTop = 'none';
        el[i].style.borderBottom = 'none';
      }

      for (var i = sliderLimits[0]; i <= sliderLimits[1] ; i++) {

        display_element.querySelector('#jspsych-SE-confidence-slider-stimulus-cell-'+i+'').style.borderTop = "4px solid red";
        display_element.querySelector('#jspsych-SE-confidence-slider-stimulus-cell-'+i+'').style.borderBottom = "4px solid red";

      }

      if (key_pressed == 13){
        response = info;
        endTrial();
      }
    };


    // end trial after specified trial (if not null)
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(endTrial, trial.trial_duration);
    }

    function endTrial (){

      // data saving
      var trial_data = {
        "rt":               response.rt,   // integer
        "stimulus":        "999",  // string
        "button_pressed":   999,   // integer
        "flips":            999,   // integer
        "conf_response":    999,   // integer
        "responses":       "999",  // string
        "SE_max":           sliderLimits[1]+1,   // integer
        "SE_min":           sliderLimits[0]+1,   // integer
        "SE_max_ini":       trial.start[1]+1,   // integer
        "SE_min_ini":       trial.start[0]+1,   // integer
        "response_row":     999,   // integer
        "response_col":     999,   // integer
        "target_row":       999,   // integer
        "target_col":       999,   // integer
        "correct_row":      999,   // integer
        "correct_col":      999,   // integer
        "correct":          null   // BOOL
      };

      // clear the display
      display_element.innerHTML = '';

      // clear listeners
      jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

      // end trial
      jsPsych.finishTrial(trial_data);

    }; // end trial

    // set up listener
    var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: [13, 37, 38, 39, 40],
      rt_method: 'performance',
      persist: true,
      allow_held_key: true
    })


  }; // trial

  function randi(min, max) { // min and max included (acts like randi of Matlab)
        return Math.floor(Math.random() * (max - min + 1) + min);
  };

  plugin.generate_numberline = function(range, square_size){

    // create blank element to hold code we generate
    var html = "<div id='js-psych-SE-confidence-slider-stimulus' style='margin:auto; display:table; table-layout: fixed;'>";
    html += "<div class='jspsych-SE-confidence-slider-stimulus-row' style='display:table-row;'>";

    // loop through the cells
    for (var i = 0; i < range; i++) {
      var classname = 'jspsych-SE-confidence-slider-cell';

      html += "<div class='"+classname+"' id='jspsych-SE-confidence-slider-stimulus-cell-"+i+"' "+
      "style='width:"+square_size+"px; height:"+square_size+"px; display:table-cell; vertical-align:middle; font-size:"+square_size/2+"px; "+
      "border-left: 1px solid rgb(188,188,188); border-right: 1px solid rgb(188,188,188);'>";

      // display in each box
      html += i + 1;

      html += "</div>"; // cell
    } // loop through cells

    html += "</div>"; // row
    html += "</div>"; // table

    return html;

  }; // generate_numberline

  return plugin;
})();
