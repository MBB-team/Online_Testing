function condi_Constance()
{
      var condi_exp = [[3,2],[5,3],[1,6],[2,5],[6,4],[4,1],[8,12],[9,8],[7,9],[12,11],
      [13,10],[14,14],[10,7],[15,15],[11,13],[19,16],[23,24],[22,23],[20,22],[17,17],
      [21,19],[16,18],[24,21],[18,20],[4,12],[6,10],[1,13],[2,17],[3,21],[5,16],
      [14,4],[10,1],[11,5],[23,2],[21,3],[17,6],[12,22],[7,18],[15,19],[8,20],
      [9,23],[13,24],[24,14],[22,7],[16,11],[19,9],[20,8],[18,15]];

      condi_shuffled = jsPsych.randomization.shuffleNoRepeats(condi_exp);

// Conditions for Practice
      var effort_pract = [["faire 5 pompes"], //1
      ["terminer un puzzle de 1000 pi\350ces"], //2
      ["repasser 1 chemise"], //3
      ["trouver 20 mots commencant par la lettre 'P'"], //4
      ["faire 1 trou dans le mur \340 la per\347euse"], //5
      ["trouver 20 personnes dans l'annuaire"]]; //6

      var rwd_pract = [["1 pain au chocolat."], //1
      ["1 d\351capsuleur."], //2
      ["1 casquette."], //3
      ["1 boite de caviar."], //4
      ["1 balle de tennis."], //5
      ["1 bouteille de cidre."]]; //6

// Conditions for experiment
      var effort_exp = [["\351couter un discours ennuyeux"], //1
      ["prendre la parole en public"], //2
      ["aller nourrir le chat du voisin en son absence"], //3
      ["pr\352ter mon t\351l\351phone \340 un inconnu"], //4
      ["faire un trajet debout dans un train bond\351"], //5
      ["prendre RDV par t\351l\351phone"], //6
      ["monter \340 pied 5 \351tages d'escalier"], //7
      ["passer le balai dans une grande pi\350ce"], //8
      ["courir 1 km sur un tapis roulant"], //9
      ["laver une dizaine d'assiettes"], //10
      ["\351plucher une dizaine de patates"], //11
      ["gonfler une dizaine de ballon de baudruche"], //12
      ["porter deux lourds sacs de courses sur 1 km"], //13
      ["d\351boucher 10 bouteilles \340 la main"], //14
      ["planter 10 clous dans une planche"], //15
      ["r\351sumer un texte d'une page en 5 lignes"], //16
      ["remplir une d\351claration d'imp\364ts"], //17
      ["trier 100 mots par ordre alphab\351tique"], //18
      ["compter les grains dans un paquet de riz"], //19
      ["calculer le prix total de 15 achats"], //20
      ["lire un chapitre du code civil"], //21
      ["\351peler 10 mots \340 l'envers"], //22
      ["trouver de t\352te la date d'il y a 100 jours"], //23
      ["r\351soudre 10 soustractions de t\352te"]]; //24

      var rwd_exp = [["recevoir un compliment."], //1
      ["prendre un(e) ami(e) dans ses bras."], //2
      ["voir un enfant sourire."], //3
      ["\352tre invit\351(e) par des amis \340 d\356ner."], //4
      ["recevoir un faire-part de naissance."], //5
      ["\352tre applaudi(e)."], //6
      ["recevoir une baguette de pain."], //7
      ["recevoir un paquet de cacahu\350tes."], //8
      ["recevoir une part de pizza."], //9
      ["recevoir un \351clair au chocolat."], //10
      ["recevoir une barquette de fraises."], //11
      ["recevoir un caf\351 expresso."], //12
      ["recevoir un pot de miel."], //13
      ["recevoir une cr\352pe au sucre."], //14
      ["recevoir un croque monsieur."], //15
      ["recevoir une place de cin\351ma au choix."], //16
      ["recevoir un jeu de 32 cartes."], //17
      ["recevoir un DVD au choix sur Internet."], //18
      ["recevoir une grille de loto."], //19
      ["recevoir un casque audio."], //20
      ["recevoir une huile de massage."], //21
      ["recevoir un grand cahier."], //22
      ["recevoir un petit briquet."], //23
      ["recevoir un livre au choix sur Internet."]]; //24

      return [condi_shuffled, effort_pract, rwd_pract, effort_exp, rwd_exp];
} // end function
