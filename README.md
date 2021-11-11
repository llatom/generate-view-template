<h1 align="center">generate-view-template </h1>

> 根据模板生成页面结构


## npx

```sh
npx generate-view-template pages
```
or
```sh
npx gvt pages
```
## 自动生成模版工具
generate pages, components, etc. make sure styling done consistent

---
### 1. 简介
使用node脚本完成模版代码自动生成并插入到相应文件目录中的工具
- v1.0 版本支持生成 Page页面组件、Component组件、PageComponent页面子组件

### 2. 使用
#### 2.1 生成 Page页面组件
```Shell
npm run init PageA

or

npm run init
请输入要生成的页面组件名称
> PageA
```

#### 2.2 生成 Component组件
```Shell
npm run init c ComponentA

or

npm run init c
请输入要生成的组件名称
> ComponentA
```

#### 2.3 生成 PageComponent页面子组件
```Shell
npm run init c PageA/ComponentA

or

npm run init c
请输入要生成的组件名称
> PageA/ComponentA
```

#### 2.4 命令模式支持连写
> 命令模式支持连写 可同时生成多个Page、Component、PageComponent  
> 不过 Page 和 Component 不可同时生成，Component 和 PageComponent 可同时生成

```Shell
npm run init PageA PageB
```
同时生成两个页面 pages/PageA 和 pages/PageB

```Shell
npm run init c ComponentA PageA/ComponentA
```
同时生成 components/ComponentA 和 pages/PageA/components/ComponentA

```Shell
npm run init PageA ComponentA
```
只会生成两个页面 pages/PageA 和 pages/ComponentA
