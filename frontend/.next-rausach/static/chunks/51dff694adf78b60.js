(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,46034,e=>{"use strict";let t=(0,e.i(930702).default)("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]);e.s(["default",()=>t])},173416,e=>{"use strict";var t=e.i(46034);e.s(["Filter",()=>t.default])},674181,e=>{"use strict";let t=(0,e.i(930702).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);e.s(["default",()=>t])},553579,e=>{"use strict";var t=e.i(674181);e.s(["Star",()=>t.default])},49316,(e,t,r)=>{"use strict";function a({widthInt:e,heightInt:t,blurWidth:r,blurHeight:a,blurDataURL:s,objectFit:i}){let n=r?40*r:e,l=a?40*a:t,d=n&&l?`viewBox='0 0 ${n} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${d}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${d?"none":"contain"===i?"xMidYMid":"cover"===i?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${s}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return a}})},596974,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={VALID_LOADERS:function(){return i},imageConfigDefault:function(){return n}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let i=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},473733,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return d}}),e.r(715200);let a=e.r(49316),s=e.r(596974),i=["-moz-initial","fill","none","scale-down",void 0];function n(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function d({src:e,sizes:t,unoptimized:r=!1,priority:d=!1,preload:o=!1,loading:c,className:u,quality:m,width:p,height:g,fill:f=!1,style:h,overrideSrc:x,onLoad:b,onLoadingComplete:y,placeholder:v="empty",blurDataURL:j,fetchPriority:w,decoding:_="async",layout:C,objectFit:N,objectPosition:P,lazyBoundary:I,lazyRoot:S,...O},E){var R;let $,A,k,{imgConf:T,showAltText:M,blurComplete:q,defaultLoader:D}=E,z=T||s.imageConfigDefault;if("allSizes"in z)$=z;else{let e=[...z.deviceSizes,...z.imageSizes].sort((e,t)=>e-t),t=z.deviceSizes.sort((e,t)=>e-t),r=z.qualities?.sort((e,t)=>e-t);$={...z,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===D)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let G=O.loader||D;delete O.loader,delete O.srcSet;let F="__next_img_default"in G;if(F){if("custom"===$.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=G;G=t=>{let{config:r,...a}=t;return e(a)}}if(C){"fill"===C&&(f=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[C];e&&(h={...h,...e});let r={responsive:"100vw",fill:"100vw"}[C];r&&!t&&(t=r)}let U="",L=l(p),B=l(g);if((R=e)&&"object"==typeof R&&(n(R)||void 0!==R.src)){let t=n(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(A=t.blurWidth,k=t.blurHeight,j=j||t.blurDataURL,U=t.src,!f)if(L||B){if(L&&!B){let e=L/t.width;B=Math.round(t.height*e)}else if(!L&&B){let e=B/t.height;L=Math.round(t.width*e)}}else L=t.width,B=t.height}let V=!d&&!o&&("lazy"===c||void 0===c);(!(e="string"==typeof e?e:U)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,V=!1),$.unoptimized&&(r=!0),F&&!$.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let H=l(m),W=Object.assign(f?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:N,objectPosition:P}:{},M?{}:{color:"transparent"},h),X=q||"empty"===v?null:"blur"===v?`url("data:image/svg+xml;charset=utf-8,${(0,a.getImageBlurSvg)({widthInt:L,heightInt:B,blurWidth:A,blurHeight:k,blurDataURL:j||"",objectFit:W.objectFit})}")`:`url("${v}")`,K=i.includes(W.objectFit)?"fill"===W.objectFit?"100% 100%":"cover":W.objectFit,Q=X?{backgroundSize:K,backgroundPosition:W.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:X}:{},Y=function({config:e,src:t,unoptimized:r,width:a,quality:s,sizes:i,loader:n}){if(r)return{src:t,srcSet:void 0,sizes:void 0};let{widths:l,kind:d}=function({deviceSizes:e,allSizes:t},r,a){if(a){let r=/(^|\s)(1?\d?\d)vw/g,s=[];for(let e;e=r.exec(a);)s.push(parseInt(e[2]));if(s.length){let r=.01*Math.min(...s);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,a,i),o=l.length-1;return{sizes:i||"w"!==d?i:"100vw",srcSet:l.map((r,a)=>`${n({config:e,src:t,quality:s,width:r})} ${"w"===d?r:a+1}${d}`).join(", "),src:n({config:e,src:t,quality:s,width:l[o]})}}({config:$,src:e,unoptimized:r,width:L,quality:H,sizes:t,loader:G}),J=V?"lazy":c;return{props:{...O,loading:J,fetchPriority:w,width:L,height:B,decoding:_,className:u,style:{...W,...Q},sizes:Y.sizes,srcSet:Y.srcSet,src:x||Y.src},meta:{unoptimized:r,preload:o||d,placeholder:v,fill:f}}}},805690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return l}});let a=e.r(403055),s="undefined"==typeof window,i=s?()=>{}:a.useLayoutEffect,n=s?()=>{}:a.useEffect;function l(e){let{headManager:t,reduceComponentsToState:r}=e;function l(){if(t&&t.mountedInstances){let e=a.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return s&&(t?.mountedInstances?.add(e.children),l()),i(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),i(()=>(t&&(t._pendingUpdate=l),()=>{t&&(t._pendingUpdate=l)})),n(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},308112,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return f},defaultHead:function(){return u}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let i=e.r(940192),n=e.r(475244),l=e.r(44990),d=n._(e.r(403055)),o=i._(e.r(805690)),c=e.r(525989);function u(){return[(0,l.jsx)("meta",{charSet:"utf-8"},"charset"),(0,l.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function m(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===d.default.Fragment?e.concat(d.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(715200);let p=["name","httpEquiv","charSet","itemProp"];function g(e){let t,r,a,s;return e.reduce(m,[]).reverse().concat(u().reverse()).filter((t=new Set,r=new Set,a=new Set,s={},e=>{let i=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?i=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?i=!1:r.add(e.type);break;case"meta":for(let t=0,r=p.length;t<r;t++){let r=p[t];if(e.props.hasOwnProperty(r))if("charSet"===r)a.has(r)?i=!1:a.add(r);else{let t=e.props[r],a=s[r]||new Set;("name"!==r||!n)&&a.has(t)?i=!1:(a.add(t),s[r]=a)}}}return i})).reverse().map((e,t)=>{let r=e.key||t;return d.default.cloneElement(e,{key:r})})}let f=function({children:e}){let t=(0,d.useContext)(c.HeadManagerContext);return(0,l.jsx)(o.default,{reduceComponentsToState:g,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},238369,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return i}});let a=e.r(940192)._(e.r(403055)),s=e.r(596974),i=a.default.createContext(s.imageConfigDefault)},420539,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return a}});let a=e.r(940192)._(e.r(403055)).default.createContext(null)},659556,(e,t,r)=>{"use strict";function a(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,0):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return a}})},103342,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return i}});let a=e.r(659556);function s({config:e,src:t,width:r,quality:s}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let i=(0,a.findClosestQuality)(s,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${i}${t.startsWith("/_next/static/media/"),""}`}s.__next_img_default=!0;let i=s},894595,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return v}});let a=e.r(940192),s=e.r(475244),i=e.r(44990),n=s._(e.r(403055)),l=a._(e.r(940392)),d=a._(e.r(308112)),o=e.r(473733),c=e.r(596974),u=e.r(238369);e.r(715200);let m=e.r(420539),p=a._(e.r(103342)),g=e.r(527304),f={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function h(e,t,r,a,s,i,n){let l=e?.src;e&&e["data-loaded-src"]!==l&&(e["data-loaded-src"]=l,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&s(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let a=!1,s=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>a,isPropagationStopped:()=>s,persist:()=>{},preventDefault:()=>{a=!0,t.preventDefault()},stopPropagation:()=>{s=!0,t.stopPropagation()}})}a?.current&&a.current(e)}}))}function x(e){return n.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let b=(0,n.forwardRef)(({src:e,srcSet:t,sizes:r,height:a,width:s,decoding:l,className:d,style:o,fetchPriority:c,placeholder:u,loading:m,unoptimized:p,fill:f,onLoadRef:b,onLoadingCompleteRef:y,setBlurComplete:v,setShowAltText:j,sizesInput:w,onLoad:_,onError:C,...N},P)=>{let I=(0,n.useCallback)(e=>{e&&(C&&(e.src=e.src),e.complete&&h(e,u,b,y,v,p,w))},[e,u,b,y,v,C,p,w]),S=(0,g.useMergedRef)(P,I);return(0,i.jsx)("img",{...N,...x(c),loading:m,width:s,height:a,decoding:l,"data-nimg":f?"fill":"1",className:d,style:o,sizes:r,srcSet:t,src:e,ref:S,onLoad:e=>{h(e.currentTarget,u,b,y,v,p,w)},onError:e=>{j(!0),"empty"!==u&&v(!0),C&&C(e)}})});function y({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&l.default.preload?(l.default.preload(t.src,r),null):(0,i.jsx)(d.default,{children:(0,i.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let v=(0,n.forwardRef)((e,t)=>{let r=(0,n.useContext)(m.RouterContext),a=(0,n.useContext)(u.ImageConfigContext),s=(0,n.useMemo)(()=>{let e=f||a||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),s=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:s,localPatterns:"undefined"==typeof window?a?.localPatterns:e.localPatterns}},[a]),{onLoad:l,onLoadingComplete:d}=e,g=(0,n.useRef)(l);(0,n.useEffect)(()=>{g.current=l},[l]);let h=(0,n.useRef)(d);(0,n.useEffect)(()=>{h.current=d},[d]);let[x,v]=(0,n.useState)(!1),[j,w]=(0,n.useState)(!1),{props:_,meta:C}=(0,o.getImgProps)(e,{defaultLoader:p.default,imgConf:s,blurComplete:x,showAltText:j});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(b,{..._,unoptimized:C.unoptimized,placeholder:C.placeholder,fill:C.fill,onLoadRef:g,onLoadingCompleteRef:h,setBlurComplete:v,setShowAltText:w,sizesInput:e.sizes,ref:t}),C.preload?(0,i.jsx)(y,{isAppRouter:!r,imgAttributes:_}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},211684,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return c},getImageProps:function(){return o}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let i=e.r(940192),n=e.r(473733),l=e.r(894595),d=i._(e.r(103342));function o(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:d.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let c=l.Image},586754,(e,t,r)=>{t.exports=e.r(211684)},322772,e=>{"use strict";let t=(0,e.i(930702).default)("heart",[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]]);e.s(["default",()=>t])},187588,e=>{"use strict";var t=e.i(322772);e.s(["Heart",()=>t.default])},821843,e=>{"use strict";var t=e.i(984804);let r=t.gql`
  query GetProducts($input: GetProductsInput) {
    products(input: $input) {
      items {
        id
        name
        slug
        description
        shortDesc
        price
        originalPrice
        costPrice
        sku
        barcode
        stock
        minStock
        maxStock
        unit
        weight
        origin
        status
        categoryId
        thumbnail
        attributes
        metaTitle
        metaDescription
        metaKeywords
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
        displayOrder
        category {
          id
          name
          slug
        }
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
      hasMore
    }
  }
`,a=t.gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      slug
      description
      shortDesc
      price
      originalPrice
      costPrice
      sku
      barcode
      stock
      minStock
      maxStock
      unit
      weight
      origin
      status
      categoryId
      thumbnail
      attributes
      metaTitle
      metaDescription
      metaKeywords
      isFeatured
      isNewArrival
      isBestSeller
      isOnSale
      displayOrder
      category {
        id
        name
        slug
        description
      }
      createdAt
      updatedAt
    }
  }
`;t.gql`
  query GetFeaturedProducts($input: GetProductsInput) {
    products(input: $input) {
      items {
        id
        name
        slug
        shortDesc
        price
        originalPrice
        thumbnail
        stock
        isFeatured
        category {
          id
          name
          slug
        }
      }
      total
    }
  }
`;let s=t.gql`
  query GetProductCategories($input: GetCategoriesInput) {
    categories(input: $input) {
      items {
        id
        name
        slug
        description
        thumbnail
        parentId
        children {
          id
          name
          slug
        }
      }
      total
    }
  }
`,i=t.gql`
  query GetCart($sessionId: String) {
    getCart(sessionId: $sessionId) {
      id
      userId
      sessionId
      items {
        id
        cartId
        productId
        variantId
        quantity
        price
        product {
          id
          name
          slug
          price
          thumbnail
          stock
        }
      }
      subtotal
      discount
      tax
      total
      couponCode
      createdAt
      updatedAt
    }
  }
`,n=t.gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      success
      message
      cart {
        id
        items {
          id
          quantity
          price
          product {
            id
            name
            featuredImage
          }
        }
        totalItems
        total
      }
    }
  }
`,l=t.gql`
  mutation UpdateCartItem($itemId: ID!, $quantity: Int!) {
    updateCartItem(itemId: $itemId, quantity: $quantity) {
      success
      message
      cart {
        id
        items {
          id
          quantity
          price
        }
        totalItems
        total
      }
    }
  }
`,d=t.gql`
  mutation RemoveFromCart($itemId: ID!) {
    removeFromCart(itemId: $itemId) {
      success
      message
      cart {
        id
        totalItems
        total
      }
    }
  }
`,o=t.gql`
  mutation ClearCart {
    clearCart {
      success
      message
    }
  }
`,c=t.gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      success
      message
      order {
        id
        orderNumber
        status
        total
        paymentMethod
        shippingAddress {
          fullName
          phone
          address
        }
        items {
          id
          quantity
          price
          product {
            name
            featuredImage
          }
        }
        createdAt
      }
    }
  }
`;t.gql`
  query GetOrder($orderId: ID!) {
    order(orderId: $orderId) {
      id
      orderNumber
      status
      paymentStatus
      shippingStatus
      subtotal
      discount
      shippingFee
      total
      paymentMethod
      shippingMethod
      shippingAddress {
        fullName
        phone
        email
        address
        city
        district
        ward
      }
      billingAddress {
        fullName
        phone
        email
        address
      }
      items {
        id
        quantity
        price
        product {
          name
          slug
          featuredImage
        }
        variant {
          name
        }
      }
      tracking {
        trackingNumber
        status
        events {
          status
          description
          location
          eventTime
        }
      }
      createdAt
      updatedAt
    }
  }
`,t.gql`
  query GetMyOrders($skip: Int, $take: Int) {
    getMyOrders(skip: $skip, take: $take) {
      success
      message
      orders {
        id
        orderNumber
        status
        total
        createdAt
        updatedAt
      }
      total
      hasMore
    }
  }
`,t.gql`
  mutation CancelOrder($input: CancelOrderInput!) {
    cancelOrder(input: $input) {
      success
      message
      order {
        id
        orderNumber
        status
      }
    }
  }
`,t.gql`
  query GetProductReviews($productId: ID!, $page: Int, $limit: Int, $rating: Int) {
    productReviews(productId: $productId, page: $page, limit: $limit, rating: $rating) {
      items {
        id
        productId
        userId
        rating
        title
        comment
        images
        isVerifiedPurchase
        isApproved
        helpfulCount
        user {
          id
          email
          fullName
        }
        createdAt
        updatedAt
      }
      total
      page
      pageSize
      totalPages
      hasMore
    }
  }
`,t.gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      productId
      userId
      rating
      title
      comment
      images
      isVerifiedPurchase
      isApproved
      helpfulCount
      createdAt
      updatedAt
    }
  }
