package com.nmit.dutyexchange.service;

import com.nmit.dutyexchange.model.DutyExchange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private PdfGenerationService pdfService;

    @Value("${app.ceo.email:ceo@nmit.ac.in}")
    private String ceoEmail;

    @Value("${app.ceo.name:CEO}")
    private String ceoName;

    @Value("${app.hod.email:hod@nmit.ac.in}")
    private String hodEmail;

    @Value("${app.hod.name:HOD}")
    private String hodName;

    @Async
    public void sendDutyExchangeNotifications(DutyExchange exchange, String status) {
        // Generate PDF
        byte[] pdfBytes = null;
        String pdfName = "DutyExchange_" + exchange.getId() + ".pdf";

        try {
            pdfBytes = pdfService.generateDutyExchangePdf(exchange);
        } catch (Exception e) {
            System.err.println("Error generating PDF: " + e.getMessage());
            // Continue to send email without PDF or log error
        }

        String subject = "Duty Exchange Request Update: " + status;

        String commonText = String.format(
                "The duty exchange request for %s duty on %s has been finalized and %s by the designated authorities (HOD/CEO).",
                exchange.getAllotted().getDutyType(),
                exchange.getAllotted().getDate(),
                status.toUpperCase());

        if ("APPROVED".equalsIgnoreCase(status)) {
            commonText += "\n\nPlease find the attached PDF form.";
        }

        // Send to allotted faculty
        if (exchange.getAllotted().getEmail() != null && !exchange.getAllotted().getEmail().isEmpty()) {
            String text = String.format("Dear %s,\n\n%s", exchange.getAllotted().getName(), commonText);
            if (pdfBytes != null) {
                emailService.sendMessageWithAttachment(exchange.getAllotted().getEmail(), subject, text, pdfBytes,
                        pdfName);
            } else {
                emailService.sendSimpleMessage(exchange.getAllotted().getEmail(), subject, text);
            }
        }

        // Send to exchanged faculty
        if (exchange.getExchangedWith().getEmail() != null && !exchange.getExchangedWith().getEmail().isEmpty()
                && !exchange.getExchangedWith().getEmail().equalsIgnoreCase(exchange.getAllotted().getEmail())) {
            String text = String.format("Dear %s,\n\n%s", exchange.getExchangedWith().getName(), commonText);
            if (pdfBytes != null) {
                emailService.sendMessageWithAttachment(exchange.getExchangedWith().getEmail(), subject, text, pdfBytes,
                        pdfName);
            } else {
                emailService.sendSimpleMessage(exchange.getExchangedWith().getEmail(), subject, text);
            }
        }
    }

    @Async
    public void sendPendingCeoApproval(DutyExchange exchange) {
        String subject = "Action Required: Duty Exchange Request Pending CEO Approval";
        String text = String.format(
                "Dear %s,\n\nA duty exchange request between %s and %s for %s duty on %s has been APPROVED by the HOD and is now pending your approval.\n\nPlease log in to the system to review the request.",
                ceoName,
                exchange.getAllotted().getName(),
                exchange.getExchangedWith().getName(),
                exchange.getAllotted().getDutyType(),
                exchange.getAllotted().getDate());

        emailService.sendSimpleMessage(ceoEmail, subject, text);
    }

    @Async
    public void sendPendingHodApproval(DutyExchange exchange) {
        String subject = "Action Required: New Duty Exchange Request Pending HOD Approval";
        String text = String.format(
                "Dear %s,\n\nA new duty exchange request has been created between %s and %s for %s duty on %s and is pending your approval.\n\nPlease log in to the system to review the request.",
                hodName,
                exchange.getAllotted().getName(),
                exchange.getExchangedWith().getName(),
                exchange.getAllotted().getDutyType(),
                exchange.getAllotted().getDate());

        emailService.sendSimpleMessage(hodEmail, subject, text);
    }

    @Async
    public void sendHodRejectionNotification(DutyExchange exchange) {
        String subject = "Duty Exchange Request Update: REJECTED";
        String text = String.format(
                "Dear %s,\n\nYour duty exchange request with %s for %s duty on %s has been REJECTED by the HOD.",
                exchange.getAllotted().getName(),
                exchange.getExchangedWith().getName(),
                exchange.getAllotted().getDutyType(),
                exchange.getAllotted().getDate());

        if (exchange.getAllotted().getEmail() != null && !exchange.getAllotted().getEmail().isEmpty()) {
            emailService.sendSimpleMessage(exchange.getAllotted().getEmail(), subject, text);
        }
    }

    @Async
    public void sendNewExchangeNotifications(DutyExchange exchange) {
        // Send emails
        String subject = "New Duty Exchange Request";
        String allottedText = String.format(
                "Dear %s,\n\nYour duty exchange request with %s for %s duty on %s has been created and is PENDING approval.",
                exchange.getAllotted().getName(),
                exchange.getExchangedWith().getName(),
                exchange.getAllotted().getDutyType(),
                exchange.getAllotted().getDate());

        String exchangedWithText = String.format(
                "Dear %s,\n\n%s has requested a duty exchange with you for %s duty on %s. Status: PENDING.",
                exchange.getExchangedWith().getName(),
                exchange.getAllotted().getName(),
                exchange.getExchangedWith().getDutyType(),
                exchange.getExchangedWith().getDate());

        if (exchange.getAllotted().getEmail() != null && !exchange.getAllotted().getEmail().isEmpty()) {
            emailService.sendSimpleMessage(exchange.getAllotted().getEmail(), subject, allottedText);
        }

        if (exchange.getExchangedWith().getEmail() != null && !exchange.getExchangedWith().getEmail().isEmpty()) {
            emailService.sendSimpleMessage(exchange.getExchangedWith().getEmail(), subject, exchangedWithText);
        }
    }
}
