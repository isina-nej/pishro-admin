// scripts/apply-translations.js
// npm i @babel/parser @babel/traverse @babel/generator glob
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

const root = path.resolve(process.cwd());
const mappingFile = path.join(root, "scripts", "fa.json");
if (!fs.existsSync(mappingFile)) {
  console.error("No fa.json found in scripts/. Create translations first.");
  process.exit(1);
}
const map = JSON.parse(fs.readFileSync(mappingFile, "utf8"));

const patterns = [
  "app/**/*.tsx",
  "app/**/*.ts",
  "components/**/*.tsx",
  "components/**/*.ts",
  "pages/**/*.tsx",
  "pages/**/*.ts",
  "src/**/*.tsx",
  "src/**/*.ts",
];

function translateIfExists(str) {
  const key = str.replace(/\s+/g, " ").trim();
  if (map.hasOwnProperty(key)) return map[key];
  return null;
}

function processFile(file) {
  let code = fs.readFileSync(file, "utf8");
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx", "decorators-legacy", "classProperties"],
    });
  } catch (e) {
    console.warn("Parse failed:", file, e.message);
    return;
  }

  let modified = false;

  traverse(ast, {
    JSXText(path) {
      const raw = path.node.value;
      const key = raw.replace(/\s+/g, " ").trim();
      const tr = translateIfExists(key);
      if (tr) {
        path.node.value = raw.replace(key, tr);
        modified = true;
      }
    },
    JSXAttribute(path) {
      const val = path.node.value;
      if (!val) return;
      if (val.type === "StringLiteral") {
        const key = val.value.replace(/\s+/g, " ").trim();
        const tr = translateIfExists(key);
        if (tr) {
          val.value = val.value.replace(key, tr);
          modified = true;
        }
      } else if (
        val.type === "JSXExpressionContainer" &&
        val.expression.type === "TemplateLiteral"
      ) {
        const tpl = val.expression;
        if (tpl.expressions.length === 0) {
          const raw = tpl.quasis.map((q) => q.value.cooked).join("");
          const key = raw.replace(/\s+/g, " ").trim();
          const tr = translateIfExists(key);
          if (tr) {
            tpl.quasis[0].value.cooked = tpl.quasis[0].value.cooked.replace(
              key,
              tr,
            );
            tpl.quasis[0].value.raw = tpl.quasis[0].value.raw.replace(key, tr);
            modified = true;
          }
        }
      }
    },
    TemplateLiteral(path) {
      if (path.node.expressions.length === 0) {
        const raw = path.node.quasis.map((q) => q.value.cooked).join("");
        const key = raw.replace(/\s+/g, " ").trim();
        const tr = translateIfExists(key);
        if (tr) {
          path.node.quasis[0].value.cooked =
            path.node.quasis[0].value.cooked.replace(key, tr);
          path.node.quasis[0].value.raw = path.node.quasis[0].value.raw.replace(
            key,
            tr,
          );
          modified = true;
        }
      }
    },
  });

  if (modified) {
    const output = generate(ast, { retainLines: true }).code;
    fs.writeFileSync(file, output, "utf8");
    console.log("✅ Translated file:", file);
  }
}

(async () => {
  for (const pattern of patterns) {
    const files = glob.sync(pattern, { nodir: true });
    for (const f of files) {
      try {
        processFile(path.join(root, f));
      } catch (e) {
        console.error("Error file:", f, e);
      }
    }
  }
  console.log(
    "🎉 Done applying translations. Review changes and run your app.",
  );
})();
