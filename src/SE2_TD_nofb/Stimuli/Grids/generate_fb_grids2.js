/*
*
* Generates a set of nbTrial grids
* Bits taken from jsPsych-serial-reaction time plugin and modified to have two images
* William Hopper - 30/04/2020
*
*/

function generate_fb_grids2(grid_i,numbersImg, numbersImg2, grid_indexes_shuffled, square_size, matching_pairs){

  var flip_stimuli = [];
  var grid_counter = 0;
  var grid = [[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]];


    var grid_num = [[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]];

    for (var pair_i = 0; pair_i <= numbersImg.length-1; pair_i++){
      var row_i = [];
      var col_i = [];

      for (var number_i = 0; number_i < 2; number_i++){ // for each number in the pair

        row_i[number_i] = grid_indexes_shuffled[grid_i][pair_i][number_i][0] - 1; // row index
        col_i[number_i] = grid_indexes_shuffled[grid_i][pair_i][number_i][1] - 1; // column index

        grid_num[row_i[number_i]][col_i[number_i]] = pair_i; // assign each number to its location in the grid

      }
    }


    var stimulus = "<div id='jspsych-SE_WH-stimulus' style='margin:auto; display: table; table-layout: fixed; border-spacing:"+square_size/4+"px'>";
    for(var i=0; i<grid.length; i++){
      stimulus += "<div class='jspsych-SE_WH-stimulus-row' style='display:table-row;'>";
      for(var j=0; j<grid[i].length; j++){
        var classname = 'jspsych-SE_WH-stimulus-cell';
        stimulus += "<div class='"+classname+"' id='jspsych-SE_WH-stimulus-cell-"+i+"-"+j+"' "+
        "data-row="+i+" data-column="+j+" target = _"+grid_num[i][j]+" "+
        "style='width:"+square_size+"px; height:"+square_size+"px; display:table-cell; vertical-align:middle; text-align: center; cursor: pointer; font-size:"+square_size/2+"px;";

        if(grid[i][j] == 1){
          stimulus += "border: 2px solid black;'"
        }
        stimulus += ">";
        // first image location
        stimulus += '<img src="'+numbersImg[grid_num[i][j]]+'" style="height:'+square_size+'px; width:auto"></img>';

        // // second image location
        // if(matching_pairs == 1){ // are both numbers the same?
        //   stimulus += '<img src="'+numbersImg[grid_num[i][j]]+'"  style="height:'+square_size+'px; width:auto"></img>';
        // } else {
        //   stimulus += '<img src="'+numbersImg2[grid_num[i][j]]+'" style="height:'+square_size+'px; width:auto"></img>';
        // };

        stimulus += "</div>";

      } // for each column
      stimulus += "</div>";
    } // for each row
    stimulus += "</div>";

    flip_stimuli = stimulus;

  return flip_stimuli;

}; // function