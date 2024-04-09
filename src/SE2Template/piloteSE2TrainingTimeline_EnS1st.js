function piloteSE2TrainingTimeline(){

    // INITIALISATION //
    var timelineTask_train  = [];
    var nCorrect_train      = 0; // the number of correct responses given by the pts
    var correct_i_train     = [0,0,0,0,0,0,0,0]; // array of correct response indexes
    var test_counter_train  = 0; // counter for looping through test trials during execution
    var train_TS            = exp.TS[0];
    var train_rew           = 1;
    var target_i_train      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
    var target_corr_i_train = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the correct image
    var grid_dim_train      = exp.grids[0];
    var points_total_train  = 0;
    var squareSize          = exp.squareSize[0];
  
  
  
    // First instructions
    var instructions0 = {
      type: 'html-button-response-WH',
      stimulus: '<p style="font-size:50px; font-weight:bold; margin-top:10px;">Jeu de mémory</p><p style="font-size:35px">Veuillez lire attentivement les instructions qui vont suivre.</p>',
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
  
    var instructions1 = {
      type: 'html-button-response-WH',
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
        type: 'html-button-response-WH',
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
        type: 'html-button-response-WH',
        stimulus: [instrImg_html[2]],
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
      timelineTask_train.push(instructions3);
    
    var instructions4 = {
        type: 'html-button-response-WH',
        stimulus: [instrImg_html[3]],
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
      timelineTask_train.push(instructions4);
    
    var instructions5 = {
        type: 'html-button-response-WH',
        stimulus: [instrImg_html[4]],
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
      timelineTask_train.push(instructions5);
    
    // ==== ÉTAPE 1 - Choix du temps de mémorisation ====
    var instructions6 = {
      type: 'html-button-response-WH',
      stimulus: [instrImg_html[5]],
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
    timelineTask_train.push(instructions6);
  
    
    // How much "effort" does the participant want?
    var effort_want_train = {
      type: 'html-slider-response-effort-want-WH',
      prompt: '<p>Exercice d&#39entra&icirc;nement.</p><p>Votre objectif est de mémoriser <b>'+train_TS+' paires de chiffres</b>.</p><br></div>',
      // prompt: '<p>Exercice d&#39entra&icirc;nement.</p><p></p><p>Si vous retrouvez correctement les emplacements de toutes les paires, vous recevrez un bonus de <br><b>'+train_rew+' point</b>.</p><div><br></div>',
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
  
    // Push to timeline //
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(effort_want_train);
  
    // ==== ÉTAPE 2 - Mémorisation ====
    var instructions7 = {
      type: 'html-button-response-WH',
      stimulus: [instrImg_html[6]],
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
    timelineTask_train.push(instructions7);
  
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
    
    console.log(gridStimuliTrain);

    // effort //
    var effort_train = {
      type: 'html-button-response-pilote-NM',
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
  
    // PUSH TO TIMELINE //
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(effort_train);
  
    // ==== ÉTAPE 3 - TEST PHASE ====
    var instructions8 = {
      type: 'html-button-response-WH',
      stimulus: [instrImg_html[7]],
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
    timelineTask_train.push(instructions8);
  
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
        grid_square_size: squareSize, //screen.height/10,
        response_ends_trial: true,
        highlight: time.highlight,
        allow_nontarget_responses: true,
        prompt: '<p id="jspsych-prompt"><p style="margin:0px"><b>Cliquez</b> sur l&#39autre chiffre de la paire.</p>',
        pre_target_duration: 0,
        choices: ['OK, je suis s&ucirc;r.e','OK, mais je ne suis pas s&ucirc;r.e'],
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
    console.log("The target locs are", target_i_train, "and the correct are", target_corr_i_train, ". The correct data is", correct_i_train)
      // PUSH TO TIMELINE //
      timelineTask_train.push(fullscreenExp);
      timelineTask_train.push(test_train);
  
    

 // ==== ÉTAPE 4 - Auto-évaluation ====
    var instructions9 = {
        type: 'html-button-response-WH',
        stimulus: [instrImg_html[8]],
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
      timelineTask_train.push(instructions9);
   
   // 1 - EXPECTATION QUESTION //
    
    //function added by Nour to dynamically change how many pairs you want in the train period 
   function createEnS_train() {
      var train_TS = exp.TS[0];
      var choices = [];
      for (var i = 0; i <= train_TS; i++) {
          choices.push(i.toString());
      }
  
      var EnS_train = {
          type: 'html-button-response-WH',
          stimulus: '<p>Combien d&#39emplacements pensez-vous avoir retrouvé correctement? ?</p>',
          choices: choices,
          data: {
              trialNb: 999,
              target_score: train_TS,
              reward: train_rew,
              test_part: 'post_test_conf_train',
              nTS: 999
          }
      };
  
      return EnS_train;
  }
      var EnS_train = createEnS_train();
  
    timelineTask_train.push(fullscreenExp);
    timelineTask_train.push(EnS_train);
  
 // 2 - Mental load question //

 var mental_load = {
  type: 'html-slider-response-percentage-NM',
  prompt: '<p> Comment évaluerez vous l\'intensité de votre effort mental pendant cet exercice?</p><div><br></div>',
  stimulus:'<p> Lors de cet exercice, l\'intensité de mon effort mental était... </p>',
  min: 0,
  max: 100,
  start: function(){return randi(0,100)},
  require_movement: true,
  effort: true,
  on_finish: function(data){
    var mental_intensity = data.slider_response;
  },
  data: {
    trialNb: 999,
    target_score: train_TS,
    test_part: 'mental_load',
    nTS: 999
  }

}

// Push to Timeline //
timelineTask_train.push(fullscreenExp);
timelineTask_train.push(mental_load);



 //3 - Difficulty question // 
 
// Inputs:
// - Trial #
// - Target Score
// - Difficulty scale: very easy very difficult 
// Outputs:
// - Effort chosen
// - Effort chosen Reaction Time

var difficulty = {
  type: 'html-slider-response-difficulty-NM',
  prompt: '<p> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbspComment évaluerez vous la difficulté de cet exercice? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp<div><br></div>',
  stimulus:'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;J\'ai trouvé que cet exercice était ... &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>',
  min: 0,
  max: 100,
  start: function(){return randi(0,100);},
  require_movement: true,
  effort: true,
  on_finish: function(data){
    var trial_difficulty = data.slider_response;
  },
  data: {
    trialNb: 999,
    target_score: train_TS,
    test_part: 'effort_want',
    nTS: 999
  }

}

// Push to Timeline //
timelineTask_train.push(fullscreenExp);
timelineTask_train.push(difficulty);
    
  
 // ==== ÉTAPE 5 - Résultat ====
    var instructions10 = {
      type: 'html-button-response-WH',
      stimulus: [instrImg_html[9]],
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
    timelineTask_train.push(instructions10);
  
    var feedback_with_grid_train = {
      type: 'html-button-response-fb-WH',
      stimulus: gridStimuliTrain,
      grid: true,
      choices: ['Terminer l&#39entra&icirc;nement'],
      target: target_i_train,
      correct_responses: function(){return correct_i_train},
      target_score: train_TS,
      target_correct: target_corr_i_train,
      data: {
        trialNb: 999,
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
          
            feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect_train+'</b>' + emplacements + '!</p><p>Vous avez réussi l\'exercice.</p>';
        
        } else {
          feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect_train+'</b>' + emplacements + '!</p><p>Vous n\'avez pas réussi l\'exercice.</p>';
        }
      },
      on_finish: function(data){
        data.nTS = points_total_train;
      },
      data: {
        trialNb: 999,
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
    var instructions11 = {
      type: 'html-button-response-WH',
      stimulus: [instrImg_html[10]],
      choices: ['Commencer le test principal !'],
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
  
  
  
  
    return timelineTask_train;
  }
  