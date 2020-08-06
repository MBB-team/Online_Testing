function rsvpEM_V2(nbTrials){

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
  var effort_display;
  var trial_end_time;
  var trial_remaining_time;
  var number_correct;
  var number_FA;
  var grid_square_size = 100;
  var grid_layout = [[0,3,0,0,0,3,0],[3,1,0,2,0,1,3],[0,3,0,0,0,3,0]];

  var rsvpEMHTML = rsvpEMStimuli(grid_layout,grid_square_size);

  // START OF MAIN //
  for (var trial_i = 0; trial_i < nbTrials; trial_i++){

    reward = conditions.reward[trialCondition[trial_i]]
    effort = conditions.effort[trialCondition[trial_i]]
    phase = conditions.phase[trialCondition[trial_i]]


    var rsvpEMstring = rsvpEMstrings(target_indexes_main[trialCondition[trial_i]], exp.nbTar, exp.nbStim);

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
      effort_display = 'Difficile';
      break;
      case 1:
      effort_display = 'Facile';
      break;
    }

    // TRIAL NUMBER //
    var trial_number = {
      type: 'html-button-response-WH-EM-V2',
      stimulus: '<p>C&#39est le de&#769but d&#39exercice <b>'+(trial_i+1)+'/'+exp.nbTrials+'</b>.</p><p>Bonus : <b>'+reward_display+' &euro;</b></p><p>Mode de difficulte&#769 : <b>'+effort_display+'</b></p>',
      choices: ['J&#39accepte', 'Je refuse'],
      post_trial_gap: 500,
      on_start: function(){
        optout = !false;
        trial_counter++;
      },
      on_finish: function(data){
        trial_end_time = Date.now() + 80000;
        if (data.button_pressed == 0){engage = true;}
        if (data.button_pressed == 1){
          data.trial_result = 5; // did not engage
          engage = false;
        }
      },
      data: {
        trialNb: trial_i,
        trial_result: 999,
        test_part: 'offer',
        trial_condition: trialCondition[trial_i],
        training: 0,
      }
    }; // trial number

    timelineTask.push(trial_number);

    // WAIT SCREEN //
    var wait_screen = {
      type: 'html-button-response-WH-EM-V2',
      stimulus: '<p>Vous avez re&#769fuse&#769 l&#39offre</p><p>Nous allons vous proposer la prochaine offre dans <b>80 secondes</b></p>',
      trial_duration: 80000,
      choices: [],
      data: {
        trialNb: trial_i,
        trial_result: 999,
        test_part: 'wait_screen',
        trial_condition: trialCondition[trial_i],
        training: 0,
      }
    }; // wait screen

    // CONDITION THE WAIT SCREEN //
    var wait_conditional = {
      timeline: [wait_screen],
      conditional_function: function(){
        // if the participant opts out, we should skip all stimuli presentation
        return optout && !engage;
      }
    };

    timelineTask.push(wait_conditional);

    // PREPARE //
    var prepare = {
      type: 'html-button-response-WH-EM-V2',
      stimulus: "<p style='font-size: 50px'><b>Pre&#769parez-vous !</b></p>",
      trial_duration: 1000,
      choices: [],
      data: {
        trialNb: trial_i,
        trial_result: 999,
        test_part: 'prepare',
        trial_condition: trialCondition[trial_i],
        training: 0,
      }
    }; // prepare

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
    };

    var initial_arrow = {
      type: 'html-button-response-WH-EM-V2',
      stimulus: tar_arrow,
      choices: [],
      trial_duration: 500,
      data: {
        trialNb: trial_i,
        trial_result: 999,
        test_part: 'initial_arrow',
        trial_condition: trialCondition[trial_i],
        training: 0,
      }
    }; // initial arrow

    // CONDITION THE ARROW //
    var initial_arrow_conditional = {
      timeline: [initial_arrow],
      conditional_function: function(){
        // if the participant opts out, we should skip all stimuli presentation
        return optout && engage;
      }
    };

    timelineTask.push(initial_arrow_conditional);

    // EXPLICIT OUT OUT QUESTION //
    var index_of_7 = [getAllIndexes(rsvpEMstring[0][2],7), getAllIndexes(rsvpEMstring[0][6],7)]
    index_of_7[0] = index_of_7[0].map(v => v + 2*exp.nbStim);
    index_of_7[1] = index_of_7[1].map(v => v + 6*exp.nbStim);

    var max_spacing_i = []; // calculate index of max spacing between targets
    max_spacing_i[0] = index_of_7[0].map((n, i, a) => i ? n - a[i-1] : 0 - n).indexOf(Math.max(...index_of_7[0].map((n, i, a) => i ? n - a[i-1] : 0 - n)));
    max_spacing_i[1] = index_of_7[1].map((n, i, a) => i ? n - a[i-1] : 0 - n).indexOf(Math.max(...index_of_7[1].map((n, i, a) => i ? n - a[i-1] : 0 - n)));

    var optout_q_index = []; // calculate mid-point between target indexes to insert optout questions
    optout_q_index[0] = Math.floor((index_of_7[0][max_spacing_i[0]] + index_of_7[0][max_spacing_i[0] - 1])/2);
    optout_q_index[1] = Math.floor((index_of_7[1][max_spacing_i[1]] + index_of_7[1][max_spacing_i[1] - 1])/2);

    // Flatten stimuli string
    var rsvpEMstring_flat = [];
    for (var str_i = 0; str_i < 9; str_i++){
      rsvpEMstring_flat[str_i] = rsvpEMstring[str_i].flat();
    }


    // SHOW STIMULUS //
    var one_stim = {
      type: 'html-keyboard-response-WH-EM-V2',
      html_string: rsvpEMHTML,
      stimulus: rsvpEMstring_flat,
      choices: [32, 13],
      trial_duration: time.stim_dur,
      target: tar_side,
      prompt: '<p style="font-size: 30">Vous pouvez choisir d&#39arre&#770ter cet exercice a&#768 n&#39importe quel moment <b>en appuyant la touche << Entre&#769e >> </b>!',
      optout_question_index: optout_q_index,
      difficulty: effort,
      on_finish: function(data){
        number_correct = (jsPsych.data.get().last().values()[0].pt_cor_responses).filter(e => e != null).length;
        number_FA = (jsPsych.data.get().last().values()[0]).FA.length;

        data.pt_cor_responses = JSON.stringify(data.pt_cor_responses);
        data.FA               = JSON.stringify(data.FA);

        // check to see if participant opted out
        if (data.trial_result == 5){
          optout = !true;
        }
      },
      data: {
        trialNb: trial_i,
        test_part: 'one_stim',
        trial_condition: trialCondition[trial_i],
        training: 0,
      }
    } // one stim

    // CONDITION THE STIMULUS //
    var stim_optout = {
      timeline: [one_stim],
      conditional_function: function(){
        // if the participant opts out, we should skip all stimuli presentation
        return optout && engage;
      }
    };

    timelineTask.push(stim_optout);

    // SHOW FEEDBACK //
    var feedback = {
      type: 'html-button-response-WH-EM-V2',
      stimulus: '',
      choices: ['Continuer a&#768 la prochaine offre'],
      on_start: function(trial){
        trial.stimulus = '<p>Vous avez termine&#769 l&#39exercice !</p><p>Re&#769ponses correct : <b>'+number_correct+'/32</b></p><p>Re&#769ponses incorrect : <b>'+number_FA+'</b></p>';

        if (number_correct >= exp.tar_threshold && number_FA <= exp.FA_threshold){
          trial.stimulus += '<p>Vous avez gagne&#769 le bonus de cet exercice !</p>';
        } else if (number_correct < exp.tar_threshold) {
          trial.stimulus += '<p>Vous avez pas gagne&#769 le bonus de cet exercice parce que vous avez rate&#769 trop de cibles</p>';
        } else if (number_correct >= exp.tar_threshold && number_FA > exp.FA_threshold) {
          trial.stimulus += '<p>Vous avez pas gagne&#769 le bonus de cet exercice parce que vous avez fait trop de re&#769ponses incorrectes</p>';
        }
      },
      data: {
        trialNb: trial_i,
        trial_result: 999,
        test_part: 'feedback',
        trial_condition: trialCondition[trial_i],
        training: 0,
      }
    } // feedback

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
      type: 'html-button-response-WH-EM-V2',
      stimulus: '',
      choices: [],
      on_start: function(trial){
        trial_remaining_time = trial_end_time - Date.now();
        trial.stimulus = '<p>Vous avez choisi d&#39arre&#770ter cet exercice</p><p>Nous allons vous proposer la prochaine offre dans: <b>'+Math.round(trial_remaining_time/1000)+' secondes</b></p>';
        trial.trial_duration = trial_remaining_time;
      },
      data: {
        trialNb: trial_i,
        trial_result: 999,
        test_part: 'opted_out',
        trial_condition: trialCondition[trial_i],
        training: 0,
      }
    }; // opted_out

    // CONDITION THE OPTOUT //
    var optedout_optout = {
      timeline: [opted_out],
      conditional_function: function(){
        // if the participant opts out, we should skip all stimuli presentation
        return !optout;
      }
    };

    timelineTask.push(optedout_optout)

  } // end of trial

  var finish = {
    type: 'html-button-response-WH-EM-V2',
    stimulus: '<p>Le test de charge mentale est maintenant termine&#769.</p><p><b>Merci beaucoup !</b></p>',
    choices: ['Fin'],
    data: {
      trialNb: trial_i,
      trial_result: 999,
      test_part: 'finish',
      trial_condition: trialCondition[trial_i],
      training: 0,
    }
  } // finish

  timelineTask.push(finish);

  return timelineTask;

};
