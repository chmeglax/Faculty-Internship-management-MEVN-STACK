export const getMenuData = [
  // VB:REPLACE-START:MENU-CONFIG
  {
    category: true,
    title: 'acceuil',
    key: 'q7r3hr',
  },
  /* {
     title: 'Dashboards',
     key: '__dashboard',
     url: '/dashboard',
     icon: 'fe fe-home',
     children: [
       {
         title: 'Dashboard Alpha',
         key: 'iasepr',
         url: '/dashboard/alpha',
       },
 
       {
         title: 'Dashboard Beta',
         key: 'oi2iv',
         url: '/dashboard/beta',
       },
       {
         title: 'Dashboard Gamma',
         key: 'amhwha',
         url: '/dashboard/gamma',
       },
       {
         title: 'Crypto Terminal',
         key: '0emfve',
         url: '/dashboard/crypto',
       },
     ],
   },*/
  {
    title: 'Enseignants',
    key: 'Enseignants',
    url: '/admin/enseignants',
    icon: 'fe fe-users',
  },
  {
    title: 'Organismes',
    key: 'Organismes',
    url: '/admin/organismes',
    icon: 'fe fe-database',
  },
  {
    title: 'Sujets',
    key: 'Sujets',
    url: '/admin/sujets',
    icon: 'fe fe-book-open',
  },
  /*{
    category: true,
    title: 'Apps & Pages',
    key: '2t2ghm',
  },
  {
    title: 'Apps',
    key: '6rq4ze6',
    url: '/apps',
    icon: 'fe fe-database',
    children: [
      {
        title: 'Profile',
        key: 'e38wke',
        url: '/apps/profile',
      },
      {
        title: 'Calendar',
        key: 'y08dt9',
        url: '/apps/calendar',
      },
      {
        title: 'Gallery',
        key: 'lzh7g9',
        url: '/apps/gallery',
      },
      {
        title: 'Messaging',
        key: 'jdwic9',
        url: '/apps/messaging',
      },
      {
        title: 'Mail',
        key: '4dwoxc',
        url: '/apps/mail',
      },
    ],
  },
  {
    title: 'Extra Apps',
    key: 'c20gta',
    url: '/extra-apps',
    icon: 'fe fe-hard-drive',
    children: [
      {
        title: 'Github Explore',
        key: '8ba63s',
        url: '/extra-apps/github-explore',
      },
      {
        title: 'Github Discuss',
        key: 'b0rmp9',
        url: '/extra-apps/github-discuss',
      },
      {
        title: 'Digitalocean Droplets',
        key: 'cmzpxs',
        url: '/extra-apps/digitalocean-droplets',
      },
      {
        title: 'Digitalocean Create',
        key: 'ldmum',
        url: '/extra-apps/digitalocean-create',
      },
      {
        title: 'Google Analytics',
        key: 'dae7ki',
        url: '/extra-apps/google-analytics',
      },
      {
        title: 'Wordpress Post',
        key: '4iz2vq',
        url: '/extra-apps/wordpress-post',
      },
      {
        title: 'Wordpress Posts',
        key: '36v7m',
        url: '/extra-apps/wordpress-posts',
      },
      {
        title: 'Wordpress Add',
        key: 'uo8k1f',
        url: '/extra-apps/wordpress-add',
      },
      {
        title: 'Todoist List',
        key: 'dhg65',
        url: '/extra-apps/todoist-list',
      },
      {
        title: 'Jira Dashboard',
        key: 'jdhtkr',
        url: '/extra-apps/jira-dashboard',
      },
      {
        title: 'Jira Agile Board',
        key: '98jp2',
        url: '/extra-apps/jira-agile-board',
      },
      {
        title: 'Helpdesk Dashboard',
        key: 'brmh5',
        url: '/extra-apps/helpdesk-dashboard',
      },
    ],
  },
  {
    title: 'Ecommerce',
    key: 'aw5fgi',
    url: '/ecommerce',
    icon: 'fe fe-shopping-cart',
    children: [
      {
        title: 'Dashboard',
        key: 'agiw5f',
        url: '/ecommerce/dashboard',
      },
      {
        title: 'Orders',
        key: '2av8s2',
        url: '/ecommerce/orders',
      },
      {
        title: 'Product Catalog',
        key: 's1khgb',
        url: '/ecommerce/product-catalog',
      },
      {
        title: 'Product Details',
        key: 'vd6efh',
        url: '/ecommerce/product-details',
      },
      {
        title: 'Cart',
        key: 'y4smrt',
        url: '/ecommerce/cart',
      },
    ],
  },
  {
    title: 'Auth Pages',
    key: 'czhl14',
    url: '/auth',
    icon: 'fe fe-user',
    children: [
      {
        title: 'Login',
        key: 'fbre',
        url: '/auth/login',
      },
      {
        title: 'Forgot Password',
        key: 'jtjsjp',
        url: '/auth/forgot-password',
      },
      {
        title: 'Register',
        key: 'v2u9ie',
        url: '/auth/register',
      },
      {
        title: 'Lockscreen',
        key: '61qkmj',
        url: '/auth/lockscreen',
      },
      {
        title: 'Page 404',
        key: '92rb3h',
        url: '/auth/404',
      },
      {
        title: 'Page 500',
        key: 'tbmkob',
        url: '/auth/500',
      },
    ],
  },
  {
    category: true,
    title: 'UI Kits',
    key: 'evz6c8',
  },
  {
    title: 'Ant Design',
    key: 'qelxw',
    url: '/ui-kits/antd',
    icon: 'fe fe-bookmark',
  },
  {
    title: 'Bootstrap',
    key: 'l1gqx8',
    url: '/ui-kits/bootstrap',
    icon: 'fe fe-bookmark',
  },
  {
    category: true,
    title: 'Components',
    key: '2kw0b',
  },
  {
    title: 'Widgets',
    key: '90c2s4',
    url: '/widgets',
    icon: 'fe fe-image',
    children: [
      {
        title: 'General',
        key: 'oomius',
        url: '/widgets/general',
      },
      {
        title: 'Lists',
        key: '40yu9r',
        url: '/widgets/lists',
      },
      {
        title: 'Tables',
        key: 'nuf1vf',
        url: '/widgets/tables',
      },
      {
        title: 'Charts',
        key: 'mw15uj',
        url: '/widgets/charts',
      },
    ],
  },
  {
    title: 'Cards',
    key: 'c075qe',
    url: '/cards',
    icon: 'fe fe-credit-card',
    children: [
      {
        title: 'Basic Cards',
        key: 'j3q7kr',
        url: '/cards/basic',
      },
      {
        title: 'Tabbed Cards',
        key: '25rap8',
        url: '/cards/tabbed',
      },
    ],
  },
  {
    title: 'Tables',
    key: '62sqvb',
    url: '/tables',
    icon: 'fe fe-grid',
    children: [
      {
        title: 'Ant Design',
        key: '3gyey5',
        url: '/tables/antd',
      },
      {
        title: 'Bootstrap',
        key: 'amvqq',
        url: '/tables/bootstrap',
      },
    ],
  },
  {
    title: 'Charts',
    key: '783vor',
    url: '/charts',
    icon: 'fe fe-pie-chart',
    children: [
      {
        title: 'Chartist.js',
        key: 'jlx0h',
        url: '/charts/chartistjs',
      },
      {
        title: 'Chart.js',
        key: '7yv6f',
        url: '/charts/chartjs',
      },
      {
        title: 'C3',
        key: 'dxcyvo',
        url: '/charts/C3',
      },
    ],
  },
  {
    title: 'Icons',
    key: 'fla1pc',
    url: '/icons',
    icon: 'fe fe-star',
    children: [
      {
        title: 'Feather Icons',
        key: '677srg',
        url: '/icons/feather-icons',
      },
      {
        title: 'Fontawesome',
        key: '3ghw6l',
        url: '/icons/fontawesome',
      },
      {
        title: 'Linearicons',
        key: 'bwvp9',
        url: '/icons/linearicons-free',
      },
      {
        title: 'Icomoon Free',
        key: 'lwyu1r',
        url: '/icons/icomoon-free',
      },
    ],
  },
  {
    category: true,
    title: 'Advanced',
    key: 'krwgag',
  },
  {
    title: 'Form Examples',
    key: 'jjiyzn',
    url: '/advanced/form-examples',
    icon: 'fe fe-menu',
  },
  {
    title: 'Email Templates',
    key: '81n64m',
    url: '/advanced/email-templates',
    icon: 'fe fe-mail',
  },
  {
    title: 'Pricing Tables',
    key: 'jk7lfk',
    url: '/advanced/pricing-tables',
    icon: 'fe fe-command',
  },
  {
    title: 'Invoice',
    key: 'kf8csg',
    url: '/advanced/invoice',
    icon: 'fe fe-file-text',
  },
  {
    title: 'Utilities',
    key: 'buvas4',
    url: '/advanced/utilities',
    icon: 'fe fe-hard-drive',
  },
  {
    title: 'Grid',
    key: 'thqbnl5',
    url: '/advanced/grid',
    icon: 'fe fe-grid',
  },
  {
    title: 'Typography',
    key: '59lm7a',
    url: '/advanced/typography',
    icon: 'fe fe-type',
  },
  {
    title: 'Colors',
    key: '97ptgj',
    url: '/advanced/colors',
    icon: 'fe fe-feather',
  },
  {
    title: 'Nested Items',
    key: '7nnrzj',
    url: '/nested',
    icon: 'fe fe-layers',
    children: [
      {
        title: 'Level 1',
        key: '9314t',
        url: '/nested/1',

        children: [
          {
            title: 'Level 2',
            key: '423uh',
            url: '/nested/2',
          },
        ],
      },
    ],
  },*/

  // VB:REPLACE-END:MENU-CONFIG
]
export const getMenuStudentData = [
  // VB:REPLACE-START:MENU-CONFIG
  {
    category: true,
    title: 'espace étudiant',
    key: 'q7r3dhr',
  }, {
    title: 'Proposition de sujet',
    key: 'popdf',
    url: '/student/proposition',
    icon: 'fe fe-file-plus',
  },
  {
    title: 'Suggestion organismes ',
    key: 'Organismes',
    url: '/student/organismes',
    icon: 'fe fe-database',
  },

]
