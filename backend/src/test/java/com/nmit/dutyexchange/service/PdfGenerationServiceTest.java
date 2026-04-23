package com.nmit.dutyexchange.service;

import com.nmit.dutyexchange.model.DutyExchange;
import org.junit.jupiter.api.Test;

import java.io.FileOutputStream;
import java.io.IOException;

public class PdfGenerationServiceTest {

    @Test
    public void testGeneratePdf() throws IOException {
        PdfGenerationService service = new PdfGenerationService();

        DutyExchange exchange = new DutyExchange();
        exchange.setId("TEST-ID-123");
        exchange.setStatus("APPROVED");
        exchange.setHodApproval("APPROVED");
        exchange.setRequestDate("2026-02-03");

        // Small red dot base64 image
        String base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

        DutyExchange.FacultyInfo allotted = new DutyExchange.FacultyInfo();
        allotted.setName("ankur");
        allotted.setEmail("ankur@example.com");
        allotted.setDutyType("MSE");
        allotted.setDate("03-02-2026");
        allotted.setFacultySignature(base64Image);
        allotted.setHodSignature(base64Image);

        DutyExchange.FacultyInfo exchangedWith = new DutyExchange.FacultyInfo();
        exchangedWith.setName("anurag");
        exchangedWith.setEmail("anurag@example.com");
        exchangedWith.setDutyType("MSE");
        exchangedWith.setDate("03-02-2026");
        exchangedWith.setFacultySignature(base64Image);
        exchangedWith.setHodSignature(base64Image);

        exchange.setAllotted(allotted);
        exchange.setExchangedWith(exchangedWith);

        byte[] pdfBytes = service.generateDutyExchangePdf(exchange);

        if (pdfBytes != null) {
            try (FileOutputStream fos = new FileOutputStream("test-duty-exchange.pdf")) {
                fos.write(pdfBytes);
                System.out.println("PDF generated successfully: test-duty-exchange.pdf");
            }
        } else {
            System.err.println("Failed to generate PDF");
        }
    }

    @Test
    public void testGenerateSeePdf() throws IOException {
        PdfGenerationService service = new PdfGenerationService();

        DutyExchange exchange = new DutyExchange();
        exchange.setId("TEST-ID-SEE-123");
        exchange.setStatus("APPROVED");
        exchange.setHodApproval("APPROVED");
        exchange.setRequestDate("2026-02-03");

        // Small red dot base64 image
        String base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

        DutyExchange.FacultyInfo allotted = new DutyExchange.FacultyInfo();
        allotted.setName("ankur");
        allotted.setEmail("ankur@example.com");
        allotted.setDutyType("SEE");
        allotted.setDate("03-02-2026");
        allotted.setFacultySignature(base64Image);
        allotted.setHodSignature(base64Image);

        DutyExchange.FacultyInfo exchangedWith = new DutyExchange.FacultyInfo();
        exchangedWith.setName("anurag");
        exchangedWith.setEmail("anurag@example.com");
        exchangedWith.setDutyType("SEE");
        exchangedWith.setDate("03-02-2026");
        exchangedWith.setFacultySignature(base64Image);
        exchangedWith.setHodSignature(base64Image);

        exchange.setAllotted(allotted);
        exchange.setExchangedWith(exchangedWith);

        byte[] pdfBytes = service.generateDutyExchangePdf(exchange);

        if (pdfBytes != null) {
            try (FileOutputStream fos = new FileOutputStream("test-duty-exchange-see.pdf")) {
                fos.write(pdfBytes);
                System.out.println("PDF generated successfully: test-duty-exchange-see.pdf");
            }
        } else {
            System.err.println("Failed to generate PDF");
        }
    }
}
