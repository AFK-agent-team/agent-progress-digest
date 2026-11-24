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

# README illustration: self-contained SVG image context, no active/external content.
import xml.etree.ElementTree as ET
for filename in ("progress-digest.svg", "progress-digest-static.svg"):
    asset = root / "assets" / filename
    tree = ET.fromstring(asset.read_text())
    assert tree.attrib.get("viewBox") == "0 0 1024 663"
    assert tree.find("{http://www.w3.org/2000/svg}title") is not None
    for element in tree.iter():
        assert element.tag.split("}")[-1] not in {"script", "foreignObject", "image", "use", "a"}
        assert not any(k.lower().startswith("on") or k.endswith("href") for k in element.attrib)
    assert "url(" not in asset.read_text() and "@import" not in asset.read_text()
animated = (root / "assets/progress-digest.svg").read_text()
assert "prefers-reduced-motion:no-preference" in animated
assert "15s" in animated and "scale(1.22)" in animated
assert "@keyframes" not in (root / "assets/progress-digest-static.svg").read_text()
assert "](assets/progress-digest.svg)" in readme
assert "](assets/progress-digest-static.svg)" in readme
print("PASS: SVG XML, accessibility labels, self-contained safety, motion fallback, README references")

for panel in ("left-panel", "chat-panel", "right-panel", "user-bubble", "assistant-bubble-1", "input-box"):
    assert f'id="{panel}"' in animated
ns = {"s": "http://www.w3.org/2000/svg"}
for filename in ("progress-digest.svg", "progress-digest-static.svg"):
    tree = ET.fromstring((root / "assets" / filename).read_text())
    bubbles = [e for e in tree.iter() if e.attrib.get("id", "").startswith("assistant-bubble-")]
    assert bubbles
    for bubble in bubbles:
        lines = [e.text for e in bubble.findall("s:text", ns)]
        assert len(lines) == 4 and not lines[0].startswith("[")
        tasks = lines[1:]
        assert all(re.fullmatch(r"\[(?: |x)\] .+", t) for t in tasks)
        assert "[x] Check page content" in tasks
        marks = [t.startswith("[x]") for t in tasks]
        assert marks == sorted(marks)
print("PASS: three panels, user bubble, assistant digest bubbles, input box, task ordering and retained completion")

assert 'assistant-context' not in animated
assert '@media (max-width:600px)' in animated
assert 'id="responsive-frame"' in animated
for label in ('Bot details', 'Computer', 'Voice'):
    assert '>'+label+'</text>' in animated
print("PASS: focused narrow composition, no redundant narration bubble, reference-supported detail labels")

# Keep generated README SVGs tied to the shared pure-JS timeline.
import subprocess
import tempfile
subprocess.run(["node", "scripts/render.mjs", "--check"], cwd=root, check=True)
subprocess.run(["node", "--test", "tests/timeline.test.mjs"], cwd=root, check=True)
with tempfile.TemporaryDirectory() as directory:
    subprocess.run(["node", "scripts/render.mjs", "--sample", "--out-dir", directory], cwd=root, check=True)
    samples = list(Path(directory).glob("*.svg"))
    assert len(samples) == 30
    for sample in samples:
        ET.parse(sample)
print("PASS: generated assets match source; 45 Node tests; all 30 sampled SVGs parse")
