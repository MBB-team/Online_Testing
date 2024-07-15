function block2gridsTaskTimeline(){
    var timelineTask = [];

    function get_average(difficulty, reward) {
        var filteredData = jsPsych.data.get().filter({
            test_part: 'effort_want', 
            target_score: difficulty, 
            reward: reward, 
            blockInd: 1
        }).values();
        
        var effortDurations = filteredData.map(entry => entry['slider_response']);
        
        var avgEffortDuration = effortDurations.length > 0 
            ? effortDurations.reduce((a, b) => a + b, 0) / effortDurations.length 
            : 0;
            
        return Math.round(avgEffortDuration);
    }

    function get_awareness(difficulty, reward) {
        var filteredDataConf = jsPsych.data.get().filter({
            test_part: 'EnS', 
            target_score: difficulty, 
            reward: reward, 
            blockInd: 1
        }).values();
    
        var confResponses = filteredDataConf.map(entry => entry['button_pressed']);
        var numResponses = confResponses.length;

        var filteredDataTest = jsPsych.data.get().filter({
            test_part: 'test',
            target_score: difficulty,
            reward: reward,
            blockInd: 1
        }).values();
    
        var aware_values = [];
        for (var i = 0; i < numResponses; i++) {
            var startIndex = i * difficulty; 
            var endIndex = startIndex + difficulty;
            var correctValues = filteredDataTest.slice(startIndex, endIndex).map(entry => entry['correct']);
            var nS = correctValues.reduce((acc, val) => acc + val, 0);
            var aware = Math.abs(1 - Math.abs((confResponses[i] - nS) / difficulty));
            aware_values.push(aware);
        }

        var totalAware = aware_values.reduce((acc, val) => acc + val, 0);
        var avg_awareness = totalAware / aware_values.length;
    
        return avg_awareness;       
    }

    function effortalg(TSCurrent, rewCurrent,  effortDuration) {
        var awareness = get_awareness(TSCurrent, rewCurrent);
        var avgeffort = get_average(TSCurrent, rewCurrent);
        var thiseffort = effortDuration;

        var eff_diff = (thiseffort - avgeffort) / avgeffort;

        var adjustedNC = Math.round(eff_diff * (6 - (awareness * 2)));

        if (eff_diff <= 0.1 && adjustedNC >= 0) {
            adjustedNC = 0;
        }
        if (adjustedNC / TSCurrent > 0.5) {
            adjustedNC = Math.floor(TSCurrent / 2);
        } else if (adjustedNC / TSCurrent < -0.5) {
            adjustedNC = Math.ceil(-TSCurrent / 2);
        }
        
        console.log("EFF ALG - For TS: ", TSCurrent, " and reward: ", rewCurrent, "avg effort has been:", avgeffort, "seconds, and here you selected ", thiseffort, " seconds. So the effort Diff is: ", eff_diff, ". Moreover, the awareness is of: ", awareness, ". Therefore the updated NC is: ", adjustedNC);

        return adjustedNC;
    }

    for (var trialInd = 0; trialInd < exp.nbTrials_block; trialInd++){
        let trialNbCurrent = trialInd + 1;
        let TSCurrent = exp.TS[TSPt_b2[trialInd]];
        let rewCurrent = exp.rew[rewPt_b2[trialInd]];
        let gridStimuliCurrent = gridStimuli_b2[trialInd];
        let gridIndexesCurrent = gridIndexesPt_b2[trialInd];
        let target_i = Array(TSCurrent).fill([null, null]); // Adjust based on TSCurrent
        let target_corr_i = Array(TSCurrent).fill([null, null]); // Adjust based on TSCurrent
        let TD = 1;
        var nTS;
        let nCorrect = 0;
        let adjustedNC = 0;
        let correct_i = Array(TSCurrent).fill(0);
        let test_counter = 0;
        let trial_success = 0;

        var effort_want = {
            type: 'html-slider-response-effort-want-WH',
            prompt: '<p style="position: relative; top: -20px; color: grey;">Exercice: ' + trialNbCurrent + '/' + exp.nbTrials_block + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Block: 2/3</p>' +
            '<p style="font-size:30px">Votre objectif est de mémoriser <b>' + TSCurrent + ' paires de chiffres</b>.</p>' +
            '<p style="font-size:30px">Si vous atteignez cet objectif, vous gagnerez <b>' + rewCurrent + '</b> points. </p>' +
            '<div><br></div>',
            stimulus: '<p>Pendant combien de temps souhaitez-vous voir la grille ?</p>',
            min: exp.effLimits[0],
            max: exp.effLimits[1],
            start: function() { return randi(exp.effLimits[0], exp.effLimits[1]); },
            require_movement: true,
            effort: true,
            on_start: function() {
                // reset counters if needed
            },
            on_finish: function(data) {
                var effortDuration = data.slider_response;
                if (condition === 2) {
                    adjustedNC = effortalg(TSCurrent, rewCurrent, effortDuration);
                    console.log("For trial ", trialInd, "the effort selected was ", effortDuration, )
                }
            },
            data: {
                PartID: PartID,
                SessID: sessID, 
                condition: condition,
                trialNb: trialInd,
                blockInd: 2,
                test_part: 'effort_want',
                get_data: 1,
                target_score: TSCurrent,
                reward: rewCurrent,
                SE_eff: 999,
                SE_type: '999',
                NC: 999,
                adjustedNC: 999,
                finalNC: 999,
                nTS: 999,
            }
        };

        // Push to Timeline
        timelineTask.push(fullscreenExp);
        timelineTask.push(effort_want);

        // ==== ÉTAPE 2 - Mémorisation ====
        var fixation = {
            type: 'html-button-response-WH',
            stimulus: '<p><b>Tenez-vous pre&#770t.e !</b></p>',
            choices: [],
            trial_duration: time.fixation,
            data: {
                PartID: PartID,
                SessID: sessID, 
                condition: condition,
                trialNb: trialInd,
                blockInd: 2,
                test_part: 'fixation',
                get_data: 0,
                target_score: TSCurrent,
                reward: rewCurrent,
                SE_eff: 999,
                SE_type: '999',
                NC: 999,
                adjustedNC: 999,
                finalNC: 999,
                nTS: 999,
            }
        };

        // Push to Timeline
        timelineTask.push(fullscreenExp);
        timelineTask.push(fixation);

        var effort = {
            type: 'html-button-response-effort-WH',
            stimulus: gridStimuliCurrent,
            reward: rewCurrent,
            choices: [],
            trial_duration: function() {
                var CurrentTrialInd = jsPsych.data.getLastTrialData().values()[0]['trialNb'];
                var effortDuration = jsPsych.data.get().filter({ test_part: 'effort_want', 'trialNb': CurrentTrialInd, blockInd: 2 }).values()[0]['slider_response'];
                console.log("For ", CurrentTrialInd, " the effort Dur is", effortDuration * 1000);
                return effortDuration * 1000;
            },
            target_score: TSCurrent,
            timer: true, // do we show a timer of the amount of time left?
            data: {
                PartID: PartID,
                SessID: sessID, 
                condition: condition,
                trialNb: trialInd,
                blockInd: 2,
                test_part: 'effort',
                get_data: 0,
                target_score: TSCurrent,
                reward: rewCurrent,
                SE_eff: 999,
                SE_type: '999',
                NC: 999,
                adjustedNC: 999,
                finalNC: 999,
                nTS: 999,
            }
        };

        // Push to Timeline
        timelineTask.push(effort);

        // ==== ÉTAPE 3 - TEST ====
        var testTrials = [];

        // Initialise test locations
        for (var testInd = 0; testInd < TSCurrent; testInd++){
            var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
            var pair_2nd = 1 - pair_1st;

            target_i[testInd] = gridIndexesCurrent[testInd][pair_1st].map(function(v){return (v - 1)});
            target_corr_i[testInd] = gridIndexesCurrent[testInd][pair_2nd].map(function(v){return (v - 1)});

            testTrials.push({
                target_location: target_i[testInd],
                correct_location: gridIndexesCurrent[testInd][pair_2nd].map(function(v){return (v - 1)}),
                target_image: numbersImg[testInd]
            });        
        }

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
                PartID: PartID,
                SessID: sessID, 
                condition: condition,
                trialNb: trialInd,
                blockInd: 2,
                test_part: 'test',
                get_data: 1,
                target_score: TSCurrent,
                reward: rewCurrent,
                SE_eff: 999,
                SE_type: '999',
                NC: 999,
                adjustedNC: 999,
                finalNC: 999,
                nTS: 999,
            }
        };

        // Push to Timeline
        timelineTask.push(fullscreenExp);
        timelineTask.push(test);

        // ==== ÉTAPE 4 - QUESTIONS AUTO-ÉVALUATION ====
        var EnSBtns = TSCurrent + 1;
        let EnSStr = [...Array(EnSBtns).keys()];
        var EnS = {
            type: 'html-button-response-WH',
            stimulus: '<p>Combien d&#39emplacements pensez-vous avoir retrouvé correctement ?</p>',
            choices: EnSStr.map(String),
            on_finish: function(data) {
                var ens_button = data.button_pressed;
                console.log("Button Pressed:", data.button_pressed);
            },
            data: {
                PartID: PartID,
                SessID: sessID, 
                condition: condition,
                trialNb: trialInd,
                blockInd: 2,
                test_part: 'EnS',
                get_data: 1,
                target_score: TSCurrent,
                reward: rewCurrent,
                SE_eff: 999,
                SE_type: '999',
                NC: 999,
                adjustedNC: 999,
                finalNC: 999,
                nTS: 999,
            }
        };

        // Push to Timeline
        timelineTask.push(fullscreenExp);
        timelineTask.push(EnS);

        // ==== ÉTAPE 5 - FEEDBACK / Next exo  ====
        var feedback_nextexo = {
            type: 'html-button-response-fb-WH',
            stimulus: '',
            grid: false,
            choices: trialNbCurrent < exp.nbTrials_block ? ['Passez au prochain exercice'] : ['Suivant'],
            target: target_i,
            correct_responses: function(){return correct_i},
            target_score: TSCurrent,
            target_correct: target_corr_i,
            on_start: function(feedback){
                let TSCurrent = feedback.target_score;
                let emplacementsStr = nCorrect == 1 ? ' emplacement ' : ' emplacements ';
                var finalNC = nCorrect + adjustedNC;
                if (finalNC < 0) {
                    finalNC = 0;
                } else if (finalNC > TSCurrent) {
                    finalNC = TSCurrent};
                console.log("EFF ALG - feedback step: For TS:", TSCurrent, "and reward ", rewCurrent, ", the nCorrect was", nCorrect, " pairs and then the updatedNC was ", adjustedNC, "pairs. So the final NC is: ", finalNC )
               
                feedback.data.finalNC = finalNC; 
                
                if (finalNC >= TSCurrent){
                    exCorrect++;
                    pointsTotal += rewCurrent;
                    nTS++;
                    feedback.stimulus = '<p> Vous avez fini exercice <b>'+trialNbCurrent+'/'+exp.nbTrials_block+' </b> du bloc <b> 2/3</b>.</p> <p style="margin:0px"> Bravo, vous avez correctement retrouvé <b>' + finalNC + '</b>' + emplacementsStr + '!</p><p> Vous avez réussi cet exercice. Vous gagnez <b>' + rewCurrent + '</b> points. </p> <p> Quand vous êtes prêt.e, </p>';
                } else {
                    feedback.stimulus = '<p> Vous avez fini exercice <b>'+trialNbCurrent+'/'+exp.nbTrials_block+' </b> du bloc <b> 2/3</b>.</p> <p style="margin:0px">Vous avez correctement retrouvé <b>' + finalNC + '</b>' + emplacementsStr + '!</p><p> Malheureusement, vous n\'avez pas réussi cet exercice. Vous ne gagnez aucun point. </p> <p> Quand vous êtes prêt.e, </p>';
                }
            },
            on_finish: function(data){
                var finalNC = nCorrect + adjustedNC;
                if (finalNC < 0) {
                    finalNC = 0;
                } else if (finalNC > TSCurrent) {
                    finalNC = TSCurrent;
                }
                data.finalNC = finalNC;
                data.NC = nCorrect;
                data.adjustedNC = adjustedNC;
            },
            data: {
                PartID: PartID,
                SessID: sessID, 
                condition: condition,
                trialNb: trialInd,
                blockInd: 2,
                test_part: 'feedback',
                get_data: 1,
                target_score: TSCurrent,
                reward: rewCurrent,
                SE_eff: 999,
                SE_type: '999',
                NC: 999,
                adjustedNC: 999,
                finalNC: 999,
                nTS: 999,
            }
        };

        var nofeedback_nextexo = {
            type: 'html-button-response-WH',
            stimulus: '<p> Vous avez fini exercice <b>'+trialNbCurrent+'/'+exp.nbTrials_block+' </b> du bloc <b> 2/3</b>.</p> <p> Quand vous êtes prêt.e, </p>',
            choices: trialNbCurrent < exp.nbTrials_block ? ['Passez au prochain exercice'] : ['Suivant'],
            on_finish: function(data){
                data.finalNC = nCorrect
            },
            data: {
                PartID: PartID,
                SessID: sessID, 
                condition: condition,
                trialNb: trialInd,
                blockInd: 2,
                test_part: 'next_exo',
                get_data: 1,
                target_score: TSCurrent,
                reward: rewCurrent,
                SE_eff: 999,
                SE_type: '999',
                NC: 999,
                adjustedNC: 999,
                finalNC: 999,
                nTS: 999,
            }
        };

        if (condition === 1 || condition === 2) {
            timelineTask.push(fullscreenExp);
            timelineTask.push(feedback_nextexo);
        } else if (condition === 3) {
            timelineTask.push(fullscreenExp);
            timelineTask.push(nofeedback_nextexo);
        }
    }

    return {timelineTask};
};