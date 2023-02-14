function SE2TaskTimeline(){

  // Initialise Variables
  var timelineTask = [];
  var pointsTotal = 0;


  // ==== Start Trial Loop ==== //
  for (var trialInd = 0; trialInd < exp.nbTrials; trialInd++){

    // Initialise inputs
    let trialNbCurrent     = trialInd+1;
    let rewCurrent         = exp.rew[rewPt[trialInd]];
    let TSCurrent          = exp.TS[TSPt[trialInd]];
    let gridStimuliCurrent = gridStimuli[trialInd];
    let gridIndexesCurrent = gridIndexesPt[trialInd];
    let target_i           = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
    let target_corr_i      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the correct image
    let TD                 = 1;
    var nTS;

    // ==== Trial # & Effort Want ==== //
    // Inputs:
    // - Trial #
    // - Reward
    // - Target Score
    // - Effort scale: min and max
    // Outputs:
    // - Effort chosen
    // - Effort chosen Reaction Time

    var effort_want = {
      type: 'html-slider-response-effort-want-WH',
      prompt: '<p> Exercice : '+trialNbCurrent+'/'+exp.nbTrials+'.<p style="font-size:30px">Votre objectif est de mémoriser <b>'+TSCurrent+' paires de chiffres</b>.</p><p style="font-size:30px">Si vous atteignez cet objectif, vous recevrez un bonus de <b>'+rewCurrent+'</b>.</p><div><br></div>',
      stimulus:'<p>Pendant combien de temps souhaitez-vous voir la grille ?</p>',
      min: exp.effLimits[0],
      max: exp.effLimits[1],
      start: function(){return randi(exp.effLimits[0],exp.effLimits[1]);},
      require_movement: true,
      effort: true,
      on_start: function(){
        // reset counters
        nCorrect       = 0;
        correct_i      = [0,0,0,0,0,0,0,0];
        test_counter   = 0;
      },
      on_finish: function(data){
        var effortDuration = data.slider_response;
      },
      data: {
        trialNb: trialInd,
        target_score: TSCurrent,
        reward: rewCurrent,
        test_part: 'effort_want',
        nTS: 999
      }

    }

    // Push to Timeline //
    timelineTask.push(fullscreenExp);
    timelineTask.push(effort_want);



    // ==== Effort Phase ==== //
    // - Inputs:
    // - Grid Stimuli (all pairs present)
    // - Reward
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
        reward: rewCurrent,
        test_part: 'fixation',
        nTS: 999
      }
    }; // fixation

    // Push to Timeline //
    timelineTask.push(fullscreenExp);
    timelineTask.push(fixation);

    var effort = {
      type: 'html-button-response-effort-WH',
      stimulus: gridStimuliCurrent,
      choices: [],
      trial_duration: function(){
        var CurrentTrialInd = jsPsych.data.getLastTrialData().values()[0]['trialNb'];
        var effortDuration = jsPsych.data.get().filter({test_part: 'effort_want','trialNb': CurrentTrialInd}).values()[0]['slider_response'];
        return effortDuration*1000;
      },
      reward: rewCurrent,
      target_score: TSCurrent,
      timer: true, // do we show a timer of the amount of time left?
      data: {
        trialNb: trialInd,
        target_score: TSCurrent,
        reward: rewCurrent,
        test_part: 'effort',
        nTS: 999
      }
    }; // effort

    // Push to Timeline //
    timelineTask.push(effort);

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
      stimulus: '<p>Combien d&#39emplacements pensez-vous pouvoir retrouver correctement ?</p>',
      choices: EnSStr.map(String),
      data: {
        trialNb: trialInd,
        target_score: TSCurrent,
        reward: rewCurrent,
        test_part: 'EnS',
        nTS: 999
      }
    }; // EnS

    // Push to Timeline //
    timelineTask.push(fullscreenExp);
    timelineTask.push(EnS);

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
      grid_square_size: screen.height/7,
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
        reward: rewCurrent,
        test_part: 'test',
        nTS: 999
      }
    }; // test

    // Push to Timeline //
    timelineTask.push(fullscreenExp);
    timelineTask.push(test);

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
      reward: rewCurrent,
      target_correct: target_corr_i,
      on_start: function(feedback){
        let TSCurrent       = feedback.target_score;
        let rewCurrent      = feedback.reward;
        let emplacementsStr = nCorrect==1 ? ' emplacement ':' emplacements ';
        let pointsStr       = rewCurrent==1 ? ' point ':' points ';
        if (nCorrect >= TSCurrent){
          pointsTotal = pointsTotal + rewCurrent;
          nTS++;
          feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacementsStr + '!</p><p>Vous avez gagné '+feedback.reward+' '+pointsStr+'.</p>';
        } else {
          feedback.stimulus = '<p style="margin:0px">Vous avez correctement retrouvé <b>'+nCorrect+'</b>' + emplacementsStr + '!</p><p>Vous avez gagné 0 points.</p>';
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
        reward: rewCurrent,
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
      reward: rewCurrent,
      target_correct: target_corr_i,
      data: {
        trialNb: trialInd,
        target_score: TSCurrent,
        reward: rewCurrent,
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
  // - # of Points/Euros earned

  var finish = {
    type: 'html-button-response-WH',
    stimulus: function(){
      var max_points = exp.max_points;
      var max_euro   = exp.rew_euro[1];
      var min_euro   = exp.rew_euro[0];
      var total_points = pointsTotal + jsPsych.data.get().filter({test_part:'feedback_train'}).values()[0].nTS
      var points_fin = total_points == 1 ? 'point':'points';
      var euro_rew   = Math.round((((max_euro - min_euro)*(total_points - 0))/(max_points - 0)) + min_euro);
      var finish_stim = '<p>Le test de me&#769tacognition est maintenant termine&#769.</p><p>En total, vous avez gagné : <b>'+total_points+' '+points_fin+'</b>. Vous recevrez : <b>'+euro_rew+' €.</b></p><p><b>Merci beaucoup pour votre participation !</b></p>';
      return finish_stim;
    },
    choices: ['Fin'],
    data: {
      trialNb: 999,
      target_score: 999,
      reward: 999,
      test_part: 'finish',
      nTS: 999
    }
  }

  timelineTask.push(finish);

  return timelineTask

} // function end
