function instr(instrArray)
{
      let timeline = [];

      for(x in instrArray){
            var instr = {
                  type: "image-keyboard-response",
                  stimulus: instrImg[instrArray[x]],
                  stimulus_height: screen.height/1.5, // Size of the instruction depending on the size of the participants' screen
                  choices: [32],
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
            };
            timeline.push(fullscreenExp); // Makes sure the participants remain in fullscreen
            timeline.push(instr);
      };


      return timeline;
} // end function
