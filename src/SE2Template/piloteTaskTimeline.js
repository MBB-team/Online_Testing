function piloteTaskTimeline(){

    // Initialise Variables
    var timelineTask = [];
    var pointsTotal = 0;
  
  
    // ==== Start Trial Loop ==== //
    for (var trialInd = 0; trialInd < exp.nbTrials; trialInd++){
  
      // Initialise inputs
      let trialNbCurrent     = trialInd+1;
      let TSCurrent          = exp.TS[TSPt[trialInd]];
      let confCurrent        = confPt[trialInd];
      let gridsCurrent       = gridsPt[trialInd];
      let lettersCurrent     = lettersPt[trialInd];
      let gridStimuliCurrent = gridStimuli[trialInd];
      let gridIndexesCurrent = gridIndexesPt[trialInd];
      let target_i           = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
      let target_corr_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the correct image
      let TD                 = 1;
      var nTS;
  
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
        prompt: '<p> Exercice : '+trialNbCurrent+'/'+exp.nbTrials+'.<p style="font-size:30px">Votre objectif est de mémoriser <b>'+TSCurrent+' paires de chiffres</b>.</p><div><br></div>',
        stimulus:'<p>Pendant combien de temps souhaitez-vous voir la grille ?</p>',
        min: exp.effLimits[0],
        max: exp.effLimits[1],
        start: function(){return randi(exp.effLimits[0],exp.effLimits[1]);},
        require_movement: true,
        effort: true,
        on_start: function(){
          // reset counters
          nCorrect       = 0;
          correct_i      = [0,0,0,0,0,0,0,0,0,0,0];
          test_counter   = 0;
        },
        on_finish: function(data){
          var effortDuration = data.slider_response;
        },
        data: {
          trialNb: trialInd,
          target_score: TSCurrent,
          test_part: 'effort_want',
          nTS: 999
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
          target_score: TSCurrent,
          test_part: 'fixation',
          nTS: 999
        }
      }; // fixation
  
      // Push to Timeline //
      timelineTask.push(fullscreenExp);
      timelineTask.push(fixation);
  
      var effort = {
        type: 'html-button-response-pilote-NM',
        stimulus: gridStimuliCurrent,
        choices: [],
        trial_duration: function(){
          var CurrentTrialInd = jsPsych.data.getLastTrialData().values()[0]['trialNb'];
          var effortDuration = jsPsych.data.get().filter({test_part: 'effort_want','trialNb': CurrentTrialInd}).values()[0]['slider_response'];
          return effortDuration*1000;
        },
        target_score: TSCurrent,
        timer: true, // do we show a timer of the amount of time left?
        data: {
          trialNb: trialInd,
          target_score: TSCurrent,
          test_part: 'effort',
          nTS: 999
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
        grid: exp.grids[gridsCurrent],
        grid_square_size: exp.squareSize[gridsCurrent],
        response_ends_trial: true,
        highlight: time.highlight,
        allow_nontarget_responses: true,
        prompt: '<p id="jspsych-prompt" style="margin:0px"><p style="margin:0px"><b>Cliquez</b> sur l&#39autre chiffre de la paire.</p>',
        pre_target_duration: 0,
        choices: ['OK, je suis s&ucirc;r.e','OK, mais je ne suis pas s&ucirc;r.e'],
        on_finish: function(data){
          if (data.correct){
            nCorrect++
            correct_i[test_counter] = 1;
          }
          test_counter++;
        },
        data: {
          trialNb: trialInd,
          target_score: TSCurrent,
          test_part: 'test',
          nTS: 999
        }
      }; // test
  
      //console.log("For trial nb", trialNbCurrent, "with TS", TSCurrent, "the current grids are", gridIndexesCurrent, "and the target locs are", target_i, "and the correct locs are", target_corr_i, "and the correct data is", correct_i)
      // Push to Timeline //
      timelineTask.push(fullscreenExp);
      timelineTask.push(test);


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
        data: {
          trialNb: trialInd,
          target_score: TSCurrent,
          test_part: 'EnS',
          nTS: 999
        }
      }; // EnS
  
      // Push to Timeline //
      timelineTask.push(fullscreenExp);
      timelineTask.push(EnS);

      // ==== Mental load ==== //
      // Inputs:
      // - Trial #
      // - Target Score
      // - Effort scale: min and max
      // Outputs:
      // - Effort chosen
      // - Effort chosen Reaction Time
  
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
          trialNb: trialInd,
          target_score: TSCurrent,
          test_part: 'mental_load',
          nTS: 999
        }
  
      }
  
      // Push to Timeline //
      timelineTask.push(fullscreenExp);
      timelineTask.push(mental_load);
  
      
      // ==== Difficulty ==== //
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
          trialNb: trialInd,
          target_score: TSCurrent,
          test_part: 'effort_want',
          nTS: 999
        }
  
      }
  
      // Push to Timeline //
      timelineTask.push(fullscreenExp);
      timelineTask.push(difficulty);
     

      
      // ==== Feedback ==== //
      // Inputs:
      // - # of Correct pairs
      // - Grid Stimuli (all pairs) - if participant choses to see
      // - Correct/Incorrect pairs
  
      var feedback_sans_grid = {
        type: 'html-button-response-fb-WH',
        stimulus: '',
        grid: false,
        choices: ['Montrez-moi la grille','Passer au prochain exercice'],
        target: target_i,
        correct_responses: function(){return correct_i},
        target_score: TSCurrent,
        target_correct: target_corr_i,
        on_start: function(feedback){
          let TSCurrent       = feedback.target_score;
          let emplacementsStr = nCorrect==1 ? ' emplacement ':' emplacements ';
          if (nCorrect >= TSCurrent){
            pointsTotal++;
            nTS++;
            feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacementsStr + '!</p><p> Bravo, vous avez réussi cet exercice </p>';
          } else {
            feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacementsStr + '!</p><p> Malheureusement, vous n\'avez pas réussi cet exercice. </p>';
          };
        },
        on_finish: function(data){ // reset counters
          if (data.button == 1){
            nCorrect       = 0;
            correct_i      = [0,0,0,0,0,0,0,0];
            test_counter   = 0;
          }
        },
        data: {
          trialNb: trialInd,
          target_score: TSCurrent,
          test_part: 'feedback_no_grid',
          nTS: 999
        }
      }; // feedback_sans_grid
  
      // PUSH TO TIMELINE //
      timelineTask.push(fullscreenExp);
      timelineTask.push(feedback_sans_grid);
  
  
      var feedback_with_grid = {
        type: 'html-button-response-fb-WH',
        stimulus: gridStimuliCurrent,
        grid: true,
        choices: ['Passer au prochain exercice'],
        target: target_i,
        correct_responses: function(){return correct_i},
        target_score: TSCurrent,
        target_correct: target_corr_i,
        data: {
          trialNb: trialInd,
          target_score: TSCurrent,
          test_part: 'feedback_grid',
          nTS: 999
        }
      }; // fb with grid
  
      // CONDITIONAL FOR IF PARTICIPANT WANTS TO SEE FEEDBACK GRID//
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
      };
  
      timelineTask.push(if_explicit_feedback);
  
    }; // ==== End Trial Loop ==== //
  
  
    // ==== Finish Screen ==== //
    // Inputs:
    // - # of Correct Target Scores
    // - # of Points earned
  
    var finish = {
      type: 'html-button-response-WH',
      stimulus: function(){
        var max_points = exp.max_points;
        var total_points = pointsTotal + jsPsych.data.get().filter({test_part:'feedback_train'}).values()[0].nTS
        var points_fin = total_points == 1 ? 'exercice':'exercices';
        var finish_stim = '<p>Le test de me&#769moire est maintenant termine&#769.</p><p>En total, vous avez réussi : <b>'+total_points+' '+points_fin+'</b> sur 16.</p><p><b>Merci beaucoup pour votre participation !</b></p>';
        return finish_stim;
      },
      choices: ['Fin'],
      data: {
        trialNb: 999,
        target_score: 999,
        test_part: 'finish',
        nTS: 999
      }
    }
  
    timelineTask.push(finish);
  
    return timelineTask
  
  } // function end