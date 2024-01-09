import BluePrint from "react-blueprint-svg";
import makerJs, { IModel, IPoint } from "makerjs";
import opentype from "opentype.js";
import { Bezier } from "bezier-js";
import { v4 as uuid } from "uuid";
import { useEffect } from "react";

// type Min = number;
// type Max = number;
// type Target = number;

// type ParentGlyphType = {
//   bezierCurves: {
//     name: string;
//     bezierCurve: InstanceType<typeof Bezier>;
//   }[];
//   paths: {
//     name: string;
//     line: MakerJs.IPathLine;
//   }[];
// };

// type GlyphPathsType = {
//   type: string;
//   value: InstanceType<typeof Bezier>;
// };

// type KeyPoint = {
//   id: string;
//   // 关键点坐标
//   point: MakerJs.IPoint;
//   // 关键点类型
//   type: "origin" | "end";
//   // 控制点
//   controls?: MakerJs.IPoint[];
//   // 关键点对应端点（如果是贝塞曲线 则是 P0 或者 Pn）
//   endPoint: Omit<KeyPoint, "endPoint">;
//   // 该关键点位于的字形
//   parentGlyph: ParentGlyphType;
// };

// // 超出字体基线字符
// const BASELINE_OUTSIDE_LETTERS = ["g", "j", "p", "q", "y", "f"];

// const DEFAULT_FONT_SIZE = 90;
// /**
//  * 字母参考长度
//  */
// const WORD_LENGTH_MAP = new Map([
//   ["a", 55.6],
//   ["b", 77.37],
//   ["c", 38.21],
//   ["d", 74.54],
//   ["e", 40.32],
//   ["f", 70.42],
//   ["g", 76.39],
//   ["h", 68.89],
//   ["i", 38.29],
//   ["j", 57.9],
//   ["k", 75.29],
//   ["l", 44.61],
//   ["m", 65.66],
//   ["n", 42.53],
//   ["o", 47.33],
//   ["p", 70.79],
//   ["q", 69.34],
//   ["r", 39.05],
//   ["s", 42.6],
//   ["t", 51.9],
//   ["u", 48.83],
//   ["v", 41.32],
//   ["w", 60.24],
//   ["x", 55.9],
//   ["y", 68.74],
//   ["z", 40.82],
//   ["A", 69.77],
//   ["B", 85.99],
//   ["C", 44.22],
//   ["D", 79.05],
//   ["E", 53.95],
//   ["F", 58.69],
//   ["G", 61.49],
//   ["H", 73.09],
//   ["I", 53.31],
//   ["J", 52.14],
//   ["K", 78.93],
//   ["L", 45.19],
//   ["M", 87.58],
//   ["N", 79.28],
//   ["O", 55.91],
//   ["P", 67.9],
//   ["Q", 66.62],
//   ["R", 75.87],
//   ["S", 58.75],
//   ["T", 40.8],
//   ["U", 64.21],
//   ["V", 62.49],
//   ["W", 90.9],
//   ["X", 80.41],
//   ["Y", 62.07],
//   ["Z", 53.17],
//   ["1", 32.47],
//   ["2", 36.84],
//   ["3", 45.06],
//   ["4", 45.92],
//   ["5", 37.36],
//   ["6", 62.01],
//   ["7", 34.41],
//   ["8", 48.08],
//   ["9", 58.05],
//   ["0", 48.02],
//   ["!", 57.14],
//   ["&", 82.05],
// ]);

// /**
//  * 对应区间的灯丝长度 unit mm
//  */
// const TEXT_LENGTH_RANGE: Map<[Min, Max], Target> = new Map([
//   [[175, 195], 185],
//   [[245, 265], 255],
//   [[290, 310], 300],
//   [[360, 380], 370],
//   [[450, 470], 460],
//   [[470, 490], 460],
//   [[490, 510], 460],
// ]);

