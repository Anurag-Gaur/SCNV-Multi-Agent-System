import json

with open("test/test.ipynb", "r", encoding="utf-8") as f:
    nb = json.load(f)

new_cell = {
    "cell_type": "code",
    "execution_count": None,
    "id": "search_dc_north",
    "metadata": {},
    "outputs": [],
    "source": [
        "# Perform comprehensive search for DC North\n",
        "print('\\n' + '='*100)\n",
        "all_results_dc = search_laptop_g9_all_tables('DC North')\n"
    ]
}

nb["cells"].append(new_cell)

with open("test/test.ipynb", "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=1)

print("Successfully appended DC North search cell to test.ipynb")
