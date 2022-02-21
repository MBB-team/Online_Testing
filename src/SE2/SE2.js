function SE2(nbBlocks, nbTrials, cond_pt){

  // INITIALISATION //
  var timelineTask  = [];
  var trial_counter = 0; // counting the number of trials
  var nCorrect      = 0; // the number of correct responses given by the pts
  var nTS           = 0; // the number of target scores achieved by the pts
  var correct_i     = [0,0,0,0,0,0,0,0]; // array of correct response indexes
  var test_counter  = 0; // counter for looping through test trials during execution
  var clicked_i     = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the participants click
  var conf_counter  = 0; // counter for looping through effort question trials
  var nbTperB       = nbTrials/nbBlocks;
  var grid_dim      = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];
  var sliderIni     = Array(2);
  var flib_fb       = []; // flip length of time for feedback


  // Conditions
  var eff_q_pt = eff_q[randi(0,eff_q.length)];

  // START OF BLOCK //
  for (var block_i = 0; block_i < nbBlocks; block_i++) {
    var block_n = block_i + 1;

    // TRIAL LOOP //
    for (var trial_i = 0; trial_i < nbTperB; trial_i++) {
      var target_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
      var target_corr_i = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the correct image

      var trial_n = trial_i + 1;
      var nbTrial_counter = trial_counter+1;

      var rew = exp.rew[exp.rew_levels[cond_pt[trial_i]]];
      var TS  = exp.TS[exp.TS_levels[cond_pt[trial_i]]];

      // TRIAL NUMBER and TARGET SCORE //
      var trial_number = {
        type: 'html-button-response-WH',
        stimulus: '<p>C&#39est le de&#769but de l&#39exercice <b>'+nbTrial_counter+'</b>.</p><p style="font-size:30px">Le score cible pour cet exercice est: <b>'+TS+'</b>.</p><p style="font-size:30px">Le bonus pour cet exercice est: <b>'+rew+' &euro;</b>.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p>',
        choices: ['C&#39est parti !'],
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: exp.TS_levels[cond_pt[trial_i]],
          reward: exp.rew_levels[cond_pt[trial_i]],
          test_part: 'trialNb',
          nTS: 999
        }
      }; // trial number

      timelineTask.push(fullscreenExp);
      timelineTask.push(trial_number)


      // How much "effort" does the participant want?
      var effort_want = {
        type: 'html-slider-response-WH',
        stimulus:'<p>Pendant combien de secondes souhaitez-vous voir la grille ?</p>',
        labels: ['0 secondes','60 secondes'],
        min: 0,
        max: 60,
        start: function(){return randi(0,60);},
        require_movement: true,
        effort: true,
        on_finish: function(data){
          flip_fb = data.conf_response;
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: exp.TS_levels[cond_pt[trial_i]],
          reward: exp.rew_levels[cond_pt[trial_i]],
          test_part: 'effort_want',
          nTS: 999
        }
      }; // effort want

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(effort_want);

      var effort_phase = {
        type: 'html-button-response-WH',
        stimulus: '<p>La phase de mémorisation est sur le point de commencer.</p><p><b>Tenez-vous pre&#770t.e !</b></p>',
        choices: [],
        trial_duration: time.fixation,
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: exp.TS_levels[cond_pt[trial_i]],
          reward: exp.rew_levels[cond_pt[trial_i]],
          test_part: 'fixation',
          nTS: 999
        }
      }; // fixation

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(effort_phase);

      // effort //
      var flip = {
        type: 'html-button-response-WH',
        stimulus: grid_stimuli[trial_counter],
        choices: ['Souhaitez-vous passer à la phase de test ?'],
        trial_duration: 5000,
        on_start: function(flip){
          var data = jsPsych.data.get().last(4).values()[0];
          var effort_want_s = data.conf_response;
          flip.trial_duration = effort_want_s*1000; // x1000 to put in ms
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: exp.TS_levels[cond_pt[trial_i]],
          reward: exp.rew_levels[cond_pt[trial_i]],
          test_part: 'flip',
          nTS: 999
        }
      }; // effort

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(flip);

      var test_phase = {
        type: 'html-button-response-WH',
        stimulus: '<p>La phase de test est sur le point de commencer.</p><p><b>Tenez-vous pre&#770t.e !</b></p>',
        choices: [],
        trial_duration: time.fixation,
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: exp.TS_levels[cond_pt[trial_i]],
          reward: exp.rew_levels[cond_pt[trial_i]],
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

        target_i[test_i]      = grid_indexes_shuffled[trial_counter][test_i][pair_1st].map(function(v){return (v - 1)})
        target_corr_i[test_i] = grid_indexes_shuffled[trial_counter][test_i][pair_2nd].map(function(v){return (v - 1)})

        test_trials.push({
          target_location:  target_i[test_i],
          correct_location: grid_indexes_shuffled[trial_counter][test_i][pair_2nd].map(function(v){return (v - 1)}),
          target_image:     numbersImg[test_i]
        });

      }; // initialise test locations

      var test = {
        type: 'serial-reaction-time-mouse-WH',
        timeline: test_trials,
        grid: grid_dim,
        grid_square_size: screen.height/7,
        response_ends_trial: true,
        highlight: time.highlight,
        allow_nontarget_responses: true,
        prompt: '<p id="jspsych-prompt" style="margin:0px">Le score cible pour cet exercice est: <b>'+TS+'</b></p><p>Le bonus pour cet exercice est: <b>'+rew+' €</b>.</p><p><b>Cliquez</b> sur l&#39emplacement de l&#39autre paire.</p>',
        pre_target_duration: 0,
        choices: [],
        on_start: function(){var clicked = [null,null]},
        on_finish: function(data){
          if (data.correct){
            nCorrect++
            correct_i[test_counter] = 1;
          }
          clicked = [data.response_row, data.response_col];
          clicked_i[test_counter] = clicked;
          test_counter++
          if (data.button_pressed == 1){
            jsPsych.endCurrentTimeline();
          }
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: test_i,
          target_score: exp.TS_levels[cond_pt[trial_i]],
          reward: exp.rew_levels[cond_pt[trial_i]],
          test_part: 'test',
          nTS: 999
        }
      }; // test

      // CONDITIONAL FOR IF PARTICIPANT SKIPS PAIR //
      var if_test = {
        timeline: [fullscreenExp, test],
        conditional_function: function(){
          var data = jsPsych.data.get().last(2).values()[0];
          if (data.button_pressed == 1){
            return false;
          } else {
            return true;
          }
        }
      }; // test if

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(if_test);


      var feedback = {
        type: 'html-button-response-fb-WH',
        stimulus: grid_stimuli[trial_counter],
        choices: [],
        trial_duration: time.showFeedback,
        target: target_i,
        correct_responses: function(){return correct_i},
        target_score: exp.TS_levels[cond_pt[trial_i]],
        target_correct: target_corr_i,
        on_start: function(feedback){
          var TS_current = feedback.target_score;
          if (nCorrect >= TS_current){
            nTS++;
            feedback.prompt = '<p style="font-size:25px; margin:0px">Vous avez atteint le score cible. Votre score: <b>'+nCorrect+'/'+numbersImg.length+' !</b> Vous avez vu la grille pendant <b>'+flip_fb+'</b> secondes.';
          } else {
            feedback.prompt = '<p style="font-size:25px; margin:0px">Vous n&#39avez pas atteint le score cible. Votre score: <b>'+nCorrect+'/'+numbersImg.length+' !</b> Vous avez vu la grille pendant <b>'+flip_fb+'</b> secondes.';
          }
        },
        on_finish: function(){ // reset counters
          nCorrect       = 0;
          correct_i      = [0,0,0,0,0,0,0,0,0,0];
          test_counter   = 0;
          clicked_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]];
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: exp.TS_levels[cond_pt[trial_i]],
          reward: exp.rew_levels[cond_pt[trial_i]],
          test_part: 'feedback',
          nTS: 999
        }
      }; // effort

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(feedback);

      var test_conf = {
        type: 'html-slider-response-WH',
        stimulus:'<p>Combien d’effort avez-vous fourni pour mémoriser les paires ?</p><p>0% = <b>Aucune charge mentale</b> et 100% = <b>Charge mentale maximale</b>',
        labels: ['0%','25%','50%','75%','100%'],
        min: 0,
        max: 100,
        start: function(){return randi(0,100);},
        require_movement: true,
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: exp.TS_levels[cond_pt[trial_i]],
          reward: exp.rew_levels[cond_pt[trial_i]],
          test_part: 'test_conf',
          nTS: 999
        }
      };


      if (trial_counter == eff_q_pt[conf_counter]-1){

        // PUSH TO TIMELINE //
        timelineTask.push(fullscreenExp);
        timelineTask.push(test_conf);

        // INCREMENT THE conf_counter
        conf_counter++;
      }


      trial_counter++;

    } // trial
  } // block



  return timelineTask;

}
