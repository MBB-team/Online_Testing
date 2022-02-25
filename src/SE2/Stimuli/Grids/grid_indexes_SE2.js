/**
* Array of grid indexes[grid][number][1st || 2nd]
* Remember to minus 1 if using as index!!
**/


// diff 6 4x4
var grid_indexes_original =
[[[[[4,2],[1,2]],[[4,1],[1,4]],[[1,3],[1,1]],[[2,1],[2,2]],[[4,4],[4,3]],[[3,1],[3,2]],[[2,4],[3,4]],[[3,3],[2,3]]],
 [[[4,3],[4,4]],[[2,4],[4,1]],[[3,3],[4,2]],[[2,3],[3,4]],[[1,4],[2,2]],[[1,2],[1,3]],[[3,2],[3,1]],[[2,1],[1,1]]],
 [[[2,3],[3,3]],[[1,2],[3,1]],[[2,4],[1,4]],[[1,3],[4,1]],[[4,3],[4,4]],[[1,1],[2,2]],[[4,2],[2,1]],[[3,4],[3,2]]],
 [[[1,1],[4,1]],[[2,1],[3,1]],[[1,4],[2,2]],[[2,3],[3,4]],[[3,2],[4,2]],[[1,3],[1,2]],[[3,3],[4,3]],[[2,4],[4,4]]],
 [[[2,3],[3,3]],[[1,3],[4,2]],[[4,1],[3,2]],[[2,2],[1,1]],[[3,1],[2,4]],[[4,3],[4,4]],[[3,4],[1,2]],[[2,1],[1,4]]],
 [[[2,3],[2,2]],[[4,3],[1,4]],[[2,4],[1,3]],[[3,1],[1,2]],[[4,2],[3,2]],[[1,1],[3,3]],[[4,4],[3,4]],[[4,1],[2,1]]],
 [[[1,3],[4,3]],[[3,2],[3,1]],[[2,4],[1,2]],[[2,3],[3,4]],[[3,3],[4,2]],[[2,2],[2,1]],[[1,1],[4,4]],[[1,4],[4,1]]],
 [[[4,2],[4,3]],[[4,4],[1,2]],[[1,3],[1,1]],[[3,2],[2,3]],[[2,2],[3,4]],[[2,1],[3,1]],[[1,4],[3,3]],[[4,1],[2,4]]],
 [[[1,1],[3,1]],[[3,4],[2,2]],[[4,2],[4,1]],[[1,4],[2,4]],[[1,2],[4,4]],[[3,3],[2,3]],[[2,1],[1,3]],[[3,2],[4,3]]],
],[[[[4,4],[1,4]],[[3,4],[1,2]],[[3,3],[3,2]],[[2,2],[4,2]],[[1,3],[1,1]],[[2,3],[4,1]],[[3,1],[4,3]],[[2,4],[2,1]]],
 [[[1,4],[2,4]],[[3,4],[1,3]],[[1,2],[3,2]],[[2,1],[4,4]],[[3,1],[2,2]],[[4,2],[4,1]],[[2,3],[1,1]],[[4,3],[3,3]]],
 [[[4,4],[4,1]],[[2,3],[1,1]],[[4,3],[3,4]],[[1,2],[2,2]],[[4,2],[2,1]],[[1,4],[1,3]],[[2,4],[3,1]],[[3,3],[3,2]]],
 [[[4,4],[3,3]],[[2,3],[1,4]],[[2,1],[4,3]],[[3,2],[2,2]],[[4,1],[4,2]],[[1,2],[3,1]],[[1,3],[2,4]],[[1,1],[3,4]]],
 [[[1,1],[2,1]],[[2,2],[4,4]],[[1,3],[3,3]],[[3,1],[4,1]],[[2,4],[1,2]],[[4,3],[3,4]],[[2,3],[1,4]],[[4,2],[3,2]]],
 [[[2,4],[2,1]],[[1,4],[3,3]],[[3,2],[1,2]],[[2,2],[4,4]],[[2,3],[1,3]],[[4,1],[3,1]],[[1,1],[3,4]],[[4,3],[4,2]]],
 [[[4,3],[1,3]],[[2,2],[1,4]],[[4,2],[3,2]],[[4,1],[1,1]],[[2,1],[3,4]],[[3,3],[1,2]],[[3,1],[4,4]],[[2,4],[2,3]]],
 [[[4,4],[4,3]],[[1,4],[3,1]],[[2,2],[2,3]],[[1,1],[4,1]],[[1,2],[3,4]],[[4,2],[3,3]],[[2,1],[2,4]],[[3,2],[1,3]]],
 [[[2,2],[1,2]],[[2,4],[4,1]],[[2,3],[3,3]],[[2,1],[1,3]],[[1,4],[4,4]],[[4,2],[4,3]],[[3,2],[1,1]],[[3,1],[3,4]]],
],[[[[4,1],[3,1]],[[3,4],[2,3]],[[4,3],[2,1]],[[2,2],[1,3]],[[1,1],[4,4]],[[4,2],[1,2]],[[3,2],[1,4]],[[3,3],[2,4]]],
 [[[3,1],[4,1]],[[1,2],[2,4]],[[4,3],[4,2]],[[2,2],[1,4]],[[1,1],[1,3]],[[3,2],[3,4]],[[2,1],[3,3]],[[4,4],[2,3]]],
 [[[4,2],[1,2]],[[1,4],[3,3]],[[2,2],[3,2]],[[2,1],[3,1]],[[1,1],[4,3]],[[4,4],[2,4]],[[4,1],[3,4]],[[2,3],[1,3]]],
 [[[3,3],[4,2]],[[4,1],[3,2]],[[3,1],[4,3]],[[1,4],[2,4]],[[2,1],[1,3]],[[2,2],[3,4]],[[4,4],[1,2]],[[2,3],[1,1]]],
 [[[2,3],[1,3]],[[3,2],[4,1]],[[2,4],[3,1]],[[3,3],[3,4]],[[4,2],[1,1]],[[1,2],[2,1]],[[1,4],[4,4]],[[2,2],[4,3]]],
 [[[4,1],[4,2]],[[4,4],[1,3]],[[3,2],[3,3]],[[1,2],[2,4]],[[3,4],[3,1]],[[2,2],[2,3]],[[2,1],[4,3]],[[1,4],[1,1]]],
 [[[4,4],[2,4]],[[2,2],[2,1]],[[3,1],[2,3]],[[1,2],[3,2]],[[1,1],[4,3]],[[4,2],[1,3]],[[1,4],[3,4]],[[3,3],[4,1]]],
 [[[3,4],[4,3]],[[4,1],[1,2]],[[3,1],[2,1]],[[1,4],[2,4]],[[1,1],[3,2]],[[3,3],[4,4]],[[2,2],[2,3]],[[1,3],[4,2]]],
 [[[4,1],[3,2]],[[1,1],[2,1]],[[2,4],[4,2]],[[3,3],[1,3]],[[1,4],[4,3]],[[2,2],[2,3]],[[1,2],[3,1]],[[3,4],[4,4]]]]];

 // training grid
var train_grid_indexes =
[[[[1,1],[1,4]],[[2,2],[2,3]],[[3,1],[3,4]],[[4,2],[4,3]],[[1,2],[1,3]],[[2,1],[2,4]],[[3,2],[3,3]],[[4,1],[4,4]]]];