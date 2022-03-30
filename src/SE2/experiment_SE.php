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
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-button-response-effort-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-button-response-fb-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-slider-response-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-slider-response-effort-want-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-serial-reaction-time-mouse-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-animation-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-SE2-confidence-slider-WH.js'></script>
            <script   src  = 'Stimuli/Grids/grid_indexes_SE2.js'></script>
            <script   src  = 'Stimuli/Grids/generate_grids_TS.js'></script>
            <script   src  = 'Stimuli/Grids/generate_grids_main.js'></script>
            <script   src  = 'Stimuli/Conditions/Condition_perms.js'></script>
            <script   src  = 'Stimuli/Conditions/eff_q.js'></script>
            <script   src  = 'Stimuli/Timer/timer.js'></script>
            <script   src  = 'SE2.js'></script>
            <script   src  = 'SE2_training.js'></script>
            <script   src = "../js/dataSaver.js"></script>
            <link     href= "../css/sendingAnimation.css" rel="stylesheet" type="text/css"></link>
            <link     rel='icon' href='/favicon.ico' />
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
               instructions:   true,
               main:           true,
               block0:         true};

  // Configuration parameters of experiment
  const exp = {name:           "SE2",
               nbTrials:       40, // 40
               nbBlocks:       4, // 4
               block0nTr:      6, // 6
               rew_levels:    [0, 1], // 0 1
               TS_levels:     [0, 0], // 0 0
               TS:            [6], // 6
               filler_TS_lvl: [1, 0, 1, 0], // 1 0 1 0
               filler_TS:     [4, 8], // 4 8
               block0TS:      4, // 4
               rew:           [1, 10], // 1 10
               rew_euro:      [10, 25], // 10 25
               max_points:    [254], // 254
               TD_levels:     [0, 2, 0, 2], // 0 2 0 2
               TD:            [0.75, 1, 1.25], // 0.75 1 1.25
               eff:           [15, 75], //15 75
               grid:          [[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1]]}; // 4x6

  // Timings
  const time = {flipSpeed:     1000, // in ms so 1 sec
                responseSpeed: 3000,
                SEconf:        180000,
                highlight:     500,
                showFeedback:  5000,
                fixation:      1000,
                rewatch:       5000};

  // instructions
  const nbInstr              = 7;

  // --------------------------------- INITIALISATION  --------------------------- //
  switch(window.location.protocol) {
        case 'http':
        case 'https':
        case 'http:':
        case 'https:':
              //theses lines are not executed unless the file is on a web server (assuming with php module)
              dataSaver = new DataSaver(dataSaverModes.SERVER, 'write_data.php');
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
      stimulus: "<p>Cette exp\351rience n'est compatible que avec Google Chrome ou Mozilla Firefox. </p>"
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
        reward: 999,
        test_part: 'firstFullscreen',
        nTS: 999
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
            reward: 999,
            test_part: 'fullscreenExp',
            nTS: 999
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
    for (var t=1; t <= 10; t++){
      numbersImg[t-1] = 'Stimuli/Images/image'+t+'.png'; // pre-load all the stimuli numbers
      numbersImg_html[t-1] = '<img src="'+numbersImg[t-1]+'"></img>';
    };

    // Numbers (2nd)
    var numbersImg2  = [];
    var numbersImg2_html = [];
    for (var t=1; t <= 8; t++){
      numbersImg2[t-1] = 'Stimuli/Images2/image'+t+'.jpg'; // pre-load all the stimuli numbers
      numbersImg2_html[t-1] = '<img src="'+numbersImg2[t-1]+'"></img>';
    };

    // Letters
    var lettersImg  = [];
    var lettersImg_html = [];
    for (var t=1; t <= 26; t++){
      lettersImg[t-1] = 'Stimuli/Letters/letter'+t+'.png'; // pre-load all the stimuli numbers
      lettersImg_html[t-1] = '<img src="'+lettersImg[t-1]+'"></img>';
    };

    // Grey square
    var greySquare = 'Stimuli/grey-square.png';
    var greySquareHTML = '<img src="'+greySquare+'"></img>';

    // Grids
    var cond_perm_pt = randi(0,cond_perms.length);
    var cond_pt = cond_perms[cond_perm_pt].map(x => x - 1);
    // var cond_pt = [1,8,9,5,6,3,7,4,2,8,1,5,3,9,7,6,2,4,8,1,9,5,6,3,4,2,7].map(x => x - 1);


    // if we need cond_pt indexes to be scaled up across blocks such that cond in block:bN = cond + (bN-1)*n_trialsinblock
    // var cond_pt_ind = Array(exp.nbBlocks);
    //
    // for (var bNi=0; bNi<exp.nbBlocks; bNi++){
    //   var ind = Array.from(Array(exp.TS_levels.length).keys());
    //   ind = ind.map(x => x + bNi*exp.TS_levels.length);
    //   cond_pt_ind[bNi] = ind.map(x => cond_pt[x] + bNi*exp.TS_levels.length);
    // }
    // cond_pt_ind = cond_pt_ind.flat();

    // else we just want a vector of 1:exp.nbTrials
    var cond_pt_ind = Array.from(Array(exp.nbTrials).keys());

    // (pseudo-)shuffle grids for main experiment
    var grid_indexes_packed   = jsPsych.randomization.shuffle(grid_indexes_original); // shuffled across blocks
    var grid_indexes          = grid_indexes_packed.flat();
    var grid_indexes_shuffled_main = Array(exp.nbTrials-exp.nbBlocks);
    for (var trNi=0; trNi<exp.nbTrials-exp.nbBlocks; trNi++){
      grid_indexes_shuffled_main[trNi] = grid_indexes[cond_pt_ind[trNi]]; // jsPsych.randomization.shuffle(grid_indexes); // shuffle the order of grids
    }

    // (pseudo-)shuffle grids for block0
    var grid_indexes_packed   = [jsPsych.randomization.shuffle(grid_indexes_block0_original)]; // shuffle within the block
    var grid_indexes          = grid_indexes_packed.flat();
    var grid_indexes_shuffled_block0 = Array(exp.block0nTr);
    for (var trNi=0; trNi<exp.block0nTr; trNi++){
      grid_indexes_shuffled_block0[trNi] = grid_indexes[cond_pt_ind[trNi]]; // jsPsych.randomization.shuffle(grid_indexes); // shuffle the order of grids
    }
    // filler
    var grid_indexes_packed   = [grid_indexes_filler_original]; // don't shuffle
    var grid_indexes          = grid_indexes_packed.flat();
    var grid_indexes_shuffled_filler = Array(4);
    for (var trNi=0; trNi<4; trNi++){
      grid_indexes_shuffled_filler[trNi] = grid_indexes[cond_pt_ind[trNi]]; // jsPsych.randomization.shuffle(grid_indexes); // shuffle the order of grids
    }

    var square_size = screen.height/7;
    var matching_pairs = 1; // if the two images are the same or not
    var all_flip_stimuli_main   = generate_grids_main(exp.nbTrials-exp.nbBlocks, numbersImg, numbersImg2, grid_indexes_shuffled_main, square_size, matching_pairs, cond_pt, exp.grid);
    var all_flip_stimuli_block0 = generate_grids_TS(exp.block0nTr, numbersImg, numbersImg2, grid_indexes_shuffled_block0, square_size, matching_pairs,  Array(exp.block0nTr).fill(exp.block0TS), exp.grid);
    var all_flip_stimuli_filler = generate_grids_TS(exp.nbBlocks, numbersImg, numbersImg2, grid_indexes_shuffled_filler, square_size, matching_pairs, [8, 4, 8, 4], exp.grid);
    var all_flip_stimuli_train  = generate_grids_TS(1,            numbersImg, numbersImg2, train_grid_indexes,    square_size, matching_pairs, [4], exp.grid)

    var grid_stimuli_main   = all_flip_stimuli_main;
    var grid_stimuli_block0 = all_flip_stimuli_block0;
    var grid_stimuli_filler = all_flip_stimuli_filler;
    var grid_stimuli_train  = all_flip_stimuli_train;
    // var grid_stimuli = []; // slice array into chunks of 8
    // for (var i=0; i<all_flip_stimuli.length; i+=8) {
    //      grid_stimuli.push(all_flip_stimuli.slice(i,i+8));
    // }

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
      // Training phase
      var points_total = 0;
      var task_training = SE2_training();
      for (var i = 0; i < task_training.length; i++){
        if (cfg.instructions){
          exp_timeline.push(task_training[i]);
        }
      };

      var task = SE2(exp.nbBlocks, exp.nbTrials);
      for (var i = 0; i < task.length; i++) {
        exp_timeline.push(task[i]);
      };

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
