function rsvpEM_train_V2(nbTrials_train){

  // INITIALISATION //
  var timelineTask_train = [];
  var effort_train = [1, 2, 1, 2];
  var trial_counter_train = -1;
  var effort_display_train;
  var number_correct_train;
  var number_FA_train;
  var grid_square_size = 100;
  var grid_layout = [[0,3,0,0,0,3,0],[3,1,0,2,0,1,3],[0,3,0,0,0,3,0]];

  var rsvpEMHTML_train = rsvpEMStimuli(grid_layout,grid_square_size);

  // START OF TRAIN //

  for (var trial_i_train = 0; trial_i_train < nbTrials_train; trial_i_train++){

    var rsvpEMstring_train = rsvpEMstrings(target_indexes_train[trial_i_train], exp.nbTar, exp.nbStim);

    // Flatten stimuli string
    var rsvpEMstring_train_flat = [];
    for (var str_i = 0; str_i < 9; str_i++){
      rsvpEMstring_train_flat[str_i] = rsvpEMstring_train[str_i].flat();
    }

    switch (effort_train[trial_i_train]) {
      case 2:
      effort_display_train = 'Difficile';
      break;
      case 1:
      effort_display_train = 'Facile';
      break;
    }

    var trial_number_train = {
      type: 'html-button-response-WH-EM-V2',
      stimulus: '<p>Session d&#39entrai&#770nement nume&#769ro : <b>'+(trial_i_train+1)+'/4</b></p><p>Mode de difficulte&#769 : <b>'+effort_display_train+'</b></p>',
      choices: ['C&#39est parti !'],
      post_trial_gap: 500,
      on_start: function(){
        trial_counter_train++;
      },
      data: {
        trialNb: trial_i_train,
        trial_result: 999,
        test_part: 'train_number',
        trial_condition: effort_train[trial_i_train],
        training: 1,
      }
    } // trial number

    timelineTask_train.push(trial_number_train);

    // PREPARE //
    var prepare_train = {
      type: 'html-button-response-WH-EM-V2',
      stimulus: "<p style='font-size: 50px'><b>Pre&#769parez-vous !</b></p>",
      trial_duration: 1000,
      choices: [],
      data: {
        trialNb: trial_i_train,
        trial_result: 999,
        test_part: 'prepare_train',
        trial_condition: effort_train[trial_i_train],
        training: 1,
      }
    } // prepare

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
      type: 'html-button-response-WH-EM-V2',
      stimulus: tar_arrow_train,
      choices: [],
      trial_duration: 500,
      data: {
        trialNb: trial_i_train,
        trial_result: 999,
        test_part: 'initial_arrow_train',
        trial_condition: effort_train[trial_i_train],
        training: 1,
      }
    } // initial arrow

    timelineTask_train.push(initial_arrow_train);


    // SHOW STIMULUS //
    var one_stim_train = {
      type: 'html-keyboard-response-WH-EM-V2',
      html_string: rsvpEMHTML_train,
      stimulus: rsvpEMstring_train_flat,
      choices: [32],
      trial_duration: time.stim_dur,
      target: tar_side_train,
      difficulty: effort_train[trial_i_train],
      main: 0,
      optout_question_index: [300, 300],
      on_finish: function(data){
        number_correct_train = (jsPsych.data.get().last().values()[0].pt_cor_responses).filter(e => e != null).length;
        number_FA_train = (jsPsych.data.get().last().values()[0]).FA.length;

        data.pt_cor_responses = JSON.stringify(data.pt_cor_responses);
        data.FA               = JSON.stringify(data.FA);
      },
      data: {
        trialNb: trial_i_train,
        test_part: 'one_stim_train',
        trial_condition: effort_train[trial_i_train],
        training: 1,
      }
    } // one stim

    timelineTask_train.push(one_stim_train);

    // SHOW FEEDBACK //
    var feedback_train = {
      type: 'html-button-response-WH-EM-V2',
      stimulus: '',
      choices: ['Continuer a&#768 la prochaine session d&#39entrai&#770nement'],
      on_start: function(trial){
        trial.stimulus = '<p>Vous avez termine&#769 cette session d&#39entrai&#770nement !</p><p>Re&#769ponses correct : <b>'+number_correct_train+'/32</b></p><p>Re&#769ponses incorrect : <b>'+number_FA_train+'</b></p>';

        if (number_correct_train >= exp.tar_threshold && number_FA_train <= exp.FA_threshold){
          trial.stimulus += '<p>Si c&#39e&#769tait l&#39expe&#769rience principale, vous auriez gagne&#769 le bonus de cet exercice !</p>';
        } else if (number_correct_train < exp.tar_threshold) {
          trial.stimulus += '<p>Si c&#39e&#769tait l&#39expe&#769rience principale, vous auriez pas gagne&#769 le bonus de cet exercice parce que vous avez rate&#769 trop de cibles</p>';
        } else if (number_correct_train >= exp.tar_threshold && number_FA_train > exp.FA_threshold) {
          trial.stimulus += '<p>Si c&#39e&#769tait l&#39expe&#769rience principale, vous auriez pas gagne&#769 le bonus de cet exercice parce que vous avez fait trop de re&#769ponses incorrectes</p>';
        }
      },
      data: {
        trialNb: trial_i_train,
        trial_result: 999,
        test_part: 'feedback_train',
        trial_condition: effort_train[trial_i_train],
        training: 1,
      }
    } // feedback

    timelineTask_train.push(feedback_train);

  } // end of train

  var finish_train = {
    type: 'html-button-response-WH-EM-V2',
    stimulus: '<p><b>Bravo !</b> L&#39entrai&#770nement est maintenant termine&#769.</p><p>Vous allez maintenant commencer le test.</p><p>Votre performance dans cette phase sera prise en compte pour votre bonus financier.</p><p>Cliquez sur le bouton ci-dessous pour voir votre premie&#768re proposition d&#39engagement.</p>',
    choices: ['Continuer'],
    data: {
      trialNb: trial_i_train,
      trial_result: 999,
      test_part: 'finish_train',
      trial_condition: effort_train[trial_i_train],
      training: 1,
    }
  }

  timelineTask_train.push(finish_train);


  return timelineTask_train;

}
