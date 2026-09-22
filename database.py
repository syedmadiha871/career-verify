import sqlite3

connection = sqlite3.connect("database.db")

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS history(

id INTEGER PRIMARY KEY AUTOINCREMENT,

job_title TEXT,

prediction TEXT,

confidence REAL,

fraud_score REAL,

risk TEXT,

job_description TEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)
""")

connection.commit()

connection.close()

print("Database Created Successfully")