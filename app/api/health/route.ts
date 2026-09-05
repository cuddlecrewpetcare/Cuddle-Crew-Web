import {createRequestId,headersWithRequestId} from '../../lib/observability.ts';

export function GET(){
  return Response.json(
    {status:'ok',timestamp:new Date().toISOString()},
    {headers:headersWithRequestId(createRequestId(),{'Cache-Control':'no-store'})},
  );
}
