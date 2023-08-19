import axios from "axios";
import { exec } from "child_process";
import util from "util";
import { warpLoading } from "./loading.js";
import { rm } from "fs/promises";
import { defaultConfig } from "../constant.js";
import { getAllConfig } from "../commands/config.js";
const execPromisified = util.promisify(exec);

const { organization, accessToken } = getAllConfig().config;
export async function getOrgantionProjects() {
  const res = await axios.get(
    `https://gitee.com/api/v5/orgs/${organization}/repos`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data.map((item) => item.name);
}

export async function getProjectVersions(repo: string) {
  const res = await axios.get(
    `https://gitee.com/api/v5/repos/${organization}/${repo}/tags`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data.map((item) => item.name);
}

export function cloneAndCheckoutTag(tag, projectName, repo) {
  const cmd = `git clone --branch ${tag} --depth 1 https://gitee.com/${organization}/${projectName}.git ${repo}`;

  return warpLoading("create project", async () => {
    await execPromisified(cmd);
    return rm(`${repo}/.git`, { recursive: true });
  });
}
