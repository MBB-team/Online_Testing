/*
*
* Generates a set of nbTrial grids
* Bits taken from jsPsych-serial-reaction time plugin and modified to have two images
* William Hopper - 30/04/2020
*
*/

function generate_grids(nbTrials, numbersImg, grid_indexes_shuffled, square_size){

  var flip_stimuli = Array(nbTrials*8);
  var grid_counter = 0;
  grid = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];

  for (var grid_i = 0; grid_i <= nbTrials-1; grid_i++){ // for each grid

    for (var pair_i = 0; pair_i <= numbersImg.length-1; pair_i++) { // and for each pair on the grid

      var row_i = [];
      var col_i = [];

      for (var number_i = 0; number_i < 2; number_i++){ // for each number in the pair

        row_i[number_i] = grid_indexes_shuffled[grid_i][pair_i][number_i][0] - 1; // row index
        col_i[number_i] = grid_indexes_shuffled[grid_i][pair_i][number_i][1] - 1; // column index

      }

        var stimulus_summary = {}; // stimulus parameters only to reduce saved size in database
        var stimulus = "<div id='jspsych-SE_WH-stimulus' style='margin:auto; display: table; table-layout: fixed; border-spacing:"+square_size/4+"px'>";
        for(var i=0; i<grid.length; i++){
          stimulus += "<div class='jspsych-SE_WH-stimulus-row' style='display:table-row;'>";
          for(var j=0; j<grid[i].length; j++){
            stimulus_summary[i+'_'+j] = {};
            var classname = 'jspsych-SE_WH-stimulus-cell';

            if      (i == row_i[0] && j == col_i[0]){var img_present = 1}
            else if (i == row_i[1] && j == col_i[1]){var img_present = 1}
            else {var img_present = 0};

            stimulus += "<div class='"+classname+"' id='jspsych-SE_WH-stimulus-cell-"+i+"-"+j+"' "+
            "data-row="+i+" data-column="+j+" target = _"+img_present+" "+
            "style='width:"+square_size+"px; height:"+square_size+"px; display:table-cell; vertical-align:middle; text-align: center; cursor: pointer; font-size:"+square_size/2+"px;";
            stimulus_summary[i+'_'+j]['pres'] = img_present;

            if(grid[i][j] == 1){
              stimulus += "border: 2px solid black;'"
            }

            // add a tag to indicate stimuli is in this cell


            stimulus += ">";
            // first image location
            if(i == row_i[0] && j == col_i[0]){
              stimulus += '<img src="'+numbersImg[pair_i]+'" style="height:'+square_size+'px; width:auto"></img>';
              stimulus_summary[i+'_'+j]['nb'] = pair_i + 1;
            }
            // second image location
            if(i == row_i[1] && j == col_i[1]){
              stimulus += '<img src="'+numbersImg[pair_i]+'" style="height:'+square_size+'px; width:auto"></img>';
              stimulus_summary[i+'_'+j]['nb'] = pair_i + 1;
            }

            stimulus += "</div>";
          }

          stimulus += "</div>";
        }
        stimulus += "</div>";

        flip_stimuli[grid_counter]={};
        flip_stimuli[grid_counter]['stimulus'] = stimulus;
        flip_stimuli[grid_counter]['stimulus_summary'] = stimulus_summary;
        grid_counter++;

      } // each pair on grid
    } // each grid

    return flip_stimuli;

}; // function
