function block3gridsTaskTimeline(){
    var timelineTask = [];

    // ==== LOOP OF THE JEU DE MEMORY ==== //
    for (var trialInd = 0; trialInd < exp.nbTrials_block; trialInd++){
  
        // Initialise inputs
        let trialNbCurrent     = trialInd+1;
        let TSCurrent          = exp.TS[TSPt_b3[trialInd]];
        let rewCurrent         = exp.rew[rewPt_b3[trialInd]];
        let gridStimuliCurrent = gridStimuli_b3[trialInd];
        let gridIndexesCurrent = gridIndexesPt_b3[trialInd];
        let target_i           = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
        let target_corr_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the correct image
        let TD                 = 1;
        var nTS;
        let nCorrect       = 0;
        //let uCorrect       = 0; //uCorrect is the updated number of correct 
        let correct_i      = [0,0,0,0,0,0,0,0,0,0,0];
        let test_counter   = 0;
        let trial_success  = 0;
       
        
        // ==== ÉTAPE 1 - Choix du temps de mémorisation  ==== 
        // ==== Trial # & Effort Want ==== //
        // Inputs:
        // - Trial #
        // - Target Score
        // - Effort scale: min and max
  
        // Outputs:
        // - Effort chosen
        // - Effort chosen Reaction Time
  
  
        var effort_want = {
          type: 'html-slider-response-effort-want-WH',
          prompt: '<p>Block : 3/3    Exercice : '+trialNbCurrent+'/'+exp.nbTrials_block+'<p style="font-size:30px">Votre objectif est de mémoriser <b>'+TSCurrent+' paires de chiffres</b>.</p><p style="font-size:30px">Si vous atteignez cet objectif, vous gagnerez <b>'+rewCurrent+'</b> points. </p><div><br></div>',
          stimulus:'<p>Pendant combien de temps souhaitez-vous voir la grille ?</p>',
          min: exp.effLimits[0],
          max: exp.effLimits[1],
          start: function(){return randi(exp.effLimits[0],exp.effLimits[1]);},
          require_movement: true,
          effort: true,
          on_start: function(){
            // reset counters
            /*
            nCorrect       = 0;
            correct_i      = [0,0,0,0,0,0,0,0,0,0,0];
            test_counter   = 0;
            */
          },
          on_finish: function(data){
              var effortDuration = data.slider_response;
              console.log("I chose this many seconds:", data.slider_response);
            },
          data: {
            test_part: 'effort_want',
            get_data: 1, 
            trialNb: trialInd,
            blockInd: 3,
            target_score: TSCurrent,
            SE_eff: 999,
            reward: rewCurrent,
            nTS: 999,
            success: 999
          }
    
        }
    
        // Push to Timeline //
        timelineTask.push(fullscreenExp);
        timelineTask.push(effort_want);
        
        // ==== ÉTAPE 2 - Mémorisation ====
    
        // ==== Effort Phase ==== //
        // - Inputs:
        // - Grid Stimuli (all pairs present)
        // - Target Scores
  
        // Outputs:
        //
    
        var fixation = {
          type: 'html-button-response-WH',
          stimulus: '<p><b>Tenez-vous pre&#770t.e !</b></p>',
          choices: [],
          trial_duration: time.fixation,
          data: {
            trialNb: trialInd,
            get_data: 0,
            blockInd: 3,
            target_score: TSCurrent,
            test_part: 'fixation',
            SE_eff: 999,
            reward: rewCurrent,
            nTS: 999,
            success: 999
          }
        }; // fixation
    
        // Push to Timeline //
        timelineTask.push(fullscreenExp);
        timelineTask.push(fixation);
        
  
        var effort = {
          type: 'html-button-response-effort-WH',
          stimulus: gridStimuliCurrent,
          reward: rewCurrent,
          choices: [],
          trial_duration: function(){
            var CurrentTrialInd = jsPsych.data.getLastTrialData().values()[0]['trialNb'];
            var effortDuration = jsPsych.data.get().filter({test_part: 'effort_want','trialNb': CurrentTrialInd, blockInd: 3}).values()[0]['slider_response'];
            console.log("For ", CurrentTrialInd, " the effort Dur is", effortDuration*1000)
            return effortDuration*1000;
          },
          target_score: TSCurrent,
          timer: true, // do we show a timer of the amount of time left?
          data: {
            trialNb: trialInd,
            blockInd: 3,
            target_score: TSCurrent,
            SE_eff: 999,
            test_part: 'effort',
            reward: rewCurrent,
            nTS: 999,
            success: 999
          }
        }; // effort
    
        // Push to Timeline //
        timelineTask.push(effort);
    
  // ==== ÉTAPE 3 - TEST ====
  
        // ==== Test Phase ==== //
        // Inputs:
        // - Grid Stimuli (Per pair)
        // - Correct Location
        // Outputs:
        // - Location Responses
        // - Response Reaction Times
        // - Confidence (per pair)
        // - Confidence Reaction Time
    
        var testTrials      = [];
        
        // Initialise test locations
        for (var testInd = 0; testInd < TSCurrent; testInd++){
    
          var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
          // var pair_1st = 0; // for non-matching version of task, show numbers and test animals
          var pair_2nd = 1 - pair_1st;
    
          target_i[testInd]      = gridIndexesCurrent[testInd][pair_1st].map(function(v){return (v - 1)})
          target_corr_i[testInd] = gridIndexesCurrent[testInd][pair_2nd].map(function(v){return (v - 1)})
    
          testTrials.push({
            target_location:  target_i[testInd],
            correct_location: gridIndexesCurrent[testInd][pair_2nd].map(function(v){return (v - 1)}),
            target_image:     numbersImg[testInd]
            
          });        
          
    
        }; // Initialise test locations
    
    
        var test = {
          type: 'serial-reaction-time-mouse-WH',
          timeline: testTrials,
          grid: exp.grid,
          grid_square_size: exp.squareSize,
          response_ends_trial: true,
          highlight: time.highlight,
          allow_nontarget_responses: true,
          prompt: '<p id="jspsych-prompt" style="margin:0px"><p style="margin:0px"><b>Cliquez</b> sur l&#39autre chiffre de la paire.</p>',
          pre_target_duration: 0,
          choices: ['Je suis s&ucirc;r.e','Je ne suis pas s&ucirc;r.e'],
          on_finish: function(data){
            if (data.correct){
              nCorrect++
              console.log("NM: I am increasing the ncorrect counter here")
              correct_i[test_counter] = 1;
            }
            console.log("NM:Now the nCorrect is", nCorrect)
            if (nCorrect >= TSCurrent) {
              exCorrect++;
              pointsTotal += rewCurrent;
              trial_success = 1; 
              console.log("NM: here you are correct so exCorrect is now:", exCorrect, "and points total is:", pointsTotal);
            }
            test_counter++;
          },
          data: {
            test_part: 'test',
            get_data: 1,
            blockInd: 3,
            trialNb: trialInd,
            target_score: TSCurrent,
            SE_eff: 999,
            reward: rewCurrent,
            nTS: 999,
            success: 999
          }
        }; // test
    
        //console.log("For trial nb", trialNbCurrent, "with TS", TSCurrent, "the current grids are", gridIndexesCurrent, "and the target locs are", target_i, "and the correct locs are", target_corr_i, "and the correct data is", correct_i)
        // Push to Timeline //
        timelineTask.push(fullscreenExp);
        timelineTask.push(test);
  
        //LA FAUT METTRE THE FEEDBACK SECTION IN WHICH LA ON VA METTRE success = trial_success
  
  
  // ==== ÉTAPE 4 - QUESTIONS AUTO-ÉVALUATION ====
  
        // ==== E[# of Successes] ==== //
        // Inputs:
        // - Target Scores
        // Outputs:
        // - E[# of Successes]
        // - E[# of Successes] Reaction Time
    
        var EnSBtns = TSCurrent + 1;
        let EnSStr;
        EnSStr = [...Array(EnSBtns).keys()];
        var EnS = {
          type: 'html-button-response-WH',
          stimulus: '<p>Combien d&#39emplacements pensez-vous avoir retrouvé correctement ?</p>',
          choices: EnSStr.map(String),
          on_finish: function(data) {
            var ens_button = data.button_pressed;
            console.log("Button Pressed:", data.button_pressed);
          },
          data: {
            test_part: 'EnS',
            get_data: 1,
            blockInd: 3,
            trialNb: trialInd,
            target_score: TSCurrent,
            SE_eff: 999,
            reward: rewCurrent,
            nTS: 999,
            success: 999
          }
        }; // EnS
    
        // Push to Timeline //
        timelineTask.push(fullscreenExp);
        timelineTask.push(EnS);
        
  // ==== ÉTAPE 5 - FIN D'UN EXO ====
        var nextexo = {
          type: 'html-button-response-WH',
          stimulus:'<p> Vous avez fini exercice <b>'+trialNbCurrent+'/'+exp.nbTrials_block+' </b> du bloc <b> 3/3</b>.</p> <p> Quand vous êtes prêt.e.s, </p>',
          choices: trialNbCurrent < exp.nbTrials_block ? ['Passez au prochain exercice'] : ['Fin'],
          data: {
              test_part: 'next_exo',
              get_data: 1,
              blockInd: 3,
              trialNb: trialInd,
              target_score: 999,
              SE_eff: 999,
              reward: 999,
              nTS: 999,
              success: trial_success,
            }
        }
        timelineTask.push(fullscreenExp);
        timelineTask.push(nextexo);
  
      }; // ==== End Trial Loop ==== //

  
    
    return {timelineTask};
  
  } // function end