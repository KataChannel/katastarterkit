(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,775680,e=>{"use strict";var t=e.i(44990),r=e.i(403055),s=e.i(541428);let l=r.forwardRef(({className:e,...r},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...r}));l.displayName="Card";let a=r.forwardRef(({className:e,...r},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",e),...r}));a.displayName="CardHeader";let n=r.forwardRef(({className:e,...r},l)=>(0,t.jsx)("h3",{ref:l,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",e),...r}));n.displayName="CardTitle";let i=r.forwardRef(({className:e,...r},l)=>(0,t.jsx)("p",{ref:l,className:(0,s.cn)("text-sm text-muted-foreground",e),...r}));i.displayName="CardDescription";let o=r.forwardRef(({className:e,...r},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("p-6 pt-0",e),...r}));o.displayName="CardContent";let d=r.forwardRef(({className:e,...r},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("flex items-center p-6 pt-0",e),...r}));d.displayName="CardFooter",e.s(["Card",()=>l,"CardContent",()=>o,"CardDescription",()=>i,"CardFooter",()=>d,"CardHeader",()=>a,"CardTitle",()=>n])},440556,e=>{"use strict";function t(e,[t,r]){return Math.min(r,Math.max(t,e))}e.s(["clamp",()=>t])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),r=e.i(950988),s=e.i(529590),l=e.i(403055),a=e.i(984804);let n=a.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,i=a.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,o=a.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,d=a.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,c=a.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,u=a.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=a.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,p=a.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,x=a.gql`
  mutation CreateMany(
    $model: String!
    $data: [JSON!]!
    $skipDuplicates: Boolean
  ) {
    createMany(
      model: $model
      data: $data
      skipDuplicates: $skipDuplicates
    )
  }
`,h=a.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,f=a.gql`
  mutation UpdateMany(
    $model: String!
    $where: JSON
    $data: JSON!
  ) {
    updateMany(
      model: $model
      where: $where
      data: $data
    )
  }
`,g=a.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,b=a.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,y=a.gql`
  mutation Upsert(
    $model: String!
    $where: JSON!
    $create: JSON!
    $update: JSON!
    $select: JSON
    $include: JSON
  ) {
    upsert(
      model: $model
      where: $where
      create: $create
      update: $update
      select: $select
      include: $include
    )
  }
`,v=a.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,w=a.gql`
  mutation ClearCache {
    clearCache
  }
`;function N(e,r,s){let l=!!localStorage.getItem("accessToken"),a=s?.skip||s?.requireAuth!==!1&&!l,{data:i,loading:o,error:d,refetch:c}=(0,t.useQuery)(n,{variables:{modelName:e,input:r||{}},skip:a,fetchPolicy:s?.fetchPolicy||"cache-and-network"});return{data:i?.findMany,loading:o,error:d,refetch:c}}function j(e,r,s,l){let a=!!localStorage.getItem("accessToken"),n="string"==typeof r?r:r?.id;n||l?.skip;let o=l?.skip||!n||l?.requireAuth!==!1&&!a,{data:d,loading:c,error:u,refetch:m}=(0,t.useQuery)(i,{variables:{modelName:e,input:{id:n||"",select:s?.select,include:s?.include}},skip:o});return{data:d?.findById,loading:c,error:u,refetch:m}}function C(e,r,s){let[a,n]=(0,l.useState)(r?.page||1),[i,o]=(0,l.useState)(r?.limit||10),c=!!localStorage.getItem("accessToken"),u=s?.skip||s?.requireAuth!==!1&&!c,{data:m,loading:p,error:x,refetch:h}=(0,t.useQuery)(d,{variables:{modelName:e,input:{page:a,limit:i,where:r?.where,orderBy:r?.orderBy,select:r?.select,include:r?.include}},skip:u,fetchPolicy:"cache-and-network"}),f=m?.findManyPaginated,g=(0,l.useCallback)(e=>{n(e)},[]),b=(0,l.useCallback)(()=>{f?.meta.hasNextPage&&n(e=>e+1)},[f]),y=(0,l.useCallback)(()=>{f?.meta.hasPrevPage&&n(e=>e-1)},[f]),v=(0,l.useCallback)(e=>{o(e),n(1)},[]);return{data:f?.data,meta:f?.meta,loading:p,error:x,refetch:h,page:a,limit:i,goToPage:g,nextPage:b,prevPage:y,changeLimit:v}}function S(e,r,s){let{data:l,loading:a,error:n,refetch:i}=(0,t.useQuery)(c,{variables:{modelName:e,where:r},skip:s?.skip});return{count:l?.count,loading:a,error:n,refetch:i}}function $(e,t){let[s,{data:a,loading:n,error:i}]=(0,r.useMutation)(p,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let r=await s({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return r.data?.createOne},[s,e]),{data:a?.createOne,loading:n,error:i}]}function k(e,t){let[s,{data:a,loading:n,error:i}]=(0,r.useMutation)(h,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let r="string"==typeof t.where?t.where:t.where?.id;if(!r)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let l=await s({variables:{modelName:e,input:{id:r,data:t.data,select:t.select,include:t.include}}});return l.data?.updateOne},[s,e]),{data:a?.updateOne,loading:n,error:i}]}function q(e,t){let[s,{data:a,loading:n,error:i}]=(0,r.useMutation)(g,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let r="string"==typeof t.where?t.where:t.where?.id;if(!r)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let l=await s({variables:{modelName:e,input:{id:r,select:t.select}}});return l.data?.deleteOne},[s,e]),{data:a?.deleteOne,loading:n,error:i}]}function E(e){let t=(0,s.useApolloClient)(),[a,o]=$(e),[d,u]=function(e,t){let[s,{data:a,loading:n,error:i}]=(0,r.useMutation)(x,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let r=await s({variables:{model:e,...t}});return r.data?.createMany},[s,e]),{data:a?.createMany,loading:n,error:i}]}(e),[m,p]=k(e),[h,g]=function(e,t){let[s,{data:a,loading:n,error:i}]=(0,r.useMutation)(f,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let r=await s({variables:{model:e,...t}});return r.data?.updateMany},[s,e]),{data:a?.updateMany,loading:n,error:i}]}(e),[v,w]=q(e),[N,j]=function(e,t){let[s,{data:a,loading:n,error:i}]=(0,r.useMutation)(b,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let r=await s({variables:{model:e,where:t}});return r.data?.deleteMany},[s,e]),{data:a?.deleteMany,loading:n,error:i}]}(e),[C,S]=function(e,t){let[s,{data:a,loading:n,error:i}]=(0,r.useMutation)(y,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let r=await s({variables:{model:e,...t}});return r.data?.upsert},[s,e]),{data:a?.upsert,loading:n,error:i}]}(e),E=(0,l.useCallback)(async r=>(await t.query({query:n,variables:{model:e,...r},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:E,findUnique:(0,l.useCallback)(async(r,s)=>(await t.query({query:i,variables:{model:e,where:r,...s},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,l.useCallback)(async r=>(await t.query({query:c,variables:{model:e,where:r},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:a,createMany:d,updateOne:m,updateMany:h,deleteOne:v,deleteMany:N,upsert:C,states:{createOne:o,createMany:u,updateOne:p,updateMany:g,deleteOne:w,deleteMany:j,upsert:S},loading:o.loading||u.loading||p.loading||g.loading||w.loading||j.loading||S.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,w,"COUNT",0,c,"CREATE_MANY",0,x,"CREATE_ONE",0,p,"DELETE_MANY",0,b,"DELETE_ONE",0,g,"FIND_FIRST",0,o,"FIND_MANY",0,n,"FIND_MANY_PAGINATED",0,d,"FIND_UNIQUE",0,i,"GET_AVAILABLE_MODELS",0,v,"GROUP_BY",0,m,"UPDATE_MANY",0,f,"UPDATE_ONE",0,h,"UPSERT",0,y],272901),e.s(["useCRUD",()=>E,"useCount",()=>S,"useCreateOne",()=>$,"useDeleteOne",()=>q,"useFindMany",()=>N,"useFindManyPaginated",()=>C,"useFindUnique",()=>j,"useUpdateOne",()=>k],245421)},169989,162207,e=>{"use strict";let t=(0,e.i(930702).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["default",()=>t],162207),e.s(["Loader2",()=>t],169989)},295426,e=>{"use strict";let t=(0,e.i(930702).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>t])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},838049,e=>{"use strict";let t=(0,e.i(930702).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["default",()=>t])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},638381,e=>{"use strict";let t=(0,e.i(930702).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},621924,e=>{"use strict";let t=(0,e.i(930702).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["default",()=>t])},822390,e=>{"use strict";var t=e.i(621924);e.s(["CheckCircle",()=>t.default])},565977,e=>{"use strict";let t=(0,e.i(930702).default)("file-text",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["default",()=>t])},421329,e=>{"use strict";var t=e.i(565977);e.s(["FileText",()=>t.default])},645030,e=>{"use strict";var t=e.i(44990),r=e.i(403055),s=e.i(316618),l=e.i(873273),a="Progress",[n,i]=(0,s.createContextScope)(a),[o,d]=n(a),c=r.forwardRef((e,r)=>{var s,a;let{__scopeProgress:n,value:i=null,max:d,getValueLabel:c=p,...u}=e;(d||0===d)&&!f(d)&&console.error((s=`${d}`,`Invalid prop \`max\` of value \`${s}\` supplied to \`Progress\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`));let m=f(d)?d:100;null===i||g(i,m)||console.error((a=`${i}`,`Invalid prop \`value\` of value \`${a}\` supplied to \`Progress\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`));let b=g(i,m)?i:null,y=h(b)?c(b,m):void 0;return(0,t.jsx)(o,{scope:n,value:b,max:m,children:(0,t.jsx)(l.Primitive.div,{"aria-valuemax":m,"aria-valuemin":0,"aria-valuenow":h(b)?b:void 0,"aria-valuetext":y,role:"progressbar","data-state":x(b,m),"data-value":b??void 0,"data-max":m,...u,ref:r})})});c.displayName=a;var u="ProgressIndicator",m=r.forwardRef((e,r)=>{let{__scopeProgress:s,...a}=e,n=d(u,s);return(0,t.jsx)(l.Primitive.div,{"data-state":x(n.value,n.max),"data-value":n.value??void 0,"data-max":n.max,...a,ref:r})});function p(e,t){return`${Math.round(e/t*100)}%`}function x(e,t){return null==e?"indeterminate":e===t?"complete":"loading"}function h(e){return"number"==typeof e}function f(e){return h(e)&&!isNaN(e)&&e>0}function g(e,t){return h(e)&&!isNaN(e)&&e<=t&&e>=0}m.displayName=u;var b=e.i(541428);let y=r.forwardRef(({className:e,value:r,indicatorClassName:s,...l},a)=>(0,t.jsx)(c,{ref:a,className:(0,b.cn)("relative h-4 w-full overflow-hidden rounded-full bg-secondary",e),...l,children:(0,t.jsx)(m,{className:(0,b.cn)("h-full w-full flex-1 bg-primary transition-all",s),style:{transform:`translateX(-${100-(r||0)}%)`}})}));y.displayName=c.displayName,e.s(["Progress",()=>y],645030)},837149,558519,e=>{"use strict";let t=(0,e.i(930702).default)("target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);e.s(["default",()=>t],558519),e.s(["Target",()=>t],837149)},632800,e=>{"use strict";var t=e.i(44990),r=e.i(403055),s=e.i(873273),l=e.i(767478),a=e.i(316618),n=e.i(569658),i=e.i(214018),o=e.i(825198),d=e.i(302193),c=e.i(440556),u=e.i(119836),m="ScrollArea",[p,x]=(0,a.createContextScope)(m),[h,f]=p(m),g=r.forwardRef((e,l)=>{let{__scopeScrollArea:a,type:i="hover",dir:d,scrollHideDelay:c=600,...u}=e,[m,p]=r.useState(null),[x,f]=r.useState(null),[g,b]=r.useState(null),[y,v]=r.useState(null),[w,N]=r.useState(null),[j,C]=r.useState(0),[S,$]=r.useState(0),[k,q]=r.useState(!1),[E,I]=r.useState(!1),P=(0,n.useComposedRefs)(l,e=>p(e)),R=(0,o.useDirection)(d);return(0,t.jsx)(h,{scope:a,type:i,dir:R,scrollHideDelay:c,scrollArea:m,viewport:x,onViewportChange:f,content:g,onContentChange:b,scrollbarX:y,onScrollbarXChange:v,scrollbarXEnabled:k,onScrollbarXEnabledChange:q,scrollbarY:w,onScrollbarYChange:N,scrollbarYEnabled:E,onScrollbarYEnabledChange:I,onCornerWidthChange:C,onCornerHeightChange:$,children:(0,t.jsx)(s.Primitive.div,{dir:R,...u,ref:P,style:{position:"relative","--radix-scroll-area-corner-width":j+"px","--radix-scroll-area-corner-height":S+"px",...e.style}})})});g.displayName=m;var b="ScrollAreaViewport",y=r.forwardRef((e,l)=>{let{__scopeScrollArea:a,children:i,nonce:o,...d}=e,c=f(b,a),u=r.useRef(null),m=(0,n.useComposedRefs)(l,u,c.onViewportChange);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{dangerouslySetInnerHTML:{__html:"[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}"},nonce:o}),(0,t.jsx)(s.Primitive.div,{"data-radix-scroll-area-viewport":"",...d,ref:m,style:{overflowX:c.scrollbarXEnabled?"scroll":"hidden",overflowY:c.scrollbarYEnabled?"scroll":"hidden",...e.style},children:(0,t.jsx)("div",{ref:c.onContentChange,style:{minWidth:"100%",display:"table"},children:i})})]})});y.displayName=b;var v="ScrollAreaScrollbar",w=r.forwardRef((e,s)=>{let{forceMount:l,...a}=e,n=f(v,e.__scopeScrollArea),{onScrollbarXEnabledChange:i,onScrollbarYEnabledChange:o}=n,d="horizontal"===e.orientation;return r.useEffect(()=>(d?i(!0):o(!0),()=>{d?i(!1):o(!1)}),[d,i,o]),"hover"===n.type?(0,t.jsx)(N,{...a,ref:s,forceMount:l}):"scroll"===n.type?(0,t.jsx)(j,{...a,ref:s,forceMount:l}):"auto"===n.type?(0,t.jsx)(C,{...a,ref:s,forceMount:l}):"always"===n.type?(0,t.jsx)(S,{...a,ref:s}):null});w.displayName=v;var N=r.forwardRef((e,s)=>{let{forceMount:a,...n}=e,i=f(v,e.__scopeScrollArea),[o,d]=r.useState(!1);return r.useEffect(()=>{let e=i.scrollArea,t=0;if(e){let r=()=>{window.clearTimeout(t),d(!0)},s=()=>{t=window.setTimeout(()=>d(!1),i.scrollHideDelay)};return e.addEventListener("pointerenter",r),e.addEventListener("pointerleave",s),()=>{window.clearTimeout(t),e.removeEventListener("pointerenter",r),e.removeEventListener("pointerleave",s)}}},[i.scrollArea,i.scrollHideDelay]),(0,t.jsx)(l.Presence,{present:a||o,children:(0,t.jsx)(C,{"data-state":o?"visible":"hidden",...n,ref:s})})}),j=r.forwardRef((e,s)=>{var a;let{forceMount:n,...i}=e,o=f(v,e.__scopeScrollArea),d="horizontal"===e.orientation,c=Q(()=>p("SCROLL_END"),100),[m,p]=(a={hidden:{SCROLL:"scrolling"},scrolling:{SCROLL_END:"idle",POINTER_ENTER:"interacting"},interacting:{SCROLL:"interacting",POINTER_LEAVE:"idle"},idle:{HIDE:"hidden",SCROLL:"scrolling",POINTER_ENTER:"interacting"}},r.useReducer((e,t)=>a[e][t]??e,"hidden"));return r.useEffect(()=>{if("idle"===m){let e=window.setTimeout(()=>p("HIDE"),o.scrollHideDelay);return()=>window.clearTimeout(e)}},[m,o.scrollHideDelay,p]),r.useEffect(()=>{let e=o.viewport,t=d?"scrollLeft":"scrollTop";if(e){let r=e[t],s=()=>{let s=e[t];r!==s&&(p("SCROLL"),c()),r=s};return e.addEventListener("scroll",s),()=>e.removeEventListener("scroll",s)}},[o.viewport,d,p,c]),(0,t.jsx)(l.Presence,{present:n||"hidden"!==m,children:(0,t.jsx)(S,{"data-state":"hidden"===m?"hidden":"visible",...i,ref:s,onPointerEnter:(0,u.composeEventHandlers)(e.onPointerEnter,()=>p("POINTER_ENTER")),onPointerLeave:(0,u.composeEventHandlers)(e.onPointerLeave,()=>p("POINTER_LEAVE"))})})}),C=r.forwardRef((e,s)=>{let a=f(v,e.__scopeScrollArea),{forceMount:n,...i}=e,[o,d]=r.useState(!1),c="horizontal"===e.orientation,u=Q(()=>{if(a.viewport){let e=a.viewport.offsetWidth<a.viewport.scrollWidth,t=a.viewport.offsetHeight<a.viewport.scrollHeight;d(c?e:t)}},10);return B(a.viewport,u),B(a.content,u),(0,t.jsx)(l.Presence,{present:n||o,children:(0,t.jsx)(S,{"data-state":o?"visible":"hidden",...i,ref:s})})}),S=r.forwardRef((e,s)=>{let{orientation:l="vertical",...a}=e,n=f(v,e.__scopeScrollArea),i=r.useRef(null),o=r.useRef(0),[d,c]=r.useState({content:0,viewport:0,scrollbar:{size:0,paddingStart:0,paddingEnd:0}}),u=D(d.viewport,d.content),m={...a,sizes:d,onSizesChange:c,hasThumb:!!(u>0&&u<1),onThumbChange:e=>i.current=e,onThumbPointerUp:()=>o.current=0,onThumbPointerDown:e=>o.current=e};function p(e,t){return function(e,t,r,s="ltr"){let l=_(r),a=t||l/2,n=r.scrollbar.paddingStart+a,i=r.scrollbar.size-r.scrollbar.paddingEnd-(l-a),o=r.content-r.viewport;return U([n,i],"ltr"===s?[0,o]:[-1*o,0])(e)}(e,o.current,d,t)}return"horizontal"===l?(0,t.jsx)($,{...m,ref:s,onThumbPositionChange:()=>{if(n.viewport&&i.current){let e=z(n.viewport.scrollLeft,d,n.dir);i.current.style.transform=`translate3d(${e}px, 0, 0)`}},onWheelScroll:e=>{n.viewport&&(n.viewport.scrollLeft=e)},onDragScroll:e=>{n.viewport&&(n.viewport.scrollLeft=p(e,n.dir))}}):"vertical"===l?(0,t.jsx)(k,{...m,ref:s,onThumbPositionChange:()=>{if(n.viewport&&i.current){let e=z(n.viewport.scrollTop,d);i.current.style.transform=`translate3d(0, ${e}px, 0)`}},onWheelScroll:e=>{n.viewport&&(n.viewport.scrollTop=e)},onDragScroll:e=>{n.viewport&&(n.viewport.scrollTop=p(e))}}):null}),$=r.forwardRef((e,s)=>{let{sizes:l,onSizesChange:a,...i}=e,o=f(v,e.__scopeScrollArea),[d,c]=r.useState(),u=r.useRef(null),m=(0,n.useComposedRefs)(s,u,o.onScrollbarXChange);return r.useEffect(()=>{u.current&&c(getComputedStyle(u.current))},[u]),(0,t.jsx)(I,{"data-orientation":"horizontal",...i,ref:m,sizes:l,style:{bottom:0,left:"rtl"===o.dir?"var(--radix-scroll-area-corner-width)":0,right:"ltr"===o.dir?"var(--radix-scroll-area-corner-width)":0,"--radix-scroll-area-thumb-width":_(l)+"px",...e.style},onThumbPointerDown:t=>e.onThumbPointerDown(t.x),onDragScroll:t=>e.onDragScroll(t.x),onWheelScroll:(t,r)=>{if(o.viewport){var s,l;let a=o.viewport.scrollLeft+t.deltaX;e.onWheelScroll(a),s=a,l=r,s>0&&s<l&&t.preventDefault()}},onResize:()=>{u.current&&o.viewport&&d&&a({content:o.viewport.scrollWidth,viewport:o.viewport.offsetWidth,scrollbar:{size:u.current.clientWidth,paddingStart:L(d.paddingLeft),paddingEnd:L(d.paddingRight)}})}})}),k=r.forwardRef((e,s)=>{let{sizes:l,onSizesChange:a,...i}=e,o=f(v,e.__scopeScrollArea),[d,c]=r.useState(),u=r.useRef(null),m=(0,n.useComposedRefs)(s,u,o.onScrollbarYChange);return r.useEffect(()=>{u.current&&c(getComputedStyle(u.current))},[u]),(0,t.jsx)(I,{"data-orientation":"vertical",...i,ref:m,sizes:l,style:{top:0,right:"ltr"===o.dir?0:void 0,left:"rtl"===o.dir?0:void 0,bottom:"var(--radix-scroll-area-corner-height)","--radix-scroll-area-thumb-height":_(l)+"px",...e.style},onThumbPointerDown:t=>e.onThumbPointerDown(t.y),onDragScroll:t=>e.onDragScroll(t.y),onWheelScroll:(t,r)=>{if(o.viewport){var s,l;let a=o.viewport.scrollTop+t.deltaY;e.onWheelScroll(a),s=a,l=r,s>0&&s<l&&t.preventDefault()}},onResize:()=>{u.current&&o.viewport&&d&&a({content:o.viewport.scrollHeight,viewport:o.viewport.offsetHeight,scrollbar:{size:u.current.clientHeight,paddingStart:L(d.paddingTop),paddingEnd:L(d.paddingBottom)}})}})}),[q,E]=p(v),I=r.forwardRef((e,l)=>{let{__scopeScrollArea:a,sizes:o,hasThumb:d,onThumbChange:c,onThumbPointerUp:m,onThumbPointerDown:p,onThumbPositionChange:x,onDragScroll:h,onWheelScroll:g,onResize:b,...y}=e,w=f(v,a),[N,j]=r.useState(null),C=(0,n.useComposedRefs)(l,e=>j(e)),S=r.useRef(null),$=r.useRef(""),k=w.viewport,E=o.content-o.viewport,I=(0,i.useCallbackRef)(g),P=(0,i.useCallbackRef)(x),R=Q(b,10);function T(e){S.current&&h({x:e.clientX-S.current.left,y:e.clientY-S.current.top})}return r.useEffect(()=>{let e=e=>{let t=e.target;N?.contains(t)&&I(e,E)};return document.addEventListener("wheel",e,{passive:!1}),()=>document.removeEventListener("wheel",e,{passive:!1})},[k,N,E,I]),r.useEffect(P,[o,P]),B(N,R),B(w.content,R),(0,t.jsx)(q,{scope:a,scrollbar:N,hasThumb:d,onThumbChange:(0,i.useCallbackRef)(c),onThumbPointerUp:(0,i.useCallbackRef)(m),onThumbPositionChange:P,onThumbPointerDown:(0,i.useCallbackRef)(p),children:(0,t.jsx)(s.Primitive.div,{...y,ref:C,style:{position:"absolute",...y.style},onPointerDown:(0,u.composeEventHandlers)(e.onPointerDown,e=>{0===e.button&&(e.target.setPointerCapture(e.pointerId),S.current=N.getBoundingClientRect(),$.current=document.body.style.webkitUserSelect,document.body.style.webkitUserSelect="none",w.viewport&&(w.viewport.style.scrollBehavior="auto"),T(e))}),onPointerMove:(0,u.composeEventHandlers)(e.onPointerMove,T),onPointerUp:(0,u.composeEventHandlers)(e.onPointerUp,e=>{let t=e.target;t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId),document.body.style.webkitUserSelect=$.current,w.viewport&&(w.viewport.style.scrollBehavior=""),S.current=null})})})}),P="ScrollAreaThumb",R=r.forwardRef((e,r)=>{let{forceMount:s,...a}=e,n=E(P,e.__scopeScrollArea);return(0,t.jsx)(l.Presence,{present:s||n.hasThumb,children:(0,t.jsx)(T,{ref:r,...a})})}),T=r.forwardRef((e,l)=>{let{__scopeScrollArea:a,style:i,...o}=e,d=f(P,a),c=E(P,a),{onThumbPositionChange:m}=c,p=(0,n.useComposedRefs)(l,e=>c.onThumbChange(e)),x=r.useRef(void 0),h=Q(()=>{x.current&&(x.current(),x.current=void 0)},100);return r.useEffect(()=>{let e=d.viewport;if(e){let t=()=>{h(),x.current||(x.current=F(e,m),m())};return m(),e.addEventListener("scroll",t),()=>e.removeEventListener("scroll",t)}},[d.viewport,h,m]),(0,t.jsx)(s.Primitive.div,{"data-state":c.hasThumb?"visible":"hidden",...o,ref:p,style:{width:"var(--radix-scroll-area-thumb-width)",height:"var(--radix-scroll-area-thumb-height)",...i},onPointerDownCapture:(0,u.composeEventHandlers)(e.onPointerDownCapture,e=>{let t=e.target.getBoundingClientRect(),r=e.clientX-t.left,s=e.clientY-t.top;c.onThumbPointerDown({x:r,y:s})}),onPointerUp:(0,u.composeEventHandlers)(e.onPointerUp,c.onThumbPointerUp)})});R.displayName=P;var M="ScrollAreaCorner",A=r.forwardRef((e,r)=>{let s=f(M,e.__scopeScrollArea),l=!!(s.scrollbarX&&s.scrollbarY);return"scroll"!==s.type&&l?(0,t.jsx)(O,{...e,ref:r}):null});A.displayName=M;var O=r.forwardRef((e,l)=>{let{__scopeScrollArea:a,...n}=e,i=f(M,a),[o,d]=r.useState(0),[c,u]=r.useState(0),m=!!(o&&c);return B(i.scrollbarX,()=>{let e=i.scrollbarX?.offsetHeight||0;i.onCornerHeightChange(e),u(e)}),B(i.scrollbarY,()=>{let e=i.scrollbarY?.offsetWidth||0;i.onCornerWidthChange(e),d(e)}),m?(0,t.jsx)(s.Primitive.div,{...n,ref:l,style:{width:o,height:c,position:"absolute",right:"ltr"===i.dir?0:void 0,left:"rtl"===i.dir?0:void 0,bottom:0,...e.style}}):null});function L(e){return e?parseInt(e,10):0}function D(e,t){let r=e/t;return isNaN(r)?0:r}function _(e){let t=D(e.viewport,e.content),r=e.scrollbar.paddingStart+e.scrollbar.paddingEnd;return Math.max((e.scrollbar.size-r)*t,18)}function z(e,t,r="ltr"){let s=_(t),l=t.scrollbar.paddingStart+t.scrollbar.paddingEnd,a=t.scrollbar.size-l,n=t.content-t.viewport,i=(0,c.clamp)(e,"ltr"===r?[0,n]:[-1*n,0]);return U([0,n],[0,a-s])(i)}function U(e,t){return r=>{if(e[0]===e[1]||t[0]===t[1])return t[0];let s=(t[1]-t[0])/(e[1]-e[0]);return t[0]+s*(r-e[0])}}var F=(e,t=()=>{})=>{let r={left:e.scrollLeft,top:e.scrollTop},s=0;return!function l(){let a={left:e.scrollLeft,top:e.scrollTop},n=r.left!==a.left,i=r.top!==a.top;(n||i)&&t(),r=a,s=window.requestAnimationFrame(l)}(),()=>window.cancelAnimationFrame(s)};function Q(e,t){let s=(0,i.useCallbackRef)(e),l=r.useRef(0);return r.useEffect(()=>()=>window.clearTimeout(l.current),[]),r.useCallback(()=>{window.clearTimeout(l.current),l.current=window.setTimeout(s,t)},[s,t])}function B(e,t){let r=(0,i.useCallbackRef)(t);(0,d.useLayoutEffect)(()=>{let t=0;if(e){let s=new ResizeObserver(()=>{cancelAnimationFrame(t),t=window.requestAnimationFrame(r)});return s.observe(e),()=>{window.cancelAnimationFrame(t),s.unobserve(e)}}},[e,r])}var H=e.i(541428);let G=r.forwardRef(({className:e,children:r,...s},l)=>(0,t.jsxs)(g,{ref:l,className:(0,H.cn)("relative overflow-hidden",e),...s,children:[(0,t.jsx)(y,{className:"h-full w-full rounded-[inherit]",children:r}),(0,t.jsx)(Y,{}),(0,t.jsx)(A,{})]}));G.displayName=g.displayName;let Y=r.forwardRef(({className:e,orientation:r="vertical",...s},l)=>(0,t.jsx)(w,{ref:l,orientation:r,className:(0,H.cn)("flex touch-none select-none transition-colors","vertical"===r&&"h-full w-2.5 border-l border-l-transparent p-[1px]","horizontal"===r&&"h-2.5 flex-col border-t border-t-transparent p-[1px]",e),...s,children:(0,t.jsx)(R,{className:"relative flex-1 rounded-full bg-border"})}));Y.displayName=w.displayName,e.s(["ScrollArea",()=>G],632800)},492055,e=>{"use strict";var t=e.i(984804);let r=t.gql`
  fragment CourseBasic on Course {
    id
    title
    slug
    description
    thumbnail
    price
    level
    status
    duration
    avgRating
    enrollmentCount
    reviewCount
    createdAt
    publishedAt
  }
`,s=t.gql`
  fragment CourseDetail on Course {
    ...CourseBasic
    trailer
    metaTitle
    metaDescription
    tags
    whatYouWillLearn
    requirements
    targetAudience
    instructorId
  }
  ${r}
`,l=t.gql`
  query GetCourses($filters: CourseFiltersInput) {
    courses(filters: $filters) {
      data {
        ...CourseBasic
        categoryId
        instructor {
          id
          username
          firstName
          lastName
          avatar
        }
      }
      total
      page
      limit
      totalPages
    }
  }
  ${r}
`,a=t.gql`
  query GetCourseBySlug($slug: String!) {
    courseBySlug(slug: $slug) {
      ...CourseDetail
      categoryId
      instructor {
        id
        username
        firstName
        lastName
        avatar
      }
      modules {
        id
        title
        description
        order
        lessons {
          id
          title
          type
          duration
          order
          isFree
        }
      }
    }
  }
  ${s}
`,n=t.gql`
  query GetMyCourses {
    myCourses {
      ...CourseBasic
      categoryId
    }
  }
  ${r}
`,i=t.gql`
  query GetEnrollment($courseId: ID!) {
    enrollment(courseId: $courseId) {
      id
      userId
      courseId
      status
      progress
      enrolledAt
      completedAt
      lessonProgress {
        id
        lessonId
        completed
        completedAt
      }
    }
  }
`,o=t.gql`
  query GetCourseCategories {
    courseCategories {
      id
      name
      slug
      description
      icon
      parentId
    }
  }
`;t.gql`
  query GetCourseCategoryTree {
    courseCategoryTree {
      id
      name
      slug
      icon
      children {
        id
        name
        slug
        icon
      }
    }
  }
`;let d=t.gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(createCourseInput: $input) {
      ...CourseDetail
    }
  }
  ${s}
`,c=t.gql`
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(updateCourseInput: $input) {
      ...CourseDetail
    }
  }
  ${s}
`;t.gql`
  mutation PublishCourse($id: ID!) {
    publishCourse(id: $id) {
      id
      status
      publishedAt
    }
  }
`,t.gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`,t.gql`
  mutation MarkLessonComplete($enrollmentId: ID!, $lessonId: ID!) {
    markLessonComplete(enrollmentId: $enrollmentId, lessonId: $lessonId) {
      id
      lessonId
      completed
      completedAt
    }
  }
`,t.gql`
  mutation CreateModule($input: CreateModuleInput!) {
    createModule(input: $input) {
      id
      title
      description
      order
      courseId
      lessons {
        id
        title
        type
        order
      }
    }
  }
`,t.gql`
  mutation UpdateModule($input: UpdateModuleInput!) {
    updateModule(input: $input) {
      id
      title
      description
      order
    }
  }
`,t.gql`
  mutation DeleteModule($id: ID!) {
    deleteModule(id: $id)
  }
`,t.gql`
  mutation ReorderModules($input: ReorderModulesInput!) {
    reorderModules(input: $input) {
      id
      title
      order
      lessons {
        id
        title
        order
      }
    }
  }
`,t.gql`
  mutation CreateLesson($input: CreateLessonInput!) {
    createLesson(input: $input) {
      id
      title
      description
      type
      content
      duration
      order
      moduleId
    }
  }
`,t.gql`
  mutation UpdateLesson($input: UpdateLessonInput!) {
    updateLesson(input: $input) {
      id
      title
      description
      type
      content
      duration
      order
    }
  }
`,t.gql`
  mutation DeleteLesson($id: ID!) {
    deleteLesson(id: $id)
  }
`,t.gql`
  mutation ReorderLessons($input: ReorderLessonsInput!) {
    reorderLessons(input: $input) {
      id
      title
      order
    }
  }
`,e.s(["CREATE_COURSE",0,d,"GET_COURSES",0,l,"GET_COURSE_BY_SLUG",0,a,"GET_COURSE_CATEGORIES",0,o,"GET_ENROLLMENT",0,i,"GET_MY_COURSES",0,n,"UPDATE_COURSE",0,c])},816366,e=>{"use strict";let t=(0,e.i(930702).default)("circle-play",[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},224949,e=>{"use strict";var t=e.i(816366);e.s(["PlayCircle",()=>t.default])},298081,e=>{"use strict";let t=(0,e.i(930702).default)("trophy",[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]]);e.s(["default",()=>t])},328819,e=>{"use strict";var t=e.i(298081);e.s(["Trophy",()=>t.default])},473663,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"BailoutToCSR",{enumerable:!0,get:function(){return l}});let s=e.r(494553);function l({reason:e,children:t}){if("undefined"==typeof window)throw Object.defineProperty(new s.BailoutToCSRError(e),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});return t}},130527,(e,t,r)=>{"use strict";function s(e){return e.split("/").map(e=>encodeURIComponent(e)).join("/")}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"encodeURIPath",{enumerable:!0,get:function(){return s}})},870413,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"PreloadChunks",{enumerable:!0,get:function(){return i}});let s=e.r(44990),l=e.r(940392),a=e.r(531459),n=e.r(130527);function i({moduleIds:e}){if("undefined"!=typeof window)return null;let t=a.workAsyncStorage.getStore();if(void 0===t)return null;let r=[];if(t.reactLoadableManifest&&e){let s=t.reactLoadableManifest;for(let t of e){if(!s[t])continue;let e=s[t].files;r.push(...e)}}return 0===r.length?null:(0,s.jsx)(s.Fragment,{children:r.map(e=>{let r=`${t.assetPrefix}/_next/${(0,n.encodeURIPath)(e)}`;return e.endsWith(".css")?(0,s.jsx)("link",{precedence:"dynamic",href:r,rel:"stylesheet",as:"style",nonce:t.nonce},e):((0,l.preload)(r,{as:"script",fetchPriority:"low",nonce:t.nonce}),null)})})}},396905,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return d}});let s=e.r(44990),l=e.r(403055),a=e.r(473663),n=e.r(870413);function i(e){return{default:e&&"default"in e?e.default:e}}let o={loader:()=>Promise.resolve(i(()=>null)),loading:null,ssr:!0},d=function(e){let t={...o,...e},r=(0,l.lazy)(()=>t.loader().then(i)),d=t.loading;function c(e){let i=d?(0,s.jsx)(d,{isLoading:!0,pastDelay:!0,error:null}):null,o=!t.ssr||!!t.loading,c=o?l.Suspense:l.Fragment,u=t.ssr?(0,s.jsxs)(s.Fragment,{children:["undefined"==typeof window?(0,s.jsx)(n.PreloadChunks,{moduleIds:t.modules}):null,(0,s.jsx)(r,{...e})]}):(0,s.jsx)(a.BailoutToCSR,{reason:"next/dynamic",children:(0,s.jsx)(r,{...e})});return(0,s.jsx)(c,{...o?{fallback:i}:{},children:u})}return c.displayName="LoadableComponent",c}},417661,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return l}});let s=e.r(940192)._(e.r(396905));function l(e,t){let r={};"function"==typeof e&&(r.loader=e);let l={...r,...t};return(0,s.default)({...l,modules:l.loadableGenerated?.modules})}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},842183,e=>{"use strict";var t=e.i(44990),r=e.i(403055),s=e.i(429105),l=e.i(130775),a=e.i(492055),n=e.i(245421);let i=(0,e.i(417661).default)(()=>e.A(936078),{loadableGenerated:{modules:[233025]},ssr:!1,loading:()=>(0,t.jsx)("div",{className:"w-full aspect-video bg-gray-900 flex items-center justify-center",children:(0,t.jsx)("div",{className:"text-white",children:"Loading player..."})})});function o({src:e,poster:s,onProgress:l,onComplete:a,autoPlay:n=!1,startTime:o=0}){let d=(0,r.useRef)(null),c=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let e=d.current?.plyr;if(!e||"function"!=typeof e.on)return;o>0&&(e.currentTime=o);let t=()=>{if(e&&e.duration){let t=e.currentTime/e.duration*100;l?.(t)}},r=()=>{t()},s=()=>{l?.(100),a?.(),c.current&&clearInterval(c.current)};return e.on("timeupdate",r),e.on("ended",s),c.current=setInterval(t,5e3),()=>{try{e&&"function"==typeof e.off&&(e.off("timeupdate",r),e.off("ended",s))}catch(e){console.warn("Error removing player event listeners:",e)}c.current&&clearInterval(c.current)}},[l,a,o]),(0,t.jsx)("div",{className:"w-full rounded-lg overflow-hidden bg-black",children:(0,t.jsx)(i,{ref:d,source:{type:"video",sources:[{src:e,type:"video/mp4"}],poster:s},options:{controls:["play-large","restart","rewind","play","fast-forward","progress","current-time","duration","mute","volume","captions","settings","pip","airplay","fullscreen"],settings:["captions","quality","speed"],speed:{selected:1,options:[.5,.75,1,1.25,1.5,1.75,2]},quality:{default:720,options:[4320,2880,2160,1440,1080,720,576,480,360,240]},autoplay:n,keyboard:{focused:!0,global:!0}}})})}var d=e.i(950988),c=e.i(984804);c.gql`
  query GetQuiz($id: ID!) {
    quiz(id: $id) {
      id
      title
      description
      passingScore
      timeLimit
      questions {
        id
        type
        question
        points
        order
        explanation
        answers {
          id
          text
          order
        }
      }
    }
  }
`,c.gql`
  query GetQuizzesByLesson($lessonId: ID!) {
    quizzesByLesson(lessonId: $lessonId) {
      id
      title
      description
      passingScore
      timeLimit
    }
  }
`;let u=c.gql`
  mutation SubmitQuiz($input: SubmitQuizInput!) {
    submitQuiz(input: $input) {
      id
      score
      passed
      timeSpent
      completedAt
      quiz {
        id
        title
        passingScore
        questions {
          id
          question
          type
          points
          explanation
          answers {
            id
            text
            isCorrect
          }
        }
      }
    }
  }
`;c.gql`
  query GetQuizAttempts($quizId: ID!) {
    quizAttempts(quizId: $quizId) {
      id
      score
      passed
      timeSpent
      startedAt
      completedAt
    }
  }
`,c.gql`
  query GetQuizAttempt($id: ID!) {
    quizAttempt(id: $id) {
      id
      score
      passed
      answers
      timeSpent
      startedAt
      completedAt
      quiz {
        id
        title
        description
        passingScore
        questions {
          id
          question
          type
          points
          order
          explanation
          answers {
            id
            text
            isCorrect
            order
          }
        }
      }
    }
  }
`;var m=e.i(415588),p=e.i(822390),x=e.i(257117),h=e.i(198513);function f({quizId:e,enrollmentId:s,onComplete:l}){let a,[i,o]=(0,r.useState)(0),[c,f]=(0,r.useState)({}),[g,b]=(0,r.useState)(null),[y,v]=(0,r.useState)(!1),[w]=(0,r.useState)(Date.now()),{data:N,loading:j,error:C}=(0,n.useFindUnique)("quiz",e,{include:{questions:{include:{answers:!0},orderBy:{order:"asc"}}}}),[S]=(0,d.useMutation)(u);(0,r.useEffect)(()=>{N?.timeLimit&&b(60*N.timeLimit)},[N]),(0,r.useEffect)(()=>{if(null===g||g<=0)return;let e=setInterval(()=>{b(e=>null===e||e<=1?($(),0):e-1)},1e3);return()=>clearInterval(e)},[g]);let $=async()=>{if(!y){v(!0);try{let t=Math.floor((Date.now()-w)/1e3),r=Object.entries(c).map(([e,t])=>({questionId:e,selectedAnswerIds:t})),{data:a}=await S({variables:{input:{quizId:e,enrollmentId:s,answers:r,timeSpent:t}}});a?.submitQuiz?.id&&l(a.submitQuiz.id)}catch(e){console.error("Error submitting quiz:",e),alert("Failed to submit quiz. Please try again."),v(!1)}}};if(j)return(0,t.jsx)("div",{className:"flex items-center justify-center py-12",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})});if(C||!N)return(0,t.jsxs)("div",{className:"bg-red-50 border border-red-200 rounded-lg p-6 text-center",children:[(0,t.jsx)(x.XCircle,{className:"w-12 h-12 text-red-600 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-semibold text-red-900 mb-2",children:"Failed to load quiz"}),(0,t.jsx)("p",{className:"text-red-700",children:C?.message||"Quiz not found"})]});if(!N.questions||0===N.questions.length)return(0,t.jsxs)("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center",children:[(0,t.jsx)(h.AlertCircle,{className:"w-12 h-12 text-yellow-600 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-semibold text-yellow-900 mb-2",children:"No Questions Available"}),(0,t.jsx)("p",{className:"text-yellow-700",children:"This quiz does not have any questions yet."})]});let k=N.questions[i],q=Object.keys(c).length,E=N.questions.length,I=i===E-1,P=q===E;return(0,t.jsxs)("div",{className:"max-w-4xl mx-auto",children:[(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:N.title}),N.description&&(0,t.jsx)("p",{className:"text-gray-600 mt-1",children:N.description})]}),null!==g&&(0,t.jsxs)("div",{className:`flex items-center gap-2 px-4 py-2 rounded-lg ${g<60?"bg-red-100 text-red-700":"bg-blue-100 text-blue-700"}`,children:[(0,t.jsx)(m.Clock,{className:"w-5 h-5"}),(0,t.jsx)("span",{className:"text-lg font-semibold",children:(a=Math.floor(g/60),`${a}:${(g%60).toString().padStart(2,"0")}`)})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"flex-1 bg-gray-200 rounded-full h-2",children:(0,t.jsx)("div",{className:"bg-blue-600 h-2 rounded-full transition-all duration-300",style:{width:`${q/E*100}%`}})}),(0,t.jsxs)("span",{className:"text-sm font-medium text-gray-700",children:[q,"/",E]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6",children:[(0,t.jsx)("h3",{className:"text-sm font-semibold text-gray-700 mb-3",children:"Questions"}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:N.questions.map((e,r)=>{let s=c[e.id]?.length>0,l=r===i;return(0,t.jsx)("button",{onClick:()=>{o(r)},className:`w-10 h-10 rounded-lg font-semibold transition-colors ${l?"bg-blue-600 text-white":s?"bg-green-100 text-green-700 hover:bg-green-200":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:r+1},e.id)})})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6",children:[(0,t.jsx)("div",{className:"flex items-start justify-between mb-6",children:(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-2",children:[(0,t.jsxs)("span",{className:"text-sm font-semibold text-gray-500",children:["Question ",i+1," of ",E]}),(0,t.jsxs)("span",{className:"px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded",children:[k.points," ",1===k.points?"point":"points"]})]}),(0,t.jsx)("h2",{className:"text-xl font-semibold text-gray-900 mb-6",children:k.question})]})}),(0,t.jsx)("div",{className:"space-y-3",children:[...k.answers].sort((e,t)=>e.order-t.order).map(e=>{let r=c[k.id]?.includes(e.id),s="MULTIPLE_CHOICE"===k.type&&k.answers.filter(e=>e.isCorrect).length>1;return(0,t.jsx)("button",{onClick:()=>{var t,r;return t=k.id,r=e.id,void f(e=>{let l=e[t]||[];return s?l.includes(r)?{...e,[t]:l.filter(e=>e!==r)}:{...e,[t]:[...l,r]}:{...e,[t]:[r]}})},className:`w-full text-left p-4 rounded-lg border-2 transition-all ${r?"border-blue-600 bg-blue-50":"border-gray-200 hover:border-blue-300 hover:bg-gray-50"}`,children:(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:`w-5 h-5 rounded-full border-2 flex items-center justify-center ${r?"border-blue-600 bg-blue-600":"border-gray-300"}`,children:r&&(0,t.jsx)("div",{className:"w-2 h-2 bg-white rounded-full"})}),(0,t.jsx)("span",{className:"text-gray-900 font-medium",children:e.text})]})},e.id)})}),"MULTIPLE_CHOICE"===k.type&&k.answers.filter(e=>e.isCorrect).length>1&&(0,t.jsxs)("div",{className:"mt-4 flex items-center gap-2 text-sm text-blue-600",children:[(0,t.jsx)(h.AlertCircle,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:"Select all correct answers"})]})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between gap-4",children:[(0,t.jsx)("button",{onClick:()=>{i>0&&o(i-1)},disabled:0===i,className:"px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-semibold rounded-lg transition-colors",children:"Previous"}),(0,t.jsx)("div",{className:"flex gap-3",children:I?(0,t.jsx)("button",{onClick:$,disabled:!P||y,className:"px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2",children:y?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),"Submitting..."]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(p.CheckCircle,{className:"w-5 h-5"}),"Submit Quiz"]})}):(0,t.jsx)("button",{onClick:()=>{N&&i<N.questions.length-1&&o(i+1)},className:"px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors",children:"Next Question"})})]}),!P&&I&&(0,t.jsxs)("div",{className:"mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3",children:[(0,t.jsx)(h.AlertCircle,{className:"w-5 h-5 text-yellow-600 flex-shrink-0"}),(0,t.jsxs)("p",{className:"text-sm text-yellow-800",children:["Please answer all questions before submitting. Unanswered: ",E-q]})]})]})}var g=e.i(328819),b=e.i(837149);function y({attemptId:e,onRetake:r,onContinue:s}){let{data:l,loading:a,error:i}=(0,n.useFindUnique)("quizAttempt",e,{include:{quiz:{include:{questions:{include:{answers:!0},orderBy:{order:"asc"}}}}}});if(a)return(0,t.jsx)("div",{className:"flex items-center justify-center py-12",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})});if(i||!l)return(0,t.jsxs)("div",{className:"bg-red-50 border border-red-200 rounded-lg p-6 text-center",children:[(0,t.jsx)(x.XCircle,{className:"w-12 h-12 text-red-600 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-semibold text-red-900 mb-2",children:"Failed to load results"}),(0,t.jsx)("p",{className:"text-red-700",children:i?.message||"Results not found"})]});if(!l.quiz||!l.quiz.questions)return(0,t.jsxs)("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center",children:[(0,t.jsx)(h.AlertCircle,{className:"w-12 h-12 text-yellow-600 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-semibold text-yellow-900 mb-2",children:"Incomplete Data"}),(0,t.jsx)("p",{className:"text-yellow-700",children:"Quiz data is not available for this attempt"})]});let o=JSON.parse(l.answers||"{}"),d=l.quiz.questions.length,c=0;return l.quiz.questions.forEach(e=>{let t=o[e.id]||[],r=e.answers.filter(e=>e.isCorrect).map(e=>e.id);t.length===r.length&&t.every(e=>r.includes(e))&&r.every(e=>t.includes(e))&&c++}),(0,t.jsxs)("div",{className:"max-w-4xl mx-auto",children:[(0,t.jsx)("div",{className:`rounded-xl shadow-lg border-2 p-8 mb-8 ${l.passed?"bg-gradient-to-r from-green-50 to-emerald-50 border-green-200":"bg-gradient-to-r from-red-50 to-orange-50 border-red-200"}`,children:(0,t.jsxs)("div",{className:"text-center",children:[l.passed?(0,t.jsx)(g.Trophy,{className:"w-20 h-20 text-green-600 mx-auto mb-4"}):(0,t.jsx)(x.XCircle,{className:"w-20 h-20 text-red-600 mx-auto mb-4"}),(0,t.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:l.passed?"Congratulations!":"Keep Trying!"}),(0,t.jsx)("p",{className:"text-lg text-gray-700 mb-6",children:l.passed?`You passed the quiz with ${l.score.toFixed(1)}%`:`You scored ${l.score.toFixed(1)}%. You need ${l.quiz.passingScore}% to pass.`}),(0,t.jsx)("div",{className:"inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg mb-6",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsxs)("div",{className:`text-4xl font-bold ${l.passed?"text-green-600":"text-red-600"}`,children:[l.score.toFixed(0),"%"]}),(0,t.jsx)("div",{className:"text-sm text-gray-600",children:"Score"})]})}),(0,t.jsxs)("div",{className:"grid grid-cols-3 gap-4 max-w-2xl mx-auto",children:[(0,t.jsxs)("div",{className:"bg-white rounded-lg p-4 shadow",children:[(0,t.jsxs)("div",{className:"flex items-center justify-center gap-2 mb-2",children:[(0,t.jsx)(p.CheckCircle,{className:"w-5 h-5 text-green-600"}),(0,t.jsx)("span",{className:"text-2xl font-bold text-gray-900",children:c})]}),(0,t.jsx)("div",{className:"text-sm text-gray-600",children:"Correct"})]}),(0,t.jsxs)("div",{className:"bg-white rounded-lg p-4 shadow",children:[(0,t.jsxs)("div",{className:"flex items-center justify-center gap-2 mb-2",children:[(0,t.jsx)(x.XCircle,{className:"w-5 h-5 text-red-600"}),(0,t.jsx)("span",{className:"text-2xl font-bold text-gray-900",children:d-c})]}),(0,t.jsx)("div",{className:"text-sm text-gray-600",children:"Incorrect"})]}),(0,t.jsxs)("div",{className:"bg-white rounded-lg p-4 shadow",children:[(0,t.jsxs)("div",{className:"flex items-center justify-center gap-2 mb-2",children:[(0,t.jsx)(m.Clock,{className:"w-5 h-5 text-blue-600"}),(0,t.jsx)("span",{className:"text-2xl font-bold text-gray-900",children:(e=>{if(!e)return"N/A";let t=Math.floor(e/60);return`${t}m ${e%60}s`})(l.timeSpent)})]}),(0,t.jsx)("div",{className:"text-sm text-gray-600",children:"Time"})]})]})]})}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6",children:[(0,t.jsxs)("h2",{className:"text-xl font-bold text-gray-900 mb-6 flex items-center gap-2",children:[(0,t.jsx)(b.Target,{className:"w-6 h-6 text-blue-600"}),"Question Review"]}),(0,t.jsx)("div",{className:"space-y-6",children:[...l.quiz.questions].sort((e,t)=>e.order-t.order).map((e,r)=>{let s=o[e.id]||[],l=e.answers.filter(e=>e.isCorrect).map(e=>e.id),a=s.length===l.length&&s.every(e=>l.includes(e))&&l.every(e=>s.includes(e));return(0,t.jsx)("div",{className:`border-2 rounded-lg p-6 ${a?"border-green-200 bg-green-50":"border-red-200 bg-red-50"}`,children:(0,t.jsxs)("div",{className:"flex items-start gap-3 mb-4",children:[a?(0,t.jsx)(p.CheckCircle,{className:"w-6 h-6 text-green-600 flex-shrink-0 mt-1"}):(0,t.jsx)(x.XCircle,{className:"w-6 h-6 text-red-600 flex-shrink-0 mt-1"}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-2",children:[(0,t.jsxs)("span",{className:"text-sm font-semibold text-gray-600",children:["Question ",r+1]}),(0,t.jsxs)("span",{className:"px-2 py-1 bg-white text-gray-700 text-xs font-medium rounded",children:[e.points," pts"]})]}),(0,t.jsx)("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:e.question}),(0,t.jsx)("div",{className:"space-y-2",children:[...e.answers].sort((e,t)=>e.order-t.order).map(e=>{let r=s.includes(e.id),l=e.isCorrect;return(0,t.jsx)("div",{className:`p-3 rounded-lg border-2 ${l&&r?"border-green-500 bg-green-100":l?"border-green-300 bg-green-50":r?"border-red-500 bg-red-100":"border-gray-200 bg-white"}`,children:(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[l&&(0,t.jsx)(p.CheckCircle,{className:"w-5 h-5 text-green-600 flex-shrink-0"}),r&&!l&&(0,t.jsx)(x.XCircle,{className:"w-5 h-5 text-red-600 flex-shrink-0"}),(0,t.jsx)("span",{className:`flex-1 ${l?"font-semibold text-green-900":"text-gray-700"}`,children:e.text}),l&&(0,t.jsx)("span",{className:"text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded",children:"Correct"}),r&&(0,t.jsx)("span",{className:"text-xs font-semibold text-gray-700 bg-gray-200 px-2 py-1 rounded",children:"Your answer"})]})},e.id)})}),e.explanation&&(0,t.jsxs)("div",{className:"mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3",children:[(0,t.jsx)(h.AlertCircle,{className:"w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h4",{className:"font-semibold text-blue-900 mb-1",children:"Explanation"}),(0,t.jsx)("p",{className:"text-blue-800 text-sm",children:e.explanation})]})]})]})]})},e.id)})})]}),(0,t.jsxs)("div",{className:"flex items-center justify-center gap-4",children:[r&&(0,t.jsx)("button",{onClick:r,className:"px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors",children:"Retake Quiz"}),s&&(0,t.jsx)("button",{onClick:s,className:"px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors",children:"Continue Learning"})]})]})}var v=e.i(224949),w=e.i(421329);function N({lesson:e,enrollmentId:s,isCompleted:l=!1,onComplete:a,nextLesson:i,onNextLesson:d}){let[c,u]=(0,r.useState)(0),[x,h]=(0,r.useState)(l),[g,b]=(0,r.useState)(null),[N,j]=(0,r.useState)(!1),[C]=(0,n.useCreateOne)("lessonProgress"),[S]=(0,n.useUpdateOne)("lessonProgress"),{data:$,loading:k}=(0,n.useFindMany)("quiz",{where:{lessonId:e.id,..."QUIZ"===e.type?{}:{id:"never-match"}}}),{data:q,refetch:E}=(0,n.useFindMany)("lessonProgress",{where:{enrollmentId:s||"skip",lessonId:e.id},take:1}),I=q?.[0],P=e=>{u(e),e>=90&&!x&&s&&T()},R=()=>{!x&&s&&T()},T=async()=>{if(s&&!N){j(!0);try{if(await E(),I?.id)await S({where:{id:I.id},data:{completed:!0,completedAt:new Date().toISOString()}});else try{await C({data:{enrollmentId:s,lessonId:e.id,completed:!0,completedAt:new Date().toISOString()}})}catch(e){if(e?.message?.includes("unique constraint")||e?.message?.includes("already exists")){await E();let e=q?.[0];e?.id&&await S({where:{id:e.id},data:{completed:!0,completedAt:new Date().toISOString()}})}else throw e}h(!0),await E(),a?.()}catch(e){console.error("Failed to mark lesson complete:",e)}finally{j(!1)}}};return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsx)("div",{className:"bg-white rounded-lg p-6 shadow-sm",children:(0,t.jsx)("div",{className:"flex items-start justify-between",children:(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:["VIDEO"===e.type&&(0,t.jsx)(v.PlayCircle,{className:"w-5 h-5 text-blue-600"}),"TEXT"===e.type&&(0,t.jsx)(w.FileText,{className:"w-5 h-5 text-green-600"}),"QUIZ"===e.type&&(0,t.jsx)(w.FileText,{className:"w-5 h-5 text-purple-600"}),(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:e.title})]}),e.description&&(0,t.jsx)("p",{className:"text-gray-600 mb-4",children:e.description}),(0,t.jsxs)("div",{className:"flex items-center gap-4 text-sm text-gray-500",children:[e.duration&&(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(m.Clock,{className:"w-4 h-4"}),(0,t.jsxs)("span",{children:[e.duration," minutes"]})]}),x&&(0,t.jsxs)("div",{className:"flex items-center gap-1 text-green-600",children:[(0,t.jsx)(p.CheckCircle,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"font-medium",children:"Completed"})]})]})]})})}),(()=>{switch(e.type){case"VIDEO":return(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(o,{src:e.content||"",onProgress:P,onComplete:R}),(0,t.jsxs)("div",{className:"bg-white rounded-lg p-4 shadow-sm",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,t.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Video Progress"}),(0,t.jsxs)("span",{className:"text-sm font-bold text-blue-600",children:[Math.round(c),"%"]})]}),(0,t.jsx)("div",{className:"w-full bg-gray-200 rounded-full h-2",children:(0,t.jsx)("div",{className:"bg-blue-600 h-2 rounded-full transition-all duration-300",style:{width:`${c}%`}})})]})]});case"TEXT":return(0,t.jsxs)("div",{className:"bg-white rounded-lg p-8 shadow-sm",children:[(0,t.jsx)("div",{className:"prose prose-lg max-w-none",dangerouslySetInnerHTML:{__html:e.content||""}}),!x&&s&&(0,t.jsx)("button",{onClick:T,disabled:N,className:"mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-colors",children:N?"Marking Complete...":"Mark as Complete"})]});case"QUIZ":let r=$?.[0];if(!r)return(0,t.jsxs)("div",{className:"bg-white rounded-lg p-8 shadow-sm text-center",children:[(0,t.jsx)("div",{className:"w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4",children:(0,t.jsx)(w.FileText,{className:"w-8 h-8 text-purple-600"})}),(0,t.jsx)("h3",{className:"text-xl font-bold text-gray-900 mb-2",children:"No Quiz Available"}),(0,t.jsx)("p",{className:"text-gray-600 mb-6",children:"This lesson does not have a quiz yet"})]});if(g)return(0,t.jsx)(y,{attemptId:g,onRetake:()=>b(null),onContinue:d});if(!s)return(0,t.jsx)("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center",children:(0,t.jsx)("p",{className:"text-yellow-800",children:"You must be enrolled to take this quiz"})});return(0,t.jsx)(f,{quizId:r.id,enrollmentId:s,onComplete:e=>{b(e),T(),a?.()}});case"ASSIGNMENT":return(0,t.jsxs)("div",{className:"bg-white rounded-lg p-8 shadow-sm text-center",children:[(0,t.jsx)("div",{className:"w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4",children:(0,t.jsx)(w.FileText,{className:"w-8 h-8 text-orange-600"})}),(0,t.jsx)("h3",{className:"text-xl font-bold text-gray-900 mb-2",children:"Assignment Coming Soon"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Assignment submission will be available in the next update"})]});default:return null}})(),x&&i&&d&&(0,t.jsx)("div",{className:"bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-semibold text-gray-900 mb-1",children:"Ready for the next lesson?"}),(0,t.jsx)("p",{className:"text-sm text-gray-600",children:i.title})]}),(0,t.jsxs)("button",{onClick:d,className:"bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center gap-2",children:["Next Lesson",(0,t.jsx)(v.PlayCircle,{className:"w-4 h-4"})]})]})})]})}var j=e.i(567961),C=e.i(519647),S=e.i(169989),$=e.i(579448),k=e.i(775680),q=e.i(885205),E=e.i(645030),I=e.i(632800),P=e.i(541428);function R(){let e=(0,l.useParams)(),n=(0,l.useSearchParams)(),i=e?.slug,o=n?.get("lesson"),{data:d,loading:c}=(0,s.useQuery)(a.GET_COURSE_BY_SLUG,{variables:{slug:i},skip:!i}),{data:u,loading:m,refetch:x}=(0,s.useQuery)(a.GET_ENROLLMENT,{variables:{courseId:d?.courseBySlug?.id||""},skip:!d?.courseBySlug?.id}),h=d?.courseBySlug,f=u?.enrollment,g=h?.modules?.flatMap(e=>e.lessons.map(t=>({...t,moduleName:e.title,moduleOrder:e.order}))).sort((e,t)=>e.moduleOrder!==t.moduleOrder?e.moduleOrder-t.moduleOrder:e.order-t.order)||[],[b,y]=(0,r.useState)(()=>o?g.findIndex(e=>e.id===o):0),R=g[b],T=g[b+1],M=e=>f?.lessonProgress?.some(t=>t.lessonId===e&&t.completed);return c||m?(0,t.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center",children:(0,t.jsx)(k.Card,{className:"w-full max-w-md",children:(0,t.jsxs)(k.CardContent,{className:"pt-6 text-center",children:[(0,t.jsx)(S.Loader2,{className:"w-12 h-12 animate-spin text-primary mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Đang tải khóa học..."})]})})}):h&&f?(0,t.jsx)("div",{className:"min-h-screen bg-background",children:(0,t.jsxs)("div",{className:"flex flex-col lg:flex-row",children:[(0,t.jsx)("aside",{className:"w-full lg:w-96 bg-card border-b lg:border-r lg:border-b-0 lg:h-screen lg:sticky lg:top-0",children:(0,t.jsxs)(I.ScrollArea,{className:"h-[400px] lg:h-screen",children:[(0,t.jsxs)("div",{className:"p-4 md:p-6 border-b",children:[(0,t.jsx)(q.Button,{variant:"ghost",size:"sm",asChild:!0,className:"mb-3 -ml-2",children:(0,t.jsxs)($.default,{href:`/lms/courses/${i}`,children:[(0,t.jsx)(C.ArrowLeft,{className:"w-4 h-4 mr-2"}),"Quay lại"]})}),(0,t.jsx)("h2",{className:"text-lg font-bold mb-4",children:h.title}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:"Tiến độ của bạn"}),(0,t.jsxs)("span",{className:"text-sm font-bold text-primary",children:[f.progress,"%"]})]}),(0,t.jsx)(E.Progress,{value:f.progress,className:"h-2"})]})]}),(0,t.jsx)("div",{className:"p-4",children:h.modules?.map((e,r)=>(0,t.jsxs)("div",{className:"mb-6",children:[(0,t.jsxs)("h3",{className:"text-sm font-semibold mb-3 px-2",children:[r+1,". ",e.title]}),(0,t.jsx)("div",{className:"space-y-1",children:e.lessons.map((e,r)=>{let s=g.findIndex(t=>t.id===e.id),l=M(e.id),a=s===b;return(0,t.jsx)(q.Button,{onClick:()=>{y(s)},variant:a?"default":"ghost",className:(0,P.cn)("w-full justify-start h-auto py-3 px-3",a&&"bg-primary text-primary-foreground"),children:(0,t.jsxs)("div",{className:"flex items-start gap-3 w-full",children:[(0,t.jsx)("div",{className:"flex-shrink-0 mt-0.5",children:l?(0,t.jsx)(p.CheckCircle,{className:"w-5 h-5 text-green-600"}):"VIDEO"===e.type?(0,t.jsx)(v.PlayCircle,{className:(0,P.cn)("w-5 h-5",a?"text-primary-foreground":"text-muted-foreground")}):(0,t.jsx)(w.FileText,{className:(0,P.cn)("w-5 h-5",a?"text-primary-foreground":"text-muted-foreground")})}),(0,t.jsxs)("div",{className:"flex-1 min-w-0 text-left",children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:e.title}),e.duration&&(0,t.jsxs)("p",{className:(0,P.cn)("text-xs mt-1",a?"text-primary-foreground/70":"text-muted-foreground"),children:[e.duration," phút"]})]}),a&&(0,t.jsx)(j.ChevronRight,{className:"w-5 h-5 flex-shrink-0"})]})},e.id)})})]},e.id))})]})}),(0,t.jsx)("main",{className:"flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full",children:R?(0,t.jsx)(N,{lesson:R,enrollmentId:f.id,isCompleted:M(R.id),onComplete:()=>x(),nextLesson:T,onNextLesson:()=>{b<g.length-1&&y(b+1)}}):(0,t.jsx)(k.Card,{children:(0,t.jsx)(k.CardContent,{className:"text-center py-16",children:(0,t.jsx)("p",{className:"text-muted-foreground",children:"Chưa có bài học nào"})})})})]})}):(0,t.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center p-4",children:(0,t.jsx)(k.Card,{className:"w-full max-w-md",children:(0,t.jsxs)(k.CardContent,{className:"pt-6 text-center space-y-4",children:[(0,t.jsx)("h1",{className:"text-2xl font-bold",children:"Không tìm thấy khóa học"}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Bạn có thể chưa đăng ký khóa học này"}),(0,t.jsx)(q.Button,{asChild:!0,children:(0,t.jsx)($.default,{href:"/lms/courses",children:"Khám phá khóa học"})})]})})})}e.s(["default",()=>R],842183)},936078,e=>{e.v(t=>Promise.all(["static/chunks/7974cb379ac4668c.js"].map(t=>e.l(t))).then(()=>t(233025)))}]);