"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FieldContextValue = {
  id: string;
  invalid: boolean;
  disabled: boolean;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useField() {
  const context = React.useContext(FieldContext);

  if (!context) {
    throw new Error("Field parts must be used inside <Field>.");
  }

  return context;
}

function Field({
  id,
  invalid = false,
  disabled = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  invalid?: boolean;
  disabled?: boolean;
}) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldContext.Provider value={{ id: fieldId, invalid, disabled }}>
      <div data-slot="field" className={cn("grid gap-2", className)} {...props}>
        {children}
      </div>
    </FieldContext.Provider>
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  const { id, disabled } = useField();

  return (
    <label
      htmlFor={id}
      data-slot="field-label"
      className={cn("text-body-sm font-medium text-ink", disabled && "opacity-50", className)}
      {...props}
    />
  );
}

function FieldControl({
  children,
  render,
}: {
  children?: React.ReactElement;
  render?: React.ReactElement;
}) {
  const { id, invalid, disabled } = useField();
  const element = children ?? render;

  if (!element) {
    return null;
  }

  return React.cloneElement(element as React.ReactElement<Record<string, unknown>>, {
    id,
    "aria-describedby": `${id}-description ${id}-error`,
    "aria-invalid": invalid || undefined,
    disabled: disabled || (element.props as { disabled?: boolean }).disabled,
  });
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { id } = useField();

  return (
    <p
      id={`${id}-description`}
      data-slot="field-description"
      className={cn("text-body-sm text-ink-muted", className)}
      {...props}
    />
  );
}

function FieldError({
  className,
  children,
  match,
  ...props
}: React.ComponentProps<"p"> & { match?: boolean }) {
  const { id } = useField();

  if (!children || match === false) {
    return null;
  }

  return (
    <p
      id={`${id}-error`}
      role="alert"
      data-slot="field-error"
      className={cn("text-body-sm font-medium text-danger", className)}
      {...props}
    >
      {children}
    </p>
  );
}

const FieldRoot = Field;
const FieldLabelCompat = FieldLabel;
const FieldDescriptionCompat = FieldDescription;
const FieldErrorCompat = FieldError;
const FieldControlCompat = FieldControl;

const FieldWithParts = Object.assign(Field, {
  Root: FieldRoot,
  Label: FieldLabelCompat,
  Control: FieldControlCompat,
  Description: FieldDescriptionCompat,
  Error: FieldErrorCompat,
});

export { FieldWithParts as Field, FieldControl, FieldDescription, FieldError, FieldLabel };
