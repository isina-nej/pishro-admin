/**
 * decode-unicode.js
 * 🔍 پیدا کردن رشته‌هایی از نوع \u06XX در کل فایل‌های پروژه
 * 🎯 و جایگزینی آن‌ها با معادل فارسی واقعی
 *
 * اجرا:
 *   node scripts/decode-unicode.js
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const root = process.cwd();

// پوشه‌هایی که باید بررسی شوند
const patterns = [
  "app/**/*.{ts,tsx,js,jsx}",
  "components/**/*.{ts,tsx,js,jsx}",
  "src/**/*.{ts,tsx,js,jsx}",
  "pages/**/*.{ts,tsx,js,jsx}",
];

// تابع تبدیل یونیکد به متن فارسی
function decodeUnicode(str) {
  return str.replace(/\\u([\dA-Fa-f]{4})/g, (_, g1) =>
    String.fromCharCode(parseInt(g1, 16)),
  );
}

function processFile(file) {
  const code = fs.readFileSync(file, "utf8");

  // فقط اگر رشته Unicode داخل فایل هست
  if (!/\\u0/.test(code)) return;

  let newCode = code;
  let modified = false;

  // پیدا کردن همه‌ی occurrenceها
  const matches = code.match(/\\u[\dA-Fa-f]{4}(\\u[\dA-Fa-f]{4})*/g);
  if (matches) {
    matches.forEach((m) => {
      const decoded = decodeUnicode(m);
      if (decoded !== m) {
        newCode = newCode.replace(m, decoded);
        modified = true;
      }
    });
  }

  if (modified) {
    fs.writeFileSync(file, newCode, "utf8");
    console.log(`✅ Fixed: ${file}`);
  }
}

(async () => {
  console.log("🔍 Scanning project for Unicode text...");
  for (const pattern of patterns) {
    const files = glob.sync(pattern, { nodir: true });
    for (const f of files) {
      try {
        processFile(path.resolve(f));
      } catch (err) {
        console.warn("⚠️ Error in file:", f, err.message);
      }
    }
  }
  console.log("🎉 Unicode decoding complete!");
})();
