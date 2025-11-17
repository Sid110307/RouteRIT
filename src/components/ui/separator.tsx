import React from "react";

import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/core/utils";

const Separator = ({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) => (
	<SeparatorPrimitive.Root
		data-slot="separator"
		decorative={decorative}
		orientation={orientation}
		className={cn(
			"bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-[90%] self-center data-[orientation=vertical]:h-[90%] data-[orientation=vertical]:w-px",
			className,
		)}
		{...props}
	/>
);

export { Separator };
