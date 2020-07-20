function SE(nbBlocks, nbTrials){

  // INITIALISATION //
  var timelineTask  = [];
  var trial_counter = 0; // counting the number of trials
  var flip_counter  = 1; // counting the number of flips on a trial
  var nCorrect      = 0; // the number of correct responses given by the pts
  var test_counter  = 0; // counter for looping through test trials during execution
  var correct_i     = [0,0,0,0,0,0,0,0]; // array of correct response indexes
  var clicked_i     = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the participants click
  var target_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
  var conf_counter  = 0; // counter for looping through confidence trials
  var nbTperB       = nbTrials/nbBlocks;
  var grid_dim = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];

  // Target Scores
  var target_scores = [3, 4, 5, 6, 7, 8];
  var target_scores_all = (jsPsych.randomization.shuffleNoRepeats(jsPsych.randomization.repeat(target_scores,3)));

  target_scores_all.unshift(...target_scores);

  // No test trials
  var conf_trials_idx = Array(6);
  var conf_trials_TS = jsPsych.randomization.repeat(target_scores, 1);
  for (var i = 0; i < conf_trials_idx.length; i++) {
    var ii = randi(2,5) + i*5
    conf_trials_idx[i] = ii-1; // index of location to insert conf trial
    target_scores_all.splice(conf_trials_idx[i], 0, conf_trials_TS[i]);
  };

  // START OF BLOCK //
  for (var block_i = 0; block_i < nbBlocks; block_i++) {
    var block_n = block_i + 1;

    // BLOCK NUMBER //
    var block_number = {
      type: 'html-button-response-WH',
      stimulus: '<p>C&#39est le de&#769but du bloc <b>'+block_n+'</b>.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p>',
      choices: ['C&#39est parti !'],
      data: {
        blockNb: block_i,
        trialNb: trial_counter,
        TinB: 999,
        testNb: 999,
        target_score: target_scores_all[trial_counter],
        test_part: 'blockNb'
      }
    }; // block number

    timelineTask.push(block_number)

    // TRIAL LOOP //
    for (var trial_i = 0; trial_i < nbTperB; trial_i++) {

      var trial_n = trial_i + 1;

      // TRIAL NUMBER and TARGET SCORE //
      var trial_number = {
        type: 'html-button-response-WH',
        stimulus: '<p>C&#39est le de&#769but de l&#39essai <b>'+trial_n+'</b> du bloc <b><p>'+block_n+'</b>.</p></p><p style="font-size:30px">Le score cible pour cet essai est: <b>'+target_scores_all[trial_counter]+'</b>.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p>',
        choices: ['C&#39est parti !'],
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: target_scores_all[trial_counter],
          test_part: 'trialNb'
        }
      }; // trial number

      timelineTask.push(trial_number)

      // SE QUESTION //
      var SE_conf = {
        type: 'SE-confidence-slider-WH',
        range: 30,
        trial_duration: time.SEconf,
        prompt: '<p>Le score cible: <b>'+target_scores_all[trial_counter]+'</b>.</p><p>Positionnez la barre en fonction du nombre de fois dont vous pensez avoir besoin de voir la grille pour atteindre le score cible.<p>Utilisez les fle&#768ches gauche et droite pour positionner la barre. Utilizer les fle&#768ches du haut et du bas pour augmenter ou raccourcir la longueur de la barre.</p><p> Appuyez sur E&#769ntre&#769e pour confirmer votre choix.</p><p>Vous avez <b>3 minutes</b> pour re&#769pondre.</p>',
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: target_scores_all[trial_counter],
          test_part: 'SE_slider'
        }
      };

      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(SE_conf);

      // FLIP //
      var flip = {
        type: 'animation-WH',
        stimuli: grid_stimuli[trial_counter],
        frame_time: time.flipSpeed,
        choices: jsPsych.NO_KEYS,
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: target_scores_all[trial_counter],
          test_part: 'flip'
        }
      };

      // REWATCH QUESTION //
      var rewatch = {
        stimulus: '<p>Souhaitez-vous revoir la grille ?</p><p>Le score cible pour cet essai est: <b>'+target_scores_all[trial_counter]+'</b>.</p><p>Vous avez <b>5 secondes</b> pour re&#769pondre!</p>',
        type: 'html-button-response-WH',
        prompt: function(){
          var rewatch_prompt = '<p>Vous avez vu la grille <b>'+flip_counter+'</b> fois.';
          return rewatch_prompt;},
          choices: ['Oui','Non'],
          trial_duration: time.rewatch,
          on_finish: function(data){
            response = data.button_pressed;
            if (response == 0){
              flip_counter++;
            } else {
              data.flips = flip_counter;
              flip_counter = 1;
            }
          },
          data: {
            blockNb: block_i,
            trialNb: trial_counter,
            TinB: trial_i,
            testNb: 999,
            target_score: target_scores_all[trial_counter],
            test_part: 'rewatch'
          }
        } // rewatch

        // LOOP THE FLIPS //
        var looping_chunk = {
          timeline: [flip, fullscreenExp, rewatch],
          loop_function: function(data){
            response = data.values()[2]["button_pressed"];
            if (response == 0){
              return true;
            } else {
              return false;
            };
          }
        }; // loop

        // PUSH TO TIMELINE //
        timelineTask.push(looping_chunk);

        // IF CONF OR TESTING //
        if (trial_counter == conf_trials_idx[conf_counter]){

          var test_conf = {
            type: 'html-slider-response-WH',
            stimulus:'<p>A&#768 quel point auriez-vous e&#769te&#769 confiant d&#39avoir atteint le score cible de <b>'+target_scores_all[trial_counter]+'</b>, si vous aviez e&#769te&#769 teste&#769 ?</p><p>-100% = <b>certainement pas </b> et 100% = <b>certainement oui</b>',
            labels: ['-100%','0%','100%'],
            min: -100,
            max: 100,
            start: function(){return randi(-100,100);},
            require_movement: true,
            data: {
              blockNb: block_i,
              trialNb: trial_counter,
              TinB: trial_i,
              testNb: 999,
              target_score: target_scores_all[trial_counter],
              test_part: 'test_conf'
            }
          };

          // INCREMENT THE conf_counter
          conf_counter++;

          // PUSH TO TIMELINE //
          timelineTask.push(fullscreenExp);
          timelineTask.push(test_conf);

        } else {

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
              target_score: target_scores_all[trial_counter],
              test_part: 'fixation'
            }
          };

          // PUSH TO TIMELINE //
          timelineTask.push(fullscreenExp);
          timelineTask.push(test_phase);

          var target_location  = Array(8);
          var correct_location = Array(8);
          var test_trials      = [];

          // TESTING PHASE //
          for (var test_i = 0; test_i < numbersImg.length; test_i++) {

            var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
            var pair_2nd = 1 - pair_1st;

            target_i[test_i] = grid_indexes_shuffled[trial_counter][test_i][pair_1st].map(function(v){return (v - 1)})

            test_trials.push({
              target_location:  target_i[test_i],
              correct_location: grid_indexes_shuffled[trial_counter][test_i][pair_2nd].map(function(v){return (v - 1)}),
              target_image:     numbersImg[test_i]
            });


          }

            var test = {
              type: 'serial-reaction-time-mouse-WH',
              timeline: test_trials,
              grid: grid_dim,
              grid_square_size: screen.height/7,
              response_ends_trial: true,
              highlight: time.highlight,
              allow_nontarget_responses: true,
              prompt: '<p id="jspsych-prompt" style="margin:0px">Le score cible pour cet essai est: <b>'+target_scores_all[trial_counter]+'</b>. <b>Cliquez</b> sur l&#39emplacement de l&#39autre paire.</p>',
              pre_target_duration: 0,
              choices: ['Montrez-moi la prochaine paire', 'Je crois avoir atteint le score cible. Terminez la phase de test !'],
              on_start: function(){var clicked = [null,null]},
              on_finish: function(data){
                if (data.correct){
                  nCorrect++
                  correct_i[test_counter] = 1;
                }
                clicked = [data.response_row, data.response_col];
                clicked_i[test_counter] = clicked;
                test_counter++
                if (data.button_pressed == 1){jsPsych.endCurrentTimeline();}
              },
              data: {
                blockNb: block_i,
                trialNb: trial_counter,
                TinB: trial_i,
                testNb: test_i,
                target_score: target_scores_all[trial_counter],
                test_part: 'test'
              }
            };

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
            }

            // PUSH TO TIMELINE //
            timelineTask.push(fullscreenExp);
            timelineTask.push(if_test);

          // CONFIDENCE QUESTION //

          var confidence = {
            type: 'html-button-response-WH',
            stimulus: '<p>Combien d&#39emplacements pensez-vous avoir correctement deviné ?</p>',
            choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
            data: {
              blockNb: block_i,
              trialNb: trial_counter,
              TinB: trial_i,
              testNb: 999,
              target_score: target_scores_all[trial_counter],
              test_part: 'post_test_conf'
            }
          };

          // PUSH TO TIMELINE //
          timelineTask.push(fullscreenExp);
          timelineTask.push(confidence);

          // FEEDBACK //
          var feedback = {
            type: 'animation-WH',
            frame_time: time.showFeedback,
            stimuli: grid_stimuli[trial_counter],
          //  clicked: function(){clicked_i},
            target: target_i,
            choices: jsPsych.NO_KEYS,
            prompt: function(){
              var feedback_prompt = '<p style="font-size:25px; margin:0px">Votre score: <b>'+nCorrect+'/8 !</b>';
              return feedback_prompt;
            },
            feedback: true,
            correct_responses: function(){return correct_i},
            on_start: function(feedback){
              feedback.clicked = clicked_i;
            },
            on_finish: function(){ // reset counters
              nCorrect       = 0;
              correct_i      = [0,0,0,0,0,0,0,0];
              test_counter   = 0;
              clicked_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]];;
            },
            data: {
              blockNb: block_i,
              trialNb: trial_counter,
              TinB: trial_i,
              testNb: 999,
              target_score: target_scores_all[trial_counter],
              test_part: 'feedback'
            }
          };

          target_i = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]];; // reset

          // PUSH TO TIMELINE //
          timelineTask.push(fullscreenExp);
          timelineTask.push(feedback);

        } // conf or test loop

        trial_counter++;

      }; // trial
    }; // block

    var finish = {
      type: 'html-button-response-WH',
      stimulus: '<p>Fin de l&#39expe&#769rience!</p><p><b>Merci beaucoup pour votre participation !</b></p>',
      choices: ['Fin'],
      data: {
        blockNb: block_i,
        trialNb: trial_counter,
        TinB: trial_i,
        testNb: 999,
        target_score: target_scores_all[trial_counter],
        test_part: 'finish'
      }
    }

    // PUSH TO TIMELINE //
    timelineTask.push(finish)

    return timelineTask;

  }
