(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,715200,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},930702,802805,e=>{"use strict";var t=e.i(403055);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)},n=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim();var s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let a=(0,t.forwardRef)(({color:e="currentColor",size:r=24,strokeWidth:a=2,absoluteStrokeWidth:o,className:i="",children:l,iconNode:c,...u},d)=>(0,t.createElement)("svg",{ref:d,...s,width:r,height:r,stroke:e,strokeWidth:o?24*Number(a)/Number(r):a,className:n("lucide",i),...!l&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(l)?l:[l]]));e.s(["default",()=>a],802805);let o=(e,s)=>{let o=(0,t.forwardRef)(({className:o,...i},l)=>(0,t.createElement)(a,{ref:l,iconNode:s,className:n(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,o),...i}));return o.displayName=r(e),o};e.s(["default",()=>o],930702)},477469,e=>{"use strict";var t=function(e,r){return(t=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,r)};function r(e,r){if("function"!=typeof r&&null!==r)throw TypeError("Class extends value "+String(r)+" is not a constructor or null");function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}var n=function(){return(n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var s in t=arguments[r])Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);return e}).apply(this,arguments)};function s(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var s=0,n=Object.getOwnPropertySymbols(e);s<n.length;s++)0>t.indexOf(n[s])&&Object.prototype.propertyIsEnumerable.call(e,n[s])&&(r[n[s]]=e[n[s]]);return r}function a(e,t,r,n){return new(r||(r=Promise))(function(s,a){function o(e){try{l(n.next(e))}catch(e){a(e)}}function i(e){try{l(n.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?s(e.value):((t=e.value)instanceof r?t:new r(function(e){e(t)})).then(o,i)}l((n=n.apply(e,t||[])).next())})}function o(e,t){var r,n,s,a={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]},o=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return o.next=i(0),o.throw=i(1),o.return=i(2),"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function i(i){return function(l){var c=[i,l];if(r)throw TypeError("Generator is already executing.");for(;o&&(o=0,c[0]&&(a=0)),a;)try{if(r=1,n&&(s=2&c[0]?n.return:c[0]?n.throw||((s=n.return)&&s.call(n),0):n.next)&&!(s=s.call(n,c[1])).done)return s;switch(n=0,s&&(c=[2&c[0],s.value]),c[0]){case 0:case 1:s=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,n=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!(s=(s=a.trys).length>0&&s[s.length-1])&&(6===c[0]||2===c[0])){a=0;continue}if(3===c[0]&&(!s||c[1]>s[0]&&c[1]<s[3])){a.label=c[1];break}if(6===c[0]&&a.label<s[1]){a.label=s[1],s=c;break}if(s&&a.label<s[2]){a.label=s[2],a.ops.push(c);break}s[2]&&a.ops.pop(),a.trys.pop();continue}c=t.call(e,a)}catch(e){c=[6,e],n=0}finally{r=s=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}}}function i(e,t,r){if(r||2==arguments.length)for(var n,s=0,a=t.length;s<a;s++)!n&&s in t||(n||(n=Array.prototype.slice.call(t,0,s)),n[s]=t[s]);return e.concat(n||Array.prototype.slice.call(t))}"function"==typeof SuppressedError&&SuppressedError,e.s(["__assign",()=>n,"__awaiter",()=>a,"__extends",()=>r,"__generator",()=>o,"__rest",()=>s,"__spreadArray",()=>i])},196446,e=>{"use strict";var t=e.i(919474),r=e.i(21223).canUseDOM?t.useLayoutEffect:t.useEffect;e.s(["useIsomorphicLayoutEffect",()=>r])},950988,e=>{"use strict";var t=e.i(477469),r=e.i(919474),n=e.i(648607),s=e.i(829319),a=e.i(413772),o=e.i(109709),i=e.i(529590),l=e.i(196446),c=e.i(855762);function u(e,u){!1!==globalThis.__DEV__&&(0,c.useWarnRemovedOption)(u||{},"ignoreResults","useMutation","If you don't want to synchronize component state with the mutation, please use the `useApolloClient` hook to get the client instance and call `client.mutate` directly.");var d=(0,i.useApolloClient)(null==u?void 0:u.client);(0,a.verifyDocumentType)(e,a.DocumentType.Mutation);var f=r.useState({called:!1,loading:!1,client:d}),p=f[0],g=f[1],m=r.useRef({result:p,mutationId:0,isMounted:!0,client:d,mutation:e,options:u});(0,l.useIsomorphicLayoutEffect)(function(){Object.assign(m.current,{client:d,options:u,mutation:e})});var h=r.useCallback(function(e){void 0===e&&(e={});var r=m.current,a=r.options,i=r.mutation,l=(0,t.__assign)((0,t.__assign)({},a),{mutation:i}),c=e.client||m.current.client;m.current.result.loading||l.ignoreResults||!m.current.isMounted||g(m.current.result={loading:!0,error:void 0,data:void 0,called:!0,client:c});var u=++m.current.mutationId,d=(0,n.mergeOptions)(l,e);return c.mutate(d).then(function(t){var r,n,a=t.data,i=t.errors,l=i&&i.length>0?new o.ApolloError({graphQLErrors:i}):void 0,f=e.onError||(null==(r=m.current.options)?void 0:r.onError);if(l&&f&&f(l,d),u===m.current.mutationId&&!d.ignoreResults){var p={called:!0,loading:!1,data:a,error:l,client:c};m.current.isMounted&&!(0,s.equal)(m.current.result,p)&&g(m.current.result=p)}var h=e.onCompleted||(null==(n=m.current.options)?void 0:n.onCompleted);return l||null==h||h(t.data,d),t},function(t){if(u===m.current.mutationId&&m.current.isMounted){var r,n={loading:!1,error:t,data:void 0,called:!0,client:c};(0,s.equal)(m.current.result,n)||g(m.current.result=n)}var a=e.onError||(null==(r=m.current.options)?void 0:r.onError);if(a)return a(t,d),{data:void 0,errors:t};throw t})},[]),y=r.useCallback(function(){if(m.current.isMounted){var e={called:!1,loading:!1,client:m.current.client};Object.assign(m.current,{mutationId:0,result:e}),g(e)}},[]);return r.useEffect(function(){var e=m.current;return e.isMounted=!0,function(){e.isMounted=!1}},[]),[h,(0,t.__assign)({reset:y},p)]}e.s(["useMutation",()=>u])},397965,e=>{"use strict";let t=(0,e.i(930702).default)("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);e.s(["default",()=>t])},198513,e=>{"use strict";var t=e.i(397965);e.s(["AlertCircle",()=>t.default])},784386,422844,e=>{"use strict";let t=(0,e.i(930702).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["default",()=>t],422844),e.s(["ChevronDown",()=>t],784386)},888540,999265,e=>{"use strict";let t=(0,e.i(930702).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["default",()=>t],999265),e.s(["X",()=>t],888540)},4993,e=>{"use strict";var t=e.i(403055);let r={toasts:[]},n=new Set;function s(){n.forEach(e=>e())}let a=0;function o(){let[e,o]=(0,t.useState)(r),i=(0,t.useCallback)(e=>(n.add(e),()=>{n.delete(e)}),[]),l=(0,t.useCallback)(e=>{let t=(++a).toString(),n={id:t,...e,duration:e.duration??5e3};return r={...r,toasts:[...r.toasts,n]},s(),n.duration&&n.duration>0&&setTimeout(()=>{r={...r,toasts:r.toasts.filter(e=>e.id!==t)},s()},n.duration),t},[]),c=(0,t.useCallback)(e=>{r={...r,toasts:r.toasts.filter(t=>t.id!==e)},s()},[]),u=(0,t.useCallback)(()=>{r={...r,toasts:[]},s()},[]);return t.default.useEffect(()=>i(()=>{o(r)}),[i]),{...e,toast:l,dismiss:c,dismissAll:u}}e.s(["toast",0,e=>{let t=(++a).toString(),n={id:t,...e,duration:e.duration??5e3};return r={...r,toasts:[...r.toasts,n]},s(),n.duration&&n.duration>0&&setTimeout(()=>{r={...r,toasts:r.toasts.filter(e=>e.id!==t)},s()},n.duration),t},"useToast",()=>o])},538476,e=>{"use strict";var t,r=e.i(477469),n=e.i(919474),s=e.i(648607),a=e.i(429105),o=e.i(196446),i=e.i(855762),l=e.i(122363),c=e.i(399487);function u(){}var d=["refetch","reobserve","fetchMore","updateQuery","startPolling","stopPolling","subscribeToMore"],f=["initialFetchPolicy","onCompleted","onError","defaultOptions","partialRefetch","canonizeResults"],p=["query","ssr","client","fetchPolicy","nextFetchPolicy","refetchWritePolicy","errorPolicy","pollInterval","notifyOnNetworkStatusChange","returnPartialData","skipPollAttempt"];function g(e,g){if(!1!==globalThis.__DEV__){var m,h=g||{};(0,i.useWarnRemovedOption)(h,"canonizeResults","useLazyQuery"),(0,i.useWarnRemovedOption)(h,"variables","useLazyQuery","Pass all `variables` to the returned `execute` function instead."),(0,i.useWarnRemovedOption)(h,"context","useLazyQuery","Pass `context` to the returned `execute` function instead."),(0,i.useWarnRemovedOption)(h,"onCompleted","useLazyQuery","If your `onCompleted` callback sets local state, switch to use derived state using `data` returned from the hook instead. Use `useEffect` to perform side-effects as a result of updates to `data`."),(0,i.useWarnRemovedOption)(h,"onError","useLazyQuery","If your `onError` callback sets local state, switch to use derived state using `data`, `error` or `errors` returned from the hook instead. Use `useEffect` if you need to perform side-effects as a result of updates to `data`, `error` or `errors`."),(0,i.useWarnRemovedOption)(h,"defaultOptions","useLazyQuery","Pass the options directly to the hook instead."),(0,i.useWarnRemovedOption)(h,"initialFetchPolicy","useLazyQuery","Use the `fetchPolicy` option instead."),(0,i.useWarnRemovedOption)(h,"partialRefetch","useLazyQuery")}var y=n.useRef(void 0),v=n.useRef(void 0),w=n.useRef(void 0),b=(0,s.mergeOptions)(g,y.current||{}),x=null!=(m=null==b?void 0:b.query)?m:e;v.current=g,w.current=x;var k=(0,r.__assign)((0,r.__assign)({},b),{skip:!y.current}),S=(0,a.useQueryInternals)(x,k),A=S.obsQueryFields,N=S.result,E=S.client,I=S.resultData,P=S.observable,C=S.onQueryExecuted,j=P.options.initialFetchPolicy||(0,a.getDefaultFetchPolicy)(k.defaultOptions,E.defaultOptions),T=n.useReducer(function(e){return e+1},0)[1],O=n.useMemo(function(){for(var e={},t=function(t){var r=A[t];e[t]=function(){return!1!==globalThis.__DEV__&&"reobserve"===t&&!1!==globalThis.__DEV__&&l.invariant.warn(80),y.current||(y.current=Object.create(null),T()),r.apply(this,arguments)}},r=0;r<d.length;r++)t(d[r]);return e},[T,A]),$=!!y.current,L=n.useMemo(function(){return(0,r.__assign)((0,r.__assign)((0,r.__assign)({},N),O),{called:$})},[N,O,$]),_=(t||(t=n.createContext(null)),n.useCallback(function(){var e=console.error;try{return console.error=u,n.useContext(t),!0}catch(e){return!1}finally{console.error=e}},[])),M=n.useRef(new Set),R=n.useCallback(function(e){if(!1!==globalThis.__DEV__){_()&&!1!==globalThis.__DEV__&&l.invariant.warn(81);for(var t,n,o,i,u,d,g,m,h,b=0;b<f.length;b++){var k=f[b];M.current.has(k)||((0,c.warnRemovedOption)(e||{},k,"useLazyQuery.execute"),M.current.add(k))}for(var S=0;S<p.length;S++){var A=p[S];M.current.has(A)||((0,c.warnRemovedOption)(e||{},A,"useLazyQuery.execute","Please pass the option to the `useLazyQuery` hook instead."),M.current.add(A))}}y.current=e?(0,r.__assign)((0,r.__assign)({},e),{fetchPolicy:e.fetchPolicy||j}):{fetchPolicy:j};var N=(0,s.mergeOptions)(v.current,(0,r.__assign)({query:w.current},y.current)),T=(t=I,n=P,o=E,i=x,u=(0,r.__assign)((0,r.__assign)({},N),{skip:!1}),d=C,g=u.query||i,m=(0,a.createMakeWatchQueryOptions)(o,g,u,!1)(n),h=n.reobserveAsConcast((0,a.getObsQueryOptions)(n,o,u,m)),d(m),new Promise(function(e){var r;h.subscribe({next:function(e){r=e},error:function(){e((0,a.toQueryResult)(n.getCurrentResult(),t.previousData,n,o))},complete:function(){e((0,a.toQueryResult)(n.maskResult(r),t.previousData,n,o))}})})).then(function(e){return Object.assign(e,O)});return T.catch(function(){}),T},[_,E,x,O,j,P,I,C]),D=n.useRef(R);return(0,o.useIsomorphicLayoutEffect)(function(){D.current=R}),[n.useCallback(function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return D.current.apply(D,e)},[]),L]}e.s(["useLazyQuery",()=>g],538476)},123959,e=>{"use strict";var t=e.i(44990),r=e.i(403055),n=e.i(538476),s=e.i(950988),a=e.i(984804);let o=a.gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      user {
        id
        email
        username
        role
        avatar
        createdAt
      }
      accessToken
    }
  }
