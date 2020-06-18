function rsvpEM(nbTrials){


  // INITIALISATION //
  var timelineTask = [];
  var trialCondition = jsPsych.randomization.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])

  // START OF MAIN //
  for (var trial_i = 0; trial_i < nbTrials; trial_i++) {

    // TRIAL NUMBER //
    var trial_number = {
      type: 'html-button-response-WH-EM',
      stimulus: '<p>C&#39est le de&#769but d&#39essai <b>'+(trial_i+1)+'</b>.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p> ',
      choices: ['C&#39est parti !']
    }; // trial number

    timelineTask.push(trial_number);

    // INITIALISE INITAL SIDE //
    var tar_side_ini = randi(0,1); // 0 = left; 1 = right;
    var tar_side = tar_side_ini;

    // FOR EACH DIFFICULTY STEP //
    for (var diff_step = 0; diff_step < 8; diff_step++){

      var target_counter = 0; // counting the number of targets seen

      var tar_index = target_indexes[trialCondition[trial_i]][diff_step].map(function(v){return (v - 1)});
      var NofSwi = tar_index.length - exp.nbTar;
      var target_pop = Array(exp.nbTar).fill([7]).flat();
      target_pop.push(Array(NofSwi).fill([3]).flat());
      target_pop = target_pop.flat();
      var target_order = jsPsych.randomization.shuffle(target_pop); // shuffle targets/switches

      // if a target is in the last position, swap with the ultimate switch to avoid keyboard resposne issues at end of trial (not long enough response window)
      if (target_order[target_order.length - 1] == 7){
        target_order[target_order.lastIndexOf(3)] = 7;
        target_order[target_order.length - 1] = 3;
      };

      // generate string for target/switch streams
      var tar_str = randstr(exp.nbStim).split('');
      var swi_str = randstr(exp.nbStim).split('');

      // loop through and insert targets/switches into strings
      for (var tar_i = 0; tar_i < target_order.length; tar_i++){
        if (target_order[tar_i] == 7){
          tar_str[tar_index[tar_i]] = target_order[tar_i];
        } else {
          swi_str[tar_index[tar_i]] = target_order[tar_i];
        };
      }; // for each target/switch

      var distr_str = [];
      // Generate distraction streams
      for (var distr_str_i = 0; distr_str_i < 7; distr_str_i++){
        distr_str[distr_str_i] = randstr(exp.nbStim).split('');
      }; // generate distraction strings

      // Target stimuli indexes
      var index_of_7 = getAllIndexes(tar_str, 7);

      // Target stimuli indexes plus the following 2 (350*3 ms response window)
      var target_stim_index = [[index_of_7[0],index_of_7[0]+1,index_of_7[0]+2],
                               [index_of_7[1],index_of_7[1]+1,index_of_7[1]+2],
                               [index_of_7[2],index_of_7[2]+1,index_of_7[2]+2],
                               [index_of_7[3],index_of_7[3]+1,index_of_7[3]+2]];

      // FOR EACH DISPLAYED STIMULUS //
      for (var stim_i = 0; stim_i < tar_str.length; stim_i++){

        if (swi_str[stim_i] == 3){tar_side = 1 - tar_side;};

        // if the stim_index corresponds to response window, pass true and the index of the target to the plugin
        if (target_stim_index.flat().some(e => e == stim_i)){
          target_trial = [true, stim_i - target_stim_index[target_counter][0]];
          if (stim_i == target_stim_index[target_counter][2]){
            if(target_counter != 3){target_counter++};
          };
        } else {
          target_trial = [false, null];
        };

        // SHOW STIMULUS //
        var one_stim = {
          type: 'html-keyboard-response-WH-EM',
          stimulus: [tar_str[stim_i], swi_str[stim_i], distr_str[0][stim_i], distr_str[1][stim_i], distr_str[2][stim_i], distr_str[3][stim_i], distr_str[4][stim_i], distr_str[5][stim_i], distr_str[6][stim_i]],
          choices: [32],
          trial_duration: time.stim_dur,
          response_ends_trial: false,
          target: tar_side,
          grid: [[0,3,0,3,0],[3,1,2,1,3],[0,3,0,3,0]],
          grid_square_size: 100,
          target_trial: target_trial,
          on_finish: function(data){
            // check to see if participant correctly responded in the  trial
          //  var data = jsPsych.data.getLastTrialData().values()[0];
          if (data.correct == 1){
            console.log(jsPsych.data.get().values());}
          }
        }; // show stim

      timelineTask.push(one_stim);

      } // for each displayed stimulus

      timelineTask.push(fullscreenExp);

    } // for each difficulty step


  }


  return timelineTask;
}
