function SE(nbBlocks, nbTrials){

  // INITIALISATION //
  var timelineTask  = [];
  var trial_counter = 0;
  var flip_counter  = 1;
  var nbTperB       = nbTrials/nbBlocks;
  var grid_dim = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];

  // Target Scores
  var target_scores = [3, 4, 5, 6, 7, 8];
  target_scores.push(...jsPsych.randomization.shuffleNoRepeats(jsPsych.randomization.repeat([3, 4, 5, 6, 7, 8],3)));

  // START OF BLOCK //
  for (var block_i = 0; block_i < nbBlocks; block_i++) {
    for (var trial_i = 0; trial_i < nbTperB; trial_i++) {

      // SE QUESTION //
      var SE_conf = {
        type: 'SE-confidence-slider',
        range: 30
      };

      // PUSH TO TIMELINE //
      timelineTask.push(SE_conf);


    //  var SE_conf_min = {
    //    type: 'html-button-response',
    //    stimulus: '<p></p>',
    //    choices: [ '1',  '2',  '3',  '4',  '5', '6', '7', '8', '9', '10',
    //              '11', '12', '13', '14', '15','16','17','18','19', '20',
    //              '21', '22', '23', '24', '25','26','27','28','29', '30'],
    //    prompt: 'What is the minimum number of flips you would need to achieve the target score?'
    //  };

    //  var SE_conf_max = {
    //    type: 'html-button-response',
    //    stimulus: '<p></p>',
    //    choices: [ '1',  '2',  '3',  '4',  '5', '6', '7', '8', '9', '10',
    //              '11', '12', '13', '14', '15','16','17','18','19', '20',
    //              '21', '22', '23', '24', '25','26','27','28','29', '30'],
    //    prompt: 'What is the maximum number of flips you would need to achieve the target score?'
    //  };

    //  // PUSH TO TIMELINE //
    //  timelineTask.push(SE_conf_min);
    //  timelineTask.push(SE_conf_max);

      // FLIP //
      var flip = {
        type: 'animation',
        stimuli: grid_stimuli[trial_counter],
        frame_time: 100,//time.flipSpeed,
        choices: jsPsych.NO_KEYS
      };

      // REWATCH QUESTION //
      var rewatch = {
        type: 'html-button-response',
        stimulus: '<p>Do you want to rewatch the stimuli?</p>',
        choices: ['Yes','No'],
        trial_duration: time.rewatch,
        on_finish: function(data){
          response = data.button_pressed;
          if (response == 0){
            flip_counter++;
          } else {
            jsPsych.data.get().addToLast({
              flips: flip_counter
            });
            flip_counter = 1;
          }
        }
      } // rewatch

      // LOOP THE FLIPS //
      var looping_chunk = {
        timeline: [flip, fullscreenExp, rewatch],
        loop_function: function(data){
          response = data.values()[2]["button_pressed"];
          if (response == 0){
            return true;
          } else {
            return false;
          };
        }
      }; // loop

      // PUSH TO TIMELINE //
      timelineTask.push(looping_chunk);

      // TESTING PHASE //
      for (var test_i = 0; test_i < numbersImg.length; test_i++) {

        var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
        var pair_2nd = 1 - pair_1st;

        var target_location  = grid_indexes_shuffled[trial_counter][test_i][pair_1st].map(function(v){return (v - 1)});
        var correct_location = grid_indexes_shuffled[trial_counter][test_i][pair_2nd].map(function(v){return (v - 1)});

        var test = {
          type: 'serial-reaction-time-mouse-WH',
          target_location: target_location,
          correct_location: correct_location,
          target_image: numbersImg[test_i],
          grid: grid_dim,
          grid_square_size: screen.height/6,
          response_ends_trial: false,
          trial_duration: 1,//time.responseSpeed,
          allow_nontarget_responses: true,
          pre_target_duration: 0
        };

        // PUSH TO TIMELINE //
        timelineTask.push(fullscreenExp);
        timelineTask.push(test);

      }; // test loop

      // CONFIDENCE QUESTION //

      var confidence = {
        type: 'html-button-response',
        stimulus: '<p></p>',
        choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
        prompt: "<p>How many pairs do you believe you correctly guessed?</p>"
      };

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(confidence);

      trial_counter++;

    }; // trial
  }; // block

  return timelineTask;

}
