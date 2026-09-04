import {existsSync,statSync} from 'node:fs';
import {dirname,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const expectedRemote='https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web.git';
const reviewBytes=1024*1024;
const rejectBytes=10*1024*1024;
let failed=false;

const run=(args)=>spawnSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true});
const output=(result)=>(result.stdout||'').trim();
const pass=(label,detail)=>console.log(`PASS    ${label} — ${detail}`);
const info=(label,detail)=>console.log(`INFO    ${label} — ${detail}`);
const warn=(label,detail)=>console.log(`WARNING ${label} — ${detail}`);
const fail=(label,detail)=>{failed=true;console.error(`FAIL    ${label} — ${detail}`)};
const safePath=(value)=>String(value).replace(/[\r\n\t]/g,' ').slice(0,240);
const list=(args)=>output(run(args)).split('\0').filter(Boolean);
const normalized=(path)=>path.replaceAll('\\','/');
const insideRoot=(path)=>{const rel=relative(root,path);return rel&&!rel.startsWith(`..${sep}`)&&rel!=='..'};

const gitRoot=resolve(output(run(['rev-parse','--show-toplevel']))||'.');
if(gitRoot===root)pass('Repository identity','Git root matches this checkout');else fail('Repository identity','command is not running from the intended repository root');

const branch=output(run(['branch','--show-current']));
if(!branch)fail('Branch','detached HEAD; recover or create the intended branch before implementation');
else if(branch==='main'||branch==='master')warn('Branch',`${branch}; implementation work is prohibited here, but explicit merge-only validation is allowed`);
else pass('Branch',branch);

const remote=output(run(['remote','get-url','github']));
if(remote===expectedRemote)pass('GitHub remote',remote);else fail('GitHub remote',remote?`unexpected destination ${safePath(remote)}`:'required remote "github" is missing');
const pushRemote=output(run(['remote','get-url','--push','github']));
if(pushRemote===expectedRemote)pass('GitHub push remote','matches the reviewed repository');else fail('GitHub push remote','does not match the reviewed repository');
const defaultBranch=output(run(['symbolic-ref','refs/remotes/github/HEAD']));
if(defaultBranch==='refs/remotes/github/main')pass('Default branch','github/main');else fail('Default branch',defaultBranch||'github/HEAD is unresolved');
const upstream=output(run(['rev-parse','--abbrev-ref','--symbolic-full-name','@{u}']));
if(upstream)info('Tracking branch',upstream);else warn('Tracking branch','not configured yet; verify the explicit destination on first push');

if(existsSync(resolve(root,'.gitattributes')))pass('Line-ending policy','.gitattributes present');else fail('Line-ending policy','.gitattributes is missing');
const eolLines=output(run(['ls-files','--eol'])).split(/\r?\n/).filter(Boolean);
const badIndex=eolLines.filter(line=>/^i\/(crlf|mixed)\s/.test(line));
if(badIndex.length)fail('Git index line endings',`${badIndex.length} tracked text file(s) are not normalized to LF`);else pass('Git index line endings','no CRLF or mixed text blobs');

const tracked=list(['ls-files','-z']);
const untracked=list(['ls-files','--others','--exclude-standard','-z']);
const staged=new Set(list(['diff','--cached','--name-only','-z','--diff-filter=ACMR']));
const forbidden=[];
const largeReview=[];
const largeReject=[];
const guarded=(name)=>{
  const path=normalized(name);
  if(path==='.env.example')return false;
  return /(^|\/)(node_modules|\.next|\.vinext|dist|coverage|playwright-report|test-results|\.cache)(\/|$)/i.test(path)
    || /(^|\/)\.env(?:\.|$)/i.test(path)
    || /\.(?:db|sqlite|sqlite3|dump|bak|backup|p12|pfx|pem|key|log|zip|7z|rar|tar|tgz|gz)$/i.test(path)
    || /(^|\/)(?:private|backups?|database-dumps?|private-exports?)(\/|$)/i.test(path);
};

for(const name of tracked){
  const full=resolve(root,name);
  if(!insideRoot(full)||!existsSync(full)||!statSync(full).isFile())continue;
  if(guarded(name))forbidden.push(name);
  const size=statSync(full).size;
  if(size>=rejectBytes)largeReject.push({name,size});else if(size>=reviewBytes)largeReview.push({name,size});
}
if(forbidden.length)for(const name of forbidden)fail('Forbidden tracked file',safePath(name));else pass('Private/generated file guard','no forbidden tracked files');
if(largeReject.length)for(const item of largeReject)fail('Oversized tracked file',`${safePath(item.name)} (${(item.size/1024/1024).toFixed(2)} MiB; 10 MiB limit)`);
else pass('Large-file hard limit','no tracked file is 10 MiB or larger');
for(const item of largeReview)warn('Large-file review',`${safePath(item.name)} (${(item.size/1024/1024).toFixed(2)} MiB; verify it is intentional)`);

const untrackedLarge=[];
for(const name of untracked){const full=resolve(root,name);if(insideRoot(full)&&existsSync(full)&&statSync(full).isFile()&&statSync(full).size>=reviewBytes)untrackedLarge.push({name,size:statSync(full).size})}
for(const item of untrackedLarge)warn('Large untracked file',`${safePath(item.name)} (${(item.size/1024/1024).toFixed(2)} MiB)`);

const status=run(['status','--porcelain=v1','-z']);
const statusEntries=String(status.stdout||'').split('\0').filter(Boolean);
info('Working tree',`${statusEntries.length} changed/untracked entr${statusEntries.length===1?'y':'ies'}; inspect before staging`);
info('Staged files',`${staged.size}; use targeted staging and inspect the staged diff`);
for(const name of staged)if(guarded(name))fail('Forbidden staged file',safePath(name));

const changed=new Set([...list(['diff','--name-only','-z']),...list(['diff','--cached','--name-only','-z'])]);
if(changed.has('package-lock.json'))warn('Lockfile review','package-lock.json changed; require an intentional dependency task and inspect it before commit');
else pass('Lockfile review','package-lock.json unchanged');

info('Completion review','inspect status, unstaged/staged diffs, unexpected files, and remote tracking before commit or push');
if(failed){console.error('Repository safety check failed. Nothing was modified.');process.exitCode=1}else console.log('Repository safety check passed. Nothing was modified.');
