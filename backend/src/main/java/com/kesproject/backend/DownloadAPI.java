package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Element;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/download")
@CrossOrigin("*")
public class DownloadAPI {

    @GetMapping("/document/{requestId}/{documentType}")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable String requestId,
            @PathVariable String documentType) {

        try {

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, outputStream);

            document.open();

            Font collegeFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    20,
                    Font.BOLD
            );

            Paragraph collegeName =
                    new Paragraph("KES SHROFF COLLEGE", collegeFont);

            collegeName.setAlignment(Element.ALIGN_CENTER);

            document.add(collegeName);

            Font titleFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    16,
                    Font.BOLD
            );

            Paragraph title =
                    new Paragraph("OFFICIAL DOCUMENT", titleFont);

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            document.add(new Paragraph(" "));

            Font headingFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    12,
                    Font.BOLD
            );

            Font normalFont = FontFactory.getFont(
                    FontFactory.HELVETICA,
                    11,
                    Font.NORMAL
            );

            document.add(
                    new Paragraph("DOCUMENT DETAILS", headingFont)
            );

            document.add(
                    new Paragraph(
                            "Request ID: " + requestId,
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Document Type: " + documentType,
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Issued Date: " + LocalDate.now(),
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Status: APPROVED",
                            normalFont
                    )
            );

            document.add(new Paragraph(" "));

            document.add(
                    new Paragraph(
                            "STUDENT INFORMATION",
                            headingFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Enrollment: AP0757258",
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Name: Aaditi Kiritbhai Patel",
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Department: Information Technology",
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Semester: V",
                            normalFont
                    )
            );

            document.add(new Paragraph(" "));

            document.add(
                    new Paragraph(
                            "DOCUMENT INFORMATION",
                            headingFont
                    )
            );

            if (documentType.contains("Bonafide")) {

                document.add(
                        new Paragraph(
                                "This is to certify that the student mentioned above "
                                + "is a bonafide student of KES Shroff College.",
                                normalFont
                        )
                );

            } else if (documentType.contains("Transcript")) {

                document.add(
                        new Paragraph(
                                "Academic Performance Record",
                                headingFont
                        )
                );

                document.add(
                        new Paragraph(
                                "Semester I: 8.5",
                                normalFont
                        )
                );

                document.add(
                        new Paragraph(
                                "Semester II: 8.7",
                                normalFont
                        )
                );

                document.add(
                        new Paragraph(
                                "Semester III: 8.9",
                                normalFont
                        )
                );

                document.add(
                        new Paragraph(
                                "Semester IV: 9.1",
                                normalFont
                        )
                );

            } else if (documentType.contains("Character")) {

                document.add(
                        new Paragraph(
                                "This is to certify that the student is of good "
                                + "moral character and conduct.",
                                normalFont
                        )
                );

            } else if (documentType.contains("Marksheet")) {

                document.add(
                        new Paragraph(
                                "12th Standard Marksheet",
                                headingFont
                        )
                );

                document.add(
                        new Paragraph(
                                "Obtained Marks: 480/500",
                                normalFont
                        )
                );

                document.add(
                        new Paragraph(
                                "Percentage: 96%",
                                normalFont
                        )
                );

            } else if (documentType.contains("Leaving")) {

                document.add(
                        new Paragraph(
                                "Leaving Certificate",
                                headingFont
                        )
                );

                document.add(
                        new Paragraph(
                                "This certifies that the student has left the institution.",
                                normalFont
                        )
                );

            } else {

                document.add(
                        new Paragraph(
                                "This document has been officially approved "
                                + "by KES Shroff College.",
                                normalFont
                        )
                );
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            document.add(
                    new Paragraph(
                            "Digitally Signed by KES SHROFF COLLEGE",
                            headingFont
                    )
            );

            document.add(
                    new Paragraph(
                            "This document is securely generated.",
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Status: VERIFIED / APPROVED",
                            normalFont
                    )
            );

            document.close();

            byte[] pdfContent =
                    outputStream.toByteArray();

            String filename =
                    requestId + "_" +
                    documentType.replace(" ", "_") +
                    ".pdf";

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_PDF
            );

            headers.setContentDispositionFormData(
                    "attachment",
                    filename
            );

            headers.setContentLength(
                    pdfContent.length
            );

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfContent);

        } catch (DocumentException e) {

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}