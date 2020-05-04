function SE(nbBlocks, nbTrials){

  // INITIALISATION //
  var timelineTask  = [];
  var trial_counter = 0;
  var flip_counter  = 1;
  var conf_counter  = 0;
  var nbTperB       = nbTrials/nbBlocks;
  var grid_dim = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];

  // Target Scores
  var target_scores = [3, 4, 5, 6, 7, 8];
  var target_scores_all = (jsPsych.randomization.shuffleNoRepeats(jsPsych.randomization.repeat(target_scores,3)));

  target_scores_all.unshift(...target_scores);

  // No test trials
  var conf_trials_idx = Array(6);
  var conf_trials_TS = jsPsych.randomization.repeat(target_scores, 1);
  for (var i = 0; i < conf_trials_idx.length; i++) {
    var ii = randi(2,5) + i*5
    conf_trials_idx[i] = ii-1; // index of location to insert conf trial
    target_scores_all.splice(conf_trials_idx[i], 0, conf_trials_TS[i]);
  };

  // START OF BLOCK //
  for (var block_i = 0; block_i < nbBlocks; block_i++) {
    var block_n = block_i + 1;

    // BLOCK NUMBER //
    var block_number = {
      type: 'html-button-response',
      stimulus: '<p>This is the beginning of block <b>'+block_n+'</b>.</p><p>When you are ready to start, click on the button.</p>',
      choices: ['Start']
    }; // block number

    timelineTask.push(block_number)

    // TRIAL LOOP //
    for (var trial_i = 0; trial_i < nbTperB; trial_i++) {

      var trial_n = trial_i + 1;

      // TRIAL NUMBER and TARGET SCORE //
      var trial_number = {
        type: 'html-button-response',
        stimulus: '<p>This is the beginning of trial <b>'+trial_n+'</b> of block <b><p>'+block_n+'</b>.</p></p><p>Your target score for this trial is <b>'+target_scores_all[trial_counter]+'.</b></p><p>When you are ready to start, click on the button.</p>',
        choices: ['Start']
      }; // trial number

      timelineTask.push(trial_number)

      // SE QUESTION //
      var SE_conf = {
        type: 'SE-confidence-slider',
        range: 30,
        prompt: '<p>Position the slider across the interval of flips you think it might take you to achieve the target score. Press Enter to confirm your choice.</p>'
      };

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(SE_conf);

      // FLIP //
      var flip = {
        type: 'animation-WH',
        stimuli: grid_stimuli[trial_counter],
        frame_time: 100,//time.flipSpeed,
        choices: jsPsych.NO_KEYS
      };

      // REWATCH QUESTION //
      var rewatch = {
        type: 'html-button-response',
        stimulus: '<p>Do you want to rewatch the stimuli?</p><p>The target score for this trial is: <b>'+target_scores_all[trial_counter]+'</b>.',
        prompt: function(){
          var rewatch_prompt = '<p>You have seen the stimuli <b>'+flip_counter+'</b> times.';
          return rewatch_prompt;},
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

        // IF CONF OR TESTING //
        if (trial_counter == conf_trials_idx[conf_counter]){

          var test_conf = {
            type: 'html-slider-response',
            stimulus:'<p>How confident are you that you would have achieved the target score of <b> '+target_scores_all[trial_counter]+'</b>?<p>-100% means completely sure <b>to not have</b> achieved it and +100% means completely sure <b>to have</b> achieved it.',
            labels: ['-100%','0%','100%'],
            min: -100,
            max: 100,
            start: function(){return randi(-100,100);},
            require_movement: true
          };

          // PUSH TO TIMELINE //
          timelineTask.push(fullscreenExp);
          timelineTask.push(test_conf);

        } else {

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

        } // conf or test loop

        trial_counter++;

      }; // trial
    }; // block

    return timelineTask;

  }
