(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),s=e.i(950988),n=e.i(529590),a=e.i(403055),i=e.i(984804);let r=i.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,c=i.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,o=i.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,l=i.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,d=i.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,u=i.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,f=i.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,h=i.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,m=i.gql`
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
`,p=i.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,y=i.gql`
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
`,g=i.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,x=i.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,j=i.gql`
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
`,v=i.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,S=i.gql`
  mutation ClearCache {
    clearCache
  }
`;function N(e,s,n){let a=!!localStorage.getItem("accessToken"),i=n?.skip||n?.requireAuth!==!1&&!a,{data:c,loading:o,error:l,refetch:d}=(0,t.useQuery)(r,{variables:{modelName:e,input:s||{}},skip:i,fetchPolicy:n?.fetchPolicy||"cache-and-network"});return{data:c?.findMany,loading:o,error:l,refetch:d}}function _(e,s,n,a){let i=!!localStorage.getItem("accessToken"),r="string"==typeof s?s:s?.id;r||a?.skip;let o=a?.skip||!r||a?.requireAuth!==!1&&!i,{data:l,loading:d,error:u,refetch:f}=(0,t.useQuery)(c,{variables:{modelName:e,input:{id:r||"",select:n?.select,include:n?.include}},skip:o});return{data:l?.findById,loading:d,error:u,refetch:f}}function b(e,s,n){let[i,r]=(0,a.useState)(s?.page||1),[c,o]=(0,a.useState)(s?.limit||10),d=!!localStorage.getItem("accessToken"),u=n?.skip||n?.requireAuth!==!1&&!d,{data:f,loading:h,error:m,refetch:p}=(0,t.useQuery)(l,{variables:{modelName:e,input:{page:i,limit:c,where:s?.where,orderBy:s?.orderBy,select:s?.select,include:s?.include}},skip:u,fetchPolicy:"cache-and-network"}),y=f?.findManyPaginated,g=(0,a.useCallback)(e=>{r(e)},[]),x=(0,a.useCallback)(()=>{y?.meta.hasNextPage&&r(e=>e+1)},[y]),j=(0,a.useCallback)(()=>{y?.meta.hasPrevPage&&r(e=>e-1)},[y]),v=(0,a.useCallback)(e=>{o(e),r(1)},[]);return{data:y?.data,meta:y?.meta,loading:h,error:m,refetch:p,page:i,limit:c,goToPage:g,nextPage:x,prevPage:j,changeLimit:v}}function w(e,s,n){let{data:a,loading:i,error:r,refetch:c}=(0,t.useQuery)(d,{variables:{modelName:e,where:s},skip:n?.skip});return{count:a?.count,loading:i,error:r,refetch:c}}function C(e,t){let[n,{data:i,loading:r,error:c}]=(0,s.useMutation)(h,{refetchQueries:t?.refetchQueries});return[(0,a.useCallback)(async t=>{let s=await n({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return s.data?.createOne},[n,e]),{data:i?.createOne,loading:r,error:c}]}function k(e,t){let[n,{data:i,loading:r,error:c}]=(0,s.useMutation)(p,{refetchQueries:t?.refetchQueries});return[(0,a.useCallback)(async t=>{let s="string"==typeof t.where?t.where:t.where?.id;if(!s)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let a=await n({variables:{modelName:e,input:{id:s,data:t.data,select:t.select,include:t.include}}});return a.data?.updateOne},[n,e]),{data:i?.updateOne,loading:r,error:c}]}function $(e,t){let[n,{data:i,loading:r,error:c}]=(0,s.useMutation)(g,{refetchQueries:t?.refetchQueries});return[(0,a.useCallback)(async t=>{let s="string"==typeof t.where?t.where:t.where?.id;if(!s)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let a=await n({variables:{modelName:e,input:{id:s,select:t.select}}});return a.data?.deleteOne},[n,e]),{data:i?.deleteOne,loading:r,error:c}]}function O(e){let t=(0,n.useApolloClient)(),[i,o]=C(e),[l,u]=function(e,t){let[n,{data:i,loading:r,error:c}]=(0,s.useMutation)(m,{refetchQueries:void 0});return[(0,a.useCallback)(async t=>{let s=await n({variables:{model:e,...t}});return s.data?.createMany},[n,e]),{data:i?.createMany,loading:r,error:c}]}(e),[f,h]=k(e),[p,g]=function(e,t){let[n,{data:i,loading:r,error:c}]=(0,s.useMutation)(y,{refetchQueries:void 0});return[(0,a.useCallback)(async t=>{let s=await n({variables:{model:e,...t}});return s.data?.updateMany},[n,e]),{data:i?.updateMany,loading:r,error:c}]}(e),[v,S]=$(e),[N,_]=function(e,t){let[n,{data:i,loading:r,error:c}]=(0,s.useMutation)(x,{refetchQueries:void 0});return[(0,a.useCallback)(async t=>{let s=await n({variables:{model:e,where:t}});return s.data?.deleteMany},[n,e]),{data:i?.deleteMany,loading:r,error:c}]}(e),[b,w]=function(e,t){let[n,{data:i,loading:r,error:c}]=(0,s.useMutation)(j,{refetchQueries:void 0});return[(0,a.useCallback)(async t=>{let s=await n({variables:{model:e,...t}});return s.data?.upsert},[n,e]),{data:i?.upsert,loading:r,error:c}]}(e),O=(0,a.useCallback)(async s=>(await t.query({query:r,variables:{model:e,...s},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:O,findUnique:(0,a.useCallback)(async(s,n)=>(await t.query({query:c,variables:{model:e,where:s,...n},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,a.useCallback)(async s=>(await t.query({query:d,variables:{model:e,where:s},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:i,createMany:l,updateOne:f,updateMany:p,deleteOne:v,deleteMany:N,upsert:b,states:{createOne:o,createMany:u,updateOne:h,updateMany:g,deleteOne:S,deleteMany:_,upsert:w},loading:o.loading||u.loading||h.loading||g.loading||S.loading||_.loading||w.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,S,"COUNT",0,d,"CREATE_MANY",0,m,"CREATE_ONE",0,h,"DELETE_MANY",0,x,"DELETE_ONE",0,g,"FIND_FIRST",0,o,"FIND_MANY",0,r,"FIND_MANY_PAGINATED",0,l,"FIND_UNIQUE",0,c,"GET_AVAILABLE_MODELS",0,v,"GROUP_BY",0,f,"UPDATE_MANY",0,y,"UPDATE_ONE",0,p,"UPSERT",0,j],272901),e.s(["useCRUD",()=>O,"useCount",()=>w,"useCreateOne",()=>C,"useDeleteOne",()=>$,"useFindMany",()=>N,"useFindManyPaginated",()=>b,"useFindUnique",()=>_,"useUpdateOne",()=>k],245421)},92532,(e,t,s)=>{},510150,(e,t,s)=>{var n=e.i(308140);e.r(92532);var a=e.r(403055),i=a&&"object"==typeof a&&"default"in a?a:{default:a},r=void 0!==n.default&&n.default.env&&!0,c=function(e){return"[object String]"===Object.prototype.toString.call(e)},o=function(){function e(e){var t=void 0===e?{}:e,s=t.name,n=void 0===s?"stylesheet":s,a=t.optimizeForSpeed,i=void 0===a?r:a;l(c(n),"`name` must be a string"),this._name=n,this._deletedRulePlaceholder="#"+n+"-deleted-rule____{}",l("boolean"==typeof i,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=i,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0;var o="undefined"!=typeof window&&document.querySelector('meta[property="csp-nonce"]');this._nonce=o?o.getAttribute("content"):null}var t,s=e.prototype;return s.setOptimizeForSpeed=function(e){l("boolean"==typeof e,"`setOptimizeForSpeed` accepts a boolean"),l(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=e,this.inject()},s.isOptimizeForSpeed=function(){return this._optimizeForSpeed},s.inject=function(){var e=this;if(l(!this._injected,"sheet already injected"),this._injected=!0,"undefined"!=typeof window&&this._optimizeForSpeed){this._tags[0]=this.makeStyleTag(this._name),this._optimizeForSpeed="insertRule"in this.getSheet(),this._optimizeForSpeed||(r||console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode."),this.flush(),this._injected=!0);return}this._serverSheet={cssRules:[],insertRule:function(t,s){return"number"==typeof s?e._serverSheet.cssRules[s]={cssText:t}:e._serverSheet.cssRules.push({cssText:t}),s},deleteRule:function(t){e._serverSheet.cssRules[t]=null}}},s.getSheetForTag=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]},s.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},s.insertRule=function(e,t){if(l(c(e),"`insertRule` accepts only strings"),"undefined"==typeof window)return"number"!=typeof t&&(t=this._serverSheet.cssRules.length),this._serverSheet.insertRule(e,t),this._rulesCount++;if(this._optimizeForSpeed){var s=this.getSheet();"number"!=typeof t&&(t=s.cssRules.length);try{s.insertRule(e,t)}catch(t){return r||console.warn("StyleSheet: illegal rule: \n\n"+e+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),-1}}else{var n=this._tags[t];this._tags.push(this.makeStyleTag(this._name,e,n))}return this._rulesCount++},s.replaceRule=function(e,t){if(this._optimizeForSpeed||"undefined"==typeof window){var s="undefined"!=typeof window?this.getSheet():this._serverSheet;if(t.trim()||(t=this._deletedRulePlaceholder),!s.cssRules[e])return e;s.deleteRule(e);try{s.insertRule(t,e)}catch(n){r||console.warn("StyleSheet: illegal rule: \n\n"+t+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),s.insertRule(this._deletedRulePlaceholder,e)}}else{var n=this._tags[e];l(n,"old rule at index `"+e+"` not found"),n.textContent=t}return e},s.deleteRule=function(e){if("undefined"==typeof window)return void this._serverSheet.deleteRule(e);if(this._optimizeForSpeed)this.replaceRule(e,"");else{var t=this._tags[e];l(t,"rule at index `"+e+"` not found"),t.parentNode.removeChild(t),this._tags[e]=null}},s.flush=function(){this._injected=!1,this._rulesCount=0,"undefined"!=typeof window?(this._tags.forEach(function(e){return e&&e.parentNode.removeChild(e)}),this._tags=[]):this._serverSheet.cssRules=[]},s.cssRules=function(){var e=this;return"undefined"==typeof window?this._serverSheet.cssRules:this._tags.reduce(function(t,s){return s?t=t.concat(Array.prototype.map.call(e.getSheetForTag(s).cssRules,function(t){return t.cssText===e._deletedRulePlaceholder?null:t})):t.push(null),t},[])},s.makeStyleTag=function(e,t,s){t&&l(c(t),"makeStyleTag accepts only strings as second parameter");var n=document.createElement("style");this._nonce&&n.setAttribute("nonce",this._nonce),n.type="text/css",n.setAttribute("data-"+e,""),t&&n.appendChild(document.createTextNode(t));var a=document.head||document.getElementsByTagName("head")[0];return s?a.insertBefore(n,s):a.appendChild(n),n},t=[{key:"length",get:function(){return this._rulesCount}}],function(e,t){for(var s=0;s<t.length;s++){var n=t[s];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(e.prototype,t),e}();function l(e,t){if(!e)throw Error("StyleSheet: "+t+".")}var d=function(e){for(var t=5381,s=e.length;s;)t=33*t^e.charCodeAt(--s);return t>>>0},u={};function f(e,t){if(!t)return"jsx-"+e;var s=String(t),n=e+s;return u[n]||(u[n]="jsx-"+d(e+"-"+s)),u[n]}function h(e,t){"undefined"==typeof window&&(t=t.replace(/\/style/gi,"\\/style"));var s=e+t;return u[s]||(u[s]=t.replace(/__jsx-style-dynamic-selector/g,e)),u[s]}var m=function(){function e(e){var t=void 0===e?{}:e,s=t.styleSheet,n=void 0===s?null:s,a=t.optimizeForSpeed,i=void 0!==a&&a;this._sheet=n||new o({name:"styled-jsx",optimizeForSpeed:i}),this._sheet.inject(),n&&"boolean"==typeof i&&(this._sheet.setOptimizeForSpeed(i),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var t=e.prototype;return t.add=function(e){var t=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(e.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),"undefined"==typeof window||this._fromServer||(this._fromServer=this.selectFromServer(),this._instancesCounts=Object.keys(this._fromServer).reduce(function(e,t){return e[t]=0,e},{}));var s=this.getIdAndRules(e),n=s.styleId,a=s.rules;if(n in this._instancesCounts){this._instancesCounts[n]+=1;return}var i=a.map(function(e){return t._sheet.insertRule(e)}).filter(function(e){return -1!==e});this._indices[n]=i,this._instancesCounts[n]=1},t.remove=function(e){var t=this,s=this.getIdAndRules(e).styleId;if(function(e,t){if(!e)throw Error("StyleSheetRegistry: "+t+".")}(s in this._instancesCounts,"styleId: `"+s+"` not found"),this._instancesCounts[s]-=1,this._instancesCounts[s]<1){var n=this._fromServer&&this._fromServer[s];n?(n.parentNode.removeChild(n),delete this._fromServer[s]):(this._indices[s].forEach(function(e){return t._sheet.deleteRule(e)}),delete this._indices[s]),delete this._instancesCounts[s]}},t.update=function(e,t){this.add(t),this.remove(e)},t.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},t.cssRules=function(){var e=this,t=this._fromServer?Object.keys(this._fromServer).map(function(t){return[t,e._fromServer[t]]}):[],s=this._sheet.cssRules();return t.concat(Object.keys(this._indices).map(function(t){return[t,e._indices[t].map(function(e){return s[e].cssText}).join(e._optimizeForSpeed?"":"\n")]}).filter(function(e){return!!e[1]}))},t.styles=function(e){var t,s;return t=this.cssRules(),void 0===(s=e)&&(s={}),t.map(function(e){var t=e[0],n=e[1];return i.default.createElement("style",{id:"__"+t,key:"__"+t,nonce:s.nonce?s.nonce:void 0,dangerouslySetInnerHTML:{__html:n}})})},t.getIdAndRules=function(e){var t=e.children,s=e.dynamic,n=e.id;if(s){var a=f(n,s);return{styleId:a,rules:Array.isArray(t)?t.map(function(e){return h(a,e)}):[h(a,t)]}}return{styleId:f(n),rules:Array.isArray(t)?t:[t]}},t.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(e,t){return e[t.id.slice(2)]=t,e},{})},e}(),p=a.createContext(null);function y(){return new m}function g(){return a.useContext(p)}p.displayName="StyleSheetContext";var x=i.default.useInsertionEffect||i.default.useLayoutEffect,j="undefined"!=typeof window?y():void 0;function v(e){var t=j||g();return t&&("undefined"==typeof window?t.add(e):x(function(){return t.add(e),function(){t.remove(e)}},[e.id,String(e.dynamic)])),null}v.dynamic=function(e){return e.map(function(e){return f(e[0],e[1])}).join(" ")},s.StyleRegistry=function(e){var t=e.registry,s=e.children,n=a.useContext(p),r=a.useState(function(){return n||t||y()})[0];return i.default.createElement(p.Provider,{value:r},s)},s.createStyleRegistry=y,s.style=v,s.useStyleRegistry=g},860919,(e,t,s)=>{t.exports=e.r(510150).style},928961,e=>{"use strict";var t=e.i(44990),s=e.i(860919),n=e.i(403055),a=e.i(245421);function i(){let[e,i]=(0,n.useState)("task"),[r,c]=(0,n.useState)([]),o=e=>{c(t=>[...t,`${new Date().toLocaleTimeString()}: ${e}`])};return(0,t.jsxs)("div",{className:"jsx-963afc78f4140ecc dynamic-demo",children:[(0,t.jsx)(s.default,{id:"963afc78f4140ecc",children:".dynamic-demo.jsx-963afc78f4140ecc{max-width:1200px;margin:0 auto;padding:2rem}.header.jsx-963afc78f4140ecc{color:#fff;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:8px;margin-bottom:2rem;padding:2rem}.model-selector.jsx-963afc78f4140ecc{background:#fff;border-radius:8px;margin-bottom:2rem;padding:1.5rem;box-shadow:0 2px 4px #0000001a}.test-grid.jsx-963afc78f4140ecc{grid-template-columns:repeat(auto-fit,minmax(500px,1fr));gap:1.5rem;margin-bottom:2rem;display:grid}.test-section.jsx-963afc78f4140ecc{background:#fff;border-radius:8px;padding:1.5rem;box-shadow:0 2px 4px #0000001a}.test-section.jsx-963afc78f4140ecc h3.jsx-963afc78f4140ecc{color:#667eea;margin:0 0 1rem}.success.jsx-963afc78f4140ecc{color:#10b981;font-weight:600}.error.jsx-963afc78f4140ecc{color:#ef4444;font-weight:600}.test-button.jsx-963afc78f4140ecc,button.jsx-963afc78f4140ecc{color:#fff;cursor:pointer;background:#667eea;border:none;border-radius:4px;margin-right:.5rem;padding:.5rem 1rem;font-size:14px}.test-button.jsx-963afc78f4140ecc:hover,button.jsx-963afc78f4140ecc:hover{background:#5568d3}.test-button.jsx-963afc78f4140ecc:disabled,button.jsx-963afc78f4140ecc:disabled{cursor:not-allowed;background:#9ca3af}.pagination-controls.jsx-963afc78f4140ecc{align-items:center;gap:1rem;margin:1rem 0;display:flex}pre.jsx-963afc78f4140ecc{background:#f3f4f6;border-radius:4px;max-height:300px;padding:1rem;font-size:12px;overflow:auto}select.jsx-963afc78f4140ecc{border:1px solid #d1d5db;border-radius:4px;padding:.5rem;font-size:14px}.results-panel.jsx-963afc78f4140ecc{color:#f3f4f6;background:#1f2937;border-radius:8px;max-height:400px;padding:1.5rem;overflow:auto}.results-panel.jsx-963afc78f4140ecc h3.jsx-963afc78f4140ecc{color:#fff;margin-top:0}.result-line.jsx-963afc78f4140ecc{border-bottom:1px solid #374151;padding:.25rem 0;font-family:Monaco,Courier New,monospace;font-size:12px}"}),(0,t.jsxs)("div",{className:"jsx-963afc78f4140ecc header",children:[(0,t.jsx)("h1",{className:"jsx-963afc78f4140ecc",children:"🚀 Dynamic GraphQL Demo"}),(0,t.jsx)("p",{className:"jsx-963afc78f4140ecc",children:"Test the Universal Dynamic GraphQL System"}),(0,t.jsx)("p",{style:{opacity:.9,fontSize:"14px"},className:"jsx-963afc78f4140ecc",children:"One system to rule them all - No custom resolvers needed!"})]}),(0,t.jsx)("div",{className:"jsx-963afc78f4140ecc model-selector",children:(0,t.jsxs)("label",{className:"jsx-963afc78f4140ecc",children:[(0,t.jsx)("strong",{className:"jsx-963afc78f4140ecc",children:"Select Model to Test:"}),(0,t.jsx)("br",{className:"jsx-963afc78f4140ecc"}),(0,t.jsxs)("select",{value:e,onChange:e=>i(e.target.value),className:"jsx-963afc78f4140ecc",children:[(0,t.jsx)("option",{value:"task",className:"jsx-963afc78f4140ecc",children:"Task"}),(0,t.jsx)("option",{value:"user",className:"jsx-963afc78f4140ecc",children:"User"}),(0,t.jsx)("option",{value:"post",className:"jsx-963afc78f4140ecc",children:"Post"}),(0,t.jsx)("option",{value:"comment",className:"jsx-963afc78f4140ecc",children:"Comment"}),(0,t.jsx)("option",{value:"product",className:"jsx-963afc78f4140ecc",children:"Product"}),(0,t.jsx)("option",{value:"category",className:"jsx-963afc78f4140ecc",children:"Category"}),(0,t.jsx)("option",{value:"invoice",className:"jsx-963afc78f4140ecc",children:"Invoice"}),(0,t.jsx)("option",{value:"page",className:"jsx-963afc78f4140ecc",children:"Page"}),(0,t.jsx)("option",{value:"notification",className:"jsx-963afc78f4140ecc",children:"Notification"})]})]})}),(0,t.jsxs)("div",{className:"jsx-963afc78f4140ecc test-grid",children:[(0,t.jsx)(()=>{let{data:s,loading:n,error:i}=(0,a.useFindMany)(e,{take:5,orderBy:{createdAt:"desc"}});return(0,t.jsxs)("div",{className:"test-section",children:[(0,t.jsxs)("h3",{children:["Test 1: Find Many (",e,")"]}),n&&(0,t.jsx)("p",{children:"Loading..."}),i&&(0,t.jsxs)("p",{className:"error",children:["Error: ",i.message]}),s&&(0,t.jsxs)("div",{children:[(0,t.jsxs)("p",{className:"success",children:["✅ Found ",s.length," records"]}),(0,t.jsx)("pre",{children:JSON.stringify(s,null,2)})]})]})},{className:"jsx-963afc78f4140ecc"}),(0,t.jsx)(()=>{let{data:s,meta:n,loading:i,nextPage:r,prevPage:c,page:o}=(0,a.useFindManyPaginated)(e,{page:1,limit:5});return(0,t.jsxs)("div",{className:"test-section",children:[(0,t.jsxs)("h3",{children:["Test 2: Pagination (",e,")"]}),i&&(0,t.jsx)("p",{children:"Loading..."}),n&&(0,t.jsxs)("div",{children:[(0,t.jsxs)("p",{className:"success",children:["✅ Page ",n.page," of ",n.totalPages," (",n.total," total)"]}),(0,t.jsxs)("div",{className:"pagination-controls",children:[(0,t.jsx)("button",{onClick:c,disabled:!n.hasPrevPage,children:"← Previous"}),(0,t.jsxs)("span",{children:["Page ",o]}),(0,t.jsx)("button",{onClick:r,disabled:!n.hasNextPage,children:"Next →"})]}),s&&(0,t.jsx)("pre",{children:JSON.stringify(s.slice(0,2),null,2)})]})]})},{className:"jsx-963afc78f4140ecc"}),(0,t.jsx)(()=>{let{count:s,loading:n}=(0,a.useCount)(e);return(0,t.jsxs)("div",{className:"test-section",children:[(0,t.jsxs)("h3",{children:["Test 3: Count (",e,")"]}),n&&(0,t.jsx)("p",{children:"Loading..."}),void 0!==s&&(0,t.jsxs)("p",{className:"success",children:["✅ Total records: ",s]})]})},{className:"jsx-963afc78f4140ecc"}),(0,t.jsx)(()=>{let e=(0,a.useCRUD)("task"),s=async()=>{try{o("🔵 Starting CRUD test...");let t=await e.findMany({take:3});o(`✅ Found ${t.length} tasks`);let s=await e.count();o(`✅ Total count: ${s}`);let n=await e.createOne({data:{title:`Test Task ${Date.now()}`,description:"Created by Dynamic GraphQL Demo",status:"TODO",priority:"MEDIUM",category:"WORK",userId:"123"}});o(`✅ Created task: ${n.id}`);let a=await e.updateOne({where:{id:n.id},data:{status:"IN_PROGRESS"}});o(`✅ Updated task status: ${a.status}`),await e.deleteOne({where:{id:n.id}}),o(`✅ Deleted task: ${n.id}`),o("🎉 CRUD test completed successfully!")}catch(e){o(`❌ Error: ${e.message}`)}};return(0,t.jsxs)("div",{className:"test-section",children:[(0,t.jsx)("h3",{children:"Test 4: CRUD Operations"}),(0,t.jsx)("button",{onClick:s,disabled:e.loading,className:"test-button",children:e.loading?"Running...":"Run CRUD Test"})]})},{className:"jsx-963afc78f4140ecc"}),(0,t.jsx)(()=>{let[e,{loading:s}]=(0,a.useCreateOne)("task"),[i,r]=(0,n.useState)(null),c=async()=>{try{let t=await e({data:{title:`Demo Task ${Date.now()}`,description:"Created from Dynamic GraphQL Demo",status:"TODO",priority:"HIGH",category:"WORK",userId:"123"}});r(t),o(`✅ Created: ${t.id}`)}catch(e){o(`❌ Error: ${e.message}`)}};return(0,t.jsxs)("div",{className:"test-section",children:[(0,t.jsx)("h3",{children:"Test 5: Create One"}),(0,t.jsx)("button",{onClick:c,disabled:s,children:s?"Creating...":"Create Task"}),i&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"success",children:"✅ Created!"}),(0,t.jsx)("pre",{children:JSON.stringify(i,null,2)})]})]})},{className:"jsx-963afc78f4140ecc"}),(0,t.jsx)(()=>{let{data:e,loading:s}=(0,a.useFindMany)("task",{where:{status:"ACTIVE",priority:{in:["HIGH","MEDIUM"]}},include:{user:!0},orderBy:{createdAt:"desc"},take:3});return(0,t.jsxs)("div",{className:"test-section",children:[(0,t.jsx)("h3",{children:"Test 6: Advanced Query"}),(0,t.jsx)("p",{children:"Find active tasks with HIGH/MEDIUM priority + user"}),s&&(0,t.jsx)("p",{children:"Loading..."}),e&&(0,t.jsxs)("div",{children:[(0,t.jsxs)("p",{className:"success",children:["✅ Found ",e.length," tasks"]}),(0,t.jsx)("pre",{children:JSON.stringify(e,null,2)})]})]})},{className:"jsx-963afc78f4140ecc"})]}),(0,t.jsxs)("div",{className:"jsx-963afc78f4140ecc results-panel",children:[(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},className:"jsx-963afc78f4140ecc",children:[(0,t.jsx)("h3",{className:"jsx-963afc78f4140ecc",children:"📊 Test Results"}),(0,t.jsx)("button",{onClick:()=>c([]),className:"jsx-963afc78f4140ecc",children:"Clear"})]}),0===r.length?(0,t.jsx)("p",{style:{opacity:.6},className:"jsx-963afc78f4140ecc",children:"No results yet. Run some tests!"}):(0,t.jsx)("div",{className:"jsx-963afc78f4140ecc",children:r.map((e,s)=>(0,t.jsx)("div",{className:"jsx-963afc78f4140ecc result-line",children:e},s))})]}),(0,t.jsxs)("div",{style:{marginTop:"2rem"},className:"jsx-963afc78f4140ecc test-section",children:[(0,t.jsx)("h3",{className:"jsx-963afc78f4140ecc",children:"📖 Instructions"}),(0,t.jsxs)("ol",{className:"jsx-963afc78f4140ecc",children:[(0,t.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"Select a model from the dropdown"}),(0,t.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"All tests automatically update for that model"}),(0,t.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"Run CRUD test to see Create/Update/Delete in action"}),(0,t.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"Check the results panel for operation logs"}),(0,t.jsx)("li",{className:"jsx-963afc78f4140ecc",children:"View the browser console for detailed logs"})]}),(0,t.jsxs)("p",{className:"jsx-963afc78f4140ecc",children:[(0,t.jsx)("strong",{className:"jsx-963afc78f4140ecc",children:"Note:"})," Make sure you're authenticated and have data in your database!"]})]})]})}e.s(["default",()=>i])}]);