import { title } from "@/components/primitives";
import {Divider} from "@nextui-org/divider";

export default function BlogPage() {
  return (
    <main className={`flex flex-col min-w-screen gap-x-5 lg:flex-row`}>
      <div className="flex flex-1 min-h-screen flex-col items-center">
      <h1 className={`text-center text-[1.7rem] lg:text-[2.1rem] lg:text-5xl leading-9 tracking-tight font-semibold`}>
        Document Types</h1>
      </div>
      <Divider orientation="vertical" style={{ height: 'auto', alignSelf: 'stretch' }} />
      <div className="flex flex-1 min-h-screen flex-col items-center" >
        <h1 className={' text-[1.7rem] lg:text-[2.1rem] lg:text-5xl leading-9 tracking-tight font-semibold'}>Phases</h1>
      </div>
    </main>
  );
}
