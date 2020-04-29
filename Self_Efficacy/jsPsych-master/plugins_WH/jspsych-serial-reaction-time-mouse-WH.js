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
    name: 'serial-reaction-time-mouse',
    description: '',
    parameters: {
      target_location: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'target_location',
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
      fade_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fade duration',
        default: null,
        description: 'If a positive number, the target will progressively change color at the start of the trial, with the transition lasting this many milliseconds.'
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
    }
  }

  plugin.trial = function(display_element, trial) {

    var startTime = -1;
    var response = {
      rt: null,
      row: null,
      column: null
    }

    // display stimulus
    var stimulus = this.stimulus(trial.grid, trial.grid_square_size, trial.target_location, trial.target_image);
    display_element.innerHTML = stimulus;

		if(trial.pre_target_duration <= 0){
			showTarget();
		} else {
			jsPsych.pluginAPI.setTimeout(function(){
				showTarget();
			}, trial.pre_target_duration);
		}

		//show prompt if there is one
    if (trial.prompt !== null) {
      display_element.innerHTML += trial.prompt;
    }

		function showTarget(){
      var resp_targets;
      var response = 0;

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
            if (response == 0) {
               var info = {}
               e.currentTarget.style.outline = "5px solid yellow"
               info.row = e.currentTarget.getAttribute('data-row');
               info.column = e.currentTarget.getAttribute('data-column');
               info.rt = performance.now() - startTime;
               after_response(info);
               console.log(info);
               response = 1;
            }
          }
        });
      }

      startTime = performance.now();

      if(trial.fade_duration == null){
        display_element.querySelector('#jspsych-serial-reaction-time-stimulus-cell-'+trial.target_location[0]+'-'+trial.target_location[1]).style.backgroundColor = trial.target_color;
      } else {
        display_element.querySelector('#jspsych-serial-reaction-time-stimulus-cell-'+trial.target_location[0]+'-'+trial.target_location[1]).style.transition = "background-color "+trial.fade_duration;
        display_element.querySelector('#jspsych-serial-reaction-time-stimulus-cell-'+trial.target_location[0]+'-'+trial.target_location[1]).style.backgroundColor = trial.target_color;
      }

			if(trial.trial_duration !== null){
				jsPsych.pluginAPI.setTimeout(endTrial, trial.trial_duration);
			}

		}

    function endTrial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
				"grid": JSON.stringify(trial.grid),
				"target_location": JSON.stringify(trial.target_location),
        "correct_location": JSON.stringify(trial.correct_location),
        "target_image": trial.target_image,
        "response_row": response.row,
        "response_column": response.column,
        "correct": response.row == trial.correct_location[0] && response.column == trial.correct_location[1]
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);

    };

    // function to handle responses by the subject
    function after_response(info) {

			// only record first response
      response = response.rt == null ? info : response;

      //display_element.querySelectorAll('.jspsych-serial-reaction-time-stimulus-cell').removeEventListener('mousedown', responseListener());

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
          "data-row="+i+" data-column="+j+" "+
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
