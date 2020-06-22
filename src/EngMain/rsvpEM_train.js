function rsvpEM_train(nbTrials_train){

  // INITIALISATION //
  var timelineTask_train = [];
  var effort_train = [1, 2, 1, 2];
  var trial_counter_train = -1;
  var effort_display_train;
  var target_trial_train;

  // START OF TRAIN //
  for (var trial_i_train = 0; trial_i_train < nbTrials_train; trial_i_train++){

    switch (effort_train[trial_i_train]) {
      case 2:
      effort_display = 'Haut';
      break;
      case 1:
      effort_display = 'Bas';
      break;
    }

    var trial_number_train = {
      type: 'html-button-response-WH-EM',
      stimulus: '<p>Session d&#39entrai&#770nement nume&#769ro : <b>'+(trial_i_train+1)+'/4</b></p><p>Niveau d&#39effort : <b>'+effort_display+'</b></p>',
      choices: ['C&#39est parti !'],
      post_trial_gap: 500,
      on_start: function(){
        trial_counter_train++;
      }
    }; // trial number

    timelineTask_train.push(trial_number_train);

    // PREPARE //
    var prepare_train = {
      type: 'html-button-response-WH-EM',
      stimulus: "<p style='font-size: 50px'><b>Pre&#769parez-vous !</b></p>",
      trial_duration: 1000,
      choices: []
    };

    timelineTask_train.push(prepare_train);

    // INITIALISE INITAL SIDE //
    var tar_side_ini_train = randi(0,1); // 0 = left; 1 = right;
    var tar_side_train = tar_side_ini_train;
    var tar_arrow_train;

    // DISPLAY INITAL DIRECTION ARROW //
    switch (tar_side_ini_train) {
      case 0:
      tar_arrow_train = "<p style='font-size: 100px'><</p>"
      break;
      case 1:
      tar_arrow_train = "<p style='font-size: 100px'>></p>"
      break;
    }

    var initial_arrow_train = {
      type: 'html-button-response-WH-EM',
      stimulus: tar_arrow_train,
      choices: [],
      trial_duration: 500
    }

    timelineTask_train.push(initial_arrow_train);

    // FOR EACH DIFFICULTY STEP //
    for (var diff_step_train = 0; diff_step_train < 8; diff_step_train++){

      var target_counter_train = 0

      var tar_index_train = target_indexes_train[trial_i_train][diff_step_train].map(function(v){return (v - 1)});

      var NofSwi = tar_index_train.length - exp.nbTar;
      var target_pop_train = Array(exp.nbTar).fill([7]).flat();
      target_pop_train.push(Array(NofSwi).fill([3]).flat());
      target_pop_train = target_pop_train.flat();
      var target_order_train = jsPsych.randomization.shuffle(target_pop_train); // shuffle targets/switches

      // if a target is in the last position, swap with the ultimate switch to avoid keyboard resposne issues at end of trial (not long enough response window)
      if (target_order_train[target_order_train.length - 1] == 7){
        target_order_train[target_order_train.lastIndexOf(3)] = 7;
        target_order_train[target_order_train.length - 1] = 3;
      };

      // if a switch is in the first position, swap with the first target to match initial arrow
      if (target_order_train[0] == 3){
        target_order_train[target_order_train.indexOf(7)] = 3;
        target_order_train[0] = 7;
      }

      // generate string for target/switch streams
      var tar_str_train = randstr(exp.nbStim).split('');
      var swi_str_train = randstr(exp.nbStim).split('');

      // loop through and insert targets/switches into strings
      for (var tar_i_train = 0; tar_i_train < target_order_train.length; tar_i_train++){
        if (target_order_train[tar_i_train] == 7){
          tar_str_train[tar_index_train[tar_i_train]] = target_order_train[tar_i_train];
        } else {
          swi_str_train[tar_index_train[tar_i_train]] = target_order_train[tar_i_train];
        };
      }; // for each target/switch

      var distr_str_train = [];
      // Generate distraction streams
      for (var distr_str_i_train = 0; distr_str_i_train < 7; distr_str_i_train++){
        distr_str_train[distr_str_i_train] = randstr(exp.nbStim).split('');
      }; // generate distraction strings

      // Target stimuli indexes
      var index_of_7_train = getAllIndexes(tar_str_train, 7);

      // Target stimuli indexes plus the following 2 (350*3 ms response window)
      var target_stim_index_train = [[index_of_7_train[0],index_of_7_train[0]+1,index_of_7_train[0]+2],
      [index_of_7_train[1],index_of_7_train[1]+1,index_of_7_train[1]+2],
      [index_of_7_train[2],index_of_7_train[2]+1,index_of_7_train[2]+2],
      [index_of_7_train[3],index_of_7_train[3]+1,index_of_7_train[3]+2]];

      // FOR EACH DISPLAYED STIMULUS //
      for (var stim_i_train = 0; stim_i_train < tar_str_train.length; stim_i_train++){

        if (swi_str_train[stim_i_train] == 3){
          tar_side_train = 1 - tar_side_train;
          if (effort_train = 1){ // change from 3 to arrows if difficulty is low
            if (tar_side_train == 1){
              swi_str_train[stim_i_train] = '>';
            } else {
              swi_str_train[stim_i_train] = '<';
            }
          }
        };

        // if the stim_index corresponds to response window, pass true and the index of the target to the plugin
        if (target_stim_index_train.flat().some(e => e == stim_i_train)){
          target_trial_train = [true, stim_i_train - target_stim_index_train[target_counter_train][0]];
          if (stim_i_train == target_stim_index_train[target_counter_train][2]){
            if(target_counter_train != 3){target_counter_train++};
          };
        } else {
          target_trial_train = [false, null];
        };

        // SHOW STIMULUS //
        var one_stim_train = {
          type: 'html-keyboard-response-WH-EM',
          stimulus: [tar_str_train[stim_i_train], swi_str_train[stim_i_train], distr_str_train[0][stim_i_train], distr_str_train[1][stim_i_train], distr_str_train[2][stim_i_train], distr_str_train[3][stim_i_train], distr_str_train[4][stim_i_train], distr_str_train[5][stim_i_train], distr_str_train[6][stim_i_train]],
          choices: [32],
          trial_duration: time.stim_dur,
          response_ends_trial: false,
          target: tar_side_train,
          grid: [[0,3,0,0,0,3,0],[3,1,0,2,0,1,3],[0,3,0,0,0,3,0]],
          grid_square_size: 100,
          target_trial: target_trial_train,
          data: {
            trialNb: trial_i_train,
            target_trial: target_trial_train
          }
        }; // show stim

        timelineTask_train.push(one_stim_train);




      } // end each displayed stimulus



    } // end of diff step

    timelineTask_train.push(fullscreenExp);

    // SHOW FEEDBACK //
    var feedback_train = {
      type: 'html-button-response-WH-EM',
      stimulus: '',
      choices: ['Continuer a&#768 la prochaine session d&#39entrai&#770nement'],
      on_start: function(trial){
        var number_correct_train = jsPsych.data.get().filter({trialNb: trial_counter_train, correct: 1}).count();
        var number_FA_train = jsPsych.data.get().filter({trialNb: trial_counter_train, correct: 2}).count();
        trial.stimulus = '<p>Vous avez termine&#769 cette session d&#39entrai&#770nement !</p><p>Re&#769ponses correct : <b>'+number_correct_train+'/32</b></p><p>Re&#769ponses incorrect : <b>'+number_FA_train+'</b></p>';
      },
      on_finish: function(data){
        if (number_correct_train >= exp.tar_threshold){
          data.trial_result = 1; // success
        };
        if (number_correct_train < exp.tar_threshold){
          data.trial_result = 2; // failure
        };
        if (number_FA_train > exp.FA_threshold){
          data.trial_result = 3; // too many false alarms
        }
      },
      data: {
        trialNb: trial_i_train,
        target_trial: target_trial_train
      }
    } // feedback

    timelineTask_train.push(feedback_train);

  } // end of train

  var finish_train = {
    type: 'html-button-response-WH-EM',
    stimulus: '<p><b>Bravo ! </b>Vous avez re&#769ussi toutes les sessions d&#39entrai&#770nement !</p><p>La suite principale va de&#769sormais commencer. Cliquez sur le bouton ci-dessous pour voir votre premie&#768re proposition d&#39 engagement.</p>',
    choices: ['Continuer']
  }

  timelineTask_train.push(finish_train);





  return timelineTask_train;

}