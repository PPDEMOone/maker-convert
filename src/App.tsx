import BluePrint from "react-blueprint-svg";
import makerJs, { IModel, IPoint } from "makerjs";
import opentype from "opentype.js";
import { Bezier } from "bezier-js";
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

// 基线位置相对于文本高度的比例
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

function createBezierCurveArc<T extends number[]>(...args: T) {
  const [cx, cy, rx, ry] = args;
  const k = (4 / 3) * Math.tan(Math.PI / 8);
  const arcBezierCurve = new makerJs.models.BezierCurve(
    [0, ry],
    [rx * k, ry],
    [rx, ry * k],
    [rx, 0]
  );

  makerJs.model.move(arcBezierCurve, [cx + 10, cy + 10]);

  return arcBezierCurve;
}

// 根据圆弧创建以弧心作为圆心；圆的贝塞尔曲线
function createBezierByCircle(origin: IPoint, radius: number) {
  const [cx, cy] = origin as number[];
  const arc_1 = createBezierCurveArc(cx, cy, -radius, radius);
  const arc_2 = createBezierCurveArc(cx, cy, radius, radius);
  const arc_3 = createBezierCurveArc(cx, cy, radius, -radius);
  const arc_4 = createBezierCurveArc(cx, cy, -radius, -radius);
  const models: MakerJs.IModel = {
    models: {
      arc_1,
      arc_2,
      arc_3,
      arc_4,
    },
  };
  return models;
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

const textContent = "F";

const createTextModel = async () => {
  const font = await opentype.load(
    "https://assets.sunzi.cool/preload/lamp-bulb/font/iDDV003.ttf"
  );

  createTextParams(textContent);
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
const horizontalCenterPointX = measureRectCenter[0];

const {
  width: textWidth,
  height: textHeight,
  center: textCenter,
} = makerJs.measure.modelExtents(textModel);

// 将文字 和 底座 偏移到限制区域中心
makerJs.model.moveRelative(bottomModelRefer, [horizontalCenterPointX, 0]);

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
  horizontalCenterPointX - textWidth / 2,
  canBeOffset
    ? measureBottomModelHeight - (textHeight - baseLinePositionY)
    : measureBottomModelHeight,
]);
// console.log(bottomModelRefer.origin);
const bModelTopEndPointLeft = bottomModelRefer.origin!,
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

const baseSupport = makerJs.model.clone(bottomModelRefer);

const model: IModel = {
  models: {
    // base: baseSupport,
    // refer: bottomModelRefer,
    text: textModel,
    measure: measureRect,
    // ref_line_1: createDashedLine([0, 0], bModelTopEndPointLeft!, 5),
    // ref_line_2: createDashedLine([0, 0], bModelTopEndPointRight!, 5),
    ref_vertical_line: createDashedLine(
      [horizontalCenterPointX, measureRectHigh[1]],
      [horizontalCenterPointX, 0],
      5
    ),
    ref_middle_line: createDashedLine(
      [0, measureRectCenter[1]],
      [measureRectHigh[0], measureRectCenter[1]],
      5
    ),
    ref_top_line: createDashedLine(
      [0, measureBottomHigh[1] + textHeight],
      [measureRectHigh[0], measureBottomHigh[1] + textHeight],
      5
    ),
    ref_bottom_line: createDashedLine(
      [0, measureBottomHigh[1]],
      [measureRectHigh[0], measureBottomHigh[1]],
      5
    ),
    ref_textContent_middle_line: createDashedLine(
      [0, (measureBottomHigh[1] + measureBottomHigh[1] + textHeight) / 2],
      [
        measureRectHigh[0],
        (measureBottomHigh[1] + measureBottomHigh[1] + textHeight) / 2,
      ],
      5
    ),
  },
  paths: {
    // line: new makerJs.paths.Line([0, 0], [142.47479464762688, 24.7996244]),
  },
};

const points: MakerJs.IPoint[] = [];
const excludePoint: MakerJs.IPoint[] = [];
const excludeGlyphIncompletePaths: Record<string, IPoint[]> = {};

makerJs.model.addModel(model, baseSupport, "base");

// 设置所有路径模型坐标 为同一公共坐标轴
makerJs.model.originate(textModel);

makerJs.model.walk(textModel, {
  onPath(model) {
    const refLine_1 = measureRectCenter[1];
    const refLine_2 = measureBottomHigh[1];
    const pick = (y: IPoint[1]) => y < refLine_1 && y >= refLine_2;
    // console.log(model);
    // route[1] is textModel single Glyph position index
    const excludeIncompleteGlyphPoint = (point: IPoint) => {
      if (!excludeGlyphIncompletePaths[model.route[1]]) {
        excludeGlyphIncompletePaths[model.route[1]] = [];
      }
      excludeGlyphIncompletePaths[model.route[1]].push(point);
    };

    if (model.modelContext.type === "BezierCurve") {
      const bezierCurvePath = model.modelContext as InstanceType<
        typeof makerJs.models.BezierCurve
      >;
      const { end, origin } = bezierCurvePath.seed;

      if (pick(end[1])) {
        points.push(end);
      } else if (end[1] < refLine_2) {
        excludeIncompleteGlyphPoint(end);
      } else {
        excludePoint.push(end);
      }

      if (pick(origin[1])) {
        points.push(origin);
      } else if (origin[1] < refLine_2) {
        excludeIncompleteGlyphPoint(origin);
      } else {
        excludePoint.push(origin);
      }

      console.log(model.modelContext);
    } else {
      console.log(model.modelContext.paths);
    }
  },
});

