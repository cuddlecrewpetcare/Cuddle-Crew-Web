export const approvedGithubRemote='https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web';

export function normalizeGithubRemote(value){
  let normalized=String(value);
  if(normalized.endsWith('/'))normalized=normalized.slice(0,-1);
  if(normalized.endsWith('.git'))normalized=normalized.slice(0,-4);
  return normalized;
}

export const isApprovedGithubRemote=value=>normalizeGithubRemote(value)===approvedGithubRemote;
