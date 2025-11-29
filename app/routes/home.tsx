import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Monitoreo de recursos" },
    { name: "description", content: "Monitoreo de recursos de la colonia" },
  ];
}

export default function Home() {
  return (
    <div className="container">
      <h1>Monitoreo de recursos</h1>
    </div>
  )
}
