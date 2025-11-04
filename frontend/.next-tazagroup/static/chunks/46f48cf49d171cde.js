(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),n=e.i(873273),i=a.forwardRef((e,a)=>(0,t.jsx)(n.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));i.displayName="Label";var r=e.i(541428);function o({className:e,...a}){return(0,t.jsx)(i,{"data-slot":"label",className:(0,r.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>o],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),n=e.i(541428);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("textarea",{className:(0,n.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...a}));i.displayName="Textarea",e.s(["Textarea",()=>i])},138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),n=e.i(529590),i=e.i(403055),r=e.i(984804);let o=r.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,s=r.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,l=r.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,u=r.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,d=r.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,c=r.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=r.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,f=r.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,h=r.gql`
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
`,p=r.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,g=r.gql`
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
`,y=r.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,v=r.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,b=r.gql`
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
`,w=r.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,M=r.gql`
  mutation ClearCache {
    clearCache
  }
`;function N(e,a,n){let i=!!localStorage.getItem("accessToken"),r=n?.skip||n?.requireAuth!==!1&&!i,{data:s,loading:l,error:u,refetch:d}=(0,t.useQuery)(o,{variables:{modelName:e,input:a||{}},skip:r,fetchPolicy:n?.fetchPolicy||"cache-and-network"});return{data:s?.findMany,loading:l,error:u,refetch:d}}function D(e,a,n,i){let r=!!localStorage.getItem("accessToken"),o="string"==typeof a?a:a?.id;o||i?.skip;let l=i?.skip||!o||i?.requireAuth!==!1&&!r,{data:u,loading:d,error:c,refetch:m}=(0,t.useQuery)(s,{variables:{modelName:e,input:{id:o||"",select:n?.select,include:n?.include}},skip:l});return{data:u?.findById,loading:d,error:c,refetch:m}}function x(e,a,n){let[r,o]=(0,i.useState)(a?.page||1),[s,l]=(0,i.useState)(a?.limit||10),d=!!localStorage.getItem("accessToken"),c=n?.skip||n?.requireAuth!==!1&&!d,{data:m,loading:f,error:h,refetch:p}=(0,t.useQuery)(u,{variables:{modelName:e,input:{page:r,limit:s,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:c,fetchPolicy:"cache-and-network"}),g=m?.findManyPaginated,y=(0,i.useCallback)(e=>{o(e)},[]),v=(0,i.useCallback)(()=>{g?.meta.hasNextPage&&o(e=>e+1)},[g]),b=(0,i.useCallback)(()=>{g?.meta.hasPrevPage&&o(e=>e-1)},[g]),w=(0,i.useCallback)(e=>{l(e),o(1)},[]);return{data:g?.data,meta:g?.meta,loading:f,error:h,refetch:p,page:r,limit:s,goToPage:y,nextPage:v,prevPage:b,changeLimit:w}}function $(e,a,n){let{data:i,loading:r,error:o,refetch:s}=(0,t.useQuery)(d,{variables:{modelName:e,where:a},skip:n?.skip});return{count:i?.count,loading:r,error:o,refetch:s}}function S(e,t){let[n,{data:r,loading:o,error:s}]=(0,a.useMutation)(f,{refetchQueries:t?.refetchQueries});return[(0,i.useCallback)(async t=>{let a=await n({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[n,e]),{data:r?.createOne,loading:o,error:s}]}function P(e,t){let[n,{data:r,loading:o,error:s}]=(0,a.useMutation)(p,{refetchQueries:t?.refetchQueries});return[(0,i.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let i=await n({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return i.data?.updateOne},[n,e]),{data:r?.updateOne,loading:o,error:s}]}function C(e,t){let[n,{data:r,loading:o,error:s}]=(0,a.useMutation)(y,{refetchQueries:t?.refetchQueries});return[(0,i.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let i=await n({variables:{modelName:e,input:{id:a,select:t.select}}});return i.data?.deleteOne},[n,e]),{data:r?.deleteOne,loading:o,error:s}]}function k(e){let t=(0,n.useApolloClient)(),[r,l]=S(e),[u,c]=function(e,t){let[n,{data:r,loading:o,error:s}]=(0,a.useMutation)(h,{refetchQueries:void 0});return[(0,i.useCallback)(async t=>{let a=await n({variables:{model:e,...t}});return a.data?.createMany},[n,e]),{data:r?.createMany,loading:o,error:s}]}(e),[m,f]=P(e),[p,y]=function(e,t){let[n,{data:r,loading:o,error:s}]=(0,a.useMutation)(g,{refetchQueries:void 0});return[(0,i.useCallback)(async t=>{let a=await n({variables:{model:e,...t}});return a.data?.updateMany},[n,e]),{data:r?.updateMany,loading:o,error:s}]}(e),[w,M]=C(e),[N,D]=function(e,t){let[n,{data:r,loading:o,error:s}]=(0,a.useMutation)(v,{refetchQueries:void 0});return[(0,i.useCallback)(async t=>{let a=await n({variables:{model:e,where:t}});return a.data?.deleteMany},[n,e]),{data:r?.deleteMany,loading:o,error:s}]}(e),[x,$]=function(e,t){let[n,{data:r,loading:o,error:s}]=(0,a.useMutation)(b,{refetchQueries:void 0});return[(0,i.useCallback)(async t=>{let a=await n({variables:{model:e,...t}});return a.data?.upsert},[n,e]),{data:r?.upsert,loading:o,error:s}]}(e),k=(0,i.useCallback)(async a=>(await t.query({query:o,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:k,findUnique:(0,i.useCallback)(async(a,n)=>(await t.query({query:s,variables:{model:e,where:a,...n},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,i.useCallback)(async a=>(await t.query({query:d,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:r,createMany:u,updateOne:m,updateMany:p,deleteOne:w,deleteMany:N,upsert:x,states:{createOne:l,createMany:c,updateOne:f,updateMany:y,deleteOne:M,deleteMany:D,upsert:$},loading:l.loading||c.loading||f.loading||y.loading||M.loading||D.loading||$.loading}}e.s(["AGGREGATE",0,c,"CLEAR_CACHE",0,M,"COUNT",0,d,"CREATE_MANY",0,h,"CREATE_ONE",0,f,"DELETE_MANY",0,v,"DELETE_ONE",0,y,"FIND_FIRST",0,l,"FIND_MANY",0,o,"FIND_MANY_PAGINATED",0,u,"FIND_UNIQUE",0,s,"GET_AVAILABLE_MODELS",0,w,"GROUP_BY",0,m,"UPDATE_MANY",0,g,"UPDATE_ONE",0,p,"UPSERT",0,b],272901),e.s(["useCRUD",()=>k,"useCount",()=>$,"useCreateOne",()=>S,"useDeleteOne",()=>C,"useFindMany",()=>N,"useFindManyPaginated",()=>x,"useFindUnique",()=>D,"useUpdateOne",()=>P],245421)},996517,e=>{"use strict";var t=e.i(44990),a=e.i(403055),n=e.i(119836),i=e.i(316618),r=e.i(377991),o=e.i(767478),s=e.i(873273),l=e.i(825198),u=e.i(346412),d=e.i(559663),c="Tabs",[m,f]=(0,i.createContextScope)(c,[r.createRovingFocusGroupScope]),h=(0,r.createRovingFocusGroupScope)(),[p,g]=m(c),y=a.forwardRef((e,a)=>{let{__scopeTabs:n,value:i,onValueChange:r,defaultValue:o,orientation:m="horizontal",dir:f,activationMode:h="automatic",...g}=e,y=(0,l.useDirection)(f),[v,b]=(0,u.useControllableState)({prop:i,onChange:r,defaultProp:o??"",caller:c});return(0,t.jsx)(p,{scope:n,baseId:(0,d.useId)(),value:v,onValueChange:b,orientation:m,dir:y,activationMode:h,children:(0,t.jsx)(s.Primitive.div,{dir:y,"data-orientation":m,...g,ref:a})})});y.displayName=c;var v="TabsList",b=a.forwardRef((e,a)=>{let{__scopeTabs:n,loop:i=!0,...o}=e,l=g(v,n),u=h(n);return(0,t.jsx)(r.Root,{asChild:!0,...u,orientation:l.orientation,dir:l.dir,loop:i,children:(0,t.jsx)(s.Primitive.div,{role:"tablist","aria-orientation":l.orientation,...o,ref:a})})});b.displayName=v;var w="TabsTrigger",M=a.forwardRef((e,a)=>{let{__scopeTabs:i,value:o,disabled:l=!1,...u}=e,d=g(w,i),c=h(i),m=x(d.baseId,o),f=$(d.baseId,o),p=o===d.value;return(0,t.jsx)(r.Item,{asChild:!0,...c,focusable:!l,active:p,children:(0,t.jsx)(s.Primitive.button,{type:"button",role:"tab","aria-selected":p,"aria-controls":f,"data-state":p?"active":"inactive","data-disabled":l?"":void 0,disabled:l,id:m,...u,ref:a,onMouseDown:(0,n.composeEventHandlers)(e.onMouseDown,e=>{l||0!==e.button||!1!==e.ctrlKey?e.preventDefault():d.onValueChange(o)}),onKeyDown:(0,n.composeEventHandlers)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&d.onValueChange(o)}),onFocus:(0,n.composeEventHandlers)(e.onFocus,()=>{let e="manual"!==d.activationMode;p||l||!e||d.onValueChange(o)})})})});M.displayName=w;var N="TabsContent",D=a.forwardRef((e,n)=>{let{__scopeTabs:i,value:r,forceMount:l,children:u,...d}=e,c=g(N,i),m=x(c.baseId,r),f=$(c.baseId,r),h=r===c.value,p=a.useRef(h);return a.useEffect(()=>{let e=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,t.jsx)(o.Presence,{present:l||h,children:({present:a})=>(0,t.jsx)(s.Primitive.div,{"data-state":h?"active":"inactive","data-orientation":c.orientation,role:"tabpanel","aria-labelledby":m,hidden:!a,id:f,tabIndex:0,...d,ref:n,style:{...e.style,animationDuration:p.current?"0s":void 0},children:a&&u})})});function x(e,t){return`${e}-trigger-${t}`}function $(e,t){return`${e}-content-${t}`}D.displayName=N;var S=e.i(541428);let P=a.forwardRef(({className:e,...a},n)=>(0,t.jsx)(b,{ref:n,className:(0,S.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",e),...a}));P.displayName=b.displayName;let C=a.forwardRef(({className:e,...a},n)=>(0,t.jsx)(M,{ref:n,className:(0,S.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",e),...a}));C.displayName=M.displayName;let k=a.forwardRef(({className:e,...a},n)=>(0,t.jsx)(D,{ref:n,className:(0,S.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",e),...a}));k.displayName=D.displayName,e.s(["Tabs",()=>y,"TabsContent",()=>k,"TabsList",()=>P,"TabsTrigger",()=>C],996517)},965120,e=>{"use strict";var t=e.i(381299);e.s(["Edit",()=>t.default])},553082,e=>{"use strict";var t=e.i(813046);e.s(["Save",()=>t.default])},67087,e=>{"use strict";var t=e.i(44990),a=e.i(403055),n=e.i(541428);let i=a.forwardRef(({className:e,orientation:a="horizontal",decorative:i=!0,...r},o)=>(0,t.jsx)("div",{ref:o,role:i?"none":"separator","aria-orientation":i?void 0:a,className:(0,n.cn)("shrink-0 bg-gray-200","horizontal"===a?"h-[1px] w-full":"h-full w-[1px]",e),...r}));i.displayName="Separator",e.s(["Separator",()=>i])},645030,e=>{"use strict";var t=e.i(44990),a=e.i(403055),n=e.i(316618),i=e.i(873273),r="Progress",[o,s]=(0,n.createContextScope)(r),[l,u]=o(r),d=a.forwardRef((e,a)=>{var n,r;let{__scopeProgress:o,value:s=null,max:u,getValueLabel:d=f,...c}=e;(u||0===u)&&!g(u)&&console.error((n=`${u}`,`Invalid prop \`max\` of value \`${n}\` supplied to \`Progress\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`));let m=g(u)?u:100;null===s||y(s,m)||console.error((r=`${s}`,`Invalid prop \`value\` of value \`${r}\` supplied to \`Progress\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`));let v=y(s,m)?s:null,b=p(v)?d(v,m):void 0;return(0,t.jsx)(l,{scope:o,value:v,max:m,children:(0,t.jsx)(i.Primitive.div,{"aria-valuemax":m,"aria-valuemin":0,"aria-valuenow":p(v)?v:void 0,"aria-valuetext":b,role:"progressbar","data-state":h(v,m),"data-value":v??void 0,"data-max":m,...c,ref:a})})});d.displayName=r;var c="ProgressIndicator",m=a.forwardRef((e,a)=>{let{__scopeProgress:n,...r}=e,o=u(c,n);return(0,t.jsx)(i.Primitive.div,{"data-state":h(o.value,o.max),"data-value":o.value??void 0,"data-max":o.max,...r,ref:a})});function f(e,t){return`${Math.round(e/t*100)}%`}function h(e,t){return null==e?"indeterminate":e===t?"complete":"loading"}function p(e){return"number"==typeof e}function g(e){return p(e)&&!isNaN(e)&&e>0}function y(e,t){return p(e)&&!isNaN(e)&&e<=t&&e>=0}m.displayName=c;var v=e.i(541428);let b=a.forwardRef(({className:e,value:a,indicatorClassName:n,...i},r)=>(0,t.jsx)(d,{ref:r,className:(0,v.cn)("relative h-4 w-full overflow-hidden rounded-full bg-secondary",e),...i,children:(0,t.jsx)(m,{className:(0,v.cn)("h-full w-full flex-1 bg-primary transition-all",n),style:{transform:`translateX(-${100-(a||0)}%)`}})}));b.displayName=d.displayName,e.s(["Progress",()=>b],645030)},320309,e=>{"use strict";var t=e.i(366456);e.s(["UserPlus",()=>t.default])},495043,e=>{"use strict";var t=e.i(217696);e.s(["MoreVertical",()=>t.default])},495280,e=>{"use strict";var t=e.i(46213);e.s(["MessageSquare",()=>t.default])},742049,e=>{"use strict";var t=e.i(909181);e.s(["Archive",()=>t.default])},576884,e=>{"use strict";var t=e.i(933414);e.s(["Tag",()=>t.default])},919528,31049,436741,702549,572606,98810,e=>{"use strict";let t={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}};function a(e){return (t={})=>{let a=t.width?String(t.width):e.defaultWidth;return e.formats[a]||e.formats[e.defaultWidth]}}e.s(["buildFormatLongFn",()=>a],31049);let n={date:a({formats:{full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},defaultWidth:"full"}),time:a({formats:{full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},defaultWidth:"full"}),dateTime:a({formats:{full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},defaultWidth:"full"})},i={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"};function r(e){return(t,a)=>{let n;if("formatting"===(a?.context?String(a.context):"standalone")&&e.formattingValues){let t=e.defaultFormattingWidth||e.defaultWidth,i=a?.width?String(a.width):t;n=e.formattingValues[i]||e.formattingValues[t]}else{let t=e.defaultWidth,i=a?.width?String(a.width):e.defaultWidth;n=e.values[i]||e.values[t]}return n[e.argumentCallback?e.argumentCallback(t):t]}}e.s(["buildLocalizeFn",()=>r],436741);let o={ordinalNumber:(e,t)=>{let a=Number(e),n=a%100;if(n>20||n<10)switch(n%10){case 1:return a+"st";case 2:return a+"nd";case 3:return a+"rd"}return a+"th"},era:r({values:{narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},defaultWidth:"wide"}),quarter:r({values:{narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},defaultWidth:"wide",argumentCallback:e=>e-1}),month:r({values:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},defaultWidth:"wide"}),day:r({values:{narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},defaultWidth:"wide"}),dayPeriod:r({values:{narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},defaultWidth:"wide",formattingValues:{narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},defaultFormattingWidth:"wide"})};function s(e){return(t,a={})=>{let n,i=a.width,r=i&&e.matchPatterns[i]||e.matchPatterns[e.defaultMatchWidth],o=t.match(r);if(!o)return null;let s=o[0],l=i&&e.parsePatterns[i]||e.parsePatterns[e.defaultParseWidth],u=Array.isArray(l)?function(e,t){for(let a=0;a<e.length;a++)if(t(e[a]))return a}(l,e=>e.test(s)):function(e,t){for(let a in e)if(Object.prototype.hasOwnProperty.call(e,a)&&t(e[a]))return a}(l,e=>e.test(s));return n=e.valueCallback?e.valueCallback(u):u,{value:n=a.valueCallback?a.valueCallback(n):n,rest:t.slice(s.length)}}}function l(e){return(t,a={})=>{let n=t.match(e.matchPattern);if(!n)return null;let i=n[0],r=t.match(e.parsePattern);if(!r)return null;let o=e.valueCallback?e.valueCallback(r[0]):r[0];return{value:o=a.valueCallback?a.valueCallback(o):o,rest:t.slice(i.length)}}}e.s(["buildMatchFn",()=>s],702549),e.s(["buildMatchPatternFn",()=>l],572606);let u={ordinalNumber:l({matchPattern:/^(\d+)(th|st|nd|rd)?/i,parsePattern:/\d+/i,valueCallback:e=>parseInt(e,10)}),era:s({matchPatterns:{narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},defaultMatchWidth:"wide",parsePatterns:{any:[/^b/i,/^(a|c)/i]},defaultParseWidth:"any"}),quarter:s({matchPatterns:{narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},defaultMatchWidth:"wide",parsePatterns:{any:[/1/i,/2/i,/3/i,/4/i]},defaultParseWidth:"any",valueCallback:e=>e+1}),month:s({matchPatterns:{narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},defaultParseWidth:"any"}),day:s({matchPatterns:{narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},defaultParseWidth:"any"}),dayPeriod:s({matchPatterns:{narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},defaultMatchWidth:"any",parsePatterns:{any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},defaultParseWidth:"any"})};e.s(["defaultLocale",0,{code:"en-US",formatDistance:(e,a,n)=>{let i,r=t[e];if(i="string"==typeof r?r:1===a?r.one:r.other.replace("{{count}}",a.toString()),n?.addSuffix)if(n.comparison&&n.comparison>0)return"in "+i;else return i+" ago";return i},formatLong:n,formatRelative:(e,t,a,n)=>i[e],localize:o,match:u,options:{weekStartsOn:0,firstWeekContainsDate:1}}],919528);let d={};function c(){return d}e.s(["getDefaultOptions",()=>c],98810)},134955,650496,e=>{"use strict";let t=Symbol.for("constructDateFrom");function a(e,a){return"function"==typeof e?e(a):e&&"object"==typeof e&&t in e?e[t](a):e instanceof Date?new e.constructor(a):new Date(a)}e.s(["constructFromSymbol",0,t,"millisecondsInDay",0,864e5,"millisecondsInWeek",0,6048e5,"minutesInDay",0,1440,"minutesInMonth",0,43200],650496),e.s(["constructFrom",()=>a],134955)},915092,982579,195325,e=>{"use strict";var t=e.i(134955);function a(e,a){return(0,t.constructFrom)(a||e,e)}function n(e){let t=a(e),n=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()));return n.setUTCFullYear(t.getFullYear()),e-n}function i(e,...a){let n=t.constructFrom.bind(null,e||a.find(e=>"object"==typeof e));return a.map(n)}e.s(["toDate",()=>a],982579),e.s(["getTimezoneOffsetInMilliseconds",()=>n],915092),e.s(["normalizeDates",()=>i],195325)},602860,e=>{"use strict";var t=e.i(982579);function a(e,a){let n=(0,t.toDate)(e,a?.in),i=n.getMonth();return n.setFullYear(n.getFullYear(),i+1,0),n.setHours(23,59,59,999),n}e.s(["endOfMonth",()=>a])},169412,296973,581554,258888,e=>{"use strict";var t=e.i(134955);function a(e){return(0,t.constructFrom)(e,Date.now())}e.s(["constructNow",()=>a],169412);var n=e.i(982579);function i(e,t){let a=(0,n.toDate)(e)-(0,n.toDate)(t);return a<0?-1:a>0?1:a}e.s(["compareAsc",()=>i],296973);var r=e.i(195325);function o(e,t,a){let[n,i]=(0,r.normalizeDates)(a?.in,e,t);return 12*(n.getFullYear()-i.getFullYear())+(n.getMonth()-i.getMonth())}function s(e,t){let a=(0,n.toDate)(e,t?.in);return a.setHours(23,59,59,999),a}e.s(["differenceInCalendarMonths",()=>o],581554),e.s(["endOfDay",()=>s],258888)},975620,e=>{"use strict";var t=e.i(169412),a=e.i(919528),n=e.i(98810),i=e.i(915092),r=e.i(195325),o=e.i(296973),s=e.i(650496),l=e.i(581554),u=e.i(258888),d=e.i(602860),c=e.i(982579);function m(e,m){return function(e,t,m){var f;let h,p=(0,n.getDefaultOptions)(),g=m?.locale??p.locale??a.defaultLocale,y=(0,o.compareAsc)(e,t);if(isNaN(y))throw RangeError("Invalid time value");let v=Object.assign({},m,{addSuffix:m?.addSuffix,comparison:y}),[b,w]=(0,r.normalizeDates)(m?.in,...y>0?[t,e]:[e,t]),M=(f=void 0,e=>{let t=(f?Math[f]:Math.trunc)(e);return 0===t?0:t})(((0,c.toDate)(w)-(0,c.toDate)(b))/1e3),N=Math.round((M-((0,i.getTimezoneOffsetInMilliseconds)(w)-(0,i.getTimezoneOffsetInMilliseconds)(b))/1e3)/60);if(N<2)if(m?.includeSeconds)if(M<5)return g.formatDistance("lessThanXSeconds",5,v);else if(M<10)return g.formatDistance("lessThanXSeconds",10,v);else if(M<20)return g.formatDistance("lessThanXSeconds",20,v);else if(M<40)return g.formatDistance("halfAMinute",0,v);else if(M<60)return g.formatDistance("lessThanXMinutes",1,v);else return g.formatDistance("xMinutes",1,v);else if(0===N)return g.formatDistance("lessThanXMinutes",1,v);else return g.formatDistance("xMinutes",N,v);if(N<45)return g.formatDistance("xMinutes",N,v);if(N<90)return g.formatDistance("aboutXHours",1,v);if(N<s.minutesInDay){let e=Math.round(N/60);return g.formatDistance("aboutXHours",e,v)}if(N<2520)return g.formatDistance("xDays",1,v);else if(N<s.minutesInMonth){let e=Math.round(N/s.minutesInDay);return g.formatDistance("xDays",e,v)}else if(N<2*s.minutesInMonth)return h=Math.round(N/s.minutesInMonth),g.formatDistance("aboutXMonths",h,v);if((h=function(e,t,a){let n,[i,s,m]=(0,r.normalizeDates)(void 0,e,e,t),f=(0,o.compareAsc)(s,m),h=Math.abs((0,l.differenceInCalendarMonths)(s,m));if(h<1)return 0;1===s.getMonth()&&s.getDate()>27&&s.setDate(30),s.setMonth(s.getMonth()-f*h);let p=(0,o.compareAsc)(s,m)===-f;n=(0,c.toDate)(i,void 0),+(0,u.endOfDay)(n,void 0)==+(0,d.endOfMonth)(n,void 0)&&1===h&&1===(0,o.compareAsc)(i,m)&&(p=!1);let g=f*(h-p);return 0===g?0:g}(w,b))<12){let e=Math.round(N/s.minutesInMonth);return g.formatDistance("xMonths",e,v)}{let e=h%12,t=Math.trunc(h/12);return e<3?g.formatDistance("aboutXYears",t,v):e<9?g.formatDistance("overXYears",t,v):g.formatDistance("almostXYears",t+1,v)}}(e,(0,t.constructNow)(e),m)}e.s(["formatDistanceToNow",()=>m],975620)},519536,e=>{"use strict";var t=e.i(328465);e.s(["Reply",()=>t.default])},235108,e=>{"use strict";var t=e.i(44990),a=e.i(403055),n=e.i(774482),i=e.i(318381),r=e.i(319013);function o(){let[e,o]=(0,a.useState)(null);return(0,t.jsxs)("div",{className:"h-screen flex overflow-hidden",children:[(0,t.jsx)("div",{className:"w-1/4 min-w-[280px] max-w-[350px]",children:(0,t.jsx)(n.default,{selectedProjectId:e,onSelectProject:o})}),(0,t.jsx)("div",{className:"flex-1",children:(0,t.jsx)(i.default,{projectId:e})}),(0,t.jsx)("div",{className:"w-1/4 min-w-[280px] max-w-[350px]",children:(0,t.jsx)(r.default,{projectId:e})})]})}e.s(["default",()=>o])}]);