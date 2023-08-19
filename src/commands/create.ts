import path from "path";
import { existsSync, rmSync } from "fs";
import inquirer from "inquirer";
import { warpLoading } from "../utils/loading.js";
import {
  cloneAndCheckoutTag,
  getOrgantionProjects,
  getProjectVersions,
} from "../utils/project.js";
export default async function (name, option) {
  const cwd = process.cwd(); // 获取当前项目的工作目录
  const targetDir = path.join(cwd, name);
  if (existsSync(targetDir)) {
    if (option.force) {
      rmSync(targetDir, { recursive: true }); // 递归删除目录内容
    } else {
      // 询问用户 是否要删除呢
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "目标目录已存在，是否继续？",
          choices: [
            { name: "overwrite", value: "overwrite" },
            { name: "cancel", value: false },
          ],
        },
      ]);
      if (!action) {
        return console.log("用户取消创建");
      }
      if (action === "overwrite") {
        await warpLoading("remove", () => {
          rmSync(targetDir, { recursive: true });
        });
      }
    }
  }
  // 获取项目残酷 拉取对应的项目
  let projects = await getOrgantionProjects();
  let { projectName } = await inquirer.prompt([
    {
      name: "projectName",
      type: "list",
      message: "请选择项目列表",
      choices: projects,
    },
  ]);
  let tags = await getProjectVersions(projectName);
  let { tag } = await inquirer.prompt([
    {
      name: "tag",
      type: "list",
      message: "请选择对应的版本",
      choices: tags,
    },
  ]);
  // 获取项目了，下载到本地
  // 方案1 找zip包的下载地址 git clone

  // 用户输入选择

  await cloneAndCheckoutTag(tag, projectName, name);
}
