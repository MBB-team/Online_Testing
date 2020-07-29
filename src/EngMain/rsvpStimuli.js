rsvpStimuli = function(grid, square_size){

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
};
