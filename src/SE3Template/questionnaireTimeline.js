function questionnaireTimeline(){
    var timelineTask = [];

    var question1 = {
        type: 'survey-text',
        questions: [
            {prompt: "Qu’est ce que vous avez pensé de l’expérience?", required: true, rows: 10, columns:80}],
        button_label: "Question Suivante",
        data: {
            get_data:1
        }
    }

    timelineTask.push(question1)

    var question2 = {
        type: 'survey-text',
        questions: [
            {prompt: "<p> À votre avis sur quoi porte l’expérience?  ", required: true, rows: 10, columns:80}
        ],
            
        button_label: "Question Suivante", 
        data: {
            get_data:1
        }
    }

    timelineTask.push(question2)

    var question3 = {
        type: 'survey-text',
        questions: [
            {prompt: "<p> Est-ce que vous avez noté quelque chose de particulier sur le nombre de paires qu'on vous a indiqué comme étant correctement retrouvées ? ", required: true, rows: 10, columns:80}
        ],
            
        button_label: "Question Suivante", 
        data: {
            get_data:1
        }
    }

    timelineTask.push(question3)

    var question4 = {
        type: 'survey-text',
        questions: [
            {prompt: "Est-ce que vous pensez qu’on vous a menti? ", required: true, rows: 1, columns:100},
            {prompt: "Si vous pensez qu’on vous a menti, où et comment pensez vous qu’on vous a menti?", required: true, rows: 4, columns:100 }
     ],
        button_label: "Question Suivante",
        data: {
            get_data:1
        }
    }

    timelineTask.push(question4)

    var question5 = {
        type: 'survey-multi-choice',
        questions:[ 
        {prompt: "Est-ce que vous pensez que le temps choisi pour mémoriser la grille a influencé le nombre de paires qu'on vous a indiqué comme étant correctement retrouvées?", options: ["<b>Oui</b>", "<b>Non</b>"],required: true} 
        ],
        button_label: "Question Suivante",
        data: {
            get_data:1
        }
    }

    timelineTask.push(question5)

    return {timelineTask}

    

}