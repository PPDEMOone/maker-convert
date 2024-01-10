import BluePrint from "react-blueprint-svg";
import makerJs, { IModel, IPoint } from "makerjs";
import opentype from "opentype.js";

type TextModelParams = ConstructorParameters<typeof makerJs.models.Text>;

const custom = {
  text1: "MAHLEAH",
  text2: "D",
  text3: "Trigger",
};

const guitarPathData =
  "M34.31,102a23.62,23.62,0,0,1-14.5-5.37,106.39,106.39,0,0,0-17.64,4.84.5.5,0,0,1-.36-.93,108.38,108.38,0,0,1,17-4.74,20.55,20.55,0,0,1-6.38-9.24c-2-7.21,5.23-11.68,10.88-14.41a9.63,9.63,0,0,0,5.94-8.92,27.05,27.05,0,0,1,1.44-7.08c.59-1.92,2.25-4,3.59-3.79.43.06,1.15.39,1.18,1.93.15,6.25,1.08,7.09,1.47,7.16,0,0,1.8,0,3.39-2.95L60.08,25.39a.66.66,0,0,0,.08-.53,1,1,0,0,0-.53-.61l-2-1.1a.65.65,0,0,1-.33-.55.69.69,0,0,1,.31-.57c3.9-2.43,5.62-5.92,5.56-11.32a.65.65,0,0,1,.27-.53.66.66,0,0,1,.58-.1l1.87.59a34.13,34.13,0,0,1,10.68,5.57.66.66,0,0,1-.07,1.1c-4.89,2.76-7.24,6.12-7.4,10.59a.66.66,0,0,1-.34.55.64.64,0,0,1-.64,0L66,27.2a.78.78,0,0,0-.58-.08.74.74,0,0,0-.47.36L46.24,61.1c-1.52,2.37-4.93,9-2.72,11.68.26.3,1.45.69,6.94-2.31,1.52-.83,2.16-.18,2.36.13.7,1.07-.19,3.22-1.86,4.51-.23.18-.51.38-.82.6-2.87,2.08-8.21,6-5.93,12.75.13.38.26.76.41,1.14a17,17,0,0,0,13.61,10.46,18,18,0,0,0,2.7.15c10.32-.3,16.37-2.25,19.93-4.44a15.17,15.17,0,0,1-1.46-1.46c-1.37-1.33-2-2.69-1.73-3.69a1.43,1.43,0,0,1,1.11-1,3.61,3.61,0,0,1,3.09,1.33,4.14,4.14,0,0,1,3.26-1.79,1.35,1.35,0,0,1,1.12.84c.35.9-.15,2.22-1.41,3.72a13,13,0,0,1-2.33,2.15,19.91,19.91,0,0,0,5.88,3.26c.07,0,8.85,2.63,23.19,1.07a.49.49,0,0,1,.55.44.5.5,0,0,1-.44.55c-14.57,1.58-23.52-1.09-23.61-1.12a21.14,21.14,0,0,1-6.43-3.6c-4.48,2.86-11.51,4.49-20.69,4.75a18.9,18.9,0,0,1-2.87-.16A18,18,0,0,1,43.7,90c-.15-.39-.3-.79-.43-1.19C40.76,81.28,46.7,77,49.56,74.91c.3-.22.57-.41.8-.59,1.45-1.11,1.93-2.73,1.63-3.18-.11-.16-.53-.08-1.06.2-4.76,2.61-7.2,3.23-8.17,2.07C39.63,69.67,45.15,61,45.39,60.59L64.11,27a1.75,1.75,0,0,1,1.08-.84,1.73,1.73,0,0,1,1.35.19l1.62,1c.34-4.42,2.71-7.81,7.43-10.59a32.53,32.53,0,0,0-10-5.12l-1.42-.44c0,5.3-1.77,8.85-5.55,11.39l1.47.82a2,2,0,0,1,1,1.22,1.66,1.66,0,0,1-.19,1.3l-19.75,33c-1.9,3.56-4.26,3.44-4.37,3.44-1.53-.26-2.21-2.69-2.34-8.12,0-.56-.14-.94-.32-1-.52-.09-1.92,1.16-2.52,3.12a27.09,27.09,0,0,0-1.39,6.82A10.65,10.65,0,0,1,23.74,73c-5.33,2.58-12.19,6.76-10.36,13.25.86,3,3.27,6.49,6.67,9.29a61.88,61.88,0,0,1,7.66-.85c7.69-.33,14.89,1.63,15.11,4.1.13,1.45-1.85,2.46-5.88,3A21.24,21.24,0,0,1,34.31,102Zm-13.2-5.59a21.74,21.74,0,0,0,15.7,4.43c4-.54,5.06-1.46,5-1.92-.11-1.3-5.69-3.55-14.08-3.2A57.72,57.72,0,0,0,21.11,96.36Zm58.08-5.81a.65.65,0,0,0-.2,0,.44.44,0,0,0-.36.33c-.14.46.18,1.46,1.49,2.74a17.89,17.89,0,0,0,1.6,1.56,12.32,12.32,0,0,0,2.36-2.14c1.16-1.39,1.4-2.33,1.25-2.71a.33.33,0,0,0-.32-.22c-.6-.08-1.7.47-2.7,1.85a.49.49,0,0,1-.38.21.51.51,0,0,1-.4-.17A3.57,3.57,0,0,0,79.19,90.55ZM68.13,27.89Z";

