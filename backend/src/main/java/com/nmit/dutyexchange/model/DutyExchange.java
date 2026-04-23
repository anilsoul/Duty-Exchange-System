package com.nmit.dutyexchange.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "duty_exchanges")
public class DutyExchange {
    @Id
    private String id;

    private FacultyInfo allotted;
    private FacultyInfo exchangedWith;

    private String status; // PENDING, APPROVED, REJECTED
    private String requestDate;
    private String hodApproval; // PENDING, APPROVED, REJECTED
    private String ceoApproval; // PENDING, APPROVED, REJECTED

    @Data
    public static class FacultyInfo {
        private String name;
        private String email;
        private String department;
        private String dutyType;
        private String date;
        private String facultySignature;
        private String hodSignature;
        private String ceoSignature;
    }
}
