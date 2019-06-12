export const menuItems = [
  // { label: 'Overview', value: 'overview', icon: 'overviewIcon' },
  { label: 'Excise Departments', value: 'excise-management', icon: 'exciseDeptIcon' },
  { label: 'Rules', value: 'rules', icon: 'rulesIcon' },
  { label: 'Delivery Operators', value: 'dso-management', icon: 'dsoIcon' },
  { label: 'OTTP Management', value: 'ottp-management', icon: 'ottpIcon' },
  { label: 'User Management', value: 'excise-users', icon: 'customerIcon' },
  { label: 'Reports', value: 'reports', icon: 'reportsIcon' },
]

export const dsoNavbarItems = [
  { label: "Details", value: "details", path: "/home/dso/view-details" },
  { label: "Locations", value: "locations", path: "/home/dso/view-locations" },
  { label: "Credits", value: "credits", path: "/home/dso/view-credits" },
  { label: "Users", value: "users", path: "/home/dso/view-users" }
]

export const exciseNavbarItems = [
  { label: "Details", value: "details", path: "/home/excise/view-details" },
  { label: "Operations", value: "operations", path: "/home/excise/view-operations" },
  { label: "Users", value: "users", path: "/home/excise/view-users" }
]

export const userNavbarItems = [
  { label: "Excise", value: "excise", path: "/home/excise-users" },
  { label: "Dso", value: "dso", path: "/home/dso-users" },
  { label: "Support", value: "support", path: "/home/support-users" }
]