// // 基线位置相对于文本高度的比例
// const TEXT_BASELINE_AND_HEIGHT_RATIO = 1 / 4.1;

// function createDashedLine(
//   startPoint: IPoint,
//   endPoint: IPoint,
//   dashLength: number
// ) {
//   const lineLength = makerJs.measure.pointDistance(startPoint, endPoint);
//   const numSegments = Math.floor(lineLength / dashLength);
//   const dashedLine: IModel = {
//     paths: {},
//   };
//   for (let i = 0; i < numSegments; i++) {
//     const segmentStart = makerJs.point.add(
//       startPoint,
//       makerJs.point.scale(
//         makerJs.point.subtract(endPoint, startPoint),
//         i / numSegments
//       )
//     );

//     const segmentEnd = makerJs.point.add(
//       startPoint,
//       makerJs.point.scale(
//         makerJs.point.subtract(endPoint, startPoint),
//         (i + 0.5) / numSegments
//       )
//     );

//     const segment = new makerJs.paths.Line(segmentStart, segmentEnd);
//     dashedLine.paths!["dash_" + i] = segment;
//   }
//   // console.log(dashedLine.paths);
//   return dashedLine;
// }

// function createBezierCurveArc<T extends number[]>(...args: T) {
//   const [cx, cy, rx, ry] = args;
//   const k = (4 / 3) * Math.tan(Math.PI / 8);
//   const arcBezierCurve = new makerJs.models.BezierCurve(
//     [0, ry],
//     [rx * k, ry],
//     [rx, ry * k],
//     [rx, 0]
//   );

//   makerJs.model.move(arcBezierCurve, [cx, cy]);

//   return arcBezierCurve;
// }

// // 根据圆弧创建以弧心作为圆心；圆的贝塞尔曲线
// function createBezierByCircle(origin: IPoint, radius: number) {
//   const [cx, cy] = origin as number[];
//   const arc_1 = createBezierCurveArc(cx, cy, -radius, radius);
//   const arc_2 = createBezierCurveArc(cx, cy, radius, radius);
//   const arc_3 = createBezierCurveArc(cx, cy, radius, -radius);
//   const arc_4 = createBezierCurveArc(cx, cy, -radius, -radius);
//   const models: MakerJs.IModel = {
//     models: {
//       arc_1,
//       arc_2,
//       arc_3,
//       arc_4,
//     },
//   };
//   return models;
// }

// const createTextParams = (text: string) => {
//   const length = text?.split("").reduce((pre, cur) => {
//     return (pre += WORD_LENGTH_MAP!.get(cur) ?? 0);
//   }, 0);
//   let fontSize: number | undefined;
//   let target: number | undefined;
//   /**
//    * @description
//    * @link https://project.feishu.cn/sunzi/story/detail/18730032?parentUrl=%2Fworkbench
//    * // 默认字号是35px 如果不在的话 找到最接近的范围 按照范围中间值 175-195mm的范围 就取 185然后除6  当作字号
//    * 更正 默认字号是127px 如果不在的话 找到最接近的范围 按照范围中间值 175-195mm的范围 就取中位数和默认值比值作为缩放值
//    */
//   for (const range of TEXT_LENGTH_RANGE.keys()) {
//     const [min, max] = range;
//     if (length >= min && length <= max) {
//       fontSize = DEFAULT_FONT_SIZE;
//       target = TEXT_LENGTH_RANGE.get(range)!;
//       console.log(`matched range [${range}]`);
//       break;
//       // return [DEFAULT_FONT_SIZE, length];
//     }
//   }

//   if (!fontSize) {
//     const initialValue = TEXT_LENGTH_RANGE.keys().next().value as [Min, Max];
//     let closeSection = initialValue;
//     let closeDiff = initialValue[0];
//     for (const range of TEXT_LENGTH_RANGE.keys()) {
//       const [min, max] = range;
//       const cur = Math.min(Math.abs(length - min), Math.abs(length - max));

