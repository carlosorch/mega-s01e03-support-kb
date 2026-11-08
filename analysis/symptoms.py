# Sorts each report by what its body describes: day/month swap, one-day move, or something else.
import collections
import json
import re
import sys

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]
MONTHS = {name: i + 1 for i, name in enumerate(MONTH_NAMES)}
DATE = re.compile(r"(\d{1,2}) (" + "|".join(MONTHS) + r")")


def symptom_of(dates):
    if len(dates) < 2:
        return "other"
    (d1, m1), (d2, m2) = dates[0], dates[1]
    if (d1, m1) == (m2, d2) and d1 != m1:
        return "swap"
    if m1 == m2 and abs(d1 - d2) == 1:
        return "one-day"
    return "pair-other"


with open(sys.argv[1]) as f:
    rows = json.load(f)

out = []
for r in rows:
    dates = [(int(d), MONTHS[m]) for d, m in DATE.findall(r["body"])]
    out.append({**r, "symptom": symptom_of(dates), "dates": dates})

with open(sys.argv[2], "w") as f:
    json.dump(out, f, indent=1)

print(collections.Counter(x["symptom"] for x in out))
print(collections.Counter((x["cause"], x["symptom"]) for x in out))
for x in out:
    if x["symptom"] != "swap":
        print(x["id"], x["receivedAt"][:10], x["tenant"], x["channel"],
              x["meta"]["intakeTag"], x["cause"], x["symptom"], "|", x["body"])
