function quest() {


	//EMPTY ARRAY FOR TIMELINE OF QUESTIONNAIRES
	var qns = [];

	//INSTRUCTIONS PLUGIN

	var  begin_qns = {
		type: 'html-keyboard-response',
		stimulus: '<p class="instructions">We will now ask you to complete some questionnaires. Please note the options given might differ for different questionnaries.</p>' +
		'<p class="instructions">Please read each question carefully and answer according to the options given.</p>' +
		'<p class="instructions">Press spacebar to continue.</p>',
		choices: " ",
		data: {
			test_part: 'questinstruction',

		}
	};

	//APATHY PLUGIN
	var apathy_scale = ["Pas du tout",  "Un peu", "Oui",  "Beaucoup"];

	var apathy = {
		type: 'survey-multi-choice',
		questions:  [{prompt: "1) Est-ce qu'apprendre des choses nouvelles vous int\351resse?", options: apathy_scale, required:true, horizontal: true},
		{prompt: "2) Certaines choses vous int\351ressent-elles encore?", options: apathy_scale, required:true, horizontal: true},
		{prompt: "3) Vous sentez-vous concern\351(e) par votre \351tat de sant\351?", options: apathy_scale, required:true, horizontal: true},
		{prompt: "4) Faites-vous beaucoup d'efforts pour obtenir quelque chose?", options: apathy_scale, required:true, horizontal: true},
		{prompt: "5) Cherchez-vus toujours quelque chose \340 faire?", options: apathy_scale, required:true, horizontal: true},
		{prompt: '6) Avez-vous des projets pour le futur?', options: apathy_scale, required:true, horizontal: true},
		{prompt: '7) Vous sentez-vous motiv\351(e)', options: apathy_scale, required:true, horizontal: true},
		{prompt: "8) Avez-vous de l'\351nergie pour les activit\351s quotidiennes?", options: apathy_scale, required:true, horizontal: true},
		{prompt: "9) Quelqu'un doit-il vous dire chaque jour ce que vous devez faire?", options: apathy_scale, required:true, horizontal: true},
		{prompt: '10) Vous sentez-vous indiff\351rent(e) aux choses qui vous entourent?', options: apathy_scale, required:true, horizontal: true},
		{prompt: "11) Vous sentez-vous moins concern\351(e) qu'avant par certaines choses?", options: apathy_scale, required:true, horizontal: true},
		{prompt: "12) Avez-vous besoin d'\352tre stimul\351(e) pour commencer \340 faire quelque chose?", options: apathy_scale, required:true, horizontal: true},
		{prompt: "13) Ressentez-vous moins fortement les \351motions?", options: apathy_scale, required:true, horizontal: true},
		{prompt: "14) Vous-considereriez-vous comme apathique?", options: apathy_scale, required:true, horizontal: true}],
		preamble: ["Au cours des quatre semaines qui viennent de s'\351couler et actuellement"],
		data:{ test_part: 'bis',
		trial_type: 'quest', }

	};

	//PUSH QUESTIONNAIRE INSTRUCTIONS
	qns.push(begin_qns);

	var questlist = [apathy];

	var shufflequestlist  = jsPsych.randomization.shuffle(questlist);

	//PUSH THE QUESTIONNAIRES
	for(var i = 0; i < shufflequestlist.length; i++)
	{
		qns.push(shufflequestlist[i]);

		return qns;

	}

}
