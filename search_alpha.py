import os
import json
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv("backend/.env")

db_url = os.getenv("DATABASE_URL")
if not db_url:
    print("No database configured")
    exit(1)

engine = create_engine(db_url)

terms = ["Plant Alpha", "DC West"]

results_found = []

with engine.connect() as conn:
    tables = conn.execute(text("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' AND (data_type LIKE '%char%' OR data_type LIKE '%text%')")).fetchall()
    
    for term in terms:
        print(f"\n--- Searching for {term} ---")
        found = False
        for t, c in tables:
            try:
                res = conn.execute(text(f"SELECT * FROM {t} WHERE {c} ILIKE '%{term}%' LIMIT 5")).fetchall()
                if res:
                    print(f"Found {len(res)} match(es) in table {t}, column {c}")
                    found = True
                    results_found.append(f"{term} found in {t}")
            except Exception as e:
                pass
        
        if not found:
            print(f"No match for {term} anywhere in the database!")

# Write an output cell to the notebook
with open("test/test.ipynb", "r", encoding="utf-8") as f:
    nb = json.load(f)

cell_code = [
    "# Search for Plant Alpha and DC West\n",
    "print('\\n' + '='*100)\n",
    "search_laptop_g9_all_tables('Plant Alpha')\n",
    "search_laptop_g9_all_tables('DC West')\n"
]

nb["cells"].append({
    "cell_type": "code",
    "execution_count": None,
    "id": "search_alpha_west",
    "metadata": {},
    "outputs": [],
    "source": cell_code
})

with open("test/test.ipynb", "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=1)

print("\nAdded the search cell to test.ipynb successfully!")
