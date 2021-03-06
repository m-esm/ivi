import { v2 } from "ivi-math";
import { createVelocityTracker, trackPosition, estimateVelocity } from "../velocity_tracker";

function p(time: number, x: number, y: number) {
  return { time, point: v2(x, y) };
}

test(`1`, () => {
  const P = [
    p(216690896, 270.0, 538.2857055664062),
    p(216690906, 270.0, 538.2857055664062),
    p(216690951, 270.0, 530.8571166992188),
    p(216690959, 270.0, 526.8571166992188),
    p(216690967, 270.0, 521.4285888671875),
    p(216690975, 270.0, 515.4285888671875),
    p(216690983, 270.0, 506.8571472167969),
    p(216690991, 268.8571472167969, 496.0),
    p(216690998, 267.4285583496094, 483.1428527832031),
    p(216691006, 266.28570556640625, 469.71429443359375),
    p(216691014, 265.4285583496094, 456.8571472167969),
    p(216691021, 264.28570556640625, 443.71429443359375),
    p(216691029, 264.0, 431.71429443359375),
    p(216691036, 263.4285583496094, 421.1428527832031),
    p(216691044, 263.4285583496094, 412.5714416503906),
    p(216691052, 263.4285583496094, 404.5714416503906),
    p(216691060, 263.4285583496094, 396.5714416503906),
    p(216691068, 264.5714416503906, 390.0),
    p(216691075, 265.1428527832031, 384.8571472167969),
    p(216691083, 266.0, 380.28570556640625),
    p(216691091, 266.5714416503906, 376.28570556640625),
    p(216691098, 267.1428527832031, 373.1428527832031),
    p(216691106, 267.71429443359375, 370.28570556640625),
    p(216691114, 268.28570556640625, 367.71429443359375),
    p(216691121, 268.5714416503906, 366.0),
    p(216691130, 268.8571472167969, 364.5714416503906),
    p(216691137, 269.1428527832031, 363.71429443359375),
    p(216691145, 269.1428527832031, 362.8571472167969),
    p(216691153, 269.4285583496094, 362.8571472167969),
    p(216691168, 268.5714416503906, 365.4285583496094),
    p(216691176, 267.1428527832031, 370.28570556640625),
    p(216691183, 265.4285583496094, 376.8571472167969),
    p(216691191, 263.1428527832031, 385.71429443359375),
    p(216691199, 261.4285583496094, 396.5714416503906),
    p(216691207, 259.71429443359375, 408.5714416503906),
    p(216691215, 258.28570556640625, 419.4285583496094),
    p(216691222, 257.4285583496094, 428.5714416503906),
    p(216691230, 256.28570556640625, 436.0),
    p(216691238, 255.7142791748047, 442.0),
    p(216691245, 255.14285278320312, 447.71429443359375),
    p(216691253, 254.85714721679688, 453.1428527832031),
    p(216691261, 254.57142639160156, 458.5714416503906),
    p(216691268, 254.2857208251953, 463.71429443359375),
    p(216691276, 254.2857208251953, 470.28570556640625),
    p(216691284, 254.2857208251953, 477.71429443359375),
    p(216691292, 255.7142791748047, 487.1428527832031),
    p(216691300, 256.8571472167969, 498.5714416503906),
    p(216691307, 258.28570556640625, 507.71429443359375),
    p(216691315, 259.4285583496094, 516.0),
    p(216691323, 260.28570556640625, 521.7142944335938),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(219.59);
  expect(velocity!.y).toBeCloseTo(1304.7);
});

test(`2`, () => {
  const P = [
    p(216691573, 266.0, 327.4285583496094),
    p(216691588, 266.0, 327.4285583496094),
    p(216691626, 261.1428527832031, 337.1428527832031),
    p(216691634, 258.28570556640625, 343.1428527832031),
    p(216691642, 254.57142639160156, 354.0),
    p(216691650, 250.2857208251953, 368.28570556640625),
    p(216691657, 247.42857360839844, 382.8571472167969),
    p(216691665, 245.14285278320312, 397.4285583496094),
    p(216691673, 243.14285278320312, 411.71429443359375),
    p(216691680, 242.2857208251953, 426.28570556640625),
    p(216691688, 241.7142791748047, 440.5714416503906),
    p(216691696, 241.7142791748047, 454.5714416503906),
    p(216691703, 242.57142639160156, 467.71429443359375),
    p(216691712, 243.42857360839844, 477.4285583496094),
    p(216691720, 244.85714721679688, 485.71429443359375),
    p(216691727, 246.2857208251953, 493.1428527832031),
    p(216691735, 248.0, 499.71429443359375),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(355.71);
  expect(velocity!.y).toBeCloseTo(967.21);
});

test(`3`, () => {
  const P = [
    p(216692255, 249.42857360839844, 351.4285583496094),
    p(216692270, 249.42857360839844, 351.4285583496094),
    p(216692309, 246.2857208251953, 361.71429443359375),
    p(216692317, 244.0, 368.5714416503906),
    p(216692325, 241.42857360839844, 377.71429443359375),
    p(216692333, 237.7142791748047, 391.71429443359375),
    p(216692340, 235.14285278320312, 406.5714416503906),
    p(216692348, 232.57142639160156, 421.4285583496094),
    p(216692356, 230.2857208251953, 436.5714416503906),
    p(216692363, 228.2857208251953, 451.71429443359375),
    p(216692371, 227.42857360839844, 466.0),
    p(216692378, 226.2857208251953, 479.71429443359375),
    p(216692387, 225.7142791748047, 491.71429443359375),
    p(216692395, 225.14285278320312, 501.71429443359375),
    p(216692402, 224.85714721679688, 509.1428527832031),
    p(216692410, 224.57142639160156, 514.8571166992188),
    p(216692418, 224.2857208251953, 519.4285888671875),
    p(216692425, 224.0, 523.4285888671875),
    p(216692433, 224.0, 527.1428833007812),
    p(216692441, 224.0, 530.5714111328125),
    p(216692448, 224.0, 533.1428833007812),
    p(216692456, 224.0, 535.4285888671875),
    p(216692464, 223.7142791748047, 536.8571166992188),
    p(216692472, 223.7142791748047, 538.2857055664062),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(12.657);
  expect(velocity!.y).toBeCloseTo(-36.90);
});

test(`4`, () => {
  const P = [
    p(216692678, 221.42857360839844, 526.2857055664062),
    p(216692701, 220.57142639160156, 514.8571166992188),
    p(216692708, 220.2857208251953, 508.0),
    p(216692716, 220.2857208251953, 498.0),
    p(216692724, 221.14285278320312, 484.28570556640625),
    p(216692732, 221.7142791748047, 469.4285583496094),
    p(216692740, 223.42857360839844, 453.1428527832031),
    p(216692748, 225.7142791748047, 436.28570556640625),
    p(216692755, 229.14285278320312, 418.28570556640625),
    p(216692763, 232.85714721679688, 400.28570556640625),
    p(216692770, 236.85714721679688, 382.5714416503906),
    p(216692778, 241.14285278320312, 366.0),
    p(216692786, 244.85714721679688, 350.28570556640625),
    p(216692793, 249.14285278320312, 335.4285583496094),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(714.139);
  expect(velocity!.y).toBeCloseTo(-2561.53);
});

test(`5`, () => {
  const P = [
    p(216693222, 224.0, 545.4285888671875),
    p(216693245, 224.0, 545.4285888671875),
    p(216693275, 222.85714721679688, 535.1428833007812),
    p(216693284, 222.85714721679688, 528.8571166992188),
    p(216693291, 222.2857208251953, 518.5714111328125),
    p(216693299, 222.0, 503.4285583496094),
    p(216693307, 222.0, 485.4285583496094),
    p(216693314, 221.7142791748047, 464.0),
    p(216693322, 222.2857208251953, 440.28570556640625),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(-19.668);
  expect(velocity!.y).toBeCloseTo(-2910.105);
});

test(`6`, () => {
  const P = [
    p(216693985, 208.0, 544.0),
    p(216694047, 208.57142639160156, 532.2857055664062),
    p(216694054, 208.85714721679688, 525.7142944335938),
    p(216694062, 208.85714721679688, 515.1428833007812),
    p(216694070, 208.0, 501.4285583496094),
    p(216694077, 207.42857360839844, 487.1428527832031),
    p(216694085, 206.57142639160156, 472.8571472167969),
    p(216694092, 206.57142639160156, 458.8571472167969),
    p(216694100, 206.57142639160156, 446.0),
    p(216694108, 206.57142639160156, 434.28570556640625),
    p(216694116, 207.14285278320312, 423.71429443359375),
    p(216694124, 208.57142639160156, 412.8571472167969),
    p(216694131, 209.7142791748047, 402.28570556640625),
    p(216694139, 211.7142791748047, 393.1428527832031),
    p(216694147, 213.42857360839844, 385.1428527832031),
    p(216694154, 215.42857360839844, 378.28570556640625),
    p(216694162, 217.42857360839844, 371.71429443359375),
    p(216694169, 219.42857360839844, 366.0),
    p(216694177, 221.42857360839844, 360.8571472167969),
    p(216694185, 223.42857360839844, 356.5714416503906),
    p(216694193, 225.14285278320312, 352.28570556640625),
    p(216694201, 226.85714721679688, 348.5714416503906),
    p(216694209, 228.2857208251953, 346.0),
    p(216694216, 229.14285278320312, 343.71429443359375),
    p(216694224, 230.0, 342.0),
    p(216694232, 230.57142639160156, 340.5714416503906),
    p(216694239, 230.85714721679688, 339.71429443359375),
    p(216694247, 230.85714721679688, 339.4285583496094),
    p(216694262, 230.2857208251953, 342.0),
    p(216694270, 228.85714721679688, 346.28570556640625),
    p(216694278, 227.14285278320312, 352.5714416503906),
    p(216694286, 225.42857360839844, 359.4285583496094),
    p(216694294, 223.7142791748047, 367.71429443359375),
    p(216694301, 222.57142639160156, 376.0),
    p(216694309, 221.42857360839844, 384.28570556640625),
    p(216694317, 220.85714721679688, 392.28570556640625),
    p(216694324, 220.0, 400.5714416503906),
    p(216694332, 219.14285278320312, 409.71429443359375),
    p(216694339, 218.85714721679688, 419.1428527832031),
    p(216694348, 218.2857208251953, 428.8571472167969),
    p(216694356, 218.2857208251953, 438.8571472167969),
    p(216694363, 218.2857208251953, 447.71429443359375),
    p(216694371, 218.2857208251953, 455.71429443359375),
    p(216694379, 219.14285278320312, 462.8571472167969),
    p(216694386, 220.0, 469.4285583496094),
    p(216694394, 221.14285278320312, 475.4285583496094),
    p(216694401, 222.0, 480.5714416503906),
    p(216694409, 222.85714721679688, 485.4285583496094),
    p(216694417, 224.0, 489.71429443359375),
    p(216694425, 224.85714721679688, 492.8571472167969),
    p(216694433, 225.42857360839844, 495.4285583496094),
    p(216694440, 226.0, 497.1428527832031),
    p(216694448, 226.2857208251953, 498.28570556640625),
    p(216694456, 226.2857208251953, 498.8571472167969),
    p(216694471, 226.2857208251953, 498.28570556640625),
    p(216694479, 226.2857208251953, 496.5714416503906),
    p(216694486, 226.2857208251953, 493.71429443359375),
    p(216694494, 226.2857208251953, 490.0),
    p(216694502, 226.2857208251953, 486.0),
    p(216694510, 226.2857208251953, 480.5714416503906),
    p(216694518, 226.2857208251953, 475.71429443359375),
    p(216694525, 226.2857208251953, 468.8571472167969),
    p(216694533, 226.2857208251953, 461.4285583496094),
    p(216694541, 226.2857208251953, 452.5714416503906),
    p(216694548, 226.57142639160156, 442.28570556640625),
    p(216694556, 226.57142639160156, 432.28570556640625),
    p(216694564, 226.85714721679688, 423.4285583496094),
    p(216694571, 227.42857360839844, 416.0),
    p(216694580, 227.7142791748047, 410.0),
    p(216694587, 228.2857208251953, 404.28570556640625),
    p(216694595, 228.85714721679688, 399.71429443359375),
    p(216694603, 229.14285278320312, 395.4285583496094),
    p(216694610, 229.42857360839844, 392.28570556640625),
    p(216694618, 229.7142791748047, 390.0),
    p(216694625, 229.7142791748047, 388.0),
    p(216694633, 229.7142791748047, 386.8571472167969),
    p(216694641, 229.7142791748047, 386.28570556640625),
    p(216694648, 229.7142791748047, 386.0),
    p(216694657, 228.85714721679688, 386.0),
    p(216694665, 228.0, 388.0),
    p(216694672, 226.0, 392.5714416503906),
    p(216694680, 224.0, 397.71429443359375),
    p(216694688, 222.0, 404.28570556640625),
    p(216694695, 219.7142791748047, 411.1428527832031),
    p(216694703, 218.2857208251953, 418.0),
    p(216694710, 217.14285278320312, 425.4285583496094),
    p(216694718, 215.7142791748047, 433.4285583496094),
    p(216694726, 214.85714721679688, 442.28570556640625),
    p(216694734, 214.0, 454.0),
    p(216694742, 214.0, 469.4285583496094),
    p(216694749, 215.42857360839844, 485.4285583496094),
    p(216694757, 217.7142791748047, 502.8571472167969),
    p(216694765, 221.14285278320312, 521.4285888671875),
    p(216694772, 224.57142639160156, 541.1428833007812),
    p(216694780, 229.14285278320312, 561.1428833007812),
    p(216694788, 233.42857360839844, 578.8571166992188),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(646.87);
  expect(velocity!.y).toBeCloseTo(2976.98);
});

test(`7`, () => {
  const P = [
    p(216695344, 253.42857360839844, 310.5714416503906),
    p(216695352, 253.42857360839844, 310.5714416503906),
    p(216695359, 252.85714721679688, 318.0),
    p(216695367, 251.14285278320312, 322.0),
    p(216695375, 248.85714721679688, 327.1428527832031),
    p(216695382, 246.0, 334.8571472167969),
    p(216695390, 242.57142639160156, 344.5714416503906),
    p(216695397, 238.85714721679688, 357.4285583496094),
    p(216695406, 235.7142791748047, 371.71429443359375),
    p(216695414, 232.2857208251953, 386.8571472167969),
    p(216695421, 229.42857360839844, 402.0),
    p(216695429, 227.42857360839844, 416.8571472167969),
    p(216695437, 226.2857208251953, 431.4285583496094),
    p(216695444, 226.2857208251953, 446.0),
    p(216695452, 227.7142791748047, 460.28570556640625),
    p(216695459, 230.0, 475.1428527832031),
    p(216695467, 232.2857208251953, 489.71429443359375),
    p(216695475, 235.7142791748047, 504.0),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(396.698);
  expect(velocity!.y).toBeCloseTo(2106.225);
});

test(`8`, () => {
  const P = [
    p(216695885, 238.85714721679688, 524.0),
    p(216695908, 236.2857208251953, 515.7142944335938),
    p(216695916, 234.85714721679688, 509.1428527832031),
    p(216695924, 232.57142639160156, 498.5714416503906),
    p(216695931, 230.57142639160156, 483.71429443359375),
    p(216695939, 229.14285278320312, 466.5714416503906),
    p(216695947, 229.14285278320312, 446.5714416503906),
    p(216695955, 230.57142639160156, 424.8571472167969),
    p(216695963, 232.57142639160156, 402.28570556640625),
    p(216695970, 235.14285278320312, 380.0),
    p(216695978, 238.57142639160156, 359.4285583496094),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(298.315);
  expect(velocity!.y).toBeCloseTo(-3660.83);
});

test(`9`, () => {
  const P = [
    p(216696429, 238.2857208251953, 568.5714111328125),
    p(216696459, 234.0, 560.0),
    p(216696467, 231.42857360839844, 553.1428833007812),
    p(216696475, 228.2857208251953, 543.1428833007812),
    p(216696483, 225.42857360839844, 528.8571166992188),
    p(216696491, 223.14285278320312, 512.2857055664062),
    p(216696498, 222.0, 495.4285583496094),
    p(216696506, 221.7142791748047, 477.4285583496094),
    p(216696514, 221.7142791748047, 458.28570556640625),
    p(216696521, 223.14285278320312, 438.0),
    p(216696529, 224.2857208251953, 416.28570556640625),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(-1.73);
  expect(velocity!.y).toBeCloseTo(-3288.13);
});

test(`10`, () => {
  const P = [
    p(216696974, 218.57142639160156, 530.5714111328125),
    p(216697012, 220.2857208251953, 522.0),
    p(216697020, 221.14285278320312, 517.7142944335938),
    p(216697028, 222.2857208251953, 511.71429443359375),
    p(216697036, 224.0, 504.28570556640625),
    p(216697044, 227.14285278320312, 490.5714416503906),
    p(216697052, 229.42857360839844, 474.0),
    p(216697059, 231.42857360839844, 454.5714416503906),
    p(216697067, 233.7142791748047, 431.1428527832031),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(384.64);
  expect(velocity!.y).toBeCloseTo(-2645.66);
});

test(`11`, () => {
  const P = [
    p(216697435, 257.1428527832031, 285.1428527832031),
    p(216697465, 251.7142791748047, 296.8571472167969),
    p(216697473, 248.2857208251953, 304.0),
    p(216697481, 244.57142639160156, 314.8571472167969),
    p(216697489, 240.2857208251953, 329.1428527832031),
    p(216697497, 236.85714721679688, 345.1428527832031),
    p(216697505, 233.7142791748047, 361.4285583496094),
    p(216697512, 231.14285278320312, 378.28570556640625),
    p(216697520, 229.42857360839844, 395.4285583496094),
    p(216697528, 229.42857360839844, 412.8571472167969),
    p(216697535, 230.85714721679688, 430.8571472167969),
    p(216697543, 233.42857360839844, 449.71429443359375),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(176.379);
  expect(velocity!.y).toBeCloseTo(2711.254);
});

test(`12`, () => {
  const P = [
    p(216697749, 246.0, 311.4285583496094),
    p(216697780, 244.57142639160156, 318.28570556640625),
    p(216697787, 243.14285278320312, 325.4285583496094),
    p(216697795, 241.42857360839844, 336.0),
    p(216697803, 239.7142791748047, 351.1428527832031),
    p(216697811, 238.2857208251953, 368.5714416503906),
    p(216697819, 238.0, 389.4285583496094),
    p(216697826, 239.14285278320312, 412.0),
    p(216697834, 242.2857208251953, 438.0),
    p(216697842, 247.42857360839844, 466.8571472167969),
    p(216697849, 254.2857208251953, 497.71429443359375),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(396.932);
  expect(velocity!.y).toBeCloseTo(4280.65);
});

test(`13`, () => {
  const P = [
    p(216698321, 250.0, 306.0),
    p(216698328, 250.0, 306.0),
    p(216698344, 249.14285278320312, 314.0),
    p(216698351, 247.42857360839844, 319.4285583496094),
    p(216698359, 245.14285278320312, 326.8571472167969),
    p(216698366, 241.7142791748047, 339.4285583496094),
    p(216698374, 238.57142639160156, 355.71429443359375),
    p(216698382, 236.2857208251953, 374.28570556640625),
    p(216698390, 235.14285278320312, 396.5714416503906),
    p(216698398, 236.57142639160156, 421.4285583496094),
    p(216698406, 241.14285278320312, 451.4285583496094),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(-71.519);
  expect(velocity!.y).toBeCloseTo(3716.74);
});

test(`interrupted`, () => {
  const P = [
    p(216698321, 250.0, 306.0),
    p(216698328, 250.0, 306.0),
    p(216698344, 249.14285278320312, 314.0),
    p(216698351, 247.42857360839844, 319.4285583496094),
    p(216698359, 245.14285278320312, 326.8571472167969),
    p(216698366, 241.7142791748047, 339.4285583496094),
    // +40ms gap
    p(216698374 + 40, 238.57142639160156, 355.71429443359375),
    p(216698382 + 40, 236.2857208251953, 374.28570556640625),
    p(216698390 + 40, 235.14285278320312, 396.5714416503906),
    p(216698398 + 40, 236.57142639160156, 421.4285583496094),
    p(216698406 + 40, 241.14285278320312, 451.4285583496094),
  ];

  const tracker = createVelocityTracker();
  for (const { time, point } of P) {
    trackPosition(tracker, time, point);
  }
  const velocity = estimateVelocity(tracker);
  expect(velocity!.x).toBeCloseTo(649.489);
  expect(velocity!.y).toBeCloseTo(3890.305);
});
