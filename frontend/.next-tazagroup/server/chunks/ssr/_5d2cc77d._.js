module.exports=[749148,a=>{"use strict";var b,c=a.i(932032),d=a.i(184327),e=a.i(90431),f=a.i(168918),g=a.i(329321),h=a.i(377331),i=a.i(609202),j=a.i(380361);function k(){}var l=["refetch","reobserve","fetchMore","updateQuery","startPolling","stopPolling","subscribeToMore"],m=["initialFetchPolicy","onCompleted","onError","defaultOptions","partialRefetch","canonizeResults"],n=["query","ssr","client","fetchPolicy","nextFetchPolicy","refetchWritePolicy","errorPolicy","pollInterval","notifyOnNetworkStatusChange","returnPartialData","skipPollAttempt"];function o(a,o){if(!1!==globalThis.__DEV__){var p,q=o||{};(0,h.useWarnRemovedOption)(q,"canonizeResults","useLazyQuery"),(0,h.useWarnRemovedOption)(q,"variables","useLazyQuery","Pass all `variables` to the returned `execute` function instead."),(0,h.useWarnRemovedOption)(q,"context","useLazyQuery","Pass `context` to the returned `execute` function instead."),(0,h.useWarnRemovedOption)(q,"onCompleted","useLazyQuery","If your `onCompleted` callback sets local state, switch to use derived state using `data` returned from the hook instead. Use `useEffect` to perform side-effects as a result of updates to `data`."),(0,h.useWarnRemovedOption)(q,"onError","useLazyQuery","If your `onError` callback sets local state, switch to use derived state using `data`, `error` or `errors` returned from the hook instead. Use `useEffect` if you need to perform side-effects as a result of updates to `data`, `error` or `errors`."),(0,h.useWarnRemovedOption)(q,"defaultOptions","useLazyQuery","Pass the options directly to the hook instead."),(0,h.useWarnRemovedOption)(q,"initialFetchPolicy","useLazyQuery","Use the `fetchPolicy` option instead."),(0,h.useWarnRemovedOption)(q,"partialRefetch","useLazyQuery")}var r=d.useRef(void 0),s=d.useRef(void 0),t=d.useRef(void 0),u=(0,e.mergeOptions)(o,r.current||{}),v=null!=(p=null==u?void 0:u.query)?p:a;s.current=o,t.current=v;var w=(0,c.__assign)((0,c.__assign)({},u),{skip:!r.current}),x=(0,f.useQueryInternals)(v,w),y=x.obsQueryFields,z=x.result,A=x.client,B=x.resultData,C=x.observable,D=x.onQueryExecuted,E=C.options.initialFetchPolicy||(0,f.getDefaultFetchPolicy)(w.defaultOptions,A.defaultOptions),F=d.useReducer(function(a){return a+1},0)[1],G=d.useMemo(function(){for(var a={},b=function(b){var c=y[b];a[b]=function(){return!1!==globalThis.__DEV__&&"reobserve"===b&&!1!==globalThis.__DEV__&&i.invariant.warn(80),r.current||(r.current=Object.create(null),F()),c.apply(this,arguments)}},c=0;c<l.length;c++)b(l[c]);return a},[F,y]),H=!!r.current,I=d.useMemo(function(){return(0,c.__assign)((0,c.__assign)((0,c.__assign)({},z),G),{called:H})},[z,G,H]),J=(b||(b=d.createContext(null)),d.useCallback(function(){var a=console.error;try{return console.error=k,d.useContext(b),!0}catch(a){return!1}finally{console.error=a}},[])),K=d.useRef(new Set),L=d.useCallback(function(a){if(!1!==globalThis.__DEV__){J()&&!1!==globalThis.__DEV__&&i.invariant.warn(81);for(var b,d,g,h,k,l,o,p,q,u=0;u<m.length;u++){var w=m[u];K.current.has(w)||((0,j.warnRemovedOption)(a||{},w,"useLazyQuery.execute"),K.current.add(w))}for(var x=0;x<n.length;x++){var y=n[x];K.current.has(y)||((0,j.warnRemovedOption)(a||{},y,"useLazyQuery.execute","Please pass the option to the `useLazyQuery` hook instead."),K.current.add(y))}}r.current=a?(0,c.__assign)((0,c.__assign)({},a),{fetchPolicy:a.fetchPolicy||E}):{fetchPolicy:E};var z=(0,e.mergeOptions)(s.current,(0,c.__assign)({query:t.current},r.current)),F=(b=B,d=C,g=A,h=v,k=(0,c.__assign)((0,c.__assign)({},z),{skip:!1}),l=D,o=k.query||h,p=(0,f.createMakeWatchQueryOptions)(g,o,k,!1)(d),q=d.reobserveAsConcast((0,f.getObsQueryOptions)(d,g,k,p)),l(p),new Promise(function(a){var c;q.subscribe({next:function(a){c=a},error:function(){a((0,f.toQueryResult)(d.getCurrentResult(),b.previousData,d,g))},complete:function(){a((0,f.toQueryResult)(d.maskResult(c),b.previousData,d,g))}})})).then(function(a){return Object.assign(a,G)});return F.catch(function(){}),F},[J,A,v,G,E,C,B,D]),M=d.useRef(L);return(0,g.useIsomorphicLayoutEffect)(function(){M.current=L}),[d.useCallback(function(){for(var a=[],b=0;b<arguments.length;b++)a[b]=arguments[b];return M.current.apply(M,a)},[]),I]}a.s(["useLazyQuery",()=>o],749148)},40947,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(749148),e=a.i(8912),f=a.i(772213);let g=f.gql`
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
      redirectUrl
    }
  }
`,h=f.gql`
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
      redirectUrl
    }
  }
`,i=f.gql`
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
`;f.gql`
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
`,f.gql`
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
`,f.gql`
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
`,f.gql`
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
`,f.gql`
  mutation DeletePost($id: String!) {
    deletePost(id: $id) {
      id
      title
    }
  }
`,f.gql`
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
`,f.gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id) {
      id
    }
  }
