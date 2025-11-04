module.exports=[785903,a=>{"use strict";var b=a.i(196915);a.s(["Eye",()=>b.default])},235746,769056,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(563718),e=a.i(651332),f=a.i(772213);let g=f.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,h=f.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,i=f.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,j=f.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,k=f.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,l=f.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=f.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,n=f.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,o=f.gql`
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
`,p=f.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,q=f.gql`
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
`,r=f.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,s=f.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,t=f.gql`
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
`,u=f.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,v=f.gql`
  mutation ClearCache {
    clearCache
  }
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},973174,a=>{"use strict";var b=a.i(357230);a.s(["Save",()=>b.default])},140300,a=>{"use strict";var b=a.i(814588);a.s(["Mail",()=>b.default])},370477,a=>{"use strict";var b=a.i(651332);function c(a){let c=b.useRef({value:a,previous:a});return b.useMemo(()=>(c.current.value!==a&&(c.current.previous=c.current.value,c.current.value=a),c.current.previous),[a])}a.s(["usePrevious",()=>c])},376946,a=>{"use strict";var b=a.i(651332),c=a.i(372123),d=a.i(321248),e=Object.freeze({position:"absolute",border:0,width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",wordWrap:"normal"}),f=b.forwardRef((a,b)=>(0,d.jsx)(c.Primitive.span,{...a,ref:b,style:{...e,...a.style}}));f.displayName="VisuallyHidden",a.s(["Root",()=>f,"VISUALLY_HIDDEN_STYLES",()=>e,"VisuallyHidden",()=>f])},441405,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(372123),e=c.forwardRef((a,c)=>(0,b.jsx)(d.Primitive.label,{...a,ref:c,onMouseDown:b=>{b.target.closest("button, input, select, textarea")||(a.onMouseDown?.(b),!b.defaultPrevented&&b.detail>1&&b.preventDefault())}}));e.displayName="Label";var f=a.i(422171);function g({className:a,...c}){return(0,b.jsx)(e,{"data-slot":"label",className:(0,f.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",a),...c})}a.s(["Label",()=>g],441405)},466577,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("textarea",{className:(0,d.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:e,...c}));e.displayName="Textarea",a.s(["Textarea",()=>e])},951369,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(572521),e=a.i(694475),f=a.i(270694),g=a.i(660886),h=a.i(372123),i=a.i(770186),j=a.i(549074),k=a.i(742053),l="Tabs",[m,n]=(0,e.createContextScope)(l,[f.createRovingFocusGroupScope]),o=(0,f.createRovingFocusGroupScope)(),[p,q]=m(l),r=c.forwardRef((a,c)=>{let{__scopeTabs:d,value:e,onValueChange:f,defaultValue:g,orientation:m="horizontal",dir:n,activationMode:o="automatic",...q}=a,r=(0,i.useDirection)(n),[s,t]=(0,j.useControllableState)({prop:e,onChange:f,defaultProp:g??"",caller:l});return(0,b.jsx)(p,{scope:d,baseId:(0,k.useId)(),value:s,onValueChange:t,orientation:m,dir:r,activationMode:o,children:(0,b.jsx)(h.Primitive.div,{dir:r,"data-orientation":m,...q,ref:c})})});r.displayName=l;var s="TabsList",t=c.forwardRef((a,c)=>{let{__scopeTabs:d,loop:e=!0,...g}=a,i=q(s,d),j=o(d);return(0,b.jsx)(f.Root,{asChild:!0,...j,orientation:i.orientation,dir:i.dir,loop:e,children:(0,b.jsx)(h.Primitive.div,{role:"tablist","aria-orientation":i.orientation,...g,ref:c})})});t.displayName=s;var u="TabsTrigger",v=c.forwardRef((a,c)=>{let{__scopeTabs:e,value:g,disabled:i=!1,...j}=a,k=q(u,e),l=o(e),m=y(k.baseId,g),n=z(k.baseId,g),p=g===k.value;return(0,b.jsx)(f.Item,{asChild:!0,...l,focusable:!i,active:p,children:(0,b.jsx)(h.Primitive.button,{type:"button",role:"tab","aria-selected":p,"aria-controls":n,"data-state":p?"active":"inactive","data-disabled":i?"":void 0,disabled:i,id:m,...j,ref:c,onMouseDown:(0,d.composeEventHandlers)(a.onMouseDown,a=>{i||0!==a.button||!1!==a.ctrlKey?a.preventDefault():k.onValueChange(g)}),onKeyDown:(0,d.composeEventHandlers)(a.onKeyDown,a=>{[" ","Enter"].includes(a.key)&&k.onValueChange(g)}),onFocus:(0,d.composeEventHandlers)(a.onFocus,()=>{let a="manual"!==k.activationMode;p||i||!a||k.onValueChange(g)})})})});v.displayName=u;var w="TabsContent",x=c.forwardRef((a,d)=>{let{__scopeTabs:e,value:f,forceMount:i,children:j,...k}=a,l=q(w,e),m=y(l.baseId,f),n=z(l.baseId,f),o=f===l.value,p=c.useRef(o);return c.useEffect(()=>{let a=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(a)},[]),(0,b.jsx)(g.Presence,{present:i||o,children:({present:c})=>(0,b.jsx)(h.Primitive.div,{"data-state":o?"active":"inactive","data-orientation":l.orientation,role:"tabpanel","aria-labelledby":m,hidden:!c,id:n,tabIndex:0,...k,ref:d,style:{...a.style,animationDuration:p.current?"0s":void 0},children:c&&j})})});function y(a,b){return`${a}-trigger-${b}`}function z(a,b){return`${a}-content-${b}`}x.displayName=w;var A=a.i(422171);let B=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(t,{ref:d,className:(0,A.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",a),...c}));B.displayName=t.displayName;let C=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(v,{ref:d,className:(0,A.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",a),...c}));C.displayName=v.displayName;let D=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(x,{ref:d,className:(0,A.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",a),...c}));D.displayName=x.displayName,a.s(["Tabs",()=>r,"TabsContent",()=>D,"TabsList",()=>B,"TabsTrigger",()=>C],951369)},519732,a=>{"use strict";var b=a.i(659683);a.s(["RefreshCw",()=>b.default])},650661,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(572521),e=a.i(360507),f=a.i(694475),g=a.i(549074),h=a.i(370477),i=a.i(555836),j=a.i(372123),k="Switch",[l,m]=(0,f.createContextScope)(k),[n,o]=l(k),p=c.forwardRef((a,f)=>{let{__scopeSwitch:h,name:i,checked:l,defaultChecked:m,required:o,disabled:p,value:q="on",onCheckedChange:r,form:u,...v}=a,[w,x]=c.useState(null),y=(0,e.useComposedRefs)(f,a=>x(a)),z=c.useRef(!1),A=!w||u||!!w.closest("form"),[B,C]=(0,g.useControllableState)({prop:l,defaultProp:m??!1,onChange:r,caller:k});return(0,b.jsxs)(n,{scope:h,checked:B,disabled:p,children:[(0,b.jsx)(j.Primitive.button,{type:"button",role:"switch","aria-checked":B,"aria-required":o,"data-state":t(B),"data-disabled":p?"":void 0,disabled:p,value:q,...v,ref:y,onClick:(0,d.composeEventHandlers)(a.onClick,a=>{C(a=>!a),A&&(z.current=a.isPropagationStopped(),z.current||a.stopPropagation())})}),A&&(0,b.jsx)(s,{control:w,bubbles:!z.current,name:i,value:q,checked:B,required:o,disabled:p,form:u,style:{transform:"translateX(-100%)"}})]})});p.displayName=k;var q="SwitchThumb",r=c.forwardRef((a,c)=>{let{__scopeSwitch:d,...e}=a,f=o(q,d);return(0,b.jsx)(j.Primitive.span,{"data-state":t(f.checked),"data-disabled":f.disabled?"":void 0,...e,ref:c})});r.displayName=q;var s=c.forwardRef(({__scopeSwitch:a,control:d,checked:f,bubbles:g=!0,...j},k)=>{let l=c.useRef(null),m=(0,e.useComposedRefs)(l,k),n=(0,h.usePrevious)(f),o=(0,i.useSize)(d);return c.useEffect(()=>{let a=l.current;if(!a)return;let b=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(n!==f&&b){let c=new Event("click",{bubbles:g});b.call(a,f),a.dispatchEvent(c)}},[n,f,g]),(0,b.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:f,...j,tabIndex:-1,ref:m,style:{...j.style,...o,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});function t(a){return a?"checked":"unchecked"}s.displayName="SwitchBubbleInput";var u=a.i(422171);let v=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(p,{className:(0,u.cn)("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",a),...c,ref:d,children:(0,b.jsx)(r,{className:(0,u.cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})}));v.displayName=p.displayName,a.s(["Switch",()=>v],650661)},638735,a=>{"use strict";var b=a.i(273841);a.s(["MessageSquare",()=>b.default])},778775,a=>{"use strict";var b=a.i(29319);a.s(["Shield",()=>b.default])},174110,a=>{"use strict";var b=a.i(843666);a.s(["EyeOff",()=>b.default])},202076,a=>{"use strict";var b=a.i(497390);a.s(["Globe",()=>b.default])},769251,a=>{"use strict";var b=a.i(35383);a.s(["Layout",()=>b.default])},799462,a=>{"use strict";var b=a.i(443841);a.s(["BarChart",()=>b.default])},94374,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(235746),e=a.i(975780),f=a.i(951369),g=a.i(478184),h=a.i(466577),i=a.i(441405),j=a.i(202979),k=a.i(650661),l=a.i(144932),m=a.i(293470),n=a.i(325521),o=a.i(973174),p=a.i(519732),q=a.i(785903),r=a.i(174110),s=a.i(202076),t=a.i(638735),u=a.i(799462),v=a.i(769251),w=a.i(140300),x=a.i(646254),y=a.i(778775);let z=[{value:"GENERAL",label:"Chung",icon:s.Globe},{value:"HEADER",label:"Header",icon:v.Layout},{value:"FOOTER",label:"Footer",icon:v.Layout},{value:"CONTACT",label:"Liên hệ",icon:w.Mail},{value:"SOCIAL",label:"Mạng xã hội",icon:t.MessageSquare},{value:"SEO",label:"SEO",icon:u.BarChart},{value:"SUPPORT_CHAT",label:"Support Chat",icon:x.MessageCircle},{value:"AUTH",label:"Xác thực",icon:y.Shield}];function A(){let[a,s]=(0,c.useState)("GENERAL"),[t,u]=(0,c.useState)({}),[v,w]=(0,c.useState)(!1),{data:x=[],loading:y,error:A,refetch:B}=(0,d.useFindMany)("WebsiteSetting",{orderBy:{order:"asc"}}),[C,{loading:D}]=(0,d.useUpdateOne)("WebsiteSetting"),E=x.filter(b=>b.category===a).sort((a,b)=>a.order-b.order).reduce((a,b)=>{let c=b.group||"other";return a[c]||(a[c]=[]),a[c].push(b),a},{}),F=(a,b,c)=>{let d=b;if("BOOLEAN"===c)d=b?"true":"false";else if("NUMBER"===c)d=String(b);else if("JSON"===c)try{d=JSON.stringify(b)}catch(a){d=b}u(b=>({...b,[a]:d})),w(!0)},G=async()=>{try{let a=Object.entries(t).map(([a,b])=>{let c=x.find(b=>b.key===a);return c?C({where:{id:c.id},data:{value:b}}):(console.warn(`Setting not found for key: ${a}`),Promise.resolve())});await Promise.all(a),console.log("✅ Đã lưu settings"),u({}),w(!1),B()}catch(a){console.error("❌ Lỗi:",a.message||"Không thể lưu settings")}};return y?(0,b.jsx)("div",{className:"flex items-center justify-center h-96",children:(0,b.jsx)(p.RefreshCw,{className:"w-8 h-8 animate-spin text-primary"})}):(0,b.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("h1",{className:"text-3xl font-bold flex items-center gap-2",children:[(0,b.jsx)(n.Settings,{className:"w-8 h-8"}),"Cài đặt Website"]}),(0,b.jsx)("p",{className:"text-muted-foreground mt-1",children:"Quản lý tất cả các cài đặt của website"})]}),v&&(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsxs)(j.Button,{variant:"outline",onClick:()=>{u({}),w(!1)},children:[(0,b.jsx)(p.RefreshCw,{className:"w-4 h-4 mr-2"}),"Hủy"]}),(0,b.jsxs)(j.Button,{onClick:G,disabled:D,children:[(0,b.jsx)(o.Save,{className:"w-4 h-4 mr-2"}),D?"Đang lưu...":"Lưu thay đổi"]})]})]}),(0,b.jsxs)(f.Tabs,{value:a,onValueChange:s,className:"w-full",children:[(0,b.jsx)(f.TabsList,{className:`grid grid-cols-${z.length} w-full`,children:z.map(a=>{let c=a.icon;return(0,b.jsxs)(f.TabsTrigger,{value:a.value,className:"flex items-center gap-2",children:[(0,b.jsx)(c,{className:"w-4 h-4"}),a.label]},a.value)})}),z.map(a=>(0,b.jsxs)(f.TabsContent,{value:a.value,className:"space-y-6 mt-6",children:[Object.entries(E).map(([a,c])=>(0,b.jsxs)(e.Card,{children:[(0,b.jsxs)(e.CardHeader,{children:[(0,b.jsx)(e.CardTitle,{className:"capitalize",children:"other"===a?"Khác":a.replace(/_/g," ")}),(0,b.jsxs)(e.CardDescription,{children:[c.length," cài đặt"]})]}),(0,b.jsx)(e.CardContent,{className:"space-y-6",children:c.map(a=>(0,b.jsxs)("div",{className:"space-y-2 pb-4 border-b last:border-0 last:pb-0",children:[(0,b.jsxs)("div",{className:"flex items-start justify-between",children:[(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)(i.Label,{htmlFor:a.key,className:"text-base font-semibold",children:a.label}),a.description&&(0,b.jsx)("p",{className:"text-sm text-muted-foreground mt-1",children:a.description})]}),(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(m.Badge,{variant:"outline",className:"text-xs",children:a.type}),a.isPublic?(0,b.jsx)("span",{title:"Public",children:(0,b.jsx)(q.Eye,{className:"w-4 h-4 text-green-500"})}):(0,b.jsx)("span",{title:"Private",children:(0,b.jsx)(r.EyeOff,{className:"w-4 h-4 text-gray-400"})})]})]}),(0,b.jsx)("div",{className:"mt-2",children:(a=>{let c=((a,b)=>{if(!a)return"BOOLEAN"!==b&&"";switch(b){case"BOOLEAN":return"true"===a;case"NUMBER":return parseFloat(a)||0;case"JSON":try{return JSON.parse(a)}catch{return a}default:return a}})(void 0!==t[a.key]?t[a.key]:a.value,a.type);switch(a.type){case"BOOLEAN":return(0,b.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,b.jsx)(k.Switch,{id:a.key,checked:c,onCheckedChange:b=>F(a.key,b,a.type)}),(0,b.jsx)(i.Label,{htmlFor:a.key,className:"cursor-pointer",children:c?"Bật":"Tắt"})]});case"TEXTAREA":return(0,b.jsx)(h.Textarea,{id:a.key,value:c,onChange:b=>F(a.key,b.target.value,a.type),rows:3,className:"w-full"});case"NUMBER":return(0,b.jsx)(g.Input,{id:a.key,type:"number",value:c,onChange:b=>F(a.key,b.target.value,a.type),className:"w-full"});case"COLOR":return(0,b.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,b.jsx)(g.Input,{id:a.key,type:"color",value:c||"#000000",onChange:b=>F(a.key,b.target.value,a.type),className:"w-20 h-10"}),(0,b.jsx)(g.Input,{type:"text",value:c||"",onChange:b=>F(a.key,b.target.value,a.type),className:"flex-1",placeholder:"#000000"})]});case"IMAGE":case"URL":return(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(g.Input,{id:a.key,type:"text",value:c,onChange:b=>F(a.key,b.target.value,a.type),className:"w-full",placeholder:"IMAGE"===a.type?"/path/to/image.jpg":"https://example.com"}),"IMAGE"===a.type&&c&&(0,b.jsx)("img",{src:c,alt:"Preview",className:"max-w-xs max-h-32 object-contain border rounded"})]});case"SELECT":let d=[];try{"string"==typeof a.options?d=JSON.parse(a.options):Array.isArray(a.options)?d=a.options:a.options&&"object"==typeof a.options&&(d=Object.values(a.options))}catch(b){console.error("Error parsing options for",a.key,b),d=[]}return(0,b.jsxs)(l.Select,{value:c,onValueChange:b=>F(a.key,b,a.type),children:[(0,b.jsx)(l.SelectTrigger,{className:"w-full",children:(0,b.jsx)(l.SelectValue,{placeholder:"Chọn..."})}),(0,b.jsx)(l.SelectContent,{children:d.map(a=>(0,b.jsx)(l.SelectItem,{value:a,children:a},a))})]});default:return(0,b.jsx)(g.Input,{id:a.key,type:"text",value:c,onChange:b=>F(a.key,b.target.value,a.type),className:"w-full"})}})(a)}),(0,b.jsxs)("div",{className:"text-xs text-muted-foreground",children:["Key: ",(0,b.jsx)("code",{className:"bg-muted px-1 py-0.5 rounded",children:a.key})]})]},a.id))})]},a)),0===Object.keys(E).length&&(0,b.jsx)(e.Card,{children:(0,b.jsx)(e.CardContent,{className:"py-12 text-center text-muted-foreground",children:"Chưa có cài đặt nào trong danh mục này"})})]},a.value))]})]})}a.s(["default",()=>A])}];

//# sourceMappingURL=_acf8413b._.js.map