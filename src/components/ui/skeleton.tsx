import React from "react";

import { cn } from "@/core/utils";

const Skeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
	<div
		data-slot="skeleton"
		className={cn("bg-muted-foreground/50 animate-pulse rounded-lg", className)}
		{...props}
	/>
);

export { Skeleton };
