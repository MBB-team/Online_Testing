<!--  Code for Constance Project online using Javascript and jsPsych Library
      - Author: Juliana Sporrer (juliana.sporrer.18@ucl.ac.uk)
      - Creation date: 20 March 2020

      Data Output: (as in MySQL)
            - rt (float)
            - stimulus (text)
            - button_pressed: 0 = OUI, 1 = NON (int(3))
            - responses: for the questions (text)
            - key_press (int(3))
            - test_part: the name we give to the trial, e.g. "quest_pract" (text)
            - trialNb (int(3))
            - effort: the effort sentence (text)
            - condiEffort (int(3))
            - rwd: the reward sentence (text)
            - condiRwd (int(3))
            - trial_type (text)
            - trial_index (int(25))
            - time_elapsed (int(25))
            - internal_node_id (text)
            - run_id (int(7))
            - date (text)
-->

<!DOCTYPE html>
<html>
<head>
      <meta charset="utf-8"/>
      <title>   Constance Project </title>
      <script   src = "jsPsych-master/jspsych.js"></script>
      <link     href= "jsPsych-master/css/jspsych.css" rel="stylesheet" type="text/css"></link>
      <script   src = "jsPsych-master/plugins_JS/html-keyboard-response-JS.js"></script>  <!-- every plugin that you use needs to be added here -->
      <script   src = "jsPsych-master/plugins_JS/html-button-response-JS.js"></script>
      <script   src = "jsPsych-master/plugins_JS/survey-text-JS.js"></script>
      <script   src = "jsPsych-master/plugins_JS/fullscreen-JS.js"></script>
      <script   src = "getBrowserInfo.js"></script> <!-- add the external functions-->
      <script   src = "task_Constance.js"></script>
      <script   src = "condi_Constance.js"></script>
      <script   src = "instr_Constance.js"></script>
      <script   src = "/js/dataSaver.js"></script>
      <link href= "/css/sendingAnimation.css" rel="stylesheet" type="text/css"></link>
      <link rel='icon' href='/favicon.ico' />
</head>
<body>
      <div id='jspsych-target' style='width:auto; height:auto; position:relative;'></div>
      <canvas class = "canvas" id="myCanvas"></canvas>
</body>
<script type="application/javascript">

// --------------------------------- PARAMETERS -------------------------------- //

      var nbTrialsPrac   = 6; // 6
      var nbTrialsExp    = 48; // 48

      var fixation_time  = 500; // in ms
      var feedback_time  = 500;

      var debug          = false; // if true, skips fullscreen and info


// --------------------------------- INITIALISATION  --------------------------- //
      dataSaver = new DataSaver(dataSaverModes.SERVER, 'write_data_constance.php');
      dataSaver.SetClientIds(<?php echoAsJsArray($clientIds); ?>);

      // Checks if the browser is Chrome or Firefox (best compatibility)
      var browserInfo = getBrowserInfo();

      if(browserInfo.browser !== 'Chrome' && browserInfo.browser !== 'Firefox'){
            var wrong_browser = {
                  type: 'html-keyboard-response',
                  stimulus: "<p> Cette exp\351rience n'est compatible que avev Google Chrome ou Mozilla Firefox. </p> "
                      + "<p> Veuillez rouvrir l'exp\351rience dans l'un de ces navigateurs. </p>",
            };
            jsPsych.init({
                  timeline: [wrong_browser],
            });
      }

      else { // If browser is ok, lead on to the experiment

            var firstFullscreen =	{
                  type: 'fullscreen',
                  message:"<p> Pour participer \340 l'exp\351rience, votre navigateur doit \352tre en mode plein \351cran. </p>"+"<p> La sortie du mode plein \351cran suspendra l'exp\351rience. </p>"+"<p> Veuillez cliquer sur le bouton ci-dessous pour activer le mode plein \351cran et continuer.</p>",
                  button_label: 'Mettre en plein \351cran',
                  delay_after: 300,
                  check_fullscreen: true,
                  data: {
                        test_part: 'firstFullscreen',
                        trialNb: "999",
                        effort:"999",
                        condiEffort: 999,
                        rwd: "999",
                        condiRwd: 999,
                  },
            };

            var fullscreenExp = {
                  type: 'fullscreen',
                  message: "<p> Vous devez \352tre en mode plein \351cran pour continuer l'exp\351rience!  <br></br> Veuillez cliquer sur le bouton ci-dessous pour passer en mode plein \351cran.<br></br><p>",
                  fullscreen_mode: false,
                  data: {
                        test_part: 'fullscreenExp',
                        trialNb: "999",
                        effort:"999",
                        condiEffort: 999,
                        rwd: "999",
                        condiRwd: 999,
                  },
            };

            var fixation = {
                  type:'html-keyboard-response',
                  stimulus: '<div style="font-size:70px;">+</div>',
                  choices: jsPsych.NO_KEYS,
                  trial_duration: fixation_time,
                  fixation: true,
                  data:{
                        test_part:'fixation',
                        trialNb: "999",
                        effort:"999",
                        condiEffort: 999,
                        rwd: "999",
                        condiRwd: 999,
                  }
            };


// --------------------------------- SAVING DATA  ----------------------------//

//CODE TO SAVE FULLDATA AT THE END

          function saveData() {
            dataSaver.save(jsPsych.data.getLastTrialData().json());
         }

// --------------------------------- BEGINING EXPERIMENT  --------------------------------- //

            var today = new Date();
            var date = today.getHours()+":"+today.getMinutes()+" "+today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

            var exp_timeline = [];
            var firstInstr    = instr_Constance();

            if(debug == false){
                  exp_timeline.push(firstFullscreen);
                  for(var i = 0; i < firstInstr.length; i++){
                        exp_timeline.push(firstInstr[i]);
                  };
            }

            var task          = task_Constance();

            for(var i = 0; i < task.length; i++){
                  exp_timeline.push(task[i]);
            };

            // Execute the experiment
            jsPsych.init({
                  timeline: exp_timeline,
                  on_trial_finish: function() {
                        jsPsych.data.addProperties({date: date});
                        saveData();
                  },
                  on_finish: function() {
                        //jsPsych.data.displayData(); // Disable once online, use to look at data while coding
                        document.body.innerHTML = '<p><br></br><br></br><center>\
                              Merci pour votre participation!<br>\
                              <br>Enregistrement des données (<span id="dataLeftText"></span>)<br>\
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
                        setTimeout(function(){endTask()},2100); //wait for last async request end before retry
                  },
            });

            function endTask() {
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

      } // End of the experiment (end of checking browser)
</script>
</html>