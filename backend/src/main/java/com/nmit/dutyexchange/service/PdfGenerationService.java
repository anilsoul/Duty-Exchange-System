package com.nmit.dutyexchange.service;

import com.itextpdf.kernel.colors.DeviceGray;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.nmit.dutyexchange.model.DutyExchange;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfGenerationService {

        public byte[] generateDutyExchangePdf(DutyExchange exchange) {
                ByteArrayOutputStream out = new ByteArrayOutputStream();

                try {
                        PdfWriter writer = new PdfWriter(out);
                        PdfDocument pdf = new PdfDocument(writer);
                        Document document = new Document(pdf);

                        // Create a table with 4 columns
                        // Column widths: Label 1, Value 1, Label 2, Value 2
                        // We can adjust relative widths, e.g., {2, 3, 2, 3}
                        float[] columnWidths = { 2, 3, 2, 3 };
                        Table table = new Table(UnitValue.createPercentArray(columnWidths));
                        table.setWidth(UnitValue.createPercentValue(100));

                        // --- Header Rows ---

                        // Row 1: NMIT, BENGALURU
                        Cell header1 = new Cell(1, 4)
                                        .add(new Paragraph("NMIT, BENGALURU"))
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setBold()
                                        .setBackgroundColor(DeviceGray.WHITE) // Or a light gray if desired
                                        .setFontSize(14);
                        table.addHeaderCell(header1);

                        // Row 2: Dynamic Header Based on Duty Type
                        String dutyType = exchange.getAllotted() != null ? exchange.getAllotted().getDutyType() : "";
                        String headerText = "MSE DUTY EXCHANGE FORM"; // Default
                        if ("SEE".equalsIgnoreCase(dutyType)) {
                                headerText = "SEE DUTY EXCHANGE FORM";
                        } else if ("MSE".equalsIgnoreCase(dutyType)) {
                                headerText = "MSE DUTY EXCHANGE FORM";
                        }

                        Cell header2 = new Cell(1, 4)
                                        .add(new Paragraph(headerText))
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setBold()
                                        .setBackgroundColor(new DeviceGray(0.9f))
                                        .setFontSize(12);
                        table.addHeaderCell(header2);

                        // Row 3: ALLOTTED DUTY | DUTY EXCHANGED WITH
                        Cell subHeader1 = new Cell(1, 2)
                                        .add(new Paragraph("ALLOTTED DUTY"))
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setBold()
                                        .setBackgroundColor(new DeviceGray(0.9f));
                        table.addHeaderCell(subHeader1);

                        Cell subHeader2 = new Cell(1, 2)
                                        .add(new Paragraph("DUTY EXCHANGED WITH"))
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setBold()
                                        .setBackgroundColor(new DeviceGray(0.9f));
                        table.addHeaderCell(subHeader2);

                        // --- Data Rows ---
                        // Helper to add a row: Label1, Value1, Label2, Value2
                        addTwoFieldRow(table, "Name of the Faculty", exchange.getAllotted().getName(),
                                        "Name of the Faculty", exchange.getExchangedWith().getName());

                        if ("SEE".equalsIgnoreCase(dutyType)) {
                                addTwoFieldRow(table, "Department", exchange.getAllotted().getDepartment(),
                                                "Department", exchange.getExchangedWith().getDepartment());
                        }

                        addTwoFieldRow(table, "Type of Duty", exchange.getAllotted().getDutyType(),
                                        "Type of Duty", exchange.getExchangedWith().getDutyType());

                        addTwoFieldRow(table, "Date of Exchange", exchange.getAllotted().getDate(),
                                        "Date of Exchange", exchange.getExchangedWith().getDate());

                        // Signature Rows (Text for now, or checks if signature string is present)

                        addTwoFieldRow(table, "Signature of the HOD", "",
                                        "Signature of the HOD", "");

                        if (!"MSE".equalsIgnoreCase(dutyType)) {
                                addTwoFieldRow(table, "Signature of the CEO", "",
                                                "Signature of the CEO", "");
                        }

                        document.add(table);
                        document.close();
                } catch (Exception e) {
                        e.printStackTrace();
                        return null;
                }

                return out.toByteArray();
        }

        private void addTwoFieldRow(Table table, String label1, String value1, String label2, String value2) {
                table.addCell(new Cell().add(new Paragraph(label1)).setBold());
                table.addCell(createValueCell(value1));

                table.addCell(new Cell().add(new Paragraph(label2)).setBold());
                table.addCell(createValueCell(value2));
        }

        private Cell createValueCell(String value) {
                Cell cell = new Cell();
                if (value != null && value.startsWith("data:image/")) {
                        try {
                                // Extract base64 data
                                String base64Image = value.split(",")[1];
                                byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Image);
                                com.itextpdf.io.image.ImageData imageData = com.itextpdf.io.image.ImageDataFactory
                                                .create(imageBytes);
                                com.itextpdf.layout.element.Image image = new com.itextpdf.layout.element.Image(
                                                imageData);

                                // Scale image to fit reasonably
                                image.setAutoScale(true);
                                image.setMaxHeight(50); // Limit height to avoid blowing up the row

                                cell.add(image);
                        } catch (Exception e) {
                                // Fallback to text if image processing fails
                                cell.add(new Paragraph(value));
                        }
                } else {
                        cell.add(new Paragraph(value != null ? value : ""));
                }
                return cell;
        }
}
