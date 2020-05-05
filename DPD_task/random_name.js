function random_name(){
      var name_list =
        ['Gabriel', 'Raphaël', 'Lèo', 'Louis', 'Lucas', 'André', 'Arthur', 'Jules', 'Hugo',
         'Maël', 'Paul', 'Nathan', 'Thomas', 'Théo', 'Victor', 'Martin', 'Matthias', 'Axel',
          'Antoine', 'Léon', 'Valentin', 'Clément', 'Baptiste', 'Samuel', 'Nicolas', 'Thibaut',
           'Maxime', 'Gaspard', ' Alexandre', 'Simon', 'Mathèo', 'Camille', 'Jean', 'Adrien', //34 males
            'Emma', 'Louise', 'Alice', 'Chloé', 'Léa', 'Anna', 'Eleonore', 'Julia', 'Manon',
            'Juliette', 'Lou', 'Zoé', 'Lola', 'Agathe', 'Jeanne', 'Lucie', 'Éva', 'Sarah',
            'Charlotte', 'Adèle', 'Sofia', 'Margaux', 'Margot', 'Olivia', 'Clémence', 'Victoria',
             'Clara', 'Anna', 'Andréa', 'Héléna', 'Apolline', 'Constance', 'Capucine', 'Anaïs']; // 34 females

 new_names = jsPsych.randomization.sampleWithoutReplacement(name_list, 4);
 return new_names
} // end function
