/* jspsych-fullscreen.js
* Josh de Leeuw
*
* toggle fullscreen mode in the browser
*
* Juliana's version modified my WH
*
*/


jsPsych.plugins.fullscreen = (function() {


  var plugin = {};

  plugin.info = {
    name: 'fullscreen',
    description: '',
    parameters: {
      fullscreen_mode: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Fullscreen mode',
        default: true,
        array: false,
        description: 'If true, experiment will enter fullscreen mode. If false, the browser will exit fullscreen mode.'
      },
      message: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Message',
        default: '<p>The experiment will switch to full screen mode when you press the button below</p>',
        array: false,
        description: 'HTML content to display above the button to enter fullscreen mode.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'The text that appears on the button to enter fullscreen.'
      },
      delay_after: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Delay after',
        default: 0,
        array: false,
        description: 'The length of time to delay after entering fullscreen mode before ending the trial.'
      },
      check_fullscreen: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'check_fullscreen',
        default: null,
        description: 'If it is already fullscreen then does nothing'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // if(trial.check_fullscreen = false){
    if(trial.fullscreen_mode){
      display_element.innerHTML = trial.message + '<button id="jspsych-fullscreen-btn" class="jspsych-btn">'+trial.button_label+'</button>';
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
        endTrial();
      });
    }

    if (!document.fullscreenElement || !document.mozFullScreenElement || !document.webkitFullscreenElement || !document.msFullscreenElement) {
      display_element.innerHTML = trial.message + '<button id="jspsych-fullscreen-btn" class="jspsych-btn">'+trial.button_label+'</button>';
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
        endTrial();
      });
    } //end if
    //        });

    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      endTrial();}


      function endTrial() {
        display_element.innerHTML = '';

        jsPsych.pluginAPI.setTimeout(function(){

          var trial_data = {
            "rt": 999,
            "stimulus": 999,
            "response": 999,
            "dummy_number": 999,
            "start_point": 999
          };

          jsPsych.finishTrial(trial_data);

        }, trial.delay_after);

      }

    };

    return plugin;
  })();