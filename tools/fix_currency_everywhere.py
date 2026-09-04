import os
import re

files_fixed = 0
chars_replaced = 0

def fix_file(filepath):
    global files_fixed, chars_replaced
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    orig = content

    # 1. Fix broken math/logic comparisons
    content = content.replace("P(balance ? amount)", "P(balance ? amount)")
    content = content.replace("calibrated P(balance ? amount)", "calibrated P(balance ? amount)")

    # 2. Fix currency symbols in text and templates
    content = content.replace("Amount (?)", "Amount (?)")
    content = content.replace("Amount (?)", "Amount (?)")
    content = content.replace("? RECOVERED", "NET RECOVERED")
    content = content.replace("? AT RISK", "TOTAL AT RISK")
    content = content.replace("?{", "?{")
    content = content.replace("+?{", "+?{")
    content = content.replace("? +", "? +")
    
    # Currency patterns with numbers like ?15,000, ?2,92,732, ?0.00, ?7,25,687, etc.
    content = re.sub(r'\?([0-9]+)', r'?\1', content)
    content = re.sub(r'\+ \?([0-9]+)', r'+ ?\1', content)
    content = re.sub(r'\+ \?\{', r'+ ?{', content)
    content = content.replace("AFA ?15k", "AFA ?15k")

    # Fix index.html title
    content = content.replace("RECOVER ? Predictive", "RECOVER ? Predictive")

    if content != orig:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        files_fixed += 1
        print(f"Fixed currency symbols in: {filepath}")

for root, _, files in os.walk("frontend/src"):
    for f in files:
        if f.endswith((".tsx", ".ts", ".jsx", ".js", ".html", ".css")):
            fix_file(os.path.join(root, f))

for root, _, files in os.walk("backend/src"):
    for f in files:
        if f.endswith((".ts", ".js")):
            fix_file(os.path.join(root, f))

fix_file("frontend/index.html")
print(f"Done! Cleaned currency symbols in {files_fixed} files.")
