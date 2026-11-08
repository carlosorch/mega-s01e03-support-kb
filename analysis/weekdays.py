# Checks weekday names in report bodies against the 2026 calendar, to find hidden one-day moves.
import datetime
import json
import re
import sys

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
PAT = re.compile(r"(" + "|".join(DAYS) + r") (\d{1,2}) (" + "|".join(MONTH_NAMES) + r")")

with open(sys.argv[1]) as f:
    rows = json.load(f)
for r in rows:
    for wd, d, m in PAT.findall(r["body"]):
        real = DAYS[datetime.date(2026, MONTH_NAMES.index(m) + 1, int(d)).weekday()]
        if real != wd:
            print(r["id"], r["tenant"], r["channel"], f"{wd} {d} {m} is really {real}", "|", r["body"])
