function random_name(){
      var name_list =
        ['Gabriel', 'Rapha\353l', 'L\350o', 'Louis', 'Lucas', 'Andr\351', 'Arthur', 'Jules', 'Hugo',
         'Ma\353l', 'Paul', 'Nathan', 'Thomas', 'Th\351o', 'Victor', 'Martin', 'Matthias', 'Axel',
          'Antoine', 'L\351on', 'Valentin', 'Cl\351ment', 'Baptiste', 'Emmanuel', 'Nicolas', 'Thibaut',
           'Maxime', 'Gaspard', ' Alexandre', 'Simon', 'Math\350o', 'Camille', 'Jean', 'Adrien', //34 males
            'Emma', 'Louise', 'Alice', 'Chlo\351', 'L\351a', 'Anna', 'Eleonore', 'Julia', 'Manon',
            'Juliette', 'Lou', 'Zo\351', 'Lola', 'Agathe', 'Jeanne', 'Lucie', 'Eva', 'Sarah',
            'Charlotte', 'Ad\350le', 'Sofia', 'Margaux', 'Margot', 'Olivia', 'Cl\351mence', 'Victoria',
             'Clara', 'Anna', 'Andr\351a', 'H\351l\351na', 'Apolline', 'Constance', 'Capucine', 'Ana\357s']; // 34 females

 new_names = jsPsych.randomization.sampleWithoutReplacement(name_list, 4);
 return new_names
} // end function
