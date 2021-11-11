const {
  fs,
  resolve,
  log,
  successLog,
  errorLog,
  getTemplate,
  generateFile,
  dotExistDirectoryCreate,
} = require('./initUtils');
const { pagePath, cssType } = require('./initConfig');

let componentName = '';
let componentNameLowerCase = '';
const initMain = async (chunk, callSelf, isLast = true) => {
  // 组件名称
  const inputName = String(chunk)
    .trim()
    .toString();
  const inputNameCapitalize = inputName.replace(/( |^)[a-z]/g, L =>
    L.toUpperCase()
  );
  const inputNameLowerCase = inputName.replace(/( |^)[a-z]/gi, L =>
    L.toLowerCase()
  );
  // 获取组件名
  componentName = inputNameCapitalize;
  componentNameLowerCase = inputNameLowerCase;
  if (inputName.includes('/')) {
    errorLog(`\n暂不支持二级目录，请重新输入`);
    callSelf && process.stdin.on('data', initMain);
    return;
  }
  // 页面组件路径
  const componentPath = resolve(pagePath, componentName);
  // 页面主文件
  const jsxFile = resolve(componentPath, `${componentName}.js`);
  // 样式文件
  const styleFile = resolve(
    componentPath,
    `${componentNameLowerCase}.${cssType}`
  );
  // 入口文件
  const entryFile = resolve(componentPath, 'index.js');

  // 判断组件文件夹是否存在
  const hasComponentExists = fs.existsSync(componentPath);
  if (hasComponentExists) {
    errorLog(`\n${componentName} 页面组件已存在，请重新输入`);
    callSelf && process.stdin.on('data', initMain);
    return;
  } else {
    log(`\n开始生成组件 ${componentName}\n`);
    log(`正在生成组件文件夹\t\t${componentPath}`);
    await dotExistDirectoryCreate(componentPath);
  }
  try {
    const mainTemplate = getTemplate(
      './Template.js',
      componentName,
      componentNameLowerCase,
      cssType
    );
    const styleTemplate = getTemplate('./templateStyle', componentName);
    const indexTemplate = getTemplate('./templateIndex.js', componentName);

    log(`正在生成 js\t文件\t\t${jsxFile}`);
    await generateFile(jsxFile, mainTemplate);
    log(`正在生成 ${cssType}\t文件\t\t${styleFile}`);
    await generateFile(styleFile, styleTemplate);
    log(`正在生成 index\t文件\t\t${entryFile}`);
    await generateFile(entryFile, indexTemplate);

    successLog('\n生成成功');
  } catch (e) {
    errorLog(e.message);
  }

  isLast && process.exit();
};

module.exports = async (args, isLast = true) => {
  if (!!args) {
    await initMain(args, true, isLast);
  } else {
    log('请输入要生成的页面组件名称，会生成在 pages/ 目录下');
    process.stdin.on('data', initMain);
  }
};
