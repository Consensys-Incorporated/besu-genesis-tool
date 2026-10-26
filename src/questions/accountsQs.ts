import { QuestionTree } from "../types/questions.ts";
import {
  integerValidator,
  stringValidator,
  getYesNoValidator,
  allocStringValidator,
} from "./common.ts";
import * as commonQs from "./commonQs.ts";

// the trailing questions shared by every consensus type: prefunded accounts and output path

const _outputPathQuestion: QuestionTree = Object.assign(
  {},
  commonQs.outputPathQuestion
);
_outputPathQuestion.transformerValidator = stringValidator(
  _outputPathQuestion,
  undefined,
  "./output"
);

const _quickstartDevAccountsQuestion: QuestionTree = Object.assign(
  {},
  commonQs.quickstartDevAccountsQuestion
);
_quickstartDevAccountsQuestion.transformerValidator = getYesNoValidator(
  _quickstartDevAccountsQuestion,
  _outputPathQuestion,
  "n"
);

const _prefundedAccountsQuestion: QuestionTree = Object.assign(
  {},
  commonQs.prefundedAccountsQuestion
);
_prefundedAccountsQuestion.transformerValidator = allocStringValidator(
  _prefundedAccountsQuestion,
  _quickstartDevAccountsQuestion
);

const _accountBalanceQuestion: QuestionTree = Object.assign(
  {},
  commonQs.accountBalanceQuestion
);
_accountBalanceQuestion.transformerValidator = stringValidator(
  _accountBalanceQuestion,
  _quickstartDevAccountsQuestion,
  "1000000000000000000000000000"
);

const _accountsQuestion: QuestionTree = Object.assign(
  {},
  commonQs.accountsQuestion
);
_accountsQuestion.transformerValidator = integerValidator(
  _accountsQuestion,
  _accountBalanceQuestion,
  1
);

export const accountSourceQuestion: QuestionTree = Object.assign(
  {},
  commonQs.accountSourceQuestion
);
accountSourceQuestion.options = [
  { label: "None", value: "none", nextQuestion: _quickstartDevAccountsQuestion, default: true },
  { label: "Add existing accounts by address (alloc JSON)", value: "alloc", nextQuestion: _prefundedAccountsQuestion },
  { label: "Generate new accounts", value: "generate", nextQuestion: _accountsQuestion },
];
