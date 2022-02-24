function SE2_training(){

  // INITIALISATION //
  var timelineTask  = [];
  var nCorrect      = 0; // the number of correct responses given by the pts
  var correct_i     = [0,0,0,0,0,0,0,0]; // array of correct response indexes
  var test_counter  = 0; // counter for looping through test trials during execution
  var clicked_i     = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the participants click
  var flib_fb_train = []; // flip length of time for feedback
  var train_TS      = 4;
  var train_rew     = 1;

  // First instructions
  var instructions1 = {
    type: 'instructions-WH',
    pages: instrImg_html.splice(0,2),
    show_clickable_nav: true,
    data: {
      blockNb: 999,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      test_part: 'instructions',
      nTS: 999
    }
  };

  timelineTask.push(fullscreenExp);
  timelineTask.push(instructions1);

  // TRIAL NUMBER and TARGET SCORE //
  var trial_number_train = {
    type: 'html-button-response-WH',
    stimulus: '<p>Votre objectif est de mémoriser <b>'+train_TS+' paires de chiffres</b>.</p><p>Si vous atteignez cet objectif, vous recevrez un bonus de <b>'+train_rew+' ' + points + '</b>.</p>',
    choices: ['Ok'],
    // button_html: '<button class="jspsych-btn" style="font-size: ">%choice%</button>',
    data: {
      blockNb: block_i,
      trialNb: trial_counter,
      TinB: trial_i,
      testNb: 999,
      target_score: TS,
      reward: rew,
      test_part: 'trialNb_train',
      nTS: 999
    }
  }; // trial number

  timelineTask.push(fullscreenExp);
  timelineTask.push(trial_number_train);

  // How much "effort" does the participant want?
  var effort_want_train = {
    type: 'html-slider-response-effort-want-WH',
    stimulus:'<p>Pendant combien de temps souhaitez-vous voir la grille ?</p>',
    labels: ['0 secondes','60 secondes'],
    min: 0,
    max: 60,
    start: function(){return randi(0,60);},
    require_movement: true,
    effort: true,
    on_finish: function(data){
      flip_fb_train = data.conf_response;
    },
    data: {
      blockNb: block_i,
      trialNb: trial_counter,
      TinB: trial_i,
      testNb: 999,
      target_score: TS,
      reward: rew,
      test_part: 'effort_want_train',
      nTS: 999
    }
  }; // effort want

  // PUSH TO TIMELINE //
  timelineTask.push(fullscreenExp);
  timelineTask.push(effort_want_train);

  // instructions2
  var instructions2 = {
    type: 'instructions-WH',
    pages: [instrImg_html[2]],
    show_clickable_nav: true,
    data: {
      blockNb: 999,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      test_part: 'instructions',
      nTS: 999
    }
  };

  timelineTask.push(fullscreenExp);
  timelineTask.push(instructions2);

  var effort_phase = {
    type: 'html-button-response-WH',
    stimulus: '<p><b>Tenez-vous pre&#770t.e !</b></p>',
    choices: [],
    trial_duration: time.fixation,
    data: {
      blockNb: block_i,
      trialNb: trial_counter,
      TinB: trial_i,
      testNb: 999,
      target_score: TS,
      reward: rew,
      test_part: 'fixation',
      nTS: 999
    }
  }; // fixation

  // PUSH TO TIMELINE //
  timelineTask.push(fullscreenExp);
  timelineTask.push(effort_phase);

  // effort //
  var flip_train = {
    type: 'html-button-response-effort-WH',
    stimulus: [grid_stimuli_train],
    choices: [],
    trial_duration: function(){return flip_fb_train;},
    reward: rew,
    timer: true,
    data: {
      blockNb: block_i,
      trialNb: trial_counter,
      TinB: trial_i,
      testNb: 999,
      target_score: TS,
      reward: rew,
      test_part: 'flip',
      nTS: 999
    }
  }; // effort

  // PUSH TO TIMELINE //
  timelineTask.push(fullscreenExp);
  timelineTask.push(flip_train);

  // instructions2
  var instructions3 = {
    type: 'instructions-WH',
    pages: [instrImg_html[3]],
    show_clickable_nav: true,
    data: {
      blockNb: 999,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      test_part: 'instructions',
      nTS: 999
    }
  };

  timelineTask.push(fullscreenExp);
  timelineTask.push(instructions3);

  var test_phase = {
    type: 'html-button-response-WH',
    stimulus: '<p><b>Tenez-vous pre&#770t.e !</b></p>',
    choices: [],
    trial_duration: time.fixation,
    data: {
      blockNb: block_i,
      trialNb: trial_counter,
      TinB: trial_i,
      testNb: 999,
      target_score: TS,
      reward: rew,
      test_part: 'fixation',
      nTS: 999
    }
  }; // fixation

  // PUSH TO TIMELINE //
  timelineTask.push(fullscreenExp);
  timelineTask.push(test_phase);

  var target_location  = Array(numbersImg.length);
  var correct_location = Array(numbersImg.length);
  var test_trials      = [];

  // TESTING PHASE //
  for (var test_i = 0; test_i < TS; test_i++) {

    var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
    // var pair_1st = 0; // for non-matching version of task, show numbers and test animals
    var pair_2nd = 1 - pair_1st;

    target_i[test_i]      = train_grid_indexes[0][test_i][pair_1st].map(function(v){return (v - 1)})
    target_corr_i[test_i] = train_grid_indexes[0][test_i][pair_2nd].map(function(v){return (v - 1)})

    test_trials.push({
      target_location:  target_i[test_i],
      correct_location: train_grid_indexes[0][test_i][pair_2nd].map(function(v){return (v - 1)}),
      target_image:     numbersImg[test_i]
    });

  }; // initialise test locations
  var test_train = {
    type: 'serial-reaction-time-mouse-WH',
    timeline: test_trials,
    grid: grid_dim,
    grid_square_size: screen.height/7,
    response_ends_trial: true,
    highlight: time.highlight,
    allow_nontarget_responses: true,
    prompt: '<p id="jspsych-prompt" style="margin:0px"><p><b>Cliquez</b> sur l&#39autre chiffre de la paire.</p>',
    pre_target_duration: 0,
    choices: ['OK, je suis s&ucirc;r.e','OK, mais je ne suis pas s&ucirc;r.e'],
    on_start: function(){var clicked = [null,null]},
    on_finish: function(data){
      console.log(data)
      if (data.correct){
        nCorrect++
        correct_i[test_counter] = 1;
      }
      clicked = [data.response_row, data.response_col];
      clicked_i[test_counter] = clicked;
      test_counter++
      // if (data.button_pressed == 1){
      //   jsPsych.endCurrentTimeline();
      // }
    },
    data: {
      blockNb: block_i,
      trialNb: trial_counter,
      TinB: trial_i,
      testNb: test_i,
      target_score: TS,
      reward: rew,
      test_part: 'test',
      nTS: 999
    }
  }; // test

  // PUSH TO TIMELINE //
  timelineTask.push(fullscreenExp);
  timelineTask.push(test_train);














  return timelineTask_train
}
