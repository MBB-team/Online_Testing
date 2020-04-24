function instr(instrArray)
{
      let timeline = [];

      for(x in instrArray){
            var instr = {
                  type: "image-keyboard-response",
                  stimulus: instrImg[instrArray[x]],
                  stimulus_height: screen.height/2, // Size of the instruction depending on the size of the participants' screen
                  choices: [32], // 32, spacebar //[37,39], left and right arrows
                  data: {
                        test_part: "instr",
                        blockNb: null,
                        trialNb: null,
                        condiEmo: null,
                        condiRwd: null,
                        posCritDist: null,
                        posTarget: null,
                  },
            };
            timeline.push(fullscreenExp); // Makes sure the participants remain in fullscreen
            timeline.push(instr);
      };


      return timeline;
} // end function
