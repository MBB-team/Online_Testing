function pseudorandomize_conditions()
{
  var trial_type_1 = [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81] //trials type 0.20 gain
  var trial_type_2 = [41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60] //trials type 0.40 gain
  var trial_type_3 = [21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40] // trials type 0.60 gain
  var trial_type_4 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] // trials type 0.80 gain
  var trial_type_5 = [83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105]//trials type 0.20 loss
  var trial_type_6 = [106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123] //trials type 0.40 loss
  var trial_type_7 = [124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143]//trials type 0.60 loss
  var trial_type_8 = [144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164]//trials type 0.80 loss
  var trial_type_CT1 = [0,82] // Catch trials type (25 euros vs. 0.05 prob of win --> 0 for gain frame, 82 for loss frame)
  var trial_type_CT2 = [83,165]// Catch trials type (25 euros vs. 0.95 prob of win) --> 83 for gain frame, 165 for loss frame

  var rand_trial_type_1 = jsPsych.randomization.repeat(trial_type_1, 1)
  var rand_trial_type_2 = jsPsych.randomization.repeat(trial_type_2, 1)
  var rand_trial_type_3 = jsPsych.randomization.repeat(trial_type_3, 1)
  var rand_trial_type_4 = jsPsych.randomization.repeat(trial_type_4, 1)
  var rand_trial_type_5 = jsPsych.randomization.repeat(trial_type_5, 1)
  var rand_trial_type_6 = jsPsych.randomization.repeat(trial_type_6, 1)
  var rand_trial_type_7 = jsPsych.randomization.repeat(trial_type_7, 1)
  var rand_trial_type_8 = jsPsych.randomization.repeat(trial_type_8, 1)
  var rand_trial_type_CT1 = jsPsych.randomization.repeat(trial_type_CT1, 1)
  var rand_trial_type_CT2 = jsPsych.randomization.repeat(trial_type_CT2, 1)

  var my_order_block_1 = [rand_trial_type_1[0],rand_trial_type_2[0], rand_trial_type_3[0],rand_trial_type_4[0], rand_trial_type_5[0], rand_trial_type_6[0], rand_trial_type_7[0], rand_trial_type_1[0]]
  var my_order_block_2 = [rand_trial_type_1[1],rand_trial_type_2[1], rand_trial_type_3[1],rand_trial_type_4[1], rand_trial_type_5[1], rand_trial_type_6[1], rand_trial_type_7[1], rand_trial_type_1[1]]
  // var my_order_block_3 = [rand_trial_type_1[2],rand_trial_type_2[2], rand_trial_type_3[2],rand_trial_type_4[2], rand_trial_type_5[2], rand_trial_type_6[2], rand_trial_type_7[2], rand_trial_type_1[2]]
  // var my_order_block_4 = [rand_trial_type_1[3],rand_trial_type_2[3], rand_trial_type_3[3],rand_trial_type_4[3], rand_trial_type_5[3], rand_trial_type_6[3], rand_trial_type_7[3], rand_trial_type_1[3]]

  var rand_trial_block_1 = jsPsych.randomization.repeat(my_order_block_1, 1)
  var rand_trial_block_2 = jsPsych.randomization.repeat(my_order_block_2, 1)
  // var rand_trial_block_3 = jsPsych.randomization.repeat(my_order_block_3, 1)
  // var rand_trial_block_4 = jsPsych.randomization.repeat(my_order_block_4, 1)

  var my_order = rand_trial_block_1.concat(rand_trial_type_CT1[0], rand_trial_block_2, rand_trial_type_CT2[0]);
  return my_order
} // end function