//       if (cur < closeDiff) {
//         closeSection = range;
//         closeDiff = cur;
//       }
//     }
//     const [closeMin, closeMax] = closeSection;
//     const closeValue = (closeMax + closeMin) / 2;
//     // console.log(closeValue, length);
//     fontSize = (closeValue / length) * DEFAULT_FONT_SIZE;
//     target = TEXT_LENGTH_RANGE.get(closeSection)!;
//   }

//   return [fontSize, length, target];
// };

// const textContent = "Fail";

// const createTextModel = async () => {
//   const font = await opentype.load(
//     "https://assets.sunzi.cool/preload/lamp-bulb/font/iDDV003.ttf"
//   );

//   createTextParams(textContent);
//   const textModel = new makerJs.models.Text(
//     font,
//     textContent,
//     DEFAULT_FONT_SIZE,
//     true,
//     false,
//     undefined,
//     { kerning: true }
//   );

//   return textModel;
// };

// const textModel = await createTextModel();

// const bottomModelRefer = makerJs.importer.fromSVGPathData(
//   "M0,0V21.09A2.83,2.83,0,0,1,.86,25a2.72,2.72,0,0,1-.86.86v2.48H5.67V0ZM2.83,7.8A2.13,2.13,0,1,1,5,5.67,2.13,2.13,0,0,1,2.83,7.8Z"
// );

// const measureRect: makerJs.IModel = new makerJs.models.Rectangle(269.29, 93.54);

// const { center: measureRectCenter, high: measureRectHigh } =
//   makerJs.measure.modelExtents(measureRect);

// makerJs.model.zero(measureRect);
// makerJs.model.zero(bottomModelRefer);
// makerJs.model.zero(textModel);
// const horizontalCenterPointX = measureRectCenter[0];

// const {
//   width: textWidth,
//   height: textHeight,
//   center: textCenter,
// } = makerJs.measure.modelExtents(textModel);

// // 将底座偏移到限制区域中心
// makerJs.model.moveRelative(bottomModelRefer, [horizontalCenterPointX, 0]);

// const {
//   high: measureBottomHigh,
//   width: measureBottomModelWidth,
//   height: measureBottomModelHeight,
// } = makerJs.measure.modelExtents(bottomModelRefer);

// // 字体文字基线偏移位置
// const baseLinePositionY =
//   textCenter[1] + textHeight * TEXT_BASELINE_AND_HEIGHT_RATIO;

// // 当前文本字符路径是否存在有在文字基线以下的路径
// const canBeOffset = textContent
//   .split("")
//   .some((char) => BASELINE_OUTSIDE_LETTERS.includes(char));

// // 将文字偏移至底座最高点，将底座最高点做为文字基线
// makerJs.model.moveRelative(textModel, [
//   horizontalCenterPointX - textWidth / 2,
//   canBeOffset
//     ? measureBottomModelHeight - (textHeight - baseLinePositionY)
//     : measureBottomModelHeight,
// ]);

// const bModelTopEndPointLeft = bottomModelRefer.origin!,
//   bModelTopEndPointRight = [
//     (bottomModelRefer.origin?.[0] ?? 0) + measureBottomModelWidth,
//     bottomModelRefer.origin?.[1] ?? 0,
//   ] as makerJs.IPoint;

// console.log(
//   measureRectCenter,
//   "区域中心点",
//   bModelTopEndPointLeft,
//   "底座左端点",
//   bModelTopEndPointRight,
//   "底座右端点"
// );

// const baseSupport = makerJs.model.clone(bottomModelRefer);