const GUITAR_LINE_TEXT_POSITION: IPoint = [52, 19];

const CARVED_MAX_WIDTH = 41;
const CARVED_MAX_HEIGHT = 7.5;
const SCALE_RATIO_STEP = 0.01;

const MAX_LINE_TEXT_WIDTH = 50.99;

const FONT_URL =
  "https://assets.sunzi.cool/assets/AIV77%E3%80%903%E3%80%91V1.0-0315.TTF";
const FONT_URL_2 = "https://assets.sunzi.cool/assets/GELATO%20SCRIPT_0.OTF";
const FONT_URL_3 = "https://assets.sunzi.cool/assets/times.ttf";

const TEXT_MODEL_DEFAULT_OPTIONS = [
  true,
  false,
  undefined,
  { kerning: true, letterSpacing: 0.2 } as opentype.RenderOptions,
];

const BASELINE_OUTSIDE_LETTERS = ["Q"];

const TEXT_BASELINE_AND_CENTER_RATIO = 1 / 3.8;
const COLLISION_REGION_RECT_AND_TEXT_HEIGHT_RATIO = 1 / 3.9;

const MUL_LETTER_COLLISION_REGION_POSITION_RATIO = new Map<string, number>([
  ["A", 1 / 4.05],
  ["B", 1 / 3.85],
  ["C", 1 / 4.06],
  ["D", 1 / 4],
  ["E", 1 / 4],
  ["F", 1 / 4.05],
  ["G", 1 / 4.22],
  ["H", 1 / 4.05],
  ["I", 1 / 3.95],
  ["J", 1 / 4.13],
  ["K", 1 / 4],
  ["L", 1 / 4.05],
  ["M", 1 / 3.94],
  ["N", 1 / 3.94],
  ["O", 1 / 4.02],
  ["P", 1 / 4.02],
  ["Q", 1 / 3.85],
  ["R", 1 / 3.9],
  ["S", 1 / 4.22],
  ["T", 1 / 4.31],
  ["U", 1 / 4.02],
  ["V", 1 / 4.02],
  ["W", 1 / 3.98],
  ["X", 1 / 4.04],
  ["Y", 1 / 4.02],
  ["Z", 1 / 3.9],
]);

const pickKnife = makerJs.importer.fromSVGPathData(
  "M39.48,69.29a4.35,4.35,0,0,1-6.72,0C20.46,54.13-22.84-.83,36.41,0,93.89.82,52.24,53.93,39.48,69.29Z"
);

const guitarKnife = makerJs.importer.fromSVGPathData(guitarPathData);

const collisionRegionRect = new makerJs.models.Rectangle(
  CARVED_MAX_WIDTH,
  CARVED_MAX_HEIGHT
);

const measure = makerJs.measure.modelExtents(pickKnife);

const font = await opentype.load(FONT_URL);

const lineTextFont = await opentype.load(FONT_URL_3);

const guitarLineTextFont = await opentype.load(FONT_URL_2);

const params = [
  font,
  custom.text2,
  48,
  ...TEXT_MODEL_DEFAULT_OPTIONS,
] as TextModelParams;

const lineTextParams = [
  lineTextFont,
  custom.text3,
  10.77,
  ...TEXT_MODEL_DEFAULT_OPTIONS,
] as TextModelParams;

const guitarLineTextParams = [
  guitarLineTextFont,
  custom.text1,
  19,
  true,
  false,
  undefined,
  { kerning: true } as opentype.RenderOptions,
] as TextModelParams;

const textModel = new makerJs.models.Text(...params);

let lineTextModel = new makerJs.models.Text(
  ...lineTextParams
) as makerJs.IModel;

const guitarLineTextModel = new makerJs.models.Text(
  ...guitarLineTextParams
) as makerJs.IModel;

makerJs.model.zero(pickKnife);
makerJs.model.zero(textModel);

makerJs.model.originate(pickKnife);

makerJs.model.addModel(pickKnife, textModel, "content");

const measure_text = makerJs.measure.modelExtents(textModel);

makerJs.model.originate(textModel);

const lineTextContent: MakerJs.IModel = {
  models: {
    collisionRegionRect,
    lineTextModel,
  },
};

makerJs.model.addModel(textModel, lineTextContent, "lineTextContent");

makerJs.model.originate(lineTextContent);

makerJs.model.zero(lineTextModel);
makerJs.model.zero(collisionRegionRect);

