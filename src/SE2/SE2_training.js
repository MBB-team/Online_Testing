function SE2_training(){

  // INITIALISATION //
  var timelineTask_train  = [];
  var nCorrect_train      = 0; // the number of correct responses given by the pts
  var correct_i_train     = [0,0,0,0,0,0,0,0,0,0]; // array of correct response indexes
  var test_counter_train  = 0; // counter for looping through test trials during execution
  var clicked_i_train     = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the participants click
  var flib_fb_train       = []; // flip length of time for feedback
  var train_TS            = 4;
  var train_rew           = 1;
  var target_i_train      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
  var target_corr_i_train = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the correct image
  var grid_dim_train      = exp.grid;
  var points_total_train  = 0;

  // First instructions
  var instructions0 = {
    type: 'html-button-response-WH',
    stimulus: '<p style="font-size:70px">Test de métacognition</p><p style="font-size:50px">Veuillez lire attentivement les instructions qui vont suivre.</p>',
    choices: ['Ok'],
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'instructions',
      nTS: 999
    }
  }

  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(instructions0);

  var instructions1 = {
    type: 'html-button-response-WH',
    stimulus: [instrImg_html[0]],
    choices: ['Ok'],
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'instructions',
      nTS: 999
    }
  }

  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(instructions1);

  var instructions2 = {
    type: 'html-button-response-WH',
    stimulus: [instrImg_html[1]],
    choices: ['Ok'],
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'instructions',
      nTS: 999
    }
  }

  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(instructions2);

  // How much "effort" does the participant want?
  var effort_want_train = {
    type: 'html-slider-response-effort-want-WH',
    prompt: '<p>Exercice d&#39entra&icirc;nement.</p><p>Votre objectif est de mémoriser <b>'+train_TS+' paires de chiffres</b>.</p><p>Si vous atteignez cet objectif, vous recevrez un bonus de <b>'+train_rew+' point</b>.</p><div><br></div>',
    // prompt: '<p>Exercice d&#39entra&icirc;nement.</p><p></p><p>Si vous retrouvez correctement les emplacements de toutes les paires, vous recevrez un bonus de <br><b>'+train_rew+' point</b>.</p><div><br></div>',
    stimulus:'<p>Pendant combien de temps souhaitez-vous voir la grille ?</p>',
    labels: [''],
    min: exp.eff[0],
    max: exp.eff[1],
    start: function(){return randi(exp.eff[0],exp.eff[1]);},
    require_movement: true,
    effort: true,
    on_finish: function(data){
      flip_fb_train = data.conf_response;
    },
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: train_TS,
      reward: train_rew,
      test_part: 'effort_want_train',
      nTS: 999
    }
  }; // effort want

  // PUSH TO TIMELINE //
  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(effort_want_train);

  // instructions2
  var instructions3 = {
    type: 'html-button-response-WH',
    stimulus: [instrImg_html[2]],
    choices: ['Ok'],
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'instructions',
      nTS: 999
    }
  }

  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(instructions3);

  var effort_phase = {
    type: 'html-button-response-WH',
    stimulus: '<p><b>Tenez-vous pre&#770t.e !</b></p>',
    choices: [],
    trial_duration: time.fixation,
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: train_TS,
      reward: train_rew,
      test_part: 'fixation',
      nTS: 999
    }
  }; // fixation

  // PUSH TO TIMELINE //
  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(effort_phase);

  // effort //
  var flip_train = {
    type: 'html-button-response-effort-WH',
    stimulus: [grid_stimuli_train],
    choices: [],
    trial_duration: function(){return flip_fb_train*1000;},
    reward: train_rew,
    timer: false,
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: train_TS,
      reward: train_rew,
      test_part: 'flip_train',
      nTS: 999
    }
  }; // effort

  // PUSH TO TIMELINE //
  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(flip_train);

  // instructions3
  var instructions4 = {
    type: 'html-button-response-WH',
    stimulus: [instrImg_html[3]],
    choices: ['Ok'],
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'instructions',
      nTS: 999
    }
  }

  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(instructions4);

  var test_phase = {
    type: 'html-button-response-WH',
    stimulus: '<p><b>Tenez-vous pre&#770t.e !</b></p>',
    choices: [],
    trial_duration: time.fixation,
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: train_TS,
      reward: train_rew,
      test_part: 'fixation',
      nTS: 999
    }
  }; // fixation

  // PUSH TO TIMELINE //
  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(test_phase);

  var target_location_train  = Array(numbersImg.length);
  var correct_location_train = Array(numbersImg.length);
  var test_trials_train      = [];

  // TESTING PHASE //
  for (var test_i = 0; test_i < train_TS; test_i++) {

    var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
    // var pair_1st = 0; // for non-matching version of task, show numbers and test animals
    var pair_2nd = 1 - pair_1st;

    target_i_train[test_i]      = train_grid_indexes[0][test_i][pair_1st].map(function(v){return (v - 1)})
    target_corr_i_train[test_i] = train_grid_indexes[0][test_i][pair_2nd].map(function(v){return (v - 1)})

    test_trials_train.push({
      target_location:  target_i_train[test_i],
      correct_location: train_grid_indexes[0][test_i][pair_2nd].map(function(v){return (v - 1)}),
      target_image:     numbersImg[test_i]
    });

  }; // initialise test locations
  var test_train = {
    type: 'serial-reaction-time-mouse-WH',
    timeline: test_trials_train,
    grid: grid_dim_train,
    grid_square_size: screen.height/7,
    response_ends_trial: true,
    highlight: time.highlight,
    allow_nontarget_responses: true,
    prompt: '<p id="jspsych-prompt"><p style="margin:0px"><b>Cliquez</b> sur l&#39autre chiffre de la paire.</p>',
    pre_target_duration: 0,
    choices: ['OK, je suis s&ucirc;r.e','OK, mais je ne suis pas s&ucirc;r.e'],
    on_start: function(){var clicked = [null,null]},
    on_finish: function(data){
      if (data.correct){
        nCorrect_train++
        correct_i_train[test_counter_train] = 1;
      }
      clicked = [data.response_row, data.response_col];
      clicked_i_train[test_counter_train] = clicked;
      test_counter_train++
    },
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: test_i,
      target_score: train_TS,
      reward: train_rew,
      test_part: 'test_train',
      nTS: 999
    }
  }; // test

  // PUSH TO TIMELINE //
  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(test_train);

  // instructions5
  var instructions5 = {
    type: 'html-button-response-WH',
    stimulus: [instrImg_html[4]],
    choices: ['Ok'],
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'instructions',
      nTS: 999
    }
  }

  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(instructions5);

  // EXPECTATION QUESTION //
  var EnS_train = {
    type: 'html-button-response-WH',
    stimulus: '<p>Combien d&#39emplacements pensez-vous avoir correctement retrouvé ?</p>',
    choices: ['0','1','2','3','4'],
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: train_TS,
      reward: train_rew,
      test_part: 'post_test_conf_train',
      nTS: 999
    }
  };

  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(EnS_train);

  // instructions5
  var instructions6 = {
    type: 'html-button-response-WH',
    stimulus: [instrImg_html[5]],
    choices: ['Ok'],
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'instructions',
      nTS: 999
    }
  }

  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(instructions6);

  var feedback_with_grid_train = {
    type: 'html-button-response-fb-WH',
    stimulus: [grid_stimuli_train],
    grid: true,
    choices: ['Terminer l&#39entra&icirc;nement'],
    target: target_i_train,
    correct_responses: function(){return correct_i_train},
    target_score: train_TS,
    reward: train_rew,
    target_correct: target_corr_i_train,
    on_finish: function(){ // reset counters
      nCorrect_train       = 0;
      correct_i_train      = [0,0,0,0,0,0,0,0,0,0];
      test_counter_train   = 0;
      clicked_i_train      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]];
    },
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: train_TS,
      reward: train_rew,
      test_part: 'feedback_grid_train',
      nTS: 999
    }
  }; // fb with grid

  var feedback_sans_grid_train = {
    type: 'html-button-response-fb-WH',
    stimulus: '',
    grid: false,
    choices: ['Montrez-moi la grille','Terminer l&#39entra&icirc;nement'],
    target: target_i_train,
    correct_responses: function(){return correct_i_train},
    target_score: train_TS,
    reward: train_rew,
    target_correct: target_corr_i_train,
    on_start: function(feedback){
      var TS_current = feedback.target_score;
      var rew_current = feedback.reward;
      var emplacements = nCorrect_train==1 ? ' emplacement ':' emplacements '
      if (nCorrect_train >= TS_current){
        points_total_train = points_total_train + rew_current;
        if (rew_current == 1){
          feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect_train+'</b>' + emplacements + '!</p><p>Vous avez gagné '+feedback.reward+' point.</p>';
        } else {
          feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect_train+'</b>' + emplacements + '!</p><p>Vous avez gagné '+feedback.reward+' points.</p>';
        }
      } else {
        feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect_train+'</b>' + emplacements + '!</p><p>Vous avez gagné 0 points.</p>';
      }
    },
    on_finish: function(data){ // reset counters
      if (data.button == 1){
        nCorrect_train       = 0;
        correct_i_train      = [0,0,0,0,0,0,0,0,0,0];
        test_counter_train   = 0;
        clicked_i_train      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]];
      }
      data.nTS = points_total_train;
    },
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: train_TS,
      reward: train_rew,
      test_part: 'feedback_train',
      nTS: 999
    }
  }; // fb without grid


  // PUSH TO TIMELINE //
  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(feedback_sans_grid_train);

  // CONDITIONAL FOR IF PARTICIPANT SKIPS PAIR //
  var if_explicit_feedback_train = {
    timeline: [fullscreenExp, feedback_with_grid_train],
    conditional_function: function(){
      var data = jsPsych.data.get().last(1).values()[0];
      if (data.button_pressed == 1){
        return false;
      } else {
        return true;
      }
    }
  }

  timelineTask_train.push(if_explicit_feedback_train);

  // instructions - resume
  var instructions7 = {
    type: 'html-button-response-WH',
    stimulus: [instrImg_html[6]],
    choices: ['Commencer le test principal !'],
    data: {
      blockNb: -2,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'instructions',
      nTS: 999
    }
  }

  timelineTask_train.push(fullscreenExp);
  timelineTask_train.push(instructions7);




  return timelineTask_train;
}
