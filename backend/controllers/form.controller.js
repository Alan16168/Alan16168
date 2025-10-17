// BC省租赁表格数据
const bcForms = [
  {
    id: 'rtb1',
    nameEn: 'Residential Tenancy Agreement',
    nameZh: '住宅租赁协议',
    descriptionEn: 'Standard tenancy agreement for residential rentals in BC. This form covers all essential terms including rent amount, payment schedule, deposit requirements, and both landlord and tenant responsibilities.',
    descriptionZh: 'BC省标准住宅租赁协议。此表格涵盖所有基本条款，包括租金金额、支付时间表、押金要求以及房东和租客的责任。',
    category: 'Tenancy Agreement',
    downloadUrl: 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb1.pdf',
    useCasesEn: [
      'Starting a new tenancy',
      'Documenting rental terms and conditions',
      'Establishing legal protection for both parties',
      'Defining payment schedules and responsibilities'
    ],
    useCasesZh: [
      '开始新的租赁关系',
      '记录租赁条款和条件',
      '为双方建立法律保护',
      '定义付款时间表和责任'
    ]
  },
  {
    id: 'rtb5',
    nameEn: 'Manufactured Home Site Tenancy Agreement',
    nameZh: '移动房屋场地租赁协议',
    descriptionEn: 'Specific agreement for renting a manufactured home site (land only). Covers site rental terms, utilities, park rules, and maintenance responsibilities.',
    descriptionZh: '专门用于租赁移动房屋场地（仅土地）的协议。涵盖场地租赁条款、公用设施、公园规则和维护责任。',
    category: 'Tenancy Agreement',
    downloadUrl: 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb5.pdf',
    useCasesEn: [
      'Renting land for manufactured homes',
      'Mobile home park agreements',
      'Site-only rental arrangements'
    ],
    useCasesZh: [
      '租赁移动房屋用地',
      '移动房屋公园协议',
      '仅场地租赁安排'
    ]
  },
  {
    id: 'rtb6',
    nameEn: 'Condition Inspection Report',
    nameZh: '房屋状况检查报告',
    descriptionEn: 'Detailed report documenting the condition of the rental unit at move-in and move-out. Essential for deposit disputes and property damage claims.',
    descriptionZh: '详细记录租赁单元入住和退房时状况的报告。对于押金争议和财产损坏索赔至关重要。',
    category: 'Inspection',
    downloadUrl: 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb6.pdf',
    useCasesEn: [
      'Move-in inspection documentation',
      'Move-out inspection comparison',
      'Deposit return disputes',
      'Documenting existing damages'
    ],
    useCasesZh: [
      '入住检查文档',
      '退房检查对比',
      '押金退还争议',
      '记录现有损坏'
    ]
  },
  {
    id: 'rtb8',
    nameEn: 'Application for Dispute Resolution',
    nameZh: '争议解决申请',
    descriptionEn: 'Form to apply for dispute resolution hearing at the Residential Tenancy Branch. Used when landlord and tenant cannot resolve issues directly.',
    descriptionZh: '向住宅租赁分局申请争议解决听证会的表格。当房东和租客无法直接解决问题时使用。',
    category: 'Dispute Resolution',
    downloadUrl: 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb8.pdf',
    useCasesEn: [
      'Filing formal disputes',
      'Seeking arbitration',
      'Resolving unpaid rent issues',
      'Addressing lease violations'
    ],
    useCasesZh: [
      '提交正式争议',
      '寻求仲裁',
      '解决未付租金问题',
      '处理租约违规'
    ]
  },
  {
    id: 'rtb12',
    nameEn: 'Landlord\'s Notice to End Tenancy',
    nameZh: '房东终止租约通知',
    descriptionEn: 'Official notice from landlord to end a tenancy. Must specify valid reason and provide appropriate notice period according to RTA.',
    descriptionZh: '房东终止租约的正式通知。必须说明有效理由并根据RTA提供适当的通知期。',
    category: 'Tenancy Termination',
    downloadUrl: 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb12.pdf',
    useCasesEn: [
      'Ending tenancy for cause',
      'Property sale or renovation',
      'Landlord or family member moving in',
      'Demolition or conversion'
    ],
    useCasesZh: [
      '因故终止租约',
      '房产出售或装修',
      '房东或家庭成员搬入',
      '拆除或改建'
    ]
  },
  {
    id: 'rtb30',
    nameEn: 'Tenant\'s Notice to End Tenancy',
    nameZh: '租客终止租约通知',
    descriptionEn: 'Official notice from tenant to end a tenancy. Must provide minimum notice period as specified in the tenancy agreement or RTA.',
    descriptionZh: '租客终止租约的正式通知。必须提供租赁协议或RTA中规定的最短通知期。',
    category: 'Tenancy Termination',
    downloadUrl: 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb30.pdf',
    useCasesEn: [
      'Voluntarily ending tenancy',
      'Moving out notification',
      'Early termination request'
    ],
    useCasesZh: [
      '自愿终止租约',
      '搬出通知',
      '提前终止请求'
    ]
  },
  {
    id: 'rtb47',
    nameEn: 'Notice of Rent Increase',
    nameZh: '租金上涨通知',
    descriptionEn: 'Official notice to inform tenant of rent increase. Must comply with provincial rent increase regulations and provide 3 months notice.',
    descriptionZh: '通知租客租金上涨的正式通知。必须遵守省租金上涨法规并提供3个月通知。',
    category: 'Rent',
    downloadUrl: 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb47.pdf',
    useCasesEn: [
      'Annual rent increase',
      'Documenting legal rent changes',
      'Providing required notice period'
    ],
    useCasesZh: [
      '年度租金上涨',
      '记录合法租金变更',
      '提供所需通知期'
    ]
  },
  {
    id: 'rtb45',
    nameEn: 'Monetary Order Worksheet',
    nameZh: '金额裁决工作表',
    descriptionEn: 'Worksheet for calculating monetary claims in dispute resolution, including unpaid rent, damages, and other financial disputes.',
    descriptionZh: '用于计算争议解决中的金钱索赔的工作表，包括未付租金、损坏和其他财务纠纷。',
    category: 'Dispute Resolution',
    downloadUrl: 'https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/residential-tenancies/forms/rtb45.pdf',
    useCasesEn: [
      'Calculating unpaid rent',
      'Documenting repair costs',
      'Preparing for arbitration hearing',
      'Financial claim preparation'
    ],
    useCasesZh: [
      '计算未付租金',
      '记录维修费用',
      '准备仲裁听证',
      '财务索赔准备'
    ]
  }
];

