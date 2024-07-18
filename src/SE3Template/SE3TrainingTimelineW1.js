function SE3TrainingTimelineW1(){

    // INITIALISATION //
    var timelineTask_train  = [];
    var nCorrect_train      = 0; // the number of correct responses given by the pts
    var correct_i_train     = [0,0,0,0,0,0,0,0]; // array of correct response indexes
    var test_counter_train  = 0; // counter for looping through test trials during execution
    var train_TS            = 4; // change it to 3 if we do 5, 7 , 9 instead 
    var train_rew           = 1; 
    var target_i_train      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
    var target_corr_i_train = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the correct image
    var grid_dim_train      = exp.grid;
    var points_total_train  = 0;
  
    // Presentation slide 
    var instructions0 = {
      type: 'html-button-response-instructions-NM',
      stimulus: '<p style="font-size:70px">Jeu de mémory</p><p style="font-size:50px">Veuillez lire attentivement les instructions qui vont suivre.</p>',
      choices: ['Ok'],
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
  
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions0);
  
    //Instructions slide 1 - 11
    var instructions1 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[0]],
      choices: ['Suivant'],
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
  
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions1);
  
    var instructions2 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[1]],
      choices: ['Suivant'],
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
  
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions2);


    var instructions3 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[2]],
        choices: ['Suivant'],
        blocked_duration: 3000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }
    
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions3);
    
    var instructions4 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[3]],
        choices: ['Suivant'],
        blocked_duration: 3000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }
    
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions4);
    
    var instructions5 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[4]],
        choices: ['Suivant'],
        blocked_duration: 3000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }
    
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions5);

    var instructions6 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[5]],
        choices: ['Suivant'],
        blocked_duration: 2000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }
    
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions6);
    
    var instructions7 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[6]],
        choices: ['Suivant'],
        blocked_duration: 4000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }

      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions7);
    
    var instructions8 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[7]],
        choices: ['Suivant'],
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }

      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions8);

    var instructions9 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[8]],
        choices: ['Suivant'],
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }

      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions9);

    
    // === Step 1 - Time choice 
    var instructions10 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[9]],
        choices: ['Suivant'],
        blocked_duration: 3000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }

      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions10);

    var instructions11 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[10]],
        choices: ['Essayer'],
        blocked_duration: 2000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }

      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions11);
    
  
  
    // effort want slider
    var effort_want_train = {
      type: 'html-slider-response-effort-want-WH',
      prompt: '<p>Exercice d&#39entra&icirc;nement.</p><p>Votre objectif est de mémoriser <b style="color:darkblue;">'+train_TS+'</b> <span  style="color:darkblue;">  paires de chiffres</span>.</p><p>Si vous atteignez cet objectif, vous recevrez un bonus de <b style="color:darkgreen;">'+train_rew+'</b> <span  style="color:darkgreen;"> point</span>.</p><div><br></div>',
      stimulus:'<p>Pendant combien de temps souhaitez-vous voir la grille ?</p>',
      labels: [''],
      min: exp.effLimits[0],
      max: exp.effLimits[1],
      start: function(){return randi(exp.effLimits[0],exp.effLimits[1]);},
      require_movement: true,
      effort: true,
      // on_finish: function(data){
      //   var effortDuration_train = data.slider_response;
      // },
      data: {
        trialNb: 999,
        target_score: train_TS,
        reward: train_rew,
        test_part: 'effort_want_train',
        nTS: 999
      }
    }; // effort want
  
    // ~push to timeline 
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(effort_want_train);
  
    // ==== Step 2 - mémorisation 
    var instructions12 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[11]],
      choices: ['Essayer'],
      blocked_duration: 3000,
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }

    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions12);
  
   //see grid to memorise
    var effort_phase = {
      type: 'html-button-response-WH',
      stimulus: '<p><b>Tenez-vous pre&#770t.e !</b></p>',
      choices: [],
      trial_duration: time.fixation,
      data: {
        trialNb: 999,
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
    var effort_train = {
      type: 'html-button-response-effort-WH',
      stimulus: [gridStimuliTrain],
      choices: [],
      trial_duration: function(){
        var effortDuration_train = jsPsych.data.get().filter({test_part: 'effort_want_train'}).values()[0]['slider_response'];
        return effortDuration_train*1000;
      },
      reward: train_rew,
      target_score: train_TS,
      timer: true,
      data: {
        trialNb: 999,
        target_score: train_TS,
        reward: train_rew,
        test_part: 'effort_train',
        nTS: 999
      }
    }; // effort
  
    // ~push to timeline //
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(effort_train);
  
    // Step 3 - test 
    var instructions13 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[12]],
      choices: ['Suivant'],
      blocked_duration: 3000,
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
  
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions13);

    var test_phase = {
      type: 'html-button-response-WH',
      stimulus: '<p><b>Tenez-vous pre&#770t.e !</b></p>',
      choices: [],
      trial_duration: time.fixation,
      data: {
        trialNb: 999,
        target_score: train_TS,
        reward: train_rew,
        test_part: 'fixation',
        nTS: 999
      }
    }; // fixation
  
    // PUSH TO TIMELINE //
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(test_phase);
  
    var testTrials      = [];
  
    // TESTING PHASE //
    for (var testInd = 0; testInd < train_TS; testInd++) {
  
      var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
      // var pair_1st = 0; // for non-matching version of task, show numbers and test animals
      var pair_2nd = 1 - pair_1st;
  
      target_i_train[testInd]      = gridIndexesTrain[0][testInd][pair_1st].map(function(v){return (v - 1)});
      target_corr_i_train[testInd] = gridIndexesTrain[0][testInd][pair_2nd].map(function(v){return (v - 1)});
  
      testTrials.push({
        target_location:  target_i_train[testInd],
        correct_location: gridIndexesTrain[0][testInd][pair_2nd].map(function(v){return (v - 1)}),
        target_image:     numbersImg[testInd]
      });
  
    }; // initialise test locations
  
    var test_train = {
      type: 'serial-reaction-time-mouse-WH',
      timeline: testTrials,
      grid: grid_dim_train,
      grid_square_size: exp.squareSize,
      response_ends_trial: true,
      highlight: time.highlight,
      allow_nontarget_responses: true,
      prompt: '<p id="jspsych-prompt"><p style="margin:0px"><b>Cliquez</b> sur l&#39autre chiffre de la paire.</p>',
      pre_target_duration: 0,
      choices: ['Je suis s&ucirc;r.e','Je ne suis pas s&ucirc;r.e'],
      on_finish: function(data){
        if (data.correct){
          nCorrect_train++
          correct_i_train[test_counter_train] = 1;
        };
        test_counter_train++
      },
      data: {
        trialNb: 999,
        target_score: train_TS,
        reward: train_rew,
        test_part: 'test_train',
        nTS: 999
      }
    }; // test
  
    // PUSH TO TIMELINE //
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(test_train);

    // Step 4 - Auto-évaluation 
    var instructions14 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[13]],
      choices: ['Suivant'],
      blocked_duration: 3000,
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
  
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions14);

    var EnSBtns = train_TS + 1;
    let EnSStr;
    EnSStr = [...Array(EnSBtns).keys()];
    var EnS = {
      type: 'html-button-response-WH',
      stimulus: '<p>Combien de paires pensez-vous avoir correctement replacé sur la grille ? </p>',
      choices: EnSStr.map(String),
      data: {
        trialNb: 999,
        target_score: train_TS,
        reward: train_rew,
        test_part: 'EnS',
        nTS: 999
      }
    }; // En
  
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(EnS);
  
    //Résumé jue de mémory
    var instructions15 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[14]],
      choices: ['Suivant'],
      blocked_duration: 2000,
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions15);

      // SE question practice 
      var instructions16 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[15]],
        choices: ['Suivant'],
        blocked_duration: 3000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions16);

      var instructions17 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[16]],
        choices: ['Suivant'],
        blocked_duration: 3000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions17);

      var instructions18 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[17]],
        choices: ['Essayer'],
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions18);

      var sequestion_train = {
        type: 'html-slider-response-percentage-NM',
        stimulus: '<p style="text-align: left;">Quelle est la probabilité que vous réussissez un exercice dans lequel vous: </p>'
        + '<p style="text-align: left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- investissez <b style="color:red;">25</b> secondes</p>'
        + '<p style="text-align: left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- pour réviser <b style="color:darkblue;">4</b> paires </p>'
        + '<p style="text-align: left;"></p>'
        + '<p style="text-align: left;"><i><b>Rappel:</b> réussir l’exercice c’est se souvenir de l’emplacement de toutes les paires</i></p>',
        min: 0,
        max: 100,
        start: function(){return randi(0,100)},
        require_movement: true,
        effort: true,
        on_finish: function(data){
          var expectedsuccess = data.slider_response;
        },
        data: {
          trialNb: 999,
          target_score: train_TS,
          test_part: 'mental_load',
          nTS: 999
        }
      
      }
    
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(sequestion_train);


      var instructions19 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[18]],
        choices: ['Voir résultats globaux'],
        blocked_duration: 1000,
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions19);

      
      //exemple global feedback 
      var globalfeedback = {
        type: 'html-button-response-fb-WH',
        stimulus: '',
        grid: false,
        choices: ['Suivant'],
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
              feedback.stimulus = '<p style="margin:0px">Vous avez réussi <b> 1/1 </b>exercice.</p><p>Vous avez gagné un total de '+feedback.reward+' point.</p>';
            } 
          } else {
            feedback.stimulus = '<p style="margin:0px">Vous avez réussi <b> 0/1</b> exercice. </p><p>Vous avez gagné un total de 0 points.</p>';
          }
        },
        on_finish: function(data){
          data.nTS = points_total_train;
        },
        data: {
          trialNb: 999,
          target_score: train_TS,
          reward: train_rew,
          test_part: 'feedback_specific_train',
          nTS: 999
        }
      }; // fb without grid
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(globalfeedback);


      var instructions20 = {
        type: 'html-button-response-instructions-NM',
        stimulus: [instrImg_html[19]],
        choices: ['Voir résultats spécifiques'],
        data: {
          trialNb: 999,
          target_score: 999,
          reward: 999,
          test_part: 'instructions',
          nTS: 999
        }
      }
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(instructions20);
  
    var feedback_sans_grid_train = {
      type: 'html-button-response-fb-WH',
      stimulus: '',
      grid: false,
      choices: ['Terminer l&#39entra&icirc;nement'],
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
            feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect_train+'</b>' + emplacements + ' sur <b>'+ TS_current +' </b>!</p><p>Vous avez gagné '+feedback.reward+' point.</p>';
          } else {
            feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect_train+'</b>' + emplacements + ' sur <b>'+ TS_current +'</b>!</p><p>Vous avez gagné '+feedback.reward+' points.</p>';
          }
        } else {
          feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect_train+'</b>' + emplacements + ' sur <b>'+ TS_current +'</b>!</p><p>Vous avez gagné 0 points.</p>';
        }
      },
      on_finish: function(data){
        data.nTS = points_total_train;
      },
      data: {
        trialNb: 999,
        target_score: train_TS,
        reward: train_rew,
        test_part: 'feedback_specific_train',
        nTS: 999
      }
    }; // fb without grid
  
  
    // PUSH TO TIMELINE //
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(feedback_sans_grid_train);
  
    var instructions21 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[20]],
      choices: ['Suivant'],
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions21);
  
    var instructions22 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[21]],
      choices: ['Suivant'],
      blocked_duration: 3000,
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions22);

    var instructions23 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[22]],
      choices: ['Suivant'],
      blocked_duration: 3000,
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions23);

    var instructions24 = {
      type: 'html-button-response-instructions-NM',
      stimulus: [instrImg_html[23]],
      choices: ['Commencer'],
      blocked_duration: 3000,
      data: {
        trialNb: 999,
        target_score: 999,
        reward: 999,
        test_part: 'instructions',
        nTS: 999
      }
    }
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(instructions24);
  
   
  
  
    return timelineTask_train;
  }