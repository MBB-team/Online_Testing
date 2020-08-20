<!--  Emotion regulation experiment online using JavaScript and jsPsych Library
            - Author: Juliana Sporrer (juliana.sporrer.18@ucl.ac.uk)
            - Creation date: March 2020

            Data Output (as in MySQL)
                  - rt (double)
                  - stimulus (varchar(250))
                  - responses: for the questions & instructions (varchar(100))
                  - key_press: [79,78] for oui [o] and non [n] (int(3))
                  - test_part (text)
                  - blockNb (int(3))
                  - trialNb (int(3))
                  - condiEmoBlock: 1 = DC, 2 == BC (int(3))
                  - condiEmoTrial: 1 = DC_male, 2 = DC_female, 3 = CC_male, 4 = CC_female, 5 = BC_male , 6 = BC_female (int(3))
                  - condiRwd: 1 = Small rwd, 2 = Large rwd (int(3))
                  - posCritDist: between 4 and 8 included (int(3))
                  - distractor (int(3))
                  - posTarget: either 1 or 3 images after the distractor (int(3))
                  - target (int(3))
                  - trial_type (text)
                  - trial_index (int(25))
                  - time_elapsed (int(25))
                  - internal_node_id (text)
                  - (run_id (int(7)), directly get this value in write_data using PHP session)
                  - date (text)

-->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>  Experiment EMO </title>
        <script  src = "jsPsych-master/jspsych.js"></script>
        <link    href= "jsPsych-master/css/jspsych.css" rel="stylesheet" type="text/css"></link>
        <script  src = "jsPsych-master/plugins_JS/fullscreen-emo.js"></script>
        <script  src = "jsPsych-master/plugins_JS/jspsych-instructions.js"></script>
        <script  src = "jsPsych-master/plugins_JS/html-keyboard-response-emo.js"></script>
        <script  src = "jsPsych-master/plugins_JS/survey-text-emo.js"></script>
        <script  src = "jsPsych-master/plugins_JS/image-keyboard-response-emo.js"></script>
        <script  src = "jsPsych-master/plugins_JS/rsvp_flux.js"></script>
        <script  src = "getBrowserInfo.js"></script>
        <script  src = "createCondiMatrix.js"></script>
        <script  src = "rsvp.js"></script>
        <script  src = "instr.js"></script>
        <style   id ="cursornone"> html { cursor: none; };  </style>
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

    var nbBlocksPrac      = 2; // 2
    var nbTrialsPrac      = 6; // 6
    var nbBlocksExp       = 12; // 12
    var nbTrialsExp       = 24; // 24

    var setSize           = 15; // 15
    var imageDuration     = 70; // in ms
    var fixation_time     = 1000;

    var nbInstr           = 14; // how many Instr Slides (12)
    var debug             = false; // if true, skips details, instructions and practice

// --------------------------------- INITIALISATION  ---------------------------//
      dataSaver = new DataSaver(dataSaverModes.SERVER, 'write_data.php');
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

          // Removes the cursor
          let cursornone = document.getElementById("cursornone").innerHTML;

          // General function that is needed
          function randi(min, max) { // min and max included (acts like randi of Matlab)
                return Math.floor(Math.random() * (max - min + 1) + min);
          }

          // Create "Variable/function" that makes sure you remain in FullScreen
          var firstFullscreen =	{
                type: 'fullscreen',
                message:"<p> Pour participer \340 l'exp\351rience, votre navigateur doit \352tre en mode plein \351cran. </p>"+"<p> La sortie du mode plein \351cran suspendra l'exp\351rience. </p>"+"<p> Veuillez cliquer sur le bouton ci-dessous pour activer le mode plein \351cran et continuer.</p>",
                button_label: 'Mettre en plein \351cran',
                delay_after: 300,
                check_fullscreen: true,
                data: {
                      test_part: 'firstFullscreen',
                      blockNb: 999,
                      trialNb: 999,
                      condiEmoBlock: 999,
                      condiEmoTrial: 999,
                      condiRwd: 999,
                      posCritDist: 999,
                      distractor: 999,
                      posTarget: 999,
                      target: 999,
                },
          };

          var fullscreenExp = {
                type: 'fullscreen',
                message: "<p> Vous devez \352tre en mode plein \351cran pour continuer l'exp\351rience!  <br></br> Veuillez cliquer sur le bouton ci-dessous pour passer en mode plein \351cran.<br></br><p>",
                fullscreen_mode: false,
                data: {
                      test_part: 'fullscreenExp',
                      blockNb: 999,
                      trialNb: 999,
                      condiEmoBlock: 999,
                      condiEmoTrial: 999,
                      condiRwd: 999,
                      posCritDist: 999,
                      distractor: 999,
                      posTarget: 999,
                      target: 999,
                },
          };


