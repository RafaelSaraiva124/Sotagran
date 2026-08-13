"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";

const INITIAL_STATE: ContactFormState = { status: "idle" };

const fieldInputClassName =
    "rounded-none border-0 border-b border-graphite/20 bg-transparent px-0 text-graphite placeholder:text-graphite/40 focus-visible:border-copper focus-visible:ring-0";

export default function ContactForm() {
    const [state, formAction, pending] = useActionState(submitContactForm, INITIAL_STATE);

    return (
        <form action={formAction} className="w-full max-w-md">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="contact-name" className="survey-label text-graphite/50">
                        Nome
                    </FieldLabel>
                    <Input
                        id="contact-name"
                        name="name"
                        required
                        autoComplete="name"
                        className={fieldInputClassName}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="contact-email" className="survey-label text-graphite/50">
                        Email
                    </FieldLabel>
                    <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={fieldInputClassName}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="contact-phone" className="survey-label text-graphite/50">
                        Telefone{" "}
                        <span className="normal-case tracking-normal text-graphite/30">
                            (opcional)
                        </span>
                    </FieldLabel>
                    <Input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className={fieldInputClassName}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="contact-message" className="survey-label text-graphite/50">
                        Mensagem
                    </FieldLabel>
                    <Textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={4}
                        className={cn(fieldInputClassName, "min-h-24 resize-none")}
                    />
                </Field>

                {state.status !== "idle" && state.message ? (
                    <FieldError
                        className={cn(
                            "font-mono text-xs normal-case tracking-normal",
                            state.status === "success" && "text-stone",
                        )}
                    >
                        {state.message}
                    </FieldError>
                ) : null}

                <Button
                    type="submit"
                    disabled={pending}
                    className="w-full justify-center bg-copper text-warm-white hover:bg-copper/90 sm:w-fit"
                >
                    {pending ? "A enviar…" : "Enviar mensagem →"}
                </Button>
            </FieldGroup>
        </form>
    );
}
