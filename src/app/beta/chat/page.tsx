"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useChatStore from "@/store/chat.store";

export default function Home() {
  const { userPersona, situation, setUserPersona, setSituation } =
    useChatStore();

  console.log({ userPersona, situation });

  return (
    <div className="h-screen w-full flex flex-col items-center justify-around gap-y-40">
      {/* Header */}
      <div className="flex items-center justify-around">
        <h1 className="text-8xl font-black tracking-tighter">Laughtale</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-start gap-y-4 w-1/3">
        <Input
          placeholder="Cab Driver"
          value={userPersona}
          onChange={(e) => setUserPersona(e.target.value)}
          className=""
        />

        <Textarea
          placeholder="Just Landed in Bangalore Airport."
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          className=""
        />

        <div className="w-full flex items-center justify-center">
          <Button
            className="w-full"
            variant={"secondary"}
            onClick={() => router.push("/chat")}
          >
            Start
          </Button>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}
