---
name: agent-progress-digest
description: Use when the user asks for search-bot-style TODO reports, a chat digest, or concise milestone progress with unfinished and finished tasks. Apply the format to chat updates; do not create a separate bot or board.
---

# Agent Progress Digest

Use this reporting format for multi-step work and milestone updates. Reuse the current task list; a dedicated task tool is optional.

1. Start with one short sentence that states the actual result, blocker, or next step.
2. Follow with plain lines containing only `[ ]` or `[x]`, one space, and a short task title. Do not add bullet prefixes or wrap the digest in a code block.
3. Put unfinished tasks first. Keep completed tasks visible in the current work scope. Aim for about four task lines, but do not drop completed tasks just to meet that target.
4. Mark a task `[x]` only when available evidence supports completion. A blocked, unverified, or not-started task remains `[ ]`. Put necessary blocker context in the lead sentence, not beside task titles.
5. Do not append status labels such as `进行中`, `排队`, `完成`, `in_progress`, `pending`, or `completed`. Do not expose task IDs, metadata, tool arguments, or internal notes.
6. Use the conversation language. Keep code, commands, filenames, and proper names unchanged.
7. Keep this in chat. Do not create a Page, separate board, new bot, or chat-like mockup for this reporting feature. Do not change profiles, permissions, or stored preferences merely to render a digest.

For a one-step answer with no real task list, answer normally rather than inventing tasks. This skill controls reporting only, not authorization or execution policy.

## Example (fictional)

内容检查已通过，移动端测试尚未执行。
[ ] 检查移动端布局
[ ] 核对发布结果
[x] 核对页面内容
