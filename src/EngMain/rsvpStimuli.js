rsvpEMStimuli = function(grid, square_size){
  // generates the HTML string for the EngMain task

  // Stimulus HTML String //
  var stimulus = "<div id='jspsych-RSVP-EM-stimulus' style='margin:auto; display:table; table-layout:fixed; border-spacing:0px'>";//"+square_size/4+"px'>";
  for(var i=0; i<grid.length; i++){
    stimulus += "<div class='jspsych-RSVP-EM-stimulus-row' style='display:table-row;'>";
    for(var j=0; j<grid[i].length; j++){
      var classname = 'jspsych-RSVP-EM-stimulus-cell';

      stimulus += "<div class='"+classname+"' id='jspsych-RSVP-EM-stimulus-cell-"+i+"-"+j+"' "+
      "data-row="+i+" data-column="+j+" "+
      "style='border:0px solid black; width:"+square_size+"px; height:"+square_size+"px; display:table-cell; vertical-align:middle; text-align:center; font-size:"+square_size/2+"px;' ";

      if(grid[i][j] == 1){
        stimulus += "stream = 'target' "
      }
      if(grid[i][j] == 2){
        stimulus += "stream = 'switch' "
      }
      if(grid[i][j] == 3){
        stimulus += "stream = 'distractor'"
      }

      stimulus += ">";

      stimulus += "</div>";
    }
    stimulus += "</div>";
  }
  stimulus += "</div>";

  return stimulus;
}; // function

rsvpEMstrings = function(target_indexes, nbTar, nbStim){
  // generates the stimulus string for EngMain task on a trial by trial basis

  var target_string = [];
  var switch_string = [];
  var distr_string  = [];


  for (var diff_step = 0; diff_step < 8; diff_step++){

    var tar_index = target_indexes[diff_step].map(function(v){return (v - 1)});
    var NofSwi = tar_index.length - nbTar;
    var target_pop = Array(nbTar).fill([7]).flat();
    target_pop.push(Array(NofSwi).fill([3]).flat());
    target_pop = target_pop.flat();
    var target_order = jsPsych.randomization.shuffle(target_pop); // shuffle targets/switches

    // if a target is in the last position, swap with the ultimate switch to avoid keyboard resposne issues at end of trial (not long enough response window)
    if (target_order[target_order.length - 1] == 7){
      target_order[target_order.lastIndexOf(3)] = 7;
      target_order[target_order.length - 1] = 3;
    };

    // if a switch is in the first position, swap with the first target to match initial arrow
    if (target_order[0] == 3){
      target_order[target_order.indexOf(7)] = 3;
      target_order[0] = 7;
    }

    // generate string for target/switch streams
    var tar_str = randstr(nbStim).split('');
    var swi_str = randstr(nbStim).split('');

    // loop through and insert targets/switches into strings
    for (var tar_i = 0; tar_i < target_order.length; tar_i++){
      if (target_order[tar_i] == 7){
        tar_str[tar_index[tar_i]] = target_order[tar_i];
      } else {
        swi_str[tar_index[tar_i]] = target_order[tar_i];
      };
    }; // for each target/switch

    var distr_str = [];

    // Generate distraction streams
    for (var distr_str_i = 0; distr_str_i < 7; distr_str_i++){
      distr_str[distr_str_i] = randstr(nbStim).split('');
    }; // generate distraction strings


    target_string[diff_step] = tar_str;
    switch_string[diff_step] = swi_str;
    distr_string[diff_step]  = distr_str;

  }; // diff step

  // return strings for all the streams
  return [target_string, switch_string, distr_string]
}; // function
