function SE(nbBlocks, nbTrials){

  // INITIALISATION //
  var timelineTask  = [];
  var trial_counter = 0; // counting the number of trials
  var flip_counter  = 1; // counting the number of flips on a trial
  var flip_fb;           // giving participant feedback on the number of flips they did
  var nCorrect      = 0; // the number of correct responses given by the pts
  var nClicked      = 0; // the number of guesses pt makes
  var nTS           = 0; // the number of target scores achieved by the pts
  var test_counter  = 0; // counter for looping through test trials during execution
  var correct_i     = [0,0,0,0,0,0,0,0]; // array of correct response indexes
  var clicked_i     = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the participants click
  var target_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
  var conf_counter  = 0; // counter for looping through confidence trials
  var nbTperB       = nbTrials/nbBlocks;
  var grid_dim      = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];
  var sliderIni     = Array(2);

  // Target Scores
  var target_scores = [4, 5, 6, 7];
  var target_scores_all = Array(nbBlocks-1);
  for (var nB = 0; nB < nbBlocks-1; nB++){
    target_scores_all[nB] = jsPsych.randomization.shuffleNoRepeats(target_scores)
  };

  var target_scores_all = target_scores_all.flat();

  // target_scores_all.unshift(...target_scores);

  // No test trials
  var conf_trials_idx = Array(target_scores.length);
  var conf_trials_TS = jsPsych.randomization.repeat(target_scores, 1);
  for (var i = 0; i < conf_trials_idx.length; i++) {
    var ii = randi(2,target_scores.length) + i*nbBlocks;
    if (ii > nbTrials){ii = nbTrials};
    conf_trials_idx[i] = ii-1; // index of location to insert conf trial
    target_scores_all.splice(conf_trials_idx[i], 0, conf_trials_TS[i]);
  };

  // Insert practice plus calibrations
  var flip_ini = {
    type: 'html-button-response-WH',
    stimulus: '<p>Lorsque vous e&#770tes pre&#770t.e à voir la grille, cliquez sur le bouton.</p>',
    choices: ['Continuer'],
    data: {
      blockNb: -1,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      test_part: 'calibration_ini',
      nTS: 999
    }
  }; // calibration_ini

  // FLIP //
  var flip = {
    type: 'animation-WH',
    stimuli: grid_stimuli[10],
    frame_time: time.flipSpeed,
    choices: jsPsych.NO_KEYS,
    data: {
      blockNb: -1,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      test_part: 'flip_cal',
      nTS: 999
    }
  };


  var calibration_ini = {
    type: 'html-button-response-WH',
    stimulus: '<p>Maintenant que vous avez vu la grille une fois, nous mesurerons votre capacité initiale à auto-évaluer correctement vos compétences mentales.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p>',
    choices: ['Continuer'],
    data: {
      blockNb: -1,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      test_part: 'calibration_ini',
      nTS: 999
    }
  }; // calibration_ini

  timelineTask.push(flip_ini)
  timelineTask.push(flip)
  timelineTask.push(calibration_ini)
  timelineTask.push(fullscreenExp)

  // SE CALIBRATION QUESTIONS //
  var target_scores_cal = [4, 6, 8];
  for (var cal_i = 0; cal_i < target_scores_cal.length; cal_i++){

    var SE_conf = {
      type: 'SE-confidence-slider-WH',
      range: 30,
      trial_duration: time.SEconf,
      prompt: '<p>Imaginez que le score cible était: <b>'+target_scores_cal[cal_i]+'</b>.</p><p><b>Combien de fois aurez-vous besoin de voir les chiffres de la grille pour atteindre le score cible ?</b></p><p>Utilisez les fle&#768ches gauche et droite pour positionner la barre. Utilizer les fle&#768ches du haut et du bas pour augmenter ou raccourcir la longueur de la barre.</p><p> Appuyez sur E&#769ntre&#769e pour confirmer votre choix.</p><p>Vous avez <b>3 minutes</b> pour re&#769pondre.</p>',
      start: sliderIni,
      on_start: function(trial){
        sliderIni[0]     = randi(0,29);
        sliderIni[1]     = randi(sliderIni[0],29);
        trial.start = sliderIni;
      },
      data: {
        blockNb: -1,
        trialNb: cal_i,
        TinB: cal_i,
        testNb: 999,
        target_score: target_scores_cal[cal_i],
        test_part: 'SE_slider_cal',
        nTS: 999
      }
    };

    timelineTask.push(SE_conf)
    timelineTask.push(fullscreenExp)

  }; // SE CALIBRATION QUESTIONS

  var task_start = {
    type: 'html-button-response-WH',
    stimulus: '<p>Merci !</p><p>Maintenant l&#39expérience principale va commencer.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p>',
    choices: ['Continuer'],
    data: {
      blockNb: -1,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      test_part: 'task_start',
      nTS: 999
    }
  }; // calibration_ini

  timelineTask.push(task_start)
  timelineTask.push(fullscreenExp)


  // START OF BLOCK //
  for (var block_i = 0; block_i < nbBlocks; block_i++) {
    var block_n = block_i + 1;

    // // BLOCK NUMBER //
    // var block_number = {
    //   type: 'html-button-response-WH',
    //   stimulus: '<p>C&#39est le de&#769but du bloc <b>'+block_n+'</b>.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p>',
    //   choices: ['C&#39est parti !'],
    //   data: {
    //     blockNb: block_i,
    //     trialNb: trial_counter,
    //     TinB: 999,
    //     testNb: 999,
    //     target_score: target_scores_all[trial_counter],
    //     test_part: 'blockNb'
    //   }
    // }; // block number

    // timelineTask.push(block_number)

    // TRIAL LOOP //
    for (var trial_i = 0; trial_i < nbTperB; trial_i++) {

      var trial_n = trial_i + 1;
      var nbTrial_counter = trial_counter+1;

      // TRIAL NUMBER and TARGET SCORE //
      var trial_number = {
        type: 'html-button-response-WH',
        stimulus: '<p>C&#39est le de&#769but de l&#39exercice <b>'+nbTrial_counter+'</b>.</p><p style="font-size:30px">Le score cible pour cet exercice est: <b>'+target_scores_all[trial_counter]+'</b>.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p>',
        choices: ['C&#39est parti !'],
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: target_scores_all[trial_counter],
          test_part: 'trialNb',
          nTS: 999
        }
      }; // trial number

      timelineTask.push(trial_number)


      // SE QUESTION //
      var SE_conf = {
        type: 'SE-confidence-slider-WH',
        range: 30,
        trial_duration: time.SEconf,
        prompt: '<p>Le score cible: <b>'+target_scores_all[trial_counter]+'</b>.</p><p><b>Combien de fois aurez-vous besoin de voir les chiffres de la grille pour atteindre le score cible ?</b></p><p>Utilisez les fle&#768ches gauche et droite pour positionner la barre. Utilizer les fle&#768ches du haut et du bas pour augmenter ou raccourcir la longueur de la barre.</p><p> Appuyez sur E&#769ntre&#769e pour confirmer votre choix.</p><p>Vous avez <b>3 minutes</b> pour re&#769pondre.</p>',
        start: sliderIni,
        on_start: function(trial){
          sliderIni[0]     = randi(0,29);
          sliderIni[1]     = randi(sliderIni[0],29);
          trial.start = sliderIni;
        },
        data: {
          blockNb: block_i,
          trialNb: trial_counter,
          TinB: trial_i,
          testNb: 999,
          target_score: target_scores_all[trial_counter],
          test_part: 'SE_slider',
          nTS: 999
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
          test_part: 'flip',
          nTS: 999
        }
      };

      // REWATCH QUESTION //
      var rewatch = {
        stimulus: '<p>Souhaitez-vous revoir la grille ?</p><p>Le score cible pour cet exercice est: <b>'+target_scores_all[trial_counter]+'</b>.</p><p>Vous avez <b>5 secondes</b> pour re&#769pondre!</p>',
        type: 'html-button-response-WH',
        prompt: function(){
          var rewatch_prompt = '<p>Vous avez vu la grille <b>'+flip_counter+'</b> fois.</p>';
          return rewatch_prompt;},
          choices: ['Oui','Non'],
          trial_duration: time.rewatch,
          on_finish: function(data){
            response = data.button_pressed;
            if (response == 0){
              flip_counter++;
            } else {
              data.flips = flip_counter;
              flip_fb      = flip_counter;
              flip_counter = 1;
            }
          },
          data: {
            blockNb: block_i,
            trialNb: trial_counter,
            TinB: trial_i,
            testNb: 999,
            target_score: target_scores_all[trial_counter],
            test_part: 'rewatch',
            nTS: 999
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
          // if (trial_counter == 0){

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
              target_score: target_scores_all[trial_counter],
              test_part: 'test_conf',
              nTS: 999
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
              test_part: 'fixation',
              nTS: 999
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

            //    var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
            var pair_1st = 0; // for non-matching version of task, show numbers and test animals
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
            prompt: '<p id="jspsych-prompt" style="margin:0px">Le score cible pour cet exercice est: <b>'+target_scores_all[trial_counter]+'</b>. <b>Cliquez</b> sur l&#39emplacement de l&#39autre paire.</p>',
            pre_target_duration: 0,
            choices: ['Montrez-moi la prochaine paire'],
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
              };
              if (isNaN(clicked[0])){
              } else {
                nClicked++;
              };
              if (nClicked == data.target_score){
                nClicked = 0;
                jsPsych.endCurrentTimeline();
              };
            },
            data: {
              blockNb: block_i,
              trialNb: trial_counter,
              TinB: trial_i,
              testNb: test_i,
              target_score: target_scores_all[trial_counter],
              test_part: 'test',
              nTS: 999
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
              test_part: 'post_test_conf',
              nTS: 999
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
            // prompt: function(){
            //   var feedback_prompt = '<p style="font-size:25px; margin:0px">Votre score: <b>'+nCorrect+'/8 !</b> Vous avez vu la grille <b>'+flip_fb+'</b> fois.';
            //   return feedback_prompt;
            // },
            feedback: true,
            correct_responses: function(){return correct_i},
            target_score: target_scores_all[trial_counter],
            on_start: function(feedback){
              feedback.clicked = clicked_i;
              var TS = feedback.target_score;
              if (nCorrect >= TS){
                nTS++;
              };
              feedback.prompt = '<p style="font-size:25px; margin:0px">Votre score: <b>'+nCorrect+'/'+feedback.target_score+' !</b> Vous avez vu la grille <b>'+flip_fb+'</b> fois.';
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
              test_part: 'feedback',
              nTS: 999
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

    var nbTrialsRewarded = nbTrials-target_scores.length;
    var finish = {
      type: 'html-button-response-WH',
      stimulus: function(){
        var finish_stim = '<p>Le test de me&#769tacognition est maintenant termine&#769.</p><p>Vous avez reussi <b>'+nTS+' exercises sur '+nbTrialsRewarded+'</b>.</p><p><b>Merci beaucoup pour votre participation !</b></p>';
        return finish_stim;
      },
      choices: ['Fin'],
      on_finish: function(data){
        data.nTS = nTS;
      },
      data: {
        blockNb: block_i,
        trialNb: trial_counter,
        TinB: trial_i,
        testNb: 999,
        target_score: target_scores_all[trial_counter],
        test_part: 'finish',
        nTS: nTS
      }
    }

    // PUSH TO TIMELINE //
    timelineTask.push(finish)

    return timelineTask;

  }
