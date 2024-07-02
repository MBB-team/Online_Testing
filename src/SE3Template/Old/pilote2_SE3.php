<!--  Code for Self-Efficacy task online using Javascript and jsPsych Library
Author: Nour Mohsen -- using code from William Hopper (williamjthopper@gmail.com)
Created: 27/03/24 -->



<!DOCTYPE html>
<html>
      <head>
            <meta charset="utf-8"/>
            <title> Pilote 2 </title>
            <script   src  = "jsPsych-master/jspsych.js"></script> <!-- import the library, should be downloaded and put into your experiment folder -->
            <link     href = "jsPsych-master/css/jspsych.css" rel="stylesheet" type="text/css"></link>
            <script   src  = "getBrowserInfo.js"></script> <!-- add the external functions-->
            <script   src  = "jsPsych-master/plugins_WH/fullscreen-WH.js"></script> <!-- plugin that Juliana modified -->
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-button-response-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-button-response-effort-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-button-response-pilote-NM.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-slider-response-difficulty-NM.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-button-response-fb-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-slider-response-effort-want-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-serial-reaction-time-mouse-WH.js'></script>
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-button-response-instructions-NM.js'></script> 
            <script   src  = 'jsPsych-master/plugins_WH/jspsych-html-slider-response-percentage-NM.js'></script>
            <script   src  = 'Stimuli/Grids/generateGridsMain.js'></script>
            <script   src  = 'Stimuli/Grids/generateGridsTrain.js'></script>
            <script   src  = 'Stimuli/Grids/SE3Template - Task Conditions.js'></script>  <!-- NEED TO CHANGE -->
            <script   src  = 'Stimuli/Timer/timer.js'></script>
            <script   src  = 'pilote2TaskTimeline.js'></script>     <!-- NEED TO CHANGE -->
            <script   src  = 'pilote2TrainingTimeline.js'></script>
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
  const exp = {name:           "SE3Templategrids",
               nbTrials_block: 6, 
               nb
               TS:            [5, 7, 9], // [6 8 10]
               rew:           [10, 100], // 1 10
               max_points:    [1980], // a(n_rew)*(n_tr/n_rew) +... a(n_rew)*(n_tr/n_rew) + 1
               effLimits:     [0, 90], //15 75
               grid:          [[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1]], // 6x4: [[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1]],5x5:[[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]
               squareSize:    screen.height/7}; // can maybe even / 7 ? 
               

  // Timings
  const time = {highlight:     500,
                fixation:      1000};

  // instructions
  const nbInstr              = 19; //Change if there are changes 

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
        trialNb: 999,
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
            trialNb: 999,
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
      instrImg[t-1] = 'Stimuli/Instructions_pilote2/Slide'+t+'.PNG'; // pre-load all instructions
      instrImg_html[t-1] = '<img src="'+instrImg[t-1]+'"  id="image-instructions" style="height:'+screen.height/1.25+'px"></img>';
    };

    // Numbers (1st)
    var numbersImg  = [];
    var numbersImg_html = [];
    for (var t=1; t <= 10; t++){
      numbersImg[t-1] = 'Stimuli/Images/number_'+t+'.png'; // pre-load all the stimuli numbers
      numbersImg_html[t-1] = '<img src="'+numbersImg[t-1]+'"></img>';
    };
 

    // Letters
    var lettersImg  = [];
    var lettersImg_html = [];
    for (var t=1; t <= 25; t++){
      lettersImg[t-1] = 'Stimuli/Letters/letter'+t+'.png'; // pre-load all the stimuli numbers
      lettersImg_html[t-1] = '<img src="'+lettersImg[t-1]+'"></img>';
    };

    //Data to have 
    var correctExTotal = 0;
    var rewTotal       = 0;

    // Task Conditions & Grids
    var gridStimuliTrain = generateGridsTrain(numbersImg, gridIndexesTrain, 4); //train TS is 4 - prob need to make this more explicit

    var condition  = randi(0,1); //0 is perf reinf feedback, 1 is effort reinf feedback
    var PartID     = randi(0,83); // randomly select a part#
    var sessID     = 1;
    
    //block 1 conditions
    var TSPt_b1       = TSArray[PartID][sessID][0];
    var rewPt_b1      = rewArray[PartID][sessID][0];
    var gridIndexesPt_b1  = gridIndexesOriginal[PartID][sessID][0];
    var gridStimuli_b1      = generateGridsMain(numbersImg, gridIndexesPt_b1, TSPt_b1); //make sure this is good
    //block 2 conditions
    var TSPt_b2       = TSArray[PartID][sessID][1];
    var rewPt_b2      = rewArray[PartID][sessID][1];
    var gridIndexesPt_b2  = gridIndexesOriginal[PartID][sessID][1];
    var gridStimuli_b2      = generateGridsMain(numbersImg, gridIndexesPt_b2, TSPt_b2);
    //block 3 conditions
    var TSPt_b3       = TSArray[PartID][sessID][2];
    var rewPt_b3      = rewArray[PartID][sessID][2];
    var gridIndexesPt_b3  = gridIndexesOriginal[PartID][sessID][2];
    var gridStimuli_b3      = generateGridsMain(numbersImg, gridIndexesPt_b3, TSPt_b3);
    
    //Challenge questions 

    //SE questions 
    function updateLoadedCount(nLoaded){
      var percentcomplete = Math.min(Math.ceil(nLoaded / (instrImg.length + numbersImg.length + lettersImg + 1)  * 100), 100);
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
      jsPsych.pluginAPI.preloadImages([instrImg, numbersImg, lettersImg],
      function(){ startExperiment();},
      function(nLoaded){updateLoadedCount(nLoaded);});

    }

    function startExperiment(){

      exp_timeline.push(firstFullscreen)

      // Execute the experiment
      // Training phase
      var points_total = 0;
      if (cfg.instructions){
        var task_training = trygridsTrainingTimeline();
        for (var i = 0; i < task_training.length; i++){
          if (cfg.instructions){
            exp_timeline.push(task_training[i]);
          }
        };
      }
      
      
      var block1 = block1pilote2TaskTimeline();
      for (var i = 0; i < task.length; i++) {
        exp_timeline.push(task[i]);
      };

      var block2 = block2pilote2TaskTimeline();
      for (var i = 0; i < task.length; i++) {
        exp_timeline.push(task[i]);
      };

      var block3 = block3pilote2TaskTimeline();
      for (var i = 0; i < task.length; i++) {
        exp_timeline.push(task[i]);
      };

      

      jsPsych.init({
        timeline: exp_timeline,
        show_progress_bar: true,
        on_trial_finish: function() {
             jsPsych.data.addProperties({date: date});
             var trialData = jsPsych.data.getLastTrialData().json();
             console.log("Trial data:", trialData);
             //saveData(trialData);  //edit out if not on server
       },
       on_finish: function (data) {
        // Save data after each trial
        var filename = "pilote2_condition"+condition+"_part" + PartID + "_data.csv";
        // Call the function to save all trial data to CSV
        jsPsych.data.get().filter({ get_data: 1 }).localSave("csv", filename);

        // Call jspsych_finish function
        jspsych_finish();
         },
        //on_finish: function(){jspsych_finish()},
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
      var buttonRetry = document.getElementById('dataRetenrySd');
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
