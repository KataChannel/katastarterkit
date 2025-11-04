module.exports=[158464,a=>{"use strict";let b=(0,a.i(367990).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);a.s(["default",()=>b])},558767,a=>{"use strict";var b=a.i(158464);a.s(["Trash2",()=>b.default])},939816,a=>{"use strict";let b=(0,a.i(367990).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);a.s(["default",()=>b])},723593,a=>{"use strict";var b=a.i(939816);a.s(["Plus",()=>b.default])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},711670,a=>{"use strict";let b=(0,a.i(367990).default)("minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);a.s(["default",()=>b])},609914,a=>{"use strict";var b=a.i(711670);a.s(["Minus",()=>b.default])},293217,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`,a.s(["ADD_TO_CART",0,g,"CLEAR_CART",0,j,"CREATE_ORDER",0,k,"GET_CART",0,f,"GET_PRODUCTS",0,c,"GET_PRODUCT_BY_SLUG",0,d,"GET_PRODUCT_CATEGORIES",0,e,"REMOVE_FROM_CART",0,i,"UPDATE_CART_ITEM",0,h])},965914,a=>{"use strict";let b=(0,a.i(367990).default)("shopping-bag",[["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}],["path",{d:"M3.103 6.034h17.794",key:"awc11p"}],["path",{d:"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",key:"o988cm"}]]);a.s(["default",()=>b])},258958,a=>{"use strict";var b=a.i(965914);a.s(["ShoppingBag",()=>b.default])},942844,a=>{"use strict";var b=a.i(321248),c=a.i(168918),d=a.i(8912),e=a.i(53627),f=a.i(734639),g=a.i(439889),h=a.i(293217),i=a.i(609914),j=a.i(723593),k=a.i(558767),l=a.i(258958),m=a.i(516482),n=a.i(189101);function o(){let a=(0,e.useRouter)(),{data:o,loading:p,error:q}=(0,c.useQuery)(h.GET_CART),[r]=(0,d.useMutation)(h.UPDATE_CART_ITEM,{refetchQueries:[{query:h.GET_CART}],onError:a=>n.toast.error("Cập nhật thất bại: "+a.message)}),[s]=(0,d.useMutation)(h.REMOVE_FROM_CART,{refetchQueries:[{query:h.GET_CART}],onCompleted:()=>n.toast.success("Đã xóa sản phẩm"),onError:a=>n.toast.error("Xóa thất bại: "+a.message)}),[t]=(0,d.useMutation)(h.CLEAR_CART,{refetchQueries:[{query:h.GET_CART}],onCompleted:()=>n.toast.success("Đã xóa toàn bộ giỏ hàng"),onError:a=>n.toast.error("Xóa thất bại: "+a.message)}),u=o?.cart,v=u?.items||[],w=a=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(a),x=async(a,b)=>{if(!(b<1))try{await r({variables:{itemId:a,quantity:b}})}catch(a){}},y=async a=>{if(confirm("Bạn có chắc muốn xóa sản phẩm này?"))try{await s({variables:{itemId:a}})}catch(a){}},z=async()=>{if(confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?"))try{await t()}catch(a){}};return p?(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})}):q?(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("h1",{className:"text-2xl font-bold text-red-600 mb-2",children:"Có lỗi xảy ra"}),(0,b.jsx)("p",{className:"text-gray-600 mb-4",children:q.message}),(0,b.jsx)("button",{onClick:()=>a.push("/products"),className:"text-blue-600 hover:underline",children:"← Tiếp tục mua sắm"})]})}):(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,b.jsx)("div",{className:"bg-white shadow-sm",children:(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Giỏ hàng"}),(0,b.jsxs)("p",{className:"mt-1 text-gray-600",children:[u?.totalItems||0," sản phẩm"]})]}),(0,b.jsxs)(g.default,{href:"/products",className:"flex items-center gap-2 text-blue-600 hover:text-blue-700",children:[(0,b.jsx)(m.ArrowLeft,{className:"h-5 w-5"}),"Tiếp tục mua sắm"]})]})})}),(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:0===v.length?(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-12 text-center",children:[(0,b.jsx)(l.ShoppingBag,{className:"h-24 w-24 text-gray-300 mx-auto mb-4"}),(0,b.jsx)("h2",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Giỏ hàng trống"}),(0,b.jsx)("p",{className:"text-gray-600 mb-6",children:"Bạn chưa có sản phẩm nào trong giỏ hàng"}),(0,b.jsx)(g.default,{href:"/products",className:"inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium",children:"Khám phá sản phẩm"})]}):(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[(0,b.jsxs)("div",{className:"lg:col-span-2 space-y-4",children:[(0,b.jsx)("div",{className:"flex justify-end",children:(0,b.jsxs)("button",{onClick:z,className:"text-sm text-red-600 hover:text-red-700 flex items-center gap-1",children:[(0,b.jsx)(k.Trash2,{className:"h-4 w-4"}),"Xóa tất cả"]})}),v.map(a=>(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-4 flex gap-4",children:[(0,b.jsx)(g.default,{href:`/products/${a.product.slug}`,className:"relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden",children:(0,b.jsx)(f.default,{src:a.product.featuredImage||"/placeholder-product.jpg",alt:a.product.name,fill:!0,className:"object-cover"})}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)(g.default,{href:`/products/${a.product.slug}`,className:"font-semibold text-gray-900 hover:text-blue-600 line-clamp-2",children:a.product.name}),a.variant&&(0,b.jsxs)("p",{className:"text-sm text-gray-600 mt-1",children:["Phân loại: ",a.variant.name]}),(0,b.jsxs)("div",{className:"flex items-center justify-between mt-3",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-lg font-bold text-blue-600",children:w(a.price)}),(0,b.jsxs)("p",{className:"text-sm text-gray-500",children:["Tổng: ",w(a.price*a.quantity)]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsxs)("div",{className:"flex items-center border border-gray-300 rounded-md",children:[(0,b.jsx)("button",{onClick:()=>x(a.id,a.quantity-1),className:"p-2 hover:bg-gray-50 transition",disabled:a.quantity<=1,children:(0,b.jsx)(i.Minus,{className:"h-4 w-4"})}),(0,b.jsx)("span",{className:"px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center",children:a.quantity}),(0,b.jsx)("button",{onClick:()=>x(a.id,a.quantity+1),className:"p-2 hover:bg-gray-50 transition",disabled:a.quantity>=(a.variant?.stock||a.product.stock),children:(0,b.jsx)(j.Plus,{className:"h-4 w-4"})})]}),(0,b.jsx)("button",{onClick:()=>y(a.id),className:"p-2 text-red-600 hover:bg-red-50 rounded-md transition",title:"Xóa",children:(0,b.jsx)(k.Trash2,{className:"h-5 w-5"})})]})]}),a.quantity>(a.variant?.stock||a.product.stock)&&(0,b.jsxs)("p",{className:"text-xs text-red-600 mt-2",children:["Chỉ còn ",a.variant?.stock||a.product.stock," sản phẩm"]})]})]},a.id))]}),(0,b.jsx)("div",{className:"lg:col-span-1",children:(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6 sticky top-4",children:[(0,b.jsx)("h2",{className:"text-lg font-bold text-gray-900 mb-4",children:"Tóm tắt đơn hàng"}),(0,b.jsxs)("div",{className:"space-y-3 mb-4",children:[(0,b.jsxs)("div",{className:"flex justify-between text-gray-600",children:[(0,b.jsxs)("span",{children:["Tạm tính (",u.totalItems," sản phẩm)"]}),(0,b.jsx)("span",{children:w(u.subtotal)})]}),u.discount>0&&(0,b.jsxs)("div",{className:"flex justify-between text-green-600",children:[(0,b.jsx)("span",{children:"Giảm giá"}),(0,b.jsxs)("span",{children:["-",w(u.discount)]})]}),(0,b.jsxs)("div",{className:"flex justify-between text-gray-600",children:[(0,b.jsx)("span",{children:"Phí vận chuyển"}),(0,b.jsx)("span",{className:"text-sm",children:"Tính khi thanh toán"})]})]}),(0,b.jsx)("div",{className:"border-t pt-4 mb-6",children:(0,b.jsxs)("div",{className:"flex justify-between items-center",children:[(0,b.jsx)("span",{className:"text-lg font-bold text-gray-900",children:"Tổng cộng"}),(0,b.jsx)("span",{className:"text-2xl font-bold text-blue-600",children:w(u.total)})]})}),(0,b.jsx)("button",{onClick:()=>a.push("/checkout"),className:"w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium mb-3",children:"Tiến hành thanh toán"}),(0,b.jsx)(g.default,{href:"/products",className:"block text-center text-blue-600 hover:text-blue-700 text-sm",children:"← Tiếp tục mua sắm"}),(0,b.jsxs)("div",{className:"mt-6 pt-6 border-t space-y-2 text-sm text-gray-600",children:[(0,b.jsxs)("p",{className:"flex items-start gap-2",children:[(0,b.jsx)("span",{className:"text-green-600",children:"✓"}),(0,b.jsx)("span",{children:"Miễn phí vận chuyển cho đơn hàng từ 500.000đ"})]}),(0,b.jsxs)("p",{className:"flex items-start gap-2",children:[(0,b.jsx)("span",{className:"text-green-600",children:"✓"}),(0,b.jsx)("span",{children:"Đổi trả miễn phí trong 7 ngày"})]}),(0,b.jsxs)("p",{className:"flex items-start gap-2",children:[(0,b.jsx)("span",{className:"text-green-600",children:"✓"}),(0,b.jsx)("span",{children:"Bảo hành chính hãng"})]})]})]})})]})})]})}a.s(["default",()=>o])}];

//# sourceMappingURL=_3050cff1._.js.map