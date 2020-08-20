<!-- Code for Engage/Maintain RSVP task online using Javascript and jsPsych library
Author: William Hopper (williamjthopper@gmail.com)
Created: 03/06/2020
Version 2

Data Output (as in MySQL):
- rt:		            double,
- responses:	      text,
- button:		        INT(3)
- trialNb: 	        INT(3),
- trial_result:     INT(3),
- test_part: 	      text,
- training: 	      INT(3),
- trial_type:	      text,
- trial_index:	    INT(25),
- time_elapsed:	    INT(25),
- internal_node_id: text,
- date:		          text,
- (run_id           (INT(7)), directly get this value in write_data using PHP session)
- trial_condition:  INT(3),
- pt_cor_responses: Array ==> converted to text string with JSON.stringify,
- FA:               Array ==> converted to text string with JSON.stringify,
- tar_times:	      Array ==> converted to text string with JSON.stringify,
- swi_times:	      Array ==> converted to text string with JSON.stringify,
- optout_i:	        INT(3)

-->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-utf-8"/>
  <title> EngMain </title>
  <script   src  = "jsPsych-master/jspsych.js"></script> <!-- import the library, should be downloaded and put into your experiment folder -->
  <link     href = "jsPsych-master/css/jspsych.css" rel="stylesheet" type="text/css"></link>
  <script   src  = "getBrowserInfo.js"></script> <!-- add the external functions-->
  <script   src  = "jsPsych-master/plugins_WH_V2/fullscreen-WH-EM-V2.js"></script> <!-- plugin that Juliana modified -->
  <script   src  = 'jsPsych-master/plugins_WH_V2/jspsych-instructions-WH-EM-V2.js'></script>
  <script   src  = 'jsPsych-master/plugins_WH_V2/jspsych-html-button-response-WH-EM-V2.js'></script>
  <script   src  = 'jsPsych-master/plugins_WH_V2/jspsych-html-keyboard-response-WH-EM-V2.js'></script>
  <script   src  = 'Stimuli/Target_Indexes/target_indexes.js'></script>
  <script   src  = 'rsvpEM_V2.js'></script>
  <script   src  = 'rsvpEM_train_V2.js'></script>
  <script   src  = 'rsvpStimuli.js'></script>
  <script   src  = 'fscreen.js'></script>
  <script   src = "/js/dataSaver.js"></script>
  <link href= "/css/sendingAnimation.css" rel="stylesheet" type="text/css"></link>
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
  const cfg = {
    debug:        false,
    cheat:        false,
    instructions: true,
    training:     true};

    // Configuration parameters of experiment
    const exp = {
      nbTrials:        32,   // 32
      nbTrials_train:   4,   // 4
      nbStim:          29,   // 29
      nbTar:            4,   // 4
      tar_threshold:   28,   // 28
      FA_threshold:     4};  // 4

      // Timings of the experiment
      const time = {
        stim_dur:    330};

        // instructions
        const nbInstr = 16; // 16

        // const conditions = {
        //   reward: Array(2).fill([1,2]).flat(),
        //   effort: Array(1).fill([1, 1, 2, 2]).flat(),
        //   phase:  Array(1).fill([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]).flat()};

        const conditions = {
          reward: Array(exp.nbTrials/2).fill([1,2]).flat(),
          effort: Array(exp.nbTrials/4).fill([1, 1, 2, 2]).flat(),
          phase:  Array(exp.nbTrials/16).fill([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]).flat()};

          // for screen display
          var dpi_x;
          var dpi_y;
          var width;
          var height;
          var h;
          var d;
          var res;
          var size;


          // --------------------------------- INITIALISATION  --------------------------- //
          dataSaver = new DataSaver(dataSaverModes.SERVER, 'write_data.php');
          dataSaver.SetClientIds(<?php echoAsJsArray($clientIds); ?>);

          // Checks if the browser is Chrome or Firefox (best compatibility)
          var browserInfo = getBrowserInfo();

          if (browserInfo.browser !== 'Chrome' && browserInfo.browser !== 'Firefox') {
            var wrong_browser = {
              type: 'html-button-response-WH-EM-V2',
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

            // Function to generate random string of symbols
            function randstr(length){
              var result = '';
              var length = (typeof length == 'undefined') ? 32 : length;
              var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz';
              for(var i = 0; i<length; i++){
                result += chars[Math.floor(Math.random() * chars.length)];
              }
              return result;
            }

            // Function to find indexes of an element within arrays
            function getAllIndexes(arr, val) {
              var indexes = [], i;
              for(i = 0; i < arr.length; i++)
              if (arr[i] === val)
              indexes.push(i);
              return indexes;
            }

            // Create "Variable/function" that makes sure you remain in FullScreen
            var firstFullscreen = {
              type: 'fullscreen-WH-EM-V2',
              message: "<p>  Pour participer \340 l'exp\351rience, votre navigateur doit \352tre en mode plein \351cran. </p>"+"<p> La sortie du mode plein \351cran suspendra l'exp\351rience. </p>"+"<p> Veuillez cliquer sur le bouton ci-dessous pour activer le mode plein \351cran et continuer. </p>",
              button_label: 'Mettre en plein \351cran',
              delay_after: 300,
              check_fullscreen: true,
              data: {
                trialNb: 999,
                trial_result: 999,
                test_part: 'firstFullscreen',
                trial_condition: 999,
                training: 999,
              }
            };

            var fullscreenExp = {
              type: 'fullscreen-WH-EM-V2',
              message: "Vous devez \352tre en mode plein \351cran pour continuer l'exp\351rience!  <br></br> Veuillez cliquer sur le bouton ci-dessous pour passer en mode plein \351cran.<br></br><p>",
                fullscreen_mode: false,
                data: {
                  trialNb: 999,
                  trial_result: 999,
                  test_part: 'Fullscreen',
                  trial_condition: 999,
                  training: 999,
                }
              }


              // ------------------------------ PRE-LOAD MEDIA ----------------------------- //

              // instructions
              var instrImg = [];
              var instrImg_html = [];
              for (var t=1; t <= nbInstr; t++){
                instrImg[t-1] = 'Stimuli/Instructions/Slide'+t+'.PNG'; // pre-load all instructions
                instrImg_html[t-1] = '<img src="'+instrImg[t-1]+'"  id="image-instructions" style="height:'+screen.height/1.25+'px"></img>';
              };

              function updateLoadedCount(nLoaded){
                var percentcomplete = Math.min(Math.ceil(nLoaded / (instrImg.length)  * 100), 100);
                document.getElementById('loadingPercent').innerHTML = percentcomplete + ' %';
                //console.log('Loaded '+percentcomplete+'% of images');
              }

              // --------------------------------- SAVING DATA  ----------------------------//

              // CODE TO SAVE FULLDATA AT THE END

              function saveData() {
                dataSaver.save(jsPsych.data.getLastTrialData().json());

            }

            // ------------------------------ BEGIN EXPERIMENT --------------------------- /
            var today           = new Date();
            var date            = today.getHours()+":"+today.getMinutes()+" "+today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

            var exp_timeline = [];

            if (cfg.debug == false){
              jsPsych.pluginAPI.preloadImages([instrImg],
              function(){ startExperiment();},
              function(nLoaded){updateLoadedCount(nLoaded);});
            }


            function startExperiment(){

              exp_timeline.push(firstFullscreen);

              // Execute the experiment
              var instructions = {
                type: 'instructions-WH-EM-V2',
                pages: instrImg_html,
                show_clickable_nav: true
              };

              if (cfg.instructions){
                exp_timeline.push(instructions);
              };


              // calculate the dimensions of the participants screen
              var dpi = {
                type: 'html-button-response-WH-EM-V2',
                stimulus: '<div id="dpi" style="height: 1in; width: 1in; left: 100%; position: fixed; top: 100%;"></div>',
                choices: [],
                trial_duration: 500,
                on_load: function(){
                  dpi_x = document.getElementById('dpi').offsetWidth;
                  dpi_y = document.getElementById('dpi').offsetHeight;
                  width = screen.width / dpi_x;
                  height = screen.height / dpi_y;
                  h = height*2.5;
                  d = 80;
                  res = screen.height;
                  size = 5;

                  if (h && d && res && size) {
                    if (h > 0 && d > 0 && res > 0 && size > 0) {
                      degPerPix = ((Math.atan2(0.5*h, d)) / (0.5 * res)) * 180 / Math.PI;
                      sizeInDeg = size / degPerPix;
                    }
                  }
                },
                data: {
                  trialNb: 999,
                  trial_result: 999,
                  test_part: 'dpi',
                  trial_condition: 999,
                  training: 999,
                }

              };

              exp_timeline.push(fullscreenExp);
              exp_timeline.push(dpi);

              if (cfg.training){
                // Generate training trials
                var train = rsvpEM_train_V2(exp.nbTrials_train);
                for (var train_i = 0; train_i < train.length; train_i++){
                  exp_timeline.push(train[train_i])
                }
              }

              // Generate trials
              var task = rsvpEM_V2(exp.nbTrials);
              for (var task_i = 0; task_i < task.length; task_i++) {
                exp_timeline.push(task[task_i]);
              };

              jsPsych.init({
                timeline: exp_timeline,
                show_progress_bar: true,
                on_trial_finish: function(){
                  jsPsych.data.addProperties({date: date});
                  //console.log(jsPsych.data.getLastTrialData().values())
                  saveData();
                  //console.log(exp_timeline)
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

          }; // end of browser checking
        </script>
        </html>
