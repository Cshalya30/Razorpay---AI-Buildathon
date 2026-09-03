import sys, os

if len(sys.argv) < 2:
    print('Usage: python write_file.py <dest_path>')
    sys.exit(1)

dest = sys.argv[1]
content = sys.stdin.read()
parent = os.path.dirname(dest)
if parent:
    os.makedirs(parent, exist_ok=True)
with open(dest, 'w', encoding='utf-8') as f:
    f.write(content)
print(f'Wrote {len(content)} chars to {dest}')