// const model: IModel = {
//   models: {
//     // base: baseSupport,
//     // refer: bottomModelRefer,
//     text: textModel,
//     measure: measureRect,
//     // ref_line_1: createDashedLine([0, 0], bModelTopEndPointLeft!, 5),
//     // ref_line_2: createDashedLine([0, 0], bModelTopEndPointRight!, 5),
//     ref_vertical_line: createDashedLine(
//       [horizontalCenterPointX, measureRectHigh[1]],
//       [horizontalCenterPointX, 0],
//       5
//     ),
//     ref_middle_line: createDashedLine(
//       [0, measureRectCenter[1]],
//       [measureRectHigh[0], measureRectCenter[1]],
//       5
//     ),
//     ref_top_line: createDashedLine(
//       [0, measureBottomHigh[1] + textHeight],
//       [measureRectHigh[0], measureBottomHigh[1] + textHeight],
//       5
//     ),
//     ref_bottom_line: createDashedLine(
//       [0, measureBottomHigh[1]],
//       [measureRectHigh[0], measureBottomHigh[1]],
//       5
//     ),
//     ref_textContent_middle_line: createDashedLine(
//       [0, (measureBottomHigh[1] + measureBottomHigh[1] + textHeight) / 2],
//       [
//         measureRectHigh[0],
//         (measureBottomHigh[1] + measureBottomHigh[1] + textHeight) / 2,
//       ],
//       5
//     ),
//   },
//   paths: {
//     line: new makerJs.paths.Line([0, 0], [135.4647946476269, 44.6303287453701]),
//   },
// };

// const keyPoints: KeyPoint[] = [];
// const excludePoint: MakerJs.IPoint[] = [];
// const excludeGlyphIncompletePaths: Record<string, IPoint[]> = {};
// const glyphPaths: GlyphPathsType[] = [];

// makerJs.model.addModel(model, baseSupport, "base");

// // 设置所有路径模型坐标 为同一公共坐标轴
// makerJs.model.originate(textModel);

// makerJs.model.walk(textModel, {
//   onPath(m) {
//     const refLine_1 = measureRectCenter[1];
//     const refLine_2 = measureBottomHigh[1];
//     const pick = (y: IPoint[1]) => y < refLine_1 && y >= refLine_2;

//     const excludeIncompleteGlyphPoint = (point: IPoint) => {
//       // route[1] is textModel single Glyph position index
//       if (!excludeGlyphIncompletePaths[m.route[1]]) {
//         excludeGlyphIncompletePaths[m.route[1]] = [];
//       }
//       excludeGlyphIncompletePaths[m.route[1]].push(point);
//     };

//     const createKeyPoint = (
//       model: makerJs.IWalkPath,
//       pType: KeyPoint["type"]
//     ) => {
//       const parentGlyphModel = textModel.models[m.route["1"]];

//       const node: Omit<KeyPoint, "endPoint"> = {
//         id: uuid(),
//         type: pType,
//         point: [0, 0],
//         controls: [],
//         parentGlyph: {
//           bezierCurves: [],
//           paths: [],
//         },
//       };

//       if (model.modelContext.type === "BezierCurve") {
//         const { seed } = model.modelContext as InstanceType<
//           typeof makerJs.models.BezierCurve
//         >;
//         node.point = seed[pType];
//         node.controls = seed.controls;
//       } else {
//         node.point = (model.modelContext as makerJs.IPathLine)[pType];
//       }

//       if (parentGlyphModel.models) {
//         node.parentGlyph.bezierCurves = Object.entries(
//           parentGlyphModel.models as Record<
//             string,
//             InstanceType<typeof makerJs.models.BezierCurve>
//           >
//         ).map(([pKey, model]) => {
//           const { end, origin, controls } = model.seed;
//           const controlPoint = controls.flat() as unknown as number[];

//           return {
//             name: pKey,
//             bezierCurve: new Bezier([
//               ...(origin as number[]),
//               ...controlPoint,
//               ...(end as number[]),
//             ]),
//           };
//         });
//       }

//       if (parentGlyphModel.paths) {
//         node.parentGlyph.paths = Object.entries(
//           parentGlyphModel.paths as Record<string, MakerJs.IPathLine>
//         ).map(([pKey, line]) => {
//           return {
//             name: pKey,
//             line: line,
//           };
//         });
//       }

