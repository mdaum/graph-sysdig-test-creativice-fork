import regionHostnames from './regionHostnames';
export function getWebLink(region: string, urlPath: string) {
  return `${regionHostnames[region]}secure${urlPath}`;
}
