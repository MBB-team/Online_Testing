function task_Constance()
{
      /////////////////////////////
      ////// INITIALISATION //////
      ////////////////////////////

      var timelineTask = [];

      [condi_shuffled, effort_pract, rwd_pract, effort_exp, rwd_exp] = condi_Constance();

      ///////////////////////
      ////// Practice //////
      /////////////////////

      var instr_pract = {
            type:'html-keyboard-response',
            stimulus: "<p> Entrainement </p>"+
            "<p> Appuyer sur la barre d'espace pour continuer. </p>",
            choices: [32],
            data: {
                  test_part: 'instr_pract',
                  trialNb: "999",
                  effort:"999",
                  condiEffort: 999,
                  rwd: "999",
                  condiRwd: 999,
            },
      };

      timelineTask.push(instr_pract);

      for(var trial_pract = 0; trial_pract < nbTrialsPrac; trial_pract++){

            // First, fixation
            timelineTask.push(fixation); //defined in the html file

            var quest_pract = {
                  type:'html-button-response',
                  stimulus:"<p> J'accepte de </p>" + effort_pract[trial_pract] + "<p> pour </p>" + rwd_pract[trial_pract] + "<p> </p>",
                  choices: ['OUI', 'NON'],
                  response_ends_trial: false,
                  trial_ends_duration: feedback_time,
                  data: {
                        test_part: "quest_pract",
                        trialNb: trial_pract,
                        effort: effort_pract[trial_pract].join(), // MySQl cannot save arrays, so join() converts the elements of an array into a string
                        condiEffort: 999,
                        rwd: rwd_pract[trial_pract].join(),
                        condiRwd: 999,
                  },
            };


            timelineTask.push(quest_pract);
            timelineTask.push(fullscreenExp);
      } // End of the trial

      /////////////////////////////////
      ////// Start of the experiment //////
      ////////////////////////////////

      var instr_exp = {
            type:'html-keyboard-response',
            stimulus: "<p> Pr\352t pour d\351buter ? </p>"+
            "<p> <strong> Appuyer sur la barre d'espace pour continuer. </strong></p>",
            choices: [32],
            data: {
                  test_part: 'instr_exp',
                  trialNb: "999",
                  effort:"999",
                  condiEffort: 999,
                  rwd: "999",
                  condiRwd: 999,
            },
      };

      timelineTask.push(instr_exp);

      for(var trial = 0; trial < nbTrialsExp; trial++){

            // First, fixation
            timelineTask.push(fixation);

            effort_sentence = effort_exp[condi_shuffled[trial][1]-1].join();
            rwd_sentence =  rwd_exp[condi_shuffled[trial][0]-1].join();
            // -1 because of the Javascript zero-indexing

            var quest_exp = {
                  type:'html-button-response',
                  stimulus:"<p> J'accepte de </p>" + effort_sentence + "<p> pour </p>" + rwd_sentence + "<p> </p>",
                  choices: ['OUI', 'NON'],
                  response_ends_trial: false,
                  trial_ends_duration: feedback_time,
                  data: {
                        test_part: 'quest_exp',
                        trialNb: trial,
                        effort: effort_sentence,
                        condiEffort: condi_shuffled[trial][1],
                        rwd: rwd_sentence,
                        condiRwd: condi_shuffled[trial][0],
                  },
            };

            timelineTask.push(quest_exp);
            timelineTask.push(fullscreenExp);
      } // End of the trial

      return timelineTask;
} // end of the function
