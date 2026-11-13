"use client";

import type { ComponentProps } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const AlertDialog = Dialog;
const AlertDialogTrigger = DialogTrigger;
const AlertDialogHeader = DialogHeader;
const AlertDialogFooter = DialogFooter;
const AlertDialogTitle = DialogTitle;
const AlertDialogDescription = DialogDescription;

function AlertDialogContent(props: ComponentProps<typeof DialogContent>) {
  return <DialogContent role="alertdialog" dismissible={false} {...props} />;
}

function AlertDialogAction({ children, ...props }: ComponentProps<typeof DialogClose>) {
  return (
    <DialogClose variant="danger" {...props}>
      {children}
    </DialogClose>
  );
}

function AlertDialogCancel({ children, ...props }: ComponentProps<typeof DialogClose>) {
  return (
    <DialogClose variant="secondary" {...props}>
      {children}
    </DialogClose>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
};