`,i=a.gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      user {
        id
        email
        username
        role
        avatar
        createdAt
      }
      accessToken
    }
  }
`,l=a.gql`
  query GetCurrentUser {
    getMe {
      id
      email
      username
      roleType
      avatar
      firstName
      lastName
      createdAt
      updatedAt
      roles {
        id
        name
        displayName
        permissions {
          id
          name
          displayName
          resource
          action
        }
      }
      permissions {
        id
        name
        displayName
        resource
        action
      }
    }
  }
`;a.gql`
  query GetPosts($filters: PostFiltersInput, $pagination: PaginationInput!) {
    getPosts(filters: $filters, pagination: $pagination) {
      items {
        id
        title
        excerpt
        slug
        status
        publishedAt
        createdAt
        updatedAt
        author {
          id
          username
          avatar
        }
        commentsCount
      }
      meta {
        total
        page
        totalPages
        hasNextPage
        hasPrevPage
        limit
      }
    }
  }
`,a.gql`
  query GetPostBySlug($slug: String!) {
    getPostBySlug(slug: $slug) {
      id
      title
      content
      excerpt
      slug
      status
      publishedAt
      createdAt
      updatedAt
      author {
        id
        username
        avatar
      }
      commentsCount
    }
  }
`,a.gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      excerpt
      slug
      status
      publishedAt
      createdAt
    }
  }
