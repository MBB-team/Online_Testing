<!--  Code for Self-Efficacy task online using Javascript and jsPsych Library
Author: William Hopper (williamjthopper@gmail.com)
Created: 23/04/2020

Data Output:
-
Per trial:
-

-->

<!DOCTYPE html>
<html>
      <head>
            <meta charset="utf-8"/>
            <title> Self-Efficacy </title>
            <script   src  = "jsPsych-master/jspsych.js"></script> <!-- import the library, should be downloaded and put into your experiment folder -->
            <link     href = "jsPsych-master/css/jspsych.css" rel="stylesheet" type="text/css"></link>
            <script   src  = "getBrowserInfo.js"></script> <!-- add the external functions-->
            <script   src  = "jsPsych-master/plugins_WH/fullscreen-WH.js"></script> <!-- plugin that Juliana modified -->
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-instructions-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-button-response-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-slider-response-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-serial-reaction-time-mouse-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-animation-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-SE-confidence-slider-WH.js'></script>
            <script   src  = 'Stimuli/Grids/grid_indexes.js'></script>
            <script   src  = 'Stimuli/Grids/generate_grids.js'></script>
            <script   src  = 'SE.js'></script>
            <script   src = "../js/dataSaver.js"></script>
            <link href= "../css/sendingAnimation.css" rel="stylesheet" type="text/css"></link>
            <link rel='icon' href='/favicon.ico' />
      </head>
      <body>
            <div id='jspsych-target' style='width:auto; height:auto; position:relative;'>
              <p><br></br><br></br>
              <center>
                                Chargement en cours ...<br>
                                <br><span id="loadingPercent"></span><br>
                                <div id="sendAnimation" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div><br>
              </center>
              </p>
            </div>
            <canvas class = "canvas" id="myCanvas"></canvas>
      </body>

