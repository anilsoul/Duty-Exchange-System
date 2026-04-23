package com.nmit.dutyexchange.controller;

import com.nmit.dutyexchange.model.DutyExchange;
import com.nmit.dutyexchange.service.DutyExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.nmit.dutyexchange.service.PdfGenerationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/api/duty-exchange")
@CrossOrigin(origins = "*") // Allow all for dev
public class DutyExchangeController {

    @Autowired
    private DutyExchangeService service;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @PostMapping
    public ResponseEntity<DutyExchange> createExchange(@RequestBody DutyExchange exchange) {
        return ResponseEntity.ok(service.createExchange(exchange));
    }

    @GetMapping
    public ResponseEntity<List<DutyExchange>> getAllExchanges() {
        return ResponseEntity.ok(service.getAllExchanges());
    }

    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getExchangePdf(@PathVariable String id) {
        DutyExchange exchange = service.getExchangeById(id);
        if (exchange == null) {
            return ResponseEntity.notFound().build();
        }
        byte[] pdfBytes = pdfGenerationService.generateDutyExchangePdf(exchange);
        if (pdfBytes == null) {
            return ResponseEntity.internalServerError().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "DutyExchangeForm_" + id + ".pdf");
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DutyExchange> updateStatus(@PathVariable String id, @RequestBody String status) {
        // Simple string body might come with quotes, clean it if necessary or change to
        // DTO.
        // For simplicity assuming raw string or simple JSON.
        // Better to use a DTO or @RequestParam, but keeping it flexible.
        String cleanStatus = status.replaceAll("\"", "");
        DutyExchange updated = service.updateStatus(id, cleanStatus);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // Add endpoint to handle update status via query param for easier testing if
    // needed
    @PostMapping("/{id}/approve-hod")
    public ResponseEntity<DutyExchange> approveHod(@PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "FACULTY") String userRole) {
        if (!"HOD".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only HOD can perform this action");
        }
        return ResponseEntity.ok(service.updateHodStatus(id, "APPROVED"));
    }

    @PostMapping("/{id}/reject-hod")
    public ResponseEntity<DutyExchange> rejectHod(@PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "FACULTY") String userRole) {
        if (!"HOD".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only HOD can perform this action");
        }
        return ResponseEntity.ok(service.updateHodStatus(id, "REJECTED"));
    }

    @PostMapping("/{id}/approve-ceo")
    public ResponseEntity<DutyExchange> approveCeo(@PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "FACULTY") String userRole) {
        if (!"CEO".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only CEO can perform this action");
        }
        return ResponseEntity.ok(service.updateCeoStatus(id, "APPROVED"));
    }

    @PostMapping("/{id}/reject-ceo")
    public ResponseEntity<DutyExchange> rejectCeo(@PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "FACULTY") String userRole) {
        if (!"CEO".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only CEO can perform this action");
        }
        return ResponseEntity.ok(service.updateCeoStatus(id, "REJECTED"));
    }

    // Deprecated or Legacy endpoints mapped to HOD for now to avoid breaking if
    // frontend is mixed
    @PostMapping("/{id}/approve")
    public ResponseEntity<DutyExchange> approve(@PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "FACULTY") String userRole) {
        if (!"HOD".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only HOD can perform this action");
        }
        return ResponseEntity.ok(service.updateHodStatus(id, "APPROVED"));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<DutyExchange> reject(@PathVariable String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "FACULTY") String userRole) {
        if (!"HOD".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only HOD can perform this action");
        }
        return ResponseEntity.ok(service.updateHodStatus(id, "REJECTED"));
    }
}
