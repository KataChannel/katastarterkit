(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,994315,e=>{"use strict";let t=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>t])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},591353,e=>{"use strict";let t=(0,e.i(930702).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["default",()=>t])},404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},759727,258392,e=>{"use strict";let t=(0,e.i(930702).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);e.s(["default",()=>t],258392),e.s(["TrendingUp",()=>t],759727)},381299,e=>{"use strict";let t=(0,e.i(930702).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);e.s(["default",()=>t])},965120,e=>{"use strict";var t=e.i(381299);e.s(["Edit",()=>t.default])},336613,e=>{"use strict";let t=(0,e.i(930702).default)("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);e.s(["default",()=>t])},649248,e=>{"use strict";var t=e.i(336613);e.s(["DollarSign",()=>t.default])},49316,(e,t,r)=>{"use strict";function s({widthInt:e,heightInt:t,blurWidth:r,blurHeight:s,blurDataURL:i,objectFit:a}){let l=r?40*r:e,n=s?40*s:t,o=l&&n?`viewBox='0 0 ${l} ${n}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${o}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${o?"none":"contain"===a?"xMidYMid":"cover"===a?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${i}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return s}})},596974,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s={VALID_LOADERS:function(){return a},imageConfigDefault:function(){return l}};for(var i in s)Object.defineProperty(r,i,{enumerable:!0,get:s[i]});let a=["default","imgix","cloudinary","akamai","custom"],l={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},473733,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return o}}),e.r(715200);let s=e.r(49316),i=e.r(596974),a=["-moz-initial","fill","none","scale-down",void 0];function l(e){return void 0!==e.default}function n(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function o({src:e,sizes:t,unoptimized:r=!1,priority:o=!1,preload:d=!1,loading:u,className:c,quality:m,width:h,height:p,fill:g=!1,style:f,overrideSrc:x,onLoad:y,onLoadingComplete:b,placeholder:v="empty",blurDataURL:j,fetchPriority:w,decoding:N="async",layout:C,objectFit:_,objectPosition:E,lazyBoundary:S,lazyRoot:P,...I},$){var M;let k,O,R,{imgConf:D,showAltText:T,blurComplete:q,defaultLoader:z}=$,A=D||i.imageConfigDefault;if("allSizes"in A)k=A;else{let e=[...A.deviceSizes,...A.imageSizes].sort((e,t)=>e-t),t=A.deviceSizes.sort((e,t)=>e-t),r=A.qualities?.sort((e,t)=>e-t);k={...A,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===z)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let L=I.loader||z;delete I.loader,delete I.srcSet;let U="__next_img_default"in L;if(U){if("custom"===k.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=L;L=t=>{let{config:r,...s}=t;return e(s)}}if(C){"fill"===C&&(g=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[C];e&&(f={...f,...e});let r={responsive:"100vw",fill:"100vw"}[C];r&&!t&&(t=r)}let B="",G=n(h),F=n(p);if((M=e)&&"object"==typeof M&&(l(M)||void 0!==M.src)){let t=l(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(O=t.blurWidth,R=t.blurHeight,j=j||t.blurDataURL,B=t.src,!g)if(G||F){if(G&&!F){let e=G/t.width;F=Math.round(t.height*e)}else if(!G&&F){let e=F/t.height;G=Math.round(t.width*e)}}else G=t.width,F=t.height}let H=!o&&!d&&("lazy"===u||void 0===u);(!(e="string"==typeof e?e:B)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,H=!1),k.unoptimized&&(r=!0),U&&!k.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let Q=n(m),W=Object.assign(g?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:_,objectPosition:E}:{},T?{}:{color:"transparent"},f),X=q||"empty"===v?null:"blur"===v?`url("data:image/svg+xml;charset=utf-8,${(0,s.getImageBlurSvg)({widthInt:G,heightInt:F,blurWidth:O,blurHeight:R,blurDataURL:j||"",objectFit:W.objectFit})}")`:`url("${v}")`,V=a.includes(W.objectFit)?"fill"===W.objectFit?"100% 100%":"cover":W.objectFit,Y=X?{backgroundSize:V,backgroundPosition:W.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:X}:{},K=function({config:e,src:t,unoptimized:r,width:s,quality:i,sizes:a,loader:l}){if(r)return{src:t,srcSet:void 0,sizes:void 0};let{widths:n,kind:o}=function({deviceSizes:e,allSizes:t},r,s){if(s){let r=/(^|\s)(1?\d?\d)vw/g,i=[];for(let e;e=r.exec(s);)i.push(parseInt(e[2]));if(i.length){let r=.01*Math.min(...i);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,s,a),d=n.length-1;return{sizes:a||"w"!==o?a:"100vw",srcSet:n.map((r,s)=>`${l({config:e,src:t,quality:i,width:r})} ${"w"===o?r:s+1}${o}`).join(", "),src:l({config:e,src:t,quality:i,width:n[d]})}}({config:k,src:e,unoptimized:r,width:G,quality:Q,sizes:t,loader:L}),J=H?"lazy":u;return{props:{...I,loading:J,fetchPriority:w,width:G,height:F,decoding:N,className:c,style:{...W,...Y},sizes:K.sizes,srcSet:K.srcSet,src:x||K.src},meta:{unoptimized:r,preload:d||o,placeholder:v,fill:g}}}},805690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n}});let s=e.r(403055),i="undefined"==typeof window,a=i?()=>{}:s.useLayoutEffect,l=i?()=>{}:s.useEffect;function n(e){let{headManager:t,reduceComponentsToState:r}=e;function n(){if(t&&t.mountedInstances){let e=s.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return i&&(t?.mountedInstances?.add(e.children),n()),a(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),a(()=>(t&&(t._pendingUpdate=n),()=>{t&&(t._pendingUpdate=n)})),l(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},308112,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s={default:function(){return g},defaultHead:function(){return c}};for(var i in s)Object.defineProperty(r,i,{enumerable:!0,get:s[i]});let a=e.r(940192),l=e.r(475244),n=e.r(44990),o=l._(e.r(403055)),d=a._(e.r(805690)),u=e.r(525989);function c(){return[(0,n.jsx)("meta",{charSet:"utf-8"},"charset"),(0,n.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function m(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===o.default.Fragment?e.concat(o.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(715200);let h=["name","httpEquiv","charSet","itemProp"];function p(e){let t,r,s,i;return e.reduce(m,[]).reverse().concat(c().reverse()).filter((t=new Set,r=new Set,s=new Set,i={},e=>{let a=!0,l=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){l=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?a=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?a=!1:r.add(e.type);break;case"meta":for(let t=0,r=h.length;t<r;t++){let r=h[t];if(e.props.hasOwnProperty(r))if("charSet"===r)s.has(r)?a=!1:s.add(r);else{let t=e.props[r],s=i[r]||new Set;("name"!==r||!l)&&s.has(t)?a=!1:(s.add(t),i[r]=s)}}}return a})).reverse().map((e,t)=>{let r=e.key||t;return o.default.cloneElement(e,{key:r})})}let g=function({children:e}){let t=(0,o.useContext)(u.HeadManagerContext);return(0,n.jsx)(d.default,{reduceComponentsToState:p,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},238369,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return a}});let s=e.r(940192)._(e.r(403055)),i=e.r(596974),a=s.default.createContext(i.imageConfigDefault)},420539,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return s}});let s=e.r(940192)._(e.r(403055)).default.createContext(null)},659556,(e,t,r)=>{"use strict";function s(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,0):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return s}})},103342,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return a}});let s=e.r(659556);function i({config:e,src:t,width:r,quality:i}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let a=(0,s.findClosestQuality)(i,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${a}${t.startsWith("/_next/static/media/"),""}`}i.__next_img_default=!0;let a=i},894595,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return v}});let s=e.r(940192),i=e.r(475244),a=e.r(44990),l=i._(e.r(403055)),n=s._(e.r(940392)),o=s._(e.r(308112)),d=e.r(473733),u=e.r(596974),c=e.r(238369);e.r(715200);let m=e.r(420539),h=s._(e.r(103342)),p=e.r(527304),g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function f(e,t,r,s,i,a,l){let n=e?.src;e&&e["data-loaded-src"]!==n&&(e["data-loaded-src"]=n,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&i(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let s=!1,i=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>s,isPropagationStopped:()=>i,persist:()=>{},preventDefault:()=>{s=!0,t.preventDefault()},stopPropagation:()=>{i=!0,t.stopPropagation()}})}s?.current&&s.current(e)}}))}function x(e){return l.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let y=(0,l.forwardRef)(({src:e,srcSet:t,sizes:r,height:s,width:i,decoding:n,className:o,style:d,fetchPriority:u,placeholder:c,loading:m,unoptimized:h,fill:g,onLoadRef:y,onLoadingCompleteRef:b,setBlurComplete:v,setShowAltText:j,sizesInput:w,onLoad:N,onError:C,..._},E)=>{let S=(0,l.useCallback)(e=>{e&&(C&&(e.src=e.src),e.complete&&f(e,c,y,b,v,h,w))},[e,c,y,b,v,C,h,w]),P=(0,p.useMergedRef)(E,S);return(0,a.jsx)("img",{..._,...x(u),loading:m,width:i,height:s,decoding:n,"data-nimg":g?"fill":"1",className:o,style:d,sizes:r,srcSet:t,src:e,ref:P,onLoad:e=>{f(e.currentTarget,c,y,b,v,h,w)},onError:e=>{j(!0),"empty"!==c&&v(!0),C&&C(e)}})});function b({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&n.default.preload?(n.default.preload(t.src,r),null):(0,a.jsx)(o.default,{children:(0,a.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let v=(0,l.forwardRef)((e,t)=>{let r=(0,l.useContext)(m.RouterContext),s=(0,l.useContext)(c.ImageConfigContext),i=(0,l.useMemo)(()=>{let e=g||s||u.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),i=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:i,localPatterns:"undefined"==typeof window?s?.localPatterns:e.localPatterns}},[s]),{onLoad:n,onLoadingComplete:o}=e,p=(0,l.useRef)(n);(0,l.useEffect)(()=>{p.current=n},[n]);let f=(0,l.useRef)(o);(0,l.useEffect)(()=>{f.current=o},[o]);let[x,v]=(0,l.useState)(!1),[j,w]=(0,l.useState)(!1),{props:N,meta:C}=(0,d.getImgProps)(e,{defaultLoader:h.default,imgConf:i,blurComplete:x,showAltText:j});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(y,{...N,unoptimized:C.unoptimized,placeholder:C.placeholder,fill:C.fill,onLoadRef:p,onLoadingCompleteRef:f,setBlurComplete:v,setShowAltText:w,sizesInput:e.sizes,ref:t}),C.preload?(0,a.jsx)(b,{isAppRouter:!r,imgAttributes:N}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},211684,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s={default:function(){return u},getImageProps:function(){return d}};for(var i in s)Object.defineProperty(r,i,{enumerable:!0,get:s[i]});let a=e.r(940192),l=e.r(473733),n=e.r(894595),o=a._(e.r(103342));function d(e){let{props:t}=(0,l.getImgProps)(e,{defaultLoader:o.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let u=n.Image},586754,(e,t,r)=>{t.exports=e.r(211684)},133523,e=>{"use strict";let t=(0,e.i(930702).default)("list",[["path",{d:"M3 5h.01",key:"18ugdj"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 19h.01",key:"noohij"}],["path",{d:"M8 5h13",key:"1pao27"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 19h13",key:"m83p4d"}]]);e.s(["default",()=>t])},711798,e=>{"use strict";var t=e.i(133523);e.s(["List",()=>t.default])},909181,e=>{"use strict";let t=(0,e.i(930702).default)("archive",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]]);e.s(["default",()=>t])},742049,e=>{"use strict";var t=e.i(909181);e.s(["Archive",()=>t.default])},492055,e=>{"use strict";var t=e.i(984804);let r=t.gql`
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
`,i=t.gql`
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
`,l=t.gql`
  query GetMyCourses {
    myCourses {
      ...CourseBasic
      categoryId
    }
  }
  ${r}
`,n=t.gql`
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
`,u=t.gql`
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
`,e.s(["CREATE_COURSE",0,d,"GET_COURSES",0,i,"GET_COURSE_BY_SLUG",0,a,"GET_COURSE_CATEGORIES",0,o,"GET_ENROLLMENT",0,n,"GET_MY_COURSES",0,l,"UPDATE_COURSE",0,u])},816366,e=>{"use strict";let t=(0,e.i(930702).default)("circle-play",[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},224949,e=>{"use strict";var t=e.i(816366);e.s(["PlayCircle",()=>t.default])},505722,e=>{"use strict";let t=(0,e.i(930702).default)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["default",()=>t])},317044,e=>{"use strict";var t=e.i(505722);e.s(["HelpCircle",()=>t.default])},619799,e=>{"use strict";var t=e.i(44990),r=e.i(403055),s=e.i(429105),i=e.i(123959),a=e.i(130775),l=e.i(492055),n=e.i(579448),o=e.i(586754),d=e.i(608631),u=e.i(771564),c=e.i(649248),m=e.i(759727),h=e.i(965120),p=e.i(404210),g=e.i(742049),f=e.i(606443),x=e.i(738543),y=e.i(711798),b=e.i(224949),v=e.i(317044);function j(){let{user:e,loading:j}=(0,i.useAuth)(),w=(0,a.useRouter)();(0,r.useEffect)(()=>{j||e||w.push("/login?redirect=/lms/instructor/dashboard")},[e,j,w]);let{data:N,loading:C,error:_}=(0,s.useQuery)(l.GET_MY_COURSES,{skip:!e});if(j)return(0,t.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Đang kiểm tra đăng nhập..."})]})});if(!e)return null;if(C)return(0,t.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Đang tải khóa học của bạn..."})]})});if(_)return(0,t.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Truy cập bị từ chối"}),(0,t.jsx)("p",{className:"text-gray-600 mb-4",children:"Bạn cần vai trò ADMIN để truy cập trang này"}),(0,t.jsx)(n.default,{href:"/lms/courses",className:"inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:"Duyệt khóa học"})]})});let E=N?.myCourses||[],S={totalCourses:E.length,publishedCourses:E.filter(e=>"PUBLISHED"===e.status).length,totalStudents:E.reduce((e,t)=>e+t.enrollmentCount,0),totalRevenue:E.reduce((e,t)=>e+t.price*t.enrollmentCount,0)};return(0,t.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,t.jsx)("div",{className:"bg-white border-b",children:(0,t.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"Bảng điều khiển giảng viên"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Quản lý khóa học và theo dõi hiệu suất"})]}),(0,t.jsxs)(n.default,{href:"/lms/instructor/courses/create",className:"flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:[(0,t.jsx)(f.Plus,{className:"w-5 h-5"}),"Tạo khóa học"]})]})})}),(0,t.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",children:[(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,t.jsx)("div",{className:"p-3 bg-blue-100 rounded-lg",children:(0,t.jsx)(d.BookOpen,{className:"w-6 h-6 text-blue-600"})}),(0,t.jsx)(m.TrendingUp,{className:"w-5 h-5 text-green-500"})]}),(0,t.jsx)("h3",{className:"text-2xl font-bold text-gray-900 mb-1",children:S.totalCourses}),(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Tổng số khóa học"}),(0,t.jsxs)("p",{className:"text-xs text-green-600 mt-2",children:[S.publishedCourses," đã xuất bản"]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,t.jsx)("div",{className:"p-3 bg-green-100 rounded-lg",children:(0,t.jsx)(u.Users,{className:"w-6 h-6 text-green-600"})}),(0,t.jsx)(x.BarChart3,{className:"w-5 h-5 text-blue-500"})]}),(0,t.jsx)("h3",{className:"text-2xl font-bold text-gray-900 mb-1",children:S.totalStudents}),(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Tổng số học viên"}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mt-2",children:"Trên tất cả khóa học"})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,t.jsx)("div",{className:"p-3 bg-yellow-100 rounded-lg",children:(0,t.jsx)(c.DollarSign,{className:"w-6 h-6 text-yellow-600"})}),(0,t.jsx)(m.TrendingUp,{className:"w-5 h-5 text-green-500"})]}),(0,t.jsxs)("h3",{className:"text-2xl font-bold text-gray-900 mb-1",children:["$",S.totalRevenue.toFixed(2)]}),(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Tổng doanh thu"}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mt-2",children:"Thu nhập toàn thời gian"})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,t.jsx)("div",{className:"flex items-center justify-between mb-4",children:(0,t.jsx)("div",{className:"p-3 bg-purple-100 rounded-lg",children:(0,t.jsx)(x.BarChart3,{className:"w-6 h-6 text-purple-600"})})}),(0,t.jsx)("h3",{className:"text-2xl font-bold text-gray-900 mb-1",children:S.totalStudents>0?(S.totalRevenue/S.totalStudents).toFixed(2):"0.00"}),(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"TB. Doanh thu/Học viên"}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mt-2",children:"Mỗi lần ghi danh"})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-100",children:[(0,t.jsx)("div",{className:"px-6 py-4 border-b border-gray-100",children:(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:"Khóa học của tôi"})}),0===E.length?(0,t.jsxs)("div",{className:"text-center py-16",children:[(0,t.jsx)(d.BookOpen,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Chưa có khóa học"}),(0,t.jsx)("p",{className:"text-gray-600 mb-6",children:"Bắt đầu tạo khóa học đầu tiên của bạn"}),(0,t.jsxs)(n.default,{href:"/lms/instructor/courses/create",className:"inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:[(0,t.jsx)(f.Plus,{className:"w-5 h-5"}),"Tạo khóa học"]})]}):(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"w-full",children:[(0,t.jsx)("thead",{className:"bg-gray-50",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Khóa học"}),(0,t.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Trạng thái"}),(0,t.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Học viên"}),(0,t.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Doanh thu"}),(0,t.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Đánh giá"}),(0,t.jsx)("th",{className:"px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Hành động"})]})}),(0,t.jsx)("tbody",{className:"bg-white divide-y divide-gray-200",children:E.map(e=>(0,t.jsxs)("tr",{className:"hover:bg-gray-50",children:[(0,t.jsx)("td",{className:"px-6 py-4",children:(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[e.thumbnail?(0,t.jsx)(o.default,{src:e.thumbnail,alt:e.title,width:64,height:48,className:"rounded object-cover"}):(0,t.jsx)("div",{className:"w-16 h-12 bg-gray-200 rounded flex items-center justify-center",children:(0,t.jsx)(d.BookOpen,{className:"w-6 h-6 text-gray-400"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium text-gray-900",children:e.title}),(0,t.jsx)("p",{className:"text-sm text-gray-500",children:e.level})]})]})}),(0,t.jsx)("td",{className:"px-6 py-4",children:(0,t.jsx)("span",{className:`px-2 py-1 text-xs font-medium rounded-full ${"PUBLISHED"===e.status?"bg-green-100 text-green-800":"DRAFT"===e.status?"bg-yellow-100 text-yellow-800":"bg-gray-100 text-gray-800"}`,children:"PUBLISHED"===e.status?"Đã xuất bản":"DRAFT"===e.status?"Bản nháp":e.status})}),(0,t.jsx)("td",{className:"px-6 py-4 text-sm text-gray-900",children:e.enrollmentCount}),(0,t.jsxs)("td",{className:"px-6 py-4 text-sm text-gray-900",children:["$",(e.price*e.enrollmentCount).toFixed(2)]}),(0,t.jsxs)("td",{className:"px-6 py-4 text-sm text-gray-900",children:["⭐ ",e.avgRating.toFixed(1)," (",e.reviewCount,")"]}),(0,t.jsx)("td",{className:"px-6 py-4 text-right text-sm font-medium",children:(0,t.jsxs)("div",{className:"flex items-center justify-end gap-2",children:[(0,t.jsx)(n.default,{href:`/lms/courses/${e.slug}`,className:"text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors",title:"Xem",children:(0,t.jsx)(p.Eye,{className:"w-4 h-4"})}),(0,t.jsx)(n.default,{href:`/lms/instructor/courses/${e.id}/manage`,className:"text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded transition-colors",title:"Quản lý Module",children:(0,t.jsx)(y.List,{className:"w-4 h-4"})}),(0,t.jsx)(n.default,{href:`/lms/instructor/courses/${e.id}/lessons`,className:"text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors",title:"Quản lý Bài học",children:(0,t.jsx)(b.PlayCircle,{className:"w-4 h-4"})}),(0,t.jsx)(n.default,{href:`/lms/instructor/courses/${e.id}/quizzes`,className:"text-amber-600 hover:text-amber-900 p-2 hover:bg-amber-50 rounded transition-colors",title:"Quản lý Quiz",children:(0,t.jsx)(v.HelpCircle,{className:"w-4 h-4"})}),(0,t.jsx)(n.default,{href:`/lms/instructor/courses/${e.id}/edit`,className:"text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition-colors",title:"Sửa",children:(0,t.jsx)(h.Edit,{className:"w-4 h-4"})}),(0,t.jsx)("button",{className:"text-orange-600 hover:text-orange-900 p-2 hover:bg-orange-50 rounded transition-colors",title:"Archive",children:(0,t.jsx)(g.Archive,{className:"w-4 h-4"})})]})})]},e.id))})]})})]})]})]})}e.s(["default",()=>j])}]);