/**
* jspsych-serial-reaction-time
* Josh de Leeuw
*
* plugin for running a serial reaction time task
*
* documentation: docs.jspsych.org
*
* MODIFIED BY WILLIAM HOPPER - 26/04/2020
* Modified to make stimuli images displayed as html
* Modified so that response location is not the same as target_image location
*
**/

jsPsych.plugins["serial-reaction-time-mouse-WH"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'serial-reaction-time-mouse-WH',
    description: '',
    parameters: {
      target_location: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target Location',
        array: true,
        default: undefined,
        description: 'The location of the stimuli. The array should be the [row, column] of the target.'
      },
      correct_location: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Correct Location',
        array: true,
        default: undefined,
        description: 'The location of the response target (where the participant should click). The array should be the [row, column] of the target.'
      },
      grid: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Grid',
        array: true,
        default: [[1,1,1,1]],
        description: 'This array represents the grid of boxes shown on the screen.'
      },
      grid_square_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Grid square size',
        default: 100,
        description: 'The width and height in pixels of each square in the grid.'
      },
      target_image: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Target Image',
        default: undefined,
        description: 'The image to be displayed in the target grid square.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, the trial ends after a key press.'
      },
      pre_target_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Pre-target duration',
        default: 0,
        description: 'The number of milliseconds to display the grid before the target changes color.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial'
      },
      allow_nontarget_responses: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow nontarget response',
        default: false,
        description: 'If true, then user can make nontarget response.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus'
      },
      highlight: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Highlight Time',
        default: 500,
        description: 'How long to highlight the response for'
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
        default: '<button class="jspsych-btn" disabled>%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var t0 = new Date();
    var t1;
    var timeDiff;

    var startTime = -1;
    var response = {
      rt: [],
      row: [],
      column: [],
      button: null,
    }
    var correct_response = 999;

    //show prompt if there is one
    if (trial.prompt !== null) {
      display_element.innerHTML += trial.prompt;
    }

    // display stimulus
    var stimulus = this.stimulus(trial.grid, trial.grid_square_size, trial.target_location, trial.target_image);
    display_element.innerHTML += stimulus;

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
    display_element.innerHTML += '<div id="jspsych-html-button-response-btngroup">';
    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      display_element.innerHTML += '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:8px;" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    display_element.innerHTML += '</div>';

    // add event listeners to buttons
    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response_btn(choice);
      });
    }



    if(trial.pre_target_duration <= 0){
      showTarget();
    } else {
      jsPsych.pluginAPI.setTimeout(function(){
        showTarget();
      }, trial.pre_target_duration);
    }

    function showTarget(){
      var resp_targets;
      var resp = 0;
      var resp_c = -1;

      if(!trial.allow_nontarget_responses){
        resp_targets = [display_element.querySelector('#jspsych-serial-reaction-time-stimulus-cell-'+trial.target_location[0]+'-'+trial.target_location[1])]
      } else {
        resp_targets = display_element.querySelectorAll('.jspsych-serial-reaction-time-stimulus-cell');
      }

      for(var i=0; i<resp_targets.length; i++){
        resp_targets[i].addEventListener('mousedown', function responseListener(e){
          if(startTime == -1){
            return;
          } else {
            if (resp == 1){
              display_element.querySelector('[clicked=_1]').style.outline = '';
              display_element.querySelector('[clicked=_1]').setAttribute('clicked','_0');
            };
            var info = {};
            resp_c++;
            e.currentTarget.style.outline = "5px solid yellow";
            e.currentTarget.setAttribute('clicked', '_1');
            info.row = e.currentTarget.getAttribute('data-row');
            info.column = e.currentTarget.getAttribute('data-column');
            info.rt = performance.now() - startTime;
            after_response_click(info);
            resp = 1;
          }
        });
      }

      startTime = performance.now();

      if(trial.trial_duration !== null){
        jsPsych.pluginAPI.setTimeout(endTrial, trial.trial_duration);
      }

    }

    function endTrial() {
      t1 = new Date();
      timeDiff = t1-t0;

      var button_response = parseInt(response.button);


      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt":               JSON.stringify(response.rt),   // string
        "stimulus":        "999",  // string
        "button_pressed":   button_response,   // integer
        "flips":            999,   // integer
        "conf_response":    999,   // integer
        "responses":       "999",  // string
        "SE_max":           999,   // integer
        "SE_min":           999,   // integer
        "SE_max_ini":       999,   // integer
        "SE_min_ini":       999,   // integer
        "response_row":     JSON.stringify(response.row),   // Str
        "response_col":     JSON.stringify(response.column),   // Str
        "target_row":       trial.target_location[0],   // integer
        "target_col":       trial.target_location[1],   // integer
        "correct_row":      trial.correct_location[0],   // integer
        "correct_col":      trial.correct_location[1],   // integer
        "correct":          correct_response,   // BOOL
        "trial_time_elapsed": timeDiff  // integer
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);

    };

    // function to handle click responses by the subject
    function after_response_click(info) {

      response.row.push(info.row);
      response.column.push(info.column);
      response.rt.push(info.rt);

      // enable buttons
      var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
      for(var i=0; i<btns.length; i++){
        btns[i].disabled = false;
      }
      // only record first response
      // response = response.rt == null ? info : response;

      //display_element.querySelectorAll('.jspsych-serial-reaction-time-stimulus-cell').removeEventListener('mousedown', responseListener());

      // if (trial.response_ends_trial) {
      //   jsPsych.pluginAPI.setTimeout(function(){endTrial()}, trial.highlight);
      // }
    };

    // function to handle button responses by the subject
    function after_response_btn(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - startTime;
      response.button = choice;
      response.rt.push = rt;

      // were they correct?
      var nRes = response.row.length;
      correct_response = (response.row[nRes-1] == trial.correct_location[0] && response.column[nRes-1] == trial.correct_location[1]) ? 1:0;

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        endTrial();
      }
    };

  };

  plugin.stimulus = function(grid, square_size, target_location, target_image, labels) {
    var stimulus = "<div id='jspsych-serial-reaction-time-stimulus' style='margin:auto; display: table; table-layout: fixed; border-spacing:"+square_size/4+"px'>";
    for(var i=0; i<grid.length; i++){
      stimulus += "<div class='jspsych-serial-reaction-time-stimulus-row' style='display:table-row;'>";
      for(var j=0; j<grid[i].length; j++){
        var classname = 'jspsych-serial-reaction-time-stimulus-cell';

        stimulus += "<div class='"+classname+"' id='jspsych-serial-reaction-time-stimulus-cell-"+i+"-"+j+"' "+
        "data-row="+i+" data-column="+j+" clicked='_0' "+
        "style='width:"+square_size+"px; height:"+square_size+"px; display:table-cell; vertical-align:middle; text-align: center; cursor: pointer; font-size:"+square_size/2+"px;";

        if(grid[i][j] == 1){
          stimulus += "border: 2px solid black;"
        }

        stimulus += "'>";
        if(typeof target_location !== 'undefined' && target_location[0] == i && target_location[1] == j){
          stimulus += '<img src="'+target_image+'" style="height:'+square_size+'px; width:auto"></img>';
        }

        if(typeof labels !=='undefined' && labels[i][j] !== false){
          stimulus += labels[i][j]
        }

        stimulus += "</div>";
      }

      stimulus += "</div>";
    }
    stimulus += "</div>";

    return stimulus
  }

  return plugin;
})();
