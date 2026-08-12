import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";

export function start(routes: RouteObject[]) {
  const element = document.getElementById("root");

  if (!element) {
    throw new Error('bunnext: missing <div id="root"></div>');
  }

  const router = createBrowserRouter(routes);
  createRoot(element).render(<RouterProvider router={router} />);
}
