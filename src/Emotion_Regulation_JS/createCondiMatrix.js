function createCondiMatrix(nbBlocks, nbTrials, train)
{
      if (train == 1){
          let condiRwd = [[1,1],[2,2]];
          condiRwdShuffle = jsPsych.randomization.shuffleNoRepeats(condiRwd);
      }
      if (train == 0){
          let condiRwd = [[1,1],[1,2],[2,1],[2,2]];
          condiRwdRepeat = jsPsych.randomization.repeat(condiRwd, nbBlocks/4);
          condiRwdShuffle = jsPsych.randomization.shuffleNoRepeats(condiRwdRepeat);
      }

      let condition = []; let condiDC = []; let condiCC = []; let condiBC = [];
      for (let i = 0; i < nbBlocks; i++) {

            condiCC = Array(nbTrials/6).fill([3,4]).flat(); // acts like repmat in Matlab (but less good haha)
            condiDC = condiCC.concat(Array(nbTrials/3).fill([1,2]).flat());
            condiBC = condiCC.concat(Array(nbTrials/3).fill([5,6]).flat());

            condiDC = jsPsych.randomization.shuffle(condiDC);
            condiBC = jsPsych.randomization.shuffle(condiBC);

            if (condiRwdShuffle[i][1] == 1) {
                  condition[i] = condiDC;
            } else if (condiRwdShuffle[i][1] == 2) {
                  condition[i] = condiBC;
            };
      };

      return [condiRwdShuffle, condition];
} // end function
