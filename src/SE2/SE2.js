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
  var points_total  = 0;


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
      var points = rew==1? 'point':'points'
      // TRIAL NUMBER and TARGET SCORE //
      var trial_number = {
        type: 'html-button-response-WH',
        stimulus: '<p>C&#39est le de&#769but de l&#39exercice <b>'+nbTrial_counter+'</b>.</p><p style="font-size:30px">Votre objectif est de retrouver <b>'+TS+' emplacements</b>.</p><p style="font-size:30px">Si vous atteignez cet objectif, vous receverez <b>'+rew+' ' + points + '</b>.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p>',
        choices: ['C&#39est parti !'],
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: TS,
          reward: rew,
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
          target_score: TS,
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
      var flip = {
        type: 'html-button-response-WH',
        stimulus: grid_stimuli[trial_counter],
        choices: [],
        trial_duration: 5000,
        timer: true,
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
          target_score: TS,
          reward: rew,
          test_part: 'flip',
          nTS: 999
        }
      }; // effort

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
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
        prompt: '<p id="jspsych-prompt" style="margin:0px">L&#39objectif pour cet exercice est: <b>'+TS+'</b></p><p>Le bonus pour cet exercice est: <b>'+rew+' '+points+'</b>.</p><p><b>Cliquez</b> sur l&#39emplacement de l&#39autre paire.</p>',
        pre_target_duration: 0,
        choices: ['OK, je suis s&ucirc;r.e','OK, mais je ne suis s&ucirc;r.e pas'],
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
        choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: TS,
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
          target_score: TS,
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
        choices: [],
        trial_duration: time.showFeedback,
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
              feedback.prompt = '<p style="font-size:25px; margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacements + '!</p><p>Vous avez donc attient l&#39objectif.</p><p>Vous avez gagné '+feedback.reward+' point.</p>';
            } else {
              feedback.prompt = '<p style="font-size:25px; margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacements + '!</p><p>Vous avez donc attient l&#39objectif.</p><p>Vous avez gagné '+feedback.reward+' points.</p>';
            }
          } else {
            feedback.prompt = '<p style="font-size:25px; margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacements + '!</p><p>Vous n&#39avez pas donc attient l&#39objectif.</p><p>Vous avez gagné 0 points.</p>';
          }
        },
        on_finish: function(){ // reset counters
          nCorrect       = 0;
          correct_i      = [0,0,0,0,0,0,0,0];
          test_counter   = 0;
          clicked_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]];
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: TS,
          reward: rew,
          test_part: 'feedback',
          nTS: 999
        }
      }; // fb with grid

      var feedback_sans_grid = {
        type: 'html-button-response-fb-WH',
        stimulus: '',
        grid: false,
        choices: ['Montrez-moi la grille','Continuer à la prochaine exercice'],
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
            console.log(points_total)
            nTS++;
            if (rew_current == 1){
              feedback.stimulus = '<p style="font-size:25px; margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacements + '!</p><p>Vous avez donc attient l&#39objectif.</p><p>Vous avez gagné '+feedback.reward+' point.</p>';
            } else {
              feedback.stimulus = '<p style="font-size:25px; margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacements + '!</p><p>Vous avez donc attient l&#39objectif.</p><p>Vous avez gagné '+feedback.reward+' points.</p>';
            }
          } else {
            feedback.stimulus = '<p style="font-size:25px; margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacements + '!</p><p>Vous n&#39avez pas donc attient l&#39objectif.</p><p>Vous avez gagné 0 points.</p>';
          }
        },
        on_finish: function(data){ // reset counters
          if (data.button == 1){
            nCorrect       = 0;
            correct_i      = [0,0,0,0,0,0,0,0];
            test_counter   = 0;
            clicked_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]];
          }
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: TS,
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
  var points_fin = points_total == 1 ? 'point':'points';
  var finish = {
    type: 'html-button-response-WH',
    stimulus: function(){
      var max_points = exp.rew.reduce((pv,cv)=>pv+cv,0)*exp.nbBlocks*exp.TS.length;
      var max_euro   = exp.rew_euro[1];
      var min_euro   = exp.rew_euro[0];
      var euro_rew   = Math.round((((max_euro - min_euro)*(points_total - 0))/(max_points - 0)) + min_euro);
      var finish_stim = '<p>Le test de me&#769tacognition est maintenant termine&#769.</p><p>Vous avez reussi <b>'+nTS+' exercises sur '+exp.nbTrials+'</b>.</p><p>En total, vous avez gagné : <b>'+points_total+' '+points_fin+'</b>. Vous serez donc payer : <b>'+euro_rew+' €.</b></p><p><b>Merci beaucoup pour votre participation !</b></p>';
      return finish_stim;
    },
    choices: ['Fin'],
    on_finish: function(data){
      var max_points = exp.rew.reduce((pv,cv)=>pv+cv,0)*exp.nbBlocks*exp.TS.length;
      var max_euro   = exp.rew_euro[1];
      var min_euro   = exp.rew_euro[0];
      var euro_rew   = Math.round((((max_euro - min_euro)*(points_total - 0))/(max_points - 0)) + min_euro);
      data.nTS = JSON.stringify([nTS, points_total, euro_rew]);
    },
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
