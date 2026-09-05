export const integrationRegistry=[
  {id:'resend',status:'ACTIVE_OPTIONAL',access:'WRITE',secrets:['RESEND_API_KEY'],publicConfig:[],writeGate:'RESEND_SEND_ENABLED',local:'BLOCKED_BY_DEFAULT',tests:'MOCKED',e2e:'BLOCKED',staging:'UNRESOLVED',production:'EXPLICIT_ENABLE'},
  {id:'business-mailbox',status:'ACTIVE_DOWNSTREAM',access:'WRITE_TARGET',secrets:[],publicConfig:[],local:'VIA_RESEND_GATE',tests:'MOCKED',e2e:'BLOCKED',staging:'UNRESOLVED',production:'VIA_RESEND_GATE'},
  {id:'cloudflare-turnstile',status:'ACTIVE_OPTIONAL',access:'VERIFY_READ',secrets:['TURNSTILE_SECRET_KEY'],publicConfig:['NEXT_PUBLIC_TURNSTILE_SITE_KEY'],local:'OPTIONAL',tests:'MOCKED_OR_OFF',e2e:'OFF',staging:'OPTIONAL',production:'OPTIONAL'},
  {id:'google-maps-platform',status:'ACTIVE_OPTIONAL',access:'READ',secrets:['GOOGLE_MAPS_SERVER_KEY','PRIVATE_SERVICE_ORIGIN'],publicConfig:[],local:'OPTIONAL',tests:'MOCKED_OR_OFF',e2e:'OFF',staging:'OPTIONAL',production:'OPTIONAL'},
  {id:'private-calendar-host',status:'ACTIVE_OPTIONAL',access:'READ',secrets:['PRIVATE_CALENDAR_ICS_URL'],publicConfig:[],local:'OPTIONAL',tests:'MOCKED_OR_OFF',e2e:'MOCKED_OR_OFF',staging:'OPTIONAL',production:'OPTIONAL'},
  {id:'precise-petcare',status:'LINK_ONLY',access:'REDIRECT_ONLY',secrets:[],publicConfig:[],local:'ALLOWED',tests:'LINK_ASSERTION_ONLY',e2e:'LINK_ASSERTION_ONLY',staging:'ALLOWED',production:'ALLOWED'},
  {id:'dialpad-sms',status:'PLANNED_UNRESOLVED',access:'NO_ACTIVE_INTEGRATION',secrets:[],publicConfig:[],local:'BLOCKED',tests:'BLOCKED',e2e:'BLOCKED',staging:'UNRESOLVED',production:'UNRESOLVED'},
  {id:'payments',status:'NO_ACTIVE_INTEGRATION',access:'NO_ACTIVE_INTEGRATION',secrets:[],publicConfig:[],local:'BLOCKED',tests:'BLOCKED',e2e:'BLOCKED',staging:'UNRESOLVED',production:'UNRESOLVED'},
  {id:'webhooks',status:'NO_ACTIVE_INTEGRATION',access:'NO_ACTIVE_INTEGRATION',secrets:[],publicConfig:[],local:'BLOCKED',tests:'BLOCKED',e2e:'BLOCKED',staging:'UNRESOLVED',production:'UNRESOLVED'},
  {id:'public-analytics',status:'INTERNAL_EVENT_ONLY',access:'NO_EXTERNAL_INTEGRATION',secrets:[],publicConfig:[],local:'ALLOWED',tests:'LOCAL_ONLY',e2e:'LOCAL_ONLY',staging:'LOCAL_ONLY',production:'LOCAL_ONLY'},
  {id:'openai-sites-cloudflare-runtime',status:'HOSTING_RUNTIME',access:'RUNTIME_BOUNDARY',secrets:[],publicConfig:[],local:'LOCAL_EMULATION',tests:'LOCAL_ONLY',e2e:'LOCAL_ONLY',staging:'SEPARATE_TASK',production:'SEPARATE_TASK'},
];
