function quest() {


	//EMPTY ARRAY FOR TIMELINE OF QUESTIONNAIRES
	var qns = [];

	//INSTRUCTIONS PLUGIN

	var  begin_qns = {
		type: 'html-keyboard-response',
		stimulus: "<H3> <p> Questionnaires </p> </H3>" +
		'<p> Nous allons maintenant vous demander de remplir quelques questionnaires sur comment vous vous sentez en ce moment.</p>' +
		"<p> S'il vous plait, lisez les questions avec soin et r\351pondez selon les options pr\351sent\351es." +
		"<p> Ne vous attardez pas sur la r\351ponse \340 faire: votre r\351action imm\351diate \340 chaque question fournira probablement une meilleure indication de ce que vous \351prouvez, qu'une r\351ponse longuement m\351dit\351e." +
		"<p> <br> <br> Appuyez sur la barre d'espace pour continuer </p>",
		choices: [32],
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
		{prompt: "5) Cherchez-vous toujours quelque chose \340 faire?", options: apathy_scale, required:true, horizontal: true},
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
		trial_type: 'quest',
		},

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
		questions:  [{prompt: "1) Je me sens tendu ou \351nerv\351: ", options: anx1, required:true},
		{prompt: "2) J'ai une sensation de peur comme si quelque chose d'horrible allait m'arriver: ", options: anx2, required:true},
		{prompt: "3) Je me fais du souci: ", options: anx3, required:true},
		{prompt: "4) Je peux rester tranquillement assis \340 ne rien faire et me sentir d\351contract\351: ", options: anx4, required:true},
		{prompt: "5) J'\351prouve des sensations de peur et j'ai l'estomac nou\351: ", options: anx5, required:true},
		{prompt: "6) J'ai la bougeotte et n'arrive pas \340 tenir en place: ", options: anx6, required:true},
		{prompt: "7) J'\351prouve des sensations soudaines de panique:", options: anx7, required:true},
		{prompt: "8) Je prends plaisir aux m\352mes choses qu'autrefois: ", options: dep1, required:true},
		{prompt: "9) Je ris facilement et vois le bon c\365t\351 des choses: ", options: dep2, required:true},
		{prompt: '10) Je suis de bonne humeur:', options: dep3, required:true},
		{prompt: '11) Si vous avez bien lu cette question, r\351pondez "souvent" ', options: anx1, required:true},
		{prompt: "12) J'ai l'impression de fonctionner au ralenti: ", options: dep4, required:true},
		{prompt: "13) Je ne m'int\351resse plus \340 mon apparence: ", options: dep5, required:true},
		{prompt: "14) Je me r\351jouis d'avance \340 l'id\351e de faire certaines choses: ", options: dep6, required:true},
		{prompt: "15) Je peux prendres plaisir \340 un bon livre ou \340 une bonne \351mission radio ou de t\351l\351vision: ", options: dep7, required:true}],
		preamble: ["Dans la s\351rie de questions ci-dessous, cochez la r\351ponse qui exprime le mieux ce que vous avez \351prouv\351  <br> au cours de la semaine qui vient de s'\351couler."],
		data:{
			test_part: 'hads',
			trial_type: 'quest',
		},
	};


	var  covid_qns = {
		type: 'html-keyboard-response',
		stimulus: "<H3> <p> Evaluation du bien-\352tre durant le confinement en lien avec le COVID-19.</p> </H3>" +
		"<p> Ce questionnaire \351tudie les facteurs pouvant avoir un impact sur votre v\351cu du confinement en lien avec l'\351pid\351mie COVID-19.</p>" +
		"<p> Merci du temps que vous consacrerez \340 y r\351pondre : il sera pr\351cieux pour mieux comprendre les effets psychologiques de cette p\351riode. </p>" +
		"<p>  <br> <br> Appuyez sur la barre d'espace pour continuer.</p>",
		choices: [32],
		data: {
			test_part: 'questinstruction',

		}
	};

	var covid_stress1 = [0,1,2,3,4,5,6,7,8,9,10];
	var covid_stress = {
		type: 'survey-multi-choice',
		questions:  [{prompt: "1) Niveau de stress li\351 au travail: ", options: covid_stress1, required:true, horizontal: true},
		{prompt: "2) Niveau de stress li\351 \340 la vie personnelle :", options: covid_stress1, required:true, horizontal: true},
		{prompt: "3) Niveau de stress en g\351n\351ral: ", options: covid_stress1, required:true, horizontal: true}],
		preamble: ["Sur une \351chelle allant de 0 (absence totale de stress) \340 10 (stress maximal imaginable) <br> quel est votre niveau de stress concernant ces 3 diff\351rents domaines  <br> depuis le d\351but de la p\351riode de confinement ?"],
		data:{
			test_part: 'covid_stress',
			trial_type: 'quest',
		},
	};

	var confinement1 = ["Compl\351tement d'accord","Assez d'accord","Ni d'accord, ni par d'accord","Plut\364t en d\351saccord","Compl\350tement en d\351saccord"];
	var confinement2 = ["Tr\350s satisfait","Plut\364t satisfait","Ni satisfait, ni pas satisfait","Plut\364t pas satisfait","Pas satisfait du tout"];
	var confinement3 = ["Tr\350s claires et coh\351rentes","Assez claires et coh\351rentes","Ni claires, ni floues","Plut\364t floues ou contradictoire","Tr\350s floues ou contradictoires"];
	var confinement4 = ["Je suis confin\351(e) \340 mon domicile et je suis contamin\351(e)","Je suis confin\351(e) \340 mon domicile sans personne contamin\351e","Je suis en contact direct avec des personnes ou du mat\351riel suspect\351es d'\352tre contamin\351(es) \340 l'ext\351rieur ","Je suis en contact direct avec des personnes \340 l'ext\351rieur de mon domicile (au travail par exemple) ","Je sors de mon domicile mais ne suis pas en contact direct avec des personnes ext\351rieures (sur une exploitation agricole par exemple)"];
	var confinement5 = ["Non","Plut\364t non","Plut\364t oui","Oui"];
	var confinement6 = ["Non, je ne suis pas inquiet \340 ce sujet","Oui, je m'inqui\350te mais j'ai actuellement acc\350s \340 tout ce dont j'ai besoin","Oui, je m'inqui\350te et je n'ai actuellement pas acc\350s \340 tout ce dont j'ai besoin"];

	var confinement = {
		type: 'survey-multi-choice',
		questions:  [{prompt: "1) Etes-vous en accord avec la mesure de confinement ? ", options: confinement1, required:true},
		{prompt: "2) Etes-vous satisfait de votre niveau d'information sur les mesures du confinement ? ", options: confinement2, required:true},
		{prompt: "3) Avez vous trouv\351 les informations officielles suffisamment claires sur le coronavirus (mode de transmission, pr\351vention, ...) ? ", options: confinement3, required:true},
		{prompt: "4) Etes-vous en contact avec une ou des personnes susceptible(s) d'\352tre contamin\351e(s) par le coronavirus ? ", options: confinement4, required:true},
		{prompt: "5) Est-ce que le manque d'acc\350s aux mat\351riels de protections (masques, gels hydroalcooliques) vous pr\351occupe ? ", options: confinement5, required:true},
		{prompt: "6) Est-ce que l'acc\350s aux produits de premi\350re n\351cessit\351 vous pr\351occupe actuellement ? ", options: confinement6, required:true}],
		preamble: [""],
		data:{
			test_part: 'confinement',
			trial_type: 'quest', },

	};

	var covid_people = {
		type: 'survey-text',
		questions: [
			{prompt: "Combien de personnes partagent votre logement actuellement (vous inclus) ?", rows: 3, columns: 40, required:true},
			{prompt: "Des membres de votre famille habitent-ils actuellement avec vous, en dehors de votre/vos enfant(s) ? (Oui / Non)", rows: 3, columns: 40, required:true},
			{prompt: "Combien de personnes vivent avec vous en dehors de vos enfants ?", rows: 3, columns: 40, required:true}],
		data:{
			test_part: 'covid_people',
			trial_type: 'quest', },
		};

	var situation1 = ["Oui, je suis en t\351l\351travail","Oui, je travaille \340 l'ext\351rieur de mon domicile exclusivement ","Oui, je travaille en partie en t\351l\351travail et sur mon site de travail","Non, je suis en ch\364mage partiel","Non, je suis en arr\352t maladie", "Non, je suis en cong\351s ou en arr\352t pour garde d'enfant(s)","Non, je suis en recherche d'emploi"];
	var situation2 = ["Moins importante qu'avant le confinement","Pareille qu'avant le confinement","Plus importante qu'avant le confinement","Tr\350s variable et d'\351volution impr\351visible"];
	var situation3 = ["Tr\350s probablement ","Probablement","Probablement pas","Certainement pas "];

	var covid_situation = {
		type: ['survey-multi-choice'],
		questions:  [{prompt: "1) Actuellement, travaillez-vous ? ", options: situation1, required:true},
		{prompt: "2) Si oui, quelle est votre charge de travail (travail + devoirs domestiques) ?  ", options: situation2, required:true},
		{prompt: "3) La p\351riode de confinement va-t-elle avoir des r\351percussions financi\350res sur votre budget ?  ", options: situation3, required:true},
		{prompt: "4) Cela risque-t-il de vous mettre en situation de pr\351carit\351 ?  ", options: situation3, required:true}],
		preamble: [""],
		data:{
			test_part: 'covid_situation',
			trial_type: 'quest', },

	};

	var difficulty1 = ["Maintenir un rythme veille /sommeil satisfaisant (dormir \340 des horaires r\351guliers...)","Vous endormir ","Vous sentir repos\351","Manger au moins 2 repas par jour ", "Ne pas grignoter davantage qu'\340 votre habitude ", "Etablir de nouvelles routines", "Conserver des relations sereines avec mes proches", "Aucune difficult\351 particuli\350re"];

	var covid_difficulty = {
		type: ['survey-multi-select'],
		questions:  [{prompt: "Actuellement, avez-vous des difficult\351s pour : ", options: difficulty1, required:true}],
		//preamble: ["Actuellement, \340 quelle fr\351quence avez-vous des interactions sociales avec votre famille ou des amis qui ne sont pas confin\351s avec vous ?"],
		data:{
			test_part: 'covid_difficulty',
			trial_type: 'quest', },

		};

	var interaction1 = ["Moins d'une fois par semaine","Une fois par semaine","Plusieurs fois par semaine","Tous les jours"];

	var covid_interaction = {
		type: ['survey-multi-choice'],
		questions:  [{prompt: "1) Directement en face \340 face : ", options: interaction1, required:true},
		{prompt: "2) Au t\351l\351phone ou sur les r\351seaux sociaux : ", options: interaction1, required:true}],
		preamble: ["Actuellement, \340 quelle fr\351quence avez-vous des interactions sociales avec votre famille  <br> ou des amis qui ne sont pas confin\351s avec vous ?"],
		data:{
			test_part: 'covid_interaction',
			trial_type: 'quest', },

		};


	//PUSH QUESTIONNAIRE INSTRUCTIONS
	qns.push(begin_qns);
	qns.push(hads);

	var questlist 		= [apathy, hads, covid_qns];
	var shufflequestlist  	= jsPsych.randomization.shuffle(questlist);

	for(var i = 0; i < shufflequestlist.length; i++){
		qns.push(shufflequestlist[i]);
		if (shufflequestlist[i] == covid_qns){
			qns.push(covid_stress);
			qns.push(confinement);
			qns.push(covid_people);
			qns.push(covid_situation);
			qns.push(covid_difficulty);
			qns.push(covid_interaction);
		}
	};

	return qns;

}
