import sys

file_path = "backend/api/routes/chat.py"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_chunk = """        # Decide if the query is a database query (aggregations, specific tabular values etc) or a document query.
        route_decision_sys = (
            "Analyze the following query. Is it asking for structured/tabular data aggregations, specific metrics like 'value', 'volume', or 'count' from a database? "
            "Or is it asking for unstructured textual explanations, constraints analysis, network graphs, or historical context from a document? "
            "Reply with exactly 'SQL' or 'DOCUMENT'.\\n\\n"
            f"Query: {req.message}"
        )
        try:
            route_res = llm.invoke([HumanMessage(content=route_decision_sys)])
            query_type = "SQL" if "SQL" in route_res.content.upper() else "DOCUMENT"
        except:
            query_type = "SQL"  # Default to SQL for analytical tool
            
        # ALWAYS fetch Supabase embeddings for extra context
        try:
            from embeddings import search_similar_decisions
            supabase_decisions = search_similar_decisions(req.message, limit=3)
        except Exception:
            supabase_decisions = []
            
        supabase_context = ""
        if supabase_decisions:
            supabase_context = "Relevant Knowledge Base Information (Supabase):\\n" + "\\n".join(
                [f"- {d['summary']}" for d in supabase_decisions]
            )

        # If it's explicitly a Document query, or no DB exists, rely on KB uploaded files.
        if query_type == "DOCUMENT" or not db_url:
            kb_sources = _kb_search(req.message, max_results=3)
            if kb_sources:
                kb_context = "\\n\\n".join(
                    [f"[{i+1}] File: {s['source']}\\nExcerpt: {s['text_snippet']}" for i, s in enumerate(kb_sources)]
                )
                kb_prompt = (
                    "Answer the user's question using ONLY the excerpts from the knowledge base files below. "
                    "If the excerpts are insufficient, you must explicitly state exactly: 'the data is not available in the database'.\\n"
                    "IMPORTANT: Do not include any inline citations (e.g., [1]) or references list at the end of your response, "
                    "as the UI will automatically display the data sources.\\n\\n"
                    f"User question: {req.message}\\n\\n"
                    f"Knowledge base excerpts:\\n{kb_context}\\n\\n"
                    f"{supabase_context}"
                )
                ans = llm.invoke([HumanMessage(content=kb_prompt)])
                for idx, s in enumerate(kb_sources, 1):
                    s["citation_number"] = idx
                return {"answer": ans.content, "sources": kb_sources}
            elif query_type == "DOCUMENT":
                return {"answer": "the data is not available in the database", "sources": []}

        # Let the LLM judge if we should use public web
        use_web = False
        internal_kws = ["sto", "dc ", "plant ", "sku ", "distribution center"]
        if not any(k in req.message.lower() for k in internal_kws):
            try:
                judge_sys = (
                    "Decide if this user question likely requires current/public internet knowledge "
                    "outside the enterprise database or uploaded documents.\\n"
                    "Return ONLY 'YES' or 'NO'.\\n\\n"
                    f"Question: {req.message}"
                )
                judge = llm.invoke([HumanMessage(content=judge_sys)])
                if isinstance(judge.content, str) and judge.content.strip().upper().startswith("Y"):
                    use_web = True
            except Exception:
                pass
"""

# Find start line (the comment "Decide if the query is a database query")
start_idx = -1
for i, l in enumerate(lines):
    if "# Decide if the query is a database query" in l:
        start_idx = i
        break

# Find end line (the "if use_web:" line)
end_idx = -1
for i in range(start_idx, len(lines)):
    if "if use_web:" in lines[i]:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines[:start_idx])
        f.write(new_chunk + "\n")
        f.writelines(lines[end_idx:])
    print("Fixed chat.py successfully!")
else:
    print(f"Could not find indices! start={start_idx}, end={end_idx}")
