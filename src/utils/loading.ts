import ora from "ora";
export const warpLoading = async (message, fn) => {
  const spinner = ora(message);
  spinner.start();
  const result = await fn(); // aop 将用户的逻辑包裹loading效果
  spinner.succeed();
  return result;
};
