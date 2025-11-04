(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,377991,e=>{"use strict";var t=e.i(403055),r=e.i(119836),i=e.i(110964),a=e.i(569658),s=e.i(316618),n=e.i(559663),l=e.i(873273),o=e.i(214018),d=e.i(346412),c=e.i(825198),u=e.i(44990),m="rovingFocusGroup.onEntryFocus",g={bubbles:!1,cancelable:!0},p="RovingFocusGroup",[f,h,x]=(0,i.createCollection)(p),[y,v]=(0,s.createContextScope)(p,[x]),[b,j]=y(p),P=t.forwardRef((e,t)=>(0,u.jsx)(f.Provider,{scope:e.__scopeRovingFocusGroup,children:(0,u.jsx)(f.Slot,{scope:e.__scopeRovingFocusGroup,children:(0,u.jsx)(C,{...e,ref:t})})}));P.displayName=p;var C=t.forwardRef((e,i)=>{let{__scopeRovingFocusGroup:s,orientation:n,loop:f=!1,dir:x,currentTabStopId:y,defaultCurrentTabStopId:v,onCurrentTabStopIdChange:j,onEntryFocus:P,preventScrollOnEntryFocus:C=!1,...N}=e,_=t.useRef(null),w=(0,a.useComposedRefs)(i,_),R=(0,c.useDirection)(x),[E,S]=(0,d.useControllableState)({prop:y,defaultProp:v??null,onChange:j,caller:p}),[A,F]=t.useState(!1),I=(0,o.useCallbackRef)(P),O=h(s),$=t.useRef(!1),[D,M]=t.useState(0);return t.useEffect(()=>{let e=_.current;if(e)return e.addEventListener(m,I),()=>e.removeEventListener(m,I)},[I]),(0,u.jsx)(b,{scope:s,orientation:n,dir:R,loop:f,currentTabStopId:E,onItemFocus:t.useCallback(e=>S(e),[S]),onItemShiftTab:t.useCallback(()=>F(!0),[]),onFocusableItemAdd:t.useCallback(()=>M(e=>e+1),[]),onFocusableItemRemove:t.useCallback(()=>M(e=>e-1),[]),children:(0,u.jsx)(l.Primitive.div,{tabIndex:A||0===D?-1:0,"data-orientation":n,...N,ref:w,style:{outline:"none",...e.style},onMouseDown:(0,r.composeEventHandlers)(e.onMouseDown,()=>{$.current=!0}),onFocus:(0,r.composeEventHandlers)(e.onFocus,e=>{let t=!$.current;if(e.target===e.currentTarget&&t&&!A){let t=new CustomEvent(m,g);if(e.currentTarget.dispatchEvent(t),!t.defaultPrevented){let e=O().filter(e=>e.focusable);T([e.find(e=>e.active),e.find(e=>e.id===E),...e].filter(Boolean).map(e=>e.ref.current),C)}}$.current=!1}),onBlur:(0,r.composeEventHandlers)(e.onBlur,()=>F(!1))})})}),N="RovingFocusGroupItem",_=t.forwardRef((e,i)=>{let{__scopeRovingFocusGroup:a,focusable:s=!0,active:o=!1,tabStopId:d,children:c,...m}=e,g=(0,n.useId)(),p=d||g,x=j(N,a),y=x.currentTabStopId===p,v=h(a),{onFocusableItemAdd:b,onFocusableItemRemove:P,currentTabStopId:C}=x;return t.useEffect(()=>{if(s)return b(),()=>P()},[s,b,P]),(0,u.jsx)(f.ItemSlot,{scope:a,id:p,focusable:s,active:o,children:(0,u.jsx)(l.Primitive.span,{tabIndex:y?0:-1,"data-orientation":x.orientation,...m,ref:i,onMouseDown:(0,r.composeEventHandlers)(e.onMouseDown,e=>{s?x.onItemFocus(p):e.preventDefault()}),onFocus:(0,r.composeEventHandlers)(e.onFocus,()=>x.onItemFocus(p)),onKeyDown:(0,r.composeEventHandlers)(e.onKeyDown,e=>{if("Tab"===e.key&&e.shiftKey)return void x.onItemShiftTab();if(e.target!==e.currentTarget)return;let t=function(e,t,r){var i;let a=(i=e.key,"rtl"!==r?i:"ArrowLeft"===i?"ArrowRight":"ArrowRight"===i?"ArrowLeft":i);if(!("vertical"===t&&["ArrowLeft","ArrowRight"].includes(a))&&!("horizontal"===t&&["ArrowUp","ArrowDown"].includes(a)))return w[a]}(e,x.orientation,x.dir);if(void 0!==t){if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;e.preventDefault();let a=v().filter(e=>e.focusable).map(e=>e.ref.current);if("last"===t)a.reverse();else if("prev"===t||"next"===t){var r,i;"prev"===t&&a.reverse();let s=a.indexOf(e.currentTarget);a=x.loop?(r=a,i=s+1,r.map((e,t)=>r[(i+t)%r.length])):a.slice(s+1)}setTimeout(()=>T(a))}}),children:"function"==typeof c?c({isCurrentTabStop:y,hasTabStop:null!=C}):c})})});_.displayName=N;var w={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function T(e,t=!1){let r=document.activeElement;for(let i of e)if(i===r||(i.focus({preventScroll:t}),document.activeElement!==r))return}e.s(["Item",()=>_,"Root",()=>P,"createRovingFocusGroupScope",()=>v])},996517,e=>{"use strict";var t=e.i(44990),r=e.i(403055),i=e.i(119836),a=e.i(316618),s=e.i(377991),n=e.i(767478),l=e.i(873273),o=e.i(825198),d=e.i(346412),c=e.i(559663),u="Tabs",[m,g]=(0,a.createContextScope)(u,[s.createRovingFocusGroupScope]),p=(0,s.createRovingFocusGroupScope)(),[f,h]=m(u),x=r.forwardRef((e,r)=>{let{__scopeTabs:i,value:a,onValueChange:s,defaultValue:n,orientation:m="horizontal",dir:g,activationMode:p="automatic",...h}=e,x=(0,o.useDirection)(g),[y,v]=(0,d.useControllableState)({prop:a,onChange:s,defaultProp:n??"",caller:u});return(0,t.jsx)(f,{scope:i,baseId:(0,c.useId)(),value:y,onValueChange:v,orientation:m,dir:x,activationMode:p,children:(0,t.jsx)(l.Primitive.div,{dir:x,"data-orientation":m,...h,ref:r})})});x.displayName=u;var y="TabsList",v=r.forwardRef((e,r)=>{let{__scopeTabs:i,loop:a=!0,...n}=e,o=h(y,i),d=p(i);return(0,t.jsx)(s.Root,{asChild:!0,...d,orientation:o.orientation,dir:o.dir,loop:a,children:(0,t.jsx)(l.Primitive.div,{role:"tablist","aria-orientation":o.orientation,...n,ref:r})})});v.displayName=y;var b="TabsTrigger",j=r.forwardRef((e,r)=>{let{__scopeTabs:a,value:n,disabled:o=!1,...d}=e,c=h(b,a),u=p(a),m=N(c.baseId,n),g=_(c.baseId,n),f=n===c.value;return(0,t.jsx)(s.Item,{asChild:!0,...u,focusable:!o,active:f,children:(0,t.jsx)(l.Primitive.button,{type:"button",role:"tab","aria-selected":f,"aria-controls":g,"data-state":f?"active":"inactive","data-disabled":o?"":void 0,disabled:o,id:m,...d,ref:r,onMouseDown:(0,i.composeEventHandlers)(e.onMouseDown,e=>{o||0!==e.button||!1!==e.ctrlKey?e.preventDefault():c.onValueChange(n)}),onKeyDown:(0,i.composeEventHandlers)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&c.onValueChange(n)}),onFocus:(0,i.composeEventHandlers)(e.onFocus,()=>{let e="manual"!==c.activationMode;f||o||!e||c.onValueChange(n)})})})});j.displayName=b;var P="TabsContent",C=r.forwardRef((e,i)=>{let{__scopeTabs:a,value:s,forceMount:o,children:d,...c}=e,u=h(P,a),m=N(u.baseId,s),g=_(u.baseId,s),p=s===u.value,f=r.useRef(p);return r.useEffect(()=>{let e=requestAnimationFrame(()=>f.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,t.jsx)(n.Presence,{present:o||p,children:({present:r})=>(0,t.jsx)(l.Primitive.div,{"data-state":p?"active":"inactive","data-orientation":u.orientation,role:"tabpanel","aria-labelledby":m,hidden:!r,id:g,tabIndex:0,...c,ref:i,style:{...e.style,animationDuration:f.current?"0s":void 0},children:r&&d})})});function N(e,t){return`${e}-trigger-${t}`}function _(e,t){return`${e}-content-${t}`}C.displayName=P;var w=e.i(541428);let T=r.forwardRef(({className:e,...r},i)=>(0,t.jsx)(v,{ref:i,className:(0,w.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",e),...r}));T.displayName=v.displayName;let R=r.forwardRef(({className:e,...r},i)=>(0,t.jsx)(j,{ref:i,className:(0,w.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",e),...r}));R.displayName=j.displayName;let E=r.forwardRef(({className:e,...r},i)=>(0,t.jsx)(C,{ref:i,className:(0,w.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",e),...r}));E.displayName=C.displayName,e.s(["Tabs",()=>x,"TabsContent",()=>E,"TabsList",()=>T,"TabsTrigger",()=>R],996517)},774309,e=>{"use strict";var t=e.i(44990);let r=e.i(403055).forwardRef(({className:e,...r},i)=>(0,t.jsx)("div",{ref:i,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...r}));r.displayName="Skeleton",e.s(["Skeleton",()=>r])},67087,e=>{"use strict";var t=e.i(44990),r=e.i(403055),i=e.i(541428);let a=r.forwardRef(({className:e,orientation:r="horizontal",decorative:a=!0,...s},n)=>(0,t.jsx)("div",{ref:n,role:a?"none":"separator","aria-orientation":a?void 0:r,className:(0,i.cn)("shrink-0 bg-gray-200","horizontal"===r?"h-[1px] w-full":"h-full w-[1px]",e),...s}));a.displayName="Separator",e.s(["Separator",()=>a])},833350,e=>{"use strict";let t=(0,e.i(930702).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);e.s(["default",()=>t])},791174,e=>{"use strict";var t=e.i(833350);e.s(["RefreshCw",()=>t.default])},674181,e=>{"use strict";let t=(0,e.i(930702).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);e.s(["default",()=>t])},553579,e=>{"use strict";var t=e.i(674181);e.s(["Star",()=>t.default])},49316,(e,t,r)=>{"use strict";function i({widthInt:e,heightInt:t,blurWidth:r,blurHeight:i,blurDataURL:a,objectFit:s}){let n=r?40*r:e,l=i?40*i:t,o=n&&l?`viewBox='0 0 ${n} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${o}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${o?"none":"contain"===s?"xMidYMid":"cover"===s?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${a}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return i}})},596974,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={VALID_LOADERS:function(){return s},imageConfigDefault:function(){return n}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},473733,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return o}}),e.r(715200);let i=e.r(49316),a=e.r(596974),s=["-moz-initial","fill","none","scale-down",void 0];function n(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function o({src:e,sizes:t,unoptimized:r=!1,priority:o=!1,preload:d=!1,loading:c,className:u,quality:m,width:g,height:p,fill:f=!1,style:h,overrideSrc:x,onLoad:y,onLoadingComplete:v,placeholder:b="empty",blurDataURL:j,fetchPriority:P,decoding:C="async",layout:N,objectFit:_,objectPosition:w,lazyBoundary:T,lazyRoot:R,...E},S){var A;let F,I,O,{imgConf:$,showAltText:D,blurComplete:M,defaultLoader:k}=S,G=$||a.imageConfigDefault;if("allSizes"in G)F=G;else{let e=[...G.deviceSizes,...G.imageSizes].sort((e,t)=>e-t),t=G.deviceSizes.sort((e,t)=>e-t),r=G.qualities?.sort((e,t)=>e-t);F={...G,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===k)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let B=E.loader||k;delete E.loader,delete E.srcSet;let q="__next_img_default"in B;if(q){if("custom"===F.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=B;B=t=>{let{config:r,...i}=t;return e(i)}}if(N){"fill"===N&&(f=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[N];e&&(h={...h,...e});let r={responsive:"100vw",fill:"100vw"}[N];r&&!t&&(t=r)}let U="",z=l(g),L=l(p);if((A=e)&&"object"==typeof A&&(n(A)||void 0!==A.src)){let t=n(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(I=t.blurWidth,O=t.blurHeight,j=j||t.blurDataURL,U=t.src,!f)if(z||L){if(z&&!L){let e=z/t.width;L=Math.round(t.height*e)}else if(!z&&L){let e=L/t.height;z=Math.round(t.width*e)}}else z=t.width,L=t.height}let V=!o&&!d&&("lazy"===c||void 0===c);(!(e="string"==typeof e?e:U)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,V=!1),F.unoptimized&&(r=!0),q&&!F.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let H=l(m),K=Object.assign(f?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:_,objectPosition:w}:{},D?{}:{color:"transparent"},h),Y=M||"empty"===b?null:"blur"===b?`url("data:image/svg+xml;charset=utf-8,${(0,i.getImageBlurSvg)({widthInt:z,heightInt:L,blurWidth:I,blurHeight:O,blurDataURL:j||"",objectFit:K.objectFit})}")`:`url("${b}")`,W=s.includes(K.objectFit)?"fill"===K.objectFit?"100% 100%":"cover":K.objectFit,X=Y?{backgroundSize:W,backgroundPosition:K.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:Y}:{},Q=function({config:e,src:t,unoptimized:r,width:i,quality:a,sizes:s,loader:n}){if(r)return{src:t,srcSet:void 0,sizes:void 0};let{widths:l,kind:o}=function({deviceSizes:e,allSizes:t},r,i){if(i){let r=/(^|\s)(1?\d?\d)vw/g,a=[];for(let e;e=r.exec(i);)a.push(parseInt(e[2]));if(a.length){let r=.01*Math.min(...a);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,i,s),d=l.length-1;return{sizes:s||"w"!==o?s:"100vw",srcSet:l.map((r,i)=>`${n({config:e,src:t,quality:a,width:r})} ${"w"===o?r:i+1}${o}`).join(", "),src:n({config:e,src:t,quality:a,width:l[d]})}}({config:F,src:e,unoptimized:r,width:z,quality:H,sizes:t,loader:B}),J=V?"lazy":c;return{props:{...E,loading:J,fetchPriority:P,width:z,height:L,decoding:C,className:u,style:{...K,...X},sizes:Q.sizes,srcSet:Q.srcSet,src:x||Q.src},meta:{unoptimized:r,preload:d||o,placeholder:b,fill:f}}}},805690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return l}});let i=e.r(403055),a="undefined"==typeof window,s=a?()=>{}:i.useLayoutEffect,n=a?()=>{}:i.useEffect;function l(e){let{headManager:t,reduceComponentsToState:r}=e;function l(){if(t&&t.mountedInstances){let e=i.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return a&&(t?.mountedInstances?.add(e.children),l()),s(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),s(()=>(t&&(t._pendingUpdate=l),()=>{t&&(t._pendingUpdate=l)})),n(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},308112,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={default:function(){return f},defaultHead:function(){return u}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=e.r(940192),n=e.r(475244),l=e.r(44990),o=n._(e.r(403055)),d=s._(e.r(805690)),c=e.r(525989);function u(){return[(0,l.jsx)("meta",{charSet:"utf-8"},"charset"),(0,l.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function m(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===o.default.Fragment?e.concat(o.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(715200);let g=["name","httpEquiv","charSet","itemProp"];function p(e){let t,r,i,a;return e.reduce(m,[]).reverse().concat(u().reverse()).filter((t=new Set,r=new Set,i=new Set,a={},e=>{let s=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?s=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?s=!1:r.add(e.type);break;case"meta":for(let t=0,r=g.length;t<r;t++){let r=g[t];if(e.props.hasOwnProperty(r))if("charSet"===r)i.has(r)?s=!1:i.add(r);else{let t=e.props[r],i=a[r]||new Set;("name"!==r||!n)&&i.has(t)?s=!1:(i.add(t),a[r]=i)}}}return s})).reverse().map((e,t)=>{let r=e.key||t;return o.default.cloneElement(e,{key:r})})}let f=function({children:e}){let t=(0,o.useContext)(c.HeadManagerContext);return(0,l.jsx)(d.default,{reduceComponentsToState:p,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},238369,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return s}});let i=e.r(940192)._(e.r(403055)),a=e.r(596974),s=i.default.createContext(a.imageConfigDefault)},420539,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return i}});let i=e.r(940192)._(e.r(403055)).default.createContext(null)},659556,(e,t,r)=>{"use strict";function i(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,0):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return i}})},103342,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return s}});let i=e.r(659556);function a({config:e,src:t,width:r,quality:a}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let s=(0,i.findClosestQuality)(a,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${s}${t.startsWith("/_next/static/media/"),""}`}a.__next_img_default=!0;let s=a},894595,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return b}});let i=e.r(940192),a=e.r(475244),s=e.r(44990),n=a._(e.r(403055)),l=i._(e.r(940392)),o=i._(e.r(308112)),d=e.r(473733),c=e.r(596974),u=e.r(238369);e.r(715200);let m=e.r(420539),g=i._(e.r(103342)),p=e.r(527304),f={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function h(e,t,r,i,a,s,n){let l=e?.src;e&&e["data-loaded-src"]!==l&&(e["data-loaded-src"]=l,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&a(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let i=!1,a=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>i,isPropagationStopped:()=>a,persist:()=>{},preventDefault:()=>{i=!0,t.preventDefault()},stopPropagation:()=>{a=!0,t.stopPropagation()}})}i?.current&&i.current(e)}}))}function x(e){return n.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let y=(0,n.forwardRef)(({src:e,srcSet:t,sizes:r,height:i,width:a,decoding:l,className:o,style:d,fetchPriority:c,placeholder:u,loading:m,unoptimized:g,fill:f,onLoadRef:y,onLoadingCompleteRef:v,setBlurComplete:b,setShowAltText:j,sizesInput:P,onLoad:C,onError:N,..._},w)=>{let T=(0,n.useCallback)(e=>{e&&(N&&(e.src=e.src),e.complete&&h(e,u,y,v,b,g,P))},[e,u,y,v,b,N,g,P]),R=(0,p.useMergedRef)(w,T);return(0,s.jsx)("img",{..._,...x(c),loading:m,width:a,height:i,decoding:l,"data-nimg":f?"fill":"1",className:o,style:d,sizes:r,srcSet:t,src:e,ref:R,onLoad:e=>{h(e.currentTarget,u,y,v,b,g,P)},onError:e=>{j(!0),"empty"!==u&&b(!0),N&&N(e)}})});function v({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&l.default.preload?(l.default.preload(t.src,r),null):(0,s.jsx)(o.default,{children:(0,s.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let b=(0,n.forwardRef)((e,t)=>{let r=(0,n.useContext)(m.RouterContext),i=(0,n.useContext)(u.ImageConfigContext),a=(0,n.useMemo)(()=>{let e=f||i||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),a=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:a,localPatterns:"undefined"==typeof window?i?.localPatterns:e.localPatterns}},[i]),{onLoad:l,onLoadingComplete:o}=e,p=(0,n.useRef)(l);(0,n.useEffect)(()=>{p.current=l},[l]);let h=(0,n.useRef)(o);(0,n.useEffect)(()=>{h.current=o},[o]);let[x,b]=(0,n.useState)(!1),[j,P]=(0,n.useState)(!1),{props:C,meta:N}=(0,d.getImgProps)(e,{defaultLoader:g.default,imgConf:a,blurComplete:x,showAltText:j});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(y,{...C,unoptimized:N.unoptimized,placeholder:N.placeholder,fill:N.fill,onLoadRef:p,onLoadingCompleteRef:h,setBlurComplete:b,setShowAltText:P,sizesInput:e.sizes,ref:t}),N.preload?(0,s.jsx)(v,{isAppRouter:!r,imgAttributes:C}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},211684,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={default:function(){return c},getImageProps:function(){return d}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=e.r(940192),n=e.r(473733),l=e.r(894595),o=s._(e.r(103342));function d(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:o.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let c=l.Image},586754,(e,t,r)=>{t.exports=e.r(211684)},20865,e=>{"use strict";let t=(0,e.i(930702).default)("shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);e.s(["default",()=>t])},68645,e=>{"use strict";var t=e.i(20865);e.s(["Shield",()=>t.default])},449595,e=>{"use strict";let t=(0,e.i(930702).default)("truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]);e.s(["default",()=>t])},547982,e=>{"use strict";var t=e.i(449595);e.s(["Truck",()=>t.default])},574375,e=>{"use strict";var t=e.i(984804);let r=t.gql`
  fragment CategoryBasicFields on CategoryType {
    id
    name
    slug
    description
    image
    displayOrder
    isActive
    createdAt
  }
`,i=t.gql`
  ${r}
  fragment CategoryWithCountFields on CategoryType {
    ...CategoryBasicFields
    productCount
  }
`,a=t.gql`
  ${i}
  fragment CategoryTreeFields on CategoryType {
    ...CategoryWithCountFields
    parent {
      id
      name
      slug
    }
    children {
      ...CategoryWithCountFields
    }
  }
`,s=t.gql`
  fragment ProductImageFields on ProductImageType {
    id
    url
    alt
    isPrimary
    order
    createdAt
  }
`,n=t.gql`
  fragment ProductVariantFields on ProductVariantType {
    id
    name
    sku
    price
    stock
    order
    isActive
    attributes
    createdAt
  }
`;t.gql`
  fragment ProductBasicFields on ProductType {
    id
    name
    slug
    description
    shortDesc
    price
    compareAtPrice
    status
    isActive
    sku
    createdAt
  }
`;let l=t.gql`
  fragment UserFragment on User {
    id
    email
    username
    firstName
    lastName
    phone
    avatar
    roleType
    isActive
    isVerified
    isTwoFactorEnabled
    failedLoginAttempts
    lockedUntil
    lastLoginAt
    createdAt
    updatedAt
  }
`,o=t.gql`
  fragment PostFragment on Post {
    id
    title
    slug
    content
    excerpt
    featured_image
    author {
      id
      username
    }
    category {
      id
      name
    }
    published_at
    created_at
  }
`,d=t.gql`
  fragment CommentFragment on Comment {
    id
    content
    author {
      id
      username
    }
    post {
      id
      title
    }
    created_at
  }
`;e.s(["CATEGORY_BASIC_FRAGMENT",0,r,"CATEGORY_TREE_FRAGMENT",0,a,"CATEGORY_WITH_COUNT_FRAGMENT",0,i,"COMMENT_FRAGMENT",0,d,"POST_FRAGMENT",0,o,"PRODUCT_IMAGE_FRAGMENT",0,s,"PRODUCT_VARIANT_FRAGMENT",0,n,"USER_FRAGMENT",0,l])},355422,e=>{"use strict";var t=e.i(984804),r=e.i(574375);let i=r.PRODUCT_IMAGE_FRAGMENT,a=r.PRODUCT_VARIANT_FRAGMENT,s=t.gql`
  fragment ProductBasicFields on ProductType {
    id
    name
    slug
    description
    shortDesc
    sku
    barcode
    price
    originalPrice
    costPrice
    unit
    stock
    minStock
    status
    thumbnail
    origin
    createdAt
    updatedAt
  }
`,n=t.gql`
  ${s}
  ${i}
  ${a}
  ${r.CATEGORY_BASIC_FRAGMENT}
  fragment ProductFullFields on ProductType {
    ...ProductBasicFields
    category {
      ...CategoryBasicFields
    }
    images {
      ...ProductImageFields
    }
    variants {
      ...ProductVariantFields
    }
    isFeatured
    isNewArrival
    isBestSeller
    isOnSale
    weight
    attributes
    metaTitle
    metaDescription
    metaKeywords
  }
`,l=t.gql`
  ${s}
  ${r.CATEGORY_BASIC_FRAGMENT}
  query GetProducts($input: GetProductsInput) {
    products(input: $input) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
      }
      total
      page
      limit
      totalPages
    }
  }
`,o=t.gql`
  ${n}
  query GetProduct($id: ID!) {
    product(id: $id) {
      ...ProductFullFields
    }
  }
`,d=t.gql`
  ${n}
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFullFields
    }
  }
`,c=t.gql`
  ${s}
  query GetProductsByCategory($categoryId: ID!, $input: GetProductsInput) {
    productsByCategory(categoryId: $categoryId, input: $input) {
      items {
        ...ProductBasicFields
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
      }
      total
      page
      limit
      totalPages
    }
  }
`,u=t.gql`
  ${s}
  ${r.CATEGORY_BASIC_FRAGMENT}
  query GetFeaturedProducts($limit: Int) {
    products(input: { 
      filters: { isFeatured: true }
      limit: $limit
      sortBy: "createdAt"
      sortOrder: DESC
    }) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        discountPercentage
      }
      total
    }
  }
`,m=t.gql`
  ${s}
  ${r.CATEGORY_BASIC_FRAGMENT}
  query SearchProducts($search: String!, $limit: Int, $page: Int) {
    products(input: { 
      filters: { search: $search }
      limit: $limit
      page: $page
    }) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        discountPercentage
      }
      total
      page
      limit
      totalPages
    }
  }
