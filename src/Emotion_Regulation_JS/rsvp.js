function rsvp(nbBlocks, nbTrials, training)
{
      /////////////////////////////
      ////// INITIALISATION //////
      ////////////////////////////

      var timelineTask = [];

      [conditionRwd, condition] = createCondiMatrix(nbBlocks, nbTrials, training);

      /////////////////////////////////
      ////// Start of the Block //////
      ////////////////////////////////

      for (var block = 0; block < nbBlocks; block++)  {

            // Put here the parameters that need to be randomised every block
            var instrCondiImg = "";
            if (conditionRwd[block][1] == 1 ){
                  if (conditionRwd[block][0] == 1) {instrCondiImg =  instrImg[9]} // DC Small Rwd
                  else if (conditionRwd[block][0] == 2) {instrCondiImg = instrImg[10]} // DC Large Rwd
            }
            else if (conditionRwd[block][1] == 2){
                  if (conditionRwd[block][0] == 1) {instrCondiImg =  instrImg[11]} // BC Small Rwd
                  else if (conditionRwd[block][0] == 2) {instrCondiImg = instrImg[12]} // BC Small Rwd
            };

            var instrCondi = {
                  type: "image-keyboard-response",
                  stimulus: instrCondiImg,
                  stimulus_height: screen.height/1.5, // Size of the instruction depending on the size of the participants' screen
                  choices: [32],
                  data: {
                        test_part: "instrCondi",
                        blockNb: block,
                        trialNb: 999,
                        condiEmo: conditionRwd[block][1],
                        condiRwd: conditionRwd[block][0],
                        posCritDist: 999,
                        distractor: 999,
                        posTarget: 999,
                        target: 999,
                  },
            };

            if (training == 0) {timelineTask.push(instrCondi)};

            /////////////////////////////////
            ////// Start of the trial //////
            ////////////////////////////////

            for(var trial = 0; trial < nbTrials; trial++){

                  // Position of the Distractor and Target
                  posCritDist = randi(4,8); // random number between 4 and 8
                  posTarget = posCritDist + (Math.floor(Math.random()*2)+1) *2; // either 2 or 4

                  // Select new images every trial W: white, F: female / M: male, F: fearful / N: neutral
                  img = [imgWFF, imgWMF, imgWFN, imgWMN];
                  scramble = [scrambleWFF, scrambleWMF, scrambleWFN, scrambleWMN];

                  // Indexing of img (easier to randomise between)
                  fem = [0,2]; male = [1,3]; fear = [0,1]; neutral = [2,3];

                  if (condition[block][trial] == 1){ // DC_male: fearful male D, neutral fem & male T
                        distractor = fear[1];
                        target = neutral[randi(0,1)];

                  } else if (condition[block][trial] == 2){ // DC_fem: fearful female D, neutral fem & male T
                        distractor = fear[0];
                        target = neutral[randi(0,1)];

                  } else if (condition[block][trial] == 3){ // CC_male: neutral man D, neutral male or female T OR fearful man D, fearful male or female T
                        distractor = male[randi(0,1)];
                        if (distractor == male[0]){target = fear[randi(0,1)];}
                        if (distractor == male[1]){target = neutral[randi(0,1)];}

                  } else if (condition[block][trial] == 4){ // CC_female: neutral female D, neutral male or female T OR fearful female D, fearful male or female T
                        distractor = fem[randi(0,1)];
                        if (distractor == fem[0]){target = fear[randi(0,1)];}
                        if (distractor == fem[1]){target = neutral[randi(0,1)];}

                  } else if (condition[block][trial] == 5){ // BC_male: neutral male D, fearful male or female T
                        distractor = neutral[1];
                        target = fear[randi(0,1)];

                  } else if (condition[block][trial] == 6){ // BC_fem : neutral female D, fearful male or female T
                        distractor = neutral[0];
                        target = fear[randi(0,1)];
                  };

                  // First, fixation
                  var fixation = {
                        type:'html-keyboard-response',
                        stimulus: '<div style="font-size:75px;">+</div>',
                        choices: jsPsych.NO_KEYS,
                        condition: conditionRwd[block][1], // 1 = DC, 2 = BC
                        reward: conditionRwd[block][0], // 1 = small rwd, 2 = large rwd
                        training: training,
                        trial_duration: fixation_time,
                        fixation: true,
                        data:{
                              test_part:'fixation',
                              blockNb: block,
                              trialNb: trial,
                              condiEmoBlock: conditionRwd[block][1],
                              condiEmoTrial: condition[block][trial],
                              condiRwd: conditionRwd[block][0],
                              posCritDist: posCritDist,
                              distractor: distractor,
                              posTarget: posTarget,
                              target: target,
                        }
                  };

                  timelineTask.push(fixation);

                  var rsvpFlux = [];
                  // The RSVP
                  for (var nbImg = 0; nbImg < setSize; nbImg++){
                        if (nbImg == posCritDist){
                              rsvpFlux[nbImg] = img[distractor][randi(0,(img[distractor].length-1))];
                        } else if (nbImg == posTarget){
                              rsvpFlux[nbImg] = img[target][randi(0,(img[target].length-1))];
                        } else {
                              rsvpFlux[nbImg] = scramble[distractor][randi(0,(img[distractor].length-1))];
                        };
                  }
                  //console.log(rsvpFlux.join())

                        var rsvp = {
                              type: "rsvp_flux",
                              flux: rsvpFlux,
                              number_images: setSize,
                              choices: jsPsych.NO_KEYS,
                              condition: conditionRwd[block][1], // 1 = DC, 2 = BC
                              reward: conditionRwd[block][0], // 1 = small rwd, 2 = large rwd
                              training: training,
                              stimulus_duration: imageDuration,
                              response_ends_trial: false,
                              data: {
                                    test_part: 'rsvp_img_'+nbImg+'',
                                    blockNb: block,
                                    trialNb: trial,
                                    condiEmoBlock: conditionRwd[block][1],
                                    condiEmoTrial: condition[block][trial],
                                    condiRwd: conditionRwd[block][0],
                                    posCritDist: posCritDist,
                                    distractor: distractor,
                                    posTarget: posTarget,
                                    target: target,
                              },
                        };
                        timelineTask.push(rsvp);

                  var rsvpAnswFem = {
                        type:'html-keyboard-response',
                        stimulus:'<div style="font-size:20px;"><p> Avez-vous vu au moins une femme? </p>' +
                        '<p> <strong> Oui [O] / Non [N] </strong></p> </div>',
                        condition: conditionRwd[block][1], // 1 = DC, 2 = BC
                        reward: conditionRwd[block][0], // 1 = small rwd, 2 = large rwd
                        training: training,
                        choices: [78, 79], //[37, 39], left and right arrows
                        response_ends_trial: true,
                        //post_trial_gap : 1000,
                        data: {
                              test_part: 'rsvpAnswFem',
                              blockNb: block,
                              trialNb: trial,
                              condiEmoBlock: conditionRwd[block][1],
                              condiEmoTrial: condition[block][trial],
                              condiRwd: conditionRwd[block][0],
                              posCritDist: posCritDist,
                              distractor: distractor,
                              posTarget: posTarget,
                              target: target,
                        },
                  };

                  var rsvpAnswHom = {
                        type:'html-keyboard-response',
                        stimulus:'<div style="font-size:20px;"><p> Avez-vous vu au moins un homme? </p>' +
                        '<p> <strong> Oui [O] / Non [N] </strong></p> </div>',
                        condition: conditionRwd[block][1], // 1 = DC, 2 = BC
                        reward: conditionRwd[block][0], // 1 = small rwd, 2 = large rwd
                        training: training,
                        choices: [79,78],
                        response_ends_trial: true,
                        //post_trial_gap : 1000,
                        data: {
                              test_part: 'rsvpAnswHom',
                              blockNb: block,
                              trialNb: trial,
                              condiEmoBlock: conditionRwd[block][1],
                              condiEmoTrial: condition[block][trial],
                              condiRwd: conditionRwd[block][0],
                              posCritDist: posCritDist,
                              distractor: distractor,
                              posTarget: posTarget,
                              target: target,
                        },
                  };

                  if (condition[block][trial] == 1 || condition[block][trial] == 3 || condition[block][trial] == 5) {
                        timelineTask.push(rsvpAnswFem);
                  } else if (condition[block][trial] == 2 || condition[block][trial] == 4 || condition[block][trial] == 6) {
                        timelineTask.push(rsvpAnswHom);
                  };
                  timelineTask.push(fullscreenExp);

            } // End of the trials
      } // End of the blocks

      return timelineTask;
} // end of the function
