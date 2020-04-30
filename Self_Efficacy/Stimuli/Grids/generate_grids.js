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


        var stimulus = "<div id='jspsych-SE_WH-stimulus' style='margin:auto; display: table; table-layout: fixed; border-spacing:"+square_size/4+"px'>";
        for(var i=0; i<grid.length; i++){
          stimulus += "<div class='jspsych-SE_WH-stimulus-row' style='display:table-row;'>";
          for(var j=0; j<grid[i].length; j++){
            var classname = 'jspsych-SE_WH-stimulus-cell';

            stimulus += "<div class='"+classname+"' id='jspsych-SE_WH-stimulus-cell-"+i+"-"+j+"' "+
            "data-row="+i+" data-column="+j+" "+
            "style='width:"+square_size+"px; height:"+square_size+"px; display:table-cell; vertical-align:middle; text-align: center; cursor: pointer; font-size:"+square_size/2+"px;";

            if(grid[i][j] == 1){
              stimulus += "border: 2px solid black;"
            }

            stimulus += "'>";
            // first image location
            if(i == row_i[0] && j == col_i[0]){
              stimulus += '<img src="'+numbersImg[pair_i]+'" style="height:'+square_size+'px; width:auto"></img>';
            }

            // second image location
            if(i == row_i[1] && j == col_i[1]){
              stimulus += '<img src="'+numbersImg[pair_i]+'" style="height:'+square_size+'px; width:auto"></img>';
            }

            stimulus += "</div>";
          }

          stimulus += "</div>";
        }
        stimulus += "</div>";

        flip_stimuli[grid_counter] = stimulus;
        grid_counter++;

      } // each pair on grid
    } // each grid

    return flip_stimuli;

}; // function

//function generate_grids(nbTrials, numbersImg, grid_indexes_shuffled){
//
//  var flip_stimuli = Array(nbTrials*8);// = jsPsych.randomization.repeat(flip_stimuli_base, nbTrials); // create nbTrials grids
//  var grid_counter = 0;
//
//  for (var grid_i = 0; grid_i <= nbTrials-1; grid_i++){ // for each grid
//
//    for (var pair_i = 0; pair_i <= numbersImg.length-1; pair_i++) { // and for each pair on the grid
//
//          var flip_stimuli_base = [[greySquare, greySquare, greySquare, greySquare],
//                                   [greySquare, greySquare, greySquare, greySquare],
//                                   [greySquare, greySquare, greySquare, greySquare],
//                                   [greySquare, greySquare, greySquare, greySquare]];
//
//      for (var number_i = 0; number_i < 2; number_i++){ // for each number in the pair
//
//        var row_i = grid_indexes_shuffled[grid_i][pair_i][number_i][0] - 1; // row index
//        var col_i = grid_indexes_shuffled[grid_i][pair_i][number_i][1] - 1; // column index
//
//        flip_stimuli_base[row_i][col_i] = numbersImg[pair_i];
//
//      }
//
//      flip_stimuli[grid_counter] = flip_stimuli_base;
//      grid_counter = grid_counter + 1;
//
//    }
//
//  }
//
//  return flip_stimuli;
//
//}
