import json
from pathlib import Path

REQUIRED = {'apex_version','benchmark','model','runtime','tests','metrics','provenance'}

def validate_report(path):
    data=json.loads(Path(path).read_text(encoding='utf-8'))
    missing=REQUIRED-set(data)
    if missing: raise ValueError('missing fields: '+str(sorted(missing)))
    for k in ('count','correct','errors','timeouts'):
        if k not in data['tests']: raise ValueError('missing tests.'+k)
    for k in ('accuracy','p50_ms','p95_ms','p99_ms'):
        if k not in data['metrics']: raise ValueError('missing metrics.'+k)
    print('APEX verification report structure: VALID')

if __name__=='__main__':
    import argparse
    p=argparse.ArgumentParser()
    p.add_argument('report')
    validate_report(p.parse_args().report)
