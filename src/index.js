const { PAYOUTS } = require("./constants");
const {
  getAllData,
  getMatchingNumbers,
  addField,
  filterResults,
  groupResultsBy,
  printGroupSummary
} = require("./lottoUtilities");

const myNumbers = [2, 10, 22, 25, 33];
const myMegaball = 3;

function matchesValue(result) {
  const [numbers, megaball] = getMatchingNumbers(myNumbers, myMegaball, result);

  return { numbers, megaball };
}

function payoutFieldValue(result) {
  const [numberMatches, megaballMatch] = getMatchingNumbers(
    myNumbers,
    myMegaball,
    result
  );
  return PAYOUTS[numberMatches][megaballMatch];
}

function playYearValue(result) {
  const playDate = new Date(result.PlayDate);
  return playDate.toLocaleDateString("en-US", { year: "numeric" });
}

function filterToWinners(result) {
  return result.matches.numbers > 2 || result.matches.megaball;
}

function calculateFieldTotal(field) {
  return group => {
    return group.map(w => w[field]).reduce((sum, v) => sum + v);
  };
}

getAllData()
  .then(addField("matches", matchesValue))
  .then(filterResults(filterToWinners))
  .then(addField("payout", payoutFieldValue))
  .then(addField("playYear", playYearValue))
  .then(groupResultsBy("playYear"))
  .then(printGroupSummary(calculateFieldTotal("payout")));
