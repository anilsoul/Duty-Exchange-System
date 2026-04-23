package com.nmit.dutyexchange.service;

import com.nmit.dutyexchange.model.DutyExchange;
import com.nmit.dutyexchange.repository.DutyExchangeRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

import java.util.List;

@Service
public class DutyExchangeService {

    @Autowired
    private DutyExchangeRepository repository;

    @Autowired
    private NotificationService notificationService;

    public DutyExchange createExchange(DutyExchange exchange) {
        exchange.setStatus("PENDING");
        exchange.setHodApproval("PENDING");
        if (exchange.getAllotted() != null && "MSE".equalsIgnoreCase(exchange.getAllotted().getDutyType())) {
            exchange.setCeoApproval("NOT_REQUIRED");
        } else {
            exchange.setCeoApproval("PENDING");
        }
        exchange.setRequestDate(LocalDate.now().toString());
        DutyExchange savedExchange = repository.save(exchange);

        // Send emails async
        notificationService.sendNewExchangeNotifications(savedExchange);
        notificationService.sendPendingHodApproval(savedExchange);

        return savedExchange;
    }

    public List<DutyExchange> getAllExchanges() {
        return repository.findAll();
    }

    public DutyExchange getExchangeById(String id) {
        return repository.findById(id).orElse(null);
    }

    @SuppressWarnings("null")
    public DutyExchange updateHodStatus(String id, String status) {
        return repository.findById(id).map(exchange -> {
            exchange.setHodApproval(status);
            if ("REJECTED".equals(status)) {
                exchange.setStatus("REJECTED");
                exchange.setCeoApproval("REJECTED"); // Auto-reject if HOD rejects
            } else if ("APPROVED".equals(status)) {
                // Check if duty is MSE
                boolean isMse = false;
                if (exchange.getAllotted() != null && "MSE".equalsIgnoreCase(exchange.getAllotted().getDutyType())) {
                    isMse = true;
                }

                if (isMse) {
                    exchange.setStatus("APPROVED");
                    exchange.setCeoApproval("NOT_REQUIRED");
                } else {
                    // For SEE, status remains PENDING until CEO approves
                    exchange.setStatus("PENDING");
                }

                // Set text signature for PDF
                if (exchange.getAllotted() != null)
                    exchange.getAllotted().setHodSignature("");
                if (exchange.getExchangedWith() != null)
                    exchange.getExchangedWith().setHodSignature("");
            }
            DutyExchange updated = repository.save(exchange);
            if ("REJECTED".equals(status)) {
                notificationService.sendHodRejectionNotification(updated);
            } else if ("APPROVED".equals(status)) {
                boolean isMse = exchange.getAllotted() != null
                        && "MSE".equalsIgnoreCase(exchange.getAllotted().getDutyType());
                if (isMse) {
                    notificationService.sendDutyExchangeNotifications(updated, "APPROVED");
                } else {
                    notificationService.sendPendingCeoApproval(updated);
                }
            } else {
                notificationService.sendDutyExchangeNotifications(updated, status);
            }
            return updated;
        }).orElse(null);
    }

    @SuppressWarnings("null")
    public DutyExchange updateCeoStatus(String id, String status) {
        return repository.findById(id).map(exchange -> {
            exchange.setCeoApproval(status);
            if ("APPROVED".equals(status)) {
                if ("APPROVED".equals(exchange.getHodApproval())) {
                    exchange.setStatus("APPROVED");
                }
                // Set text signature for PDF
                if (exchange.getAllotted() != null)
                    exchange.getAllotted().setCeoSignature("");
                if (exchange.getExchangedWith() != null)
                    exchange.getExchangedWith().setCeoSignature("");
            } else if ("REJECTED".equals(status)) {
                exchange.setStatus("REJECTED");
            }
            DutyExchange updated = repository.save(exchange);
            notificationService.sendDutyExchangeNotifications(updated, status);
            return updated;
        }).orElse(null);
    }

    // Keeping generic for backward compatibility if needed, or mapped to legacy
    // behavior
    public DutyExchange updateStatus(String id, String status) {
        // This might need to be deprecated or routed to specific ones.
        // For now, let's assume this is mostly used for HOD in legacy, but better to
        // switch controller.
        return updateHodStatus(id, status);
    }
}
