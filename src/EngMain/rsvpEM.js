function rsvpEM(nbTrials){

  // INITIALISATION //
  var timelineTask = [];

  // START OF MAIN //
  for (var trial_i = 0; trial_i < nbTrials; trial_i++) {

    // TRIAL NUMBER //
    var trial_number = {
      type: 'html-button-response-WH-EM',
      stimulus: '<p>C&#39est le de&#769but d&#39essai <b>'+(trial_i+1)+'</b>.</p><p>Lorsque vous e&#770tes pre&#770t.e, cliquez sur le bouton.</p> ',
      choices: ['C&#39est parti !']
    }; // trial number

    timelineTask.push(trial_number);

    str = ["111111111","2222222222","3333333333","4444444444","5555555555","6666666666","7777777777","8888888888","9999999999","!!!!!!!!!!"]
    for (var stim_i = 0; stim_i < 9; stim_i++){

    // Show stimulus //
    var one_stim = {
      type: 'html-keyboard-response-WH-EM',
      stimulus: str[stim_i],
      choices:  [32],
      trial_duration: time.stim_dur,
      response_ends_trial: false,
      target: [0],
      grid: [[0,3,0,3,0],[3,1,2,1,3],[0,3,0,3,0]],
      grid_square_size: 100
    }; // show stim

    timelineTask.push(one_stim);

  }

  }


  return timelineTask;
}
