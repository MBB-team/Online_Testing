function SE_instruction_video(){

  // INITIALISATION //
  var timelineInst  = [];

  // Welcome screen
  var welcome = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p><strong>TEST DE METACOGNITION :</strong></p><p><strong>INSTRUCTIONS</strong></p><p></p><p>Veuillez regarder attentivement les instructions qui vont suivre.</p>',
  };

  timelineInst.push(welcome);

  // summary screen
  var summary = {
    type: 'html-keyboard-response-WH',
    stimulus: '<p>Ce test dure environs 55 minutes.</p><p>Il s&#39agit d&#39un test mesurant votre capacité à auto-évaluer correctement vos compétences mentales.'+
     'C&#39est ce qu&#39on appelle la métacognition</p><p>En résumé, vous allez effectuer une série d&#39exercices de mémoire. Ces exercices seront plus ou moins difficiles. Pour chacun d&#39entre eux, nous vous demanderons d&#39auto-évaluer votre performance.</p>'
  };

  timelineInst.push(summary);

  // phase de memoire screen
  var principe = {
    type: 'html-keyboard-response-WH',
    stimulus: grid_stimuli[0][0],
    prompt: '<p>Lors de chaque exercise de mémoire, vous devrez vous souvenir de la position de 8 paires de chiffres disposés sur une grille carrée.</p>'+
'<p>Dans cet exemple suivant, les deux chiffres "1" forment une paire, dont chaque element est positionné sur un emplacement de la grille.</p>'
  };

  timelineInst.push(principe);



  // phase de test screen
  var test_principe = {
    type: 'html-keyboard-response-WH',
    stimulus: grid_stimuli[0][0],
    prompt: '<p>Lors de chaque exercise de mémoire, vous devrez vous souvenir de la position de 8 paires de chiffres disposés sur une grille carrée.</p>'+
'<p>Dans cet exemple suivant, les deux chiffres "1" forment une paire, dont chaque element est positionné sur un emplacement de la grille.</p>'
  };

  timelineInst.push(test_principe);


  return timelineInst;
};
