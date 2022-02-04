import build from 'build-route-tree';

const rawTree = {
  admin: null,
};

export const routes = build(rawTree);
