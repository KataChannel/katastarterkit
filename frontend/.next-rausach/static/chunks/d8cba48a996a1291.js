(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,173416,e=>{"use strict";var t=e.i(46034);e.s(["Filter",()=>t.default])},49316,(e,t,s)=>{"use strict";function a({widthInt:e,heightInt:t,blurWidth:s,blurHeight:a,blurDataURL:r,objectFit:i}){let n=s?40*s:e,l=a?40*a:t,o=n&&l?`viewBox='0 0 ${n} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${o}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${o?"none":"contain"===i?"xMidYMid":"cover"===i?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${r}'/%3E%3C/svg%3E`}Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"getImageBlurSvg",{enumerable:!0,get:function(){return a}})},596974,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a={VALID_LOADERS:function(){return i},imageConfigDefault:function(){return n}};for(var r in a)Object.defineProperty(s,r,{enumerable:!0,get:a[r]});let i=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},473733,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"getImgProps",{enumerable:!0,get:function(){return o}}),e.r(715200);let a=e.r(49316),r=e.r(596974),i=["-moz-initial","fill","none","scale-down",void 0];function n(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function o({src:e,sizes:t,unoptimized:s=!1,priority:o=!1,preload:d=!1,loading:c,className:u,quality:m,width:p,height:h,fill:g=!1,style:f,overrideSrc:x,onLoad:y,onLoadingComplete:N,placeholder:v="empty",blurDataURL:$,fetchPriority:b,decoding:j="async",layout:w,objectFit:C,objectPosition:_,lazyBoundary:S,lazyRoot:E,...T},A){var D;let O,I,P,{imgConf:U,showAltText:k,blurComplete:R,defaultLoader:L}=A,B=U||r.imageConfigDefault;if("allSizes"in B)O=B;else{let e=[...B.deviceSizes,...B.imageSizes].sort((e,t)=>e-t),t=B.deviceSizes.sort((e,t)=>e-t),s=B.qualities?.sort((e,t)=>e-t);O={...B,allSizes:e,deviceSizes:t,qualities:s}}if(void 0===L)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let F=T.loader||L;delete T.loader,delete T.srcSet;let M="__next_img_default"in F;if(M){if("custom"===O.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=F;F=t=>{let{config:s,...a}=t;return e(a)}}if(w){"fill"===w&&(g=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[w];e&&(f={...f,...e});let s={responsive:"100vw",fill:"100vw"}[w];s&&!t&&(t=s)}let q="",G=l(p),J=l(h);if((D=e)&&"object"==typeof D&&(n(D)||void 0!==D.src)){let t=n(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(I=t.blurWidth,P=t.blurHeight,$=$||t.blurDataURL,q=t.src,!g)if(G||J){if(G&&!J){let e=G/t.width;J=Math.round(t.height*e)}else if(!G&&J){let e=J/t.height;G=Math.round(t.width*e)}}else G=t.width,J=t.height}let z=!o&&!d&&("lazy"===c||void 0===c);(!(e="string"==typeof e?e:q)||e.startsWith("data:")||e.startsWith("blob:"))&&(s=!0,z=!1),O.unoptimized&&(s=!0),M&&!O.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(s=!0);let Q=l(m),V=Object.assign(g?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:C,objectPosition:_}:{},k?{}:{color:"transparent"},f),Y=R||"empty"===v?null:"blur"===v?`url("data:image/svg+xml;charset=utf-8,${(0,a.getImageBlurSvg)({widthInt:G,heightInt:J,blurWidth:I,blurHeight:P,blurDataURL:$||"",objectFit:V.objectFit})}")`:`url("${v}")`,K=i.includes(V.objectFit)?"fill"===V.objectFit?"100% 100%":"cover":V.objectFit,W=Y?{backgroundSize:K,backgroundPosition:V.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:Y}:{},H=function({config:e,src:t,unoptimized:s,width:a,quality:r,sizes:i,loader:n}){if(s)return{src:t,srcSet:void 0,sizes:void 0};let{widths:l,kind:o}=function({deviceSizes:e,allSizes:t},s,a){if(a){let s=/(^|\s)(1?\d?\d)vw/g,r=[];for(let e;e=s.exec(a);)r.push(parseInt(e[2]));if(r.length){let s=.01*Math.min(...r);return{widths:t.filter(t=>t>=e[0]*s),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof s?{widths:e,kind:"w"}:{widths:[...new Set([s,2*s].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,a,i),d=l.length-1;return{sizes:i||"w"!==o?i:"100vw",srcSet:l.map((s,a)=>`${n({config:e,src:t,quality:r,width:s})} ${"w"===o?s:a+1}${o}`).join(", "),src:n({config:e,src:t,quality:r,width:l[d]})}}({config:O,src:e,unoptimized:s,width:G,quality:Q,sizes:t,loader:F}),X=z?"lazy":c;return{props:{...T,loading:X,fetchPriority:b,width:G,height:J,decoding:j,className:u,style:{...V,...W},sizes:H.sizes,srcSet:H.srcSet,src:x||H.src},meta:{unoptimized:s,preload:d||o,placeholder:v,fill:g}}}},805690,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"default",{enumerable:!0,get:function(){return l}});let a=e.r(403055),r="undefined"==typeof window,i=r?()=>{}:a.useLayoutEffect,n=r?()=>{}:a.useEffect;function l(e){let{headManager:t,reduceComponentsToState:s}=e;function l(){if(t&&t.mountedInstances){let e=a.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(s(e))}}return r&&(t?.mountedInstances?.add(e.children),l()),i(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),i(()=>(t&&(t._pendingUpdate=l),()=>{t&&(t._pendingUpdate=l)})),n(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},308112,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a={default:function(){return g},defaultHead:function(){return u}};for(var r in a)Object.defineProperty(s,r,{enumerable:!0,get:a[r]});let i=e.r(940192),n=e.r(475244),l=e.r(44990),o=n._(e.r(403055)),d=i._(e.r(805690)),c=e.r(525989);function u(){return[(0,l.jsx)("meta",{charSet:"utf-8"},"charset"),(0,l.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function m(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===o.default.Fragment?e.concat(o.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(715200);let p=["name","httpEquiv","charSet","itemProp"];function h(e){let t,s,a,r;return e.reduce(m,[]).reverse().concat(u().reverse()).filter((t=new Set,s=new Set,a=new Set,r={},e=>{let i=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;let s=e.key.slice(e.key.indexOf("$")+1);t.has(s)?i=!1:t.add(s)}switch(e.type){case"title":case"base":s.has(e.type)?i=!1:s.add(e.type);break;case"meta":for(let t=0,s=p.length;t<s;t++){let s=p[t];if(e.props.hasOwnProperty(s))if("charSet"===s)a.has(s)?i=!1:a.add(s);else{let t=e.props[s],a=r[s]||new Set;("name"!==s||!n)&&a.has(t)?i=!1:(a.add(t),r[s]=a)}}}return i})).reverse().map((e,t)=>{let s=e.key||t;return o.default.cloneElement(e,{key:s})})}let g=function({children:e}){let t=(0,o.useContext)(c.HeadManagerContext);return(0,l.jsx)(d.default,{reduceComponentsToState:h,headManager:t,children:e})};("function"==typeof s.default||"object"==typeof s.default&&null!==s.default)&&void 0===s.default.__esModule&&(Object.defineProperty(s.default,"__esModule",{value:!0}),Object.assign(s.default,s),t.exports=s.default)},238369,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"ImageConfigContext",{enumerable:!0,get:function(){return i}});let a=e.r(940192)._(e.r(403055)),r=e.r(596974),i=a.default.createContext(r.imageConfigDefault)},420539,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"RouterContext",{enumerable:!0,get:function(){return a}});let a=e.r(940192)._(e.r(403055)).default.createContext(null)},659556,(e,t,s)=>{"use strict";function a(e,t){let s=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-s)<Math.abs(e-s)?t:e,0):s}Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"findClosestQuality",{enumerable:!0,get:function(){return a}})},103342,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"default",{enumerable:!0,get:function(){return i}});let a=e.r(659556);function r({config:e,src:t,width:s,quality:r}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let i=(0,a.findClosestQuality)(r,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${s}&q=${i}${t.startsWith("/_next/static/media/"),""}`}r.__next_img_default=!0;let i=r},894595,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"Image",{enumerable:!0,get:function(){return v}});let a=e.r(940192),r=e.r(475244),i=e.r(44990),n=r._(e.r(403055)),l=a._(e.r(940392)),o=a._(e.r(308112)),d=e.r(473733),c=e.r(596974),u=e.r(238369);e.r(715200);let m=e.r(420539),p=a._(e.r(103342)),h=e.r(527304),g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function f(e,t,s,a,r,i,n){let l=e?.src;e&&e["data-loaded-src"]!==l&&(e["data-loaded-src"]=l,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&r(!0),s?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let a=!1,r=!1;s.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>a,isPropagationStopped:()=>r,persist:()=>{},preventDefault:()=>{a=!0,t.preventDefault()},stopPropagation:()=>{r=!0,t.stopPropagation()}})}a?.current&&a.current(e)}}))}function x(e){return n.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let y=(0,n.forwardRef)(({src:e,srcSet:t,sizes:s,height:a,width:r,decoding:l,className:o,style:d,fetchPriority:c,placeholder:u,loading:m,unoptimized:p,fill:g,onLoadRef:y,onLoadingCompleteRef:N,setBlurComplete:v,setShowAltText:$,sizesInput:b,onLoad:j,onError:w,...C},_)=>{let S=(0,n.useCallback)(e=>{e&&(w&&(e.src=e.src),e.complete&&f(e,u,y,N,v,p,b))},[e,u,y,N,v,w,p,b]),E=(0,h.useMergedRef)(_,S);return(0,i.jsx)("img",{...C,...x(c),loading:m,width:r,height:a,decoding:l,"data-nimg":g?"fill":"1",className:o,style:d,sizes:s,srcSet:t,src:e,ref:E,onLoad:e=>{f(e.currentTarget,u,y,N,v,p,b)},onError:e=>{$(!0),"empty"!==u&&v(!0),w&&w(e)}})});function N({isAppRouter:e,imgAttributes:t}){let s={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&l.default.preload?(l.default.preload(t.src,s),null):(0,i.jsx)(o.default,{children:(0,i.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...s},"__nimg-"+t.src+t.srcSet+t.sizes)})}let v=(0,n.forwardRef)((e,t)=>{let s=(0,n.useContext)(m.RouterContext),a=(0,n.useContext)(u.ImageConfigContext),r=(0,n.useMemo)(()=>{let e=g||a||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),s=e.deviceSizes.sort((e,t)=>e-t),r=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:s,qualities:r,localPatterns:"undefined"==typeof window?a?.localPatterns:e.localPatterns}},[a]),{onLoad:l,onLoadingComplete:o}=e,h=(0,n.useRef)(l);(0,n.useEffect)(()=>{h.current=l},[l]);let f=(0,n.useRef)(o);(0,n.useEffect)(()=>{f.current=o},[o]);let[x,v]=(0,n.useState)(!1),[$,b]=(0,n.useState)(!1),{props:j,meta:w}=(0,d.getImgProps)(e,{defaultLoader:p.default,imgConf:r,blurComplete:x,showAltText:$});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(y,{...j,unoptimized:w.unoptimized,placeholder:w.placeholder,fill:w.fill,onLoadRef:h,onLoadingCompleteRef:f,setBlurComplete:v,setShowAltText:b,sizesInput:e.sizes,ref:t}),w.preload?(0,i.jsx)(N,{isAppRouter:!s,imgAttributes:j}):null]})});("function"==typeof s.default||"object"==typeof s.default&&null!==s.default)&&void 0===s.default.__esModule&&(Object.defineProperty(s.default,"__esModule",{value:!0}),Object.assign(s.default,s),t.exports=s.default)},211684,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a={default:function(){return c},getImageProps:function(){return d}};for(var r in a)Object.defineProperty(s,r,{enumerable:!0,get:a[r]});let i=e.r(940192),n=e.r(473733),l=e.r(894595),o=i._(e.r(103342));function d(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:o.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,s]of Object.entries(t))void 0===s&&delete t[e];return{props:t}}let c=l.Image},586754,(e,t,s)=>{t.exports=e.r(211684)},574375,e=>{"use strict";var t=e.i(984804);let s=t.gql`
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
`,a=t.gql`
  ${s}
  fragment CategoryWithCountFields on CategoryType {
    ...CategoryBasicFields
    productCount
  }
`,r=t.gql`
  ${a}
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
`,i=t.gql`
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
`;e.s(["CATEGORY_BASIC_FRAGMENT",0,s,"CATEGORY_TREE_FRAGMENT",0,r,"CATEGORY_WITH_COUNT_FRAGMENT",0,a,"COMMENT_FRAGMENT",0,d,"POST_FRAGMENT",0,o,"PRODUCT_IMAGE_FRAGMENT",0,i,"PRODUCT_VARIANT_FRAGMENT",0,n,"USER_FRAGMENT",0,l])},490008,e=>{"use strict";var t=e.i(416181);e.s(["Play",()=>t.default])},125284,e=>{"use strict";var t=e.i(429105),s=e.i(950988),a=e.i(984804),r=e.i(574375);class i{static generateCRUDQueries(e,t=[],s={}){let r=e.toLowerCase();e.charAt(0).toLowerCase(),e.slice(1);let i=e.startsWith("ext_"),n=(t.length>0?t:["id","createdAt","updatedAt"]).join("\n    ");Object.keys(s).length>0&&Object.entries(s).forEach(([e,t])=>{n+=`
    ${e} {
      ${t.join("\n      ")}
    }`});let l=i?"JSON":`${e}FilterInput`;return{[`GET_${e.toUpperCase()}S`]:i?a.gql`
          query Get${e}s($filters: ${l}) {
            get${e}s(filters: $filters)
          }
        `:a.gql`
          query Get${e}s($filters: ${l}) {
            get${e}s(filters: $filters) {
              ${n}
            }
          }
        `,[`GET_${e.toUpperCase()}S_PAGINATED`]:i?a.gql`
          query Get${e}sPaginated($filters: ${l}) {
            get${e}sPaginated(filters: $filters)
          }
        `:a.gql`
          query Get${e}sPaginated($filters: ${l}) {
            get${e}sPaginated(filters: $filters) {
              data {
                ${n}
              }
              meta {
                total
                page
                limit
                totalPages
                hasNextPage
                hasPrevPage
              }
            }
          }
        `,[`GET_${e.toUpperCase()}_BY_ID`]:i?a.gql`
          query Get${e}ById($id: ID!, $options: JSON) {
            get${e}ById(id: $id, options: $options)
          }
        `:a.gql`
          query Get${e}ById($id: ID!, $options: JSON) {
            get${e}ById(id: $id, options: $options) {
              ${n}
            }
          }
        `,[`CREATE_${e.toUpperCase()}`]:i?a.gql`
          mutation Create${e}($data: JSON!, $options: JSON) {
            create${e}(data: $data, options: $options)
          }
        `:a.gql`
          mutation Create${e}($data: JSON!, $options: JSON) {
            create${e}(data: $data, options: $options) {
              ${n}
            }
          }
        `,[`CREATE_${e.toUpperCase()}S_BULK`]:i?a.gql`
          mutation Create${e}sBulk($input: JSON!, $options: JSON) {
            create${e}sBulk(input: $input, options: $options)
          }
        `:a.gql`
          mutation Create${e}sBulk($input: JSON!, $options: JSON) {
            create${e}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${n}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPDATE_${e.toUpperCase()}`]:i?a.gql`
          mutation Update${e}($id: ID!, $data: JSON!, $options: JSON) {
            update${e}(id: $id, data: $data, options: $options)
          }
        `:a.gql`
          mutation Update${e}($id: ID!, $data: JSON!, $options: JSON) {
            update${e}(id: $id, data: $data, options: $options) {
              ${n}
            }
          }
        `,[`UPDATE_${e.toUpperCase()}S_BULK`]:i?a.gql`
          mutation Update${e}sBulk($input: JSON!, $options: JSON) {
            update${e}sBulk(input: $input, options: $options)
          }
        `:a.gql`
          mutation Update${e}sBulk($input: JSON!, $options: JSON) {
            update${e}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${n}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`DELETE_${e.toUpperCase()}`]:i?a.gql`
          mutation Delete${e}($id: ID!, $options: JSON) {
            delete${e}(id: $id, options: $options)
          }
        `:a.gql`
          mutation Delete${e}($id: ID!, $options: JSON) {
            delete${e}(id: $id, options: $options) {
              ${n}
            }
          }
        `,[`DELETE_${e.toUpperCase()}S_BULK`]:i?a.gql`
          mutation Delete${e}sBulk($input: JSON!, $options: JSON) {
            delete${e}sBulk(input: $input, options: $options)
          }
        `:a.gql`
          mutation Delete${e}sBulk($input: JSON!, $options: JSON) {
            delete${e}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${n}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPSERT_${e.toUpperCase()}`]:i?a.gql`
          mutation Upsert${e}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${e}(where: $where, create: $create, update: $update, options: $options)
          }
        `:a.gql`
          mutation Upsert${e}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${e}(where: $where, create: $create, update: $update, options: $options) {
              ${n}
            }
          }
        `,[`COUNT_${e.toUpperCase()}S`]:a.gql`
        query Count${e}s($where: JSON) {
          count${e}s(where: $where)
        }
      `,[`${e.toUpperCase()}_EXISTS`]:a.gql`
        query ${e}Exists($where: JSON!) {
          ${r}Exists(where: $where)
        }
      `}}static generateUniversalQueries(){return{DYNAMIC_FIND_MANY:a.gql`
        query DynamicFindMany($modelName: String!, $filter: JSON) {
          dynamicFindMany(modelName: $modelName, filter: $filter)
        }
      `,DYNAMIC_FIND_BY_ID:a.gql`
        query DynamicFindById($modelName: String!, $id: ID!, $options: JSON) {
          dynamicFindById(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE:a.gql`
        mutation DynamicCreate($modelName: String!, $data: JSON!, $options: JSON) {
          dynamicCreate(modelName: $modelName, data: $data, options: $options)
        }
      `,DYNAMIC_UPDATE:a.gql`
        mutation DynamicUpdate($modelName: String!, $id: ID!, $data: JSON!, $options: JSON) {
          dynamicUpdate(modelName: $modelName, id: $id, data: $data, options: $options)
        }
      `,DYNAMIC_DELETE:a.gql`
        mutation DynamicDelete($modelName: String!, $id: ID!, $options: JSON) {
          dynamicDelete(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE_BULK:a.gql`
        mutation DynamicCreateBulk($modelName: String!, $input: JSON!, $options: JSON) {
          dynamicCreateBulk(modelName: $modelName, input: $input, options: $options) {
            success
            count
            data
            errors {
              index
              error
              data
            }
          }
        }
      `,DYNAMIC_UPDATE_BULK:a.gql`
        mutation DynamicUpdateBulk($modelName: String!, $input: JSON!, $options: JSON) {
          dynamicUpdateBulk(modelName: $modelName, input: $input, options: $options) {
            success
            count
            data
            errors {
              index
              error
              data
            }
          }
        }
      `,DYNAMIC_DELETE_BULK:a.gql`
        mutation DynamicDeleteBulk($modelName: String!, $input: JSON!, $options: JSON) {
          dynamicDeleteBulk(modelName: $modelName, input: $input, options: $options) {
            success
            count
            data
            errors {
              index
              error
              data
            }
          }
        }
      `}}static generateQueriesWithFragments(e,t){let s=e.toUpperCase();return{[`GET_${s}S_WITH_FRAGMENT`]:a.gql`
        ${t}
        query Get${e}s($filter: JSON) {
          get${e}s(filter: $filter) {
            ...${e}Fragment
          }
        }
      `,[`CREATE_${s}_WITH_FRAGMENT`]:a.gql`
        ${t}
        mutation Create${e}($data: JSON!, $options: JSON) {
          create${e}(data: $data, options: $options) {
            ...${e}Fragment
          }
        }
      `,[`UPDATE_${s}_WITH_FRAGMENT`]:a.gql`
        ${t}
        mutation Update${e}($id: ID!, $data: JSON!, $options: JSON) {
          update${e}(id: $id, data: $data, options: $options) {
            ...${e}Fragment
          }
        }
      `}}}r.USER_FRAGMENT,r.POST_FRAGMENT,a.gql`
    fragment DynamicTaskFragment on Task {
      id
      title
      description
      category
      priority
      status
      dueDate
      userId
      createdAt
      updatedAt
    }
  `,r.COMMENT_FRAGMENT;let n=i.generateCRUDQueries("User",["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"]),l=i.generateCRUDQueries("Post",["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"]),o=i.generateCRUDQueries("Task",["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"]),d=i.generateCRUDQueries("Comment",["id","content","postId","userId","parentId","createdAt","updatedAt"]),c=i.generateUniversalQueries();Object.entries({User:["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"],Post:["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"],Task:["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"],Comment:["id","content","postId","userId","parentId","createdAt","updatedAt"],Tag:["id","name","slug","description","color","createdAt","updatedAt"],Media:["id","filename","fileUrl","fileSize","mimeType","uploadedById","createdAt"],TaskComment:["id","content","taskId","authorId","parentId","createdAt","updatedAt"],TaskShare:["id","taskId","userId","permission","shareToken","expiresAt","isActive","createdAt"],TaskMedia:["id","filename","url","type","size","mimeType","taskId","uploadedBy","createdAt"]}).reduce((e,[t,s])=>(e[t]=i.generateCRUDQueries(t,s),e),{});let{GET_USERS:u,GET_USERS_PAGINATED:m,GET_USER_BY_ID:p,CREATE_USER:h,CREATE_USERS_BULK:g,UPDATE_USER:f,UPDATE_USERS_BULK:x,DELETE_USER:y,DELETE_USERS_BULK:N,UPSERT_USER:v,COUNT_USERS:$,USER_EXISTS:b}=n,{GET_POSTS:j,GET_POSTS_PAGINATED:w,GET_POST_BY_ID:C,CREATE_POST:_,CREATE_POSTS_BULK:S,UPDATE_POST:E,UPDATE_POSTS_BULK:T,DELETE_POST:A,DELETE_POSTS_BULK:D,UPSERT_POST:O,COUNT_POSTS:I,POST_EXISTS:P}=l,{GET_TASKS:U,GET_TASKS_PAGINATED:k,GET_TASK_BY_ID:R,CREATE_TASK:L,CREATE_TASKS_BULK:B,UPDATE_TASK:F,UPDATE_TASKS_BULK:M,DELETE_TASK:q,DELETE_TASKS_BULK:G,UPSERT_TASK:J,COUNT_TASKS:z,TASK_EXISTS:Q}=o,{GET_COMMENTS:V,GET_COMMENTS_PAGINATED:Y,GET_COMMENT_BY_ID:K,CREATE_COMMENT:W,CREATE_COMMENTS_BULK:H,UPDATE_COMMENT:X,UPDATE_COMMENTS_BULK:Z,DELETE_COMMENT:ee,DELETE_COMMENTS_BULK:et,UPSERT_COMMENT:es,COUNT_COMMENTS:ea,COMMENT_EXISTS:er}=d,{DYNAMIC_FIND_MANY:ei,DYNAMIC_FIND_BY_ID:en,DYNAMIC_CREATE:el,DYNAMIC_UPDATE:eo,DYNAMIC_DELETE:ed,DYNAMIC_CREATE_BULK:ec,DYNAMIC_UPDATE_BULK:eu,DYNAMIC_DELETE_BULK:em}=c;var ep=e.i(403055);function eh(e,s,a={}){let{fields:r,nestedFields:n,...l}=a,o=(0,ep.useMemo)(()=>{let t=i.generateCRUDQueries(s,r);switch(e){case"GET_ALL":return t[`GET_${s.toUpperCase()}S`];case"GET_PAGINATED":return t[`GET_${s.toUpperCase()}S_PAGINATED`];case"GET_BY_ID":return t[`GET_${s.toUpperCase()}_BY_ID`];default:throw Error(`Unsupported operation type: ${e}`)}},[e,s,r,n]);return(0,t.useQuery)(o,l)}function eg(e,t,a={}){let{fields:r,nestedFields:n,...l}=a,o=(0,ep.useMemo)(()=>{let s=i.generateCRUDQueries(t,r);switch(e){case"CREATE":return s[`CREATE_${t.toUpperCase()}`];case"CREATE_BULK":return s[`CREATE_${t.toUpperCase()}S_BULK`];case"UPDATE":return s[`UPDATE_${t.toUpperCase()}`];case"UPDATE_BULK":return s[`UPDATE_${t.toUpperCase()}S_BULK`];case"DELETE":return s[`DELETE_${t.toUpperCase()}`];case"DELETE_BULK":return s[`DELETE_${t.toUpperCase()}S_BULK`];default:throw Error(`Unsupported operation type: ${e}`)}},[e,t,r,n]);return(0,s.useMutation)(o,l)}function ef(e){let t=function(e,t={}){return eh("GET_ALL",e,t)}(e),s=function(e,t={}){return eh("GET_PAGINATED",e,t)}(e),[a]=function(e,t={}){return eg("CREATE",e,t)}(e),[r]=function(e,t={}){return eg("CREATE_BULK",e,t)}(e),[i]=function(e,t={}){return eg("UPDATE",e,t)}(e),[n]=function(e,t={}){return eg("UPDATE_BULK",e,t)}(e),[l]=function(e,t={}){return eg("DELETE",e,t)}(e),[o]=function(e,t={}){return eg("DELETE_BULK",e,t)}(e);return{getAll:t,getPaginated:s,getById:(0,ep.useCallback)(t=>(function(e,t={}){return eh("GET_BY_ID",e,t)})(e,{variables:{id:t}}),[e]),create:a,createBulk:r,update:i,updateBulk:n,delete:l,deleteBulk:o}}function ex(e){return e&&e.graphQLErrors&&void 0!==e.networkError}function ey(e){return e.graphQLErrors.length>0?e.graphQLErrors.map(e=>e.message).join(", "):e.networkError?`Network error: ${e.networkError.message}`:e.message||"Unknown GraphQL error"}e.s(["formatDynamicGraphQLError",()=>ey,"isDynamicGraphQLError",()=>ex,"useCRUD",()=>ef,"useDynamicMutation",()=>eg,"useDynamicQuery",()=>eh],125284)},164925,e=>{"use strict";var t=e.i(44990),s=e.i(403055),a=e.i(630596),r=e.i(567961),i=e.i(202774),n=e.i(404210),l=e.i(706547),o=e.i(138227),d=e.i(885205),c=e.i(125284),u=e.i(137651),m=e.i(165429),p=e.i(183194),h=e.i(276664),g=e.i(696134),f=e.i(996517),x=e.i(126455),y=e.i(173416),N=e.i(591079),v=e.i(490008),$=e.i(236929);function b({open:e,onOpenChange:a,settings:r,onSave:i}){let[n,l]=(0,s.useState)(r),o=e=>{l(t=>({...t,...e}))},c=(e,t)=>{l(s=>({...s,responsive:{...s.responsive,[e]:t}}))};return(0,t.jsx)(u.Dialog,{open:e,onOpenChange:a,children:(0,t.jsxs)(u.DialogContent,{className:"max-w-3xl max-h-[85vh] overflow-y-auto",children:[(0,t.jsxs)(u.DialogHeader,{children:[(0,t.jsxs)(u.DialogTitle,{className:"flex items-center gap-2",children:[(0,t.jsx)(x.Package,{className:"w-5 h-5 text-primary"}),"Product Carousel Settings"]}),(0,t.jsx)(u.DialogDescription,{children:"Customize your product carousel behavior, filters, and appearance"})]}),(0,t.jsxs)(f.Tabs,{defaultValue:"content",className:"w-full",children:[(0,t.jsxs)(f.TabsList,{className:"grid w-full grid-cols-5",children:[(0,t.jsxs)(f.TabsTrigger,{value:"content",className:"flex items-center gap-1.5",children:[(0,t.jsx)(x.Package,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Content"})]}),(0,t.jsxs)(f.TabsTrigger,{value:"filter",className:"flex items-center gap-1.5",children:[(0,t.jsx)(y.Filter,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Filter"})]}),(0,t.jsxs)(f.TabsTrigger,{value:"layout",className:"flex items-center gap-1.5",children:[(0,t.jsx)(N.Layout,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Layout"})]}),(0,t.jsxs)(f.TabsTrigger,{value:"behavior",className:"flex items-center gap-1.5",children:[(0,t.jsx)(v.Play,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Behavior"})]}),(0,t.jsxs)(f.TabsTrigger,{value:"controls",className:"flex items-center gap-1.5",children:[(0,t.jsx)($.MousePointer,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Controls"})]})]}),(0,t.jsx)(f.TabsContent,{value:"content",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(m.Label,{htmlFor:"title",className:"text-sm font-medium",children:"Carousel Title"}),(0,t.jsx)(g.Input,{id:"title",type:"text",placeholder:"e.g., Featured Products",value:n.title||"",onChange:e=>o({title:e.target.value}),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Displayed at the top of the carousel"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(m.Label,{htmlFor:"itemsToShow",className:"text-sm font-medium",children:"Number of Products"}),(0,t.jsx)("span",{className:"text-sm font-semibold text-primary",children:n.itemsToShow||8})]}),(0,t.jsx)(g.Input,{id:"itemsToShow",type:"range",min:3,max:20,step:1,value:n.itemsToShow||8,onChange:e=>o({itemsToShow:parseInt(e.target.value)}),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total products to display in carousel (3-20 items)"})]}),(0,t.jsxs)("div",{className:"space-y-4 p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"space-y-0.5",children:[(0,t.jsx)(m.Label,{htmlFor:"showViewAllButton",className:"text-sm font-medium",children:'Show "View All" Button'}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Link to full product listing page"})]}),(0,t.jsx)(h.Switch,{id:"showViewAllButton",checked:n.showViewAllButton,onCheckedChange:e=>o({showViewAllButton:e})})]}),n.showViewAllButton&&(0,t.jsxs)("div",{className:"space-y-2 pt-2 border-t",children:[(0,t.jsx)(m.Label,{htmlFor:"viewAllLink",className:"text-sm font-medium",children:"View All Link URL"}),(0,t.jsx)(g.Input,{id:"viewAllLink",type:"text",placeholder:"/san-pham",value:n.viewAllLink||"",onChange:e=>o({viewAllLink:e.target.value})})]})]})]})}),(0,t.jsx)(f.TabsContent,{value:"filter",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(m.Label,{htmlFor:"filterType",className:"text-sm font-medium",children:"Product Filter Type"}),(0,t.jsxs)(p.Select,{value:n.filterType||"all",onValueChange:e=>o({filterType:e}),children:[(0,t.jsx)(p.SelectTrigger,{id:"filterType",children:(0,t.jsx)(p.SelectValue,{placeholder:"Select filter type"})}),(0,t.jsxs)(p.SelectContent,{children:[(0,t.jsx)(p.SelectItem,{value:"all",children:"All Products"}),(0,t.jsx)(p.SelectItem,{value:"featured",children:"Featured Products"}),(0,t.jsx)(p.SelectItem,{value:"bestseller",children:"Best Sellers"}),(0,t.jsx)(p.SelectItem,{value:"category",children:"By Category"}),(0,t.jsx)(p.SelectItem,{value:"custom",children:"Custom Query"})]})]}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Choose which products to display"})]}),"category"===n.filterType&&(0,t.jsxs)("div",{className:"space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg",children:[(0,t.jsx)(m.Label,{htmlFor:"category",className:"text-sm font-medium text-blue-900",children:"Category Slug"}),(0,t.jsx)(g.Input,{id:"category",type:"text",placeholder:"e.g., dien-thoai-smartphone",value:n.category||"",onChange:e=>o({category:e.target.value})}),(0,t.jsx)("p",{className:"text-xs text-blue-700",children:"Enter the category slug to filter products"})]}),"custom"===n.filterType&&(0,t.jsxs)("div",{className:"space-y-2 p-4 bg-purple-50 border border-purple-200 rounded-lg",children:[(0,t.jsx)(m.Label,{htmlFor:"customQuery",className:"text-sm font-medium text-purple-900",children:"Custom GraphQL Query"}),(0,t.jsx)("textarea",{id:"customQuery",rows:6,placeholder:"Enter GraphQL query...",value:n.customQuery||"",onChange:e=>o({customQuery:e.target.value}),className:"w-full px-3 py-2 text-sm border rounded-md font-mono"}),(0,t.jsx)("p",{className:"text-xs text-purple-700",children:"Advanced: Define custom GraphQL query for products"})]}),(0,t.jsx)("div",{className:"p-4 bg-green-50 border border-green-200 rounded-lg",children:(0,t.jsxs)("p",{className:"text-sm text-green-800",children:[(0,t.jsx)("strong",{children:"✅ Data Source:"})," Products are loaded from table"," ",(0,t.jsx)("code",{className:"px-1.5 py-0.5 bg-green-100 rounded text-xs",children:"ext_sanphamhoadon"})," ","using dynamic GraphQL queries."]})})]})}),(0,t.jsx)(f.TabsContent,{value:"layout",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)("h3",{className:"text-sm font-semibold text-gray-900",children:"Responsive Items Per View"}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(m.Label,{htmlFor:"desktopItems",className:"text-sm font-medium",children:"🖥️ Desktop (> 1024px)"}),(0,t.jsx)("span",{className:"text-sm font-semibold text-primary",children:n.responsive?.desktop||4})]}),(0,t.jsx)(g.Input,{id:"desktopItems",type:"range",min:2,max:6,step:1,value:n.responsive?.desktop||4,onChange:e=>c("desktop",parseInt(e.target.value)),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Items displayed on large screens"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(m.Label,{htmlFor:"tabletItems",className:"text-sm font-medium",children:"📱 Tablet (640px - 1024px)"}),(0,t.jsx)("span",{className:"text-sm font-semibold text-primary",children:n.responsive?.tablet||3})]}),(0,t.jsx)(g.Input,{id:"tabletItems",type:"range",min:2,max:4,step:1,value:n.responsive?.tablet||3,onChange:e=>c("tablet",parseInt(e.target.value)),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Items displayed on medium screens"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(m.Label,{htmlFor:"mobileItems",className:"text-sm font-medium",children:"📱 Mobile (< 640px)"}),(0,t.jsx)("span",{className:"text-sm font-semibold text-primary",children:n.responsive?.mobile||2})]}),(0,t.jsx)(g.Input,{id:"mobileItems",type:"range",min:1,max:3,step:1,value:n.responsive?.mobile||2,onChange:e=>c("mobile",parseInt(e.target.value)),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Items displayed on small screens"})]})]}),(0,t.jsx)("div",{className:"p-4 bg-blue-50 border border-blue-200 rounded-lg",children:(0,t.jsxs)("p",{className:"text-sm text-blue-800",children:[(0,t.jsx)("strong",{children:"💡 Responsive Design:"})," Carousel automatically adjusts based on screen size. Mobile-first approach ensures optimal viewing on all devices."]})})]})}),(0,t.jsx)(f.TabsContent,{value:"behavior",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"space-y-0.5",children:[(0,t.jsx)(m.Label,{htmlFor:"autoplay",className:"text-sm font-medium",children:"Autoplay"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Automatically scroll through products"})]}),(0,t.jsx)(h.Switch,{id:"autoplay",checked:n.autoplay,onCheckedChange:e=>o({autoplay:e})})]}),n.autoplay&&(0,t.jsxs)("div",{className:"space-y-2 p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(m.Label,{htmlFor:"autoplayDelay",className:"text-sm font-medium",children:"Autoplay Speed"}),(0,t.jsxs)("span",{className:"text-sm font-semibold text-primary",children:[(n.autoplayDelay||3e3)/1e3,"s"]})]}),(0,t.jsx)(g.Input,{id:"autoplayDelay",type:"range",min:2e3,max:1e4,step:500,value:n.autoplayDelay||3e3,onChange:e=>o({autoplayDelay:parseInt(e.target.value)}),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Time between slides (2-10 seconds)"})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"space-y-0.5",children:[(0,t.jsx)(m.Label,{htmlFor:"loop",className:"text-sm font-medium",children:"Loop Carousel"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Return to first item after reaching the end"})]}),(0,t.jsx)(h.Switch,{id:"loop",checked:n.loop,onCheckedChange:e=>o({loop:e})})]})]})}),(0,t.jsx)(f.TabsContent,{value:"controls",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"space-y-0.5",children:[(0,t.jsx)(m.Label,{htmlFor:"showNavigation",className:"text-sm font-medium",children:"Navigation Arrows"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Show previous/next buttons"})]}),(0,t.jsx)(h.Switch,{id:"showNavigation",checked:n.showNavigation,onCheckedChange:e=>o({showNavigation:e})})]}),(0,t.jsx)("div",{className:"p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg",children:(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("p",{className:"text-sm font-medium text-gray-900",children:"🎨 Control Preview"}),(0,t.jsx)("div",{className:"flex items-center gap-3 justify-center py-6",children:n.showNavigation&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 border-2 border-gray-200",children:"‹"}),(0,t.jsx)("div",{className:"px-4 py-2 bg-white rounded-lg shadow-sm border text-sm text-gray-600",children:"Product Cards"}),(0,t.jsx)("div",{className:"w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 border-2 border-gray-200",children:"›"})]})}),(0,t.jsx)("p",{className:"text-xs text-gray-600 text-center",children:n.showNavigation?"✓ Navigation arrows enabled":"✗ Navigation arrows hidden"})]})}),(0,t.jsx)("div",{className:"p-4 bg-green-50 border border-green-200 rounded-lg",children:(0,t.jsxs)("p",{className:"text-sm text-green-800",children:[(0,t.jsx)("strong",{children:"👆 Touch Support:"})," Carousel supports touch/swipe gestures on mobile devices automatically."]})})]})})]}),(0,t.jsxs)(u.DialogFooter,{className:"gap-2",children:[(0,t.jsx)(d.Button,{variant:"outline",onClick:()=>a(!1),className:"min-w-[100px]",children:"Cancel"}),(0,t.jsx)(d.Button,{onClick:()=>{i(n),a(!1)},className:"min-w-[100px]",children:"Save Settings"})]})]})})}var j=e.i(586754),w=e.i(579448);let C=({block:e,isEditable:u=!0,onUpdate:m,onDelete:p})=>{let h=e.content,[g,f]=(0,s.useState)(!1),[x,y]=(0,s.useState)(h||{title:"Sản phẩm nổi bật",filterType:"all",itemsToShow:8,showViewAllButton:!0,viewAllLink:"/san-pham",autoplay:!1,autoplayDelay:3e3,loop:!0,showNavigation:!0,responsive:{mobile:2,tablet:3,desktop:4}}),[N,v]=(0,s.useState)(0),$=(0,s.useRef)(null),{data:C,loading:_}=(0,c.useDynamicQuery)("GET_ALL","ext_sanphamhoadon",{fetchPolicy:"cache-first"}),S=C?.getext_sanphamhoadons||[],E=s.default.useMemo(()=>{let e=[...S];switch(x.filterType){case"featured":e=e.filter(e=>!0===e.noibat);break;case"bestseller":e=e.filter(e=>!0===e.banchay);break;case"category":x.category&&(e=e.filter(e=>e.danhmuc===x.category))}return e.slice(0,x.itemsToShow||8)},[S,x.filterType,x.category,x.itemsToShow]),T=()=>{let e=window.innerWidth;return e<640?x.responsive?.mobile||2:e<1024?x.responsive?.tablet||3:x.responsive?.desktop||4},[A,D]=(0,s.useState)(T());(0,s.useEffect)(()=>{let e=()=>{D(T())};return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[x.responsive]),(0,s.useEffect)(()=>{if(!x.autoplay||g)return;let e=setInterval(()=>{I()},x.autoplayDelay||3e3);return()=>clearInterval(e)},[x.autoplay,x.autoplayDelay,N,g]);let O=Math.max(0,E.length-A),I=()=>{v(e=>e>=O?x.loop?0:O:e+1)},P=e=>e.ten||e.tensanpham||"Sản phẩm";return u?(0,t.jsxs)("div",{className:"relative border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/20 group",children:[(0,t.jsxs)("div",{className:"absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10",children:[(0,t.jsxs)(d.Button,{size:"sm",variant:"outline",onClick:()=>f(!0),className:"bg-white shadow-sm hover:bg-blue-50",children:[(0,t.jsx)(l.Settings,{className:"w-4 h-4 mr-1"}),"Settings"]}),(0,t.jsx)(d.Button,{size:"sm",variant:"destructive",onClick:p,className:"shadow-sm",children:(0,t.jsx)(o.Trash2,{className:"w-4 h-4"})})]}),(0,t.jsx)(b,{open:g,onOpenChange:f,settings:x,onSave:e=>{y(e),m(e)}}),(0,t.jsxs)("div",{className:"pointer-events-none",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,t.jsxs)("h2",{className:"text-xl font-bold text-gray-700",children:[x.title||"Sản phẩm"," (Preview)"]}),x.showNavigation&&(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(d.Button,{variant:"outline",size:"icon",disabled:!0,children:(0,t.jsx)(a.ChevronLeft,{className:"w-4 h-4"})}),(0,t.jsx)(d.Button,{variant:"outline",size:"icon",disabled:!0,children:(0,t.jsx)(r.ChevronRight,{className:"w-4 h-4"})})]})]}),(0,t.jsxs)("div",{className:"bg-white p-4 rounded border",children:[(0,t.jsxs)("p",{className:"text-sm text-gray-600",children:["📦 ",E.length," sản phẩm •","all"===x.filterType&&" Tất cả","featured"===x.filterType&&" Nổi bật","bestseller"===x.filterType&&" Bán chạy","category"===x.filterType&&` Danh mục: ${x.category||"Chưa chọn"}`]}),_&&(0,t.jsx)("p",{className:"text-sm text-gray-500 mt-2",children:"Đang tải..."})]})]})]}):(0,t.jsx)("div",{className:"product-carousel-block py-8 px-4 bg-gray-50",children:(0,t.jsxs)("div",{className:"max-w-7xl mx-auto",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,t.jsx)("h2",{className:"text-2xl md:text-3xl font-bold text-gray-900",children:x.title||"Sản phẩm"}),x.showNavigation&&(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(d.Button,{variant:"outline",size:"icon",onClick:()=>{v(e=>e<=0?x.loop?O:0:e-1)},disabled:0===N&&!x.loop,className:"rounded-full",children:(0,t.jsx)(a.ChevronLeft,{className:"w-5 h-5"})}),(0,t.jsx)(d.Button,{variant:"outline",size:"icon",onClick:I,disabled:N>=O&&!x.loop,className:"rounded-full",children:(0,t.jsx)(r.ChevronRight,{className:"w-5 h-5"})})]})]}),(0,t.jsx)("div",{className:"relative overflow-hidden",children:(0,t.jsx)("div",{ref:$,className:"flex transition-transform duration-300 ease-in-out",style:{transform:`translateX(-${100/A*N}%)`},children:E.map(e=>{var s;return(0,t.jsx)("div",{className:"flex-shrink-0 px-2",style:{width:`${100/A}%`},children:(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group",children:[(0,t.jsxs)("div",{className:"relative aspect-square bg-gray-200",children:[e.hinhanh?(0,t.jsx)(j.default,{src:e.hinhanh,alt:P(e),fill:!0,className:"object-cover group-hover:scale-105 transition-transform duration-300"}):(0,t.jsx)("div",{className:"flex items-center justify-center h-full text-gray-400",children:(0,t.jsx)(i.ShoppingCart,{className:"w-12 h-12"})}),(0,t.jsx)("button",{className:"absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg",children:(0,t.jsx)(n.Eye,{className:"w-4 h-4 text-gray-700"})})]}),(0,t.jsxs)("div",{className:"p-4",children:[(0,t.jsx)("h3",{className:"font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]",children:P(e)}),(0,t.jsx)("div",{className:"flex items-center justify-between mb-3",children:(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-lg font-bold text-primary",children:(s=e.gia||e.dongia||0)?new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(s):"0 đ"}),e.donvitinh&&(0,t.jsxs)("p",{className:"text-xs text-gray-500",children:["/",e.donvitinh]})]})}),(0,t.jsxs)(d.Button,{className:"w-full",size:"sm",children:[(0,t.jsx)(i.ShoppingCart,{className:"w-4 h-4 mr-2"}),"Mua ngay"]})]})]})},e.id)})})}),x.showViewAllButton&&x.viewAllLink&&(0,t.jsx)("div",{className:"text-center mt-6",children:(0,t.jsx)(w.default,{href:x.viewAllLink,children:(0,t.jsxs)(d.Button,{variant:"outline",size:"lg",children:["Xem tất cả",(0,t.jsx)(r.ChevronRight,{className:"w-4 h-4 ml-2"})]})})}),_&&(0,t.jsx)("div",{className:"text-center py-8 text-gray-500",children:"Đang tải sản phẩm..."}),!_&&0===E.length&&(0,t.jsx)("div",{className:"text-center py-8 text-gray-500",children:"Không có sản phẩm nào"})]})})};e.s(["ProductCarouselBlock",0,C,"default",0,C],164925)}]);