import { extend } from "umi-request";

const request = extend({
  timeout: 60 * 1000,
});

const HOST = "https://ai-svg.maiyuan.online";

/**
 * 将svg转dxf
 * @param {object} params 转换配置，这里是通过调用接口转换，url不能是本地链接
 * @returns dxf
 */
const svg2dxf = async (url: string, uniqueCode: string) => {
  // 添加svg转dxf任务 @link http://iddapi.maiyuan.online/project/117/interface/api/9842
  const {
    response: { taskId },
  } = await request(`${HOST}/api/svg/addTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      svgUrl: [{ url, uniqueCode }],
      version: 2,
    },
  });

  // 通过任务ID（taskId）获取转换结果
  // eslint-disable-next-line no-async-promise-executor
  const dxfURL = await new Promise(async (resolve, reject) => {
    let retry = 0;

    const getTaskResult = async () => {
      // @link http://iddapi.maiyuan.online/project/117/interface/api/9849
      const {
        response: { succ, taskState, err },
      } = await request.get(`${HOST}/api/svg/taskState?taskId=${taskId}`);

      switch (taskState as number) {
        // 处理完成
        case 1:
          resolve(succ[0].resultSvgSavePath);
          break;
        // 处理失败或异常
        case 2:
        case 3: {
          reject(err);
          break;
        }
        // 其他情况都是处理中
        default: {
          retry++;
          // 轮询10次还是没有返回结果直接抛出错误
          if (retry >= 10)
            reject(
              "The result of requrest has exceeded the maxinum number of retries"
            );
          // 每3秒轮询一次
          setTimeout(getTaskResult, 3000);
          break;
        }
      }
    };

    getTaskResult();
  });

  return dxfURL;
};

export default svg2dxf;
