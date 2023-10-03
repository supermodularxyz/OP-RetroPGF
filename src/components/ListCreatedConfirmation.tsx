import { tv } from "tailwind-variants";
import { Button } from "./ui/Button";
import Link from "next/link";
import Image from "next/image";
import ballotConfirmationSunny from "../assets/ballot-confirmation-sunny.png";
import ConfettiExplosion, {
  type ConfettiProps,
} from "react-confetti-explosion";
import React from "react";
import { createComponent } from "./ui";

const Card = createComponent("div", tv({ base: "rounded-3xl border p-8" }));

export const ListCreatedConfirmation = ({ websiteUrl = "" }) => {
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
      <div className="grid gap-6">
        <Card>
          <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-16">
            <div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900 md:text-4xl">
                Your list has been created 🥳
              </h3>
              <p className="mb-10 text-neutral-700">
                Thank you for participating in RetroPGF 3. Please help us
                improve the process by providing feedback on your experience as
                a badgeholder!
              </p>
              <Button variant="outline" as={Link} href={websiteUrl}>
                Return to {websiteUrl}
              </Button>
            </div>
            <Image
              src={ballotConfirmationSunny}
              alt=""
              className="h-[400px] max-h-[30vw] w-[400px] max-w-[30vw] flex-shrink-0 rounded-[40px]"
            />
          </div>
        </Card>

        <Card>
          <div>
            <h5 className="mb-3 text-2xl font-bold">
              Help us improve next round of RetroPGF
            </h5>
            <p className="mb-6 text-neutral-700">
              Your anonymized feedback will be influential to help us iterate on
              Optimism&apos;s RetroPGF process.
            </p>
            <Button
              variant="primary"
              as={Link}
              target="_blank"
              href={"example.com"}
            >
              Share your feedback
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
