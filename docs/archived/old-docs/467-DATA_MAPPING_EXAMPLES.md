# Data Mapping Examples

## Category Mapping

### Old Data (danhmuc.json)
```json
{
  "id": "03e93f61-f4f9-40bb-b0ca-6945f4dcabb6",
  "Title": "RAU ĂN THÂN - LÁ",
  "Mota": "Các loại rau ăn thân và lá",
  "Slug": "rau-an-than-la",
  "Image": "{\"Hinhchinh\":{\"src\":\"https://images.rausachtrangia.com/16_04_2024/rau-ma-239476971_1713236409924.webp\"}}",
  "Type": "sanpham",
  "Ordering": 3,
  "Status": 1,
  "CreateAt": "2024-01-22T15:55:25.479Z"
}
```

### New Data (Category)
```prisma
{
  id: "03e93f61-f4f9-40bb-b0ca-6945f4dcabb6"
  name: "RAU ĂN THÂN - LÁ"
  slug: "rau-an-than-la"
  description: "Các loại rau ăn thân và lá"
  image: "https://images.rausachtrangia.com/16_04_2024/rau-ma-239476971_1713236409924.webp"
  displayOrder: 3
  isActive: true
  isFeatured: false
  createdAt: 2024-01-22T15:55:25.479Z
}
```

---

## Product Mapping

### Old Data (sanpham.json)
```json
{
  "id": "014f133a-d606-426c-9395-e332bc484356",
  "Title": "Mắm ruốc xào",
  "SKU": "",
  "Mota": "Mắm ruốc xào thơm ngon",
  "Slug": "mam-ruoc-xao",
  "View": 245,
  "Image": "{\"Main\":\"https://images.rausachtrangia.com/product.webp\"}",
  "Type": "bansi",
  "Ordering": 1,
  "Status": 1,
  "Noidung": "<p>Mô tả chi tiết sản phẩm</p>",
  "Banchay": 15,
  "Noibat": 1,
  "Moi": 0,
  "ListImage": "[{\"src\":\"https://images.rausachtrangia.com/img1.webp\"},{\"src\":\"https://images.rausachtrangia.com/img2.webp\"}]",
  "MaSP": "I100633",
  "Bienthe": "[{\"MaSP\":\"I100633-1\",\"gia\":50,\"dvt\":\"Kg\",\"GiaCoSo\":45,\"khoiluong\":1},{\"MaSP\":\"I100633-2\",\"gia\":27,\"dvt\":\"Kg\",\"GiaCoSo\":25,\"khoiluong\":0.5}]",
  "giagoc": 50,
  "dvt": "Kg",
  "Soluong": 100,
  "SoluongTT": 80,
  "Ghichu": "Sản phẩm đặc biệt"
}
```

### New Data (Product)
```prisma
Product {
  id: "014f133a-d606-426c-9395-e332bc484356"
  name: "Mắm ruốc xào"
  slug: "mam-ruoc-xao"
  description: "<p>Mô tả chi tiết sản phẩm</p>"
  shortDesc: "Mắm ruốc xào thơm ngon"
  
  // Pricing (converted to VND)
  price: 50000        // 50 * 1000
  originalPrice: 50000
  
  // Inventory
  sku: "I100633"
  stock: 100
  stockInWare: 80
  unit: KG
  
  // Category (mapped)
  categoryId: "..." // Tìm theo Type hoặc idDM
  
  // Images
  thumbnail: "https://images.rausachtrangia.com/product.webp"
  
  // Status
  status: ACTIVE
  
  // Features
  isFeatured: true      // Noibat === 1
  isNewArrival: false   // Moi === 0
  isBestSeller: true    // Banchay > 0
  
  // Stats
  viewCount: 245
  displayOrder: 1
  
  // Code
  productCode: "I100633"
  
  // Notes
  notes: "Sản phẩm đặc biệt"
}

ProductImage[] {
  [
    {
      url: "https://images.rausachtrangia.com/img1.webp"
      isPrimary: true
      order: 0
    },
    {
      url: "https://images.rausachtrangia.com/img2.webp"
      isPrimary: false
      order: 1
    }
  ]
}

ProductVariant[] {
  [
    {
      name: "1Kg"
      sku: "I100633-1"
      price: 50000
      stock: 0
      attributes: {
        weight: 1,
        unit: "Kg",
        basePrice: 45000
      }
      order: 0
    },
    {
      name: "0.5Kg"
      sku: "I100633-2"
      price: 27000
      stock: 0
      attributes: {
        weight: 0.5,
        unit: "Kg",
        basePrice: 25000
      }
      order: 1
    }
  ]
}
```

---

## Field Mapping Reference

### Category
| Old Field | New Field | Transform |
|-----------|-----------|-----------|
| Title | name | Direct |
| Slug | slug | Direct (auto-generate if empty) |
| Mota | description | Direct |
| Image (JSON) | image | Extract from JSON |
| Ordering | displayOrder | Direct |
| Status (0/1) | isActive (bool) | Status === 1 |
| CreateAt | createdAt | Parse date |
| UpdateAt | updatedAt | Parse date |

### Product
| Old Field | New Field | Transform |
|-----------|-----------|-----------|
| Title | name | Direct |
| Slug | slug | Direct (auto-generate if empty) |
| Mota | shortDesc | Direct |
| Noidung | description | Direct |
| MaSP | productCode | Direct |
| SKU | sku | Direct |
| giagoc | price | Multiply by 1000 (VND) |
| giagoc | originalPrice | Multiply by 1000 (VND) |
| Soluong | stock | Direct |
| SoluongTT | stockInWare | Direct |
| dvt | unit | Map to enum |
| idDM / Type | categoryId | Find category |
| Image (JSON) | thumbnail | Extract from JSON |
| ListImage (JSON) | images[] | Parse array → ProductImage |
| Bienthe (JSON) | variants[] | Parse array → ProductVariant |
| Noibat (0/1) | isFeatured (bool) | === 1 |
| Moi (0/1) | isNewArrival (bool) | === 1 |
| Banchay | isBestSeller (bool) | > 0 |
| View | viewCount | Direct |
| Ordering | displayOrder | Direct |
| Ghichu | notes | Direct |
| Status (0/1) | status | Map to enum ACTIVE |

### Product Variant (from Bienthe JSON)
| Old Field | New Field | Transform |
|-----------|-----------|-----------|
| MaSP | sku | Direct |
| gia | price | Multiply by 1000 (VND) |
| khoiluong + dvt | name | Combine: "1Kg", "500g" |
| khoiluong | attributes.weight | Direct |
| dvt | attributes.unit | Direct |
| GiaCoSo | attributes.basePrice | Direct |

---

## Unit Mapping

| Old Unit | New Enum | Description |
|----------|----------|-------------|
| Kg, kg, KG | KG | Kilogram |
| Gam, gam, g, G | G | Gram |
| Cái, cái | PIECE | Piece/Item |
| Hộp, hộp | BOX | Box |
| Túi, túi | BAG | Bag |
| Bó, bó | BUNDLE | Bundle |
| (other) | PIECE | Default |

---

## Image JSON Formats

The old `Image` field can have multiple formats:

### Format 1: Hinhchinh
```json
{
  "Hinhchinh": {
    "src": "https://...",
    "name": "...",
    "alt": "..."
  }
}
```

### Format 2: Main
```json
{
  "Main": "https://..."
}
```

### Format 3: Direct
```json
{
  "src": "https://..."
}
```

The migration script handles all formats automatically.
