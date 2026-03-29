import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("resources", "routes/Resources.tsx"),
  route("scale-finder", "routes/ScaleFinder.tsx"),
  route("chords", "routes/Chords.tsx"),
] satisfies RouteConfig;