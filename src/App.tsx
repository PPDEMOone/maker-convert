import BluePrint from "react-blueprint-svg";
import makerJs, { IModel, IPoint } from "makerjs";
import opentype from "opentype.js";
type Min = number;
type Max = number;
type Target = number;

// 超出字体基线字符
const BASELINE_OUTSIDE_LETTERS = ["g", "j", "p", "q", "y", "f"];

const DEFAULT_FONT_SIZE = 90;
/**
 * 字母参考长度
 */
const WORD_LENGTH_MAP = new Map([
  ["a", 55.6],
  ["b", 77.37],
  ["c", 38.21],
  ["d", 74.54],
  ["e", 40.32],
  ["f", 70.42],
  ["g", 76.39],
  ["h", 68.89],
  ["i", 38.29],
  ["j", 57.9],
  ["k", 75.29],
  ["l", 44.61],
  ["m", 65.66],
  ["n", 42.53],
  ["o", 47.33],
  ["p", 70.79],
  ["q", 69.34],
  ["r", 39.05],
  ["s", 42.6],
  ["t", 51.9],
  ["u", 48.83],
  ["v", 41.32],
  ["w", 60.24],
  ["x", 55.9],
  ["y", 68.74],
  ["z", 40.82],
  ["A", 69.77],
  ["B", 85.99],
  ["C", 44.22],
  ["D", 79.05],
  ["E", 53.95],
  ["F", 58.69],
  ["G", 61.49],
  ["H", 73.09],
  ["I", 53.31],
  ["J", 52.14],
  ["K", 78.93],
  ["L", 45.19],
  ["M", 87.58],
  ["N", 79.28],
  ["O", 55.91],
  ["P", 67.9],
  ["Q", 66.62],
  ["R", 75.87],
  ["S", 58.75],
  ["T", 40.8],
  ["U", 64.21],
  ["V", 62.49],
  ["W", 90.9],
  ["X", 80.41],
  ["Y", 62.07],
  ["Z", 53.17],
  ["1", 32.47],
  ["2", 36.84],
  ["3", 45.06],
  ["4", 45.92],
  ["5", 37.36],
  ["6", 62.01],
  ["7", 34.41],
  ["8", 48.08],
  ["9", 58.05],
  ["0", 48.02],
  ["!", 57.14],
  ["&", 82.05],
]);

/**
 * 对应区间的灯丝长度 unit mm
 */
const TEXT_LENGTH_RANGE: Map<[Min, Max], Target> = new Map([
  [[175, 195], 185],
  [[245, 265], 255],
  [[290, 310], 300],
  [[360, 380], 370],
  [[450, 470], 460],
  [[470, 490], 460],
  [[490, 510], 460],
]);

const TEXT_BASELINE_AND_HEIGHT_RATIO = 1 / 4.1;

function createDashedLine(
  startPoint: IPoint,
  endPoint: IPoint,
  dashLength: number
) {
  const lineLength = makerJs.measure.pointDistance(startPoint, endPoint);
  const numSegments = Math.floor(lineLength / dashLength);
  const dashedLine: IModel = {
    paths: {},
  };
  for (let i = 0; i < numSegments; i++) {
    const segmentStart = makerJs.point.add(
      startPoint,
      makerJs.point.scale(
        makerJs.point.subtract(endPoint, startPoint),
        i / numSegments
      )
    );

    const segmentEnd = makerJs.point.add(
      startPoint,
      makerJs.point.scale(
        makerJs.point.subtract(endPoint, startPoint),
        (i + 0.5) / numSegments
      )
    );

    const segment = new makerJs.paths.Line(segmentStart, segmentEnd);
    dashedLine.paths!["dash_" + i] = segment;
  }
  // console.log(dashedLine.paths);
  return dashedLine;
}

const createTextParams = (text: string) => {
  const length = text?.split("").reduce((pre, cur) => {
    return (pre += WORD_LENGTH_MAP!.get(cur) ?? 0);
  }, 0);
  let fontSize: number | undefined;
  let target: number | undefined;
  /**
   * @description
   * @link https://project.feishu.cn/sunzi/story/detail/18730032?parentUrl=%2Fworkbench
   * // 默认字号是35px 如果不在的话 找到最接近的范围 按照范围中间值 175-195mm的范围 就取 185然后除6  当作字号
   * 更正 默认字号是127px 如果不在的话 找到最接近的范围 按照范围中间值 175-195mm的范围 就取中位数和默认值比值作为缩放值
   */
  for (const range of TEXT_LENGTH_RANGE.keys()) {
    const [min, max] = range;
    if (length >= min && length <= max) {
      fontSize = DEFAULT_FONT_SIZE;
      target = TEXT_LENGTH_RANGE.get(range)!;
      console.log(`matched range [${range}]`);
      break;
      // return [DEFAULT_FONT_SIZE, length];
    }
  }

  if (!fontSize) {
    const initialValue = TEXT_LENGTH_RANGE.keys().next().value as [Min, Max];
    let closeSection = initialValue;
    let closeDiff = initialValue[0];
    for (const range of TEXT_LENGTH_RANGE.keys()) {
      const [min, max] = range;
      const cur = Math.min(Math.abs(length - min), Math.abs(length - max));

      if (cur < closeDiff) {
        closeSection = range;
        closeDiff = cur;
      }
    }
    const [closeMin, closeMax] = closeSection;
    const closeValue = (closeMax + closeMin) / 2;
    // console.log(closeValue, length);
    fontSize = (closeValue / length) * DEFAULT_FONT_SIZE;
    target = TEXT_LENGTH_RANGE.get(closeSection)!;
  }

  return [fontSize, length, target];
};

