export const defaultConfig = {
    // 用户可以通过命令行来配置
    organization: "oschina_57",
    accessToken: "5a557a6565536a59fcdce108e7211956",
};
export const configPath = `${process.env[process.platform === "darwin" ? "HOME" : "USERPROFILE"]}/.hcrc`;
