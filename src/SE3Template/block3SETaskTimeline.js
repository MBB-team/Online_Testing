function block3SETaskTimeline (){
    var timelineTask =[];

    var start = {
        type: 'html-button-response-WH',
        stimulus: function(){
          //var total_points = pointsTotal + jsPsych.data.get().filter({test_part:'feedback_train'}).values()[0].nTS
          var finish_stim = '<p>Vous avez fini les exercices de mémorisation du bloc <b> 2/3 </b>. </p> <p> Quand vous êtes prêt.e.s, </p>';
          return finish_stim;
        },
        choices: ["Passez au exercices d'auto-évaluation du bloc 3"],
        data: {
          test_part: 'start block 3',
          trialNb: 999,
          target_score: 999,
          nTS: 999
        }
      }
      
      timelineTask.push(start);
    
    function get_lower(difficulty) {
        var filteredData = jsPsych.data.get().filter({test_part: 'effort_want', 'target_score': difficulty, blockInd: 1}).values();
        var effortDurations = filteredData.map(entry => entry['slider_response']);
        var lowestEffortDuration = effortDurations.length > 0 ? Math.min(...effortDurations) : 0;
        console.log("Lowest Effort Duration:", lowestEffortDuration);
        return Math.round(Math.max(10, lowestEffortDuration * 0.8));
    }
    
    function get_median(difficulty) {
        var filteredData = jsPsych.data.get().filter({test_part: 'effort_want', 'target_score': difficulty, blockInd: 1}).values();
        var effortDurations = filteredData.map(entry => entry['slider_response']);
        if (effortDurations.length > 0) {
            return Math.round(calculateMedian(effortDurations));
        }
        return 0;
    }
    
    function get_higher(difficulty) {
        var filteredData = jsPsych.data.get().filter({test_part: 'effort_want', 'target_score': difficulty, blockInd: 1}).values();
        var effortDurations = filteredData.map(entry => entry['slider_response']);
        var highestEffortDuration = effortDurations.length > 0 ? Math.max(...effortDurations) : 0;
        return Math.round(Math.max(30, highestEffortDuration * 1.2));
    }
    
    function generateSEQuestions(difficulty) {
        var SE_questions = [];
    
        SE_questions.push({
            type: 'html-slider-response-percentage-NM',
            stimulus: function() {
                var lower = get_lower(difficulty);
                return '<p>En investissant <b>' + lower + '</b> secondes pour réviser <b>' + difficulty + '</b> paires, quelle est la probabilité que vous réussissez l’exercice? </p><p> (<b>Rappel:</b> réussir l’exercice c’est se souvenir de l’emplacement de toutes les paires)</p>';
            },
            min: 0,
            max: 100,
            start: function() { return randi(0, 100); },
            require_movement: true,
            data: {
                test_part: 'SE_quest',
                get_data: 1,
                blockInd: 3,
                trialNb: 0,
                target_score: difficulty,
                SE_type: 'lower',
                SE_eff: function() {
                    return get_lower(difficulty);
                },
                reward: 999,
                nTS: 999,
                success: 999,
            }
        });
    
        SE_questions.push({
            type: 'html-slider-response-percentage-NM',
            stimulus: function() {
                var medianEffortDuration = get_median(difficulty);
                return '<p>En investissant <b>' + medianEffortDuration + '</b> secondes pour réviser <b>' + difficulty + '</b> paires, quelle est la probabilité que vous réussissez l’exercice? </p><p> (<b>Rappel:</b> réussir l’exercice c’est se souvenir de l’emplacement de toutes les paires)</p>';
            },
            min: 0,
            max: 100,
            start: function() { return randi(0, 100); },
            require_movement: true,
            data: {
                test_part: 'SE_quest',
                get_data: 1,
                blockInd: 3,
                trialNb: 0,
                target_score: difficulty,
                SE_type: 'median',
                SE_eff: function() {
                    return get_median(difficulty);
                },
                reward: 999,
                nTS: 999,
                success: 999,
            }
        });
    
        SE_questions.push({
            type: 'html-slider-response-percentage-NM',
            stimulus: function() {
                var higher = get_higher(difficulty);
                return '<p>En investissant <b>' + higher + '</b> secondes pour réviser <b>' + difficulty + '</b> paires, quelle est la probabilité que vous réussissez l’exercice? </p><p> (<b>Rappel:</b> réussir l’exercice c’est se souvenir de l’emplacement de toutes les paires)</p>';
            },
            min: 0,
            max: 100,
            start: function() { return randi(0, 100); },
            require_movement: true,
            data: {
                test_part: 'SE_quest',
                get_data: 1,
                blockInd: 3,
                trialNb: 0,
                target_score: difficulty,
                SE_type: 'higher',
                SE_eff: function() {
                    return get_higher(difficulty);
                },
                reward: 999,
                nTS: 999,
                success: 999,
            }
        });
    
        return SE_questions;
    } //end generating SE questions 

var all_SE_questions = [];

exp.TS.forEach(difficulty => {
    var SE_questions = generateSEQuestions(difficulty);
    all_SE_questions = all_SE_questions.concat(SE_questions);
});

// Randomize the order of SE questions
SE_questions_b1 = jsPsych.randomization.shuffle(all_SE_questions);

// Add Trial Number Indicator
SE_questions_b1.forEach((question, index) => {
    question.data.trialNb = index + 1;
});

// STEP 5 - Add the SE questions to the timeline
SE_questions_b1.forEach(question => {
    timelineTask.push(question);
});

return {timelineTask}
}