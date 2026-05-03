package com.nmit.dutyexchange.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String to,
            String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Subhir625@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
            System.out.println("Email Sent Successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
        }
    }

    public void sendMessageWithAttachment(String to,
            String subject, String text,
            byte[] attachmentData,
            String attachmentName) {
        try {
            jakarta.mail.internet.MimeMessage message = emailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, true);

            helper.setFrom("Subhir625@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            helper.addAttachment(attachmentName, new org.springframework.core.io.ByteArrayResource(attachmentData));

            emailSender.send(message);
            System.out.println("Email with Attachment Sent Successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Error sending email with attachment to " + to + ": " + e.getMessage());
        }
    }

    public void sendSimpleMessage(String[] to,
            String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Subhir625@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
            System.out.println("Email Sent Successfully to: " + String.join(", ", to));
        } catch (Exception e) {
            System.err.println("Error sending email to " + String.join(", ", to) + ": " + e.getMessage());
        }
    }

    public void sendMessageWithAttachment(String[] to,
            String subject, String text,
            byte[] attachmentData,
            String attachmentName) {
        try {
            jakarta.mail.internet.MimeMessage message = emailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, true);

            helper.setFrom("Subhir625@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            helper.addAttachment(attachmentName, new org.springframework.core.io.ByteArrayResource(attachmentData));

            emailSender.send(message);
            System.out.println("Email with Attachment Sent Successfully to: " + String.join(", ", to));
        } catch (Exception e) {
            System.err
                    .println("Error sending email with attachment to " + String.join(", ", to) + ": " + e.getMessage());
        }
    }
}
