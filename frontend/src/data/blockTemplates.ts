import { BlockType, CreatePageBlockInput } from '@/types/page-builder';

/**
 * Block Template Interface
 */
export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'features' | 'pricing' | 'team' | 'contact' | 'custom';
  thumbnail?: string;
  blocks: TemplateBlockDefinition[];
}

export interface TemplateBlockDefinition {
  type: BlockType;
  content: any;
  style?: any;
  order: number;
  depth: number;
  parentId?: string; // Relative ID for template structure
  children?: TemplateBlockDefinition[];
}

/**
 * Pre-defined Block Templates
 */
export const BLOCK_TEMPLATES: BlockTemplate[] = [
  // Hero Section Template
  {
    id: 'hero-centered',
    name: 'Centered Hero',
    description: 'Hero section với tiêu đề, mô tả và CTA button ở giữa',
    category: 'hero',
    blocks: [
      {
        type: BlockType.SECTION,
        order: 0,
        depth: 0,
        content: {
          fullWidth: true,
          containerWidth: 'lg',
          backgroundColor: '#f8fafc',
          padding: { top: 120, bottom: 120 },
          style: {}
        },
        children: [
          {
            type: BlockType.CONTAINER,
            order: 0,
            depth: 1,
            content: {
              layout: 'stack',
              gap: 24,
              padding: 32,
              backgroundColor: 'transparent',
              maxWidth: '800px',
              alignment: 'center',
              style: {}
            },
            children: [
              {
                type: BlockType.TEXT,
                order: 0,
                depth: 2,
                content: {
                  content: '<h1 style="text-align: center; font-size: 3rem; font-weight: bold; margin: 0;">Chào mừng đến với trang của chúng tôi</h1>',
                  style: {}
                }
              },
              {
                type: BlockType.TEXT,
                order: 1,
                depth: 2,
                content: {
                  content: '<p style="text-align: center; font-size: 1.25rem; color: #64748b;">Giải pháp tốt nhất cho doanh nghiệp của bạn. Bắt đầu ngay hôm nay và trải nghiệm sự khác biệt.</p>',
                  style: {}
                }
              },
              {
                type: BlockType.BUTTON,
                order: 2,
                depth: 2,
                content: {
                  text: 'Bắt đầu ngay',
                  href: '#',
                  variant: 'primary',
                  style: {
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '16px 32px',
                    fontSize: '1.125rem',
                    borderRadius: '8px'
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  },

  // Features Grid Template
  {
    id: 'features-3col',
    name: 'Features 3 Columns',
    description: '3 tính năng nổi bật với icon, tiêu đề và mô tả',
    category: 'features',
    blocks: [
      {
        type: BlockType.SECTION,
        order: 0,
        depth: 0,
        content: {
          fullWidth: false,
          containerWidth: 'lg',
          backgroundColor: 'white',
          padding: { top: 80, bottom: 80 },
          style: {}
        },
        children: [
          {
            type: BlockType.CONTAINER,
            order: 0,
            depth: 1,
            content: {
              layout: 'stack',
              gap: 48,
              padding: 0,
              backgroundColor: 'transparent',
              maxWidth: '100%',
              alignment: 'center',
              style: {}
            },
            children: [
              {
                type: BlockType.TEXT,
                order: 0,
                depth: 2,
                content: {
                  content: '<h2 style="text-align: center; font-size: 2.5rem; font-weight: bold;">Tính năng nổi bật</h2>',
                  style: {}
                }
              },
              {
                type: BlockType.GRID,
                order: 1,
                depth: 2,
                content: {
                  columns: 3,
                  gap: 32,
                  responsive: { sm: 1, md: 2, lg: 3 },
                  style: {}
                },
                children: [
                  {
                    type: BlockType.CONTAINER,
                    order: 0,
                    depth: 3,
                    content: {
                      layout: 'stack',
                      gap: 16,
                      padding: 24,
                      backgroundColor: '#f8fafc',
                      maxWidth: '100%',
                      alignment: 'left',
                      style: { borderRadius: '12px' }
                    },
                    children: [
                      {
                        type: BlockType.TEXT,
                        order: 0,
                        depth: 4,
                        content: {
                          content: '<div style="width: 48px; height: 48px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🚀</div>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 1,
                        depth: 4,
                        content: {
                          content: '<h3 style="font-size: 1.5rem; font-weight: bold; margin: 0;">Nhanh chóng</h3>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 2,
                        depth: 4,
                        content: {
                          content: '<p style="color: #64748b; line-height: 1.6;">Tốc độ xử lý siêu nhanh, tối ưu hiệu suất tối đa.</p>',
                          style: {}
                        }
                      }
                    ]
                  },
                  {
                    type: BlockType.CONTAINER,
                    order: 1,
                    depth: 3,
                    content: {
                      layout: 'stack',
                      gap: 16,
                      padding: 24,
                      backgroundColor: '#f8fafc',
                      maxWidth: '100%',
                      alignment: 'left',
                      style: { borderRadius: '12px' }
                    },
                    children: [
                      {
                        type: BlockType.TEXT,
                        order: 0,
                        depth: 4,
                        content: {
                          content: '<div style="width: 48px; height: 48px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🔒</div>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 1,
                        depth: 4,
                        content: {
                          content: '<h3 style="font-size: 1.5rem; font-weight: bold; margin: 0;">Bảo mật</h3>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 2,
                        depth: 4,
                        content: {
                          content: '<p style="color: #64748b; line-height: 1.6;">Bảo vệ dữ liệu với công nghệ mã hóa hiện đại.</p>',
                          style: {}
                        }
                      }
                    ]
                  },
                  {
                    type: BlockType.CONTAINER,
                    order: 2,
                    depth: 3,
                    content: {
                      layout: 'stack',
                      gap: 16,
                      padding: 24,
                      backgroundColor: '#f8fafc',
                      maxWidth: '100%',
                      alignment: 'left',
                      style: { borderRadius: '12px' }
                    },
                    children: [
                      {
                        type: BlockType.TEXT,
                        order: 0,
                        depth: 4,
                        content: {
                          content: '<div style="width: 48px; height: 48px; background: #f59e0b; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">⚡</div>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 1,
                        depth: 4,
                        content: {
                          content: '<h3 style="font-size: 1.5rem; font-weight: bold; margin: 0;">Dễ sử dụng</h3>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 2,
                        depth: 4,
                        content: {
                          content: '<p style="color: #64748b; line-height: 1.6;">Giao diện trực quan, dễ dàng sử dụng cho mọi người.</p>',
                          style: {}
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // Pricing Table Template
  {
    id: 'pricing-3tier',
    name: 'Pricing 3 Tiers',
    description: 'Bảng giá 3 gói với highlight gói phổ biến',
    category: 'pricing',
    blocks: [
      {
        type: BlockType.SECTION,
        order: 0,
        depth: 0,
        content: {
          fullWidth: false,
          containerWidth: 'lg',
          backgroundColor: '#f8fafc',
          padding: { top: 80, bottom: 80 },
          style: {}
        },
        children: [
          {
            type: BlockType.CONTAINER,
            order: 0,
            depth: 1,
            content: {
              layout: 'stack',
              gap: 48,
              padding: 0,
              backgroundColor: 'transparent',
              maxWidth: '100%',
              alignment: 'center',
              style: {}
            },
            children: [
              {
                type: BlockType.TEXT,
                order: 0,
                depth: 2,
                content: {
                  content: '<h2 style="text-align: center; font-size: 2.5rem; font-weight: bold;">Chọn gói phù hợp</h2>',
                  style: {}
                }
              },
              {
                type: BlockType.GRID,
                order: 1,
                depth: 2,
                content: {
                  columns: 3,
                  gap: 24,
                  responsive: { sm: 1, md: 2, lg: 3 },
                  style: {}
                },
                children: [
                  // Starter Plan
                  {
                    type: BlockType.CONTAINER,
                    order: 0,
                    depth: 3,
                    content: {
                      layout: 'stack',
                      gap: 24,
                      padding: 32,
                      backgroundColor: 'white',
                      maxWidth: '100%',
                      alignment: 'left',
                      style: { borderRadius: '12px', border: '2px solid #e2e8f0' }
                    },
                    children: [
                      {
                        type: BlockType.TEXT,
                        order: 0,
                        depth: 4,
                        content: {
                          content: '<h3 style="font-size: 1.5rem; font-weight: bold;">Starter</h3><p style="color: #64748b;">Cho cá nhân</p>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 1,
                        depth: 4,
                        content: {
                          content: '<div style="font-size: 3rem; font-weight: bold;">$9<span style="font-size: 1rem; color: #64748b;">/tháng</span></div>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 2,
                        depth: 4,
                        content: {
                          content: '<ul style="list-style: none; padding: 0;"><li style="padding: 8px 0;">✓ 10 projects</li><li style="padding: 8px 0;">✓ 5GB storage</li><li style="padding: 8px 0;">✓ Email support</li></ul>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.BUTTON,
                        order: 3,
                        depth: 4,
                        content: {
                          text: 'Bắt đầu',
                          href: '#',
                          variant: 'primary',
                          style: {
                            width: '100%',
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '8px'
                          }
                        }
                      }
                    ]
                  },
                  // Pro Plan (Popular)
                  {
                    type: BlockType.CONTAINER,
                    order: 1,
                    depth: 3,
                    content: {
                      layout: 'stack',
                      gap: 24,
                      padding: 32,
                      backgroundColor: 'white',
                      maxWidth: '100%',
                      alignment: 'left',
                      style: { borderRadius: '12px', border: '3px solid #3b82f6', position: 'relative' }
                    },
                    children: [
                      {
                        type: BlockType.TEXT,
                        order: 0,
                        depth: 4,
                        content: {
                          content: '<div style="position: absolute; top: -12px; right: 20px; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 999px; font-size: 0.875rem; font-weight: bold;">PHỔ BIẾN</div>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 1,
                        depth: 4,
                        content: {
                          content: '<h3 style="font-size: 1.5rem; font-weight: bold;">Pro</h3><p style="color: #64748b;">Cho doanh nghiệp nhỏ</p>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 2,
                        depth: 4,
                        content: {
                          content: '<div style="font-size: 3rem; font-weight: bold;">$29<span style="font-size: 1rem; color: #64748b;">/tháng</span></div>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 3,
                        depth: 4,
                        content: {
                          content: '<ul style="list-style: none; padding: 0;"><li style="padding: 8px 0;">✓ Unlimited projects</li><li style="padding: 8px 0;">✓ 50GB storage</li><li style="padding: 8px 0;">✓ Priority support</li><li style="padding: 8px 0;">✓ Advanced analytics</li></ul>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.BUTTON,
                        order: 4,
                        depth: 4,
                        content: {
                          text: 'Bắt đầu',
                          href: '#',
                          variant: 'primary',
                          style: {
                            width: '100%',
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '8px'
                          }
                        }
                      }
                    ]
                  },
                  // Enterprise Plan
                  {
                    type: BlockType.CONTAINER,
                    order: 2,
                    depth: 3,
                    content: {
                      layout: 'stack',
                      gap: 24,
                      padding: 32,
                      backgroundColor: 'white',
                      maxWidth: '100%',
                      alignment: 'left',
                      style: { borderRadius: '12px', border: '2px solid #e2e8f0' }
                    },
                    children: [
                      {
                        type: BlockType.TEXT,
                        order: 0,
                        depth: 4,
                        content: {
                          content: '<h3 style="font-size: 1.5rem; font-weight: bold;">Enterprise</h3><p style="color: #64748b;">Cho tổ chức lớn</p>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 1,
                        depth: 4,
                        content: {
                          content: '<div style="font-size: 3rem; font-weight: bold;">$99<span style="font-size: 1rem; color: #64748b;">/tháng</span></div>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.TEXT,
                        order: 2,
                        depth: 4,
                        content: {
                          content: '<ul style="list-style: none; padding: 0;"><li style="padding: 8px 0;">✓ Unlimited everything</li><li style="padding: 8px 0;">✓ 500GB storage</li><li style="padding: 8px 0;">✓ 24/7 phone support</li><li style="padding: 8px 0;">✓ Custom integrations</li><li style="padding: 8px 0;">✓ Dedicated account manager</li></ul>',
                          style: {}
                        }
                      },
                      {
                        type: BlockType.BUTTON,
                        order: 3,
                        depth: 4,
                        content: {
                          text: 'Liên hệ',
                          href: '#',
                          variant: 'primary',
                          style: {
                            width: '100%',
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '8px'
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // Call-to-Action Template
  {
    id: 'cta-centered',
    name: 'Centered CTA',
    description: 'Call-to-action section với background màu và buttons',
    category: 'custom',
    blocks: [
      {
        type: BlockType.SECTION,
        order: 0,
        depth: 0,
        content: {
          fullWidth: true,
          containerWidth: 'lg',
          backgroundColor: '#3b82f6',
          padding: { top: 80, bottom: 80 },
          style: {}
        },
        children: [
          {
            type: BlockType.CONTAINER,
            order: 0,
            depth: 1,
            content: {
              layout: 'stack',
              gap: 24,
              padding: 32,
              backgroundColor: 'transparent',
              maxWidth: '800px',
              alignment: 'center',
              style: {}
            },
            children: [
              {
                type: BlockType.TEXT,
                order: 0,
                depth: 2,
                content: {
                  content: '<h2 style="text-align: center; font-size: 2.5rem; font-weight: bold; color: white; margin: 0;">Sẵn sàng bắt đầu?</h2>',
                  style: {}
                }
              },
              {
                type: BlockType.TEXT,
                order: 1,
                depth: 2,
                content: {
                  content: '<p style="text-align: center; font-size: 1.25rem; color: rgba(255,255,255,0.9);">Tham gia cùng hàng nghìn khách hàng đang sử dụng sản phẩm của chúng tôi.</p>',
                  style: {}
                }
              },
              {
                type: BlockType.FLEX_ROW,
                order: 2,
                depth: 2,
                content: {
                  direction: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  wrap: true,
                  gap: 16,
                  style: {}
                },
                children: [
                  {
                    type: BlockType.BUTTON,
                    order: 0,
                    depth: 3,
                    content: {
                      text: 'Dùng thử miễn phí',
                      href: '#',
                      variant: 'primary',
                      style: {
                        padding: '16px 32px',
                        backgroundColor: 'white',
                        color: '#3b82f6',
                        borderRadius: '8px',
                        fontSize: '1.125rem',
                        fontWeight: 'bold'
                      }
                    }
                  },
                  {
                    type: BlockType.BUTTON,
                    order: 1,
                    depth: 3,
                    content: {
                      text: 'Tìm hiểu thêm',
                      href: '#',
                      variant: 'secondary',
                      style: {
                        padding: '16px 32px',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '8px',
                        fontSize: '1.125rem'
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: string) => {
  return BLOCK_TEMPLATES.filter(t => t.category === category);
};

/**
 * Get template by ID
 */
export const getTemplateById = (id: string) => {
  return BLOCK_TEMPLATES.find(t => t.id === id);
};