console.log(
  "包含坐标",
  points,
  "参考线外坐标(不包括文字超出基线区域的坐标点)",
  excludePoint,
  "文字基线以下的内容路径",
  excludeGlyphIncompletePaths
);

type HorizontalRange = [IPoint[0], IPoint[0]];

// 文字基线以上的内容路径需要过滤的路径点对应的x轴范围
const excludeGlyphRange: HorizontalRange[] = [];

for (const [, points] of Object.entries(excludeGlyphIncompletePaths)) {
  let max = points[0][0],
    min = points[0][0];
  for (let i = 0; i < points.length; i++) {
    const [x] = points[i] as number[];
    if (x > max) {
      max = x;
    } else if (x < min) {
      min = x;
    }
  }
  excludeGlyphRange.push([min, max]);
}

// 文字基线以上的内容路径经过过滤的路径结果(底座插入位置目标点集合)
const targetPoints = points.filter(
  (point) =>
    !excludeGlyphRange.some(([min, max]) => point[0] >= min && point[0] < max)
);

function neighborPointSort<T extends makerJs.IPoint[] = makerJs.IPoint[]>(
  arr: T
): T {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[arr.length - 1];
  const pivotDistance = Math.abs(horizontalCenterPointX - pivot[0]);
  const left: makerJs.IPoint[] = [];
  const right: makerJs.IPoint[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    const point = arr[i];
    const pointX = point[0];
    const distance = Math.abs(horizontalCenterPointX - pointX);
    // console.log(distance, pointX);
    if (distance < pivotDistance) {
      left.push(point);
    } else {
      right.push(point);
    }
  }
  return [...neighborPointSort(left), pivot, ...neighborPointSort(right)] as T;
}

// 将坐标点根据 中间点远近进行排序
const neighborPoints = neighborPointSort(targetPoints);

// console.log(neighborPoints);
// 根据规则查找底座路径插入的最适合坐标点
const insertBaseSupportInvoker = (points: makerJs.IPoint[]) => {
  let index = 0;
  const invoke = (position = 0) => {
    const point = points[position];
    if (!point) {
      throw new Error("There is not point, Didn't find the right point");
    }
    const [pointX] = point as number[];
    makerJs.model.move(baseSupport, bModelTopEndPointLeft);

    const horizontalDistance = pointX - bModelTopEndPointLeft[0];
    const { origin = [0, 0] } = makerJs.model.moveRelative(baseSupport, [
      horizontalDistance,
      0,
    ]);

    // [p_8]为底座中绘制圆环圆弧
    const arc = baseSupport.paths?.["p_8"] as makerJs.IPathArc;

    const arcRelativeOrigin = makerJs.point.add(origin, arc.origin);
    // 当前底座位置对应的圆弧弧心的距离作为底座插入文字路径的垂直安全距离
    const safeVerticalDistance =
      makerJs.measure.pointDistance(origin, arcRelativeOrigin) - arc.radius;

    // if (makerJs.measure.pointDistance(point, origin) > safeVerticalDistance) {
    //   index++;
    //   invoke(index);
    // } else {
    //   const measureCircle = createBezierByCircle(arcRelativeOrigin, arc.radius);
    //   makerJs.model.originate(measureCircle);
    //   console.log(measureCircle);

    //   const lastOffsetTimesY = safeVerticalDistance % 1;
    //   if (safeVerticalDistance < 1) {
    //     makerJs.model.moveRelative(baseSupport, [0, safeVerticalDistance]);
    //   } else {
    //     for (let i = 1; i < Math.trunc(safeVerticalDistance); i++) {
    //       makerJs.model.moveRelative(baseSupport, [0, 1]);
    //     }

    //     makerJs.model.moveRelative(baseSupport, [0, lastOffsetTimesY]);
    //   }
    // }
  };

  invoke(index);
  // console.log(index);
};

insertBaseSupportInvoker(neighborPoints);

console.log(textModel);

// const arc = baseSupport.paths!["p_8"] as MakerJs.IPathArc;
// const circle = createBezierByCircle(
//   makerJs.point.add(baseSupport.origin!, arc.origin),
//   arc.radius
// );
// makerJs.model.originate(circle);

// console.log(circle);
// makerJs.model.addModel(model, circle, "circle");

// makerJs.model.move(baseSupport, [136.4097946476269 - 5.7, 39.7703287453701]);
makerJs.model.combine(textModel, baseSupport);

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
