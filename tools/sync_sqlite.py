import sqlite3, json, os

db_file = "recover.db" if os.path.exists("recover.db") else "backend/recover.db"
print("Connecting to:", db_file)
conn = sqlite3.connect(db_file)
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [t[0] for t in cur.fetchall()]
print("Tables in DB:", tables)

with open("frontend/src/api/mockData.json", "r", encoding="utf-8") as f:
    mandates = json.load(f)

for m in mandates:
    cur.execute("""
        UPDATE mandates 
        SET status = ?, next_retry_day = ?, predicted_success_prob = ?
        WHERE id = ?
    """, (m['status'], m['next_retry_day'], m['predicted_success_prob'], m['id']))

conn.commit()
print("Updated SQLite mandates with realistic model predictions!")

cur.execute("SELECT id, status, next_retry_day, predicted_success_prob FROM mandates WHERE status = 'retry_scheduled' LIMIT 10")
rows = cur.fetchall()
for r in rows:
    print(f"SQLite Row: {r[0]} | Status: {r[1]} | Day: {r[2]} | Conf: {r[3]*100:.1f}%")

conn.close()
