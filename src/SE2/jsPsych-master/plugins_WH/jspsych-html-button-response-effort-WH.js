/**
* jspsych-html-button-response
* Josh de Leeuw
*
* plugin for displaying a stimulus and getting a keyboard response
*
* documentation: docs.jspsych.org
*
**/

jsPsych.plugins["html-button-response-effort-WH"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-button-response-effort-WH',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
      timer: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Do we show a timer?',
        default: false,
        description: 'If true, then a timer will appear next to the prompt.'
      },
      reward: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Reward',
        default: null,
        description: 'The bonus of this trial.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var t0 = new Date();
    var t1;
    var timeDiff;
    var html = '';

    // display stimulus
    html += '<div id="jspsych-html-button-response-stimulus" style="display:flex; flex-direction: row; justify-content: space-around;">'
    html += '<div><canvas class="jspsych-html-timer"></canvas></div>';
    html += '<div style="">'+trial.stimulus+'</div>';
    var points = trial.reward == 1 ? 'point':'points';
    html += '<div id="jspsych-html-bonus"><p style="margin:0%">Bonus :<br>'+trial.reward+' ' + points + '</p></div>';
    html += '</div>';

    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in html-button-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    html += '<div id="jspsych-html-button-response-btngroup">';
    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html += '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    html += '</div>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }

    display_element.innerHTML = html;

    // even if we aren't drawing the timer, we need a blank HTML element for correct spacing
    can = display_element.querySelector('.jspsych-html-timer');
    ctx = can.getContext('2d'),
    sta = -Math.PI / 2,
    dur = trial.trial_duration;

    var timer_size = screen.height/8;
    can.height = timer_size;
    can.width = timer_size;
    var bonus = display_element.querySelector('#jspsych-html-bonus')
    bonus.style.width = ''+timer_size+'px';

    if (trial.timer){

      // document.body.appendChild(can);
      ctx.font = "normal 30px Arial";

      var myTimer = new Timer(dur, {
        ontick: function () {
          var pct = this.elapsed / dur,
          sec = Math.ceil((dur - this.elapsed) / 1000),
          wid = ctx.measureText(sec).width;

          ctx.clearRect(0, 0, timer_size/2, timer_size/2);

          ctx.fillStyle = "#777";
          ctx.arc(timer_size/2, timer_size/2, timer_size/2, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = "#f00";
          ctx.beginPath();
          ctx.moveTo(timer_size/2, timer_size/2);
          ctx.arc(timer_size/2, timer_size/2, timer_size/2, sta, sta + 2 * Math.PI * pct);
          ctx.fill();

          // ctx.fillStyle = "#111";
          // ctx.fillText(sec, timer_size/2 - wid / 2 + 1, 1.22*(timer_size/2));
          // ctx.fillStyle = "#eee";
          // ctx.fillText(sec, timer_size/2 - wid / 2, 1.2*(timer_size/2));
        },
        onend: function () {
          this.ontick();
        },
        interval: 1000 / 60
      }).start();

      var timer2 = new Timer(dur);
      timer2.ontick = function () {
        // console.log(this.elapsed);
      };
      timer2.start();
    }

    // start time
    var start_time = performance.now();

    // add event listeners to buttons
    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      if(response.button == null){
        response.button = 20
      }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();
      t1 = new Date();
      timeDiff = t1-t0;
      // gather the data to store for the trial
      var trial_data = {
        "rt":               response.rt,   // integer
        "stimulus":         trial.stimulus,  // string
        "button_pressed":   parseInt(response.button),   // integer
        "flips":            999,   // integer
        "conf_response":    999,   // integer
        "responses":       "999",  // string
        "SE_max":           999,   // integer
        "SE_min":           999,   // integer
        "SE_max_ini":       999,   // integer
        "SE_min_ini":       999,   // integer
        "response_row":     999,   // integer
        "response_col":     999,   // integer
        "target_row":       999,   // integer
        "target_col":       999,   // integer
        "correct_row":      999,   // integer
        "correct_col":      999,   // integer
        "correct":          null,   // BOOL
        "trial_time_elapsed": timeDiff  // integer
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-button-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
