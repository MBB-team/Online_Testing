function block1TaskTimeline(){

    // Initialise Variables
    var timelineTask = [];
    //var pointsTotal = 0;
    //var exCorrect    = 0; 

    var effortDurations = {
        5: [],
        7: [],
        9: []
      };

      var spliteffortDurations = {
        5: {10: [], 100: []},
        7: {10: [], 100: []},
        9: {10: [], 100: []}
    };

    console.log("NM: dummy variable length at 5", dummy[5].length)

    var highestEffortDurations = {};
    var lowestEffortDurations = {};
    var medianEffortDurations = {};
    var lowerEffortDurations = {};
    var higherEffortDurations = {};
  
  
    // ==== LOOP OF THE JEU DE MEMORY ==== //
    for (var trialInd = 0; trialInd < exp.nbTrials_block; trialInd++){
  
      // Initialise inputs
      let trialNbCurrent     = trialInd+1;
      let TSCurrent          = exp.TS[TSPt_b1[trialInd]];
      let rewCurrent         = exp.rew[rewPt_b1[trialInd]];
      let gridStimuliCurrent = gridStimuli_b1[trialInd];
      let gridIndexesCurrent = gridIndexesPt_b1[trialInd];
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
        prompt: '<p>Block : 1/3    Exercice : '+trialNbCurrent+'/'+exp.nbTrials_block+'<p style="font-size:30px">Votre objectif est de mémoriser <b>'+TSCurrent+' paires de chiffres</b>.</p><p style="font-size:30px">Si vous atteignez cet objectif, vous gagnerez <b>'+rewCurrent+'</b> points. </p><div><br></div>',
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
            var difficulty = TSCurrent;
            var reward = rewCurrent;
            spliteffortDurations[difficulty][reward].push(effortDuration);
            effortDurations[difficulty].push(effortDuration);  // saving the effort Durations by TS 
            console.log(`Current effortDurations: `, effortDurations);
            console.log(`Current spliteffortDurations: `, spliteffortDurations);
          },
        data: {
          test_part: 'effort_want',
          get_data: 1, 
          trialNb: trialInd,
          blockInd: 1,
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
          blockInd: 1,
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
          var effortDuration = jsPsych.data.get().filter({test_part: 'effort_want','trialNb': CurrentTrialInd}).values()[0]['slider_response'];
          return effortDuration*1000;
        },
        target_score: TSCurrent,
        timer: true, // do we show a timer of the amount of time left?
        data: {
          trialNb: trialInd,
          blockInd: 1,
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
            correct_i[test_counter] = 1;
          }
          test_counter++;
        },
        data: {
          test_part: 'test',
          get_data: 1,
          blockInd: 1,
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
          blockInd: 1,
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
      
      if (nCorrect >= TSCurrent) {
        exCorrect++;
        rewTotal += rewCurrent;
        trial_success = 1; 
      }
// ==== ÉTAPE 5 - FIN D'UN EXO ====
      var nextexo = {
        type: 'html-button-response-WH',
        stimulus:'<p> Vous avez fini exercice <b>'+trialNbCurrent+'/'+exp.nbTrials_block+' </b> du bloc <b> 1/3</b>.</p> <p> Quand vous êtes prêt.e.s, </p>',
        choices: ['Passez au prochain exercise'],
        data: {
            test_part: 'next_exo',
            get_data: 1,
            blockInd: 1,
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

// ========= SE questions =========

// Step 1 - get the median, the highest and the lowest durations for each difficulty level    
function calculateStats(inputDurations) {
    const durations = [...inputDurations]
    let max = Math.max(...durations);
    let min = Math.min(...durations);
    durations.sort((a, b) => a - b);
    let median = durations.length % 2 === 0 ? (durations[durations.length / 2 - 1] + durations[durations.length / 2]) / 2 : durations[Math.floor(durations.length / 2)];
  
    return {max: max, min: min, median: median };
  }
  
var medianEffortDurations = {
    5: [],
    7: [],
    9: []
  };
var lowerEffortDurations = {
    5: [],
    7: [],
    9: []
  };
var higherEffortDurations = {
    5: [],
    7: [],
    9: []
  };
var highestEffortDurations = {
    5: [],
    7: [],
    9: []
  };
var lowestEffortDurations = {
    5: [],
    7: [],
    9: []
  };

console.log("NM:the effort Durations after the loop are:", effortDurations);
console.log("NM: length of effortDurations at diff 5 is: ", effortDurations[5].length, ",and the length of effortDurations at diff 7 is: ", effortDurations[7].length, "and the length of effortDurations at diff 9 is: ", effortDurations[9].length,)
console.log("effortDurations with 9? ",effortDurations[9]);


[5, 7, 9].forEach(difficulty => {
    console.log("NM: Checking effortDurations for difficulty", difficulty, ":", effortDurations[difficulty]);
    console.log("NM: Type of effortDurations for difficulty", difficulty, ":", typeof effortDurations[difficulty]);
    console.log("NM: Is Array:", Array.isArray(effortDurations[difficulty]));
    console.log("NM: Length of effortDurations for difficulty", difficulty, ":", effortDurations[difficulty].length);
      let stats = calculateStats(effortDurations[difficulty]);
      console.log("NM: for difficulty", difficulty, " the thing im doing normal stats on is", effortDurations[difficulty])
      console.log("NM: for difficulty", difficulty, " the thing im doing dummy stats on is", dummy[difficulty])
      let dummystats = calculateStats(dummy[difficulty]);
      highestEffortDurations[difficulty] = stats.max;
      lowestEffortDurations[difficulty] = stats.min;
      medianEffortDurations[difficulty] = stats.median;
      lowerEffortDurations[difficulty] = Math.max(10, stats.min * 0.8);
      higherEffortDurations[difficulty] = stats.max * 1.2;
      console.log(`NM: Stats for difficulty ${difficulty}:`, stats);
      console.log(`NM: DUMMY stats for difficulty ${difficulty}:`, dummystats);
  });




 // STEP 2 - Generate questions
 function generateSEQuestions(difficulty, lower, median, higher) {
   var SE_questions = [];

    SE_questions.push({
      type: 'html-slider-response-percentage-NM',
      stimulus: '<p>En investissant <b>'+lower+ '</b> secondes pour réviser <b>'+ difficulty+ '</b> paires, quelle est la probabilité que vous réussissez l’exercice? </p><p> (<b>Rappel:</b> réussir l’exercice c’est se souvenir de l’emplacement de toutes les paires)</p>',
      min: 0,
      max: 100,
      start: function(){return randi(0,100);},
      require_movement: true,
      data: {
        test_part: 'SE_quest',
        get_data: 1,
        blockInd: 1,
        trialNb: 0,
        target_score: difficulty,
        SE_eff: lower,
        reward: 999,
        nTS: 999,
        success: 999,
      }
    });

    SE_questions.push({
      type: 'html-slider-response-percentage-NM',
      stimulus: '<p>En investissant <b>'+median+ '</b> secondes pour réviser <b>'+ difficulty+ '</b> paires, quelle est la probabilité que vous réussissez l’exercice? </p><p>(<b>Rappel:</b> réussir l’exercice c’est se souvenir de l’emplacement de toutes les paires)</p>',
      min: 0,
      max: 100,
      start: function(){return randi(0,100);},
      require_movement: true,
      data: {
        test_part: 'SE_quest',
        get_data: 1,
        blockInd: 1,
        trialNb: 0,
        target_score: difficulty,
        SE_eff: median,
        reward: 999,
        nTS: 999,
        success: 999,
      }
    });

    SE_questions.push({
      type: 'html-slider-response-percentage-NM',
      stimulus: '<p>En investissant <b>'+higher+ '</b> secondes pour réviser <b>'+ difficulty+ '</b> paires, quelle est la probabilité que vous réussissez l’exercice? </p> <p> (<b>Rappel:</b> réussir l’exercice c’est se souvenir de l’emplacement de toutes les paires)</p>',
      min: 0,
      max: 100,
      start: function(){return randi(0,100);},
      require_movement: true,
      data: {
        test_part: 'SE_quest',
        get_data: 1,
        blockInd: 1,
        trialNb: 0,
        target_score: difficulty,
        SE_eff: higher,
        reward: 999,
        nTS: 999,
        success: 999,
      }
    });
    return SE_questions;
} //end SE generating function

var SE_questions_difficulty_5 = generateSEQuestions(5, lowerEffortDurations[5], medianEffortDurations[5], higherEffortDurations[5]);
var SE_questions_difficulty_7 = generateSEQuestions(7, lowerEffortDurations[7], medianEffortDurations[7], higherEffortDurations[7]);
var SE_questions_difficulty_9 = generateSEQuestions(9, lowerEffortDurations[9], medianEffortDurations[9], higherEffortDurations[9]);

var all_SE_questions = SE_questions_difficulty_5.concat(SE_questions_difficulty_7, SE_questions_difficulty_9);

jsPsych.data.addProperties({
    SE_questions: all_SE_questions
  });
  //Save so I can use them again in block 3 but pre-randomising them so I can re-randomise them 
 
  
// STEP 3 - Randomize the order of SE questions
  SE_questions_b1 = jsPsych.randomization.shuffle(all_SE_questions);

// STEP 4 - Add Trial Number Indicator
SE_questions_b1.forEach((question, index) => {
    question.data.trialNb = index + 1;
  });

  // STEP 5 - Add the SE questions to the timeline
  SE_questions_b1.forEach(question => {
    timelineTask.push(question);
  });
  

  // ====== PREP for FEEDBACK BLOCK 2 =====

  console.log("test diff 9of split efforts", spliteffortDurations[9][10]);
  console.log("test diff 9of split efforts", spliteffortDurations[9][100]);
  console.log("test diff 5 of split efforts", spliteffortDurations[5][10]);

  
  [5, 7,9].forEach(difficulty => {
    [10, 100].forEach(reward => {
        console.log("Hi this is now at diff", difficulty, "for reward", reward, "and value is",spliteffortDurations[difficulty][reward]);
    });
});

console.log("spliteffort OUTSIDE loop:", spliteffortDurations);
console.log("outside loop for 9", spliteffortDurations[9]);
console.log("outside loop length for 9", spliteffortDurations[9].length);
 // Calculate averages for each combination of difficulty and reward
[5, 7,9].forEach(difficulty => {
    [10, 100].forEach(reward => {
        console.log("spliteffort INSIDE loop:", spliteffortDurations);
        let durations = spliteffortDurations[difficulty][reward];
        if (durations.length > 0) {
            let sum = durations.reduce((a, b) => a + b, 0);
            averageEffortDurations[difficulty][reward] = sum / durations.length;
        } else {
            averageEffortDurations[difficulty][reward] = 0;
        }
    });
});
console.log("NM: Now the averageEffortdurations is", averageEffortDurations);
  
    // ==== Finish Screen ==== //
    // Inputs:
    // - # of Correct Target Scores
    // - # of Points earned
  
    var finish = {
      type: 'html-button-response-WH',
      stimulus: function(){
        var max_points = exp.max_points;
        //var total_points = pointsTotal + jsPsych.data.get().filter({test_part:'feedback_train'}).values()[0].nTS
        var finish_stim = '<p>Vous avez fini bloc <b> 1/3 </b>. Merci de votre concentration. </p> <p> Quand vous êtes prêt.e.s, </p>';
        return finish_stim;
      },
      choices: ['Passez au prochain bloc'],
      data: {
        test_part: 'finish block 1',
        trialNb: 999,
        target_score: 999,
        nTS: 999
      }
    }
  
    timelineTask.push(finish);
  
    return {timelineTask, exCorrect, pointsTotal, averageEffortDurations};
  
  } // function end