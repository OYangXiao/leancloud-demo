var path = require('path')

//配置文件是放在config的目录下的，所有这里定义了一个项目的根目录变量
var projectRootPath = path.resolve(__dirname) 

var config = {
  entry: path.resolve(projectRootPath,'src/main.jsx'),
  output:{
    path: '/js/',
    filename: 'bundle.js',
    publicPath: '/js/'
  },
  module:{
    loaders:[
      {
        test:/\.jsx$/,
        exclude:/node_modules/,
        loader:'babel-loader',
        query:{
          presets:['react','es2015','stage-1']
        }
      }
    ]
  },
  devtool:'eval-source-map'
}

module.exports=config;
