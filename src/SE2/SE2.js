function SE2(nbBlocks, nbTrials){

  // INITIALISATION //
  var timelineTask  = [];
  var trial_counter = 0; // counting the number of trials
  var nCorrect      = 0; // the number of correct responses given by the pts
  var nTS           = 0; // the number of target scores achieved by the pts
  var correct_i     = [0,0,0,0,0,0,0,0]; // array of correct response indexes
  var test_counter  = 0; // counter for looping through test trials during execution
  var conf_counter  = 0; // counter for looping through effort question trials
  var nbTperB       = nbTrials/nbBlocks;
  var grid_dim      = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];
  var sliderIni     = Array(2);
  var flib_fb       = []; // flip length of time for feedback
  var points_total  = 0;
  var EnS_choices = [['0', '1', '2', '3', '4', '5', '6']];


  // Conditions
  var eff_q_pt = eff_q[randi(0,eff_q.length)];

  var cheat = {
    type: 'html-button-response-WH',
    stimulus: '<p style="width:'+screen.width*0.66+'px">Ayant déjà mené une version similaire de cette expérience, nous pourrons détecter si vous avez triché lors d&#39un exercice et <b>vous ne recevrez pas de paiement</b> si nous soupçonnons que c&#39est le cas.</p>',
    choices: ['Je m&#39engage à ne pas tricher'],
    data: {
      blockNb: -1,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'cheat',
      nTS: 999
    }
  };

  timelineTask.push(cheat);


  // START OF BLOCK //
  for (var block_i = 0; block_i < nbBlocks; block_i++) {
    var block_n = block_i + 1;

    // TRIAL LOOP //
    for (var trial_i = 0; trial_i < nbTperB; trial_i++) {
      var target_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
      var target_corr_i = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the correct image

      var trial_n = trial_i + 1;
      var nbTrial_counter = trial_counter+1;

      var rew = exp.rew[exp.rew_levels[cond_pt[trial_counter]]];
      var TS  = exp.TS[exp.TS_levels[cond_pt[trial_counter]]];
      var TD  = exp.TD[exp.TD_levels[cond_pt[trial_counter]]];
      var points = rew==1? 'point':'points';

      // How much "effort" does the participant want?
      var effort_want = {
        type: 'html-slider-response-effort-want-WH',
        prompt: '<p> Exercice : '+nbTrial_counter+'/'+nbTrials+'.<p style="font-size:30px">Votre objectif est de mémoriser <b>'+TS+' paires de chiffres</b>.</p><p style="font-size:30px">Si vous atteignez cet objectif, vous recevrez un bonus de <b>'+rew+' ' + points + '</b>.</p><div><br></div>',
        stimulus:'<p>Pendant combien de temps souhaitez-vous voir la grille ?</p>',
        labels: ['0 secondes','60 secondes'],
        min: 0,
        max: 60,
        start: function(){return randi(0,60);},
        require_movement: true,
        effort: true,
        on_start: function(){
          nCorrect       = 0;
          correct_i      = [0,0,0,0,0,0,0,0];
          test_counter   = 0;
        },
        on_finish: function(data){
          flip_fb = data.conf_response;
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: TD,
          reward: rew,
          test_part: 'effort_want',
          nTS: 999
        }
      }; // effort want

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(effort_want);

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
          target_score: TD,
          reward: rew,
          test_part: 'fixation',
          nTS: 999
        }
      }; // fixation

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(effort_phase);

      // effort //
      var flip = {
        type: 'html-button-response-effort-WH',
        stimulus: grid_stimuli[trial_counter],
        choices: [],
        trial_duration: function(){
          var current_block = jsPsych.data.getLastTrialData().values()[0].blockNb;
          var current_TD = exp.TD[exp.TD_levels[current_block]];
          console.log(flip_fb*1000*current_TD)
          return flip_fb*1000*current_TD;
        },
        reward: rew,
        timer: true,
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: TD,
          reward: rew,
          test_part: 'flip',
          nTS: 999
        }
      }; // effort

      // PUSH TO TIMELINE //
      // timelineTask.push(fullscreenExp);
      timelineTask.push(flip);

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
          target_score: TD,
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
        prompt: '<p id="jspsych-prompt" style="margin:0px"><p style="margin:0px"><b>Cliquez</b> sur l&#39autre chiffre de la paire.</p>',
        pre_target_duration: 0,
        choices: ['OK, je suis s&ucirc;r.e','OK, mais je ne suis pas s&ucirc;r.e'],
        on_start: function(){var clicked = [null,null]},
        on_finish: function(data){
          if (data.correct){
            nCorrect++
            correct_i[test_counter] = 1;
          }
          clicked = [data.response_row, data.response_col];
          test_counter++;
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: test_i,
          target_score: TD,
          reward: rew,
          test_part: 'test',
          nTS: 999
        }
      }; // test

      // // CONDITIONAL FOR IF PARTICIPANT SKIPS PAIR //
      // var if_test = {
      //   timeline: [fullscreenExp, test],
      //   conditional_function: function(){
      //     var data = jsPsych.data.get().last(2).values()[0];
      //     if (data.button_pressed == 1){
      //       return false;
      //     } else {
      //       return true;
      //     }
      //   }
      // }; // test if

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(test);


      // EXPECTATION QUESTION //
      var EnS = {
        type: 'html-button-response-WH',
        stimulus: '<p>Combien d&#39emplacements pensez-vous avoir correctement retrouvé ?</p>',
        choices: EnS_choices[exp.TS_levels[cond_pt[trial_counter]]],
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: TD,
          reward: rew,
          test_part: 'post_test_conf',
          nTS: 999
        }
      };

      timelineTask.push(fullscreenExp);
      timelineTask.push(EnS);

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
          target_score: TD,
          reward: rew,
          test_part: 'test_conf',
          nTS: 999
        }
      };

      // push to timeline if it is an effort question trial
      if (trial_counter == eff_q_pt[conf_counter]-1){

        // PUSH TO TIMELINE //
        timelineTask.push(fullscreenExp);
        timelineTask.push(test_conf);

        // INCREMENT THE conf_counter
        conf_counter++;
      }


      var feedback_with_grid = {
        type: 'html-button-response-fb-WH',
        stimulus: grid_stimuli[trial_counter],
        grid: true,
        choices: ['Passer au prochain exercice'],
        target: target_i,
        correct_responses: function(){return correct_i},
        target_score: TS,
        reward: rew,
        target_correct: target_corr_i,
        on_finish: function(){ // reset counters
          nCorrect       = 0;
          correct_i      = [0,0,0,0,0,0,0,0];
          test_counter   = 0;
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: TD,
          reward: rew,
          test_part: 'feedback_grid',
          nTS: 999
        }
      }; // fb with grid

      var feedback_sans_grid = {
        type: 'html-button-response-fb-WH',
        stimulus: '',
        grid: false,
        choices: ['Montrez-moi la grille','Passer au prochain exercice'],
        target: target_i,
        correct_responses: function(){return correct_i},
        target_score: TS,
        reward: rew,
        target_correct: target_corr_i,
        on_start: function(feedback){
          var TS_current = feedback.target_score;
          var rew_current = feedback.reward;
          var emplacements = nCorrect==1 ? ' emplacement ':' emplacements '
          if (nCorrect >= TS_current){
            points_total = points_total + rew_current;
            nTS++;
            if (rew_current == 1){
              feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacements + '!</p><p>Vous avez gagné '+feedback.reward+' point.</p>';
            } else {
              feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacements + '!</p><p>Vous avez gagné '+feedback.reward+' points.</p>';
            }
          } else {
            feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacements + '!</p><p>Vous avez gagné 0 points.</p>';
          }
        },
        on_finish: function(data){ // reset counters
          if (data.button == 1){
            nCorrect       = 0;
            correct_i      = [0,0,0,0,0,0,0,0];
            test_counter   = 0;
          }
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: TD,
          reward: rew,
          test_part: 'feedback',
          nTS: 999
        }
      }; // fb without grid


      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(feedback_sans_grid);

      // CONDITIONAL FOR IF PARTICIPANT SKIPS PAIR //
      var if_explicit_feedback = {
        timeline: [fullscreenExp, feedback_with_grid],
        conditional_function: function(){
          var data = jsPsych.data.get().last(1).values()[0];
          if (data.button_pressed == 1){
            return false;
          } else {
            return true;
          }
        }
      }

      timelineTask.push(if_explicit_feedback);

      trial_counter++;

    } // trial
  } // block

  var score = {
    type: 'html-button-response-WH',
    stimulus: '',
    choices: [],
    trial_duration: 1,
    data: {
      blockNb: 999,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'total_score',
      nTS: function(){
        var max_points = exp.rew.reduce((pv,cv)=>pv+cv,0)*exp.nbBlocks*exp.TS.length;
        var max_euro   = exp.rew_euro[1];
        var min_euro   = exp.rew_euro[0];
        var total_points = points_total + jsPsych.data.get().filter({test_part:'feedback_train'}).values()[0].nTS
        var euro_rew   = Math.round((((max_euro - min_euro)*(total_points - 0))/(max_points - 0)) + min_euro);
        var nTS = JSON.stringify([nTS, total_points, euro_rew]);
        return nTS
      }
    }
  }

  timelineTask.push(score);

  var finish = {
    type: 'html-button-response-WH',
    stimulus: function(){
      var max_points = exp.rew.reduce((pv,cv)=>pv+cv,0)*exp.nbBlocks*exp.TS.length + 1;
      var max_euro   = exp.rew_euro[1];
      var min_euro   = exp.rew_euro[0];
      var total_points = points_total + jsPsych.data.get().filter({test_part:'feedback_train'}).values()[0].nTS
      var points_fin = total_points == 1 ? 'point':'points';
      var euro_rew   = Math.round((((max_euro - min_euro)*(total_points - 0))/(max_points - 0)) + min_euro);
      var finish_stim = '<p>Le test de me&#769tacognition est maintenant termine&#769.</p><p>En total, vous avez gagné : <b>'+total_points+' '+points_fin+'</b>. Vous recevrez : <b>'+euro_rew+' €.</b></p><p><b>Merci beaucoup pour votre participation !</b></p>';
      return finish_stim;
    },
    choices: ['Fin'],
    data: {
      blockNb: block_i,
      trialNb: trial_counter,
      TinB: trial_i,
      testNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'finish',
      nTS: 999
    }
  }

  timelineTask.push(finish);

  return timelineTask;

}