// --------------------------------- PRE-LOAD ANY MEDIA  -----------------------//
          var instrImg = [];
          for(var t=1;t <= nbInstr;t++){
                instrImg[t-1] = 'instructions/instructionsDiapo/Slide'+t+'.jpg';
          };

          var imgWFF = []; var scrambleWFF = [];
          for(var t=1;t < 36+1;t++){
                imgWFF[t-1] = 'imgJS/WFF_'+t+'.jpg';
                scrambleWFF[t-1] = 'imgJS/WFF_scramble_'+t+'.jpg';
          };

          var imgWFN = []; var scrambleWFN = [];
          for(var t=1;t < 86+1;t++){
                imgWFN[t-1] = 'imgJS/WFN_'+t+'.jpg';
                scrambleWFN[t-1] = 'imgJS/WFN_scramble_'+t+'.jpg';
          };

          var imgWMF = []; var scrambleWMF = [];
          for(var t=1;t < 29+1;t++){
                imgWMF[t-1] = 'imgJS/WMF_'+t+'.jpg';
                scrambleWMF[t-1] = 'imgJS/WMF_scramble_'+t+'.jpg';
          };

          var imgWMN = []; var scrambleWMN = [];
          for(var t=1;t < 91+1;t++){
                imgWMN[t-1] = 'imgJS/WMN_'+t+'.jpg';
                scrambleWMN[t-1] = 'imgJS/WMN_scramble_'+t+'.jpg';
          };

          imgCondi  = ['imgJS/instDC.jpg', 'imgJS/instBC.jpg'];
          imgRwd    = ['imgJS/cent.jpg', 'imgJS/euro.jpg'];

          function updateLoadedCount(nLoaded){
                var percentcomplete = Math.min(Math.ceil(nLoaded / (instrImg.length +
                imgWFF.length + imgWFN.length + imgWMF.length + imgWMN.length +
                scrambleWFF.length + scrambleWFN.length + scrambleWMF.length + scrambleWMN.length +
                imgCondi.length + imgRwd.length)  * 100), 100);
                document.getElementById('loadingPercent').innerHTML = percentcomplete + ' %';
                //console.log('Loaded '+percentcomplete+'% of images');
          }

// --------------------------------- instructions  ----------------------------//

      var firstInstr = {
            type: 'instructions',
            pages: ['<img src="'+instrImg[0]+'" id="image-instructions" style="height:'+screen.height/1.25+'px" ></img>',
            '<img src="'+instrImg[1]+'" id="image-instructions2" style="height:'+screen.height/1.25+'px" ></img>',
            '<img src="'+instrImg[2]+'" id="image-instructions3" style="height:'+screen.height/1.25+'px" ></img>',
            '<img src="'+instrImg[3]+'" id="image-instructions4" style="height:'+screen.height/1.25+'px" ></img>',
            '<img src="'+instrImg[4]+'" id="image-instructions5" style="height:'+screen.height/1.25+'px" ></img>',
            '<img src="'+instrImg[5]+'" id="image-instructions5" style="height:'+screen.height/1.25+'px" ></img>',
            '<img src="'+instrImg[6]+'" id="image-instructions5" style="height:'+screen.height/1.25+'px" ></img>',
            '<img src="'+instrImg[7]+'" id="image-instructions6" style="height:'+screen.height/1.25+'px" ></img>',],
            show_clickable_nav: true,
            show_page_number: true,
            on_start: function(){
                  var res = cursornone.replace("none", "default");
                  document.getElementById("cursornone").innerHTML = res;
            },
            on_finish: function(){
                  var res = cursornone.replace("default", "none");
                  document.getElementById("cursornone").innerHTML = res;
            },
            data: {
                  test_part: "instr",
                  blockNb: 999,
                  trialNb: 999,
                  condiEmoBlock: 999,
                  condiEmoTrial: 999,
                  condiRwd: 999,
                  posCritDist: 999,
                  distractor: 999,
                  posTarget: 999,
                  target: 999,
            },
      }

// --------------------------------- SAVING DATA  ----------------------------//
          function saveData() {
            dataSaver.save(jsPsych.data.getLastTrialData().json());
         }

// --------------------------------- BEGINING EXPERIMENT  --------------------//

            var today = new Date();
            var date = today.getHours()+":"+today.getMinutes()+" "+today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

            var exp_timeline = [];

            jsPsych.pluginAPI.preloadImages(    [instrImg,
                                                imgWFF, imgWFN, imgWMF, imgWMN,
                                                scrambleWFF, scrambleWFN, scrambleWMF, scrambleWMN,
                                                imgCondi, imgRwd],
                                                function(){ startExperiment();},
                                                function(nLoaded) {updateLoadedCount(nLoaded);} );

            exp_timeline.push(firstFullscreen);

            if(debug == false){
                  exp_timeline.push(firstInstr);

                  var practice      = rsvp(nbBlocksPrac, nbTrialsPrac, 1);
                  for(var i = 0; i < practice.length; i++){
                        exp_timeline.push(practice[i]);
                  };

                  var endPract      = instr([8]);
                  for(var i = 0; i < endPract.length; i++){
                         exp_timeline.push(endPract[i]);
                  };
            } // end debug

            var task          = rsvp(nbBlocksExp, nbTrialsExp, 0);
            for(var i = 0; i < task.length; i++){
                  exp_timeline.push(task[i]);
            };

            var endExp        = instr([13]);
            for(var i = 0; i < endExp.length; i++){
                   exp_timeline.push(endExp[i]);
            };


            // Execute the experiment
            function startExperiment(){
                  jsPsych.init({
                        timeline: exp_timeline,
                        show_progress_bar: true,
                        on_trial_finish: function() {
                              jsPsych.data.addProperties({date: date});
                              saveData(); // edit out if not on server
                        },
                        on_finish: function() {
                              //jsPsych.data.displayData(); // Disable once online, use to look at data while coding
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
                        },
                  });
            }

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
