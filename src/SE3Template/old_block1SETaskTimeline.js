function block1SETaskTimeline (effortDurations){
    const theDurations = effortDurations;
    var timelineTask =[];
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

    // Calculate the values we need to build the questions 
    [5, 7, 9].forEach(difficulty => {
        console.log("NM: Checking effortDurations for difficulty", difficulty, ":", theDurations[difficulty]);
        console.log("NM: Type of effortDurations for difficulty", difficulty, ":", typeof theDurations[difficulty]);
        console.log("NM: Is Array:", Array.isArray(theDurations[difficulty]));
        console.log("NM: Length of effortDurations for difficulty", difficulty, ":", theDurations[difficulty].length);
        let stats = calculateStats(theDurations[difficulty]);
       
        console.log("NM: for difficulty", difficulty, " the thing im doing normal stats on is", effortDurations[difficulty])

        highestEffortDurations[difficulty] = stats.max;
        lowestEffortDurations[difficulty] = stats.min;
        medianEffortDurations[difficulty] = stats.median;
        lowerEffortDurations[difficulty] = Math.max(10, stats.min * 0.8);
        higherEffortDurations[difficulty] = stats.max * 1.2;
        console.log(`NM: Stats for difficulty ${difficulty}:`, stats);
      });

     //Generate SE questiions 
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

    return {timelineTask}
}