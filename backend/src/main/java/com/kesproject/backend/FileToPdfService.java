package com.kesproject.backend;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class FileToPdfService {

    // Koi bhi supported file ko PDF bytes mein badalta hai
    public byte[] convertToPdf(MultipartFile file) throws Exception {
        byte[] bytes = file.getBytes();
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String ext = extensionOf(name);

        if (ext.equals("pdf")) {
            if (bytes.length < 4 || bytes[0] != '%' || bytes[1] != 'P'
                    || bytes[2] != 'D' || bytes[3] != 'F') {
                throw new IllegalArgumentException("This is not a valid PDF file.");
            }
            return bytes;
        }

        if (ext.equals("jpg") || ext.equals("jpeg") || ext.equals("png")
                || ext.equals("gif") || ext.equals("bmp")) {
            return imageToPdf(bytes, name);
        }

        if (ext.equals("txt")) {
            return textToPdf(bytes);
        }

        throw new IllegalArgumentException(
                "Unsupported file type. Allowed: PDF, JPG, PNG, GIF, BMP, TXT. "
                        + "For Word or Excel files, use Save as PDF first.");
    }

    public String extensionOf(String name) {
        int dot = name.lastIndexOf('.');
        if (dot < 0 || dot == name.length() - 1) {
            return "";
        }
        return name.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    // ---------------- IMAGE -> PDF ----------------

    private byte[] imageToPdf(byte[] bytes, String name) throws Exception {
        try (PDDocument doc = new PDDocument()) {
            PDImageXObject img = PDImageXObject.createFromByteArray(doc, bytes, name);

            PDRectangle a4 = PDRectangle.A4;
            PDPage page = new PDPage(a4);
            doc.addPage(page);

            float margin = 36;
            float maxW = a4.getWidth() - 2 * margin;
            float maxH = a4.getHeight() - 2 * margin;
            float scale = Math.min(maxW / img.getWidth(), maxH / img.getHeight());

            float w = img.getWidth() * scale;
            float h = img.getHeight() * scale;
            float x = (a4.getWidth() - w) / 2;
            float y = (a4.getHeight() - h) / 2;

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.drawImage(img, x, y, w, h);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    // ---------------- TEXT -> PDF ----------------

    private byte[] textToPdf(byte[] bytes) throws Exception {
        String text = new String(bytes, StandardCharsets.UTF_8);

        PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        float size = 11;
        float leading = 15;
        float margin = 50;
        PDRectangle box = PDRectangle.A4;
        float maxWidth = box.getWidth() - 2 * margin;

        List<String> lines = new ArrayList<>();
        for (String raw : text.split("\\r?\\n", -1)) {
            lines.addAll(wrap(sanitize(raw), font, size, maxWidth));
        }

        try (PDDocument doc = new PDDocument()) {
            PDPageContentStream cs = null;
            float y = 0;

            try {
                for (String line : lines) {
                    if (cs == null || y < margin) {
                        if (cs != null) {
                            cs.close();
                        }
                        PDPage page = new PDPage(box);
                        doc.addPage(page);
                        cs = new PDPageContentStream(doc, page);
                        cs.setFont(font, size);
                        y = box.getHeight() - margin;
                    }
                    cs.beginText();
                    cs.newLineAtOffset(margin, y);
                    cs.showText(line);
                    cs.endText();
                    y -= leading;
                }
            } finally {
                if (cs != null) {
                    cs.close();
                }
            }

            if (doc.getNumberOfPages() == 0) {
                doc.addPage(new PDPage(box));
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    // Standard font sirf simple characters dikha sakta hai
    private String sanitize(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '\t') {
                sb.append("    ");
            } else if (c >= 32 && c <= 126) {
                sb.append(c);
            } else {
                sb.append('?');
            }
        }
        return sb.toString();
    }

    private List<String> wrap(String line, PDType1Font font, float size, float maxWidth)
            throws Exception {
        List<String> out = new ArrayList<>();

        if (line.isEmpty()) {
            out.add("");
            return out;
        }

        StringBuilder cur = new StringBuilder();

        for (String word : line.split(" ", -1)) {
            // bahut lambe shabd ko tukdon mein todo
            while (width(word, font, size) > maxWidth && word.length() > 1) {
                int cut = word.length() - 1;
                while (cut > 1 && width(word.substring(0, cut), font, size) > maxWidth) {
                    cut--;
                }
                if (cur.length() > 0) {
                    out.add(cur.toString());
                    cur = new StringBuilder();
                }
                out.add(word.substring(0, cut));
                word = word.substring(cut);
            }

            String test = cur.length() == 0 ? word : cur + " " + word;

            if (width(test, font, size) > maxWidth && cur.length() > 0) {
                out.add(cur.toString());
                cur = new StringBuilder(word);
            } else {
                cur = new StringBuilder(test);
            }
        }

        out.add(cur.toString());
        return out;
    }

    private float width(String s, PDType1Font font, float size) throws Exception {
        return font.getStringWidth(s) / 1000 * size;
    }
}