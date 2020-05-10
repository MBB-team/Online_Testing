function instr_Constance()
{
      let timeline = [];

      var instr_Constance = {
            type:'html-keyboard-response',
            stimulus: "<p> Dans ce test, vous allez devoir accepter ou refuser diff\351rentes offres. Chaque offre sera compos\351e d'un <strong> effort </strong> \340 effectuer pour obtenir une <strong> r\351compense</strong>. On vous demande donc si pour vous la r\351compense vaut la peine d'effectuer l'effort. </p>"+
            "<p> Vous devez r\351pondre par <strong>OUI</strong> ou par <strong>NON</strong>. </p>"+
            "<p> Encore une fois, il y'a pas de bonne ou de mauvaise r\351ponse, nous souhaitons simplement conna\356tre votre pr\351f\351rence. </p>"+
            "<p> <strong> Appuyer sur la barre d'espace pour continuer. </strong></p>",
            choices: [32],
            data: {
                  test_part: 'instr',
                  trialNb: "999",
                  effort:"999",
                  condiEffort: 999,
                  rwd: "999",
                  condiRwd: 999,
            },
      };
      timeline.push(fullscreenExp); // Makes sure the participants remain in fullscreen
      timeline.push(instr_Constance);

      return timeline;
} // end function
