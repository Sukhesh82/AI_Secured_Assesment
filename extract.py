import json
with open(r'C:\Users\kavya\.gemini\antigravity\brain\63072b54-52b0-4ef8-a939-5778c21a9c0c\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        try:
            d = json.loads(line)
            if 'Login.jsx' in line or 'Register.jsx' in line:
                if d.get('type') in ['VIEW_FILE', 'REPLACE_FILE_CONTENT', 'MULTI_REPLACE_FILE_CONTENT']:
                    print(f"Step {d.get('step_index')}: {d.get('type')} - {d.get('content')[:100]}")
        except:
            pass
