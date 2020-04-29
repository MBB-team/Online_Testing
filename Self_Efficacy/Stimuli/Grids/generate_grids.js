/*
*
* Generates a set of nbTrial grids
*
*/

function generate_grids(nbTrials, numbersImg, grid_indexes){

  var flip_stimuli_base = [[0, 0, 0, 0],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0]];

  var flip_stimuli = Array(nbTrials);// = jsPsych.randomization.repeat(flip_stimuli_base, nbTrials); // create nbTrials grids

  for (var grid_i = 0; grid_i <= nbTrials-1; grid_i++){ // for each grid

    var flip_stimuli_base = [[0, 0, 0, 0],
                             [0, 0, 0, 0],
                             [0, 0, 0, 0],
                             [0, 0, 0, 0]];

    for (var pair_i = 0; pair_i <= numbersImg.length-1; pair_i++) { // and for each pair on the grid
      for (var number_i = 0; number_i < 2; number_i++){ // for each number in the pair

        var row_i = grid_indexes[grid_i][pair_i][number_i][0] - 1; // row index
        var col_i = grid_indexes[grid_i][pair_i][number_i][1] - 1; // column index

        flip_stimuli_base[row_i][col_i] = numbersImg[pair_i];

      }
    }

    flip_stimuli[grid_i] = flip_stimuli_base;
  }


  return flip_stimuli;

}
