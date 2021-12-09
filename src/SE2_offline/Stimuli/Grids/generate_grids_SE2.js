/*
*
* Generates a set of nbTrial grids
* Bits taken from jsPsych-serial-reaction time plugin and modified to have two images
* William Hopper - 30/04/2020
*
*/

function generate_grids_SE2(nbTrials, numbersImg, numbersImg2, grid_indexes_shuffled, square_size, matching_pairs){

  var flip_stimuli = Array(nbTrials);
  var grid_counter = 0;
  grid = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];

  for (var grid_i = 0; grid_i <= nbTrials-1; grid_i++){ // for each grid

    var grid_numbers = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];

    for (var grid_numbers_i = 0; grid_numbers_i < numbersImg.length; grid_numbers_i++){ // for each pair

      var row_i = [];
      var col_i = [];

      for (var number_i = 0; number_i < 2; number_i++){ // for each number in the pair

        row_i[number_i] = grid_indexes_shuffled[grid_i][grid_numbers_i][number_i][0] - 1; // row index
        col_i[number_i] = grid_indexes_shuffled[grid_i][grid_numbers_i][number_i][1] - 1; // column index

      }

      grid_numbers[row_i[0]][col_i[0]] = grid_numbers_i;
      grid_numbers[row_i[1]][col_i[1]] = grid_numbers_i; // contruct grid array of numbers
    }

    var stimulus = "<div id='jspsych-SE_WH-stimulus' style='margin:auto; display: table; table-layout: fixed; border-spacing:"+square_size/4+"px'>";
    for(var i=0; i<grid.length; i++){
      stimulus += "<div class='jspsych-SE_WH-stimulus-row' style='display:table-row;'>";
      for(var j=0; j<grid[i].length; j++){
        var classname = 'jspsych-SE_WH-stimulus-cell';

        stimulus += "<div class='"+classname+"' id='jspsych-SE_WH-stimulus-cell-"+i+"-"+j+"' "+
        "style='width:"+square_size+"px; height:"+square_size+"px; display:table-cell; vertical-align:middle; text-align: center; cursor: pointer; font-size:"+square_size/2+"px;";

        if(grid[i][j] == 1){
          stimulus += "border: 2px solid black;'"
        }

        stimulus += ">";


        // first image location
        stimulus += '<img src="'+numbersImg[grid_numbers[i][j]]+'" style="height:'+square_size+'px; width:auto"></img>';

        stimulus += "</div>";
      }

      stimulus += "</div>";
    }
    stimulus += "</div>";

    flip_stimuli[grid_counter] = stimulus;
    grid_counter++;

  } // each grid

  return flip_stimuli;

}; // function
