
import ConnectButton from "~/components/ConnectButton/ConnectButton";
import type { Route } from "./+types/about";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: "about page" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (<div>
        <ConnectButton />
        <p>{loaderData.message}</p></div> );
}
