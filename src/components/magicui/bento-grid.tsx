import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid auto-rows-[22rem] lg:grid-cols-4 gap-4 w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  description,
  href,
  cta,
  color,
}: {
  name: string;
  className: string;
  description: string;
  href: string;
  cta: string;
  color: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      "border w-full",
      className
    )}
  >
    <div className="flex items-center w-full gap-x-2">
      <div className="pointer-events-none z-30 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-1">
        <h3 className="text-4xl font-bold mix-blend-difference">{name}</h3>
        <p className="max-w-md text-muted-foreground transition-opacity duration-300 z-40">
          {description}
        </p>
      </div>
      <Button
        variant="outline"
        asChild
        size="sm"
        className="z-40 opacity-0 pointer-events-auto absolute bottom-6 right-6 rounded-full group-hover:opacity-100 transition-all duration-300"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div
      className="pointer-events-none absolute inset-0 opacity-0 z-10 transition-opacity duration-300 group-hover:opacity-100"
      style={{ background: `linear-gradient(to left, ${color}, transparent)` }}
    />
  </div>
);

export { BentoCard, BentoGrid };
