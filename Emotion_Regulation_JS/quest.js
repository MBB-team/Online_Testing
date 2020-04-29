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
		data:{ test_part: 'apathy',
		trial_type: 'quest', }

	};

	var anx1 = ["la plupart du temps",  "souvent", "de temps en temps",  "jamais"];
	var anx2 = ["oui, tr\350s nettement",  "oui, mais ce n'est pas grave", "un peu, mais cela ne m'inqui\350te pas",  "pas du tout"];
	var anx3 = ["tr\350s souvent",  "assez souvent", "occasionnellement",  "tr\350s occasionnellement"];
	var anx4 = ["oui, quoi qu'il arrive",  "oui, en g\351n\351ral", "rarement",  "jamais"];
	var anx5 = ["jamais",  "parfois", "assez souvent",  "tr\350s souvent"];
	var anx6 = ["oui, c'est tout \340 fait le cas",  "un peu", "pas tellement",  "pas du tout"];
	var anx7 = ["vraiment tr\350s souvent",  "assez souvent", "pas tr\350s souvent",  "jamais"];

	var dep1 = ["oui, tout autant",  "pas autant", "un peu seulement",  "presque plus"];
	var dep2 = ["autant que par le pass\351",  "plus autant qu'avant", "vraimen moins qu'avant",  "plus du tout"];
	var dep3 = ["jamais",  "rarement", "assez souvent",  "la plupart du temps"];
	var dep4 = ["presque toujours",  "tr\350s souvent", "parfois",  "jamais"];
	var dep5 = ["plus du tout",  "je n'y accorde pas autant d'attention que je le devrais", "il se peut que je n'y fasse plus autant attention",  "j'y pr\352te autant d'attention que par le pass\351"];
	var dep6 = ["autant qu'auparavant",  "un peu moins qu'avant", "bien moins qu'avant",  "presque jamais"];
	var dep7 = ["souvent",  "parfois", "rarement",  "tr\350s rarement"];


	var hads = {
		type: 'survey-multi-choice',
		questions:  [{prompt: "1) Je me sens tendu ou \351nerv\351:", options: anx1, required:true, horizontal: true},
		{prompt: "2) J'ai une sensation de peur comme si quelque chose d'horrible allait m'arriver:", options: anx2, required:true, horizontal: true},
		{prompt: "3) Je me fais du souci: ", options: anx3, required:true, horizontal: true},
		{prompt: "4) Je peux rester tranquillement assis \340 ne rien faire et me sentir d\351contract\351", options: anx4, required:true, horizontal: true},
		{prompt: "5) J'\351prouve des sensations de peur et j'ai l'estomac nou\351:", options: anx5, required:true, horizontal: true},
		{prompt: "6) J'ai la bougeotte et n'arrive pas \340 tenir en place:", options: anx6, required:true, horizontal: true},
		{prompt: "7) J'\351prouve des sensations soudaines de panique:", options: anx7, required:true, horizontal: true},
		{prompt: "8) Avez-vous de l'\351nergie pour les activit\351s quotidiennes?", options: dep1, required:true, horizontal: true},
		{prompt: "9) Quelqu'un doit-il vous dire chaque jour ce que vous devez faire?", options: dep2, required:true, horizontal: true},
		{prompt: '10) Vous sentez-vous indiff\351rent(e) aux choses qui vous entourent?', options: dep3, required:true, horizontal: true},
		{prompt: "11) Vous sentez-vous moins concern\351(e) qu'avant par certaines choses?", options: dep4, required:true, horizontal: true},
		{prompt: "12) Avez-vous besoin d'\352tre stimul\351(e) pour commencer \340 faire quelque chose?", options: dep5, required:true, horizontal: true},
		{prompt: "13) Ressentez-vous moins fortement les \351motions?", options: dep6, required:true, horizontal: true},
		{prompt: "14) Vous-considereriez-vous comme apathique?", options: dep7, required:true, horizontal: true}],
		preamble: ["Dans la s\351rie de questions ci-dessous, cochez la r\351ponse qui exprime le mieux ce que vous avez \351prouv\351 au cours de la semaine qui vient de s'\351couler."+
		" Ne vous attardez pas sur la r\351ponse \340 faire: votre r\351action imm\351diate \340 chaque question fournira probablement une meilleure indication de ce que vous \340prouvez, "+
		"qu'une r\340ponse longuement m\340dit\340e"],
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
