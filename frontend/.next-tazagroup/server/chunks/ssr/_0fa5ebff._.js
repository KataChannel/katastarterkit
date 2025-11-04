module.exports=[235746,769056,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(563718),e=a.i(651332),f=a.i(772213);let g=f.gql`
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
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},328997,(a,b,c)=>{},172121,(a,b,c)=>{a.r(328997);var d=a.r(651332),e=d&&"object"==typeof d&&"default"in d?d:{default:d},f="undefined"!=typeof process&&process.env&&!0,g=function(a){return"[object String]"===Object.prototype.toString.call(a)},h=function(){function a(a){var b=void 0===a?{}:a,c=b.name,d=void 0===c?"stylesheet":c,e=b.optimizeForSpeed,h=void 0===e?f:e;i(g(d),"`name` must be a string"),this._name=d,this._deletedRulePlaceholder="#"+d+"-deleted-rule____{}",i("boolean"==typeof h,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=h,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0,this._nonce=null}var b,c=a.prototype;return c.setOptimizeForSpeed=function(a){i("boolean"==typeof a,"`setOptimizeForSpeed` accepts a boolean"),i(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=a,this.inject()},c.isOptimizeForSpeed=function(){return this._optimizeForSpeed},c.inject=function(){var a=this;i(!this._injected,"sheet already injected"),this._injected=!0,this._serverSheet={cssRules:[],insertRule:function(b,c){return"number"==typeof c?a._serverSheet.cssRules[c]={cssText:b}:a._serverSheet.cssRules.push({cssText:b}),c},deleteRule:function(b){a._serverSheet.cssRules[b]=null}}},c.getSheetForTag=function(a){if(a.sheet)return a.sheet;for(var b=0;b<document.styleSheets.length;b++)if(document.styleSheets[b].ownerNode===a)return document.styleSheets[b]},c.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},c.insertRule=function(a,b){return i(g(a),"`insertRule` accepts only strings"),"number"!=typeof b&&(b=this._serverSheet.cssRules.length),this._serverSheet.insertRule(a,b),this._rulesCount++},c.replaceRule=function(a,b){this._optimizeForSpeed;var c=this._serverSheet;if(b.trim()||(b=this._deletedRulePlaceholder),!c.cssRules[a])return a;c.deleteRule(a);try{c.insertRule(b,a)}catch(d){f||console.warn("StyleSheet: illegal rule: \n\n"+b+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),c.insertRule(this._deletedRulePlaceholder,a)}return a},c.deleteRule=function(a){this._serverSheet.deleteRule(a)},c.flush=function(){this._injected=!1,this._rulesCount=0,this._serverSheet.cssRules=[]},c.cssRules=function(){return this._serverSheet.cssRules},c.makeStyleTag=function(a,b,c){b&&i(g(b),"makeStyleTag accepts only strings as second parameter");var d=document.createElement("style");this._nonce&&d.setAttribute("nonce",this._nonce),d.type="text/css",d.setAttribute("data-"+a,""),b&&d.appendChild(document.createTextNode(b));var e=document.head||document.getElementsByTagName("head")[0];return c?e.insertBefore(d,c):e.appendChild(d),d},b=[{key:"length",get:function(){return this._rulesCount}}],function(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}(a.prototype,b),a}();function i(a,b){if(!a)throw Error("StyleSheet: "+b+".")}var j=function(a){for(var b=5381,c=a.length;c;)b=33*b^a.charCodeAt(--c);return b>>>0},k={};function l(a,b){if(!b)return"jsx-"+a;var c=String(b),d=a+c;return k[d]||(k[d]="jsx-"+j(a+"-"+c)),k[d]}function m(a,b){var c=a+(b=b.replace(/\/style/gi,"\\/style"));return k[c]||(k[c]=b.replace(/__jsx-style-dynamic-selector/g,a)),k[c]}var n=function(){function a(a){var b=void 0===a?{}:a,c=b.styleSheet,d=void 0===c?null:c,e=b.optimizeForSpeed,f=void 0!==e&&e;this._sheet=d||new h({name:"styled-jsx",optimizeForSpeed:f}),this._sheet.inject(),d&&"boolean"==typeof f&&(this._sheet.setOptimizeForSpeed(f),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var b=a.prototype;return b.add=function(a){var b=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(a.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed());var c=this.getIdAndRules(a),d=c.styleId,e=c.rules;if(d in this._instancesCounts){this._instancesCounts[d]+=1;return}var f=e.map(function(a){return b._sheet.insertRule(a)}).filter(function(a){return -1!==a});this._indices[d]=f,this._instancesCounts[d]=1},b.remove=function(a){var b=this,c=this.getIdAndRules(a).styleId;if(function(a,b){if(!a)throw Error("StyleSheetRegistry: "+b+".")}(c in this._instancesCounts,"styleId: `"+c+"` not found"),this._instancesCounts[c]-=1,this._instancesCounts[c]<1){var d=this._fromServer&&this._fromServer[c];d?(d.parentNode.removeChild(d),delete this._fromServer[c]):(this._indices[c].forEach(function(a){return b._sheet.deleteRule(a)}),delete this._indices[c]),delete this._instancesCounts[c]}},b.update=function(a,b){this.add(b),this.remove(a)},b.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},b.cssRules=function(){var a=this,b=this._fromServer?Object.keys(this._fromServer).map(function(b){return[b,a._fromServer[b]]}):[],c=this._sheet.cssRules();return b.concat(Object.keys(this._indices).map(function(b){return[b,a._indices[b].map(function(a){return c[a].cssText}).join(a._optimizeForSpeed?"":"\n")]}).filter(function(a){return!!a[1]}))},b.styles=function(a){var b,c;return b=this.cssRules(),void 0===(c=a)&&(c={}),b.map(function(a){var b=a[0],d=a[1];return e.default.createElement("style",{id:"__"+b,key:"__"+b,nonce:c.nonce?c.nonce:void 0,dangerouslySetInnerHTML:{__html:d}})})},b.getIdAndRules=function(a){var b=a.children,c=a.dynamic,d=a.id;if(c){var e=l(d,c);return{styleId:e,rules:Array.isArray(b)?b.map(function(a){return m(e,a)}):[m(e,b)]}}return{styleId:l(d),rules:Array.isArray(b)?b:[b]}},b.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(a,b){return a[b.id.slice(2)]=b,a},{})},a}(),o=d.createContext(null);function p(){return new n}function q(){return d.useContext(o)}function r(a){var b=q();return b&&b.add(a),null}o.displayName="StyleSheetContext",e.default.useInsertionEffect||e.default.useLayoutEffect,r.dynamic=function(a){return a.map(function(a){return l(a[0],a[1])}).join(" ")},c.StyleRegistry=function(a){var b=a.registry,c=a.children,f=d.useContext(o),g=d.useState(function(){return f||b||p()})[0];return e.default.createElement(o.Provider,{value:g},c)},c.createStyleRegistry=p,c.style=r,c.useStyleRegistry=q},488799,(a,b,c)=>{b.exports=a.r(172121).style},610025,a=>{"use strict";var b=a.i(321248),c=a.i(488799),d=a.i(651332),e=a.i(235746);function f(){let[a,f]=(0,d.useState)("task"),[g,h]=(0,d.useState)([]),i=a=>{h(b=>[...b,`${new Date().toLocaleTimeString()}: ${a}`])};return(0,b.jsxs)("div",{className:"jsx-963afc78f4140ecc dynamic-demo",children:[(0,b.jsx)(c.default,{id:"963afc78f4140ecc",children:".dynamic-demo.jsx-963afc78f4140ecc{max-width:1200px;margin:0 auto;padding:2rem}.header.jsx-963afc78f4140ecc{color:#fff;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:8px;margin-bottom:2rem;padding:2rem}.model-selector.jsx-963afc78f4140ecc{background:#fff;border-radius:8px;margin-bottom:2rem;padding:1.5rem;box-shadow:0 2px 4px #0000001a}.test-grid.jsx-963afc78f4140ecc{grid-template-columns:repeat(auto-fit,minmax(500px,1fr));gap:1.5rem;margin-bottom:2rem;display:grid}.test-section.jsx-963afc78f4140ecc{background:#fff;border-radius:8px;padding:1.5rem;box-shadow:0 2px 4px #0000001a}.test-section.jsx-963afc78f4140ecc h3.jsx-963afc78f4140ecc{color:#667eea;margin:0 0 1rem}.success.jsx-963afc78f4140ecc{color:#10b981;font-weight:600}.error.jsx-963afc78f4140ecc{color:#ef4444;font-weight:600}.test-button.jsx-963afc78f4140ecc,button.jsx-963afc78f4140ecc{color:#fff;cursor:pointer;background:#667eea;border:none;border-radius:4px;margin-right:.5rem;padding:.5rem 1rem;font-size:14px}.test-button.jsx-963afc78f4140ecc:hover,button.jsx-963afc78f4140ecc:hover{background:#5568d3}.test-button.jsx-963afc78f4140ecc:disabled,button.jsx-963afc78f4140ecc:disabled{cursor:not-allowed;background:#9ca3af}.pagination-controls.jsx-963afc78f4140ecc{align-items:center;gap:1rem;margin:1rem 0;display:flex}pre.jsx-963afc78f4140ecc{background:#f3f4f6;border-radius:4px;max-height:300px;padding:1rem;font-size:12px;overflow:auto}select.jsx-963afc78f4140ecc{border:1px solid #d1d5db;border-radius:4px;padding:.5rem;font-size:14px}.results-panel.jsx-963afc78f4140ecc{color:#f3f4f6;background:#1f2937;border-radius:8px;max-height:400px;padding:1.5rem;overflow:auto}.results-panel.jsx-963afc78f4140ecc h3.jsx-963afc78f4140ecc{color:#fff;margin-top:0}.result-line.jsx-963afc78f4140ecc{border-bottom:1px solid #374151;padding:.25rem 0;font-family:Monaco,Courier New,monospace;font-size:12px}"}),(0,b.jsxs)("div",{className:"jsx-963afc78f4140ecc header",children:[(0,b.jsx)("h1",{className:"jsx-963afc78f4140ecc",children:"🚀 Dynamic GraphQL Demo"}),(0,b.jsx)("p",{className:"jsx-963afc78f4140ecc",children:"Test the Universal Dynamic GraphQL System"}),(0,b.jsx)("p",{style:{opacity:.9,fontSize:"14px"},className:"jsx-963afc78f4140ecc",children:"One system to rule them all - No custom resolvers needed!"})]}),(0,b.jsx)("div",{className:"jsx-963afc78f4140ecc model-selector",children:(0,b.jsxs)("label",{className:"jsx-963afc78f4140ecc",children:[(0,b.jsx)("strong",{className:"jsx-963afc78f4140ecc",children:"Select Model to Test:"}),(0,b.jsx)("br",{className:"jsx-963afc78f4140ecc"}),(0,b.jsxs)("select",{value:a,onChange:a=>f(a.target.value),className:"jsx-963afc78f4140ecc",children:[(0,b.jsx)("option",{value:"task",className:"jsx-963afc78f4140ecc",children:"Task"}),(0,b.jsx)("option",{value:"user",className:"jsx-963afc78f4140ecc",children:"User"}),(0,b.jsx)("option",{value:"post",className:"jsx-963afc78f4140ecc",children:"Post"}),(0,b.jsx)("option",{value:"comment",className:"jsx-963afc78f4140ecc",children:"Comment"}),(0,b.jsx)("option",{value:"product",className:"jsx-963afc78f4140ecc",children:"Product"}),(0,b.jsx)("option",{value:"category",className:"jsx-963afc78f4140ecc",children:"Category"}),(0,b.jsx)("option",{value:"invoice",className:"jsx-963afc78f4140ecc",children:"Invoice"}),(0,b.jsx)("option",{value:"page",className:"jsx-963afc78f4140ecc",children:"Page"}),(0,b.jsx)("option",{value:"notification",className:"jsx-963afc78f4140ecc",children:"Notification"})]})]})}),(0,b.jsxs)("div",{className:"jsx-963afc78f4140ecc test-grid",children:[(0,b.jsx)(()=>{let{data:c,loading:d,error:f}=(0,e.useFindMany)(a,{take:5,orderBy:{createdAt:"desc"}});return(0,b.jsxs)("div",{className:"test-section",children:[(0,b.jsxs)("h3",{children:["Test 1: Find Many (",a,")"]}),d&&(0,b.jsx)("p",{children:"Loading..."}),f&&(0,b.jsxs)("p",{className:"error",children:["Error: ",f.message]}),c&&(0,b.jsxs)("div",{children:[(0,b.jsxs)("p",{className:"success",children:["✅ Found ",c.length," records"]}),(0,b.jsx)("pre",{children:JSON.stringify(c,null,2)})]})]})},{className:"jsx-963afc78f4140ecc"}),(0,b.jsx)(()=>{let{data:c,meta:d,loading:f,nextPage:g,prevPage:h,page:i}=(0,e.useFindManyPaginated)(a,{page:1,limit:5});return(0,b.jsxs)("div",{className:"test-section",children:[(0,b.jsxs)("h3",{children:["Test 2: Pagination (",a,")"]}),f&&(0,b.jsx)("p",{children:"Loading..."}),d&&(0,b.jsxs)("div",{children:[(0,b.jsxs)("p",{className:"success",children:["✅ Page ",d.page," of ",d.totalPages," (",d.total," total)"]}),(0,b.jsxs)("div",{className:"pagination-controls",children:[(0,b.jsx)("button",{onClick:h,disabled:!d.hasPrevPage,children:"← Previous"}),(0,b.jsxs)("span",{children:["Page ",i]}),(0,b.jsx)("button",{onClick:g,disabled:!d.hasNextPage,children:"Next →"})]}),c&&(0,b.jsx)("pre",{children:JSON.stringify(c.slice(0,2),null,2)})]})]})},{className:"jsx-963afc78f4140ecc"}),(0,b.jsx)(()=>{let{count:c,loading:d}=(0,e.useCount)(a);return(0,b.jsxs)("div",{className:"test-section",children:[(0,b.jsxs)("h3",{children:["Test 3: Count (",a,")"]}),d&&(0,b.jsx)("p",{children:"Loading..."}),void 0!==c&&(0,b.jsxs)("p",{className:"success",children:["✅ Total records: ",c]})]})},{className:"jsx-963afc78f4140ecc"}),(0,b.jsx)(()=>{let a=(0,e.useCRUD)("task"),c=async()=>{try{i("🔵 Starting CRUD test...");let b=await a.findMany({take:3});i(`✅ Found ${b.length} tasks`);let c=await a.count();i(`✅ Total count: ${c}`);let d=await a.createOne({data:{title:`Test Task ${Date.now()}`,description:"Created by Dynamic GraphQL Demo",status:"TODO",priority:"MEDIUM",category:"WORK",userId:"123"}});i(`✅ Created task: ${d.id}`);let e=await a.updateOne({where:{id:d.id},data:{status:"IN_PROGRESS"}});i(`✅ Updated task status: ${e.status}`),await a.deleteOne({where:{id:d.id}}),i(`✅ Deleted task: ${d.id}`),i("🎉 CRUD test completed successfully!")}catch(a){i(`❌ Error: ${a.message}`)}};return(0,b.jsxs)("div",{className:"test-section",children:[(0,b.jsx)("h3",{children:"Test 4: CRUD Operations"}),(0,b.jsx)("button",{onClick:c,disabled:a.loading,className:"test-button",children:a.loading?"Running...":"Run CRUD Test"})]})},{className:"jsx-963afc78f4140ecc"}),(0,b.jsx)(()=>{let[a,{loading:c}]=(0,e.useCreateOne)("task"),[f,g]=(0,d.useState)(null),h=async()=>{try{let b=await a({data:{title:`Demo Task ${Date.now()}`,description:"Created from Dynamic GraphQL Demo",status:"TODO",priority:"HIGH",category:"WORK",userId:"123"}});g(b),i(`✅ Created: ${b.id}`)}catch(a){i(`❌ Error: ${a.message}`)}};return(0,b.jsxs)("div",{className:"test-section",children:[(0,b.jsx)("h3",{children:"Test 5: Create One"}),(0,b.jsx)("button",{onClick:h,disabled:c,children:c?"Creating...":"Create Task"}),f&&(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"success",children:"✅ Created!"}),(0,b.jsx)("pre",{children:JSON.stringify(f,null,2)})]})]})},{className:"jsx-963afc78f4140ecc"}),(0,b.jsx)(()=>{let{data:a,loading:c}=(0,e.useFindMany)("task",{where:{status:"ACTIVE",priority:{in:["HIGH","MEDIUM"]}},include:{user:!0},orderBy:{createdAt:"desc"},take:3});return(0,b.jsxs)("div",{className:"test-section",children:[(0,b.jsx)("h3",{children:"Test 6: Advanced Query"}),(0,b.jsx)("p",{children:"Find active tasks with HIGH/MEDIUM priority + user"}),c&&(0,b.jsx)("p",{children:"Loading..."}),a&&(0,b.jsxs)("div",{children:[(0,b.jsxs)("p",{className:"success",children:["✅ Found ",a.length," tasks"]}),(0,b.jsx)("pre",{children:JSON.stringify(a,null,2)})]})]})},{className:"jsx-963afc78f4140ecc"})]}),(0,b.jsxs)("div",{className:"jsx-963afc78f4140ecc results-panel",children:[(0,b.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},className:"jsx-963afc78f4140ecc",children:[(0,b.jsx)("h3",{className:"jsx-963afc78f4140ecc",children:"📊 Test Results"}),(0,b.jsx)("button",{onClick:()=>h([]),className:"jsx-963afc78f4140ecc",children:"Clear"})]}),0===g.length?(0,b.jsx)("p",{style:{opacity:.6},className:"jsx-963afc78f4140ecc",children:"No results yet. Run some tests!"}):(0,b.jsx)("div",{className:"jsx-963afc78f4140ecc",children:g.map((a,c)=>(0,b.jsx)("div",{className:"jsx-963afc78f4140ecc result-line",children:a},c))})]}),(0,b.jsxs)("div",{style:{marginTop:"2rem"},className:"jsx-963afc78f4140ecc test-section",children:[(0,b.jsx)("h3",{className:"jsx-963afc78f4140ecc",children:"📖 Instructions"}),(0,b.jsxs)("ol",{className:"jsx-963afc78f4140ecc",children:[(0,b.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"Select a model from the dropdown"}),(0,b.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"All tests automatically update for that model"}),(0,b.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"Run CRUD test to see Create/Update/Delete in action"}),(0,b.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"Check the results panel for operation logs"}),(0,b.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"View the browser console for detailed logs"})]}),(0,b.jsxs)("p",{className:"jsx-963afc78f4140ecc",children:[(0,b.jsx)("strong",{className:"jsx-963afc78f4140ecc",children:"Note:"})," Make sure you're authenticated and have data in your database!"]})]})]})}a.s(["default",()=>f])}];

//# sourceMappingURL=_0fa5ebff._.js.map