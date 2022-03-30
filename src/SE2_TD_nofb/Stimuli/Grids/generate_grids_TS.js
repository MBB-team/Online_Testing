/*
*
* Generates a set of nbTrial grids
* Bits taken from jsPsych-serial-reaction time plugin and modified to have two images
* 4x4 grid that only shows images up to TS
* William Hopper - 30/04/2020
*
*/

function generate_grids_TS(nbTrials, numbersImg, numbersImg2, GIS, square_size, matching_pairs, TS, grid){

  var flip_stimuli = Array(nbTrials);
  var grid_counter = 0;


  for (var grid_i = 0; grid_i <= nbTrials-1; grid_i++){ // for each grid

    var grid_num = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(0));

    for (i=0; i<grid.length; i++){
      for (j=0; j<grid[i].length; j++){
        grid_num[i][j] = 999;
      }
    }

    n_TS = TS[grid_i];

    // fill the rest of the grid with randomly pulled numbers
    var n_filler_letters = grid.length*grid[0].length - n_TS*2;
    var filler_letters   = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],n_filler_letters);
    var filler_counter   = -1;

    for (var pair_i = 0; pair_i < n_TS; pair_i++){
      var row_i = [null,null];
      var col_i = [null,null];

      for (var number_i = 0; number_i < 2; number_i++){ // for each number in the pair
        row_i[number_i] = GIS[grid_i][pair_i][number_i][0] - 1; // row index
        col_i[number_i] = GIS[grid_i][pair_i][number_i][1] - 1; // column index

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
        if (grid_num[i][j] != 999){
          stimulus += '<img src="'+numbersImg[grid_num[i][j]]+'" style="height:'+square_size+'px; width:auto"></img>';
        } else {
          filler_counter++;
          stimulus += '<img src="'+lettersImg[filler_letters[filler_counter]]+'" style="height:'+square_size+'px; width:auto"></img>';
        }
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

    flip_stimuli[grid_i] = stimulus;
  }; // for each grid

  return flip_stimuli;

}; // function