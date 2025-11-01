// scripts/extract-texts.js
// npm i @babel/parser @babel/traverse glob
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const root = path.resolve(process.cwd());
const outFile = path.join(root, "scripts", "strings-to-translate.json");
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

const texts = new Set();

function isReallyText(s) {
  if (!s) return false;
  const trimmed = s.replace(/\s+/g, " ").trim();
  if (!trimmed) return false;
  // فیلترهای اولیه: عدد، short keys, urls, ایمیل، کلاس‌ها و import pathها رو حذف کن
  if (/^[\d\W]+$/.test(trimmed)) return false;
  if (
    /^[\w-]{1,40}(\.[\w-]{1,10})?$/.test(trimmed) &&
    trimmed.toLowerCase() === trimmed
  )
    return false;
  if (/^https?:\/\//.test(trimmed)) return false;
  if (trimmed.length > 500) return false;
  return true;
}

function extractFromFile(file) {
  const code = fs.readFileSync(file, "utf8");
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

  traverse(ast, {
    JSXText({ node }) {
      const value = node.value;
      if (isReallyText(value)) texts.add(value.replace(/\s+/g, " ").trim());
    },
    JSXAttribute(path) {
      const val = path.node.value;
      if (!val) return;
      if (val.type === "StringLiteral") {
        const value = val.value;
        if (isReallyText(value)) texts.add(value.replace(/\s+/g, " ").trim());
      } else if (
        val.type === "JSXExpressionContainer" &&
        val.expression.type === "TemplateLiteral"
      ) {
        const tpl = val.expression;
        if (tpl.expressions.length === 0) {
          const raw = tpl.quasis.map((q) => q.value.cooked).join("");
          if (isReallyText(raw)) texts.add(raw.replace(/\s+/g, " ").trim());
        }
      }
    },
    TemplateLiteral({ node }) {
      if (node.expressions.length === 0) {
        const raw = node.quasis.map((q) => q.value.cooked).join("");
        if (isReallyText(raw)) texts.add(raw.replace(/\s+/g, " ").trim());
      }
    },
  });
}

(async () => {
  for (const pattern of patterns) {
    const files = glob.sync(pattern, { nodir: true });
    for (const f of files) {
      try {
        extractFromFile(path.join(root, f));
      } catch (e) {
        console.error("Error file:", f, e);
      }
    }
  }

  const arr = Array.from(texts).sort((a, b) => a.length - b.length);
  fs.mkdirSync(path.join(root, "scripts"), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(arr, null, 2), "utf8");
  console.log("✅ Extracted", arr.length, "strings to", outFile);
})();
