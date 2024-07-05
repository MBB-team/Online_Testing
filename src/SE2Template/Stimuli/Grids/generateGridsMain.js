/*
*
* Generates a set of nbTrial grids
* Bits taken from jsPsych-serial-reaction time plugin and modified to have two images
* nxn grid that only shows images up to TS
* William Hopper - 30/04/2020
* Updated: 23/11/2022
*
*/

function generateGridsMain(numbersImg, numbersImg2, gridIndexesPt, squareSize, matchingPairs, TSPt, grid){

  var nbTrials    = gridIndexesPt.length
  var gridStimuli = Array(nbTrials);
  var gridCounter = 0;
  var n_TS;

  for (var grid_i = 0; grid_i <= nbTrials-1; grid_i++){ // for each grid

    var grid_num = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(999));

    n_TS = exp.TS[TSPt[grid_i]]; // get the current TS

    // fill the rest of the grid with randomly pulled numbers
    var n_filler_letters = grid.length*grid[0].length - n_TS*2;
    var filler_letters   = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],n_filler_letters);
    var filler_counter   = -1;

    for (var pair_i = 0; pair_i < n_TS; pair_i++){
      var row_i = [null,null];
      var col_i = [null,null];

      for (var number_i = 0; number_i < 2; number_i++){ // for each number in the pair
        row_i[number_i] = gridIndexesPt[grid_i][pair_i][number_i][0] - 1; // row index
        col_i[number_i] = gridIndexesPt[grid_i][pair_i][number_i][1] - 1; // column index

        grid_num[row_i[number_i]][col_i[number_i]] = pair_i; // assign each number to its location in the grid

      }
    }


    var stimulus = "<div id='jspsych-SE_WH-stimulus' style='margin:auto; display: table; table-layout: fixed; border-spacing:"+squareSize/4+"px'>";
    for(var i=0; i<grid.length; i++){
      stimulus += "<div class='jspsych-SE_WH-stimulus-row' style='display:table-row;'>";
      for(var j=0; j<grid[i].length; j++){
        var classname = 'jspsych-SE_WH-stimulus-cell';
        stimulus += "<div class='"+classname+"' id='jspsych-SE_WH-stimulus-cell-"+i+"-"+j+"' "+
        "data-row="+i+" data-column="+j+" target = _"+grid_num[i][j]+" "+
        "style='width:"+squareSize+"px; height:"+squareSize+"px; display:table-cell; vertical-align:middle; text-align: center; cursor: pointer; font-size:"+squareSize/2+"px;";

        if(grid[i][j] == 1){
          stimulus += "border: 2px solid black;'"
        }
        stimulus += ">";
        // first image location
        if (grid_num[i][j] != 999){
          stimulus += '<img src="'+numbersImg[grid_num[i][j]]+'" style="height:'+squareSize+'px; width:auto"></img>';
        } else {
          filler_counter++;
          stimulus += '<img src="'+lettersImg[filler_letters[filler_counter]]+'" style="height:'+squareSize+'px; width:auto"></img>';
        }
        // // second image location
        // if(matching_pairs == 1){ // are both numbers the same?
        //   stimulus += '<img src="'+numbersImg[grid_num[i][j]]+'"  style="height:'+squareSize+'px; width:auto"></img>';
        // } else {
        //   stimulus += '<img src="'+numbersImg2[grid_num[i][j]]+'" style="height:'+squareSize+'px; width:auto"></img>';
        // };

        stimulus += "</div>";

      } // for each column
      stimulus += "</div>";
    } // for each row
    stimulus += "</div>";

    gridStimuli[grid_i] = stimulus;
  }; // for each grid

  return gridStimuli;

}; // function