//       return node;
//     };

//     if (m.modelContext.type === "BezierCurve") {
//       const bc = m.modelContext as InstanceType<
//         typeof makerJs.models.BezierCurve
//       >;
//       const { origin, end, controls } = bc.seed;
//       const controlPoint = controls.flat() as unknown as number[];

//       glyphPaths.push({
//         type: "BezierCurve",
//         value: new Bezier([
//           ...(origin as number[]),
//           ...controlPoint,
//           ...(end as number[]),
//         ]),
//       });

//       const p_end = createKeyPoint(m, "end");

//       const p_origin = createKeyPoint(m, "origin");

//       if (pick(end[1])) {
//         keyPoints.push({
//           ...p_end,
//           endPoint: p_origin,
//         });
//       } else if (end[1] < refLine_2) {
//         // 排除底座最高点（即文字基线位置）以下的字形坐标
//         excludeIncompleteGlyphPoint(end);
//       } else {
//         excludePoint.push(end);
//       }

//       if (pick(origin[1])) {
//         keyPoints.push({
//           ...p_origin,
//           endPoint: p_end,
//         });
//       } else if (origin[1] < refLine_2) {
//         excludeIncompleteGlyphPoint(origin);
//       } else {
//         excludePoint.push(origin);
//       }
//       // console.log(model.modelContext);
//     } else {
//       // console.log(model.modelContext.paths);
//     }
//   },
// });

// console.log(
//   "包含坐标",
//   keyPoints,
//   "参考线外坐标(不包括文字超出基线区域的坐标点)",
//   excludePoint,
//   "文字基线以下的字形坐标",
//   excludeGlyphIncompletePaths
// );

// type HorizontalRange = [IPoint[0], IPoint[0]];

// // 文字基线以上的内容路径需要过滤的路径点对应的x轴范围
// const excludeGlyphRange: HorizontalRange[] = [];

// for (const [, points] of Object.entries(excludeGlyphIncompletePaths)) {
//   let max = points[0][0],
//     min = points[0][0];
//   for (let i = 0; i < points.length; i++) {
//     const [x] = points[i] as number[];
//     if (x > max) {
//       max = x;
//     } else if (x < min) {
//       min = x;
//     }
//   }
//   excludeGlyphRange.push([min, max]);
// }

// // 文字基线以上的内容路径经过过滤的路径结果(底座插入位置目标点集合)
// const targetPoints = keyPoints.filter(
//   (p) =>
//     !excludeGlyphRange.some(
//       ([min, max]) => p.point[0] >= min && p.point[0] < max
//     )
// );

// function neighborKeyPointSort<T extends KeyPoint[] = KeyPoint[]>(arr: T): T {
//   if (arr.length <= 1) {
//     return arr;
//   }

//   const pivot = arr[arr.length - 1];
//   const pivotDistance = Math.abs(horizontalCenterPointX - pivot.point[0]);
//   const left: KeyPoint[] = [];
//   const right: KeyPoint[] = [];
//   for (let i = 0; i < arr.length - 1; i++) {
//     const p = arr[i];
//     const pointX = p.point[0];
//     const distance = Math.abs(horizontalCenterPointX - pointX);
//     // console.log(distance, pointX);
//     if (distance < pivotDistance) {
//       left.push(p);
//     } else {
//       right.push(p);
//     }
//   }
//   return [
//     ...neighborKeyPointSort(left),
//     pivot,
//     ...neighborKeyPointSort(right),
//   ] as T;
// }

// // 将坐标点根据 中间点远近进行排序
// const neighborKeyPoints = neighborKeyPointSort(targetPoints);

// console.log("排序后关键点", neighborKeyPoints);

// const isBaseSupportInsideTheTextModel = (
//   left: MakerJs.IPoint,
//   right: MakerJs.IPoint
// ) => {
//   if (left && right) {
//     return (
//       makerJs.measure.isPointInsideModel(left, textModel) &&
//       makerJs.measure.isPointInsideModel(right, textModel)
//     );
//   }
//   return false;
// };

