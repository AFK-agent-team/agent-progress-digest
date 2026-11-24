# Agent Progress Digest

Concise chat progress updates: one factual sentence, then a TODO checklist. Unfinished work comes first; completed work stays visible.

This is a reporting skill, not a task runner, permission system, dashboard, or persistent bot configuration tool. It does not require a dedicated task tool.

## See the format

![Illustrative progress digest: one factual lead, unfinished tasks first, completed tasks retained](assets/progress-digest.svg)

Illustrative reconstruction, not live model output or a product recording. The 15-second SVG loop includes a gentle zoom in and out. Reduced-motion viewers get the first snapshot; a [static version](assets/progress-digest-static.svg) is also available. Animation depends on the GitHub image viewer and browser; visual playback has not been verified on GitHub.

## Install

```bash
npx skills add AFK-agent-team/agent-progress-digest --skill agent-progress-digest
```

The repository shorthand and `--skill` selector were checked against `skills@1.9.0 add --help`. Remote discovery must be verified after publication. Your skills CLI controls installation scope and supported agents.

## Ask for an update

“Use Agent Progress Digest for milestone updates.”

Use the conversation language. Keep commands, filenames, and proper names unchanged.

## Before and after

Fictional input facts: page content was checked; mobile testing has not run; nothing was published.

Before (an intentionally poor report):

```text
Task id=17: 内容检查 completed
Task id=18: 移动端测试 pending
Task id=19: 发布 pending
```

After (same facts, no extra claims):

```text
页面内容已核对，移动端测试和发布尚未执行。
[ ] 检查移动端布局
[ ] 发布页面
[x] 核对页面内容
```

Blocked or unverified tasks stay unchecked. Put necessary blocker context in the lead sentence, not beside task titles. Single-step answers need no invented checklist. No Page or separate board is created.

## Verify

```bash
python3 scripts/verify.py
```

The script checks package structure, frontmatter, examples, and common accidental sensitive-content patterns. It is a static check, not proof of model compliance or a complete secret scanner. Functional prompts live in `evals/evals.json`.

## License and origin

MIT. This release contains newly written explanatory prose and test fixtures based on a user-requested reporting format. It does not bundle third-party helper code, platform-specific configuration instructions, private bot profiles, or credentials. The existing local `add-chat-digest` skill is not renamed or modified by this release.
