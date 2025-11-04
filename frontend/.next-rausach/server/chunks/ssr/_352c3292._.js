module.exports=[872466,a=>{"use strict";let b=(0,a.i(367990).default)("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]);a.s(["default",()=>b])},681768,a=>{"use strict";var b=a.i(872466);a.s(["Filter",()=>b.default])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},52841,a=>{"use strict";let b=(0,a.i(367990).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);a.s(["default",()=>b])},520215,a=>{"use strict";var b=a.i(52841);a.s(["Star",()=>b.default])},774362,a=>{"use strict";let b=(0,a.i(367990).default)("heart",[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]]);a.s(["default",()=>b])},139312,a=>{"use strict";var b=a.i(774362);a.s(["Heart",()=>b.default])},293217,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`,a.s(["ADD_TO_CART",0,g,"CLEAR_CART",0,j,"CREATE_ORDER",0,k,"GET_CART",0,f,"GET_PRODUCTS",0,c,"GET_PRODUCT_BY_SLUG",0,d,"GET_PRODUCT_CATEGORIES",0,e,"REMOVE_FROM_CART",0,i,"UPDATE_CART_ITEM",0,h])},812608,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(439889),f=a.i(734639),g=a.i(293217),h=a.i(543220),i=a.i(139312),j=a.i(520215),k=a.i(681768),l=a.i(629432);function m(){let[a,m]=(0,c.useState)(1),[n,o]=(0,c.useState)(null),[p,q]=(0,c.useState)("newest"),[r,s]=(0,c.useState)(""),[t,u]=(0,c.useState)([0,1e7]),[v,w]=(0,c.useState)(!0),{data:x,loading:y,error:z}=(0,d.useQuery)(g.GET_PRODUCTS,{variables:{input:{page:a,limit:12,sortBy:p,sortOrder:"desc",filters:{categoryId:n||void 0,search:r||void 0,minPrice:t[0],maxPrice:t[1],inStock:!0}}}}),{data:A}=(0,d.useQuery)(g.GET_PRODUCT_CATEGORIES,{variables:{input:{page:1,limit:100}}}),B=x?.products?.items||[],C=x?.products?.total||0,D=x?.products?.hasMore||!1,E=A?.categories?.items||[],F=a=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(a);return(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,b.jsx)("div",{className:"bg-white shadow-sm",children:(0,b.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",children:[(0,b.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Sản phẩm"}),(0,b.jsxs)("p",{className:"mt-2 text-gray-600",children:["Tìm thấy ",C," sản phẩm"]})]})}),(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,b.jsxs)("div",{className:"flex gap-8",children:[(0,b.jsx)("aside",{className:`w-64 flex-shrink-0 ${v?"block":"hidden"} lg:block`,children:(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6 sticky top-4",children:[(0,b.jsxs)("div",{className:"mb-6",children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Tìm kiếm"}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)("input",{type:"text",value:r,onChange:a=>s(a.target.value),placeholder:"Tìm sản phẩm...",className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"}),(0,b.jsx)(l.Search,{className:"absolute left-3 top-2.5 h-5 w-5 text-gray-400"})]})]}),(0,b.jsxs)("div",{className:"mb-6",children:[(0,b.jsx)("h3",{className:"text-sm font-medium text-gray-900 mb-3",children:"Danh mục"}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)("button",{onClick:()=>o(null),className:`w-full text-left px-3 py-2 rounded-md transition ${null===n?"bg-blue-50 text-blue-700 font-medium":"text-gray-700 hover:bg-gray-50"}`,children:"Tất cả"}),E.map(a=>(0,b.jsxs)("button",{onClick:()=>o(a.id),className:`w-full text-left px-3 py-2 rounded-md transition ${n===a.id?"bg-blue-50 text-blue-700 font-medium":"text-gray-700 hover:bg-gray-50"}`,children:[a.name,(0,b.jsxs)("span",{className:"text-xs text-gray-500 ml-2",children:["(",a._count?.products||0,")"]})]},a.id))]})]}),(0,b.jsxs)("div",{className:"mb-6",children:[(0,b.jsx)("h3",{className:"text-sm font-medium text-gray-900 mb-3",children:"Khoảng giá"}),(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsx)("input",{type:"range",min:"0",max:"10000000",step:"100000",value:t[1],onChange:a=>u([0,parseInt(a.target.value)]),className:"w-full"}),(0,b.jsxs)("div",{className:"flex justify-between text-sm text-gray-600",children:[(0,b.jsx)("span",{children:F(0)}),(0,b.jsx)("span",{children:F(t[1])})]})]})]}),(0,b.jsx)("button",{onClick:()=>{o(null),s(""),u([0,1e7]),q("newest")},className:"w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition",children:"Xóa bộ lọc"})]})}),(0,b.jsxs)("main",{className:"flex-1",children:[(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between",children:[(0,b.jsxs)("button",{onClick:()=>w(!v),className:"lg:hidden flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50",children:[(0,b.jsx)(k.Filter,{className:"h-5 w-5"}),"Bộ lọc"]}),(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsx)("label",{className:"text-sm text-gray-700",children:"Sắp xếp:"}),(0,b.jsxs)("select",{value:p,onChange:a=>q(a.target.value),className:"px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",children:[(0,b.jsx)("option",{value:"newest",children:"Mới nhất"}),(0,b.jsx)("option",{value:"price_asc",children:"Giá thấp đến cao"}),(0,b.jsx)("option",{value:"price_desc",children:"Giá cao đến thấp"}),(0,b.jsx)("option",{value:"popular",children:"Phổ biến nhất"}),(0,b.jsx)("option",{value:"rating",children:"Đánh giá cao"})]})]})]}),y&&(0,b.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:[...Array(6)].map((a,c)=>(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-4 animate-pulse",children:[(0,b.jsx)("div",{className:"bg-gray-200 h-48 rounded-md mb-4"}),(0,b.jsx)("div",{className:"bg-gray-200 h-4 rounded mb-2"}),(0,b.jsx)("div",{className:"bg-gray-200 h-4 rounded w-2/3"})]},c))}),z&&(0,b.jsxs)("div",{className:"bg-red-50 text-red-700 p-4 rounded-lg",children:["Có lỗi xảy ra: ",z.message]}),!y&&B.length>0&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:B.map(a=>(0,b.jsxs)(e.default,{href:`/products/${a.slug}`,className:"bg-white rounded-lg shadow-sm hover:shadow-md transition group",children:[(0,b.jsxs)("div",{className:"relative aspect-square overflow-hidden rounded-t-lg",children:[(0,b.jsx)(f.default,{src:a.featuredImage||"/placeholder-product.jpg",alt:a.name,fill:!0,className:"object-cover group-hover:scale-105 transition duration-300"}),a.discount>0&&(0,b.jsxs)("span",{className:"absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold",children:["-",a.discount,"%"]}),a.isFeatured&&(0,b.jsx)("span",{className:"absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold",children:"HOT"})]}),(0,b.jsxs)("div",{className:"p-4",children:[(0,b.jsx)("h3",{className:"font-semibold text-gray-900 mb-1 line-clamp-2",children:a.name}),(0,b.jsx)("p",{className:"text-xs text-gray-500 mb-2",children:a.category?.name}),(0,b.jsxs)("div",{className:"flex items-center gap-1 mb-2",children:[(0,b.jsx)("div",{className:"flex items-center",children:[void 0,void 0,void 0,void 0,void 0].map((c,d)=>(0,b.jsx)(j.Star,{className:`h-4 w-4 ${d<Math.floor(a.rating)?"fill-yellow-400 text-yellow-400":"text-gray-300"}`},d))}),(0,b.jsxs)("span",{className:"text-xs text-gray-500",children:["(",a.reviewCount,")"]})]}),(0,b.jsx)("div",{className:"mb-3",children:(0,b.jsxs)("div",{className:"flex items-baseline gap-2",children:[(0,b.jsx)("span",{className:"text-lg font-bold text-blue-600",children:F(a.finalPrice)}),a.compareAtPrice>a.finalPrice&&(0,b.jsx)("span",{className:"text-sm text-gray-400 line-through",children:F(a.compareAtPrice)})]})}),(0,b.jsx)("div",{className:"text-xs mb-3",children:a.stock>0?(0,b.jsxs)("span",{className:"text-green-600",children:["Còn hàng (",a.stock,")"]}):(0,b.jsx)("span",{className:"text-red-600",children:"Hết hàng"})}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)("button",{onClick:a=>{a.preventDefault()},disabled:0===a.stock,className:"flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition",children:[(0,b.jsx)(h.ShoppingCart,{className:"h-4 w-4"}),"Thêm"]}),(0,b.jsx)("button",{onClick:a=>{a.preventDefault()},className:"p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition",children:(0,b.jsx)(i.Heart,{className:"h-5 w-5 text-gray-600"})})]})]})]},a.id))}),(0,b.jsxs)("div",{className:"mt-8 flex justify-center gap-2",children:[(0,b.jsx)("button",{onClick:()=>m(Math.max(1,a-1)),disabled:1===a,className:"px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Trước"}),(0,b.jsxs)("span",{className:"px-4 py-2 text-gray-700",children:["Trang ",a]}),(0,b.jsx)("button",{onClick:()=>m(a+1),disabled:!D,className:"px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Sau"})]})]}),!y&&0===B.length&&(0,b.jsx)("div",{className:"text-center py-12",children:(0,b.jsx)("p",{className:"text-gray-500",children:"Không tìm thấy sản phẩm nào"})})]})]})})]})}a.s(["default",()=>m])}];

//# sourceMappingURL=_352c3292._.js.map