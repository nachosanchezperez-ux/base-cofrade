import { execFileSync, spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const MAIN_REF = process.env.HILO_BRANCH_AUDIT_MAIN || 'origin/main'
const OPEN_PR_COUNT = process.env.HILO_BRANCH_AUDIT_OPEN_PRS || 'unknown'
const OUTPUT_FLAG = '--output'

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', options.silentStderr ? 'ignore' : 'pipe'],
  }).trim()
}

function gitStatus(args) {
  return spawnSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'ignore',
  }).status ?? 1
}

function csv(value) {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function outputPath() {
  const index = process.argv.indexOf(OUTPUT_FLAG)
  if (index === -1) return null
  const value = process.argv[index + 1]
  if (!value) throw new Error(`${OUTPUT_FLAG} necesita una ruta`)
  return value
}

const refs = git([
  'for-each-ref',
  '--format=%(refname)\t%(refname:short)\t%(objectname)\t%(committerdate:iso8601-strict)\t%(subject)',
  'refs/remotes/origin',
])
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [ref, shortRef, sha, committedAt, ...subject] = line.split('\t')
    return { ref, shortRef, sha, committedAt, subject: subject.join('\t') }
  })
  .filter(({ ref }) => !['refs/remotes/origin/HEAD', 'refs/remotes/origin/main'].includes(ref))

const tipCounts = new Map()
for (const { sha } of refs) tipCounts.set(sha, (tipCounts.get(sha) || 0) + 1)

const rows = refs.map((branch) => {
  const [behindText, aheadText] = git(['rev-list', '--left-right', '--count', `${MAIN_REF}...${branch.ref}`]).split(/\s+/)
  const behind = Number(behindText)
  const ahead = Number(aheadText)
  const mergedAncestor = gitStatus(['merge-base', '--is-ancestor', branch.ref, MAIN_REF]) === 0

  let classification = 'review_required'
  let uniqueCommits = 0
  let patchEquivalentCommits = 0

  if (mergedAncestor) {
    classification = 'merged_ancestor'
  } else if (gitStatus(['diff', '--quiet', MAIN_REF, branch.ref]) === 0) {
    classification = 'tree_equivalent'
  } else {
    const marks = git([
      'log',
      '--cherry-mark',
      '--right-only',
      '--no-merges',
      '--no-patch',
      '--format=%m',
      `${MAIN_REF}...${branch.ref}`,
    ], { silentStderr: true }).split('\n').filter(Boolean)

    uniqueCommits = marks.filter((mark) => mark === '>').length
    patchEquivalentCommits = marks.filter((mark) => mark === '=').length
    if (uniqueCommits === 0) classification = 'patch_equivalent'
  }

  return {
    branch: branch.shortRef.replace(/^origin\//, ''),
    sha: branch.sha,
    committed_at: branch.committedAt,
    subject: branch.subject,
    classification,
    behind_main: behind,
    ahead_main: ahead,
    unique_commits: uniqueCommits,
    patch_equivalent_commits: patchEquivalentCommits,
    duplicate_tip_branches: tipCounts.get(branch.sha),
    open_pr_at_cut: OPEN_PR_COUNT === '0' ? 'none_repo_wide' : 'unknown',
    proposed_action: classification === 'review_required' ? 'review' : 'candidate_for_authorized_cleanup',
  }
})

rows.sort((a, b) => a.classification.localeCompare(b.classification) || a.branch.localeCompare(b.branch))

const headers = Object.keys(rows[0] || {})
const body = [headers.join(','), ...rows.map((row) => headers.map((header) => csv(row[header])).join(','))].join('\n') + '\n'
const destination = outputPath()

if (destination) writeFileSync(destination, body)
else process.stdout.write(body)

const totals = rows.reduce((summary, row) => {
  summary[row.classification] = (summary[row.classification] || 0) + 1
  return summary
}, {})

const duplicateTipGroups = [...tipCounts.values()].filter((count) => count > 1)
process.stderr.write(`${JSON.stringify({
  main: MAIN_REF,
  main_sha: git(['rev-parse', MAIN_REF]),
  open_prs_at_cut: OPEN_PR_COUNT,
  total: rows.length,
  unique_tips: tipCounts.size,
  duplicate_tip_groups: duplicateTipGroups.length,
  branches_sharing_a_tip: duplicateTipGroups.reduce((sum, count) => sum + count, 0),
  classifications: totals,
})}\n`)
