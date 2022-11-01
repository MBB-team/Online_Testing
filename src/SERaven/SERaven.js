function SERaven(nbBlocks,nbTrials,exp){
  // Generates trial timeline structure //

  // INITIALISATION //
  var timelineTask = [];
  var JSblockInd = 0;
  var JSblockChangeInd = 0;
  var JSTinBInd = -1;
  var trialInd = 0;

  // start trial loop
  for (var JStrialInd = 0; JStrialInd < nbTrials; JStrialInd++){
    trialInd++;
    if (JStrialInd == exp.blockChangeInd[JSblockChangeInd]){
      JSblockInd++; // if we are at a block transition, increment the counters
      JSblockChangeInd++;
      JSTinBInd = -1;
    };
    JSTinBInd++; // increment the trial within block counter

    // what type of block are we in?
    switch(JSblockInd){
      case 0: // ========= First block of no feedback ========= //

      // Trial #, Domain, and Effort Want
      var effort_want = {
        type: 'html-slider-response-effort-want-WH',
        prompt: '<p> Exercice : '+trialInd+'/'+nbTrials+'.<p style="font-size:30px">Domain: #.</p><p style="font-size:30px">Reward: #.</p><div><br></div>',
        stimulus: '<p> Pendant combien de temps souhaitez-vous voir la grille ?</p>',
        labels: [''],
        min: exp.eff[0],
        max: exp.eff[1],
        start: function(){return randi(exp.eff[0],exp.eff[1]);},
        require_movement: false,
        effort: true,
        on_finish: function(data){
          flip_fb = data.slider_response
        },
        data: {
          trialNb: trialInd
        }
      }; // effort want

      timelineTask.push(fullscreenExp);
      timelineTask.push(effort_want);

      // effort
      var effort = {
        type: 'html-button-response-effort-WH',
        stimulus: block1Stimuli_html[JSTinBInd],
        choices: ['1','2','3'],
        prompt: 'Which one is the next in the sequence?',
        stimulus_duration: function(){
          return flip_fb*1000;
        },
        reward: exp.rew[JStrialInd],
        target_score: exp.domain[JStrialInd],
        timer: true,
        data: {
          trialNb: trialInd
        }
      }; // effort

      timelineTask.push(fullscreenExp);
      timelineTask.push(effort);

      // Confidence about success
      var test_conf = {
        type: 'html-slider-response-WH',
        stimulus: '<p> How confident are you that was the correct response?</p><p>0% = <b>Not confident at all</b> et 100% = <b>Fully confident</b></p>',
        labels: ['0%','25%','50%','75%','100%'],
        min: 0,
        max: 100,
        start: function(){return randi(0,100);},
        require_movement: false,
        data: {
          trialNb: trialInd
        }
      }; // test_conf

      timelineTask.push(fullscreenExp);
      timelineTask.push(test_conf);

      break;
      case 1: // ========= False feedback ========= //

      // Trial #, Domain, and Effort Want
      var effort_want = {
        type: 'html-slider-response-effort-want-WH',
        prompt: '<p> Exercice : '+trialInd+'/'+nbTrials+'.<p style="font-size:30px">Domain: #.</p><p style="font-size:30px">Reward: #.</p><div><br></div>',
        stimulus: '<p> Pendant combien de temps souhaitez-vous voir la grille ?</p>',
        labels: [''],
        min: exp.eff[0],
        max: exp.eff[1],
        start: function(){return randi(exp.eff[0],exp.eff[1]);},
        require_movement: false,
        effort: true,
        on_finish: function(data){
          flip_fb = data.slider_response
        },
        data: {
          trialNb: trialInd
        }
      }; // effort want

      timelineTask.push(fullscreenExp);
      timelineTask.push(effort_want);

      // effort
      var effort = {
        type: 'html-button-response-effort-WH',
        stimulus: block2Stimuli_html[JSTinBInd],
        choices: ['1','2','3'],
        prompt: 'Which one is the next in the sequence?',
        stimulus_duration: function(){
          return flip_fb*1000;
        },
        reward: exp.rew[JStrialInd],
        target_score: exp.domain[JStrialInd],
        timer: true,
        data: {
          trialNb: trialInd
        }
      }; // effort

      timelineTask.push(fullscreenExp);
      timelineTask.push(effort);

      // Confidence about success
      var test_conf = {
        type: 'html-slider-response-WH',
        stimulus: '<p> How confident are you that was the correct response?</p><p>0% = <b>Not confident at all</b> et 100% = <b>Fully confident</b></p>',
        labels: ['0%','25%','50%','75%','100%'],
        min: 0,
        max: 100,
        start: function(){return randi(0,100);},
        require_movement: false,
        data: {
          trialNb: trialInd
        }
      }; // test_conf

      timelineTask.push(fullscreenExp);
      timelineTask.push(test_conf);

      // False feedback
      var feedback = {
        type: 'html-button-response-WH',
        stimulus: '',
        reward: exp.rew[JStrialInd],
        choices: ['Passer au prochain exercice'],
        on_start: function(feedback){
          var rew_current = feedback.reward;

          var pz = sigmoid( fb_regime.PSE[0][0] + fb_regime.PSE[0][1]*( Math.pow( (flip_fb/exp.eff[1]) , Math.exp(-fb_regime.PSE[0][2]) ) ) );
          var bern = Sampling.Bernoulli(pz);
          var fb = bern.draw();

          if (fb == 1){
            feedback.stimulus = '<p>You were <b>correct.</b></p><p>You have won '+rew_current+' points.</p>';
          } else {
            feedback.stimulus = '<p>You were <b>incorrect.</b></p><p>You have won 0 points.</p>';
          };
        },
        data: {
          trialNb: trialInd
        }
      }; // feedback

      timelineTask.push(fullscreenExp);
      timelineTask.push(feedback);


      break;
      case 2: // ========= Second block of no feedback ========= //

      // Trial #, Domain, and Effort Want
      var effort_want = {
        type: 'html-slider-response-effort-want-WH',
        prompt: '<p> Exercice : '+trialInd+'/'+nbTrials+'.<p style="font-size:30px">Domain: #.</p><p style="font-size:30px">Reward: #.</p><div><br></div>',
        stimulus: '<p> Pendant combien de temps souhaitez-vous voir la grille ?</p>',
        labels: [''],
        min: exp.eff[0],
        max: exp.eff[1],
        start: function(){return randi(exp.eff[0],exp.eff[1]);},
        require_movement: false,
        effort: true,
        on_finish: function(data){
          flip_fb = data.slider_response
        },
        data: {
          trialNb: trialInd
        }
      }; // effort want

      timelineTask.push(fullscreenExp);
      timelineTask.push(effort_want);

      // effort
      var effort = {
        type: 'html-button-response-effort-WH',
        stimulus: block3Stimuli_html[JSTinBInd],
        choices: ['1','2','3'],
        prompt: 'Which one is the next in the sequence?',
        stimulus_duration: function(){
          return flip_fb*1000;
        },
        reward: exp.rew[JStrialInd],
        target_score: exp.domain[JStrialInd],
        timer: true,
        data: {
          trialNb: trialInd
        }
      }; // effort

      timelineTask.push(fullscreenExp);
      timelineTask.push(effort);

      // Confidence about success
      var test_conf = {
        type: 'html-slider-response-WH',
        stimulus: '<p> How confident are you that was the correct response?</p><p>0% = <b>Not confident at all</b> et 100% = <b>Fully confident</b></p>',
        labels: ['0%','25%','50%','75%','100%'],
        min: 0,
        max: 100,
        start: function(){return randi(0,100);},
        require_movement: false,
        data: {
          trialNb: trialInd
        }
      }; // test_conf

      timelineTask.push(fullscreenExp);
      timelineTask.push(test_conf);

    }; // block switch



  }; // end of trial loop

  return timelineTask;
};