`,a.gql`
  mutation UpdatePost($id: String!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      excerpt
      slug
      status
      publishedAt
      updatedAt
    }
  }
`,a.gql`
  mutation DeletePost($id: String!) {
    deletePost(id: $id) {
      id
      title
    }
  }
`,a.gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      createdAt
      author {
        id
        username
        avatar
      }
      post {
        id
        title
      }
    }
  }
`,a.gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id) {
      id
    }
  }
`,a.gql`
  mutation UploadFile($file: Upload!, $bucket: String!) {
    uploadFile(file: $file, bucket: $bucket) {
      filename
      mimetype
      encoding
      url
    }
  }
`,a.gql`
  query GenerateSummary($content: String!) {
    generateSummary(content: $content) {
      summary
      keywords
      sentiment
      readingTime
    }
  }
`,a.gql`
  query GeneratePostSuggestions($topic: String!) {
    generatePostSuggestions(topic: $topic) {
      title
      excerpt
      tags
    }
  }
`,a.gql`
  subscription PostCreated {
    postCreated {
      id
      title
      excerpt
      slug
      publishedAt
      author {
        id
        username
        avatar
      }
    }
  }
`,a.gql`
  subscription NewComment($postId: String!) {
    newComment(postId: $postId) {
      id
      content
      createdAt
      author {
        id
        username
        avatar
      }
      post {
        id
      }
    }
  }
`,a.gql`
  query HealthCheck {
    health {
      status
      info {
        database {
          status
        }
        redis {
          status
        }
        minio {
          status
        }
      }
    }
  }
`,a.gql`
  query SearchPosts($query: String!, $limit: Int, $offset: Int) {
    searchPosts(query: $query, limit: $limit, offset: $offset) {
      id
      title
      excerpt
      slug
      publishedAt
      author {
        id
        username
        avatar
      }
      _count {
        comments
      }
    }
  }
`,a.gql`
  mutation UpdateUserProfile($input: UpdateUserInput!) {
    updateUserProfile(input: $input) {
      id
      username
      email
      bio
      avatar
      updatedAt
    }
  }
`,a.gql`
  query GetUserPosts($userId: String!, $limit: Int, $offset: Int) {
    userPosts(userId: $userId, limit: $limit, offset: $offset) {
      id
      title
      excerpt
      slug
      status
      publishedAt
      createdAt
      _count {
        comments
      }
    }
  }