`;t.gql`
  ${s}
  ${r.CATEGORY_BASIC_FRAGMENT}
  query GetCheapProducts($input: GetProductsInput) {
    products(input: $input) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
      }
      total
      page
      limit
      totalPages
    }
  }
`;let g=t.gql`
  ${n}
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,p=t.gql`
  ${n}
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,f=t.gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`,h=t.gql`
  ${s}
  mutation UpdateProductStock($id: ID!, $quantity: Float!) {
    updateProductStock(id: $id, quantity: $quantity) {
      ...ProductBasicFields
    }
  }
`,x=t.gql`
  ${i}
  mutation AddProductImage($input: CreateProductImageInput!) {
    addProductImage(input: $input) {
      ...ProductImageFields
    }
  }
`,y=t.gql`
  mutation DeleteProductImage($id: ID!) {
    deleteProductImage(id: $id)
  }
`,v=t.gql`
  ${a}
  mutation AddProductVariant($input: CreateProductVariantInput!) {
    addProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,b=t.gql`
  ${a}
  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
    updateProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,j=t.gql`
  mutation DeleteProductVariant($id: ID!) {
    deleteProductVariant(id: $id)
  }
`;e.s(["ADD_PRODUCT_IMAGE",0,x,"ADD_PRODUCT_VARIANT",0,v,"CREATE_PRODUCT",0,g,"DELETE_PRODUCT",0,f,"DELETE_PRODUCT_IMAGE",0,y,"DELETE_PRODUCT_VARIANT",0,j,"GET_FEATURED_PRODUCTS",0,u,"GET_PRODUCT",0,o,"GET_PRODUCTS",0,l,"GET_PRODUCTS_BY_CATEGORY",0,c,"GET_PRODUCT_BY_SLUG",0,d,"PRODUCT_FULL_FRAGMENT",0,n,"SEARCH_PRODUCTS",0,m,"UPDATE_PRODUCT",0,p,"UPDATE_PRODUCT_STOCK",0,h,"UPDATE_PRODUCT_VARIANT",0,b])},250557,e=>{"use strict";e.s(["formatPrice",0,e=>null==e?"-":new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(Number(e))])},879296,e=>{"use strict";var t=e.i(44990),r=e.i(429105),i=e.i(984804),a=e.i(355422),s=e.i(775680),n=e.i(885205),l=e.i(702470),o=e.i(774309),d=e.i(996517),c=e.i(67087),u=e.i(250557),m=e.i(586754),g=e.i(130775),p=e.i(202774),f=e.i(553579),h=e.i(547982),x=e.i(68645),y=e.i(791174);let v=i.gql`
  ${a.PRODUCT_FULL_FRAGMENT}
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFullFields
    }
  }
`;function b({block:e,isEditable:i=!0,onUpdate:a,onDelete:o}){let b=e.content||{},{productSlug:P,showGallery:C=!0,showDescription:N=!0,showSpecs:_=!0,showReviews:w=!1,showRelated:T=!1,layout:R="default"}=b,E=(0,g.useParams)(),S=E?.slug,A=i?P:P||S,{data:F,loading:I,error:O}=(0,r.useQuery)(v,{variables:{slug:A},skip:i||!A}),$=F?.productBySlug||null;if(i)return(0,t.jsx)("div",{className:"p-6 border-2 border-dashed border-green-300 rounded-lg bg-green-50",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)(p.ShoppingCart,{className:"w-12 h-12 mx-auto mb-3 text-green-500"}),(0,t.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"Product Detail Block"}),A?(0,t.jsxs)("p",{className:"text-sm text-gray-600 mb-4",children:["Hiển thị chi tiết sản phẩm: ",(0,t.jsx)("strong",{children:A})]}):(0,t.jsxs)("div",{className:"mb-4",children:[(0,t.jsx)("p",{className:"text-sm text-orange-600 mb-2",children:"⚠️ Chưa cấu hình product slug"}),(0,t.jsx)("p",{className:"text-xs text-gray-500",children:"Vui lòng chọn block này và nhập product slug trong panel bên phải"})]}),(0,t.jsxs)("div",{className:"flex gap-2 justify-center text-xs text-gray-500",children:[C&&(0,t.jsx)(l.Badge,{variant:"secondary",children:"Gallery"}),N&&(0,t.jsx)(l.Badge,{variant:"secondary",children:"Description"}),_&&(0,t.jsx)(l.Badge,{variant:"secondary",children:"Specs"}),w&&(0,t.jsx)(l.Badge,{variant:"secondary",children:"Reviews"})]})]})});if(O)return(0,t.jsx)("div",{className:"container mx-auto py-8",children:(0,t.jsx)(s.Card,{className:"border-red-200 bg-red-50",children:(0,t.jsx)(s.CardContent,{className:"pt-6",children:(0,t.jsxs)("p",{className:"text-red-600 text-center",children:["Lỗi tải sản phẩm: ",O.message]})})})});if(I)return(0,t.jsx)(j,{});if(!$)return(0,t.jsx)("div",{className:"container mx-auto py-8",children:(0,t.jsx)(s.Card,{children:(0,t.jsx)(s.CardContent,{className:"pt-6",children:(0,t.jsxs)("p",{className:"text-gray-600 text-center",children:["Không tìm thấy sản phẩm ",A&&`"${A}"`]})})})});let D=$.discountPercentage||0,M=$.stock>0;return(0,t.jsxs)("div",{className:"container mx-auto py-8",style:b.style,children:[(0,t.jsxs)("div",{className:"grid md:grid-cols-2 gap-8",children:[C&&(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"relative aspect-square rounded-lg overflow-hidden bg-gray-100",children:[$.thumbnail?(0,t.jsx)(m.default,{src:$.thumbnail,alt:$.name,fill:!0,className:"object-cover",priority:!0}):(0,t.jsx)("div",{className:"w-full h-full flex items-center justify-center text-gray-400",children:"No Image"}),(0,t.jsxs)("div",{className:"absolute top-4 left-4 flex flex-col gap-2",children:[$.isNewArrival&&(0,t.jsx)(l.Badge,{className:"bg-green-500",children:"Hàng mới"}),$.isFeatured&&(0,t.jsx)(l.Badge,{className:"bg-blue-500",children:"Nổi bật"}),D>0&&(0,t.jsxs)(l.Badge,{className:"bg-red-500 text-lg",children:["-",D,"%"]})]})]}),$.images&&$.images.length>0&&(0,t.jsx)("div",{className:"grid grid-cols-4 gap-2",children:$.images.map((e,r)=>(0,t.jsx)("div",{className:"relative aspect-square rounded overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 ring-primary",children:(0,t.jsx)(m.default,{src:e.url,alt:e.alt||"",fill:!0,className:"object-cover"})},r))})]}),(0,t.jsxs)("div",{className:"space-y-6",children:[$.category&&(0,t.jsx)("div",{className:"text-sm text-gray-600",children:$.category.name}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold mb-2",children:$.name}),$.shortDesc&&(0,t.jsx)("p",{className:"text-gray-600",children:$.shortDesc})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"flex text-yellow-400",children:[1,2,3,4,5].map(e=>(0,t.jsx)(f.Star,{className:"w-5 h-5 fill-current"},e))}),(0,t.jsx)("span",{className:"text-sm text-gray-600",children:"(0 đánh giá)"})]}),(0,t.jsx)(c.Separator,{}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-baseline gap-3",children:[(0,t.jsx)("span",{className:"text-4xl font-bold text-primary",children:(0,u.formatPrice)($.price)}),$.originalPrice&&$.originalPrice>$.price&&(0,t.jsx)("span",{className:"text-xl text-gray-400 line-through",children:(0,u.formatPrice)($.originalPrice)})]}),D>0&&(0,t.jsxs)("p",{className:"text-sm text-green-600",children:["Bạn tiết kiệm được ",(0,u.formatPrice)($.originalPrice-$.price)]})]}),(0,t.jsx)("div",{children:M?(0,t.jsxs)(l.Badge,{variant:"outline",className:"text-green-600 border-green-600",children:["Còn hàng (",$.stock," ",$.unit,")"]}):(0,t.jsx)(l.Badge,{variant:"outline",className:"text-red-600 border-red-600",children:"Hết hàng"})}),(0,t.jsx)(c.Separator,{}),$.variants&&$.variants.length>0&&(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("p",{className:"font-semibold",children:"Chọn loại:"}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:$.variants.map((e,r)=>(0,t.jsxs)(n.Button,{variant:0===r?"default":"outline",size:"sm",children:[e.name," - ",(0,u.formatPrice)(e.price)]},e.id))})]}),(0,t.jsxs)("div",{className:"flex gap-3",children:[(0,t.jsxs)(n.Button,{size:"lg",className:"flex-1",disabled:!M,children:[(0,t.jsx)(p.ShoppingCart,{className:"w-5 h-5 mr-2"}),"Thêm vào giỏ hàng"]}),(0,t.jsx)(n.Button,{size:"lg",variant:"outline",children:"Mua ngay"})]}),(0,t.jsxs)("div",{className:"space-y-3 pt-4",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,t.jsx)(h.Truck,{className:"w-5 h-5 text-gray-400"}),(0,t.jsx)("span",{children:"Giao hàng miễn phí cho đơn từ 200.000đ"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,t.jsx)(x.Shield,{className:"w-5 h-5 text-gray-400"}),(0,t.jsx)("span",{children:"Đảm bảo chất lượng sản phẩm"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,t.jsx)(y.RefreshCw,{className:"w-5 h-5 text-gray-400"}),(0,t.jsx)("span",{children:"Đổi trả trong 7 ngày"})]})]})]})]}),(N||_)&&(0,t.jsx)("div",{className:"mt-12",children:(0,t.jsxs)(d.Tabs,{defaultValue:"description",children:[(0,t.jsxs)(d.TabsList,{children:[N&&(0,t.jsx)(d.TabsTrigger,{value:"description",children:"Mô tả"}),_&&(0,t.jsx)(d.TabsTrigger,{value:"specs",children:"Thông số"}),w&&(0,t.jsx)(d.TabsTrigger,{value:"reviews",children:"Đánh giá"})]}),N&&(0,t.jsxs)(d.TabsContent,{value:"description",className:"prose max-w-none",children:[(0,t.jsx)("div",{dangerouslySetInnerHTML:{__html:$.description||"Chưa có mô tả"}}),$.origin&&(0,t.jsx)("div",{className:"mt-4 p-4 bg-gray-50 rounded",children:(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"Xuất xứ:"})," ",$.origin]})})]}),_&&(0,t.jsx)(d.TabsContent,{value:"specs",className:"space-y-2",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"SKU"}),(0,t.jsx)("p",{className:"font-semibold",children:$.sku})]}),(0,t.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Đơn vị"}),(0,t.jsx)("p",{className:"font-semibold",children:$.unit})]}),$.weight&&(0,t.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Trọng lượng"}),(0,t.jsxs)("p",{className:"font-semibold",children:[$.weight," kg"]})]}),$.origin&&(0,t.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Xuất xứ"}),(0,t.jsx)("p",{className:"font-semibold",children:$.origin})]})]})}),w&&(0,t.jsx)(d.TabsContent,{value:"reviews",children:(0,t.jsx)("p",{className:"text-gray-600 text-center py-8",children:"Chưa có đánh giá nào cho sản phẩm này"})})]})})]})}function j(){return(0,t.jsx)("div",{className:"container mx-auto py-8",children:(0,t.jsxs)("div",{className:"grid md:grid-cols-2 gap-8",children:[(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(o.Skeleton,{className:"aspect-square rounded-lg"}),(0,t.jsx)("div",{className:"grid grid-cols-4 gap-2",children:[1,2,3,4].map(e=>(0,t.jsx)(o.Skeleton,{className:"aspect-square rounded"},e))})]}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(o.Skeleton,{className:"h-8 w-32"}),(0,t.jsx)(o.Skeleton,{className:"h-10 w-full"}),(0,t.jsx)(o.Skeleton,{className:"h-6 w-3/4"}),(0,t.jsx)(o.Skeleton,{className:"h-12 w-40"}),(0,t.jsx)(o.Skeleton,{className:"h-10 w-full"}),(0,t.jsx)(o.Skeleton,{className:"h-10 w-full"})]})]})})}e.s(["ProductDetailBlock",()=>b])}]);