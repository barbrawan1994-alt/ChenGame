const fs = require('fs');
const path = require('path');
const vm = require('vm');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '../..');
function createLoader(globals = {}) {
 const cache = new Map();
 return function load(relativePath) {
  const requested = path.resolve(root, relativePath);
  const filename = [requested, `${requested}.js`, path.join(requested, 'index.js')]
    .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!filename) throw new Error(`Cannot resolve ${relativePath}`);
  if (cache.has(filename)) return cache.get(filename).exports;
  const source = fs.readFileSync(filename, 'utf8');
  const code = babel.transformSync(source, {
    filename, presets: [[require.resolve('@babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }]],
    babelrc: false, configFile: false,
  }).code;
  const module = { exports: {} };
  cache.set(filename, module);
  vm.runInNewContext(code, { module, exports: module.exports, console, Date, Math, Set, Map, Number, Object, Array, ...globals,
    require: specifier => specifier.startsWith('.') ? load(path.resolve(path.dirname(filename), specifier)) : require(specifier),
  }, { filename });
  return module.exports;
 };
}
const load = createLoader();

let appFunctions;
function appFunctionSource(name) {
  if (!appFunctions) {
    appFunctions = new Map();
    const source = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
    const ast = babel.parseSync(source, { sourceType: 'module', parserOpts: { plugins: ['jsx'] }, babelrc: false, configFile: false });
    babel.traverse(ast, {
      VariableDeclarator(p) {
        const { node } = p;
        const owner = p.getFunctionParent();
        if (owner && owner.node.id?.name !== 'RPG') return;
        if (node.id.type === 'Identifier' && ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.init?.type)) {
          appFunctions.set(node.id.name, source.slice(node.init.start, node.init.end));
        }
      },
      FunctionDeclaration(p) {
        const { node } = p;
        const owner = p.getFunctionParent();
        if (owner && owner.node.id?.name !== 'RPG') return;
        if (node.id) appFunctions.set(node.id.name, source.slice(node.start, node.end));
      },
    });
  }
  if (!appFunctions.has(name)) throw new Error(`Unknown App function ${name}`);
  return appFunctions.get(name);
}

function loadAppImports(loader = load) {
  const values = {};
  const files = ['src/App.js', ...fs.readdirSync(path.join(root, 'src/components/screens')).filter(name => name.endsWith('.js')).map(name => `src/components/screens/${name}`)];
  for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const ast = babel.parseSync(source, { sourceType: 'module', parserOpts: { plugins: ['jsx'] }, babelrc: false, configFile: false });
  for (const node of ast.program.body) {
    if (node.type !== 'ImportDeclaration' || !/^(?:\.\.\/|\.\/)+(data|utils)(\/|$)/.test(node.source.value)) continue;
    const exports = loader(path.resolve(root, path.dirname(file), node.source.value));
    for (const specifier of node.specifiers) {
      if (Object.hasOwn(values, specifier.local.name)) continue;
      values[specifier.local.name] = specifier.type === 'ImportDefaultSpecifier' ? exports.default : specifier.type === 'ImportNamespaceSpecifier' ? exports : exports[specifier.imported.name];
    }
  }
  }
  return values;
}

function bindAppDependencyTree(names, globals = {}) {
  const pending = [...names];
  const sources = new Map();
  const missing = new Set();
  const native = new Set(['Math', 'Date', 'Object', 'Array', 'Number', 'String', 'Boolean', 'Set', 'Map', 'JSON', 'Promise', 'Infinity', 'undefined', 'console']);
  while (pending.length) {
    const name = pending.pop();
    if (sources.has(name) || name in globals || native.has(name)) continue;
    let source;
    try { source = appFunctionSource(name); } catch { missing.add(name); continue; }
    sources.set(name, source);
    const ast = babel.parseSync(`const action = ${source};`, { babelrc: false, configFile: false });
    babel.traverse(ast, { ReferencedIdentifier(p) { if (!p.scope.hasBinding(p.node.name)) pending.push(p.node.name); } });
  }
  if (missing.size) throw new Error(`Missing App globals: ${[...missing].join(', ')}`);
  return bindAppFunctions([...sources.keys()], globals);
}

function bindAppFunctions(names, globals = {}) {
  const context = vm.createContext({ console, Date, Math, Set, Map, structuredClone, ...globals });
  vm.runInContext(names.map(name => `var ${name} = ${appFunctionSource(name)};`).join('\n'), context);
  return context;
}

function seededRandom(seed) {
  return () => {
    let value = seed += 0x6D2B79F5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

module.exports = { root, load, createLoader, loadAppImports, appFunctionSource, bindAppFunctions, bindAppDependencyTree, seededRandom };
