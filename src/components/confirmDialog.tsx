import React from "react";

import { VariantProps } from "class-variance-authority";
import { Xmark } from "iconoir-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type ConfirmDialogProps = {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	variant?: VariantProps<typeof buttonVariants>["variant"];
	trigger?: React.ReactNode;
	title?: string;
	description?: string;
	content?: React.ReactNode;
	onConfirm?: () => Promise<void> | void;
	confirmText?: string;
	cancelText?: string;
};

export const ConfirmDialog = ({
	open: openProp,
	onOpenChange: onOpenChangeProp,
	variant = "default",
	trigger,
	title = "Are you sure?",
	description = "This action cannot be undone.",
	content,
	onConfirm,
	confirmText = "Confirm",
	cancelText = "Cancel",
}: ConfirmDialogProps) => {
	const [internalOpen, setInternalOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const isControlled = openProp !== undefined && typeof onOpenChangeProp === "function";
	const open = isControlled ? openProp : internalOpen;
	const onOpenChange = isControlled ? onOpenChangeProp : setInternalOpen;

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			{trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
			<AlertDialogContent>
				{content ? (
					<div className="relative">
						<Button
							variant="ghost"
							className="absolute top-0 right-0 z-10"
							onClick={() => onOpenChange(false)}
							aria-label="Close"
						>
							<Xmark className="size-4" />
						</Button>
						<AlertDialogHeader>
							<div className="flex flex-col mb-2">
								<AlertDialogTitle>{title}</AlertDialogTitle>
								<AlertDialogDescription>{description}</AlertDialogDescription>
							</div>
							{content}
						</AlertDialogHeader>
					</div>
				) : (
					<>
						<AlertDialogHeader>
							<AlertDialogTitle>{title}</AlertDialogTitle>
							<AlertDialogDescription>{description}</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>
								<span className="inline-flex items-center justify-center min-w-16">
									{cancelText}
								</span>
							</AlertDialogCancel>
							<AlertDialogAction
								variant={variant}
								onClick={async () => {
									try {
										setLoading(true);
										await onConfirm?.();
									} finally {
										setLoading(false);
									}
								}}
								className="flex items-center justify-center gap-2"
								disabled={loading}
							>
								<span className="inline-flex items-center justify-center min-w-16">
									{loading ? <Spinner size="xs" /> : confirmText}
								</span>
							</AlertDialogAction>
						</AlertDialogFooter>
					</>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
};
