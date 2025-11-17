import React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/core/utils";

const spinnerVariants = cva("relative block text-foreground", {
	variants: {
		size: {
			"xs": "w-4 h-4",
			"sm": "w-5 h-5",
			"md": "w-6 h-6",
			"lg": "w-8 h-8",
			"xl": "w-10 h-10",
			"2xl": "w-12 h-12",
		},
	},
	defaultVariants: {
		size: "sm",
	},
});

type SpinnerProps = React.HTMLAttributes<HTMLSpanElement> &
	VariantProps<typeof spinnerVariants> & { asChild?: boolean };

const Spinner = ({ className = "", size, asChild = false, ...props }: SpinnerProps) => {
	const Comp = asChild ? Slot : "span";
	const bgMatches = className.match(/(?:dark:bg-|bg-)[\w-]+/g) || [];
	const restClass = className.replace(/(?:dark:bg-|bg-)[\w-]+/g, "").trim();

	return (
		<Comp
			data-slot="spinner"
			role="status"
			aria-live="polite"
			aria-label="Loading"
			aria-busy="true"
			className={cn(spinnerVariants({ size }), restClass)}
			{...props}
		>
			<span
				className={cn(
					"absolute inset-0 animate-spin rounded-full border-2 border-solid border-current border-t-transparent",
					...bgMatches,
				)}
				style={{ animationDuration: "1.5s" }}
			/>
		</Comp>
	);
};

export { Spinner, spinnerVariants };
