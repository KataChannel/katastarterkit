module.exports=[939816,a=>{"use strict";let b=(0,a.i(367990).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);a.s(["default",()=>b])},723593,a=>{"use strict";var b=a.i(939816);a.s(["Plus",()=>b.default])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},659683,a=>{"use strict";let b=(0,a.i(367990).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);a.s(["default",()=>b])},519732,a=>{"use strict";var b=a.i(659683);a.s(["RefreshCw",()=>b.default])},52841,a=>{"use strict";let b=(0,a.i(367990).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);a.s(["default",()=>b])},520215,a=>{"use strict";var b=a.i(52841);a.s(["Star",()=>b.default])},29319,a=>{"use strict";let b=(0,a.i(367990).default)("shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);a.s(["default",()=>b])},778775,a=>{"use strict";var b=a.i(29319);a.s(["Shield",()=>b.default])},746048,a=>{"use strict";let b=(0,a.i(367990).default)("truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]);a.s(["default",()=>b])},129853,a=>{"use strict";var b=a.i(746048);a.s(["Truck",()=>b.default])},711670,a=>{"use strict";let b=(0,a.i(367990).default)("minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);a.s(["default",()=>b])},774362,a=>{"use strict";let b=(0,a.i(367990).default)("heart",[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]]);a.s(["default",()=>b])},609914,a=>{"use strict";var b=a.i(711670);a.s(["Minus",()=>b.default])},139312,a=>{"use strict";var b=a.i(774362);a.s(["Heart",()=>b.default])},293217,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`,d=b.gql`
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
`;b.gql`
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
`;let e=b.gql`
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
`,f=b.gql`
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
`,g=b.gql`
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
`,h=b.gql`
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
`,i=b.gql`
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
`,j=b.gql`
  mutation ClearCart {
    clearCart {
      success
      message
    }
  }
`,k=b.gql`
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
`;b.gql`
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
`,b.gql`
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
`,b.gql`
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
`,b.gql`
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
`,b.gql`
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
`,a.s(["ADD_TO_CART",0,g,"CLEAR_CART",0,j,"CREATE_ORDER",0,k,"GET_CART",0,f,"GET_PRODUCTS",0,c,"GET_PRODUCT_BY_SLUG",0,d,"GET_PRODUCT_CATEGORIES",0,e,"REMOVE_FROM_CART",0,i,"UPDATE_CART_ITEM",0,h])},325202,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(8912),f=a.i(53627),g=a.i(734639),h=a.i(439889),i=a.i(293217),j=a.i(543220),k=a.i(139312),l=a.i(520215),m=a.i(609914),n=a.i(723593),o=a.i(129853),p=a.i(778775),q=a.i(519732),r=a.i(189101);function s(){let a=(0,f.useParams)(),s=(0,f.useRouter)(),t=a?.slug,[u,v]=(0,c.useState)(0),[w,x]=(0,c.useState)(null),[y,z]=(0,c.useState)(1),[A,B]=(0,c.useState)("description"),{data:C,loading:D,error:E}=(0,d.useQuery)(i.GET_PRODUCT_BY_SLUG,{variables:{slug:t},skip:!t}),[F,{loading:G}]=(0,e.useMutation)(i.ADD_TO_CART,{refetchQueries:[{query:i.GET_CART}],onCompleted:a=>{a.addToCart.success?r.toast.success("Đã thêm vào giỏ hàng!"):r.toast.error(a.addToCart.message||"Có lỗi xảy ra")},onError:a=>{r.toast.error("Không thể thêm vào giỏ hàng: "+a.message)}});if(D)return(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})});if(E||!C?.productBySlug)return(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("h1",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Không tìm thấy sản phẩm"}),(0,b.jsx)("button",{onClick:()=>s.push("/products"),className:"text-blue-600 hover:underline",children:"← Quay lại danh sách sản phẩm"})]})});let H=C.productBySlug,I=[H.featuredImage,...H.images||[]].filter(Boolean),J=w?H.variants?.find(a=>a.id===w):null,K=J?.price||H.finalPrice,L=J?.stock??H.stock,M=a=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(a),N=async()=>{if(0===L)return void r.toast.error("Sản phẩm đã hết hàng");if(y>L)return void r.toast.error(`Chỉ c\xf2n ${L} sản phẩm`);try{await F({variables:{input:{productId:H.id,variantId:w,quantity:y}}})}catch(a){}};return(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,b.jsx)("div",{className:"bg-white border-b",children:(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-600",children:[(0,b.jsx)(h.default,{href:"/",className:"hover:text-blue-600",children:"Trang chủ"}),(0,b.jsx)("span",{children:"/"}),(0,b.jsx)(h.default,{href:"/products",className:"hover:text-blue-600",children:"Sản phẩm"}),H.category&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("span",{children:"/"}),(0,b.jsx)(h.default,{href:`/products?category=${H.category.id}`,className:"hover:text-blue-600",children:H.category.name})]}),(0,b.jsx)("span",{children:"/"}),(0,b.jsx)("span",{className:"text-gray-900 font-medium",children:H.name})]})})}),(0,b.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-sm p-6",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100",children:[I[u]&&(0,b.jsx)(g.default,{src:I[u],alt:H.name,fill:!0,className:"object-contain",priority:!0}),H.discount>0&&(0,b.jsxs)("span",{className:"absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md font-bold",children:["-",H.discount,"%"]})]}),I.length>1&&(0,b.jsx)("div",{className:"flex gap-2 overflow-x-auto pb-2",children:I.map((a,c)=>(0,b.jsx)("button",{onClick:()=>v(c),className:`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition ${u===c?"border-blue-600":"border-gray-200 hover:border-gray-300"}`,children:(0,b.jsx)(g.default,{src:a,alt:`${H.name} ${c+1}`,fill:!0,className:"object-cover"})},c))})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:H.name}),(0,b.jsxs)("div",{className:"flex items-center gap-4 mb-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[[void 0,void 0,void 0,void 0,void 0].map((a,c)=>(0,b.jsx)(l.Star,{className:`h-5 w-5 ${c<Math.floor(H.rating)?"fill-yellow-400 text-yellow-400":"text-gray-300"}`},c)),(0,b.jsxs)("span",{className:"ml-2 text-gray-600",children:[H.rating.toFixed(1)," (",H.reviewCount," đánh giá)"]})]}),(0,b.jsx)("span",{className:"text-gray-400",children:"|"}),(0,b.jsxs)("span",{className:"text-gray-600",children:[H.viewCount," lượt xem"]})]}),(0,b.jsx)("div",{className:"bg-gray-50 rounded-lg p-4 mb-6",children:(0,b.jsxs)("div",{className:"flex items-baseline gap-3",children:[(0,b.jsx)("span",{className:"text-3xl font-bold text-blue-600",children:M(K)}),H.compareAtPrice>H.finalPrice&&(0,b.jsx)("span",{className:"text-lg text-gray-400 line-through",children:M(H.compareAtPrice)})]})}),H.shortDescription&&(0,b.jsx)("p",{className:"text-gray-700 mb-6",children:H.shortDescription}),H.variants&&H.variants.length>0&&(0,b.jsxs)("div",{className:"mb-6",children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-900 mb-2",children:"Chọn phân loại:"}),(0,b.jsx)("div",{className:"flex flex-wrap gap-2",children:H.variants.map(a=>(0,b.jsxs)("button",{onClick:()=>x(a.id),className:`px-4 py-2 border rounded-md transition ${w===a.id?"border-blue-600 bg-blue-50 text-blue-700 font-medium":"border-gray-300 hover:border-gray-400"} ${0===a.stock?"opacity-50 cursor-not-allowed":""}`,disabled:0===a.stock,children:[a.name,0===a.stock&&" (Hết hàng)"]},a.id))})]}),(0,b.jsxs)("div",{className:"mb-6",children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-900 mb-2",children:"Số lượng:"}),(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsxs)("div",{className:"flex items-center border border-gray-300 rounded-md",children:[(0,b.jsx)("button",{onClick:()=>z(Math.max(1,y-1)),className:"p-2 hover:bg-gray-50 transition",disabled:y<=1,children:(0,b.jsx)(m.Minus,{className:"h-4 w-4"})}),(0,b.jsx)("input",{type:"number",value:y,onChange:a=>z(Math.max(1,parseInt(a.target.value)||1)),className:"w-16 text-center border-x border-gray-300 py-2",min:"1",max:L}),(0,b.jsx)("button",{onClick:()=>z(Math.min(L,y+1)),className:"p-2 hover:bg-gray-50 transition",disabled:y>=L,children:(0,b.jsx)(n.Plus,{className:"h-4 w-4"})})]}),(0,b.jsx)("span",{className:"text-sm text-gray-600",children:L>0?`${L} sản phẩm c\xf3 sẵn`:"Hết hàng"})]})]}),(0,b.jsxs)("div",{className:"flex gap-3 mb-6",children:[(0,b.jsxs)("button",{onClick:N,disabled:0===L||G,className:"flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium",children:[(0,b.jsx)(j.ShoppingCart,{className:"h-5 w-5"}),G?"Đang thêm...":"Thêm vào giỏ"]}),(0,b.jsx)("button",{className:"px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium",children:"Mua ngay"}),(0,b.jsx)("button",{className:"p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition",children:(0,b.jsx)(k.Heart,{className:"h-6 w-6 text-gray-600"})})]}),(0,b.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(o.Truck,{className:"h-6 w-6 text-blue-600"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-gray-900",children:"Giao hàng nhanh"}),(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"2-3 ngày"})]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(p.Shield,{className:"h-6 w-6 text-green-600"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-gray-900",children:"Bảo hành"}),(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"12 tháng"})]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(q.RefreshCw,{className:"h-6 w-6 text-orange-600"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-gray-900",children:"Đổi trả"}),(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Trong 7 ngày"})]})]})]})]})]}),(0,b.jsxs)("div",{className:"mt-8 bg-white rounded-lg shadow-sm",children:[(0,b.jsx)("div",{className:"border-b",children:(0,b.jsx)("div",{className:"flex gap-8 px-6",children:["description","specifications","reviews"].map(a=>(0,b.jsxs)("button",{onClick:()=>B(a),className:`py-4 border-b-2 transition ${A===a?"border-blue-600 text-blue-600 font-medium":"border-transparent text-gray-600 hover:text-gray-900"}`,children:["description"===a&&"Mô tả","specifications"===a&&"Thông số kỹ thuật","reviews"===a&&`Đ\xe1nh gi\xe1 (${H.reviewCount})`]},a))})}),(0,b.jsxs)("div",{className:"p-6",children:["description"===A&&(0,b.jsx)("div",{className:"prose max-w-none",dangerouslySetInnerHTML:{__html:H.description||"Chưa có mô tả"}}),"specifications"===A&&(0,b.jsx)("div",{children:H.specifications?(0,b.jsx)("dl",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:Object.entries(H.specifications).map(([a,c])=>(0,b.jsxs)("div",{className:"border-b pb-2",children:[(0,b.jsx)("dt",{className:"text-sm font-medium text-gray-900",children:a}),(0,b.jsx)("dd",{className:"mt-1 text-sm text-gray-600",children:c})]},a))}):(0,b.jsx)("p",{className:"text-gray-500",children:"Chưa có thông số kỹ thuật"})}),"reviews"===A&&(0,b.jsx)("div",{children:(0,b.jsx)("p",{className:"text-gray-500",children:"Chức năng đánh giá đang được phát triển"})})]})]}),H.relatedProducts&&H.relatedProducts.length>0&&(0,b.jsxs)("div",{className:"mt-8",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold text-gray-900 mb-6",children:"Sản phẩm liên quan"}),(0,b.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",children:H.relatedProducts.map(a=>(0,b.jsxs)(h.default,{href:`/products/${a.slug}`,className:"bg-white rounded-lg shadow-sm hover:shadow-md transition p-4",children:[(0,b.jsx)("div",{className:"relative aspect-square rounded-md overflow-hidden mb-3",children:(0,b.jsx)(g.default,{src:a.featuredImage||"/placeholder-product.jpg",alt:a.name,fill:!0,className:"object-cover"})}),(0,b.jsx)("h3",{className:"font-medium text-gray-900 text-sm mb-2 line-clamp-2",children:a.name}),(0,b.jsx)("p",{className:"text-blue-600 font-bold",children:M(a.finalPrice)})]},a.id))})]})]})]})}a.s(["default",()=>s])}];

//# sourceMappingURL=_2f72fe06._.js.map