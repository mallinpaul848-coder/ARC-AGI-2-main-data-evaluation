#!/usr/bin/env python3
"""Auditable ARC-AGI-2 public-set evaluator for APEX.

This runner evaluates a deterministic solver against a local ARC-AGI JSON
directory. It intentionally does not access private/semi-private data and
does not report an official leaderboard result. A solver module may expose
solve(task) -> list of one or two output grids; otherwise the identity
baseline is used for a pipeline smoke test.
"""
from __future__ import annotations
import argparse, hashlib, importlib.util, json, time
from pathlib import Path

def load_solver(path):
    if not path:
        return None
    spec=importlib.util.spec_from_file_location("apex_solver",path)
    if spec is None or spec.loader is None:
        raise RuntimeError("cannot load solver")
    mod=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    if not hasattr(mod,"solve"):
        raise RuntimeError("solver must define solve(task)")
    return mod.solve

def sha256_file(p):
    h=hashlib.sha256()
    with p.open("rb") as f:
        for b in iter(lambda:f.read(1024*1024),b""):
            h.update(b)
    return h.hexdigest()

def identity_solver(task):
    test=task["test"]
    return [x["input"] for x in test]

def exact(a,b):
    return a==b

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--data",required=True,help="directory containing ARC task JSON files")
    ap.add_argument("--solver",help="Python file exposing solve(task)")
    ap.add_argument("--output",default="artifacts/arc-agi-2-public-report.json")
    args=ap.parse_args()
    root=Path(args.data)
    files=sorted(root.rglob("*.json"))
    if not files:
        raise SystemExit("No JSON task files found")
    solve=load_solver(args.solver) if args.solver else identity_solver
    rows=[]
    correct=0
    total=0
    t0=time.perf_counter()
    for p in files:
        task=json.loads(p.read_text(encoding="utf-8"))
        expected=[x.get("output") for x in task["test"]]
        pred=solve(task)
        if not isinstance(pred,list) or len(pred)<1 or len(pred)>2:
            raise RuntimeError(f"{p}: solver must return one or two candidate outputs")
        # Keep the current contract exact: one test input per task.
        if len(expected) != 1:
            raise RuntimeError(f"{p}: evaluator requires exactly one test input")
        hit=any(exact(candidate, expected[0]) for candidate in pred)
        correct+=int(hit)
        total+=1
        rows.append({"file":str(p),"sha256":sha256_file(p),"correct":hit,"attempts":len(pred)})
    elapsed=time.perf_counter()-t0
    report={
        "benchmark":"ARC-AGI-2",
        "dataset_scope":"local public data only",
        "official":False,
        "leaderboard_status":"not submitted",
        "tasks":total,
        "correct_tasks":correct,
        "accuracy":correct/total if total else 0.0,
        "pass_at_2_compatible": len(rows) > 0 and all(1 <= r["attempts"] <= 2 for r in rows),
        "elapsed_seconds":elapsed,
        "solver":"identity" if not args.solver else str(Path(args.solver)),
        "task_results":rows,
        "note":"This report is an engineering/public-set evaluation artifact, not an ARC Prize verified result."
    }
    out=Path(args.output)
    out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({k:report[k] for k in ("benchmark","tasks","correct_tasks","accuracy","official","leaderboard_status")},indent=2))

if __name__=="__main__":
    main()