`;let c=(0,r.createContext)(void 0);e.s(["AuthProvider",0,({children:e})=>{let[a,u]=(0,r.useState)(null),[d,f]=(0,r.useState)(!0),[p,{data:g,error:m}]=(0,n.useLazyQuery)(l),[h]=(0,s.useMutation)(o),[y]=(0,s.useMutation)(i);(0,r.useEffect)(()=>{if(g?.getMe)console.log("%c✅ AuthContext - User authenticated successfully","color: #2ecc71; font-weight: bold;",g.getMe),u(g.getMe),f(!1);else if(m){let e=m.networkError,t=m.graphQLErrors||[];console.group("%c❌ AuthContext - Error Handling","color: #e74c3c; font-weight: bold;"),console.error("Full Error Object:",m),console.error("Network Error:",e),console.table(t.map(e=>({message:e.message,code:e.extensions?.code,path:e.path})));let r=e?.statusCode===401||e?.status===401;r&&console.log("%c🔐 401 HTTP Status Code detected - LOGOUT REQUIRED","color: #e74c3c; font-weight: bold;");let n=t.some(e=>{let t=e.extensions?.code==="UNAUTHENTICATED",r=e.extensions?.code==="FORBIDDEN";return t&&console.log("%c🔑 UNAUTHENTICATED error code detected","color: #f39c12;"),r&&console.log("%c🚫 FORBIDDEN error code detected","color: #f39c12;"),t||r});n&&console.log("%c🚨 Explicit auth-related GraphQL error detected - LOGOUT REQUIRED","color: #e74c3c; font-weight: bold;"),r||n?(console.log("%c🔓 LOGGING OUT - Clearing all auth data","color: #c0392b; font-weight: bold;"),console.table({"Current Token":localStorage.getItem("accessToken")?"EXISTS":"NONE",Action:"REMOVING",Timestamp:new Date().toISOString()}),localStorage.removeItem("accessToken"),localStorage.removeItem("refreshToken"),localStorage.removeItem("user"),console.log("%c✓ Auth data cleared from localStorage","color: #27ae60;"),u(null)):(console.log("%c⚠️  Transient network error detected - KEEPING TOKEN for retry","color: #f39c12; font-weight: bold;"),console.log("Error details:",{type:e?.name||"Unknown",message:e?.message,statusCode:e?.statusCode,willRetry:!0})),console.groupEnd(),f(!1)}},[g,m]),(0,r.useEffect)(()=>{localStorage.getItem("accessToken")?p():f(!1)},[p]);let v=async(e,t)=>{try{console.log("%c🔐 Login attempt started","color: #3498db; font-weight: bold;",{email:e,timestamp:new Date().toISOString()});let{data:r}=await h({variables:{input:{emailOrUsername:e,password:t}}});if(!r?.loginUser?.accessToken)return{success:!1,error:"Login failed"};{let e=r.loginUser.accessToken;return localStorage.setItem("accessToken",e),window.dispatchEvent(new StorageEvent("storage",{key:"accessToken",newValue:e,storageArea:localStorage})),p(),{success:!0}}}catch(e){return{success:!1,error:e.message||"Login failed"}}},w=async(e,t,r)=>{try{let{data:n}=await y({variables:{input:{email:e,password:t,username:r}}});if(!n?.registerUser?.accessToken)return{success:!1,error:"Registration failed"};{let e=n.registerUser.accessToken;return localStorage.setItem("accessToken",e),window.dispatchEvent(new StorageEvent("storage",{key:"accessToken",newValue:e,storageArea:localStorage})),p(),{success:!0}}}catch(e){return{success:!1,error:e.message||"Registration failed"}}},b=!!a;return(0,t.jsx)(c.Provider,{value:{user:a,login:v,register:w,logout:()=>{console.log("%c🚪 Manual logout triggered","color: #e74c3c; font-weight: bold;",{timestamp:new Date().toISOString()}),console.table({"Token Before":localStorage.getItem("accessToken")?"EXISTS":"NONE",Action:"REMOVING",User:a?.email||"NONE"}),localStorage.removeItem("accessToken"),localStorage.removeItem("refreshToken"),localStorage.removeItem("user"),console.log("%c✓ All auth data cleared","color: #27ae60;"),u(null)},loading:d,isAuthenticated:b},children:e})},"useAuth",0,()=>{let e=(0,r.useContext)(c);if(!e)throw console.warn("useAuth is being called outside of AuthProvider. This should not happen. Check your component tree."),Error("useAuth must be used within an AuthProvider");return e}],123959)},909905,109427,e=>{"use strict";let t=(0,e.i(930702).default)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);e.s(["default",()=>t],109427),e.s(["User",()=>t],909905)},671965,e=>{"use strict";let t=(0,e.i(930702).default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["default",()=>t])},112641,e=>{"use strict";var t=e.i(671965);e.s(["CheckCircle2",()=>t.default])},152523,e=>{"use strict";let t=(0,e.i(930702).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["default",()=>t])},169100,e=>{"use strict";var t=e.i(152523);e.s(["AlertTriangle",()=>t.default])},583493,e=>{"use strict";let t=(0,e.i(930702).default)("message-circle",[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]);e.s(["default",()=>t])},36455,e=>{"use strict";var t=e.i(583493);e.s(["MessageCircle",()=>t.default])},33925,e=>{"use strict";var t=e.i(429105),r=e.i(984804);let n=r.gql`
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
`,s=r.gql`
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
`,a=r.gql`
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
`;function o(){let{data:e,loading:r,error:n}=(0,t.useQuery)(s,{fetchPolicy:"network-only"});return{data:e?.headerSettings||[],loading:r,error:n}}function i(){let{data:e,loading:r,error:n}=(0,t.useQuery)(a,{fetchPolicy:"network-only"});return{data:e?.footerSettings||[],loading:r,error:n}}function l(){let{data:e,loading:r,error:s}=(0,t.useQuery)(n,{variables:{category:"CONTACT"},fetchPolicy:"network-only"});return{data:e?.publicWebsiteSettings||[],loading:r,error:s}}function c(){let{data:e,loading:r,error:s}=(0,t.useQuery)(n,{variables:{category:"SOCIAL"},fetchPolicy:"network-only"});return{data:e?.publicWebsiteSettings||[],loading:r,error:s}}function u(e){return e.reduce((e,t)=>(e[t.key]=function(e){if(!e.value)return null;switch(e.type){case"BOOLEAN":return"true"===e.value;case"NUMBER":return parseFloat(e.value);case"JSON":try{return JSON.parse(e.value)}catch{return null}default:return e.value}}(t),e),{})}function d(e){let{settings:r,loading:s,error:a}=function(e){let{data:r=[],loading:s,error:a}=function(e){let{data:r,loading:s,error:a}=(0,t.useQuery)(n,{variables:{category:e},fetchPolicy:"network-only"});return{data:r?.publicWebsiteSettings||[],loading:s,error:a}}(void 0);return{settings:u(r),loading:s,error:a}}();return{value:r[e],loading:s,error:a}}e.s(["settingsToMap",()=>u,"useContactSettings",()=>l,"useFooterSettings",()=>i,"useHeaderSettings",()=>o,"useSocialSettings",()=>c,"useWebsiteSetting",()=>d],33925)},756640,e=>{"use strict";var t=e.i(33925);function r(){let{value:e,loading:r}=(0,t.useWebsiteSetting)("site.name");return{siteName:e||"NoNameCore",loading:r}}e.s(["useSiteName",()=>r])},468289,e=>{"use strict";let t=(0,e.i(930702).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["default",()=>t])},451177,e=>{"use strict";var t=e.i(468289);e.s(["Send",()=>t.default])},599580,e=>{"use strict";let t=(0,e.i(930702).default)("paperclip",[["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",key:"1miecu"}]]);e.s(["default",()=>t])},20535,e=>{"use strict";let t=(0,e.i(930702).default)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);e.s(["default",()=>t])},461475,e=>{"use strict";var t=e.i(20535);e.s(["Info",()=>t.default])},854176,e=>{"use strict";let t=(0,e.i(930702).default)("check-check",[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]]);e.s(["default",()=>t])},796374,e=>{"use strict";var t=e.i(854176);e.s(["CheckCheck",()=>t.default])},176417,e=>{"use strict";let t=(0,e.i(930702).default)("bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]);e.s(["default",()=>t])},796283,e=>{"use strict";var t=e.i(176417);e.s(["Bot",()=>t.default])},216749,e=>{"use strict";var t=e.i(984804);let r=t.gql`
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
`,n=t.gql`
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
`,s=t.gql`
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
`,a=t.gql`
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
`,o=t.gql`
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
`;t.gql`
  mutation MarkMessagesAsRead($conversationId: String!, $userId: String!) {
    markMessagesAsRead(conversationId: $conversationId, userId: $userId) {
      count
    }
  }
`;let i=t.gql`
  mutation UpdateConversationStatus($conversationId: String!, $status: SupportConversationStatus!) {
    updateConversationStatus(conversationId: $conversationId, status: $status) {
      id
      status
      closedAt
    }
  }
`;t.gql`
  mutation RateConversation($conversationId: String!, $rating: Int!, $feedback: String) {
    rateConversation(conversationId: $conversationId, rating: $rating, feedback: $feedback) {
      id
      rating
      feedback
    }
  }
