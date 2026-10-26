import { QuestionTree } from "../types/questions.ts";
import { Consensus } from "../types/consensus.ts";
import * as ibft2 from "./ibft2Qs.ts";
import * as qbft from "./qbftQs.ts";
import * as clique from "./cliqueQs.ts";


const bannerText = String.raw`
   ____
  | __ )  ___  ___ _   _
  |  _ \ / _ \/ __| | | |
  | |_) |  __/\__ \ |_| |
  |____/ \___||___/\__,_|

      / ___|  ___  _ __    ___  ___ (_) ___
     | |  _  / _ \| '_ \  / _ \/ __|| |/ __|
     | |_| ||  __/| | | ||  __/\__ \| |\__ \
      \____| \___||_| |_|_\___||___/|_||___/
              _____              _
             |_   _|___    ___  | |
               | | / _ \  / _ \ | |
               | || (_) || (_) || |
               |_| \___/  \___/ |_|

`;

const leadInText = `
\nWelcome to the Besu Genesis Tool. This tool can be used
to rapidly generate genesis, account keys, and configs for Besu.

To get started, be sure that you have read the Besu documentation regarding
genesis config options, then answer the following questions.\n\n`;

export const rootQuestion: QuestionTree = {
  name: "consensus",
  prompt: `${bannerText}${leadInText}Which consensus algorithm will you use? Default: QBFT`,
  options: [
    { label: "IBFT2", value: Consensus.ibft2, nextQuestion: ibft2._chainIDQuestion },
    { label: "QBFT", value: Consensus.qbft, nextQuestion: qbft._chainIDQuestion, default: true },
    { label: "Clique", value: Consensus.clique, nextQuestion: clique._chainIDQuestion }
  ]
};