// // console.log(neighborKeyPoints);
// // 根据规则查找底座路径插入的最适合坐标点
// const insertBaseSupportInvoker = (points: KeyPoint[]) => {
//   let index = 0;
//   const invoke = (position = 0): unknown => {
//     const p = points[position];
//     if (!p) {
//       throw new Error("There is not point, Didn't find the right point");
//     }
//     // console.log(p, "当前关键点");
//     const [pointX, pointY] = p.point as number[];
//     makerJs.model.move(baseSupport, bModelTopEndPointLeft);

//     const horizontalDistance = pointX - bModelTopEndPointLeft[0];
//     const verticalDistance = pointY - measureBottomHigh[1];

//     makerJs.model.moveRelative(baseSupport, [
//       horizontalDistance,
//       verticalDistance,
//     ]);

//     // // 当前底座位置对应的圆弧弧心的距离作为底座插入文字路径的垂直安全距离
//     for (let i = 1; i < Math.trunc(measureBottomModelWidth) * 2; i++) {
//       const curOrigin = makerJs.model.moveRelative(baseSupport, [-0.5, 0])
//         .origin!;
//       const [x, y] = curOrigin as number[];

//       if (
//         isBaseSupportInsideTheTextModel(curOrigin, [
//           x + measureBottomModelWidth,
//           y,
//         ])
//       ) {
//         break;
//       }
//     }

//     const endPointLeft = baseSupport.origin! as number[];
//     const endPointRight = [
//       endPointLeft[0] + measureBottomModelWidth,
//       endPointLeft[1],
//     ];

//     // [p_8]为底座中绘制圆环圆弧
//     const arc = baseSupport.paths?.["p_8"] as makerJs.IPathArc;
//     const arcRelativeOrigin = makerJs.point.add(endPointLeft, arc.origin);
//     const measureCircle = createBezierByCircle(arcRelativeOrigin, arc.radius);

//     makerJs.model.originate(measureCircle);

//     if (makerJs.measure.isPointInsideModel(arcRelativeOrigin, textModel)) {
//       index++;
//       return invoke(index);
//     }

//     for (const [, { seed }] of Object.entries(
//       measureCircle.models as Record<
//         string,
//         InstanceType<typeof makerJs.models.BezierCurve>
//       >
//     )) {
//       const { origin, end, controls } = seed;
//       const controlPoint = controls.flat() as unknown as number[];
//       const qtrArc = new Bezier([
//         ...(origin as number[]),
//         ...controlPoint,
//         ...(end as number[]),
//       ]);
//       for (const { bezierCurve } of p.parentGlyph.bezierCurves) {
//         if (bezierCurve.intersects(qtrArc).length > 0) {
//           index++;
//           return invoke(index);
//         }
//       }
//     }

//     if (!isBaseSupportInsideTheTextModel(endPointLeft, endPointRight)) {
//       index++;
//       return invoke(index);
//     }

//     console.log(p, index);
//   };

//   return invoke(index);
//   // console.log(index);
// };

// insertBaseSupportInvoker(neighborKeyPoints);

// console.log(textModel);
// console.log(glyphPaths);
// makerJs.model.combineSubtraction(baseSupport, textModel);]
type TextModelParams = ConstructorParameters<typeof makerJs.models.Text>;

const custom = {
  text1: "MAHLEAH",
  text2: "D",
  text3: "DlafdJff",
};

