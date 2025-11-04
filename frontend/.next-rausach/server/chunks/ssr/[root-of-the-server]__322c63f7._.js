module.exports=[59287,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored["react-ssr"].ReactServerDOMTurbopackClient},195109,(a,b,c)=>{"use strict";b.exports=a.r(918622)},321248,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored["react-ssr"].ReactJsxRuntime},651332,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored["react-ssr"].React},194296,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored["react-ssr"].ReactDOM},788787,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored.contexts.AppRouterContext},259689,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored.contexts.HooksClientContext},160324,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored.contexts.ServerInsertedHtml},43285,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/dynamic-access-async-storage.external.js",()=>require("next/dist/server/app-render/dynamic-access-async-storage.external.js"))},918622,(a,b,c)=>{b.exports=a.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},120635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},324725,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},224361,(a,b,c)=>{b.exports=a.x("util",()=>require("util"))},669055,772664,a=>{"use strict";let b=(0,a.i(367990).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);a.s(["default",()=>b],772664),a.s(["ChevronDown",()=>b],669055)},363615,551572,a=>{"use strict";let b=(0,a.i(367990).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);a.s(["default",()=>b],551572),a.s(["X",()=>b],363615)},160261,a=>{"use strict";let b=(0,a.i(367990).default)("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);a.s(["default",()=>b])},327987,a=>{"use strict";var b=a.i(160261);a.s(["AlertCircle",()=>b.default])},234211,a=>{"use strict";var b=a.i(651332);let c={toasts:[]},d=new Set;function e(){d.forEach(a=>a())}let f=0;function g(){let[a,g]=(0,b.useState)(c),h=(0,b.useCallback)(a=>(d.add(a),()=>{d.delete(a)}),[]),i=(0,b.useCallback)(a=>{let b=(++f).toString(),d={id:b,...a,duration:a.duration??5e3};return c={...c,toasts:[...c.toasts,d]},e(),d.duration&&d.duration>0&&setTimeout(()=>{c={...c,toasts:c.toasts.filter(a=>a.id!==b)},e()},d.duration),b},[]),j=(0,b.useCallback)(a=>{c={...c,toasts:c.toasts.filter(b=>b.id!==a)},e()},[]),k=(0,b.useCallback)(()=>{c={...c,toasts:[]},e()},[]);return b.default.useEffect(()=>h(()=>{g(c)}),[h]),{...a,toast:i,dismiss:j,dismissAll:k}}a.s(["toast",0,a=>{let b=(++f).toString(),d={id:b,...a,duration:a.duration??5e3};return c={...c,toasts:[...c.toasts,d]},e(),d.duration&&d.duration>0&&setTimeout(()=>{c={...c,toasts:c.toasts.filter(a=>a.id!==b)},e()},d.duration),b},"useToast",()=>g])},779149,864080,a=>{"use strict";let b=(0,a.i(367990).default)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);a.s(["default",()=>b],864080),a.s(["User",()=>b],779149)},537825,a=>{"use strict";let b=(0,a.i(367990).default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);a.s(["default",()=>b])},890082,a=>{"use strict";var b=a.i(537825);a.s(["CheckCircle2",()=>b.default])},499094,a=>{"use strict";let b=(0,a.i(367990).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);a.s(["default",()=>b])},897608,a=>{"use strict";var b=a.i(499094);a.s(["AlertTriangle",()=>b.default])},992288,a=>{"use strict";let b=(0,a.i(367990).default)("message-circle",[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]);a.s(["default",()=>b])},646254,a=>{"use strict";var b=a.i(992288);a.s(["MessageCircle",()=>b.default])},18892,a=>{"use strict";var b=a.i(168918),c=a.i(772213);let d=c.gql`
  query GetPublicWebsiteSettings(
    $category: String
    $group: String
    $keys: [String!]
  ) {
    publicWebsiteSettings(
      category: $category
      group: $group
      keys: $keys
    ) {
      id
      key
      label
      value
      description
      type
      category
      group
      order
      options
      validation
      isActive
      isPublic
      createdAt
      updatedAt
    }
  }
`,e=c.gql`
  query GetHeaderSettings {
    headerSettings {
      id
      key
      label
      value
      description
      type
      category
      group
      order
      options
      validation
      isActive
      isPublic
      createdAt
      updatedAt
    }
  }
`,f=c.gql`
  query GetFooterSettings {
    footerSettings {
      id
      key
      label
      value
      description
      type
      category
      group
      order
      options
      validation
      isActive
      isPublic
      createdAt
      updatedAt
    }
  }
`;function g(){let{data:a,loading:c,error:d}=(0,b.useQuery)(e,{fetchPolicy:"network-only"});return{data:a?.headerSettings||[],loading:c,error:d}}function h(){let{data:a,loading:c,error:d}=(0,b.useQuery)(f,{fetchPolicy:"network-only"});return{data:a?.footerSettings||[],loading:c,error:d}}function i(){let{data:a,loading:c,error:e}=(0,b.useQuery)(d,{variables:{category:"CONTACT"},fetchPolicy:"network-only"});return{data:a?.publicWebsiteSettings||[],loading:c,error:e}}function j(){let{data:a,loading:c,error:e}=(0,b.useQuery)(d,{variables:{category:"SOCIAL"},fetchPolicy:"network-only"});return{data:a?.publicWebsiteSettings||[],loading:c,error:e}}function k(a){return a.reduce((a,b)=>(a[b.key]=function(a){if(!a.value)return null;switch(a.type){case"BOOLEAN":return"true"===a.value;case"NUMBER":return parseFloat(a.value);case"JSON":try{return JSON.parse(a.value)}catch{return null}default:return a.value}}(b),a),{})}function l(a){let{settings:c,loading:e,error:f}=function(a){let{data:c=[],loading:e,error:f}=function(a){let{data:c,loading:e,error:f}=(0,b.useQuery)(d,{variables:{category:a},fetchPolicy:"network-only"});return{data:c?.publicWebsiteSettings||[],loading:e,error:f}}(void 0);return{settings:k(c),loading:e,error:f}}();return{value:c[a],loading:e,error:f}}a.s(["settingsToMap",()=>k,"useContactSettings",()=>i,"useFooterSettings",()=>h,"useHeaderSettings",()=>g,"useSocialSettings",()=>j,"useWebsiteSetting",()=>l],18892)},106107,a=>{"use strict";var b=a.i(18892);function c(){let{value:a,loading:c}=(0,b.useWebsiteSetting)("site.name");return{siteName:a||"NoNameCore",loading:c}}a.s(["useSiteName",()=>c])},276357,a=>{"use strict";let b=(0,a.i(367990).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);a.s(["default",()=>b])},502794,a=>{"use strict";var b=a.i(276357);a.s(["Send",()=>b.default])},757722,a=>{"use strict";let b=(0,a.i(367990).default)("paperclip",[["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",key:"1miecu"}]]);a.s(["default",()=>b])},522734,(a,b,c)=>{b.exports=a.x("fs",()=>require("fs"))},792509,(a,b,c)=>{b.exports=a.x("url",()=>require("url"))},921517,(a,b,c)=>{b.exports=a.x("http",()=>require("http"))},524836,(a,b,c)=>{b.exports=a.x("https",()=>require("https"))},347338,(a,b,c)=>{function d(a,b,c,d){return Math.round(a/c)+" "+d+(b>=1.5*c?"s":"")}b.exports=function(a,b){b=b||{};var c,e,f,g,h=typeof a;if("string"===h&&a.length>0){var i=a;if(!((i=String(i)).length>100)){var j=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(i);if(j){var k=parseFloat(j[1]);switch((j[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return 315576e5*k;case"weeks":case"week":case"w":return 6048e5*k;case"days":case"day":case"d":return 864e5*k;case"hours":case"hour":case"hrs":case"hr":case"h":return 36e5*k;case"minutes":case"minute":case"mins":case"min":case"m":return 6e4*k;case"seconds":case"second":case"secs":case"sec":case"s":return 1e3*k;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return k;default:break}}}return}if("number"===h&&isFinite(a)){return b.long?(e=Math.abs(c=a))>=864e5?d(c,e,864e5,"day"):e>=36e5?d(c,e,36e5,"hour"):e>=6e4?d(c,e,6e4,"minute"):e>=1e3?d(c,e,1e3,"second"):c+" ms":(g=Math.abs(f=a))>=864e5?Math.round(f/864e5)+"d":g>=36e5?Math.round(f/36e5)+"h":g>=6e4?Math.round(f/6e4)+"m":g>=1e3?Math.round(f/1e3)+"s":f+"ms"}throw Error("val is not a non-empty string or a valid number. val="+JSON.stringify(a))}},870722,(a,b,c)=>{b.exports=a.x("tty",()=>require("tty"))},446786,(a,b,c)=>{b.exports=a.x("os",()=>require("os"))},754938,(a,b,c)=>{"use strict";b.exports=(a,b=process.argv)=>{let c=a.startsWith("-")?"":1===a.length?"-":"--",d=b.indexOf(c+a),e=b.indexOf("--");return -1!==d&&(-1===e||d<e)}},586933,(a,b,c)=>{"use strict";let d;a.r(446786);let e=a.r(870722),f=a.r(754938),{env:g}=process;function h(a,b={}){var c;return 0!==(c=function(a,{streamIsTTY:b,sniffFlags:c=!0}={}){let e=function(){if("FORCE_COLOR"in g)return"true"===g.FORCE_COLOR?1:"false"===g.FORCE_COLOR?0:0===g.FORCE_COLOR.length?1:Math.min(Number.parseInt(g.FORCE_COLOR,10),3)}();void 0!==e&&(d=e);let h=c?d:e;if(0===h)return 0;if(c){if(f("color=16m")||f("color=full")||f("color=truecolor"))return 3;if(f("color=256"))return 2}if(a&&!b&&void 0===h)return 0;let i=h||0;if("dumb"===g.TERM)return i;if("CI"in g)return["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI","GITHUB_ACTIONS","BUILDKITE","DRONE"].some(a=>a in g)||"codeship"===g.CI_NAME?1:i;if("TEAMCITY_VERSION"in g)return+!!/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(g.TEAMCITY_VERSION);if("truecolor"===g.COLORTERM)return 3;if("TERM_PROGRAM"in g){let a=Number.parseInt((g.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(g.TERM_PROGRAM){case"iTerm.app":return a>=3?3:2;case"Apple_Terminal":return 2}}return/-256(color)?$/i.test(g.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(g.TERM)||"COLORTERM"in g?1:i}(a,{streamIsTTY:a&&a.isTTY,...b}))&&{level:c,hasBasic:!0,has256:c>=2,has16m:c>=3}}f("no-color")||f("no-colors")||f("color=false")||f("color=never")?d=0:(f("color")||f("colors")||f("color=true")||f("color=always"))&&(d=1),b.exports={supportsColor:h,stdout:h({isTTY:e.isatty(1)}),stderr:h({isTTY:e.isatty(2)})}},688947,(a,b,c)=>{b.exports=a.x("stream",()=>require("stream"))},406461,(a,b,c)=>{b.exports=a.x("zlib",()=>require("zlib"))},254799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},427699,(a,b,c)=>{b.exports=a.x("events",()=>require("events"))},542549,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"HandleISRError",{enumerable:!0,get:function(){return e}});let d=a.r(556704).workAsyncStorage;function e({error:a}){if(d){let b=d.getStore();if(b?.isStaticGeneration)throw a&&console.error(a),a}return null}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},823916,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"default",{enumerable:!0,get:function(){return h}});let d=a.r(321248),e=a.r(542549),f={fontFamily:'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',height:"100vh",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},g={fontSize:"14px",fontWeight:400,lineHeight:"28px",margin:"0 8px"},h=function({error:a}){let b=a?.digest;return(0,d.jsxs)("html",{id:"__next_error__",children:[(0,d.jsx)("head",{}),(0,d.jsxs)("body",{children:[(0,d.jsx)(e.HandleISRError,{error:a}),(0,d.jsx)("div",{style:f,children:(0,d.jsxs)("div",{children:[(0,d.jsxs)("h2",{style:g,children:["Application error: a ",b?"server":"client","-side exception has occurred while loading ",window.location.hostname," (see the"," ",b?"server logs":"browser console"," for more information)."]}),b?(0,d.jsx)("p",{style:g,children:`Digest: ${b}`}):null]})})]})]})};("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},149208,a=>{"use strict";let b=(0,a.i(367990).default)("check-check",[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]]);a.s(["default",()=>b])},208172,a=>{"use strict";var b=a.i(149208);a.s(["CheckCheck",()=>b.default])},468396,a=>{"use strict";let b=(0,a.i(367990).default)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);a.s(["default",()=>b])},122455,a=>{"use strict";var b=a.i(468396);a.s(["Info",()=>b.default])},480411,a=>{"use strict";let b=(0,a.i(367990).default)("bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]);a.s(["default",()=>b])},500891,a=>{"use strict";var b=a.i(480411);a.s(["Bot",()=>b.default])},649515,a=>{"use strict";var b=a.i(772213);let c=b.gql`
  query GetSupportConversations($where: SupportConversationWhereInput, $take: Int) {
    supportConversations(where: $where, take: $take) {
      id
      conversationCode
      customerName
      customerEmail
      customerPhone
      status
      priority
      platform
      platformUserName
      subject
      tags
      lastMessageAt
      lastMessagePreview
      rating
      startedAt
      closedAt
      createdAt
      customer {
        id
        email
        username
        firstName
        lastName
        avatar
      }
      assignedAgent {
        id
        username
        firstName
        lastName
        avatar
        email
      }
      messages {
        id
        content
        senderType
        senderName
        isAIGenerated
        aiConfidence
        isRead
        sentAt
        createdAt
        sender {
          id
          username
          firstName
          lastName
          avatar
        }
      }
    }
  }
`,d=b.gql`
  query GetSupportConversation($id: String!) {
    supportConversation(id: $id) {
      id
      conversationCode
      customerName
      customerEmail
      customerPhone
      customerIp
      customerLocation
      status
      priority
      platform
      platformUserId
      platformUserName
      subject
      tags
      notes
      lastMessageAt
      lastMessagePreview
      rating
      feedback
      startedAt
      closedAt
      createdAt
      updatedAt
      customer {
        id
        email
        username
        firstName
        lastName
        avatar
        phone
      }
      assignedAgent {
        id
        username
        firstName
        lastName
        avatar
        email
      }
      messages {
        id
        content
        senderType
        senderName
        isAIGenerated
        aiConfidence
        isRead
        sentAt
        createdAt
        sender {
          id
          username
          firstName
          lastName
          avatar
        }
      }
    }
  }
`,e=b.gql`
  mutation CreateSupportConversation($input: CreateSupportConversationInput!) {
    createSupportConversation(input: $input) {
      id
      conversationCode
      customerName
      customerEmail
      status
      platform
      createdAt
    }
  }
`,f=b.gql`
  mutation AssignConversationToAgent($conversationId: String!, $agentId: String!) {
    assignConversationToAgent(conversationId: $conversationId, agentId: $agentId) {
      id
      assignedAgent {
        id
        username
        firstName
        lastName
        avatar
        email
      }
      assignedAt
    }
  }
`,g=b.gql`
  mutation SendSupportMessage($input: CreateSupportMessageInput!) {
    sendSupportMessage(input: $input) {
      id
      conversationId
      content
      senderType
      senderName
      isAIGenerated
      sentAt
      createdAt
    }
  }
`;b.gql`
  mutation MarkMessagesAsRead($conversationId: String!, $userId: String!) {
    markMessagesAsRead(conversationId: $conversationId, userId: $userId) {
      count
    }
  }
`;let h=b.gql`
  mutation UpdateConversationStatus($conversationId: String!, $status: SupportConversationStatus!) {
    updateConversationStatus(conversationId: $conversationId, status: $status) {
      id
      status
      closedAt
    }
  }
`;b.gql`
  mutation RateConversation($conversationId: String!, $rating: Int!, $feedback: String) {
    rateConversation(conversationId: $conversationId, rating: $rating, feedback: $feedback) {
      id
      rating
      feedback
    }
  }
`,b.gql`
  query GetSupportAnalytics {
    supportAnalytics {
      totalConversations
      activeConversations
      waitingConversations
      closedConversations
      averageResponseTime
      averageResolutionTime
      customerSatisfactionScore
      totalMessages
      aiGeneratedMessages
      platformBreakdown {
        platform
        count
      }
      agentPerformance {
        agentId
        agentName
        conversationsHandled
        averageResponseTime
        satisfactionScore
      }
    }
  }
`,a.s(["ASSIGN_CONVERSATION_TO_AGENT",0,f,"CREATE_SUPPORT_CONVERSATION",0,e,"GET_SUPPORT_CONVERSATION",0,d,"GET_SUPPORT_CONVERSATIONS",0,c,"SEND_SUPPORT_MESSAGE",0,g,"UPDATE_CONVERSATION_STATUS",0,h])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__322c63f7._.js.map