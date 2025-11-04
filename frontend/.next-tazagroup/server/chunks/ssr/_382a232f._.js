module.exports=[829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},8801,a=>{"use strict";let b=(0,a.i(367990).default)("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);a.s(["default",()=>b])},188030,a=>{"use strict";var b=a.i(8801);a.s(["CreditCard",()=>b.default])},746048,a=>{"use strict";let b=(0,a.i(367990).default)("truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]);a.s(["default",()=>b])},129853,a=>{"use strict";var b=a.i(746048);a.s(["Truck",()=>b.default])},293217,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`,a.s(["ADD_TO_CART",0,g,"CLEAR_CART",0,j,"CREATE_ORDER",0,k,"GET_CART",0,f,"GET_PRODUCTS",0,c,"GET_PRODUCT_BY_SLUG",0,d,"GET_PRODUCT_CATEGORIES",0,e,"REMOVE_FROM_CART",0,i,"UPDATE_CART_ITEM",0,h])},38759,a=>{"use strict";let b=(0,a.i(367990).default)("map-pin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);a.s(["default",()=>b])},836106,a=>{"use strict";var b=a.i(38759);a.s(["MapPin",()=>b.default])},135475,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(8912),f=a.i(53627),g=a.i(734639),h=a.i(293217),i=a.i(188030),j=a.i(129853),k=a.i(836106),l=a.i(516482),m=a.i(189101);function n(){let a=(0,f.useRouter)(),{data:n,loading:o}=(0,d.useQuery)(h.GET_CART),[p,q]=(0,c.useState)({fullName:"",phone:"",email:"",address:"",city:"",district:"",ward:"",paymentMethod:"COD",shippingMethod:"STANDARD",notes:""}),[r,{loading:s}]=(0,e.useMutation)(h.CREATE_ORDER,{onCompleted:b=>{b.createOrder.success?(m.toast.success("Đặt hàng thành công!"),a.push(`/orders/${b.createOrder.order.id}`)):m.toast.error(b.createOrder.message||"Đặt hàng thất bại")},onError:a=>{m.toast.error("Đặt hàng thất bại: "+a.message)}}),t=n?.cart,u=t?.items||[],v=a=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(a),w=t?.total>=5e5?0:"EXPRESS"===p.shippingMethod?5e4:3e4,x=(t?.total||0)+w,y=a=>{q({...p,[a.target.name]:a.target.value})},z=async a=>{if(a.preventDefault(),!p.fullName||!p.phone||!p.address)return void m.toast.error("Vui lòng điền đầy đủ thông tin giao hàng");if(0===u.length)return void m.toast.error("Giỏ hàng trống");try{await r({variables:{input:{shippingAddress:{fullName:p.fullName,phone:p.phone,email:p.email,address:p.address,city:p.city,district:p.district,ward:p.ward},paymentMethod:p.paymentMethod,shippingMethod:p.shippingMethod,notes:p.notes}}})}catch(a){}};return o?(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})}):t&&0!==u.length?(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,b.jsx)("div",{className:"bg-white shadow-sm",children:(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",children:(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsx)("button",{onClick:()=>a.push("/cart"),className:"text-gray-600 hover:text-gray-900",children:(0,b.jsx)(l.ArrowLeft,{className:"h-6 w-6"})}),(0,b.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Thanh toán"})]})})}),(0,b.jsx)("form",{onSubmit:z,className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[(0,b.jsxs)("div",{className:"lg:col-span-2 space-y-6",children:[(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,b.jsx)(k.MapPin,{className:"h-5 w-5 text-blue-600"}),(0,b.jsx)("h2",{className:"text-lg font-bold text-gray-900",children:"Thông tin giao hàng"})]}),(0,b.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{className:"sm:col-span-2",children:[(0,b.jsxs)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:["Họ và tên ",(0,b.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,b.jsx)("input",{type:"text",name:"fullName",value:p.fullName,onChange:y,required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"Nguyễn Văn A"})]}),(0,b.jsxs)("div",{children:[(0,b.jsxs)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:["Số điện thoại ",(0,b.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,b.jsx)("input",{type:"tel",name:"phone",value:p.phone,onChange:y,required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"0901234567"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Email"}),(0,b.jsx)("input",{type:"email",name:"email",value:p.email,onChange:y,className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"email@example.com"})]}),(0,b.jsxs)("div",{className:"sm:col-span-2",children:[(0,b.jsxs)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:["Địa chỉ ",(0,b.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,b.jsx)("input",{type:"text",name:"address",value:p.address,onChange:y,required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"Số nhà, tên đường"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Thành phố"}),(0,b.jsx)("input",{type:"text",name:"city",value:p.city,onChange:y,className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"Hồ Chí Minh"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Quận/Huyện"}),(0,b.jsx)("input",{type:"text",name:"district",value:p.district,onChange:y,className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"Quận 1"})]}),(0,b.jsxs)("div",{className:"sm:col-span-2",children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Phường/Xã"}),(0,b.jsx)("input",{type:"text",name:"ward",value:p.ward,onChange:y,className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"Phường Bến Nghé"})]})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,b.jsx)(j.Truck,{className:"h-5 w-5 text-blue-600"}),(0,b.jsx)("h2",{className:"text-lg font-bold text-gray-900",children:"Phương thức vận chuyển"})]}),(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsxs)("label",{className:"flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition",children:[(0,b.jsx)("input",{type:"radio",name:"shippingMethod",value:"STANDARD",checked:"STANDARD"===p.shippingMethod,onChange:y,className:"mr-3"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"font-medium text-gray-900",children:"Giao hàng tiêu chuẩn"}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Giao trong 3-5 ngày"})]}),(0,b.jsx)("span",{className:"font-bold text-gray-900",children:t.total>=5e5?"Miễn phí":v(3e4)})]}),(0,b.jsxs)("label",{className:"flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition",children:[(0,b.jsx)("input",{type:"radio",name:"shippingMethod",value:"EXPRESS",checked:"EXPRESS"===p.shippingMethod,onChange:y,className:"mr-3"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"font-medium text-gray-900",children:"Giao hàng nhanh"}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Giao trong 1-2 ngày"})]}),(0,b.jsx)("span",{className:"font-bold text-gray-900",children:t.total>=5e5?"Miễn phí":v(5e4)})]})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,b.jsx)(i.CreditCard,{className:"h-5 w-5 text-blue-600"}),(0,b.jsx)("h2",{className:"text-lg font-bold text-gray-900",children:"Phương thức thanh toán"})]}),(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsxs)("label",{className:"flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition",children:[(0,b.jsx)("input",{type:"radio",name:"paymentMethod",value:"COD",checked:"COD"===p.paymentMethod,onChange:y,className:"mr-3"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"font-medium text-gray-900",children:"Thanh toán khi nhận hàng (COD)"}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Thanh toán bằng tiền mặt khi nhận hàng"})]})]}),(0,b.jsxs)("label",{className:"flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition opacity-50",children:[(0,b.jsx)("input",{type:"radio",name:"paymentMethod",value:"BANK_TRANSFER",disabled:!0,className:"mr-3"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"font-medium text-gray-900",children:"Chuyển khoản ngân hàng"}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Đang cập nhật..."})]})]}),(0,b.jsxs)("label",{className:"flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition opacity-50",children:[(0,b.jsx)("input",{type:"radio",name:"paymentMethod",value:"VNPAY",disabled:!0,className:"mr-3"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"font-medium text-gray-900",children:"VNPay"}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Đang cập nhật..."})]})]})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6",children:[(0,b.jsx)("h2",{className:"text-lg font-bold text-gray-900 mb-4",children:"Ghi chú đơn hàng (Tùy chọn)"}),(0,b.jsx)("textarea",{name:"notes",value:p.notes,onChange:y,rows:4,className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"})]})]}),(0,b.jsx)("div",{className:"lg:col-span-1",children:(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6 sticky top-4",children:[(0,b.jsxs)("h2",{className:"text-lg font-bold text-gray-900 mb-4",children:["Đơn hàng (",t.totalItems," sản phẩm)"]}),(0,b.jsx)("div",{className:"space-y-3 mb-4 max-h-64 overflow-y-auto",children:u.map(a=>(0,b.jsxs)("div",{className:"flex gap-3",children:[(0,b.jsxs)("div",{className:"relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden",children:[(0,b.jsx)(g.default,{src:a.product.featuredImage||"/placeholder-product.jpg",alt:a.product.name,fill:!0,className:"object-cover"}),(0,b.jsx)("span",{className:"absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",children:a.quantity})]}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"text-sm font-medium text-gray-900 line-clamp-2",children:a.product.name}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:v(a.price*a.quantity)})]})]},a.id))}),(0,b.jsxs)("div",{className:"border-t pt-4 space-y-2",children:[(0,b.jsxs)("div",{className:"flex justify-between text-gray-600",children:[(0,b.jsx)("span",{children:"Tạm tính"}),(0,b.jsx)("span",{children:v(t.subtotal)})]}),t.discount>0&&(0,b.jsxs)("div",{className:"flex justify-between text-green-600",children:[(0,b.jsx)("span",{children:"Giảm giá"}),(0,b.jsxs)("span",{children:["-",v(t.discount)]})]}),(0,b.jsxs)("div",{className:"flex justify-between text-gray-600",children:[(0,b.jsx)("span",{children:"Phí vận chuyển"}),(0,b.jsx)("span",{children:0===w?"Miễn phí":v(w)})]}),(0,b.jsxs)("div",{className:"flex justify-between text-lg font-bold text-gray-900 border-t pt-2",children:[(0,b.jsx)("span",{children:"Tổng cộng"}),(0,b.jsx)("span",{className:"text-blue-600",children:v(x)})]})]}),(0,b.jsx)("button",{type:"submit",disabled:s,className:"w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium",children:s?"Đang xử lý...":"Đặt hàng"}),(0,b.jsx)("p",{className:"mt-4 text-xs text-gray-500 text-center",children:"Thông tin của bạn được bảo mật an toàn"})]})})]})})]}):(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("h1",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Giỏ hàng trống"}),(0,b.jsx)("p",{className:"text-gray-600 mb-4",children:"Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán"}),(0,b.jsx)("button",{onClick:()=>a.push("/products"),className:"text-blue-600 hover:underline",children:"← Tiếp tục mua sắm"})]})})}a.s(["default",()=>n])}];

//# sourceMappingURL=_382a232f._.js.map