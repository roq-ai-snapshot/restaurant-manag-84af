const mapping: Record<string, string> = {
  menus: 'menu',
  'operational-hours': 'operational_hours',
  restaurants: 'restaurant',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
