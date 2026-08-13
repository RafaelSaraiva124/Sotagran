"use server";

import { Resend } from "resend";

export type ContactFormState = {
    status: "idle" | "success" | "error";
    message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(
    _prevState: ContactFormState,
    formData: FormData,
): Promise<ContactFormState> {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
        return {
            status: "error",
            message: "Preencha o nome, o email e a mensagem.",
        };
    }

    if (!EMAIL_PATTERN.test(email)) {
        return { status: "error", message: "Introduza um email válido." };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_EMAIL_TO;

    if (!apiKey || !to) {
        console.error(
            "Contact form is missing RESEND_API_KEY or CONTACT_EMAIL_TO env vars.",
        );

        return {
            status: "error",
            message: "Não foi possível enviar a mensagem. Tente novamente mais tarde.",
        };
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
        from: process.env.CONTACT_EMAIL_FROM ?? "Sotragran <onboarding@resend.dev>",
        to,
        replyTo: email,
        subject: `Novo pedido de contacto — ${name}`,
        text: [
            `Nome: ${name}`,
            `Email: ${email}`,
            phone ? `Telefone: ${phone}` : null,
            "",
            message,
        ]
            .filter((line) => line !== null)
            .join("\n"),
    });

    if (error) {
        console.error("Resend failed to send contact form email:", error);

        return {
            status: "error",
            message: "Não foi possível enviar a mensagem. Tente novamente.",
        };
    }

    return {
        status: "success",
        message: "Mensagem enviada. Entraremos em contacto brevemente.",
    };
}
