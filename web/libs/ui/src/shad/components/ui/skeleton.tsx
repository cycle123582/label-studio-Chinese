import { cn } from "../../utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      data-testid="skeleton-loader"
      className={cn(
        "bg-neutral-surface-active bg-no-repeat bg-shimmer-size bg-gradient-to-r",
        "from-white/5 via-white/20 to-white/5",
        "rounded-sm animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}

// background-image: linear-gradient(90deg, rgb(255 255 255 / 5%), rgb(255 255 255 / 20%), rgb(255 255 255 / 5%));
// background-size: 2em 100%;
// background-repeat: no-repeat;
// background-position: left -2em top 0;
// animation: shimmer 1.3s ease infinite;

export { Skeleton };
