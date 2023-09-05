import { Button } from "./ui/Button";
import { useState, useEffect } from "react";
import { type Allocation, ballotToArray, useBallot } from "~/hooks/useBallot";
import Link from "next/link";
import { Card } from "./ui/Card";
import { AllocationList } from "./AllocationList";
import Image from "next/image";
import ballotConfirmationSunny from "../assets/ballot-confirmation-sunny.png";
import { Lock } from "./icons";
import ConfettiExplosion, { type ConfettiProps } from "react-confetti-explosion";
import React from "react";

export const BallotConfirmation = () => {
  const { data: ballot } = useBallot();

  const [allocations, setAllocations] = useState<Allocation[] | undefined>(
    undefined
  );
  useEffect(() => {
    if (!ballot) return;
    setAllocations(ballotToArray(ballot));
  }, [ballot]);

  const confettiProps: ConfettiProps = {
    force: 0.4,
    duration: 3000,
    particleCount: 250,
    width: 3600,
    colors: ["#D5422F", "#1C8146", "#B01B98", "#7854F2"],
  };

  return (
    <section>
      <div className="flex items-center justify-around">
        <ConfettiExplosion {...confettiProps} />
      </div>
      <div className="m-auto grid max-w-5xl gap-6">
        <Card className="px-9 py-8">
          <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-16">
            <div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900 md:text-4xl">
                Your vote has been received 🥳
              </h3>
              <p className="mb-10 text-neutral-700">
                Thank you for participating in RetroPGF 3. Please help us
                improve the process by providing feedback on your experience as
                a badgeholder!
              </p>
              <Button variant="outline" as={Link} href={"www.example.com"}>
                Share your feedback
              </Button>
            </div>
            <Image
              src={ballotConfirmationSunny}
              alt=""
              className="h-[400px] max-h-[30vw] w-[400px] max-w-[30vw] flex-shrink-0 rounded-[40px]"
            />
          </div>
        </Card>

        <Card className="px-9 py-8">
          <div className="mb-6">
            <h5 className="mb-3 text-2xl font-bold">
              Here&apos;s how you voted!
            </h5>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-neutral-600" />
              <p className="text-neutral-700">
                Your vote will be private until the voting period ends
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border-b py-3">
            <p className="text-neutral-600">Project name</p>
            <p className="text-neutral-600">OP allocated by you</p>
          </div>

          <section className="max-h-[480px] overflow-y-scroll">
            {allocations && <AllocationList allocations={allocations} />}
          </section>
        </Card>
        <Card className="px-9 py-8">
          <div>
            <h5 className="mb-3 text-2xl font-bold">
              Help us improve next round of RetroPGF
            </h5>
            <p className="mb-6 text-neutral-700">
              Your anonymized feedback will be influential to help us iterate on
              Optimism&apos;s RetroPGF process.
            </p>
            <Button variant="primary" as={Link} href={"example.com"}>
              Share your feedback
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
