import urllib.request
import json

SUPABASE_URL = 'https://zoigiwmgddweiaagtdcv.supabase.co'
SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaWdpd21nZGR3ZWlhYWd0ZGN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDIwMjcyNywiZXhwIjoyMDg5Nzc4NzI3fQ.9htQ8uJ8UfLH2Y3LqdxAwcwElLfEn9H1_lfNncGoWBY'

sqls = [
    "ALTER TABLE customers ADD COLUMN IF NOT EXISTS optin_parceiros boolean DEFAULT false",
    "ALTER TABLE customers ADD COLUMN IF NOT EXISTS optin_parceiros_at timestamptz",
]

headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
}

for sql in sqls:
    data = json.dumps({'query': sql}).encode()
    req = urllib.request.Request(
        f'{SUPABASE_URL}/rest/v1/rpc/query',
        data=data,
        headers=headers,
        method='POST'
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(f'OK ({resp.status}): {sql[:60]}')
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        # Se der erro de funcao nao encontrada, tenta via SQL direto
        print(f'RPC falhou ({e.code}): {body[:120]}')
        print('Use o SQL Editor do Supabase com o SQL abaixo:')
        print(sql)
