(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,759727,258392,e=>{"use strict";let t=(0,e.i(930702).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);e.s(["default",()=>t],258392),e.s(["TrendingUp",()=>t],759727)},638381,e=>{"use strict";let t=(0,e.i(930702).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},782145,e=>{"use strict";let t=(0,e.i(930702).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["default",()=>t])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},49316,(e,t,r)=>{"use strict";function i({widthInt:e,heightInt:t,blurWidth:r,blurHeight:i,blurDataURL:a,objectFit:s}){let l=r?40*r:e,n=i?40*i:t,o=l&&n?`viewBox='0 0 ${l} ${n}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${o}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${o?"none":"contain"===s?"xMidYMid":"cover"===s?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${a}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return i}})},596974,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={VALID_LOADERS:function(){return s},imageConfigDefault:function(){return l}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=["default","imgix","cloudinary","akamai","custom"],l={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},473733,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return o}}),e.r(715200);let i=e.r(49316),a=e.r(596974),s=["-moz-initial","fill","none","scale-down",void 0];function l(e){return void 0!==e.default}function n(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function o({src:e,sizes:t,unoptimized:r=!1,priority:o=!1,preload:d=!1,loading:c,className:u,quality:g,width:m,height:p,fill:f=!1,style:h,overrideSrc:x,onLoad:y,onLoadingComplete:b,placeholder:v="empty",blurDataURL:j,fetchPriority:w,decoding:_="async",layout:C,objectFit:N,objectPosition:S,lazyBoundary:P,lazyRoot:O,...E},I){var $;let R,M,k,{imgConf:T,showAltText:B,blurComplete:D,defaultLoader:z}=I,A=T||a.imageConfigDefault;if("allSizes"in A)R=A;else{let e=[...A.deviceSizes,...A.imageSizes].sort((e,t)=>e-t),t=A.deviceSizes.sort((e,t)=>e-t),r=A.qualities?.sort((e,t)=>e-t);R={...A,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===z)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let G=E.loader||z;delete E.loader,delete E.srcSet;let q="__next_img_default"in G;if(q){if("custom"===R.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=G;G=t=>{let{config:r,...i}=t;return e(i)}}if(C){"fill"===C&&(f=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[C];e&&(h={...h,...e});let r={responsive:"100vw",fill:"100vw"}[C];r&&!t&&(t=r)}let U="",L=n(m),F=n(p);if(($=e)&&"object"==typeof $&&(l($)||void 0!==$.src)){let t=l(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(M=t.blurWidth,k=t.blurHeight,j=j||t.blurDataURL,U=t.src,!f)if(L||F){if(L&&!F){let e=L/t.width;F=Math.round(t.height*e)}else if(!L&&F){let e=F/t.height;L=Math.round(t.width*e)}}else L=t.width,F=t.height}let W=!o&&!d&&("lazy"===c||void 0===c);(!(e="string"==typeof e?e:U)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,W=!1),R.unoptimized&&(r=!0),q&&!R.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let K=n(g),V=Object.assign(f?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:N,objectPosition:S}:{},B?{}:{color:"transparent"},h),X=D||"empty"===v?null:"blur"===v?`url("data:image/svg+xml;charset=utf-8,${(0,i.getImageBlurSvg)({widthInt:L,heightInt:F,blurWidth:M,blurHeight:k,blurDataURL:j||"",objectFit:V.objectFit})}")`:`url("${v}")`,H=s.includes(V.objectFit)?"fill"===V.objectFit?"100% 100%":"cover":V.objectFit,Q=X?{backgroundSize:H,backgroundPosition:V.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:X}:{},Y=function({config:e,src:t,unoptimized:r,width:i,quality:a,sizes:s,loader:l}){if(r)return{src:t,srcSet:void 0,sizes:void 0};let{widths:n,kind:o}=function({deviceSizes:e,allSizes:t},r,i){if(i){let r=/(^|\s)(1?\d?\d)vw/g,a=[];for(let e;e=r.exec(i);)a.push(parseInt(e[2]));if(a.length){let r=.01*Math.min(...a);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,i,s),d=n.length-1;return{sizes:s||"w"!==o?s:"100vw",srcSet:n.map((r,i)=>`${l({config:e,src:t,quality:a,width:r})} ${"w"===o?r:i+1}${o}`).join(", "),src:l({config:e,src:t,quality:a,width:n[d]})}}({config:R,src:e,unoptimized:r,width:L,quality:K,sizes:t,loader:G}),J=W?"lazy":c;return{props:{...E,loading:J,fetchPriority:w,width:L,height:F,decoding:_,className:u,style:{...V,...Q},sizes:Y.sizes,srcSet:Y.srcSet,src:x||Y.src},meta:{unoptimized:r,preload:d||o,placeholder:v,fill:f}}}},805690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n}});let i=e.r(403055),a="undefined"==typeof window,s=a?()=>{}:i.useLayoutEffect,l=a?()=>{}:i.useEffect;function n(e){let{headManager:t,reduceComponentsToState:r}=e;function n(){if(t&&t.mountedInstances){let e=i.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return a&&(t?.mountedInstances?.add(e.children),n()),s(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),s(()=>(t&&(t._pendingUpdate=n),()=>{t&&(t._pendingUpdate=n)})),l(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},308112,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={default:function(){return f},defaultHead:function(){return u}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=e.r(940192),l=e.r(475244),n=e.r(44990),o=l._(e.r(403055)),d=s._(e.r(805690)),c=e.r(525989);function u(){return[(0,n.jsx)("meta",{charSet:"utf-8"},"charset"),(0,n.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function g(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===o.default.Fragment?e.concat(o.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(715200);let m=["name","httpEquiv","charSet","itemProp"];function p(e){let t,r,i,a;return e.reduce(g,[]).reverse().concat(u().reverse()).filter((t=new Set,r=new Set,i=new Set,a={},e=>{let s=!0,l=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){l=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?s=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?s=!1:r.add(e.type);break;case"meta":for(let t=0,r=m.length;t<r;t++){let r=m[t];if(e.props.hasOwnProperty(r))if("charSet"===r)i.has(r)?s=!1:i.add(r);else{let t=e.props[r],i=a[r]||new Set;("name"!==r||!l)&&i.has(t)?s=!1:(i.add(t),a[r]=i)}}}return s})).reverse().map((e,t)=>{let r=e.key||t;return o.default.cloneElement(e,{key:r})})}let f=function({children:e}){let t=(0,o.useContext)(c.HeadManagerContext);return(0,n.jsx)(d.default,{reduceComponentsToState:p,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},238369,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return s}});let i=e.r(940192)._(e.r(403055)),a=e.r(596974),s=i.default.createContext(a.imageConfigDefault)},420539,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return i}});let i=e.r(940192)._(e.r(403055)).default.createContext(null)},659556,(e,t,r)=>{"use strict";function i(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,0):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return i}})},103342,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return s}});let i=e.r(659556);function a({config:e,src:t,width:r,quality:a}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let s=(0,i.findClosestQuality)(a,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${s}${t.startsWith("/_next/static/media/"),""}`}a.__next_img_default=!0;let s=a},894595,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return v}});let i=e.r(940192),a=e.r(475244),s=e.r(44990),l=a._(e.r(403055)),n=i._(e.r(940392)),o=i._(e.r(308112)),d=e.r(473733),c=e.r(596974),u=e.r(238369);e.r(715200);let g=e.r(420539),m=i._(e.r(103342)),p=e.r(527304),f={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function h(e,t,r,i,a,s,l){let n=e?.src;e&&e["data-loaded-src"]!==n&&(e["data-loaded-src"]=n,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&a(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let i=!1,a=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>i,isPropagationStopped:()=>a,persist:()=>{},preventDefault:()=>{i=!0,t.preventDefault()},stopPropagation:()=>{a=!0,t.stopPropagation()}})}i?.current&&i.current(e)}}))}function x(e){return l.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let y=(0,l.forwardRef)(({src:e,srcSet:t,sizes:r,height:i,width:a,decoding:n,className:o,style:d,fetchPriority:c,placeholder:u,loading:g,unoptimized:m,fill:f,onLoadRef:y,onLoadingCompleteRef:b,setBlurComplete:v,setShowAltText:j,sizesInput:w,onLoad:_,onError:C,...N},S)=>{let P=(0,l.useCallback)(e=>{e&&(C&&(e.src=e.src),e.complete&&h(e,u,y,b,v,m,w))},[e,u,y,b,v,C,m,w]),O=(0,p.useMergedRef)(S,P);return(0,s.jsx)("img",{...N,...x(c),loading:g,width:a,height:i,decoding:n,"data-nimg":f?"fill":"1",className:o,style:d,sizes:r,srcSet:t,src:e,ref:O,onLoad:e=>{h(e.currentTarget,u,y,b,v,m,w)},onError:e=>{j(!0),"empty"!==u&&v(!0),C&&C(e)}})});function b({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&n.default.preload?(n.default.preload(t.src,r),null):(0,s.jsx)(o.default,{children:(0,s.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let v=(0,l.forwardRef)((e,t)=>{let r=(0,l.useContext)(g.RouterContext),i=(0,l.useContext)(u.ImageConfigContext),a=(0,l.useMemo)(()=>{let e=f||i||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),a=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:a,localPatterns:"undefined"==typeof window?i?.localPatterns:e.localPatterns}},[i]),{onLoad:n,onLoadingComplete:o}=e,p=(0,l.useRef)(n);(0,l.useEffect)(()=>{p.current=n},[n]);let h=(0,l.useRef)(o);(0,l.useEffect)(()=>{h.current=o},[o]);let[x,v]=(0,l.useState)(!1),[j,w]=(0,l.useState)(!1),{props:_,meta:C}=(0,d.getImgProps)(e,{defaultLoader:m.default,imgConf:a,blurComplete:x,showAltText:j});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(y,{..._,unoptimized:C.unoptimized,placeholder:C.placeholder,fill:C.fill,onLoadRef:p,onLoadingCompleteRef:h,setBlurComplete:v,setShowAltText:w,sizesInput:e.sizes,ref:t}),C.preload?(0,s.jsx)(b,{isAppRouter:!r,imgAttributes:_}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},211684,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={default:function(){return c},getImageProps:function(){return d}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=e.r(940192),l=e.r(473733),n=e.r(894595),o=s._(e.r(103342));function d(e){let{props:t}=(0,l.getImgProps)(e,{defaultLoader:o.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let c=n.Image},586754,(e,t,r)=>{t.exports=e.r(211684)},137,e=>{"use strict";var t=e.i(984804);let r=t.gql`
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
`,i=t.gql`
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
`;let a=t.gql`
  query GetBlogCategories {
    blogCategories {
      id
      name
      slug
      description
      thumbnail
    }
  }
`;e.s(["GET_BLOGS",0,r,"GET_BLOG_BY_SLUG",0,i,"GET_BLOG_CATEGORIES",0,a])},892108,e=>{"use strict";var t=e.i(44990),r=e.i(403055),i=e.i(429105),a=e.i(579448),s=e.i(586754),l=e.i(137),n=e.i(850384),o=e.i(435635),d=e.i(909905),c=e.i(415588),u=e.i(759727);function g(){let[e,g]=(0,r.useState)(1),[m,p]=(0,r.useState)(null),[f,h]=(0,r.useState)(""),[x,y]=(0,r.useState)("newest"),{data:b,loading:v,error:j}=(0,i.useQuery)(l.GET_BLOGS,{variables:{input:{page:e,limit:12,categoryId:m,search:f||void 0,sort:x,isPublished:!0}}}),{data:w}=(0,i.useQuery)(l.GET_BLOG_CATEGORIES),_=b?.getBlogs?.blogs||[],C=b?.getBlogs?.total||0,N=12*e<C,S=w?.getBlogCategories||[];return(0,t.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,t.jsx)("div",{className:"bg-gradient-to-r from-blue-600 to-purple-600 text-white",children:(0,t.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:[(0,t.jsx)("h1",{className:"text-4xl font-bold mb-4",children:"Blog"}),(0,t.jsx)("p",{className:"text-xl opacity-90",children:"Khám phá kiến thức, xu hướng và cập nhật mới nhất"})]})}),(0,t.jsx)("div",{className:"bg-white border-b",children:(0,t.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",children:(0,t.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4",children:[(0,t.jsxs)("div",{className:"flex-1 relative",children:[(0,t.jsx)("input",{type:"text",value:f,onChange:e=>h(e.target.value),placeholder:"Tìm kiếm bài viết...",className:"w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"}),(0,t.jsx)(n.Search,{className:"absolute left-4 top-3.5 h-5 w-5 text-gray-400"})]}),(0,t.jsxs)("select",{value:x,onChange:e=>y(e.target.value),className:"px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",children:[(0,t.jsx)("option",{value:"newest",children:"Mới nhất"}),(0,t.jsx)("option",{value:"oldest",children:"Cũ nhất"}),(0,t.jsx)("option",{value:"popular",children:"Phổ biến nhất"})]})]})})}),(0,t.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,t.jsxs)("div",{className:"flex flex-col lg:flex-row gap-8",children:[(0,t.jsx)("aside",{className:"lg:w-64 flex-shrink-0",children:(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6 sticky top-4",children:[(0,t.jsx)("h3",{className:"font-bold text-gray-900 mb-4",children:"Danh mục"}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("button",{onClick:()=>p(null),className:`w-full text-left px-3 py-2 rounded-md transition ${null===m?"bg-blue-50 text-blue-700 font-medium":"text-gray-700 hover:bg-gray-50"}`,children:"Tất cả"}),S.map(e=>(0,t.jsx)("button",{onClick:()=>p(e.id),className:`w-full text-left px-3 py-2 rounded-md transition ${m===e.id?"bg-blue-50 text-blue-700 font-medium":"text-gray-700 hover:bg-gray-50"}`,children:e.name},e.id))]}),(0,t.jsxs)("div",{className:"mt-8",children:[(0,t.jsxs)("h3",{className:"font-bold text-gray-900 mb-4 flex items-center gap-2",children:[(0,t.jsx)(u.TrendingUp,{className:"h-5 w-5"}),"Thẻ phổ biến"]}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:["Công nghệ","Kinh doanh","Marketing","Thiết kế","Đời sống"].map(e=>(0,t.jsxs)("span",{className:"px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition",children:["#",e]},e))})]})]})}),(0,t.jsxs)("main",{className:"flex-1",children:[v&&(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[...Array(6)].map((e,r)=>(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-sm overflow-hidden animate-pulse",children:[(0,t.jsx)("div",{className:"bg-gray-200 h-48"}),(0,t.jsxs)("div",{className:"p-4 space-y-3",children:[(0,t.jsx)("div",{className:"bg-gray-200 h-4 rounded"}),(0,t.jsx)("div",{className:"bg-gray-200 h-4 rounded w-2/3"})]})]},r))}),j&&(0,t.jsxs)("div",{className:"bg-red-50 text-red-700 p-4 rounded-lg",children:["Có lỗi xảy ra: ",j.message]}),!v&&_.length>0&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:_.map(e=>(0,t.jsxs)(a.default,{href:`/blog/${e.slug}`,className:"bg-white rounded-lg shadow-sm hover:shadow-md transition group overflow-hidden",children:[e.featuredImage&&(0,t.jsxs)("div",{className:"relative aspect-video overflow-hidden",children:[(0,t.jsx)(s.default,{src:e.featuredImage,alt:e.title,fill:!0,className:"object-cover group-hover:scale-105 transition duration-300"}),e.category&&(0,t.jsx)("span",{className:"absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full",children:e.category.name})]}),(0,t.jsxs)("div",{className:"p-4",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 text-xs text-gray-500 mb-2",children:[(0,t.jsxs)("span",{className:"flex items-center gap-1",children:[(0,t.jsx)(o.Calendar,{className:"h-3 w-3"}),new Date(e.publishedAt||e.createdAt).toLocaleDateString("vi-VN",{year:"numeric",month:"long",day:"numeric"})]}),e.viewCount>0&&(0,t.jsxs)("span",{children:[e.viewCount," lượt xem"]})]}),(0,t.jsx)("h2",{className:"font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition",children:e.title}),e.shortDescription&&(0,t.jsx)("p",{className:"text-gray-600 text-sm mb-3 line-clamp-3",children:e.shortDescription}),(0,t.jsxs)("div",{className:"flex items-center justify-between pt-3 border-t",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(d.User,{className:"h-4 w-4 text-gray-400"}),(0,t.jsx)("span",{className:"text-sm text-gray-600",children:e.author?.fullName||e.author?.email||"Admin"})]}),e.readingTime&&(0,t.jsxs)("div",{className:"flex items-center gap-1 text-gray-500 text-sm",children:[(0,t.jsx)(c.Clock,{className:"h-4 w-4"}),(0,t.jsxs)("span",{children:[e.readingTime," phút"]})]})]}),e.tags&&e.tags.length>0&&(0,t.jsx)("div",{className:"flex flex-wrap gap-2 mt-3",children:e.tags.slice(0,3).map(e=>(0,t.jsxs)("span",{className:"px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded",children:["#",e.name]},e.id))})]})]},e.id))}),(0,t.jsxs)("div",{className:"mt-8 flex justify-center gap-2",children:[(0,t.jsx)("button",{onClick:()=>g(Math.max(1,e-1)),disabled:1===e,className:"px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition",children:"Trước"}),(0,t.jsxs)("span",{className:"px-4 py-2 text-gray-700",children:["Trang ",e," / ",Math.ceil(C/12)]}),(0,t.jsx)("button",{onClick:()=>g(e+1),disabled:!N,className:"px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition",children:"Sau"})]})]}),!v&&0===_.length&&(0,t.jsx)("div",{className:"text-center py-12 bg-white rounded-lg",children:(0,t.jsx)("p",{className:"text-gray-500 text-lg",children:"Không tìm thấy bài viết nào"})})]})]})})]})}e.s(["default",()=>g])}]);