(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,591353,e=>{"use strict";let t=(0,e.i(930702).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["default",()=>t])},404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},638381,e=>{"use strict";let t=(0,e.i(930702).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},782145,e=>{"use strict";let t=(0,e.i(930702).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["default",()=>t])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},49316,(e,t,r)=>{"use strict";function s({widthInt:e,heightInt:t,blurWidth:r,blurHeight:s,blurDataURL:i,objectFit:a}){let l=r?40*r:e,n=s?40*s:t,o=l&&n?`viewBox='0 0 ${l} ${n}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${o}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${o?"none":"contain"===a?"xMidYMid":"cover"===a?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${i}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return s}})},596974,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s={VALID_LOADERS:function(){return a},imageConfigDefault:function(){return l}};for(var i in s)Object.defineProperty(r,i,{enumerable:!0,get:s[i]});let a=["default","imgix","cloudinary","akamai","custom"],l={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},473733,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return o}}),e.r(715200);let s=e.r(49316),i=e.r(596974),a=["-moz-initial","fill","none","scale-down",void 0];function l(e){return void 0!==e.default}function n(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function o({src:e,sizes:t,unoptimized:r=!1,priority:o=!1,preload:d=!1,loading:c,className:u,quality:m,width:g,height:h,fill:f=!1,style:p,overrideSrc:x,onLoad:b,onLoadingComplete:y,placeholder:v="empty",blurDataURL:j,fetchPriority:w,decoding:N="async",layout:_,objectFit:C,objectPosition:k,lazyBoundary:S,lazyRoot:P,...O},E){var I;let $,R,M,{imgConf:z,showAltText:B,blurComplete:D,defaultLoader:A}=E,T=z||i.imageConfigDefault;if("allSizes"in T)$=T;else{let e=[...T.deviceSizes,...T.imageSizes].sort((e,t)=>e-t),t=T.deviceSizes.sort((e,t)=>e-t),r=T.qualities?.sort((e,t)=>e-t);$={...T,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===A)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let U=O.loader||A;delete O.loader,delete O.srcSet;let G="__next_img_default"in U;if(G){if("custom"===$.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=U;U=t=>{let{config:r,...s}=t;return e(s)}}if(_){"fill"===_&&(f=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[_];e&&(p={...p,...e});let r={responsive:"100vw",fill:"100vw"}[_];r&&!t&&(t=r)}let q="",L=n(g),F=n(h);if((I=e)&&"object"==typeof I&&(l(I)||void 0!==I.src)){let t=l(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(R=t.blurWidth,M=t.blurHeight,j=j||t.blurDataURL,q=t.src,!f)if(L||F){if(L&&!F){let e=L/t.width;F=Math.round(t.height*e)}else if(!L&&F){let e=F/t.height;L=Math.round(t.width*e)}}else L=t.width,F=t.height}let H=!o&&!d&&("lazy"===c||void 0===c);(!(e="string"==typeof e?e:q)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,H=!1),$.unoptimized&&(r=!0),G&&!$.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let V=n(m),W=Object.assign(f?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:C,objectPosition:k}:{},B?{}:{color:"transparent"},p),X=D||"empty"===v?null:"blur"===v?`url("data:image/svg+xml;charset=utf-8,${(0,s.getImageBlurSvg)({widthInt:L,heightInt:F,blurWidth:R,blurHeight:M,blurDataURL:j||"",objectFit:W.objectFit})}")`:`url("${v}")`,K=a.includes(W.objectFit)?"fill"===W.objectFit?"100% 100%":"cover":W.objectFit,Q=X?{backgroundSize:K,backgroundPosition:W.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:X}:{},Y=function({config:e,src:t,unoptimized:r,width:s,quality:i,sizes:a,loader:l}){if(r)return{src:t,srcSet:void 0,sizes:void 0};let{widths:n,kind:o}=function({deviceSizes:e,allSizes:t},r,s){if(s){let r=/(^|\s)(1?\d?\d)vw/g,i=[];for(let e;e=r.exec(s);)i.push(parseInt(e[2]));if(i.length){let r=.01*Math.min(...i);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,s,a),d=n.length-1;return{sizes:a||"w"!==o?a:"100vw",srcSet:n.map((r,s)=>`${l({config:e,src:t,quality:i,width:r})} ${"w"===o?r:s+1}${o}`).join(", "),src:l({config:e,src:t,quality:i,width:n[d]})}}({config:$,src:e,unoptimized:r,width:L,quality:V,sizes:t,loader:U}),J=H?"lazy":c;return{props:{...O,loading:J,fetchPriority:w,width:L,height:F,decoding:N,className:u,style:{...W,...Q},sizes:Y.sizes,srcSet:Y.srcSet,src:x||Y.src},meta:{unoptimized:r,preload:d||o,placeholder:v,fill:f}}}},805690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n}});let s=e.r(403055),i="undefined"==typeof window,a=i?()=>{}:s.useLayoutEffect,l=i?()=>{}:s.useEffect;function n(e){let{headManager:t,reduceComponentsToState:r}=e;function n(){if(t&&t.mountedInstances){let e=s.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return i&&(t?.mountedInstances?.add(e.children),n()),a(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),a(()=>(t&&(t._pendingUpdate=n),()=>{t&&(t._pendingUpdate=n)})),l(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},308112,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s={default:function(){return f},defaultHead:function(){return u}};for(var i in s)Object.defineProperty(r,i,{enumerable:!0,get:s[i]});let a=e.r(940192),l=e.r(475244),n=e.r(44990),o=l._(e.r(403055)),d=a._(e.r(805690)),c=e.r(525989);function u(){return[(0,n.jsx)("meta",{charSet:"utf-8"},"charset"),(0,n.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function m(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===o.default.Fragment?e.concat(o.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(715200);let g=["name","httpEquiv","charSet","itemProp"];function h(e){let t,r,s,i;return e.reduce(m,[]).reverse().concat(u().reverse()).filter((t=new Set,r=new Set,s=new Set,i={},e=>{let a=!0,l=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){l=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?a=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?a=!1:r.add(e.type);break;case"meta":for(let t=0,r=g.length;t<r;t++){let r=g[t];if(e.props.hasOwnProperty(r))if("charSet"===r)s.has(r)?a=!1:s.add(r);else{let t=e.props[r],s=i[r]||new Set;("name"!==r||!l)&&s.has(t)?a=!1:(s.add(t),i[r]=s)}}}return a})).reverse().map((e,t)=>{let r=e.key||t;return o.default.cloneElement(e,{key:r})})}let f=function({children:e}){let t=(0,o.useContext)(c.HeadManagerContext);return(0,n.jsx)(d.default,{reduceComponentsToState:h,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},238369,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return a}});let s=e.r(940192)._(e.r(403055)),i=e.r(596974),a=s.default.createContext(i.imageConfigDefault)},420539,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return s}});let s=e.r(940192)._(e.r(403055)).default.createContext(null)},659556,(e,t,r)=>{"use strict";function s(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,0):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return s}})},103342,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return a}});let s=e.r(659556);function i({config:e,src:t,width:r,quality:i}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let a=(0,s.findClosestQuality)(i,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${a}${t.startsWith("/_next/static/media/"),""}`}i.__next_img_default=!0;let a=i},894595,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return v}});let s=e.r(940192),i=e.r(475244),a=e.r(44990),l=i._(e.r(403055)),n=s._(e.r(940392)),o=s._(e.r(308112)),d=e.r(473733),c=e.r(596974),u=e.r(238369);e.r(715200);let m=e.r(420539),g=s._(e.r(103342)),h=e.r(527304),f={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function p(e,t,r,s,i,a,l){let n=e?.src;e&&e["data-loaded-src"]!==n&&(e["data-loaded-src"]=n,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&i(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let s=!1,i=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>s,isPropagationStopped:()=>i,persist:()=>{},preventDefault:()=>{s=!0,t.preventDefault()},stopPropagation:()=>{i=!0,t.stopPropagation()}})}s?.current&&s.current(e)}}))}function x(e){return l.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let b=(0,l.forwardRef)(({src:e,srcSet:t,sizes:r,height:s,width:i,decoding:n,className:o,style:d,fetchPriority:c,placeholder:u,loading:m,unoptimized:g,fill:f,onLoadRef:b,onLoadingCompleteRef:y,setBlurComplete:v,setShowAltText:j,sizesInput:w,onLoad:N,onError:_,...C},k)=>{let S=(0,l.useCallback)(e=>{e&&(_&&(e.src=e.src),e.complete&&p(e,u,b,y,v,g,w))},[e,u,b,y,v,_,g,w]),P=(0,h.useMergedRef)(k,S);return(0,a.jsx)("img",{...C,...x(c),loading:m,width:i,height:s,decoding:n,"data-nimg":f?"fill":"1",className:o,style:d,sizes:r,srcSet:t,src:e,ref:P,onLoad:e=>{p(e.currentTarget,u,b,y,v,g,w)},onError:e=>{j(!0),"empty"!==u&&v(!0),_&&_(e)}})});function y({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&n.default.preload?(n.default.preload(t.src,r),null):(0,a.jsx)(o.default,{children:(0,a.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let v=(0,l.forwardRef)((e,t)=>{let r=(0,l.useContext)(m.RouterContext),s=(0,l.useContext)(u.ImageConfigContext),i=(0,l.useMemo)(()=>{let e=f||s||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),i=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:i,localPatterns:"undefined"==typeof window?s?.localPatterns:e.localPatterns}},[s]),{onLoad:n,onLoadingComplete:o}=e,h=(0,l.useRef)(n);(0,l.useEffect)(()=>{h.current=n},[n]);let p=(0,l.useRef)(o);(0,l.useEffect)(()=>{p.current=o},[o]);let[x,v]=(0,l.useState)(!1),[j,w]=(0,l.useState)(!1),{props:N,meta:_}=(0,d.getImgProps)(e,{defaultLoader:g.default,imgConf:i,blurComplete:x,showAltText:j});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(b,{...N,unoptimized:_.unoptimized,placeholder:_.placeholder,fill:_.fill,onLoadRef:h,onLoadingCompleteRef:p,setBlurComplete:v,setShowAltText:w,sizesInput:e.sizes,ref:t}),_.preload?(0,a.jsx)(y,{isAppRouter:!r,imgAttributes:N}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},211684,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s={default:function(){return c},getImageProps:function(){return d}};for(var i in s)Object.defineProperty(r,i,{enumerable:!0,get:s[i]});let a=e.r(940192),l=e.r(473733),n=e.r(894595),o=a._(e.r(103342));function d(e){let{props:t}=(0,l.getImgProps)(e,{defaultLoader:o.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let c=n.Image},586754,(e,t,r)=>{t.exports=e.r(211684)},933414,e=>{"use strict";let t=(0,e.i(930702).default)("tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);e.s(["default",()=>t])},576884,e=>{"use strict";var t=e.i(933414);e.s(["Tag",()=>t.default])},856584,e=>{"use strict";let t=(0,e.i(930702).default)("facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]);e.s(["default",()=>t])},581329,e=>{"use strict";var t=e.i(856584);e.s(["Facebook",()=>t.default])},595718,e=>{"use strict";let t=(0,e.i(930702).default)("twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]);e.s(["default",()=>t])},561457,e=>{"use strict";let t=(0,e.i(930702).default)("linkedin",[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]]);e.s(["default",()=>t])},568577,e=>{"use strict";var t=e.i(595718);e.s(["Twitter",()=>t.default])},249675,e=>{"use strict";var t=e.i(561457);e.s(["Linkedin",()=>t.default])},137,e=>{"use strict";var t=e.i(984804);let r=t.gql`
  query GetBlogs(
    $page: Int
    $limit: Int
    $search: String
    $categoryId: ID
    $sort: String
  ) {
    blogs(
      page: $page
      limit: $limit
      search: $search
      categoryId: $categoryId
      sort: $sort
    ) {
      items {
        id
        title
        slug
        shortDescription
        excerpt
        author
        thumbnailUrl
        viewCount
        publishedAt
        category {
          id
          name
          slug
        }
        tags {
          id
          name
          slug
        }
        isFeatured
        isPublished
      }
      total
      page
      pageSize
      totalPages
      hasMore
    }
  }
`,s=t.gql`
  query GetBlogBySlug($slug: String!) {
    blogBySlug(slug: $slug) {
      id
      title
      slug
      content
      shortDescription
      excerpt
      author
      thumbnailUrl
      bannerUrl
      viewCount
      publishedAt
      updatedAt
      category {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
      isFeatured
      isPublished
      metaTitle
      metaDescription
      metaKeywords
      createdAt
    }
  }
`;t.gql`
  query GetFeaturedBlogs($limit: Int) {
    featuredBlogs(limit: $limit) {
      id
      title
      slug
      shortDescription
      thumbnailUrl
      author
      publishedAt
      category {
        id
        name
        slug
      }
    }
  }
`,t.gql`
  query GetBlogsByCategory($categoryId: ID!, $limit: Int, $page: Int) {
    blogsByCategory(categoryId: $categoryId, limit: $limit, page: $page) {
      items {
        id
        title
        slug
        shortDescription
        excerpt
        author
        thumbnailUrl
        viewCount
        publishedAt
        category {
          id
          name
          slug
        }
        isFeatured
      }
      total
      page
      pageSize
      totalPages
      hasMore
    }
  }
`,t.gql`
  query GetRelatedBlogs($categoryId: ID!, $excludeBlogId: ID!, $limit: Int) {
    relatedBlogs(categoryId: $categoryId, excludeBlogId: $excludeBlogId, limit: $limit) {
      id
      title
      slug
      shortDescription
      thumbnailUrl
      author
      publishedAt
      viewCount
      category {
        id
        name
        slug
      }
    }
  }
`;let i=t.gql`
  query GetBlogCategories {
    blogCategories {
      id
      name
      slug
      description
      thumbnail
    }
  }
`;e.s(["GET_BLOGS",0,r,"GET_BLOG_BY_SLUG",0,s,"GET_BLOG_CATEGORIES",0,i])},357511,e=>{"use strict";var t=e.i(44990),r=e.i(403055),s=e.i(429105),i=e.i(130775),a=e.i(586754),l=e.i(579448),n=e.i(137),o=e.i(435635),d=e.i(909905),c=e.i(415588),u=e.i(576884),m=e.i(404210),g=e.i(581329),h=e.i(568577),f=e.i(249675),p=e.i(36455),x=e.i(451177);function b(){let e=(0,i.useParams)(),b=(0,i.useRouter)(),y=e?.slug,[v,j]=(0,r.useState)(""),[w,N]=(0,r.useState)(null),{data:_,loading:C,error:k}=(0,s.useQuery)(n.GET_BLOG_BY_SLUG,{variables:{slug:y},skip:!y}),S=_?.getBlogBySlug,P=e=>new Date(e).toLocaleDateString("vi-VN",{year:"numeric",month:"long",day:"numeric"}),O=async e=>{e.preventDefault(),alert("Chức năng bình luận đang được phát triển")},E=e=>{let t=window.location.href,r=S?.title,s="";switch(e){case"facebook":s=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(t)}`;break;case"twitter":s=`https://twitter.com/intent/tweet?url=${encodeURIComponent(t)}&text=${encodeURIComponent(r)}`;break;case"linkedin":s=`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(t)}`}s&&window.open(s,"_blank","width=600,height=400")};return C?(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})}):k||!S?(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Không tìm thấy bài viết"}),(0,t.jsx)("button",{onClick:()=>b.push("/blog"),className:"text-blue-600 hover:underline",children:"← Quay lại danh sách blog"})]})}):(0,t.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[S.featuredImage&&(0,t.jsxs)("div",{className:"relative h-96 bg-gray-900",children:[(0,t.jsx)(a.default,{src:S.featuredImage,alt:S.title,fill:!0,className:"object-cover opacity-70",priority:!0}),(0,t.jsx)("div",{className:"absolute inset-0 flex items-center justify-center",children:(0,t.jsxs)("div",{className:"max-w-4xl mx-auto px-4 text-center",children:[S.category&&(0,t.jsx)("span",{className:"inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-4",children:S.category.name}),(0,t.jsx)("h1",{className:"text-4xl md:text-5xl font-bold text-white mb-4",children:S.title}),(0,t.jsxs)("div",{className:"flex items-center justify-center gap-6 text-white/90 text-sm",children:[(0,t.jsxs)("span",{className:"flex items-center gap-2",children:[(0,t.jsx)(o.Calendar,{className:"h-4 w-4"}),P(S.publishedAt||S.createdAt)]}),(0,t.jsxs)("span",{className:"flex items-center gap-2",children:[(0,t.jsx)(d.User,{className:"h-4 w-4"}),S.author?.fullName||S.author?.email||"Admin"]}),(0,t.jsxs)("span",{className:"flex items-center gap-2",children:[(0,t.jsx)(c.Clock,{className:"h-4 w-4"}),S.readingTime," phút đọc"]}),(0,t.jsxs)("span",{className:"flex items-center gap-2",children:[(0,t.jsx)(m.Eye,{className:"h-4 w-4"}),S.viewCount," lượt xem"]})]})]})})]}),(0,t.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[(0,t.jsxs)("article",{className:"lg:col-span-2",children:[(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-8",children:[S.shortDescription&&(0,t.jsx)("div",{className:"text-xl text-gray-700 italic mb-6 pb-6 border-b",children:S.shortDescription}),(0,t.jsx)("div",{className:"prose prose-lg max-w-none mb-8",dangerouslySetInnerHTML:{__html:S.content}}),S.tags&&S.tags.length>0&&(0,t.jsxs)("div",{className:"flex flex-wrap gap-2 mb-6 pb-6 border-t pt-6",children:[(0,t.jsx)(u.Tag,{className:"h-5 w-5 text-gray-400"}),S.tags.map(e=>(0,t.jsxs)(l.default,{href:`/blog?tag=${e.slug}`,className:"px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition text-sm",children:["#",e.name]},e.id))]}),(0,t.jsxs)("div",{className:"flex items-center gap-4 pb-6 border-b",children:[(0,t.jsx)("span",{className:"font-medium text-gray-700",children:"Chia sẻ:"}),(0,t.jsx)("button",{onClick:()=>E("facebook"),className:"p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition",title:"Chia sẻ lên Facebook",children:(0,t.jsx)(g.Facebook,{className:"h-5 w-5"})}),(0,t.jsx)("button",{onClick:()=>E("twitter"),className:"p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition",title:"Chia sẻ lên Twitter",children:(0,t.jsx)(h.Twitter,{className:"h-5 w-5"})}),(0,t.jsx)("button",{onClick:()=>E("linkedin"),className:"p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition",title:"Chia sẻ lên LinkedIn",children:(0,t.jsx)(f.Linkedin,{className:"h-5 w-5"})})]}),S.author&&(0,t.jsxs)("div",{className:"mt-8 p-6 bg-gray-50 rounded-lg",children:[(0,t.jsx)("h3",{className:"font-bold text-gray-900 mb-2",children:"Về tác giả"}),(0,t.jsxs)("div",{className:"flex items-start gap-4",children:[(0,t.jsx)("div",{className:"w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center",children:(0,t.jsx)(d.User,{className:"h-8 w-8 text-gray-500"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium text-gray-900",children:S.author.fullName||S.author.email}),(0,t.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:"Biên tập viên tại Kata Shop"})]})]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-8 mt-8",children:[(0,t.jsxs)("h2",{className:"text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2",children:[(0,t.jsx)(p.MessageCircle,{className:"h-6 w-6"}),"Bình luận (",S.comments?.length||0,")"]}),(0,t.jsxs)("form",{onSubmit:O,className:"mb-8",children:[(0,t.jsx)("textarea",{value:v,onChange:e=>j(e.target.value),placeholder:"Viết bình luận của bạn...",rows:4,className:"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"}),(0,t.jsxs)("div",{className:"flex justify-between items-center mt-3",children:[w&&(0,t.jsx)("button",{type:"button",onClick:()=>N(null),className:"text-sm text-gray-600 hover:text-gray-900",children:"Hủy trả lời"}),(0,t.jsxs)("button",{type:"submit",disabled:!v.trim(),className:"ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition",children:[(0,t.jsx)(x.Send,{className:"h-4 w-4"}),"Gửi bình luận"]})]})]}),(0,t.jsx)("div",{className:"space-y-6",children:S.comments?.map(e=>(0,t.jsx)("div",{className:"border-b pb-6 last:border-0",children:(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)("div",{className:"w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0",children:(0,t.jsx)(d.User,{className:"h-5 w-5 text-gray-500"})}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,t.jsx)("span",{className:"font-medium text-gray-900",children:e.user?.fullName||e.authorName||"Ẩn danh"}),(0,t.jsx)("span",{className:"text-sm text-gray-500",children:P(e.createdAt)})]}),(0,t.jsx)("p",{className:"text-gray-700 mb-2",children:e.content}),(0,t.jsx)("button",{onClick:()=>N(e.id),className:"text-sm text-blue-600 hover:text-blue-700",children:"Trả lời"}),e.replies&&e.replies.length>0&&(0,t.jsx)("div",{className:"mt-4 ml-8 space-y-4",children:e.replies.map(e=>(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)("div",{className:"w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0",children:(0,t.jsx)(d.User,{className:"h-4 w-4 text-gray-500"})}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,t.jsx)("span",{className:"font-medium text-gray-900 text-sm",children:e.user?.fullName||e.authorName||"Ẩn danh"}),(0,t.jsx)("span",{className:"text-xs text-gray-500",children:P(e.createdAt)})]}),(0,t.jsx)("p",{className:"text-gray-700 text-sm",children:e.content})]})]},e.id))})]})]})},e.id))}),(!S.comments||0===S.comments.length)&&(0,t.jsx)("p",{className:"text-center text-gray-500 py-8",children:"Chưa có bình luận nào. Hãy là người đầu tiên bình luận!"})]})]}),(0,t.jsx)("aside",{className:"lg:col-span-1",children:(0,t.jsx)("div",{className:"bg-white rounded-lg shadow-sm p-6 sticky top-4",children:(0,t.jsxs)("div",{className:"p-4 bg-blue-50 rounded-lg",children:[(0,t.jsx)("h3",{className:"font-bold text-gray-900 mb-2",children:"Đăng ký nhận tin"}),(0,t.jsx)("p",{className:"text-sm text-gray-600 mb-3",children:"Nhận bài viết mới nhất qua email"}),(0,t.jsx)("input",{type:"email",placeholder:"Email của bạn",className:"w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm"}),(0,t.jsx)("button",{className:"w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium",children:"Đăng ký"})]})})})]})})]})}e.s(["default",()=>b])}]);