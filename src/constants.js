const PAYOUTS = Array.from({ length: 6 }, (x, i) => {
  return [true, false];
});
PAYOUTS[0][false] = 0;
PAYOUTS[0][true] = 2;
PAYOUTS[1][false] = 0;
PAYOUTS[1][true] = 4;
PAYOUTS[2][false] = 0;
PAYOUTS[2][true] = 10;
PAYOUTS[3][false] = 10;
PAYOUTS[3][true] = 200;
PAYOUTS[4][false] = 500;
PAYOUTS[4][true] = 10000;
PAYOUTS[5][false] = 10000000;
PAYOUTS[5][true] = Infinity;

module.exports = { PAYOUTS };
