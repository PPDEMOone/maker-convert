import BluePrint from "react-blueprint-svg";
import makerJs from "makerjs";
import opentype from "opentype.js";
type Min = number;
type Max = number;
type Target = number;
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

const createTextModel = async () => {
  const font = await opentype.load(
    "https://assets.sunzi.cool/preload/lamp-bulb/font/iDDV003.ttf"
  );

  const textContent = "GiftLab";

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

makerJs.model.walkPaths(textModel, (val) => {
  console.log(val);
});

const bottomModel = makerJs.importer.fromSVGPathData(
  "M0,0V21.09A2.83,2.83,0,0,1,.86,25a2.72,2.72,0,0,1-.86.86v2.48H5.67V0ZM2.83,7.8A2.13,2.13,0,1,1,5,5.67,2.13,2.13,0,0,1,2.83,7.8Z"
);

const measureRect: makerJs.IModel = new makerJs.models.Rectangle(269.29, 93.54);

const middlePosition = makerJs.measure.modelExtents(measureRect).center;
const { width: textWidth, height: textHeight } =
  makerJs.measure.modelExtents(textModel);
const model = {
  models: {
    bc3: bottomModel,
    text: textModel,
    measure: measureRect,
  },
};

makerJs.model.zero(bottomModel);
makerJs.model.zero(textModel);

makerJs.model.moveRelative(bottomModel, [middlePosition[0], 0]);
makerJs.model.moveRelative(textModel, [
  middlePosition[0] - textWidth / 2,
  middlePosition[1] - textHeight / 2,
]);
// makerJs.model.distort(model, 0.7, 1);
console.log(makerJs.measure.modelPathLength(textModel));

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