`,e.s(["ADD_TO_CART",0,n,"CLEAR_CART",0,o,"CREATE_ORDER",0,c,"GET_CART",0,i,"GET_PRODUCTS",0,r,"GET_PRODUCT_BY_SLUG",0,a,"GET_PRODUCT_CATEGORIES",0,s,"REMOVE_FROM_CART",0,d,"UPDATE_CART_ITEM",0,l])},980203,e=>{"use strict";var t=e.i(44990),r=e.i(403055),a=e.i(429105),s=e.i(579448),i=e.i(586754),n=e.i(821843),l=e.i(202774),d=e.i(187588),o=e.i(553579),c=e.i(173416),u=e.i(850384);function m(){let[e,m]=(0,r.useState)(1),[p,g]=(0,r.useState)(null),[f,h]=(0,r.useState)("newest"),[x,b]=(0,r.useState)(""),[y,v]=(0,r.useState)([0,1e7]),[j,w]=(0,r.useState)(!0),{data:_,loading:C,error:N}=(0,a.useQuery)(n.GET_PRODUCTS,{variables:{input:{page:e,limit:12,sortBy:f,sortOrder:"desc",filters:{categoryId:p||void 0,search:x||void 0,minPrice:y[0],maxPrice:y[1],inStock:!0}}}}),{data:P}=(0,a.useQuery)(n.GET_PRODUCT_CATEGORIES,{variables:{input:{page:1,limit:100}}}),I=_?.products?.items||[],S=_?.products?.total||0,O=_?.products?.hasMore||!1,E=P?.categories?.items||[],R=e=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(e);return(0,t.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,t.jsx)("div",{className:"bg-white shadow-sm",children:(0,t.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",children:[(0,t.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Sản phẩm"}),(0,t.jsxs)("p",{className:"mt-2 text-gray-600",children:["Tìm thấy ",S," sản phẩm"]})]})}),(0,t.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,t.jsxs)("div",{className:"flex gap-8",children:[(0,t.jsx)("aside",{className:`w-64 flex-shrink-0 ${j?"block":"hidden"} lg:block`,children:(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6 sticky top-4",children:[(0,t.jsxs)("div",{className:"mb-6",children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Tìm kiếm"}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)("input",{type:"text",value:x,onChange:e=>b(e.target.value),placeholder:"Tìm sản phẩm...",className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"}),(0,t.jsx)(u.Search,{className:"absolute left-3 top-2.5 h-5 w-5 text-gray-400"})]})]}),(0,t.jsxs)("div",{className:"mb-6",children:[(0,t.jsx)("h3",{className:"text-sm font-medium text-gray-900 mb-3",children:"Danh mục"}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("button",{onClick:()=>g(null),className:`w-full text-left px-3 py-2 rounded-md transition ${null===p?"bg-blue-50 text-blue-700 font-medium":"text-gray-700 hover:bg-gray-50"}`,children:"Tất cả"}),E.map(e=>(0,t.jsxs)("button",{onClick:()=>g(e.id),className:`w-full text-left px-3 py-2 rounded-md transition ${p===e.id?"bg-blue-50 text-blue-700 font-medium":"text-gray-700 hover:bg-gray-50"}`,children:[e.name,(0,t.jsxs)("span",{className:"text-xs text-gray-500 ml-2",children:["(",e._count?.products||0,")"]})]},e.id))]})]}),(0,t.jsxs)("div",{className:"mb-6",children:[(0,t.jsx)("h3",{className:"text-sm font-medium text-gray-900 mb-3",children:"Khoảng giá"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("input",{type:"range",min:"0",max:"10000000",step:"100000",value:y[1],onChange:e=>v([0,parseInt(e.target.value)]),className:"w-full"}),(0,t.jsxs)("div",{className:"flex justify-between text-sm text-gray-600",children:[(0,t.jsx)("span",{children:R(0)}),(0,t.jsx)("span",{children:R(y[1])})]})]})]}),(0,t.jsx)("button",{onClick:()=>{g(null),b(""),v([0,1e7]),h("newest")},className:"w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition",children:"Xóa bộ lọc"})]})}),(0,t.jsxs)("main",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between",children:[(0,t.jsxs)("button",{onClick:()=>w(!j),className:"lg:hidden flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50",children:[(0,t.jsx)(c.Filter,{className:"h-5 w-5"}),"Bộ lọc"]}),(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsx)("label",{className:"text-sm text-gray-700",children:"Sắp xếp:"}),(0,t.jsxs)("select",{value:f,onChange:e=>h(e.target.value),className:"px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",children:[(0,t.jsx)("option",{value:"newest",children:"Mới nhất"}),(0,t.jsx)("option",{value:"price_asc",children:"Giá thấp đến cao"}),(0,t.jsx)("option",{value:"price_desc",children:"Giá cao đến thấp"}),(0,t.jsx)("option",{value:"popular",children:"Phổ biến nhất"}),(0,t.jsx)("option",{value:"rating",children:"Đánh giá cao"})]})]})]}),C&&(0,t.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:[...Array(6)].map((e,r)=>(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-4 animate-pulse",children:[(0,t.jsx)("div",{className:"bg-gray-200 h-48 rounded-md mb-4"}),(0,t.jsx)("div",{className:"bg-gray-200 h-4 rounded mb-2"}),(0,t.jsx)("div",{className:"bg-gray-200 h-4 rounded w-2/3"})]},r))}),N&&(0,t.jsxs)("div",{className:"bg-red-50 text-red-700 p-4 rounded-lg",children:["Có lỗi xảy ra: ",N.message]}),!C&&I.length>0&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:I.map(e=>(0,t.jsxs)(s.default,{href:`/products/${e.slug}`,className:"bg-white rounded-lg shadow-sm hover:shadow-md transition group",children:[(0,t.jsxs)("div",{className:"relative aspect-square overflow-hidden rounded-t-lg",children:[(0,t.jsx)(i.default,{src:e.featuredImage||"/placeholder-product.jpg",alt:e.name,fill:!0,className:"object-cover group-hover:scale-105 transition duration-300"}),e.discount>0&&(0,t.jsxs)("span",{className:"absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold",children:["-",e.discount,"%"]}),e.isFeatured&&(0,t.jsx)("span",{className:"absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold",children:"HOT"})]}),(0,t.jsxs)("div",{className:"p-4",children:[(0,t.jsx)("h3",{className:"font-semibold text-gray-900 mb-1 line-clamp-2",children:e.name}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mb-2",children:e.category?.name}),(0,t.jsxs)("div",{className:"flex items-center gap-1 mb-2",children:[(0,t.jsx)("div",{className:"flex items-center",children:[void 0,void 0,void 0,void 0,void 0].map((r,a)=>(0,t.jsx)(o.Star,{className:`h-4 w-4 ${a<Math.floor(e.rating)?"fill-yellow-400 text-yellow-400":"text-gray-300"}`},a))}),(0,t.jsxs)("span",{className:"text-xs text-gray-500",children:["(",e.reviewCount,")"]})]}),(0,t.jsx)("div",{className:"mb-3",children:(0,t.jsxs)("div",{className:"flex items-baseline gap-2",children:[(0,t.jsx)("span",{className:"text-lg font-bold text-blue-600",children:R(e.finalPrice)}),e.compareAtPrice>e.finalPrice&&(0,t.jsx)("span",{className:"text-sm text-gray-400 line-through",children:R(e.compareAtPrice)})]})}),(0,t.jsx)("div",{className:"text-xs mb-3",children:e.stock>0?(0,t.jsxs)("span",{className:"text-green-600",children:["Còn hàng (",e.stock,")"]}):(0,t.jsx)("span",{className:"text-red-600",children:"Hết hàng"})}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)("button",{onClick:e=>{e.preventDefault()},disabled:0===e.stock,className:"flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition",children:[(0,t.jsx)(l.ShoppingCart,{className:"h-4 w-4"}),"Thêm"]}),(0,t.jsx)("button",{onClick:e=>{e.preventDefault()},className:"p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition",children:(0,t.jsx)(d.Heart,{className:"h-5 w-5 text-gray-600"})})]})]})]},e.id))}),(0,t.jsxs)("div",{className:"mt-8 flex justify-center gap-2",children:[(0,t.jsx)("button",{onClick:()=>m(Math.max(1,e-1)),disabled:1===e,className:"px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Trước"}),(0,t.jsxs)("span",{className:"px-4 py-2 text-gray-700",children:["Trang ",e]}),(0,t.jsx)("button",{onClick:()=>m(e+1),disabled:!O,className:"px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Sau"})]})]}),!C&&0===I.length&&(0,t.jsx)("div",{className:"text-center py-12",children:(0,t.jsx)("p",{className:"text-gray-500",children:"Không tìm thấy sản phẩm nào"})})]})]})})]})}e.s(["default",()=>m])}]);