<script type="application/javascript">

  // --------------------------------- PARAMETERS --------------------------------//

  // What to do
  const cfg = {debug:          false,
               cheat:          false,
               instructions:   false,
               main:           true};

  // Configuration parameters of experiment
  const exp = {name:           "SE_ELAN",
               nbTrials:       20,
               nbBlocks:       4};

  // Timings
  const time = {flipSpeed:     200, // in ms so 1 sec
                responseSpeed: 3000,
                SEconf:        180000,
                highlight:     500,
                showFeedback:  200,
                fixation:      500,
                rewatch:       5000};

  // instructions
  const nbInstr              = 34;

  // --------------------------------- INITIALISATION  --------------------------- //
  switch(window.location.protocol) {
        case 'http':
        case 'https':
        case 'http:':
        case 'https:':
              //theses lines are not executed unless the file is on a web server (assuming with php module)
              dataSaver = new DataSaver(dataSaverModes.SERVER, 'write_data_SE.php');
              dataSaver.SetClientIds(JSON.parse('{<?php echoAsJSON($clientIds); ?>}'));
              break;
        case 'file':
        case 'file:':
              dataSaver = new DataSaver(dataSaverModes.LOG);
              break;
  }

  // Checks if the browser is Chrome or Firefox (best compatibility)
  var browserInfo = getBrowserInfo();

  if (browserInfo.browser !== 'Chrome' && browserInfo.browser !== 'Firefox') {
    var wrong_browser = {
      type: 'html-button-response-WH',
      choices: [],
      stimulus: "<p>Cette exp\351rience n'est compatible que avev Google Chrome ou Mozilla Firefox. </p>"
               +"<p> Veuillez rouvrir l'exp\351rience dans l'un de ces navigateurs. </p>"
             };

             jsPsych.init({
               timeline: [wrong_browser]
             })

  } else { // If the browswer is ok, proceed to the experiment

    // General function that is needed
    function randi(min, max) { // min and max included (acts like randi of Matlab)
          return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Create "Variable/function" that makes sure you remain in FullScreen
    var firstFullscreen =	{
      type: 'fullscreen-WH',
      message:"<p>  Pour participer \340 l'exp\351rience, votre navigateur doit \352tre en mode plein \351cran. </p>"+"<p> La sortie du mode plein \351cran suspendra l'exp\351rience. </p>"+"<p> Veuillez cliquer sur le bouton ci-dessous pour activer le mode plein \351cran et continuer. </p>",
      button_label: 'Mettre en plein \351cran',
      delay_after: 300,
      check_fullscreen: true,
      data: {
        blockNb: 999,
        trialNb: 999,
        TinB: 999,
        testNb: 999,
        target_score: 999,
        test_part: 'firstFullscreen'
      }
    };

    var fullscreenExp = {
          type: 'fullscreen-WH',
          message: "Vous devez \352tre en mode plein \351cran pour continuer l'exp\351rience!  <br></br> Veuillez cliquer sur le bouton ci-dessous pour passer en mode plein \351cran.<br></br><p>",
          fullscreen_mode: false,
          data: {
            blockNb: 999,
            trialNb: 999,
            TinB: 999,
            testNb: 999,
            target_score: 999,
            test_part: 'fullscreenExp'
          }
        };


    // ------------------------------ PRE-LOAD MEDIA ----------------------------- //

    // Instructions
    var instrImg = [];
    var instrImg_html = [];
    for (var t=1; t <= nbInstr; t++){
      instrImg[t-1] = 'Stimuli/Instructions/Slide'+t+'.PNG'; // pre-load all instructions
      instrImg_html[t-1] = '<img src="'+instrImg[t-1]+'"  id="image-instructions" style="height:'+screen.height/1.25+'px"></img>';
    };

    // Numbers (1st)
    var numbersImg  = [];
    var numbersImg_html = [];
    for (var t=1; t <= 8; t++){
      numbersImg[t-1] = 'Stimuli/Images/image'+t+'.PNG'; // pre-load all the stimuli numbers
      numbersImg_html[t-1] = '<img src="'+numbersImg[t-1]+'"></img>';
    };

    // Numbers (2nd)
    var numbersImg2  = [];
    var numbersImg2_html = [];
    for (var t=1; t <= 8; t++){
      numbersImg2[t-1] = 'Stimuli/Images2/image'+t+'.jpg'; // pre-load all the stimuli numbers
      numbersImg2_html[t-1] = '<img src="'+numbersImg2[t-1]+'"></img>';
    };

    // Grey square
    var greySquare = 'Stimuli/grey-square.png';
    var greySquareHTML = '<img src="'+greySquare+'"></img>';

    // Grids
    var grid_indexes_shuffled = jsPsych.randomization.shuffle(grid_indexes); // shuffle the order of grids
    var square_size = screen.height/6;
    var matching_pairs = 1; // if the two images are the same or not
    var all_flip_stimuli = generate_grids(exp.nbTrials, numbersImg, numbersImg2, grid_indexes_shuffled, square_size, matching_pairs);

    var grid_stimuli = []; // slice array into chunks of 8
    for (var i=0; i<all_flip_stimuli.length; i+=8) {
         grid_stimuli.push(all_flip_stimuli.slice(i,i+8));
    }

    function updateLoadedCount(nLoaded){
      var percentcomplete = Math.min(Math.ceil(nLoaded / (instrImg.length + numbersImg.length + 1)  * 100), 100);
      document.getElementById('loadingPercent').innerHTML = percentcomplete + ' %';
      //console.log('Loaded '+percentcomplete+'% of images');
    }

// --------------------------------- SAVING DATA  ----------------------------//

    // CODE TO SAVE FULLDATA AT THE END

    function saveData() {
        dataSaver.save(jsPsych.data.getLastTrialData().json());
   }

// ------------------------------ BEGIN EXPERIMENT --------------------------- //

    var today           = new Date();
    var date            = today.getHours()+":"+today.getMinutes()+" "+today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

    var exp_timeline = [];

    if (cfg.debug == false) {
      jsPsych.pluginAPI.preloadImages([instrImg, numbersImg, numbersImg2, greySquare],
      function(){ startExperiment();},
      function(nLoaded){updateLoadedCount(nLoaded);});

    }

    function startExperiment(){

      exp_timeline.push(firstFullscreen)

      // Execute the experiment
      var instructions = {
        type: 'instructions-WH',
        pages: instrImg_html,
        show_clickable_nav: true,
        data: {
          blockNb: 999,
          trialNb: 999,
          TinB: 999,
          testNb: 999,
          target_score: 999,
          test_part: 'instructions'
        }
      };

      // exp_timeline.push(instructions);

      var task = SE(exp.nbBlocks, exp.nbTrials);
      for (var i = 0; i < task.length; i++) {
        exp_timeline.push(task[i]);
      }

      jsPsych.init({
        timeline: exp_timeline,
        show_progress_bar: true,
        on_trial_finish: function() {
             jsPsych.data.addProperties({date: date});
             saveData(); // edit out if not on server
       },
        on_finish: function(){jspsych_finish()},
      });
    } // end of startExperiment

    // helper function to use a setTimeout as a promise.
    function allowUpdate() {
                  return new Promise((f) => {
                        setTimeout(f, 0);
                  });
            }

    async function endTask() {
      /*update messages and hide retry button*/
      var errorMessage = document.getElementById('dataSendError');
      var buttonRetry = document.getElementById('dataRetrySend');
      var infoMessage = document.getElementById('dataLeftText');
      var sendAnimation = document.getElementById('sendAnimation');

      errorMessage.innerHTML = "";
      buttonRetry.style.visibility = 'hidden';
      infoMessage.innerHTML = dataSaver.bufferLength() + " restants";
      sendAnimation.style.visibility = 'visible';

      // step 1 : send buffered data
      var failedRetry = 0;
      var lastLeftToSend = dataSaver.bufferLength();
      while(dataSaver.sendAll()>0)
      {
            var leftToSend = dataSaver.bufferLength();
            if(leftToSend == lastLeftToSend)
            {
                  failedRetry += 1;
                  errorMessage.innerHTML += ". ";
                  console.log('Failed to send datas. Retries : ' + failedRetry);
            }
            else
            {
                  infoMessage.innerHTML = leftToSend + " restants";
                  console.log('Datas left to send : ' + leftToSend);
            }
            lastLeftToSend = leftToSend;
            if(failedRetry>9)
            {
                  break;
            }
            await allowUpdate();
      }
      infoMessage.innerHTML = dataSaver.bufferLength() + " restants";
      console.log('Datas left to send : ' + dataSaver.bufferLength());
      if(dataSaver.bufferLength()>0)
      {
            errorMessage.innerHTML="Une erreur réseau est survenue pendant l'enregistrement des données. cliquez sur \"Réessayer\".<br>Si le problème persiste, vérifiez votre connexion internet <span style='font-weight:bold;'>sans fermer cette page</span>.";
            buttonRetry.style.visibility='visible';
            sendAnimation.style.visibility = 'hidden';
            return; //don't try to send endTask
      }

      // step 2 : send endTask
      var endTaskSuccess = dataSaver.sendEndTask();
      if(endTaskSuccess)
      {
            sendAnimation.style.visibility = 'hidden';
            errorMessage.innerHTML="Toutes les données ont été enregistrées.<br>Vous allez être redirigié vers la page d'accueil. (sinon, cliquez <a href='/'>ici</a>)";
            //redirect to home page after 5 secs if error
            setTimeout(function () {
                        window.location.replace("/");
                  }, 3000);
      }
      else
      {
            errorMessage.innerHTML="Une erreur réseau est survenue pendant la validation de la tâche. cliquez sur \"Réessayer\".<br>Si le problème persiste, vérifiez votre connexion internet <span style='font-weight:bold;'>sans fermer cette page</span>.";
            buttonRetry.style.visibility='visible';
            sendAnimation.style.visibility = 'hidden';
      }
   }

   function jspsych_finish() {
          //jsPsych.data.displayData();// Disable once online, use to look at data while coding
          document.body.innerHTML = '<p><br></br><br></br><center>\
                Merci pour votre participation!<br>\
                <br>Enregistrement des données (<span id="dataLeftText">'+dataSaver.bufferLength()+' restants'+'</span>)<br>\
                <div id="sendAnimation" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div><br>\
                <span id="dataSendError"></span><br>\
                <button id="dataRetrySend" style="visibility: hidden;" onclick="endTask()">Réessayer</button>\
                </center><p>';
          //ensure exited fullscreen
          if (document.fullscreenElement)
          {
                document.exitFullscreen()
                .then(() => console.log("Document Exited form Full screen mode"))
                .catch((err) => console.error(err))
          }
          setTimeout(function(){endTask()},3300); //wait for last async request end before retry
    }

  } // end of browser checking
</script>
</html>