const guitarPathData =
  "M34.31,102a23.62,23.62,0,0,1-14.5-5.37,106.39,106.39,0,0,0-17.64,4.84.5.5,0,0,1-.36-.93,108.38,108.38,0,0,1,17-4.74,20.55,20.55,0,0,1-6.38-9.24c-2-7.21,5.23-11.68,10.88-14.41a9.63,9.63,0,0,0,5.94-8.92,27.05,27.05,0,0,1,1.44-7.08c.59-1.92,2.25-4,3.59-3.79.43.06,1.15.39,1.18,1.93.15,6.25,1.08,7.09,1.47,7.16,0,0,1.8,0,3.39-2.95L60.08,25.39a.66.66,0,0,0,.08-.53,1,1,0,0,0-.53-.61l-2-1.1a.65.65,0,0,1-.33-.55.69.69,0,0,1,.31-.57c3.9-2.43,5.62-5.92,5.56-11.32a.65.65,0,0,1,.27-.53.66.66,0,0,1,.58-.1l1.87.59a34.13,34.13,0,0,1,10.68,5.57.66.66,0,0,1-.07,1.1c-4.89,2.76-7.24,6.12-7.4,10.59a.66.66,0,0,1-.34.55.64.64,0,0,1-.64,0L66,27.2a.78.78,0,0,0-.58-.08.74.74,0,0,0-.47.36L46.24,61.1c-1.52,2.37-4.93,9-2.72,11.68.26.3,1.45.69,6.94-2.31,1.52-.83,2.16-.18,2.36.13.7,1.07-.19,3.22-1.86,4.51-.23.18-.51.38-.82.6-2.87,2.08-8.21,6-5.93,12.75.13.38.26.76.41,1.14a17,17,0,0,0,13.61,10.46,18,18,0,0,0,2.7.15c10.32-.3,16.37-2.25,19.93-4.44a15.17,15.17,0,0,1-1.46-1.46c-1.37-1.33-2-2.69-1.73-3.69a1.43,1.43,0,0,1,1.11-1,3.61,3.61,0,0,1,3.09,1.33,4.14,4.14,0,0,1,3.26-1.79,1.35,1.35,0,0,1,1.12.84c.35.9-.15,2.22-1.41,3.72a13,13,0,0,1-2.33,2.15,19.91,19.91,0,0,0,5.88,3.26c.07,0,8.85,2.63,23.19,1.07a.49.49,0,0,1,.55.44.5.5,0,0,1-.44.55c-14.57,1.58-23.52-1.09-23.61-1.12a21.14,21.14,0,0,1-6.43-3.6c-4.48,2.86-11.51,4.49-20.69,4.75a18.9,18.9,0,0,1-2.87-.16A18,18,0,0,1,43.7,90c-.15-.39-.3-.79-.43-1.19C40.76,81.28,46.7,77,49.56,74.91c.3-.22.57-.41.8-.59,1.45-1.11,1.93-2.73,1.63-3.18-.11-.16-.53-.08-1.06.2-4.76,2.61-7.2,3.23-8.17,2.07C39.63,69.67,45.15,61,45.39,60.59L64.11,27a1.75,1.75,0,0,1,1.08-.84,1.73,1.73,0,0,1,1.35.19l1.62,1c.34-4.42,2.71-7.81,7.43-10.59a32.53,32.53,0,0,0-10-5.12l-1.42-.44c0,5.3-1.77,8.85-5.55,11.39l1.47.82a2,2,0,0,1,1,1.22,1.66,1.66,0,0,1-.19,1.3l-19.75,33c-1.9,3.56-4.26,3.44-4.37,3.44-1.53-.26-2.21-2.69-2.34-8.12,0-.56-.14-.94-.32-1-.52-.09-1.92,1.16-2.52,3.12a27.09,27.09,0,0,0-1.39,6.82A10.65,10.65,0,0,1,23.74,73c-5.33,2.58-12.19,6.76-10.36,13.25.86,3,3.27,6.49,6.67,9.29a61.88,61.88,0,0,1,7.66-.85c7.69-.33,14.89,1.63,15.11,4.1.13,1.45-1.85,2.46-5.88,3A21.24,21.24,0,0,1,34.31,102Zm-13.2-5.59a21.74,21.74,0,0,0,15.7,4.43c4-.54,5.06-1.46,5-1.92-.11-1.3-5.69-3.55-14.08-3.2A57.72,57.72,0,0,0,21.11,96.36Zm58.08-5.81a.65.65,0,0,0-.2,0,.44.44,0,0,0-.36.33c-.14.46.18,1.46,1.49,2.74a17.89,17.89,0,0,0,1.6,1.56,12.32,12.32,0,0,0,2.36-2.14c1.16-1.39,1.4-2.33,1.25-2.71a.33.33,0,0,0-.32-.22c-.6-.08-1.7.47-2.7,1.85a.49.49,0,0,1-.38.21.51.51,0,0,1-.4-.17A3.57,3.57,0,0,0,79.19,90.55ZM68.13,27.89Z";

