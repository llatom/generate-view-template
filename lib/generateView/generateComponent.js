const {
  fs,
  resolve,
  log,
  noteLog,
  successLog,
  errorLog,
  getTemplate,
  generateFile,
  dotExistDirectoryCreate,
} = require('./initUtils');
const {
  pagePath,
  componentPath: oriComponentPath,
  cssType,
} = require('./initConfig');

let wrapName = '';
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

  // 容器路径
  let wrapPath = resolve(oriComponentPath);
  let componentWrapPath = '';
  // 页面组件路径
  let componentPath = resolve(wrapPath, inputNameCapitalize);
  // log(`componentPath:\t\t\t${componentPath}`)
  if (inputName.includes('/')) {
    const inputArr = inputName.split('/');
    if (inputArr.length > 2) {
      errorLog(`\n暂不支持三级目录，请重新输入`);
      callSelf && process.stdin.on('data', initMain);
      return;
    }
    wrapName = inputArr[0].replace(/( |^)[a-z]/g, L => L.toUpperCase());
    componentName = inputArr[1].replace(/( |^)[a-z]/g, L => L.toUpperCase());
    componentNameLowerCase = inputArr[1].replace(/( |^)[a-z]/g, L =>
      L.toLowerCase()
    );

    wrapPath = resolve(pagePath, wrapName);

    let hasWrapExists = fs.existsSync(wrapPath);
    if (!hasWrapExists) {
      errorLog(`\n/pages/${wrapName} 页面组件不存在，请重新输入`);
      callSelf && process.stdin.on('data', initMain);
      return;
    }

    componentWrapPath = resolve(wrapPath, 'components');
    let hasComponentWrapExists = fs.existsSync(componentWrapPath);
    if (!hasComponentWrapExists) {
      log(`\n生成 ${wrapName}/components 文件夹\t${componentWrapPath}`);
      await dotExistDirectoryCreate(componentWrapPath);
    }

    componentPath = resolve(componentWrapPath, componentName);
    // log(`wrapName:\t\t\t${wrapName}`)
    // log(`componentName:\t\t\t${componentName}`)
    // log(`componentNameLowerCase:\t\t${componentNameLowerCase}`)
    // log(`wrapPath:\t\t\t${wrapPath}`)
    // log(`hasWrapExists:\t\t\t${hasWrapExists}`)
    // log(`componentWrapPath:\t\t${componentWrapPath}`)
    // log(`componentPath:\t\t\t${componentPath}`)
  } else {
    // 判断容器文件夹是否存在
    const hasWrapExists = fs.existsSync(wrapPath);
    if (!hasWrapExists) {
      log(`\n生成 components 文件夹\t\t${wrapPath}`);
      await dotExistDirectoryCreate(wrapPath);
    }
  }

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
    errorLog(
      `\n${
        wrapName == '' ? '' : wrapName + '/'
      }${componentName} 组件已存在，请重新输入`
    );
    callSelf && process.stdin.on('data', initMain);
    return;
  } else {
    successLog(`\n开始生成组件 ${componentName}\n`);
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
    noteLog(`
      ------------------- Note -------------------
      1.默认输出在 src/components 文件夹中

      2.支持二级目录 如:
        输入：Test/TestCard1
        输出：pages/Test/components/TestCard1/...
    `);
    log('请输入要生成的组件名称，会生成在 components/ 目录下');
    process.stdin.on('data', initMain);
  }
};