`,t.gql`
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
`,e.s(["ASSIGN_CONVERSATION_TO_AGENT",0,a,"CREATE_SUPPORT_CONVERSATION",0,s,"GET_SUPPORT_CONVERSATION",0,n,"GET_SUPPORT_CONVERSATIONS",0,r,"SEND_SUPPORT_MESSAGE",0,o,"UPDATE_CONVERSATION_STATUS",0,i])},856374,e=>{"use strict";var t=e.i(403055);function r(){let[e,r]=(0,t.useState)(null),[n,s]=(0,t.useState)({isStandalone:!1,canInstall:!1,hasNotificationSupport:!1,hasBackgroundSync:!1,hasPushSupport:!1,isOnline:navigator.onLine,serviceWorkerReady:!1}),[a,o]=(0,t.useState)(!1),[i,l]=(0,t.useState)(null);(0,t.useEffect)(()=>{s(t=>({...t,isStandalone:window.matchMedia("(display-mode: standalone)").matches||!0===window.navigator.standalone,canInstall:null!==e,hasNotificationSupport:"Notification"in window,hasBackgroundSync:"serviceWorker"in navigator&&"sync"in window.ServiceWorkerRegistration.prototype,hasPushSupport:"serviceWorker"in navigator&&"PushManager"in window,isOnline:navigator.onLine}));let t=()=>s(e=>({...e,isOnline:!0})),r=()=>s(e=>({...e,isOnline:!1}));return window.addEventListener("online",t),window.addEventListener("offline",r),()=>{window.removeEventListener("online",t),window.removeEventListener("offline",r)}},[e]),(0,t.useEffect)(()=>{"serviceWorker"in navigator&&"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js",{scope:"/"}).then(e=>{l(e),s(e=>({...e,serviceWorkerReady:!0})),e.addEventListener("updatefound",()=>{let t=e.installing;t&&t.addEventListener("statechange",()=>{"installed"===t.state&&navigator.serviceWorker.controller&&o(!0)})}),navigator.serviceWorker.addEventListener("message",e=>{"SYNC_SUCCESS"===e.data.type&&console.log("Background sync completed:",e.data.action)})}).catch(e=>{console.error("Service Worker registration failed:",e)})},[]),(0,t.useEffect)(()=>{let e=e=>{e.preventDefault(),r(e)};return window.addEventListener("beforeinstallprompt",e),()=>{window.removeEventListener("beforeinstallprompt",e)}},[]);let c=(0,t.useCallback)(async()=>{if(!e)throw Error("Install prompt not available");try{await e.prompt();let t=await e.userChoice;"accepted"===t.outcome?(console.log("PWA installation accepted"),r(null)):console.log("PWA installation dismissed")}catch(e){throw console.error("PWA installation failed:",e),e}},[e]),u=(0,t.useCallback)(async()=>{if(!("Notification"in window))throw Error("Notifications not supported");return"granted"===Notification.permission?"granted":await Notification.requestPermission()},[]),d=(0,t.useCallback)(async(e,t)=>{if("granted"!==await u())throw Error("Notification permission denied");i?await i.showNotification(e,{icon:"/icons/icon-192x192.png",badge:"/icons/badge-72x72.png",...t}):new Notification(e,{icon:"/icons/icon-192x192.png",...t})},[i]),f=(0,t.useCallback)(async e=>{if(!i||!n.hasBackgroundSync)throw Error("Background sync not supported");try{await i.sync.register(e),console.log("Background sync registered:",e)}catch(e){throw console.error("Background sync registration failed:",e),e}},[i,n.hasBackgroundSync]);return{capabilities:n,installPrompt:e,install:c,requestNotificationPermission:u,showNotification:d,registerBackgroundSync:f,clearCache:(0,t.useCallback)(async()=>{if("caches"in window){let e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e))),console.log("All caches cleared")}i?.active&&i.active.postMessage({type:"CLEAR_CACHE"})},[i]),updateAvailable:a,updateApp:(0,t.useCallback)(async()=>{if(!i)throw Error("Service worker not registered or not in browser environment");let e=i.waiting||i.installing;e&&(e.postMessage({type:"SKIP_WAITING"}),await new Promise(e=>{navigator.serviceWorker.addEventListener("controllerchange",()=>{e()})}),window.location.reload())},[i])}}let n=()=>"serviceWorker"in navigator&&"caches"in window&&"indexedDB"in window,s=()=>window.matchMedia("(display-mode: standalone)").matches||!0===window.navigator.standalone,a=()=>{let e=localStorage.getItem("pwa-last-prompt");return e?Math.max(0,6048e5-(Date.now()-parseInt(e))):0};e.s(["checkPWASupport",0,n,"getInstallPromptDelay",0,a,"isRunningStandalone",0,s,"shouldShowInstallPrompt",0,()=>!s()&&0===a()&&n(),"usePWA",()=>r])},528413,e=>{"use strict";var t=e.i(44990),r=e.i(403055),n=e.i(856374),s=e.i(756640);function a({className:e="",showDelay:a=5e3,position:o="bottom"}){let[i,l]=(0,r.useState)(!1),[c,u]=(0,r.useState)(!1),[d,f]=(0,r.useState)(!1),{siteName:p}=(0,s.useSiteName)(),{capabilities:g,installPrompt:m,install:h,showNotification:y}=(0,n.usePWA)();(0,r.useEffect)(()=>{if(!g.canInstall||g.isStandalone||c)return;let e=localStorage.getItem("pwa-install-dismissed");if(e){let t=parseInt(e);if(Date.now()-t<6048e5)return}let t=setTimeout(()=>{l(!0)},a);return()=>clearTimeout(t)},[g.canInstall,g.isStandalone,c,a]);let v=async()=>{if(m){f(!0);try{await h(),l(!1),g.hasNotificationSupport&&await y("App Installed Successfully!",{body:`${p} has been installed to your device. You can now access it from your home screen.`,tag:"pwa-install-success"})}catch(e){console.error("Install failed:",e)}finally{f(!1)}}};return i&&g.canInstall&&!g.isStandalone?(0,t.jsxs)("div",{className:`
      fixed ${{top:"top-4 left-1/2 transform -translate-x-1/2",bottom:"bottom-4 left-1/2 transform -translate-x-1/2",center:"top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"}[o]} z-50 max-w-sm mx-4
      bg-white rounded-lg shadow-2xl border border-gray-200
      animate-in slide-in-from-bottom-4 duration-300
      ${e}
    `,children:[(0,t.jsx)("div",{className:"p-4 pb-2",children:(0,t.jsxs)("div",{className:"flex items-start justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)("div",{className:"flex-shrink-0",children:(0,t.jsx)("div",{className:"w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center",children:(0,t.jsx)("svg",{className:"w-6 h-6 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"})})})}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("h3",{className:"text-lg font-semibold text-gray-900",children:["Install ",p]}),(0,t.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:"Add to your home screen for quick access"})]})]}),(0,t.jsx)("button",{onClick:()=>{u(!0),l(!1),localStorage.setItem("pwa-install-dismissed",Date.now().toString())},className:"text-gray-400 hover:text-gray-600 transition-colors","aria-label":"Dismiss install prompt",children:(0,t.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]})}),(0,t.jsx)("div",{className:"px-4 pb-2",children:(0,t.jsxs)("ul",{className:"space-y-1 text-sm text-gray-600",children:[(0,t.jsxs)("li",{className:"flex items-center space-x-2",children:[(0,t.jsx)("svg",{className:"w-4 h-4 text-green-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),(0,t.jsx)("span",{children:"Work offline"})]}),(0,t.jsxs)("li",{className:"flex items-center space-x-2",children:[(0,t.jsx)("svg",{className:"w-4 h-4 text-green-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),(0,t.jsx)("span",{children:"Faster loading"})]}),(0,t.jsxs)("li",{className:"flex items-center space-x-2",children:[(0,t.jsx)("svg",{className:"w-4 h-4 text-green-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),(0,t.jsx)("span",{children:"Push notifications"})]})]})}),(0,t.jsxs)("div",{className:"p-4 pt-2 space-y-2",children:[(0,t.jsx)("button",{onClick:v,disabled:d,className:" w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ",children:d?(0,t.jsxs)("div",{className:"flex items-center justify-center space-x-2",children:[(0,t.jsx)("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"}),(0,t.jsx)("span",{children:"Installing..."})]}):"Add to Home Screen"}),(0,t.jsx)("button",{onClick:()=>{l(!1),localStorage.setItem("pwa-install-dismissed",Date.now().toString()),setTimeout(()=>{u(!1)},2592e5)},className:" w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200 ",children:"Maybe Later"})]})]}):null}function o({variant:e="default",size:s="medium",className:a=""}){let[o,i]=(0,r.useState)(!1),{capabilities:l,install:c}=(0,n.usePWA)(),u=async()=>{i(!0);try{await c()}catch(e){console.error("Install failed:",e)}finally{i(!1)}};if(!l.canInstall||l.isStandalone)return null;let d={default:"bg-blue-600 text-white hover:bg-blue-700",minimal:"bg-gray-100 text-gray-700 hover:bg-gray-200",icon:"p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full"};return"icon"===e?(0,t.jsx)("button",{onClick:u,disabled:o,className:`
          ${d[e]} ${a}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `,title:"Install App","aria-label":"Install App",children:o?(0,t.jsx)("div",{className:"w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"}):(0,t.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"})})}):(0,t.jsx)("button",{onClick:u,disabled:o,className:`
        ${d[e]} ${{small:"px-2 py-1 text-sm",medium:"px-3 py-2 text-sm",large:"px-4 py-2 text-base"}[s]} ${a}
        font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
      `,children:o?(0,t.jsxs)("div",{className:"flex items-center justify-center space-x-2",children:[(0,t.jsx)("div",{className:"w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"}),(0,t.jsx)("span",{children:"Installing..."})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("svg",{className:"w-4 h-4 inline mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"})}),"Install App"]})})}e.s(["PWAInstallButton",()=>o,"PWAInstallPrompt",()=>a])},388594,e=>{"use strict";var t=e.i(308140);class r{db=null;dbName="rausachcoreOfflineDB";dbVersion=1;syncInProgress=!1;constructor(){"indexedDB"in window&&this.initDB()}async initDB(){return"indexedDB"in window?new Promise((e,t)=>{let r=indexedDB.open(this.dbName,this.dbVersion);r.onerror=()=>t(r.error),r.onsuccess=()=>{this.db=r.result,e()},r.onupgradeneeded=e=>{let t=e.target.result;if(!t.objectStoreNames.contains("tasks")){let e=t.createObjectStore("tasks",{keyPath:"id"});e.createIndex("status","status",{unique:!1}),e.createIndex("priority","priority",{unique:!1}),e.createIndex("createdAt","createdAt",{unique:!1}),e.createIndex("updatedAt","updatedAt",{unique:!1})}if(!t.objectStoreNames.contains("offlineActions")){let e=t.createObjectStore("offlineActions",{keyPath:"id",autoIncrement:!0});e.createIndex("timestamp","timestamp",{unique:!1}),e.createIndex("type","type",{unique:!1})}t.objectStoreNames.contains("syncMeta")||t.createObjectStore("syncMeta",{keyPath:"key"}),t.objectStoreNames.contains("cache")||t.createObjectStore("cache",{keyPath:"key"})}}):Promise.resolve()}async getTasks(){if(!this.db){if(!("indexedDB"in window))return[];await this.initDB()}return new Promise((e,t)=>{let r=this.db.transaction(["tasks"],"readonly").objectStore("tasks").getAll();r.onsuccess=()=>e(r.result||[]),r.onerror=()=>t(r.error)})}async getTask(e){return this.db||await this.initDB(),new Promise((t,r)=>{let n=this.db.transaction(["tasks"],"readonly").objectStore("tasks").get(e);n.onsuccess=()=>t(n.result||null),n.onerror=()=>r(n.error)})}async storeTask(e){return this.db||await this.initDB(),new Promise((t,r)=>{let n=this.db.transaction(["tasks"],"readwrite").objectStore("tasks").put({...e,lastModified:Date.now(),offline:!0});n.onsuccess=()=>t(),n.onerror=()=>r(n.error)})}async createTaskOffline(e){let t={...e,id:`offline_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return await this.storeTask(t),await this.queueAction({type:"CREATE",entity:"TASK",entityId:t.id,data:t,timestamp:Date.now(),retryCount:0,maxRetries:3}),t}async updateTaskOffline(e,t){let r=await this.getTask(e);if(!r)throw Error("Task not found");let n={...r,...t,updatedAt:new Date().toISOString()};return await this.storeTask(n),await this.queueAction({type:"UPDATE",entity:"TASK",entityId:e,data:t,timestamp:Date.now(),retryCount:0,maxRetries:3}),n}async deleteTaskOffline(e){return this.db||await this.initDB(),new Promise((t,r)=>{let n=this.db.transaction(["tasks"],"readwrite").objectStore("tasks").delete(e);n.onsuccess=()=>{this.queueAction({type:"DELETE",entity:"TASK",entityId:e,data:null,timestamp:Date.now(),retryCount:0,maxRetries:3}),t()},n.onerror=()=>r(n.error)})}async queueAction(e){return this.db||await this.initDB(),new Promise((t,r)=>{let n=this.db.transaction(["offlineActions"],"readwrite").objectStore("offlineActions").add(e);n.onsuccess=()=>t(),n.onerror=()=>r(n.error)})}async getPendingActions(){return this.db||await this.initDB(),new Promise((e,t)=>{let r=this.db.transaction(["offlineActions"],"readonly").objectStore("offlineActions").getAll();r.onsuccess=()=>e(r.result||[]),r.onerror=()=>t(r.error)})}async removeAction(e){return this.db||await this.initDB(),new Promise((t,r)=>{let n=this.db.transaction(["offlineActions"],"readwrite").objectStore("offlineActions").delete(e);n.onsuccess=()=>t(),n.onerror=()=>r(n.error)})}async syncWithServer(){if(this.syncInProgress)return{success:!1,error:"Sync already in progress"};this.syncInProgress=!0;try{let e=await this.getPendingActions(),t=[];for(let t of e)try{await this.processAction(t),await this.removeAction(t.id)}catch(e){console.error("Failed to sync action:",t,e),t.retryCount++,t.retryCount>=t.maxRetries?await this.removeAction(t.id):await this.updateAction(t)}return await this.updateSyncMeta("lastSync",Date.now()),{success:!0,conflicts:t.length>0?t:void 0}}catch(e){return{success:!1,error:e instanceof Error?e.message:"Unknown sync error"}}finally{this.syncInProgress=!1}}async processAction(e){let t,r=this.getAPIEndpoint(e.entity,e.type,e.entityId);switch(e.type){case"CREATE":t=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e.data)});break;case"UPDATE":t=await fetch(r,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e.data)});break;case"DELETE":t=await fetch(r,{method:"DELETE"});break;default:throw Error(`Unknown action type: ${e.type}`)}if(!t.ok)throw Error(`HTTP ${t.status}: ${t.statusText}`);if("CREATE"===e.type||"UPDATE"===e.type){let r=await t.json();await this.handleServerResponse(e,r)}}async handleServerResponse(e,t){if("TASK"===e.entity){let r=await this.getTask(e.entityId);if(r&&r.updatedAt!==t.updatedAt){let e=await this.resolveConflict(r,t);await this.storeTask(e)}else await this.storeTask(t)}}async resolveConflict(e,t){let r=new Date(e.updatedAt).getTime();return new Date(t.updatedAt).getTime()>r?t:e}async updateAction(e){return this.db||await this.initDB(),new Promise((t,r)=>{let n=this.db.transaction(["offlineActions"],"readwrite").objectStore("offlineActions").put(e);n.onsuccess=()=>t(),n.onerror=()=>r(n.error)})}getAPIEndpoint(e,r,n){let s=t.default.env.NEXT_PUBLIC_API_URL||"/api";if("TASK"===e)return"CREATE"===r?`${s}/tasks`:`${s}/tasks/${n}`;throw Error(`Unknown entity: ${e}`)}async updateSyncMeta(e,t){return this.db||await this.initDB(),new Promise((r,n)=>{let s=this.db.transaction(["syncMeta"],"readwrite").objectStore("syncMeta").put({key:e,value:t});s.onsuccess=()=>r(),s.onerror=()=>n(s.error)})}async getSyncMeta(e){return this.db||await this.initDB(),new Promise((t,r)=>{let n=this.db.transaction(["syncMeta"],"readonly").objectStore("syncMeta").get(e);n.onsuccess=()=>t(n.result?.value),n.onerror=()=>r(n.error)})}async getSyncStatus(){return{lastSync:await this.getSyncMeta("lastSync")||0,pendingActions:(await this.getPendingActions()).length,isOnline:navigator.onLine}}async forceSyncAll(){try{let e=await this.syncWithServer();return await this.fetchLatestData(),e}catch(e){return{success:!1,error:e instanceof Error?e.message:"Full sync failed"}}}async fetchLatestData(){try{let e=await fetch("/api/tasks");if(e.ok)for(let t of(await e.json()))await this.storeTask(t)}catch(e){console.error("Failed to fetch latest data:",e)}}async clearOfflineData(){for(let e of(this.db||await this.initDB(),["tasks","offlineActions","syncMeta","cache"]))await new Promise((t,r)=>{let n=this.db.transaction([e],"readwrite").objectStore(e).clear();n.onsuccess=()=>t(),n.onerror=()=>r(n.error)})}}let n=new r;e.s(["default",0,r,"offlineDataService",0,n])},489215,e=>{"use strict";var t=e.i(44990),r=e.i(403055),n=e.i(856374),s=e.i(388594);function a({className:e="",position:a="top",showSyncStatus:o=!0}){let[i,l]=(0,r.useState)(()=>navigator.onLine),[c,u]=(0,r.useState)(0),[d,f]=(0,r.useState)(!1),[p,g]=(0,r.useState)(null),{capabilities:m}=(0,n.usePWA)();return((0,r.useEffect)(()=>{l(navigator.onLine);let e=()=>l(!0),t=()=>l(!1);return window.addEventListener("online",e),window.addEventListener("offline",t),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",t)}},[]),(0,r.useEffect)(()=>{let e=async()=>{try{let e=await s.offlineDataService.getPendingActions();u(e.length);let t=await s.offlineDataService.getSyncStatus();f(!1),t.lastSync>0&&g(new Date(t.lastSync))}catch(e){console.error("Failed to get offline status:",e)}};e();let t=setInterval(e,2e3);return()=>clearInterval(t)},[]),(0,r.useEffect)(()=>{i&&c>0&&!d&&"serviceWorker"in navigator&&"sync"in window.ServiceWorkerRegistration.prototype&&navigator.serviceWorker.ready.then(e=>e.sync.register("background-sync")).catch(console.error)},[i,c,d]),i&&0===c&&!d)?null:(0,t.jsxs)("div",{className:`
      fixed ${{top:"top-4",bottom:"bottom-4"}[a]} right-4 z-40
      ${e}
    `,children:[!i&&(0,t.jsx)("div",{className:" bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-2 shadow-lg backdrop-blur-sm animate-in slide-in-from-right-4 duration-300 ",children:(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)("div",{className:"flex-shrink-0",children:(0,t.jsx)("div",{className:"w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center",children:(0,t.jsx)("svg",{className:"w-4 h-4 text-yellow-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"})})})}),(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsx)("p",{className:"text-sm font-medium text-yellow-800",children:"You're offline"}),(0,t.jsx)("p",{className:"text-xs text-yellow-600 mt-1",children:"Changes will sync when you're back online"})]})]})}),o&&(d||c>0)&&(0,t.jsx)("div",{className:" bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-right-4 duration-300 ",children:(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)("div",{className:"flex-shrink-0",children:d?(0,t.jsx)("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center",children:(0,t.jsx)("div",{className:"w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"})}):(0,t.jsx)("div",{className:"w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center",children:(0,t.jsx)("span",{className:"text-xs font-bold text-orange-600",children:c})})}),(0,t.jsx)("div",{className:"flex-1 min-w-0",children:d?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-blue-800",children:"Syncing changes..."}),(0,t.jsxs)("p",{className:"text-xs text-blue-600 mt-1",children:[c," action",1!==c?"s":""," pending"]})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("p",{className:"text-sm font-medium text-orange-800",children:[c," change",1!==c?"s":""," pending"]}),(0,t.jsx)("p",{className:"text-xs text-orange-600 mt-1",children:i?"Will sync automatically":"Waiting for connection"})]})}),i&&c>0&&!d&&(0,t.jsx)("button",{onClick:()=>{"serviceWorker"in navigator&&"sync"in window.ServiceWorkerRegistration.prototype&&navigator.serviceWorker.ready.then(e=>e.sync.register("background-sync")).catch(console.error)},className:" text-blue-600 hover:text-blue-700 focus:outline-none transition-colors duration-200 ",title:"Sync now",children:(0,t.jsx)("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})})})]})}),o&&i&&p&&0===c&&(0,t.jsx)("div",{className:" bg-green-50 border border-green-200 rounded-lg px-4 py-2 mt-2 shadow-lg backdrop-blur-sm animate-in slide-in-from-right-4 duration-300 ",children:(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)("div",{className:"flex-shrink-0",children:(0,t.jsx)("div",{className:"w-6 h-6 bg-green-100 rounded-full flex items-center justify-center",children:(0,t.jsx)("svg",{className:"w-3 h-3 text-green-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})})})}),(0,t.jsx)("div",{className:"flex-1 min-w-0",children:(0,t.jsxs)("p",{className:"text-xs text-green-600",children:["Last sync: ",function(e){let t=new Date().getTime()-e.getTime();if(t<6e4)return"Just now";if(t<36e5){let e=Math.floor(t/6e4);return`${e}m ago`}if(!(t<864e5))return e.toLocaleDateString();{let e=Math.floor(t/36e5);return`${e}h ago`}}(p)]})})]})})]})}function o({className:e=""}){let[n,a]=(0,r.useState)(navigator.onLine),[o,i]=(0,r.useState)(0);return((0,r.useEffect)(()=>{let e=()=>a(!0),t=()=>a(!1);return window.addEventListener("online",e),window.addEventListener("offline",t),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",t)}},[]),(0,r.useEffect)(()=>{let e=async()=>{try{let e=await s.offlineDataService.getPendingActions();i(e.length)}catch(e){console.error("Failed to get pending actions:",e)}};e();let t=setInterval(e,5e3);return()=>clearInterval(t)},[]),n&&0===o)?null:(0,t.jsxs)("div",{className:`flex items-center space-x-2 ${e}`,children:[!n&&(0,t.jsxs)("div",{className:"flex items-center space-x-1",children:[(0,t.jsx)("div",{className:"w-2 h-2 bg-yellow-500 rounded-full animate-pulse"}),(0,t.jsx)("span",{className:"text-xs text-yellow-600 font-medium",children:"Offline"})]}),o>0&&(0,t.jsxs)("div",{className:"flex items-center space-x-1",children:[(0,t.jsx)("div",{className:"w-2 h-2 bg-orange-500 rounded-full"}),(0,t.jsxs)("span",{className:"text-xs text-orange-600 font-medium",children:[o," pending"]})]})]})}e.s(["CompactOfflineStatus",()=>o,"OfflineStatus",()=>a])},869826,e=>{"use strict";var t=e.i(44990),r=e.i(403055),n=e.i(528413),s=e.i(489215),a=e.i(856374);let o=(0,r.createContext)(null);function i({children:e,enableAutoPrompt:i=!0,enableOfflineStatus:l=!0,installPromptDelay:c=1e4,offlineStatusPosition:u="top",className:d=""}){let[f,p]=(0,r.useState)(navigator.onLine),[g,m]=(0,r.useState)(0),[h,y]=(0,r.useState)(!1),{capabilities:v,install:w,showNotification:b}=(0,a.usePWA)();(0,r.useEffect)(()=>{let e=()=>p(!0),t=()=>p(!1);return window.addEventListener("online",e),window.addEventListener("offline",t),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",t)}},[]),(0,r.useEffect)(()=>{let e=()=>{m(0)};e();let t=setInterval(e,5e3);return()=>clearInterval(t)},[]),(0,r.useEffect)(()=>{if(!v.canInstall||v.isStandalone)return;let e=localStorage.getItem("pwa-install-dismissed");if(e){let t=parseInt(e);if(Date.now()-t<6048e5)return}if(i){let e=setTimeout(()=>{y(!0)},c);return()=>clearTimeout(e)}},[v.canInstall,v.isStandalone,i,c]),(0,r.useEffect)(()=>{"serviceWorker"in navigator&&(navigator.serviceWorker.register("/sw.js").then(e=>{e.addEventListener("updatefound",()=>{let t=e.installing;t&&t.addEventListener("statechange",()=>{"installed"===t.state&&navigator.serviceWorker.controller&&x()})})}).catch(e=>{console.error("Service Worker registration failed:",e)}),navigator.serviceWorker.addEventListener("message",e=>{let{type:t,data:r}=e.data;switch(t){case"SYNC_COMPLETE":m(r.remainingActions),r.successCount>0&&b("Sync Complete",{body:`${r.successCount} item${1!==r.successCount?"s":""} synced successfully`,tag:"sync-complete"});break;case"SYNC_ERROR":console.error("Sync error:",r.error)}}))},[b]);let x=async()=>{v.hasNotificationSupport&&await b("Update Available",{body:"A new version of the app is available. Refresh to update.",tag:"app-update"})},k={isOnline:f,isInstalled:v.isStandalone,canInstall:v.canInstall,pendingActions:g,showInstallPrompt:()=>y(!0),hideInstallPrompt:()=>y(!1),requestNotificationPermission:async()=>"Notification"in window?await Notification.requestPermission():"denied"};return(0,t.jsx)(o.Provider,{value:k,children:(0,t.jsxs)("div",{className:d,children:[e,i&&h&&(0,t.jsx)(n.PWAInstallPrompt,{showDelay:0}),l&&(0,t.jsx)(s.OfflineStatus,{position:u,showSyncStatus:!0})]})})}function l(){let e=(0,r.useContext)(o);if(!e)throw Error("usePWAContext must be used within a PWAProvider");return e}function c(e){return function(r){let n=l();return(0,t.jsx)(e,{...r,pwa:n})}}function u(){let{isOnline:e}=l();return{isOnline:e,isOffline:!e}}function d(){let{isInstalled:e,canInstall:t,showInstallPrompt:r}=l();return{isInstalled:e,canInstall:t,showInstallPrompt:r,installationStatus:e?"installed":t?"available":"unavailable"}}function f(){let{pendingActions:e,isOnline:t}=l();return{pendingActions:e,hasPendingActions:e>0,canSync:t,triggerSync:()=>{"serviceWorker"in navigator&&"sync"in window.ServiceWorkerRegistration.prototype&&navigator.serviceWorker.ready.then(e=>e.sync.register("background-sync")).catch(console.error)}}}e.s(["PWAProvider",()=>i,"usePWAContext",()=>l,"usePWAInstallation",()=>d,"usePWANetworkStatus",()=>u,"usePWASync",()=>f,"withPWA",()=>c])}]);