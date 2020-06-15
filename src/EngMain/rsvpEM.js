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

    // FOR EACH DIFFICULTY STEP //
    for (var diff_step = 0; diff_step < 7; diff_step++){

      var tar_index = target_indexes[trialCondition[trial_i]][diff_step].map(function(v){return (v - 1)});
      var NofSwi = tar_index.length - 5;
      var target_pop = [7, 7, 7, 7, 7];
      target_pop.push(Array(NofSwi).fill([3]).flat());
      target_pop = target_pop.flat();
      var target_order = jsPsych.randomization.shuffle(target_pop); // shuffle targets/switches

      // generate string for target stream
      var tar_str = randstr(35).split('');

      // loop through and insert targets/switches into target string
      for (var tar_i = 0; tar_i < target_order.length-1; tar_i++){
        tar_str[tar_index[tar_i]] = target_order[tar_i];
      } // for each target/switch

      var distr_str = [];
      // Generate distraction streams
      for (var distr_str_i = 0; distr_str_i < 8; distr_str_i++){
        distr_str[distr_str_i] = randstr(35).split('');
      } // generate distraction strings


      // FOR EACH DISPLAYED STIMULUS //
      for (var stim_i = 0; stim_i < tar_str.length-1; stim_i++){

        // SHOW STIMULUS //
        var one_stim = {
          type: 'html-keyboard-response-WH-EM',
          stimulus: [tar_str[stim_i], distr_str[0][stim_i], distr_str[1][stim_i], distr_str[2][stim_i], distr_str[3][stim_i], distr_str[4][stim_i], distr_str[5][stim_i], distr_str[6][stim_i], distr_str[7][stim_i]],
          choices: [32],
          trial_duration: time.stim_dur,
          response_ends_trial: false,
          target: [0],
          grid: [[0,3,0,3,0],[3,1,2,1,3],[0,3,0,3,0]],
          grid_square_size: 100
        }; // show stim

      timelineTask.push(one_stim);

      } // for each displayed stimulus
    } // for each difficulty step


  }


  return timelineTask;
}
