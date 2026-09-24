
package com.kesproject.backend;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

@Service
public class CertificateService {

    // PDFBox 3.x compatible fonts
    private static final PDType1Font TIMES_BOLD =
            new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD);

    private static final PDType1Font TIMES_ROMAN =
            new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN);

    private static final PDType1Font COURIER =
            new PDType1Font(Standard14Fonts.FontName.COURIER);

    public byte[] generateCertificatePDF(DocumentRequest request, String verificationCode) throws Exception {

        PDDocument document = new PDDocument();

        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);

        float pageWidth = page.getMediaBox().getWidth();
        float pageHeight = page.getMediaBox().getHeight();

        PDPageContentStream contentStream =
                new PDPageContentStream(document, page);

        try {

            // =========================================================
            // BACKGROUND
            // =========================================================

            contentStream.setNonStrokingColor(0.95f, 0.97f, 1.0f);
            fillRectangle(
                    contentStream,
                    0,
                    0,
                    pageWidth,
                    pageHeight
            );

            // =========================================================
            // TOP BLUE BAR
            // =========================================================

            contentStream.setNonStrokingColor(0.1f, 0.3f, 0.7f);

            fillRectangle(
                    contentStream,
                    0,
                    pageHeight - 60,
                    pageWidth,
                    60
            );

            // =========================================================
            // BOTTOM GOLD BAR
            // =========================================================

            contentStream.setNonStrokingColor(1.0f, 0.84f, 0.0f);

            fillRectangle(
                    contentStream,
                    0,
                    0,
                    pageWidth,
                    30
            );

            // =========================================================
            // OUTER GOLD BORDER
            // =========================================================

            contentStream.setStrokingColor(1.0f, 0.84f, 0.0f);
            contentStream.setLineWidth(3);

            contentStream.addRect(
                    20,
                    40,
                    pageWidth - 40,
                    pageHeight - 100
            );

            contentStream.stroke();

            // =========================================================
            // INNER GOLD BORDER
            // =========================================================

            contentStream.setStrokingColor(1.0f, 0.92f, 0.5f);
            contentStream.setLineWidth(1);

            contentStream.addRect(
                    30,
                    50,
                    pageWidth - 60,
                    pageHeight - 120
            );

            contentStream.stroke();

            // =========================================================
            // COLLEGE NAME
            // =========================================================

            float collegeFontSize = 32;

            contentStream.setFont(TIMES_BOLD, collegeFontSize);
            contentStream.setNonStrokingColor(
                    1.0f,
                    1.0f,
                    1.0f
            );

            String collegeName = "KES SHROFF COLLEGE";

            float collegeWidth =
                    TIMES_BOLD.getStringWidth(collegeName)
                            / 1000
                            * collegeFontSize;

            contentStream.beginText();

            contentStream.newLineAtOffset(
                    (pageWidth - collegeWidth) / 2,
                    pageHeight - 45
            );

            contentStream.showText(collegeName);

            contentStream.endText();

            // =========================================================
            // DIVIDER
            // =========================================================

            contentStream.setStrokingColor(1.0f, 0.84f, 0.0f);
            contentStream.setLineWidth(2);

            contentStream.moveTo(
                    80,
                    pageHeight - 80
            );

            contentStream.lineTo(
                    pageWidth - 80,
                    pageHeight - 80
            );

            contentStream.stroke();

            // =========================================================
            // CERTIFICATE TITLE
            // =========================================================

            float titleFontSize = 28;

            contentStream.setFont(TIMES_BOLD, titleFontSize);

            contentStream.setNonStrokingColor(
                    0.1f,
                    0.3f,
                    0.7f
            );

            String certTitle =
                    "CERTIFICATE OF AUTHENTICATION";

            float titleWidth =
                    TIMES_BOLD.getStringWidth(certTitle)
                            / 1000
                            * titleFontSize;

            contentStream.beginText();

            contentStream.newLineAtOffset(
                    (pageWidth - titleWidth) / 2,
                    pageHeight - 130
            );

            contentStream.showText(certTitle);

            contentStream.endText();

            // =========================================================
            // SUBTITLE
            // =========================================================

            float subtitleFontSize = 12;

            contentStream.setFont(
                    TIMES_ROMAN,
                    subtitleFontSize
            );

            contentStream.setNonStrokingColor(
                    0.4f,
                    0.4f,
                    0.4f
            );

            String subtitle =
                    "Certified Document Verification";

            float subtitleWidth =
                    TIMES_ROMAN.getStringWidth(subtitle)
                            / 1000
                            * subtitleFontSize;

            contentStream.beginText();

            contentStream.newLineAtOffset(
                    (pageWidth - subtitleWidth) / 2,
                    pageHeight - 150
            );

            contentStream.showText(subtitle);

            contentStream.endText();

            // =========================================================
            // MAIN TEXT
            // =========================================================

            contentStream.setFont(
                    TIMES_ROMAN,
                    13
            );

            contentStream.setNonStrokingColor(
                    0.2f,
                    0.2f,
                    0.2f
            );

            drawText(
                    contentStream,
                    "This is to certify that the document issued to the student is",
                    100,
                    pageHeight - 200
            );

            drawText(
                    contentStream,
                    "authentic and has been officially verified and approved by",
                    100,
                    pageHeight - 225
            );

            drawText(
                    contentStream,
                    "KES SHROFF COLLEGE, Mumbai.",
                    100,
                    pageHeight - 250
            );

            // =========================================================
            // DETAILS BOX BACKGROUND
            // =========================================================

            contentStream.setNonStrokingColor(
                    0.95f,
                    0.95f,
                    1.0f
            );

            fillRectangle(
                    contentStream,
                    60,
                    pageHeight - 410,
                    pageWidth - 120,
                    130
            );

            // =========================================================
            // DETAILS BORDER
            // =========================================================

            contentStream.setStrokingColor(
                    0.1f,
                    0.3f,
                    0.7f
            );

            contentStream.setLineWidth(1);

            contentStream.addRect(
                    60,
                    pageHeight - 410,
                    pageWidth - 120,
                    130
            );

            contentStream.stroke();

            // =========================================================
            // DOCUMENT DETAILS TITLE
            // =========================================================

            contentStream.setFont(
                    TIMES_BOLD,
                    11
            );

            contentStream.setNonStrokingColor(
                    0.1f,
                    0.3f,
                    0.7f
            );

            drawText(
                    contentStream,
                    "DOCUMENT DETAILS:",
                    80,
                    pageHeight - 300
            );

            // =========================================================
            // DOCUMENT DETAILS
            // =========================================================

            contentStream.setFont(
                    TIMES_ROMAN,
                    10
            );

            contentStream.setNonStrokingColor(
                    0.2f,
                    0.2f,
                    0.2f
            );

            drawText(
                    contentStream,
                    "Student ID: " + request.getStudentId(),
                    80,
                    pageHeight - 320
            );

            drawText(
                    contentStream,
                    "Request ID: " + request.getRequestId(),
                    300,
                    pageHeight - 320
            );

            drawText(
                    contentStream,
                    "Document Type: " + request.getDocumentType(),
                    80,
                    pageHeight - 340
            );

            drawText(
                    contentStream,
                    "Issued Date: " + LocalDate.now(),
                    300,
                    pageHeight - 340
            );

            drawText(
                    contentStream,
                    "Status: APPROVED",
                    80,
                    pageHeight - 360
            );

            // =========================================================
            // VERIFICATION SECTION
            // =========================================================

            contentStream.setNonStrokingColor(
                    1.0f,
                    0.98f,
                    0.9f
            );

            fillRectangle(
                    contentStream,
                    60,
                    pageHeight - 500,
                    pageWidth - 120,
                    70
            );

            contentStream.setStrokingColor(
                    1.0f,
                    0.84f,
                    0.0f
            );

            contentStream.setLineWidth(1);

            contentStream.addRect(
                    60,
                    pageHeight - 500,
                    pageWidth - 120,
                    70
            );

            contentStream.stroke();

            // =========================================================
            // VERIFICATION CODE
            // =========================================================

            contentStream.setFont(
                    TIMES_BOLD,
                    11
            );

            contentStream.setNonStrokingColor(
                    0.6f,
                    0.4f,
                    0.0f
            );

            drawText(
                    contentStream,
                    "VERIFICATION CODE:",
                    80,
                    pageHeight - 430
            );

            contentStream.setFont(
                    COURIER,
                    10
            );

            contentStream.setNonStrokingColor(
                    0.1f,
                    0.3f,
                    0.7f
            );

            drawText(
                    contentStream,
                    verificationCode,
                    80,
                    pageHeight - 450
            );

            // =========================================================
            // VERIFICATION URL
            // =========================================================

            contentStream.setFont(
                    TIMES_ROMAN,
                    7
            );

            contentStream.setNonStrokingColor(
                    0.4f,
                    0.4f,
                    0.4f
            );

            String verificationUrl =
                    "Verify: https://murky-rimmed-legend.ngrok-free.dev/api/verify/"
                            + verificationCode;

            drawText(
                    contentStream,
                    verificationUrl,
                    80,
                    pageHeight - 465
            );

            // =========================================================
            // FOOTER
            // =========================================================

            contentStream.setFont(
                    TIMES_ROMAN,
                    9
            );

            contentStream.setNonStrokingColor(
                    0.5f,
                    0.5f,
                    0.5f
            );

            drawText(
                    contentStream,
                    "This document is digitally certified and verified by KES SHROFF COLLEGE",
                    100,
                    80
            );

            drawText(
                    contentStream,
                    "Certificate ID: "
                            + request.getRequestId()
                            + " | Verification Timestamp: "
                            + LocalDate.now(),
                    100,
                    60
            );

            // =========================================================
            // DECORATIVE CIRCLES
            // =========================================================

            contentStream.setStrokingColor(
                    1.0f,
                    0.84f,
                    0.0f
            );

            contentStream.setLineWidth(2);

            drawCircle(
                    contentStream,
                    pageWidth - 100,
                    100,
                    15
            );

            drawCircle(
                    contentStream,
                    100,
                    100,
                    15
            );

        } finally {

            contentStream.close();
        }

        // =============================================================
        // SAVE PDF
        // =============================================================

        ByteArrayOutputStream baos =
                new ByteArrayOutputStream();

        document.save(baos);
        document.close();

        return baos.toByteArray();
    }

    // =============================================================
    // HELPER: FILL RECTANGLE
    // PDFBox 3.x does not have fillRect()
    // =============================================================

    private void fillRectangle(
            PDPageContentStream contentStream,
            float x,
            float y,
            float width,
            float height
    ) throws Exception {

        contentStream.addRect(
                x,
                y,
                width,
                height
        );

        contentStream.fill();
    }

    // =============================================================
    // HELPER: DRAW TEXT
    // =============================================================

    private void drawText(
            PDPageContentStream contentStream,
            String text,
            float x,
            float y
    ) throws Exception {

        contentStream.beginText();

        contentStream.newLineAtOffset(x, y);

        contentStream.showText(text);

        contentStream.endText();
    }

    // =============================================================
    // HELPER: DRAW CIRCLE
    // =============================================================

    private void drawCircle(
            PDPageContentStream contentStream,
            float x,
            float y,
            float radius
    ) throws Exception {

        float k = 0.552284749831f;

        contentStream.moveTo(
                x - radius,
                y
        );

        contentStream.curveTo(
                x - radius,
                y + k * radius,
                x - k * radius,
                y + radius,
                x,
                y + radius
        );

        contentStream.curveTo(
                x + k * radius,
                y + radius,
                x + radius,
                y + k * radius,
                x + radius,
                y
        );

        contentStream.curveTo(
                x + radius,
                y - k * radius,
                x + k * radius,
                y - radius,
                x,
                y - radius
        );

        contentStream.curveTo(
                x - k * radius,
                y - radius,
                x - radius,
                y - k * radius,
                x - radius,
                y
        );

        contentStream.stroke();
    }
}

