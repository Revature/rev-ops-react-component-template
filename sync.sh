#!/bin/bash
# Sync component code back to the Rev-Ops platform.
# Can be run from the terminal or by the AI assistant.

set -e

CONFIG_FILE="$HOME/.revops.config"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "ERROR: $CONFIG_FILE not found. Use the Sync Code button in the VS Code extension instead."
    exit 1
fi

BACKEND_URL=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE'))['backendUrl'])")
AUTH_TOKEN=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE'))['authToken'])")
USER_ID=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE'))['userId'])")
PROJECT_TYPE=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE')).get('projectType', 'component'))")

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Determine subfolder based on project type
if [ "$PROJECT_TYPE" = "page" ]; then
    SUBDIR="page"
else
    SUBDIR="component"
fi

echo "Syncing $PROJECT_TYPE code to Rev-Ops..."

python3 -c "
import json, os, sys, urllib.request

script_dir = sys.argv[1]
subdir = sys.argv[2]
backend_url = sys.argv[3]
auth_token = sys.argv[4]
user_id = sys.argv[5]
project_type = sys.argv[6]

# Read all files in the subfolder
files = {}
source_dir = os.path.join(script_dir, subdir)
if os.path.isdir(source_dir):
    for fname in os.listdir(source_dir):
        fpath = os.path.join(source_dir, fname)
        if os.path.isfile(fpath):
            with open(fpath, 'r') as f:
                files[fname] = f.read()

if not files:
    print(f'ERROR: No files found in {source_dir}')
    sys.exit(1)

payload = json.dumps({
    'runner_id': '',
    'user_id': user_id,
    'project_type': project_type,
    'component_files': files,
}).encode()

req = urllib.request.Request(
    f'{backend_url}/api/admin/cde/sync-code',
    data=payload,
    headers={
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    },
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read().decode())
        print(f'Synced {len(files)} file(s) at {result.get(\"synced_at\", \"now\")}')
except Exception as e:
    print(f'ERROR: Sync failed: {e}', file=sys.stderr)
    sys.exit(1)
" "$SCRIPT_DIR" "$SUBDIR" "$BACKEND_URL" "$AUTH_TOKEN" "$USER_ID" "$PROJECT_TYPE"

echo "Done! You can now Preview or Compile & Save in the wizard."
