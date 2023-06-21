// 这是storybook的配置文件，loader、entry file等都会在此进行配置
const path = require("path");

module.exports = {
  // storybook文档的目标文件
  stories: [
    '../stories/*.stories.mdx',
    '../stories/*.stories.@(js|jsx|ts|tsx)',
  ],
  // 插件依赖，后面我们会使用
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-docs'
  ],
  webpackFinal: async (config) => {



    // config.module.rules.push({
    //   test: /\.less$/,
    //   use: ["style-loader", "css-loader", "less-loader"],
    //   include: path.resolve(__dirname, "../")
    // });

    // 成功了
    config.module.rules.push(
      {
        test: /\.less$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: true,
              importLoaders: 1,
              // localIdentName: '[name]__[local]___[hash:base64:5]'
            },
          },
          require.resolve('less-loader')
        ]
      },
    );

    // config.module.rules.push({
    //   test: /\.(ts|tsx)$/,
    //   loader: require.resolve("babel-loader"),
    //   options: {
    //     presets: [["react-app", { flow: false, typescript: true }]]
    //   }
    // });
    config.resolve.extensions.push(".ts", ".tsx");

    return config;
  }
};
