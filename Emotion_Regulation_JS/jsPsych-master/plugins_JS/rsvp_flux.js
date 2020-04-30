
jsPsych.plugins["rsvp_flux"] = (function() {

      var plugin = {};

      jsPsych.pluginAPI.registerPreload('rsvp_flux', 'stimulus', 'image');

      plugin.info = {
            name: 'rsvp_flux',
            description: '',
            parameters: {
                  flux: {
                        type: jsPsych.plugins.parameterType.IMAGE,
                        pretty_name: 'Stimulus',
                        default: undefined,
                        description: 'The flux of image to be displayed'
                  },
                  number_images: {
                        type: jsPsych.plugins.parameterType.INT,
                        pretty_name: 'The number of images',
                        default: null,
                        description: 'How many images in the rsvp flux'
                  },
                  condition: {
                        type: jsPsych.plugins.parameterType.INT,
                        pretty_name: 'Condition Emotion',
                        default: null,
                        description: 'What is the condition of the trial (DC or BC)'
                  },
                  reward: {
                        type: jsPsych.plugins.parameterType.INT,
                        pretty_name: 'Condition Reward',
                        default: null,
                        description: 'What are the incentives of the trial (smallRwd or largeRwd).'
                  },
                  training: {
                        type: jsPsych.plugins.parameterType.INT,
                        pretty_name: 'Training',
                        default: null,
                        description: 'Is the current trial part of the training'
                  },
            }
      }

      plugin.trial = function(display_element, trial) {

            var nbImg = 0;
            display_Image(); // inital image
            var flux_interval = setInterval(display_Image, trial.stimulus_duration)
            function display_Image(){
                  if (nbImg == trial.number_images){
                        clearInterval(flux_interval)
                        end_trial();
                  } else {
                        var html = '<img src="'+trial.flux[nbImg]+'" id="jspsych-image-keyboard-response-stimulus" ></img>';

                        if (trial.condition == 1){
                              var condi = '<img src="'+imgCondi[0]+'" alt="DC Condition" id="condi-instr" style="position:absolute; top: 50px; right: 20px;" ></img>';
                        } else if (trial.condition == 2){
                              var condi = '<img src="'+imgCondi[1]+'" alt="BC Condition" id="condi-instr" style="position:absolute; top: 50px; right: 20px;" ></img>';}

                        if (trial.reward !== null){
                              if (trial.reward == 1){
                                    var rwd = '<img src="'+imgRwd[0]+'" alt="Small Rwd" id="rwd-instr" style="position:absolute; top: 50px; right: 100px;" ></img>';
                              } else if (trial.reward == 2){
                                    var rwd = '<img src="'+imgRwd[1]+'" alt="Large Rwd" id="rwd-instr" style="position:absolute; top: 50px; right: 100px;" ></img>';}}

                        if (trial.training == 1){
                              display_element.innerHTML = [html + condi];
                        } else if (trial.training == 0 && trial.condition !== null && trial.reward !== null){
                              display_element.innerHTML = [html + condi + rwd];}
                        nbImg++;
                  }
            }


            // function to end trial when it is time
            var end_trial = function() {
                  jsPsych.pluginAPI.clearAllTimeouts();
                  var trial_data = {
                        "rt": 999,
                        "stimulus": trial.flux.join(),
                        "responses": "999",
                        "key_press": 999
                  };
                  display_element.innerHTML = '';
                  jsPsych.finishTrial(trial_data);
            };

      };

      return plugin;
})();