`,f.gql`
  mutation UploadFile($file: Upload!, $bucket: String!) {
    uploadFile(file: $file, bucket: $bucket) {
      filename
      mimetype
      encoding
      url
    }
  }
`,f.gql`
  query GenerateSummary($content: String!) {
    generateSummary(content: $content) {
      summary
      keywords
      sentiment
      readingTime
    }
  }
`,f.gql`
  query GeneratePostSuggestions($topic: String!) {
    generatePostSuggestions(topic: $topic) {
      title
      excerpt
      tags
    }
  }
`,f.gql`
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
`,f.gql`
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
`,f.gql`
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
`,f.gql`
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
`,f.gql`
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
`,f.gql`
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
`;let j=(0,c.createContext)(void 0);a.s(["AuthProvider",0,({children:a})=>{let[f,k]=(0,c.useState)(null),[l,m]=(0,c.useState)(!0),[n,{data:o,error:p}]=(0,d.useLazyQuery)(i),[q]=(0,e.useMutation)(g),[r]=(0,e.useMutation)(h);(0,c.useEffect)(()=>{if(o?.getMe)console.log("%c✅ AuthContext - User authenticated successfully","color: #2ecc71; font-weight: bold;",o.getMe),k(o.getMe),m(!1);else if(p){let a=p.networkError,b=p.graphQLErrors||[];console.group("%c❌ AuthContext - Error Handling","color: #e74c3c; font-weight: bold;"),console.error("Full Error Object:",p),console.error("Network Error:",a),console.table(b.map(a=>({message:a.message,code:a.extensions?.code,path:a.path})));let c=a?.statusCode===401||a?.status===401;c&&console.log("%c🔐 401 HTTP Status Code detected - LOGOUT REQUIRED","color: #e74c3c; font-weight: bold;");let d=b.some(a=>{let b=a.extensions?.code==="UNAUTHENTICATED",c=a.extensions?.code==="FORBIDDEN";return b&&console.log("%c🔑 UNAUTHENTICATED error code detected","color: #f39c12;"),c&&console.log("%c🚫 FORBIDDEN error code detected","color: #f39c12;"),b||c});d&&console.log("%c🚨 Explicit auth-related GraphQL error detected - LOGOUT REQUIRED","color: #e74c3c; font-weight: bold;"),c||d?(console.log("%c🔓 LOGGING OUT - Clearing all auth data","color: #c0392b; font-weight: bold;"),console.table({"Current Token":localStorage.getItem("accessToken")?"EXISTS":"NONE",Action:"REMOVING",Timestamp:new Date().toISOString()}),localStorage.removeItem("accessToken"),localStorage.removeItem("refreshToken"),localStorage.removeItem("user"),console.log("%c✓ Auth data cleared from localStorage","color: #27ae60;"),k(null)):(console.log("%c⚠️  Transient network error detected - KEEPING TOKEN for retry","color: #f39c12; font-weight: bold;"),console.log("Error details:",{type:a?.name||"Unknown",message:a?.message,statusCode:a?.statusCode,willRetry:!0})),console.groupEnd(),m(!1)}},[o,p]),(0,c.useEffect)(()=>{localStorage.getItem("accessToken")?n():m(!1)},[n]);let s=async(a,b)=>{try{console.log("%c🔐 Login attempt started","color: #3498db; font-weight: bold;",{email:a,timestamp:new Date().toISOString()});let{data:c}=await q({variables:{input:{emailOrUsername:a,password:b}}});if(!c?.loginUser?.accessToken)return{success:!1,error:"Login failed"};{let a=c.loginUser.accessToken,b=c.loginUser.redirectUrl;return localStorage.setItem("accessToken",a),n(),{success:!0,redirectUrl:b}}}catch(a){return{success:!1,error:a.message||"Login failed"}}},t=async(a,b,c)=>{try{let{data:d}=await r({variables:{input:{email:a,password:b,username:c}}});if(!d?.registerUser?.accessToken)return{success:!1,error:"Registration failed"};{let a=d.registerUser.accessToken,b=d.registerUser.redirectUrl;return localStorage.setItem("accessToken",a),n(),{success:!0,redirectUrl:b}}}catch(a){return{success:!1,error:a.message||"Registration failed"}}},u=!!f;return(0,b.jsx)(j.Provider,{value:{user:f,login:s,register:t,logout:()=>{console.log("%c🚪 Manual logout triggered","color: #e74c3c; font-weight: bold;",{timestamp:new Date().toISOString()}),console.table({"Token Before":localStorage.getItem("accessToken")?"EXISTS":"NONE",Action:"REMOVING",User:f?.email||"NONE"}),localStorage.removeItem("accessToken"),localStorage.removeItem("refreshToken"),localStorage.removeItem("user"),console.log("%c✓ All auth data cleared","color: #27ae60;"),k(null)},loading:l,isAuthenticated:u},children:a})},"useAuth",0,()=>{let a=(0,c.useContext)(j);return a||{user:null,login:async()=>({success:!1,error:"Not available on server"}),register:async()=>({success:!1,error:"Not available on server"}),logout:()=>{},loading:!0,isAuthenticated:!1}}],40947)}];

//# sourceMappingURL=_5d2cc77d._.js.map