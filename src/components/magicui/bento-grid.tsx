import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  background,
  description,
  href,
  cta,
  color,
}: {
  name: string;
  className: string;
  background: ReactNode;
  description: string;
  href: string;
  cta: string;
  color: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      "bg-card border w-full",
      className
    )}
  >
    <div>{background}</div>
    <div className="flex items-center w-full gap-x-2">
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-1">
        <h3 className="text-4xl font-bold text-card-foreground">{name}</h3>
        <p className="max-w-md text-muted-foreground transition-opacity duration-300">
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
    {/*     <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
     */}
  </div>
);

export { BentoCard, BentoGrid };
