function SE_instruction_video(){

  // INITIALISATION //
  var timelineInst  = [];


  // Welcome screen
  var welcome = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p><strong>TEST DE METACOGNITION :</strong></p><p><strong>INSTRUCTIONS</strong></p><p></p><p>Veuillez regarder attentivement les instructions qui vont suivre.</p>',
  };


  // summary screen
  var summary = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>Ce test dure environs 55 minutes.</p><p>Il s&#39agit d&#39un test mesurant votre capacité à auto-évaluer correctement vos compétences mentales. '+
    'C&#39est ce qu&#39on appelle la métacognition.</p><p>En résumé, vous allez effectuer une série d&#39exercices de mémoire. Ces exercices seront plus ou moins difficiles. Pour chacun d&#39entre eux, nous vous demanderons d&#39auto-évaluer votre performance.</p>'
  };


  // phase de memoire screen
  var principe = {
    type: 'html-keyboard-response-WH',
    stimulus: grid_stimuli[0][0],
    prompt: '<p>Lors de chaque exercise de mémoire, vous devrez vous souvenir de la position de 8 paires de chiffres disposés sur une grille carrée.</p>'+
    '<p>Dans cet exemple, les deux chiffres « 1 » forment une paire, dont chaque element est positionné sur un emplacement de la grille.</p>'
  };

  // phase de memoire screen
  var principe2 = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>Chaque paire de chiffre de la grille vous sera dévoilée, dans l&#39ordre (de 1 à 8).</p><p>Voici un exemple :</p>'
  };

  // phase de memoire screen
  var principe_flip = {
    type: 'animation-WH',
    stimuli: grid_stimuli[0],
    frame_time: 123
  };

  // phase de memoire screen
  var principe3 = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>Vous aurez la possibilité de doser votre effort de mémorisation en visualisant l&#39emplacement des 8 paires de chiffres autant de fois que vous le souhaitez, avant de démarrer la phase de test.</p>'
  };


  // phase de test screen
  var test_principe = {
    type: 'html-keyboard-response-WH',
    stimulus: grid_stimuli_test[0][0],
    prompt: '<p>Pendant la phase de test, nous testerons votre mémoire en vous montrant l&#39un des chiffres composant une paire.</p>'+
    '<p>Vous devrez alors nous indiquer l&#39emplacement de l&#39autre chiffre composant la paire.</p>' +
    '<p>Lors de chaque exercice de mémoire, vous serez testé sur plusieurs paires de chiffres.</p>'
  };


  // TRIAL NUMBER and TARGET SCORE //
  var trial_number1 = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>Pour réussir un exercice, il vous faudra donner un certain nombre de réponses correctes : c&#39est ce que nous appelons <b>le score cible</b> d&#39un exercice.</p>',
  }; // trial number


  // TRIAL NUMBER and TARGET SCORE //
  var trial_number2 = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>Certains exercices vous paraîtront faciles, parce que le score cible sera faible (4 ou 5 par exemple). D&#39autres vous paraîtront plus difficiles, parce que le score cible sera élevé (6 ou 7).</p>',
  }; // trial number


  // TRIAL NUMBER and TARGET SCORE //
  var trial_number3 = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>C&#39est le de&#769but de l&#39exercice <b>6</b>.</p><p>Le score cible pour cet exercice est: <b>4</b>.',
    prompt: '<br><p>Nous vous indiquerons le score cible au début de chaque exercice, comme ci-dessus.</p>',
  }; // trial number

  var summary2 = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>Au total, le test comprend 25 exercices de mémoire.</p><p>Chaque exercice se compose de deux phases :</p>'+
    '<p>1) La phase de mémorisation</p><p>2) La phase de test</p>'+
    '<p>En résumé, lors de chaque exercice de mémoire, vous adapterez votre effort pour essayer d&#39atteindre le score cible de l&#39exercice. Cela dit, vous ne serez pas toujours capable de réussir.</p>'+
    '<p>Pendant chaque exercice, nous vous demanderons donc de vous auto-évaluer deux fois. Ces auto-évaluations sont aussi importantes que la réussite des exercices !</p>'
  };

  var summary3 = {
    type: 'html-keyboard-response-WH',
    stimulus: 'Nous allons maintenant vous détailler les deux phases.'
  };

  var rewatch1 = {
    type: 'html-button-response-WH',
    stimulus: '<p>Souhaitez-vous revoir la grille ?</p><p>Le score cible pour cet exercice est: <b>5</b>.',
    prompt: '<p>Vous avez vu la grille <b>4</b> fois.</p><br>'+
    '<p>Pendant la phase de mémorisation, comme noté, vous pourrez voir et revoir les chiffres de la grille autant de fois que vous le désirez.</p>'+
    '<p>Après chaque visualisation de la grille, nous vous demanderons si vous souhaitez revoir la grille.</p><p>Si oui, cliquez sur le bouton « Oui ».</p>',
    choices: ['Oui','Non']
  };

  var rewatch2 = {
    type: 'animation-WH',
    stimuli: grid_stimuli[0],
    frame_time: 123,
    prompt: '<p>La grille vous sera à nouveau montrée.</p>'
  };

  var rewatch3 = {
    type: 'html-button-response-WH',
    stimulus: '<p>Souhaitez-vous revoir la grille ?</p><p>Le score cible pour cet exercice est: <b>5</b>.</p>',
    choices: ['Oui','Non'],
    prompt: '<p>Vous avez vu la grille <b>5</b> fois.</p><br>'+
    '<p>Si vous ne souhaitez plus revoir la grille, cliquez sur le bouton « Non » et passer à la phase de test.</p>'
  };

  var rewatch4 = {
    type: 'html-button-response-WH',
    stimulus: '<p>Souhaitez-vous revoir la grille ?</p><p>Le score cible pour cet exercice est: <b>5</b>.</p>',
    choices: ['Oui','Non'],
    prompt: '<p>Vous avez vu la grille <b>5</b> fois.</p><br>'+
    '<p>Note: vous avez 8 secondes seulement pour répondre, après quoi la phase de phase de test démarrera...</p>'
  };

  var target_i      = [[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
  var target_location  = Array(8);
  var correct_location = Array(8);
  var test_trials      = [];
  var grid_dim      = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];

  // TESTING PHASE //
  for (var test_i = 0; test_i < 5; test_i++) {

    //    var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
    var pair_1st = 0; // for non-matching version of task, show numbers and test animals
    var pair_2nd = 1 - pair_1st;

    target_i[test_i] = grid_indexes_shuffled[0][test_i][pair_1st].map(function(v){return (v - 1)})

    test_trials.push({
      target_location:  target_i[test_i],
      correct_location: grid_indexes_shuffled[0][test_i][pair_2nd].map(function(v){return (v - 1)}),
      target_image:     numbersImg[test_i]
    });
  };

  var test1 = {
    type: 'serial-reaction-time-mouse-WH',
    timeline: test_trials,
    grid: grid_dim,
    grid_square_size: screen.height/8,
    response_ends_trial: true,
    highlight: time.highlight,
    allow_nontarget_responses: true,
    prompt: '<p>Durant la phase de test, nous vous montrerons l&#39un des chiffres composant la paire (dans l&#39ordre).</p>'+
    '<p>Vous devrez cliquer sur l&#39emplacement de l&#39autre chiffre composant cette paire.</p>',
    pre_target_duration: 0,
    choices: ['Montrez-moi la prochaine paire']
  };

  var target_i      = [[null,null],[null,null],[null,null]]; // for indexing the location of the target image
  var target_location  = Array(8);
  var correct_location = Array(8);
  var test_trials      = [];
  var grid_dim      = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];

  // TESTING PHASE //
  for (var test_i = 5; test_i < 8; test_i++) {

    //    var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
    var pair_1st = 0; // for non-matching version of task, show numbers and test animals
    var pair_2nd = 1 - pair_1st;

    target_i[test_i] = grid_indexes_shuffled[0][test_i][pair_1st].map(function(v){return (v - 1)})

    test_trials.push({
      target_location:  target_i[test_i],
      correct_location: grid_indexes_shuffled[0][test_i][pair_2nd].map(function(v){return (v - 1)}),
      target_image:     numbersImg[test_i]
    });
  };

  var test2 = {
    type: 'serial-reaction-time-mouse-WH',
    timeline: test_trials,
    grid: grid_dim,
    grid_square_size: screen.height/8,
    response_ends_trial: true,
    highlight: time.highlight,
    allow_nontarget_responses: true,
    prompt: '<p>Il se peut que vous ne vous rappeliez plus de l&#39emplacement de l&#39autre chiffre composant la paire.</p>'+
    '<p>Vous pourrez alors cliquer sur le bouton « Montrez-moi la prochaine paire », en bas de la grille.</p>',
    pre_target_duration: 0,
    choices: ['Montrez-moi la prochaine paire']
  };

  // TESTING PHASE //
  var target_i2      = [[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null]]; // for indexing the location of the target image
  for (var test_i = 0; test_i < 8; test_i++) {

    //    var pair_1st = randi(0,1); // randomly select which of pair is shown and which is hidden
    var pair_1st2 = 0; // for non-matching version of task, show numbers and test animals
    var pair_2nd2 = 1 - pair_1st;

    target_i2[test_i] = grid_indexes_shuffled[0][test_i][pair_1st2].map(function(v){return (v - 1)});
  };

  var feedback1 = {
    type: 'animation-WH',
    frame_time: 3000,
    stimuli: grid_stimuli[0],
    target: target_i2,
    choices: jsPsych.NO_KEYS,
    feedback: true,
    correct_responses: [1,1,1,1,0,0,0,0],
    on_start: function(feedback){
      feedback.prompt = '<p style="font-size:25px; margin:0px">Votre score: <b>4/8 !</b> Vous avez vu la grille <b>6</b> fois.';
      feedback.clicked = [[3,0],[2,0],[1,3],[3,1],[2,3],[null,null],[null,null],[0,1]]; // for indexing the location of the participants click
    }
  };

  var pre_qs1 = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>Après le retour sur votre performance, vous aurez completé un exercice – bravo!</p>'+
    '<p>Vous pourrez prendre autant de temps que vous le souhaitez avant de démarrer le prochain exercice.</p>'
  };

  var two_qs = {
    type: 'html-keyboard-response-WH',
    stimulus: 'Comme noté, nous vous poserons aussi deux questions supplémentaires, une dans la phase de mémorisation et une de la phase de test.'
  };

  var SE_q1 = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>La première question sera au début de la phase de mémorisation.</p>'+
    '<p>Nous allons vous demander d&#39imaginer combien d&#39effort cela vous demanderait pour atteindre le score cible.</p>'
  };

  // SE_slider //
  var SE_q2 = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>La question sera : </p><p><b> « Combien de fois pensez-vous avoir besoin de voir les chiffres de la grille pour atteindre le score cible ? » </b></p>'+
    '<p>Au début, vous pourriez trouver cette question difficile. C&#39est normal: essayez simplement de répondre le mieux possible.</p>'+
    '<p>Lors de la phase de mémorisation, vous pourriez avoir besoin de plus (ou moins) d&#39effort qu&#39attendu. Pas de problème : vous serez libre de choisir votre effort (quelle qu&#39ait été votre réponse à cette question).</p>'
  };

  // SE QUESTION //
  var SE_conf1 = {
    type: 'SE-confidence-slider-WH',
    range: 30,
    prompt: '<p>Vous répondrez à cette question en déplaçant la barre rouge le long de la règle numérique.</p>'+
    '<p>Dans l&#39exemple ci-dessus, j&#39ai répondu que j&#39aurai besoin de voir les chiffres de la grille entre 8 et 11 fois pour atteindre le score cible...</p>',
    start: [7,10],
  };

  // SE QUESTION //
  var SE_conf2 = {
    type: 'SE-confidence-slider-WH',
    range: 30,
    prompt: '<p>Si le score cible est élevé, vous aurez sûrement besoin de visualiser les chiffres de la grille un grand nombre de fois.</p>'+
    '<p>Vous pourrez déplacer la barre vers la gauche et la droite en utilisant respectivement les flèches gauche et droite du clavier. Voici un exemple.</p>',
    start: [8,11],
    on_start(trial){
      var last_data = jsPsych.data.getLastTrialData().values()[0];
      trial.start = [last_data.SE_min-1,last_data.SE_max-1];
    }
  };

  // SE QUESTION //
  var SE_conf3 = {
    type: 'SE-confidence-slider-WH',
    range: 30,
    prompt: '<p>Dans certains cas, vous ne saurez pas vraiment combien de fois vous aurez besoin de voir les chiffres de la grille.</p>'+
    '<p>Vous pourrez alors augmenter la largeur de la barre en utilisant la flèche du haut du clavier. Voici un exemple.</p>',
    start: [8,11],
    on_start(trial){
      var last_data = jsPsych.data.getLastTrialData().values()[0];
      trial.start = [last_data.SE_min-1,last_data.SE_max-1];
    }
  };

  // SE QUESTION //
  var SE_conf4 = {
    type: 'SE-confidence-slider-WH',
    range: 30,
    prompt: '<p>Bien évidemment, vous pourrez aussi raccourcir la largeur de la barre en utilisant la flèche du bas.</p>'+
    '<p>Voici un exemple.</p>',
    start: [8,11],
    on_start(trial){
      var last_data = jsPsych.data.getLastTrialData().values()[0];
      trial.start = [last_data.SE_min-1,last_data.SE_max-1];
    }
  };

  // SE QUESTION //
  var SE_conf5 = {
    type: 'SE-confidence-slider-WH',
    range: 30,
    prompt: '<p>Pour confirmer votre réponse, appuyez sur « Entrée ».</p>'+
    '<p>Note: vous avez 3 minutes pour répondre, après quoi la phase de mémorisation démarrera.</p>',
    start: [8,11],
    on_start(trial){
      var last_data = jsPsych.data.getLastTrialData().values()[0];
      trial.start = [last_data.SE_min-1,last_data.SE_max-1];
    }
  };

  var SE_q3 = {
    type: 'html-button-response-WH',
    stimulus: '<p>La deuxième question sera à la fin de la phase de test, avant le retour sur votre performance.</p>'+
    '<p>La question sera : </p><p><b> « Combien d&#39emplacements pensez-vous avoir correctement deviné ? » </b></p>',
    choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
  };

  // Execute the experiment
  var instructions = {
    type: 'instructions-WH',
    pages: ['<img src="Stimuli/SE_video_resume.png"  id="image-instructions" style="height:'+screen.height/2+'px"></img>','<img src="Stimuli/SE_video_variation.png"  id="image-instructions" style="height:'+screen.height/2+'px"></img>']
  };

  timelineInst.push(welcome);
  timelineInst.push(summary);
  timelineInst.push(principe);
  timelineInst.push(principe2);
  timelineInst.push(principe_flip);
  timelineInst.push(test_principe);
  timelineInst.push(trial_number1);
  timelineInst.push(trial_number2);
  timelineInst.push(trial_number3);
  timelineInst.push(summary2);
  timelineInst.push(summary3);
  timelineInst.push(rewatch1);
  timelineInst.push(rewatch2);
  timelineInst.push(rewatch3);
  timelineInst.push(rewatch4);
  timelineInst.push(test1);
  timelineInst.push(test2);
  timelineInst.push(feedback1);
  timelineInst.push(pre_qs1);
  timelineInst.push(two_qs);
  timelineInst.push(SE_q1);
  timelineInst.push(SE_q2);
  timelineInst.push(SE_conf1);
  timelineInst.push(SE_conf2);
  timelineInst.push(SE_conf3);
  timelineInst.push(SE_conf4);
  timelineInst.push(SE_conf5);
  timelineInst.push(SE_q3);
  timelineInst.push(instructions);


  return timelineInst;
};