const textContent = "Maynsa";

const createTextModel = async () => {
  const font = await opentype.load(
    "https://assets.sunzi.cool/preload/lamp-bulb/font/iDDV003.ttf"
  );

  const [fontSize = DEFAULT_FONT_SIZE] = createTextParams(textContent);
  const textModel = new makerJs.models.Text(
    font,
    textContent,
    DEFAULT_FONT_SIZE,
    true,
    false,
    undefined,
    { kerning: true }
  );

  return textModel;
};

const textModel = await createTextModel();

const bottomModelRefer = makerJs.importer.fromSVGPathData(
  "M0,0V21.09A2.83,2.83,0,0,1,.86,25a2.72,2.72,0,0,1-.86.86v2.48H5.67V0ZM2.83,7.8A2.13,2.13,0,1,1,5,5.67,2.13,2.13,0,0,1,2.83,7.8Z"
);

const measureRect: makerJs.IModel = new makerJs.models.Rectangle(269.29, 93.54);

const { center: measureRectCenter, high: measureRectHigh } =
  makerJs.measure.modelExtents(measureRect);

makerJs.model.zero(measureRect);
makerJs.model.zero(bottomModelRefer);
makerJs.model.zero(textModel);

const {
  width: textWidth,
  height: textHeight,
  center: textCenter,
} = makerJs.measure.modelExtents(textModel);

// 将文字 和 底座 偏移到限制区域中心
makerJs.model.moveRelative(bottomModelRefer, [measureRectCenter[0], 0]);

const {
  high: measureBottomHigh,
  width: measureBottomModelWidth,
  height: measureBottomModelHeight,
} = makerJs.measure.modelExtents(bottomModelRefer);
const baseLinePositionY =
  textCenter[1] + textHeight * TEXT_BASELINE_AND_HEIGHT_RATIO;
const canBeOffset = textContent
  .split("")
  .some((char) => BASELINE_OUTSIDE_LETTERS.includes(char));

makerJs.model.moveRelative(textModel, [
  measureRectCenter[0] - textWidth / 2,
  canBeOffset
    ? measureBottomModelHeight - (textHeight - baseLinePositionY)
    : measureBottomModelHeight,
]);

const bModelTopEndPointLeft = bottomModelRefer.origin,
  bModelTopEndPointRight = [
    (bottomModelRefer.origin?.[0] ?? 0) + measureBottomModelWidth,
    bottomModelRefer.origin?.[1] ?? 0,
  ] as makerJs.IPoint;

console.log(
  measureRectCenter,
  "区域中心点",
  bModelTopEndPointLeft,
  "底座左端点",
  bModelTopEndPointRight,
  "底座右端点"
);

const model: IModel = {
  models: {
    // refer: bottomModelRefer,
    text: textModel,
    measure: measureRect,
    // ref_line_1: createDashedLine([0, 0], bModelTopEndPointRight!, 5),
    // ref_line_2: createDashedLine([0, 0], bModelTopEndPointLeft!, 5),
    ref_vertical_line: createDashedLine(
      [measureRectCenter[0], measureRectHigh[1]],
      [measureRectCenter[0], 0],
      5
    ),
    ref_middle_line: createDashedLine(
      [0, measureRectCenter[1]],
      [measureRectHigh[0], measureRectCenter[1]],
      5
    ),
    ref_bottom_line: createDashedLine(
      [0, measureBottomHigh[1]],
      [measureRectHigh[0], measureBottomHigh[1]],
      5
    ),
  },
  paths: {
    // line: new makerJs.paths.Line(
    //   [0, 0],
    //   [152.68459518601648, 32.960039152912806]
    // ),
  },
};

const points: MakerJs.IPoint[] = [];
const excludePoint: MakerJs.IPoint[] = [];

// 获取参考线内的模型坐标集合
makerJs.model.walkPaths(textModel, (val) => {
  const refLine_1 = measureRectCenter[1];
  const refLine_2 = measureBottomHigh[1];
  const pick = (y: number) => y < refLine_1 && y >= refLine_2;

  if (val.type === "BezierCurve") {
    const bezierCurvePath = val as InstanceType<
      typeof makerJs.models.BezierCurve
    >;
    const { end, origin } = bezierCurvePath.seed;

    if (pick(end[1])) {
      points.push(end);
    } else {
      excludePoint.push(end);
    }

    if (pick(origin[1])) {
      points.push(origin);
    } else {
      excludePoint.push(origin);
    }
  } else {
    console.log(val.paths);
  }
});
makerJs.model.walk(textModel, {
  onPath(model) {
    console.log(model.route);
  },
});

console.log(points, "包含坐标", excludePoint, "参考线外坐标");
const baseSupport = makerJs.model.clone(bottomModelRefer);
makerJs.model.move(baseSupport, [
  bModelTopEndPointRight[0] - measureBottomModelWidth - 6,
  bModelTopEndPointRight[1],
]);

makerJs.model.addModel(model, baseSupport, "base");
console.log(baseSupport);

// 设置所有模型坐标 为同一公共坐标轴
makerJs.model.originate(model);
function App() {
  return (
    <div
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
      }}
    >
      <BluePrint model={model}></BluePrint>
    </div>
  );
}

export default App;