// @desc    Get all forms
// @route   GET /api/forms
// @access  Public
exports.getAllForms = async (req, res) => {
  try {
    const { language = 'en', category } = req.query;
    
    let forms = bcForms.map(form => ({
      id: form.id,
      name: language === 'zh' ? form.nameZh : form.nameEn,
      description: language === 'zh' ? form.descriptionZh : form.descriptionEn,
      category: form.category,
      downloadUrl: form.downloadUrl,
      useCases: language === 'zh' ? form.useCasesZh : form.useCasesEn
    }));
    
    if (category) {
      forms = forms.filter(form => form.category === category);
    }
    
    res.json({
      success: true,
      count: forms.length,
      forms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};

// @desc    Get form by ID
// @route   GET /api/forms/:id
// @access  Public
exports.getFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    
    const form = bcForms.find(f => f.id === id);
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }
    
    res.json({
      success: true,
      form: {
        id: form.id,
        name: language === 'zh' ? form.nameZh : form.nameEn,
        description: language === 'zh' ? form.descriptionZh : form.descriptionEn,
        category: form.category,
        downloadUrl: form.downloadUrl,
        useCases: language === 'zh' ? form.useCasesZh : form.useCasesEn
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching form',
      error: error.message
    });
  }
};

// @desc    Get form categories
// @route   GET /api/forms/categories
// @access  Public
exports.getFormCategories = async (req, res) => {
  try {
    const categories = [...new Set(bcForms.map(form => form.category))];
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

module.exports = exports;