let targetMeasureRect = makerJs.measure.modelExtents(lineTextModel);
let scale = 1;
let times = 0;

const collisionMeasureRect = makerJs.measure.modelExtents(collisionRegionRect);

makerJs.model.moveRelative(lineTextContent.models!["lineTextModel"], [
  (CARVED_MAX_WIDTH - targetMeasureRect.width) / 2,
  (CARVED_MAX_HEIGHT - targetMeasureRect.height) / 2,
]);

const isContain = (area: IModel, low: IPoint, high: IPoint) =>
  makerJs.measure.isPointInsideModel(high, area) &&
  makerJs.measure.isPointInsideModel(low, area);

while (
  targetMeasureRect.width >= CARVED_MAX_WIDTH ||
  targetMeasureRect.height >= CARVED_MAX_HEIGHT ||
  !isContain(collisionRegionRect, targetMeasureRect.low, targetMeasureRect.high)
) {
  if (times) {
    scale = Number((scale - SCALE_RATIO_STEP).toFixed(2));
  }

  if (scale <= 0) {
    break;
  }

  const testModel = makerJs.model.distort(lineTextModel, scale, scale);
  targetMeasureRect = makerJs.measure.modelExtents(testModel);
  // console.log(targetMeasureRect);
  makerJs.model.moveRelative(testModel, [
    (CARVED_MAX_WIDTH - targetMeasureRect.width) / 2,
    (CARVED_MAX_HEIGHT - targetMeasureRect.height) / 2,
  ]);

  const { low, high } = targetMeasureRect;
  const overflowBottom = makerJs.measure.isPointInsideModel(
    low,
    collisionRegionRect
  );
  const overflowTop = makerJs.measure.isPointInsideModel(
    high,
    collisionRegionRect
  );

  if (overflowBottom && overflowTop) {
    // break;
  } else if (!overflowTop) {
    makerJs.model.moveRelative(testModel, [0, -Math.abs(high[1])]);
  } else if (!overflowBottom) {
    makerJs.model.moveRelative(testModel, [0, Math.abs(low[1])]);
  } else {
    // continue;
  }
  targetMeasureRect = makerJs.measure.modelExtents(testModel);
  lineTextContent.models!["lineTextModel"] = testModel;
  times++;
  // console.log(scale);
}

const offsetLineTextContentY =
  measure_text.height *
  (MUL_LETTER_COLLISION_REGION_POSITION_RATIO.get(custom.text2) ??
    COLLISION_REGION_RECT_AND_TEXT_HEIGHT_RATIO);

const baseLineY = measure_text.center[1] * TEXT_BASELINE_AND_CENTER_RATIO;

makerJs.model.moveRelative(lineTextContent, [
  (measure_text.width - collisionMeasureRect.width) / 2,
  BASELINE_OUTSIDE_LETTERS.includes(custom.text2)
    ? baseLineY + offsetLineTextContentY
    : offsetLineTextContentY,
]);

delete lineTextContent.models!["collisionRegionRect"];

makerJs.model.moveRelative(textModel, [
  (measure.width - measure_text.width) / 2,
  (measure.height - measure_text.height) / 1.25,
]);

// makerJs.model.zero(guitarKnife);
makerJs.model.zero(guitarKnife);

makerJs.model.originate(guitarKnife);

makerJs.model.scale(guitarLineTextModel, 0.3, false);

makerJs.model.addModel(guitarKnife, guitarLineTextModel, "guitarLineTextModel");

makerJs.model.zero(guitarLineTextModel);
makerJs.model.move(guitarLineTextModel, GUITAR_LINE_TEXT_POSITION);

makerJs.model.moveRelative(guitarKnife, [60, 0]);
// console.log(guitarKnife.models);
console.log(makerJs.exporter.toSVGPathData(guitarKnife));
const model: IModel = {
  models: {
    pickKnife,
    guitarKnife,
    // textModel,
    // collisionRegionRect,
  },
  paths: {
    // line: new makerJs.paths.Line(
    //   [0, 0],
    //   [8.416231379464637, 19.60278748201897]
    // ),
  },
};

// const pathData = makerJs.exporter.toSVGPathData(pickKnife, {
//   fillRule: "nonzero",
// });
// const pathData2 = makerJs.exporter.toSVGPathData(guitarKnife, {
//   fillRule: "nonzero",
// });
// const svg = makerJs.exporter.toSVG(guitarKnife, {
//   viewBox: true,
//   useSvgPathOnly: true,
//   fill: "none",
//   stroke: "#000",
//   strokeWidth: "0.14px",
//   scale: 1,
//   cssStyle: "none",
//   svgAttrs: {
//     width: "100%",
//     height: "100%",
//   },
//   scalingStroke: true,
// });

// const svg2 = makerJs.exporter.toSVG(pickKnife, {
//   viewBox: true,
//   useSvgPathOnly: true,
//   fill: "none",
//   stroke: "#000",
//   strokeWidth: "0.14px",
// });

// console.log(svg);
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
