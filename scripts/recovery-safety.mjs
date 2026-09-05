import {existsSync,readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');

export const requiredRecoveryFiles=[
  'docs/backup-disaster-recovery.md',
  'docs/business-continuity.md',
  'docs/backups/README.md',
  'docs/deployment-hosting.md',
  'docs/deployments/README.md',
  'docs/incidents/README.md',
  'docs/business-reference/README.md',
  'docs/business-reference/guidance/source-of-truth-document-hierarchy.md',
  'docs/business-reference/operations/38-continuity-backup-provider-plan.md',
];

export const isForbiddenRecoveryPath=name=>{
  const path=String(name).replaceAll('\\','/');
  if(path==='docs/backups/README.md'||path==='.env.example')return false;
  return /(^|\/)(?:backups?|database-dumps?|private-exports?|provider-exports?|recovery-codes?)(\/|$)/i.test(path)
    || /(^|\/)\.env(?:\.|$)/i.test(path)
    || /\.(?:db|sqlite3?|dump|bak|backup|sql(?:\.gz)?|zip|7z|rar|tar|tgz|p12|pfx|pem|key)$/i.test(path);
};

export const hasRequiredRecoveryLanguage=(recovery,continuity,template)=>{
  const recoveryPhrases=[
    'UNIQUE / AUTHORITATIVE',
    'DO NOT BACK UP / REGENERATE',
    'SYNC is not backup',
    'exact Git SHA',
    'Precise Petcare',
    'active-care',
    'isolated',
    'RTO',
    'RPO',
    'OWNER DECISION REQUIRED',
  ];
  const continuityPhrases=[
    'Laptop or SSD loss',
    'Precise Petcare outage during active care',
    'minimum necessary',
    'approved secure method',
    'Do not create a shadow client database',
  ];
  const templatePhrases=[
    'source_sha_or_version',
    'integrity_algorithm',
    'integrity_digest',
    'encryption_status',
    'retention_class',
    'Restore verification checklist',
    'Do not record secret values',
  ];
  return {
    recovery:recoveryPhrases.filter(phrase=>!recovery.includes(phrase)),
    continuity:continuityPhrases.filter(phrase=>!continuity.includes(phrase)),
    template:templatePhrases.filter(phrase=>!template.includes(phrase)),
  };
};

const runGit=args=>spawnSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true});
const output=result=>String(result.stdout||'').trim();

export function runRecoveryCheck(){
  const failures=[];
  const warnings=[];
  const fail=message=>failures.push(message);
  const warn=message=>warnings.push(message);
  const read=path=>readFileSync(resolve(root,path),'utf8');

  for(const path of requiredRecoveryFiles)if(!existsSync(resolve(root,path)))fail(`${path}: required recovery foundation file is missing`);

  const repository=runGit(['rev-parse','--show-toplevel']);
  if(repository.status!==0||resolve(output(repository))!==root)fail('Git repository identity could not be verified');

  const remotes=output(runGit(['remote'])).split(/\r?\n/).filter(Boolean);
  if(!remotes.includes('github'))fail('required GitHub source remote "github" is missing');
  if(!remotes.includes('sites'))warn('Sites deployment remote is not configured; hosting recovery remains externally dependent');

  const branch=output(runGit(['branch','--show-current']));
  if(!branch)fail('current checkout is detached; recovery provenance requires a named branch and exact SHA');
  const sha=output(runGit(['rev-parse','HEAD']));
  if(!/^[0-9a-f]{40}$/.test(sha))fail('current exact Git SHA could not be resolved');

  const upstream=runGit(['rev-parse','--abbrev-ref','--symbolic-full-name','@{u}']);
  if(upstream.status!==0)warn('tracking branch is not configured yet; verify the explicit GitHub destination before relying on the remote copy');
  else{
    const divergence=output(runGit(['rev-list','--left-right','--count',`${output(upstream)}...HEAD`]));
    if(!/^\d+\s+\d+$/.test(divergence))warn('remote divergence could not be determined');
    else if(divergence!=='0\t0'&&divergence!=='0 0')warn(`local and tracked remote differ (${divergence.replace(/\s+/g,'/')}; fetch before relying on recovery state)`);
  }

  const listed=runGit(['ls-files','-z']);
  if(listed.status!==0)fail('tracked files could not be enumerated');
  else for(const path of listed.stdout.split('\0').filter(Boolean))if(isForbiddenRecoveryPath(path))fail(`${path}: tracked backup, secret, key, database, archive, dump, or private-export path is forbidden`);

  const ignoredEnv=runGit(['check-ignore','-q','--','.env.local']);
  if(ignoredEnv.status!==0)fail('.env.local must remain ignored');

  if(requiredRecoveryFiles.slice(0,3).every(path=>existsSync(resolve(root,path)))){
    const missing=hasRequiredRecoveryLanguage(
      read('docs/backup-disaster-recovery.md'),
      read('docs/business-continuity.md'),
      read('docs/backups/README.md'),
    );
    for(const [document,phrases] of Object.entries(missing))for(const phrase of phrases)fail(`${document} documentation is missing required recovery language: ${phrase}`);
  }

  const manifest=JSON.parse(read('package.json'));
  if(manifest.scripts?.['check:recovery']!=='node scripts/recovery-safety.mjs')fail('package.json must expose the read-only check:recovery command');
  if(!String(manifest.scripts?.validate||'').includes('check:recovery'))fail('standard validation must run check:recovery');

  for(const message of warnings)console.log(`WARNING ${message}`);
  if(failures.length){
    for(const message of failures)console.error(`FAIL    ${message}`);
    console.error(`Recovery safety check failed with ${failures.length} finding(s). Nothing was modified.`);
    return 1;
  }
  console.log(`PASS    Recovery documents — ${requiredRecoveryFiles.length} required authority, continuity, restore, incident, and deployment references are present`);
  console.log('PASS    Source recoverability — named branch, exact SHA, and GitHub source remote are identifiable');
  console.log('PASS    Private-state boundary — no tracked environment file, backup archive, database, key, dump, or provider export');
  console.log('PASS    Restore contract — isolated verification, manifest integrity, RTO/RPO, active-care, and owner-decision boundaries are documented');
  console.log('INFO    Scope — this check proves repository invariants only; it does not prove offsite copies, provider exports, account recovery, or successful production restore');
  console.log('Recovery safety check passed. Nothing was modified.');
  return 0;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))process.exitCode=runRecoveryCheck();
