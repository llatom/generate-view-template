const path = require('path');
const fs = require('fs');
const resolve = (...file) => path.resolve(__dirname, ...file);

const log = msg => console.log('\x1b[34m' + msg + '\033[0m');
const noteLog = msg => console.log('\x1b[37m\x1b[2m' + msg + '\033[0m');
const successLog = msg => console.log('\x1b[32m' + msg + '\033[0m');
const errorLog = msg => console.log('\x1b[31m' + msg + '\033[0m');

// 获取模版字符串
const getTemplate = (path, componentName, componentNameLowerCase, cssType) => {
  let fsData = fs.readFileSync(resolve(path), 'utf8');
  componentName && (fsData = fsData.replace(/Template/g, componentName));
  componentNameLowerCase &&
    (fsData = fsData.replace(/template/g, componentNameLowerCase));
  cssType && (fsData = fsData.replace(/\{cssType\}/g, cssType));
  return fsData;
};

// 生成文件
const generateFile = (path, data) => {
  if (fs.existsSync(path)) {
    errorLog(`${path}文件已存在`);
    return;
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', err => {
      if (err) {
        errorLog(err.message);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
const dotExistDirectoryCreate = directory => {
  return new Promise(resolve => {
    mkdirs(directory, function() {
      resolve(true);
    });
  });
};
// 递归创建目录
const mkdirs = (directory, callback) => {
  var exists = fs.existsSync(directory);
  if (exists) {
    callback();
  } else {
    mkdirs(path.dirname(directory), function() {
      fs.mkdirSync(directory);
      callback();
    });
  }
};

module.exports = {
  fs,
  resolve,
  log,
  noteLog,
  successLog,
  errorLog,
  getTemplate,
  generateFile,
  dotExistDirectoryCreate,
};
