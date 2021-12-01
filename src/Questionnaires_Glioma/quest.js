function quest() {

	var qns = [];

	//INSTRUCTIONS PLUGIN
	var  begin_qns = {
		type: 'html-keyboard-response',
		stimulus: "<H3> <p> Questionnaires </p> </H3>" +
		'<p> Nous allons maintenant vous demander de remplir deux questionnaires.</p>' +
		"<p> S'il vous plait, lisez les questions avec soin et r\351pondez selon les options pr\351sent\351es." +
		"<p> Ne vous attardez pas sur la r\351ponse \340 faire: votre r\351action imm\351diate \340 chaque question fournira probablement une meilleure indication de ce que vous \351prouvez, qu'une r\351ponse longuement m\351dit\351e." +
		"<p> <br> <br> Appuyez sur la barre d'espace pour continuer </p>",
		choices: [32],
		data: {test_part: 'questinstruction'}
	};

	var anx1 = ["La plupart du temps",  "Souvent", "De temps en temps",  "Jamais"];
	var anx2 = ["Oui, tr\350s nettement",  "Oui, mais ce n'est pas grave", "Un peu, mais cela ne m'inqui\350te pas",  "Pas du tout"];
	var anx3 = ["Tr\350s souvent",  "Assez souvent", "Occasionnellement",  "Tr\350s occasionnellement"];
	var anx4 = ["Oui, quoi qu'il arrive",  "Oui, en g\351n\351ral", "Rarement",  "Jamais"];
	var anx5 = ["Jamais",  "Parfois", "Assez souvent",  "Tr\350s souvent"];
	var anx6 = ["Oui, c'est tout \340 fait le cas",  "Un peu", "Pas tellement",  "Pas du tout"];
	var anx7 = ["Vraiment tr\350s souvent",  "Assez souvent", "Pas tr\350s souvent",  "Jamais"];

	var dep1 = ["Oui, tout autant",  "Pas autant", "Un peu seulement",  "Presque plus"];
	var dep2 = ["Autant que par le pass\351",  "Plus autant qu'avant", "Vraiment moins qu'avant",  "Plus du tout"];
	var dep3 = ["Jamais",  "Rarement", "Assez souvent",  "La plupart du temps"];
	var dep4 = ["Presque toujours",  "Tr\350s souvent", "Parfois",  "Jamais"];
	var dep5 = ["Plus du tout",  "Je n'y accorde pas autant d'attention que je le devrais", "Il se peut que je n'y fasse plus autant attention",  "J'y pr\352te autant d'attention que par le pass\351"];
	var dep6 = ["Autant qu'auparavant",  "Un peu moins qu'avant", "Bien moins qu'avant",  "Presque jamais"];
	var dep7 = ["Souvent",  "Parfois", "Rarement",  "Tr\350s rarement"];

	var hads = {
		type: 'survey-multi-choice',
		questions:  [{prompt: "1) Je me sens tendu ou \351nerv\351: ", options: anx1, required:true},
		{prompt: "2) J'ai une sensation de peur comme si quelque chose d'horrible allait m'arriver: ", options: anx2, required:true},
		{prompt: "3) Je me fais du souci: ", options: anx3, required:true},
		{prompt: "4) Je peux rester tranquillement assis \340 ne rien faire et me sentir d\351contract\351: ", options: anx4, required:true},
		{prompt: "5) J'\351prouve des sensations de peur et j'ai l'estomac nou\351: ", options: anx5, required:true},
		{prompt: "6) J'ai la bougeotte et n'arrive pas \340 tenir en place: ", options: anx6, required:true},
		{prompt: "7) J'\351prouve des sensations soudaines de panique:", options: anx7, required:true},
		{prompt: "8) Je prends plaisir aux m\352mes choses qu'autrefois: ", options: dep1, required:true},
		{prompt: "9) Je ris facilement et vois le bon c\364t\351 des choses: ", options: dep2, required:true},
		{prompt: '10) Je suis de bonne humeur:', options: dep3, required:true},
		{prompt: '11) Si vous avez bien lu cette question, r\351pondez "souvent" ', options: anx1, required:true},
		{prompt: "12) J'ai l'impression de fonctionner au ralenti: ", options: dep4, required:true},
		{prompt: "13) Je ne m'int\351resse plus \340 mon apparence: ", options: dep5, required:true},
		{prompt: "14) Je me r\351jouis d'avance \340 l'id\351e de faire certaines choses: ", options: dep6, required:true},
		{prompt: "15) Je peux prendres plaisir \340 un bon livre ou \340 une bonne \351mission radio ou de t\351l\351vision: ", options: dep7, required:true}],
		preamble: ["Dans la s\351rie de questions ci-dessous, cochez la r\351ponse qui exprime le mieux ce que vous avez \351prouv\351  <br> au cours de la semaine qui vient de s'\351couler."],
		data:{test_part: 'hads',trial_type: 'quest'},
	};

	var debriefing = {
		type: 'survey-text',
		questions: [
			{prompt: "1) A votre avis, quel était le but de l&#39expérience?"},
			{prompt: "2) Est-ce que les instructions étaient claires? Y a-t-il quoi que ce soit que vous n&#39ayes pas compris?"},
			{prompt: "3) Le test était-il trop facile ou trop difficile? Si oui, pourquoi?"},
			{prompt: "4) Votre concentration a-t-elle varié au cours de l&#39expérience? Si oui, quand et pourquoi?"},
			{prompt: "5) Quelle a été votre stratégie pour vous souvenir de la position des paires d&#39items? Avez-vous changé votre stratégie au cours du temps? Si oui, comment?"},
			{prompt: "6) Comment avez-vous effectué les auto-évaluations? Etait-ce difficile? Avez-vous changé la manière dont vous avez effectué ces auto-évaluations au cours du temps? Si oui, comment?"},
			{prompt: "7) Pensez-vous que vos auto-évaluations étaient décalées par rapport à vos performances réelles? Si oui, comment?"},
			{prompt: "8) Pensez-vous que votre performance dépend de l&#39effort que vous fournissez lorsque vous apprenez la position des paires d&#39tems? Si oui, comment?"},
			{prompt: "9) Pensez-vous avoir amélioré votre auto-évaluation au cours du temps? Si oui, comment?"},
			{prompt: "10) Avous-vous une dernière remarque à faire?"}
		],
		data:{test_part: 'debrief',trial_type: 'quest'}
	};

	var  end_qns = {
		type: 'html-keyboard-response',
		stimulus: "<H3> <p> Merci d'avoir pris le temps de r\351pondre \340 l'ensemble de ces questions. </p> </H3>" +
		"<p>  <br> <br> Appuyez sur la barre d'espace pour continuer.</p>",
		choices: [32],
		data: {test_part: 'questinstruction',trial_type: 'quest'}
	};

	//PUSH QUESTIONNAIRE INSTRUCTIONS
	qns.push(begin_qns);
	qns.push(fullscreenExp);
	qns.push(hads);
	qns.push(debriefing);
	qns.push(end_qns);

	return qns;

}
