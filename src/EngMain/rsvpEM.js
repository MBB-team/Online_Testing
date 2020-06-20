function rsvpEM(nbTrials){


  // INITIALISATION //
  var timelineTask = [];
  var trialCondition = jsPsych.randomization.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
  var trial_counter = -1;
  var optout = !false;
  var engage = true;
  var reward;
  var effort;
  var phase;
  var reward_display;
  var effort_display

  // START OF MAIN //
  for (var trial_i = 0; trial_i < nbTrials; trial_i++) {

    reward = conditions.reward[trialCondition[trial_i]]
    effort = conditions.effort[trialCondition[trial_i]]
    phase = conditions.phase[trialCondition[trial_i]]

    //    <p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p>
    switch (reward) {
      case 2:
      reward_display = 2;
      break;
      case 1:
      reward_display = 0.5;
      break;
    }

    switch (effort) {
      case 2:
      effort_display = 'Haut';
      break;
      case 1:
      effort_display = 'Bas';
      break;
    }

    // TRIAL NUMBER //
    var trial_number = {
      type: 'html-button-response-WH-EM',
      stimulus: '<p>C&#39est le de&#769but d&#39essai <b>'+(trial_i+1)+'</b>.</p><p>Bonus : <b>'+reward_display+' &euro;</b></p><p>Niveau d&#39effort : <b>'+effort_display+'</b></p>',
      choices: ['J&#39accepte', 'Je refuse'],
      post_trial_gap: 500,
      on_start: function(){
        optout = !false;
        trial_counter++;
      },
      on_finish: function(data){
        if (data.button_pressed == 0){engage = true;}
        if (data.button_pressed == 1){
          data.trial_result = 5; // did not engage
          engage = false;

        }
      }
    }; // trial number

    timelineTask.push(trial_number);

    // PREPARE //
    var prepare = {
      type: 'html-button-response-WH-EM',
      stimulus: "<p style='font-size: 50px'><b>Pre&#769parez-vous !</b></p>",
      trial_duration: 1000,
      choices: []
    };

    // CONDITION PREPARE //
    var prepare_conditional = {
      timeline: [prepare],
      conditional_function: function(){
        // if the participant opts out, we should skip all stimuli presentation
        return optout && engage;
      }
    };

    timelineTask.push(prepare_conditional);

    // INITIALISE INITAL SIDE //
    var tar_side_ini = randi(0,1); // 0 = left; 1 = right;
    var tar_side = tar_side_ini;
    var tar_arrow;

    // DISPLAY INITAL DIRECTION ARROW //
    switch (tar_side_ini) {
      case 0:
      tar_arrow = "<p style='font-size: 100px'><</p>"
      break;
      case 1:
      tar_arrow = "<p style='font-size: 100px'>></p>"
      break;
    }

    var initial_arrow = {
      type: 'html-button-response-WH-EM',
      stimulus: tar_arrow,
      choices: [],
      trial_duration: 500
    }

    // CONDITION THE ARROW //
    var initial_arrow_conditional = {
      timeline: [initial_arrow],
      conditional_function: function(){
        // if the participant opts out, we should skip all stimuli presentation
        return optout && engage;
      }
    };

    timelineTask.push(initial_arrow_conditional);

    // EXPLICIT OPT OUT QUESTION //
    var optout_q_index = [randi(7,22), randi(7,22)];

    var optout_q = {
      type: 'html-button-response-WH-EM',
      stimulus: "<p style='font-size: 50px'>Voulez-vous arre&#770ter cet essai ?</p>",
      choices: ['Oui'],
      button_html: '<button class="jspsych-btn" style:"font-size:30px">%choice%</button>',
      trial_duration: 4000,
      on_finish: function(data){
        if (data.button_pressed == 0){
          optout = !true;
          data.trial_result = 5 // opted out after being asked
        }
      }
    }

    // CONDITION OPTOUT QUESTION //
    var optout_q_conditional = {
      timeline: [optout_q],
      conditional_function: function(){
        // if the participant opts out, we should skip all stimuli presentation
        return optout && engage;
      }
    }

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

      // if a switch is in the first position, swap with the first target to match initial arrow
      if (target_order[0] == 3){
        target_order[target_order.indexOf(7)] = 3;
        target_order[0] = 7;
      }

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
          choices: [32, 13],
          trial_duration: time.stim_dur,
          response_ends_trial: false,
          target: tar_side,
          grid: [[0,3,0,0,0,3,0],[3,1,0,2,0,1,3],[0,3,0,0,0,3,0]],
          grid_square_size: 100,
          target_trial: target_trial,
          on_finish: function(data){
            // check to see if participant opted out
            if (data.correct == 5){
              optout = !true;
            }
          },
          data: {
            trialNb: trial_i,
            target_trial: target_trial
          }
        }; // show stim

        // CONDITION THE STIMULUS //
        var stim_optout = {
          timeline: [one_stim],
          conditional_function: function(){
            // if the participant opts out, we should skip all stimuli presentation
            return optout && engage;
          }
        };



        timelineTask.push(stim_optout);

        // PUSH TO TIMELINE IF AT CORRECT POINT (diff_step 3 and 7)
        if (diff_step == 2 && stim_i == optout_q_index[0]){

          // DISPLAY  DIRECTION ARROW //
          switch (tar_side) {
            case 0:
            tar_arrow = "<p style='font-size: 100px'><</p>"
            break;
            case 1:
            tar_arrow = "<p style='font-size: 100px'>></p>"
            break;
          }

          var post_q_arrow = {
            type: 'html-button-response-WH-EM',
            stimulus: tar_arrow,
            choices: [],
            trial_duration: 500
          }

          // CONDITION THE ARROW //
          var post_q_arrow_conditional = {
            timeline: [post_q_arrow],
            conditional_function: function(){
              // if the participant opts out, we should skip all stimuli presentation
              return optout && engage;
            }
          };

          timelineTask.push(optout_q_conditional);
          timelineTask.push(post_q_arrow_conditional)
        }

        if (diff_step == 6 && stim_i == optout_q_index[1]){

          // DISPLAY  DIRECTION ARROW //
          switch (tar_side) {
            case 0:
            tar_arrow = "<p style='font-size: 100px'><</p>"
            break;
            case 1:
            tar_arrow = "<p style='font-size: 100px'>></p>"
            break;
          }

          var post_q_arrow = {
            type: 'html-button-response-WH-EM',
            stimulus: tar_arrow,
            choices: [],
            trial_duration: 500
          }

          // CONDITION THE ARROW //
          var post_q_arrow_conditional = {
            timeline: [post_q_arrow],
            conditional_function: function(){
              // if the participant opts out, we should skip all stimuli presentation
              return optout && engage;
            }
          };

          timelineTask.push(optout_q_conditional);
          timelineTask.push(post_q_arrow_conditional)
        }

      } // for each displayed stimulus

      timelineTask.push(fullscreenExp);

    } // for each difficulty step

    // SHOW FEEDBACK //
    var feedback = {
      type: 'html-button-response-WH-EM',
      stimulus: '',
      choices: ['Continuer a&#768 la prochaine offre'],
      on_start: function(trial){
        var number_correct = jsPsych.data.get().filter({trialNb: trial_counter, correct: 1}).count();
        var number_FA = jsPsych.data.get().filter({trialNb: trial_counter, correct: 2}).count();
        trial.stimulus = '<p> Vous avez termine&#769 l&#39essai !</p><p>Re&#769ponses correct : <b>'+number_correct+'/32</b></p><p>Re&#769ponses incorrect : <b>'+number_FA+'</b></p>'
      },
      on_finish: function(data){
        if (number_correct >= exp.tar_threshold){
          data.trial_result = 1; // success
        };
        if (number_correct < exp.tar_threshold){
          data.trial_result = 2; // failure
        };
        if (number_FA > exp.FA_threshold){
          data.trial_result = 3; // too many false alarms
        }
      },
      data: {
        trialNb: trial_i,
        target_trial: target_trial
      }
    };

    // CONDITION THE FEEDBACK //
    var feedback_optout = {
      timeline: [feedback],
      conditional_function: function(){
        // if the participant opts out, we should skip all stimuli presentation
        return optout && engage;
      }
    };

    timelineTask.push(feedback_optout)

    // IF OPTED OUT //
    var opted_out = {
      type: 'html-button-response-WH-EM',
      stimulus: '<p>Vous avez choisi arre&#770ter cet essai</p>',
      choices: ['Continuer a&#768 la prochaine offre'],
      data: {
        trial_result: 4 // opted out! (yay)
      }
    };

    // CONDITION THE OPTOUT //
    var optedout_optout = {
      timeline: [opted_out],
      conditional_function: function(){
        // if the participant opts out, we should skip all stimuli presentation
        return !optout;
      }
    };

    timelineTask.push(optedout_optout)

  } // for each trial


  return timelineTask;
}
