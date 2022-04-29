export const getMenuData = [
  // VB:REPLACE-START:MENU-CONFIG
  {
    category: true,
    title: 'Administration',
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
    title: 'Sujets',
    key: 'Sujets',
    url: '/admin/sujets',
    icon: 'fe fe-book-open',
  },

  {
    category: true,
    title: 'Enseignant',
    key: 'q7r3hr',
  },
  {
    title: 'Validation des sujets',
    key: 'sujetA',
    url: '/admin/sujetaffecte',
    icon: 'fe fe-book-open',
  },
  {
    category: true,
    title: 'Service de stage',
    key: 'q7r3gdhr',
  },
  {
    title: 'Organismes',
    key: 'Organismes',
    url: '/admin/organismes',
    icon: 'fe fe-database',
  },
  {
    title: 'Session',
    key: 'Session',
    url: '/admin/session',
    icon: 'fe fe-calendar',
  },
  {
    title: 'Les soutenance',
    icon: 'fe fe-book-open',
    children: [
      {
        title: 'Planifier les soutenance',
        key: 'iadsepr',
        url: '/admin/soutenance',
      },

      {
        title: 'Visualiser vos plannification',
        key: 'oi2idv',
        url: '/admin/soutenance/planned',
      },
    ],
  },


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