const GUITAR_LINE_TEXT_POSITION: IPoint = [52, 19];

// 刻字区域最大宽度
const CARVED_MAX_WIDTH = 41;
// 刻字区域最大高度
const CARVED_MAX_HEIGHT = 7.5;
// scale ratio step
const SCALE_RATIO_STEP = 0.01;

// 吉他刀板刻字最大宽度
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

// 拨片刀版
const pickKnife = makerJs.importer.fromSVGPathData(
  "M39.48,69.29a4.35,4.35,0,0,1-6.72,0C20.46,54.13-22.84-.83,36.41,0,93.89.82,52.24,53.93,39.48,69.29Z"
);

const guitarKnife = makerJs.importer.fromSVGPathData(guitarPathData);

// 碰撞区域矩形
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

let guitarLineTextModel = new makerJs.models.Text(
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
// 缩放因子
let scale = 1;
// 缩放次数
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

  lineTextModel = lineTextContent.models!["lineTextModel"] =
    makerJs.model.distort(lineTextModel, scale, scale);
  targetMeasureRect = makerJs.measure.modelExtents(lineTextModel);
  // console.log(targetMeasureRect);
  makerJs.model.moveRelative(lineTextModel, [
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
    // console.warn("未超出");
    break;
  } else if (!overflowTop) {
    // console.warn("上方超出");
    makerJs.model.moveRelative(lineTextModel, [0, -Math.abs(high[1])]);
  } else if (!overflowBottom) {
    // console.warn("下方超出");
    makerJs.model.moveRelative(lineTextModel, [0, Math.abs(low[1])]);
  } else {
    // console.warn("上下都超出");
    continue;
  }
  // 偏移完后重新测量
  targetMeasureRect = makerJs.measure.modelExtents(lineTextModel);
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

let guitarLineTextModelScale = 1;

makerJs.model.addModel(guitarKnife, guitarLineTextModel, "guitarLineTextModel");

while (
  makerJs.measure.modelExtents(guitarLineTextModel).width > MAX_LINE_TEXT_WIDTH
) {
  guitarLineTextModelScale = Number((scale - SCALE_RATIO_STEP).toFixed(2));
  guitarLineTextModel = guitarKnife.models!["guitarLineTextModel"] =
    makerJs.model.scale(guitarLineTextModel, guitarLineTextModelScale, false);
}
makerJs.model.zero(guitarLineTextModel);
makerJs.model.move(guitarLineTextModel, GUITAR_LINE_TEXT_POSITION);

makerJs.model.moveRelative(guitarKnife, [60, 0]);

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
const svg = makerJs.exporter.toSVG(guitarKnife, {
  viewBox: true,
  useSvgPathOnly: true,
  fill: "none",
  stroke: "#000",
  strokeWidth: "0.14px",
  scale: 1,
  cssStyle: "none",
  svgAttrs: {
    width: "100%",
    height: "100%",
  },
  scalingStroke: true,
});

const svg2 = makerJs.exporter.toSVG(pickKnife, {
  viewBox: true,
  useSvgPathOnly: true,
  fill: "none",
  stroke: "#000",
  strokeWidth: "0.14px",
});

console.log(svg);
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
