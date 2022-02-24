function SE2_training(){

  // INITIALISATION //
  var timelineTask  = [];
  var nCorrect      = 0; // the number of correct responses given by the pts
  var correct_i     = [0,0,0,0,0,0,0,0]; // array of correct response indexes
  var test_counter  = 0; // counter for looping through test trials during execution
  var clicked_i     = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the participants click
  var flib_fb       = []; // flip length of time for feedback
  var train_TS      = 4;
  var train_rew     = 1;

  // First instructions
  var instructions = {
    type: 'instructions-WH',
    pages: instrImg_html.splice(0,2),
    show_clickable_nav: true,
    data: {
      blockNb: 999,
      trialNb: 999,
      TinB: 999,
      testNb: 999,
      target_score: 999,
      test_part: 'instructions',
      nTS: 999
    }
  };









  return timelineTask_train
}
