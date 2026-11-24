from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
required = {"SKILL.md", "README.md", "LICENSE", ".gitignore", "evals/evals.json", "scripts/verify.py"}
assert all((root / p).is_file() for p in required), "missing package file"
skill = (root / "SKILL.md").read_text()
assert skill.startswith("---\nname: agent-progress-digest\n")
assert "\ndescription: " in skill.split("---", 2)[1]
assert "# Agent Progress Digest" in skill
assert len(json.loads((root / "evals/evals.json").read_text())["evals"]) == 3
readme = (root / "README.md").read_text()
assert "npx skills add AFK-agent-team/agent-progress-digest --skill agent-progress-digest" in readme
example = readme.split("After (same facts, no extra claims):", 1)[1].split("```text", 1)[1].split("```", 1)[0].strip().splitlines()
assert len(example) == 4 and not example[0].startswith("[")
assert all(re.fullmatch(r"\[(?: |x)\] [^\n]+", s) for s in example[1:])
assert example[1].startswith("[ ]") and example[2].startswith("[ ]") and example[3].startswith("[x]")
assert not re.search(r"id=|pending|completed|in_progress|进行中|排队", "\n".join(example))
# Split literals avoid making the scanner trigger on its own patterns.
patterns = [r"gh" + r"p_[A-Za-z0-9]{20,}", r"github_" + r"pat_[A-Za-z0-9_]{20,}", r"-----BEGIN " + r"(?:RSA |OPENSSH )?PRIVATE KEY-----", r"/home/box/" + r"agent-data", r"tail6a877d" + r"\.ts\.net"]
for path in root.rglob("*"):
    if path.is_file() and ".git" not in path.parts:
        text = path.read_text()
        assert not any(re.search(p, text) for p in patterns), f"sensitive pattern: {path.name}"
print("PASS: structure, frontmatter, eval JSON, install syntax fixture, digest example, sensitive-pattern checks")
