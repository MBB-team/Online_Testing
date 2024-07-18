function SE3_reminders_S3Timeline(){
    // INITIALISATION //
    var timelineTask_train  = [];
      
      // Presentation slide 
         var instructions0 = {
          type: 'html-button-response-instructions-NM',
          stimulus: '<p style="font-size:70px">Jeu de mémory</p><p style="font-size:50px">Veuillez lire attentivement les instructions qui vont suivre.</p>',
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
      
        //Instructions slide 1 - 11
        var instructions1 = {
          type: 'html-button-response-instructions-NM',
          stimulus: [instrImg_S3_html[0]],
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
          type: 'html-button-response-instructions-NM',
          stimulus: [instrImg_S3_html[1]],
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
          type: 'html-button-response-instructions-NM',
          stimulus: [instrImg_S3_html[2]],
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
  
        return timelineTask_train;
  }