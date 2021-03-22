module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: "https://api.foodics.dev/v5"
  }
};
